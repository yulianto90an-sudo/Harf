import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChapterNode, NodeProgress, CompletionResult, WorldProgress } from '@/data/roadmap';
import { WORLDS, getAllNodes, getNextNode, getNodeStars, getNodeById } from '@/data/roadmap';

const WORLD_XP_MULTIPLIER = 1.5;

function computeNodeProgress(
  completedIds: string[],
  progressMap: Record<string, NodeProgress>,
): Record<string, NodeProgress> {
  const map = { ...progressMap };
  const all = getAllNodes();

  for (const node of all) {
    if (completedIds.includes(node.id)) {
      if (!map[node.id]) {
        map[node.id] = {
          nodeId: node.id,
          status: 'completed',
          xpEarned: node.xp_reward,
          stars: 3,
          completedAt: Date.now(),
          attempts: 1,
        };
      }
      continue;
    }

    const prevInWorld = getPrecedingNodeInSameWorld(node);
    const prevCompleted = prevInWorld ? completedIds.includes(prevInWorld.id) : true;

    if (prevCompleted) {
      if (!map[node.id] || map[node.id].status === 'locked') {
        map[node.id] = {
          nodeId: node.id,
          status: 'available',
          xpEarned: 0,
          stars: 0,
          completedAt: null,
          attempts: 0,
        };
      }
    } else {
      map[node.id] = {
        nodeId: node.id,
        status: 'locked',
        xpEarned: 0,
        stars: 0,
        completedAt: null,
        attempts: 0,
      };
    }
  }

  return map;
}

function getPrecedingNodeInSameWorld(node: ChapterNode): ChapterNode | null {
  for (const world of WORLDS) {
    const idx = world.chapters.findIndex((c) => c.id === node.id);
    if (idx > 0) return world.chapters[idx - 1];
    if (idx === 0) return null;
  }
  return null;
}

function computeWorldProgress(
  completedIds: string[],
): Record<string, WorldProgress> {
  const map: Record<string, WorldProgress> = {};
  for (const world of WORLDS) {
    const allNodeIds = world.chapters.map((c) => c.id);
    const allCompleted = allNodeIds.every((id) => completedIds.includes(id));
    map[world.id] = {
      worldId: world.id,
      completed: allCompleted,
      rewardClaimed: false,
    };
  }
  return map;
}

function computeTotalXp(progressMap: Record<string, NodeProgress>): number {
  return Object.values(progressMap).reduce((sum, p) => {
    if (p.status === 'completed') {
      return sum + p.xpEarned;
    }
    return sum;
  }, 0);
}

interface RoadmapState {
  completedIds: string[];
  nodeProgress: Record<string, NodeProgress>;
  worldProgress: Record<string, WorldProgress>;
  totalXp: number;
  currentWorldIndex: number;
  activeNodeId: string | null;
  showCompletionOverlay: boolean;
  lastCompletionResult: CompletionResult | null;

  getNodeStatus: (nodeId: string) => NodeProgress;
  completeNode: (nodeId: string, score?: number, maxScore?: number) => CompletionResult;
  claimWorldReward: (worldId: string) => void;
  dismissCompletionOverlay: () => void;
  navigateToNode: (node: ChapterNode) => string;
  getCurrentLessonId: () => string | null;
  recalculateProgress: () => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set, get) => ({
      completedIds: [],
      nodeProgress: {},
      worldProgress: {},
      totalXp: 0,
      currentWorldIndex: 0,
      activeNodeId: 'w1-c1',
      showCompletionOverlay: false,
      lastCompletionResult: null,

      getNodeStatus: (nodeId: string): NodeProgress => {
        const { nodeProgress, completedIds } = get();
        if (nodeProgress[nodeId]) return nodeProgress[nodeId];
        const all = getAllNodes();
        const node = all.find((n) => n.id === nodeId);
        if (!node) {
          return { nodeId, status: 'locked', xpEarned: 0, stars: 0, completedAt: null, attempts: 0 };
        }
        if (completedIds.includes(nodeId)) {
          return { nodeId, status: 'completed', xpEarned: node.xp_reward, stars: 3, completedAt: Date.now(), attempts: 1 };
        }
        const prev = getPrecedingNodeInSameWorld(node);
        const prevDone = prev ? completedIds.includes(prev.id) : true;
        if (prevDone) {
          return { nodeId, status: 'available', xpEarned: 0, stars: 0, completedAt: null, attempts: 0 };
        }
        return { nodeId, status: 'locked', xpEarned: 0, stars: 0, completedAt: null, attempts: 0 };
      },

      completeNode: (nodeId: string, score?: number, maxScore?: number): CompletionResult => {
        const state = get();
        if (state.completedIds.includes(nodeId)) {
          return state.lastCompletionResult ?? {
            nodeId, xpEarned: 0, stars: 3,
            unlockedNodeId: null, unlockedNodeTitle: null,
            worldCompleted: false, worldReward: null,
            isBoss: false, bossReward: null,
          };
        }

        const found = getNodeById(nodeId);
        if (!found) throw new Error(`Node ${nodeId} not found`);
        const { node, world } = found;
        const stars = score !== undefined && maxScore !== undefined
          ? getNodeStars(score, maxScore) : 3;
        const xpEarned = Math.round(node.xp_reward * (1 + (stars - 1) * 0.25));
        const isBoss = node.type === 'boss';

        const newCompletedIds = [...state.completedIds, nodeId];
        const nextNode = getNextNode(nodeId);

        const progress = computeNodeProgress(newCompletedIds, state.nodeProgress);
        const wProgress = computeWorldProgress(newCompletedIds);

        progress[nodeId] = {
          nodeId,
          status: 'completed',
          xpEarned,
          stars,
          completedAt: Date.now(),
          attempts: (state.nodeProgress[nodeId]?.attempts ?? 0) + 1,
        };

        const worldAllDone = world.chapters.every((c) => newCompletedIds.includes(c.id));
        const firstIncomplete = WORLDS.findIndex(
          (w) => !w.chapters.every((c) => newCompletedIds.includes(c.id)),
        );
        const newWorldIdx = firstIncomplete >= 0 ? firstIncomplete : WORLDS.length - 1;

        const result: CompletionResult = {
          nodeId,
          xpEarned,
          stars,
          unlockedNodeId: nextNode?.id ?? null,
          unlockedNodeTitle: nextNode?.title ?? null,
          worldCompleted: worldAllDone,
          worldReward: worldAllDone ? world.unlock_reward : null,
          isBoss,
          bossReward: isBoss ? world.boss.boss_reward : null,
        };

        set({
          completedIds: newCompletedIds,
          nodeProgress: progress,
          worldProgress: wProgress,
          totalXp: computeTotalXp(progress),
          currentWorldIndex: newWorldIdx >= 0 ? newWorldIdx : WORLDS.length - 1,
          activeNodeId: nextNode?.id ?? nodeId,
          showCompletionOverlay: true,
          lastCompletionResult: result,
        });

        return result;
      },

      claimWorldReward: (worldId: string) => {
        set((state) => ({
          worldProgress: {
            ...state.worldProgress,
            [worldId]: { ...state.worldProgress[worldId], rewardClaimed: true },
          },
        }));
      },

      dismissCompletionOverlay: () => {
        set({ showCompletionOverlay: false });
      },

      navigateToNode: (node: ChapterNode): string => {
        set({ activeNodeId: node.id });
        if (node.type === 'boss') return '/battle';
        if (node.type === 'review') return '/swipe';
        if (node.lesson_id) return `/swipe?lesson=${node.lesson_id}`;
        return '/swipe';
      },

      getCurrentLessonId: (): string | null => {
        const { activeNodeId } = get();
        if (!activeNodeId) return null;
        const found = getNodeById(activeNodeId);
        return found?.node.lesson_id ?? null;
      },

      recalculateProgress: () => {
        const { completedIds } = get();
        const progress = computeNodeProgress(completedIds, {});
        const wProgress = computeWorldProgress(completedIds);
        set({
          nodeProgress: progress,
          worldProgress: wProgress,
          totalXp: computeTotalXp(progress),
        });
      },
    }),
    {
      name: 'harf-roadmap',
      partialize: (state) => ({
        completedIds: state.completedIds,
        nodeProgress: state.nodeProgress,
        worldProgress: state.worldProgress,
        totalXp: state.totalXp,
        currentWorldIndex: state.currentWorldIndex,
        lastCompletionResult: state.lastCompletionResult,
      }),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<RoadmapState>) };
        const progress = computeNodeProgress(merged.completedIds, merged.nodeProgress);
        const wProgress = computeWorldProgress(merged.completedIds);
        merged.nodeProgress = progress;
        merged.worldProgress = wProgress;
        merged.totalXp = computeTotalXp(progress);
        merged.showCompletionOverlay = merged.lastCompletionResult !== null;
        return merged;
      },
    },
  ),
);
