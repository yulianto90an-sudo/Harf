'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { springPresets } from '@/animations/presets';
import { useProfileStore } from '@/stores/profileStore';
import { useRoadmapStore } from '@/stores/roadmapStore';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroProgressCard } from '@/components/home/HeroProgressCard';
import { WorldSection } from './WorldSection';
import { CompletionOverlay } from './CompletionOverlay';
import { WORLDS } from '@/data/roadmap';
import type { ChapterNode } from '@/data/roadmap';

export function WorldMap() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);

  const {
    completedIds,
    nodeProgress,
    currentWorldIndex,
    showCompletionOverlay,
    lastCompletionResult,
    navigateToNode,
    dismissCompletionOverlay,
  } = useRoadmapStore();

  const worldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const completedCount = completedIds.length;
  const totalNodes = WORLDS.reduce((acc, w) => acc + w.chapters.length, 0);

  // Scroll to current world on mount
  useEffect(() => {
    const currentWorld = WORLDS[currentWorldIndex];
    if (currentWorld && worldRefs.current[currentWorld.id]) {
      setTimeout(() => {
        worldRefs.current[currentWorld.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    }
  }, [currentWorldIndex]);

  const handleNodePress = useCallback(
    (node: ChapterNode) => {
      const nodeStatus = nodeProgress[node.id];
      if (!nodeStatus || nodeStatus.status === 'locked') return;
      const path = navigateToNode(node);
      router.push(path);
    },
    [nodeProgress, navigateToNode, router],
  );

  const handleContinue = useCallback(() => {
    dismissCompletionOverlay();
    if (lastCompletionResult?.unlockedNodeId) {
      const found = WORLDS.flatMap((w) => w.chapters).find(
        (c) => c.id === lastCompletionResult.unlockedNodeId,
      );
      if (found) {
        const path = navigateToNode(found);
        router.push(path);
      }
    }
  }, [dismissCompletionOverlay, lastCompletionResult, navigateToNode, router]);

  const handleBackToMap = useCallback(() => {
    dismissCompletionOverlay();
  }, [dismissCompletionOverlay]);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <HomeHeader />
      {profile && <HeroProgressCard />}

      {/* Progress bar */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-micro text-text-tertiary font-medium">Progress Roadmap</p>
          <p className="text-micro text-text-tertiary">
            {completedCount}/{totalNodes} selesai
          </p>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / Math.max(totalNodes, 1)) * 100}%` }}
            transition={{ ...springPresets.snappy }}
          />
        </div>
      </div>

      {/* Worlds */}
      <div className="flex flex-col gap-8">
        {WORLDS.map((world, index) => {
          const isCurrent = index === currentWorldIndex;
          const isPast = index < currentWorldIndex;
          const isFuture = index > currentWorldIndex;

          return (
            <div
              key={world.id}
              ref={(el) => { worldRefs.current[world.id] = el; }}
              className="scroll-mt-24"
            >
              <WorldSection
                world={world}
                isCurrent={isCurrent}
                isPast={isPast}
                isFuture={isFuture}
                completedIds={completedIds}
                nodeProgress={nodeProgress}
                onNodePress={handleNodePress}
              />
            </div>
          );
        })}
      </div>

      <div className="h-16" />

      {showCompletionOverlay && lastCompletionResult && (
        <CompletionOverlay
          result={lastCompletionResult}
          onContinue={handleContinue}
          onBackToMap={handleBackToMap}
        />
      )}
    </div>
  );
}
