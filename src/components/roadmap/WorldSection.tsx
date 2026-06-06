'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets, tweenPresets } from '@/animations/presets';
import { MapNode } from './MapNode';
import type { World, ChapterNode, NodeProgress } from '@/data/roadmap';

interface WorldSectionProps {
  world: World;
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  completedIds: string[];
  nodeProgress: Record<string, NodeProgress>;
  onNodePress: (node: ChapterNode) => void;
}

export function WorldSection({
  world,
  isCurrent,
  isPast,
  isFuture,
  completedIds,
  nodeProgress,
  onNodePress,
}: WorldSectionProps) {
  const allCompleted = world.chapters.every((n) => completedIds.includes(n.id));
  const isDimmed = isFuture;

  const incompleteIndex = world.chapters.findIndex((n) => {
    const status = nodeProgress[n.id]?.status;
    return status === 'available' && !completedIds.includes(n.id);
  });
  const defaultExpanded = isFuture ? false : (isCurrent || incompleteIndex >= 0);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    if (!isFuture) setIsExpanded((v) => !v);
  }, [isFuture]);

  const completedHere = useMemo(
    () => world.chapters.filter((n) => completedIds.includes(n.id)).length,
    [world.chapters, completedIds],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle }}
      className={cn('relative', isDimmed && 'opacity-30')}
    >
      {/* World header */}
      <button
        onClick={toggle}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl p-4 text-left',
          'bg-gradient-to-br border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
          isDimmed
            ? 'from-white/5 to-white/[0.02] border-white/5 cursor-default'
            : isPast
              ? `${world.gradient} border-emerald-500/20 cursor-pointer`
              : isCurrent
                ? `${world.gradient} border-white/10 cursor-pointer`
                : `${world.gradient} border-white/5 cursor-pointer`,
        )}
      >
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-body-bold text-text-primary font-bold truncate">
                {world.title}
              </h2>
            </div>
            <p className="text-micro text-text-tertiary truncate">
              {world.subtitle}
            </p>
            {isCurrent && (
              <p className="text-[10px] text-text-tertiary/50 mt-1 line-clamp-1">
                {world.goal}
              </p>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {/* Lock */}
            {isFuture && (
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-white/30"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            )}

            {/* Progress + chevron */}
            {!isFuture && (
              <div className="flex items-center gap-1.5">
                {!allCompleted && (
                  <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {completedHere}/{world.chapters.length}
                    </span>
                  </div>
                )}
                {allCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springPresets.bouncy}
                    className="px-2.5 py-1 rounded-full bg-gold-400/10 border border-gold-400/20"
                  >
                    <span className="text-[10px] text-gold-400 font-semibold">
                      {world.chapters.length}/{world.chapters.length}
                    </span>
                  </motion.div>
                )}
                <motion.svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-text-tertiary shrink-0"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={springPresets.snappy}
                >
                  <polyline points="6 9 12 15 18 9" />
                </motion.svg>
              </div>
            )}
          </div>
        </div>

        {/* Locked world teaser */}
        {isFuture && (
          <div className="relative z-10 mt-3 pt-3 border-t border-white/5">
            <p className="text-[10px] text-text-tertiary/40">
              Buka kunci: {world.unlock_reward.description}
            </p>
          </div>
        )}
      </button>

      {/* Collapsible nodes */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key={`nodes-${world.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={tweenPresets.normal}
            className="overflow-hidden"
          >
            <div className="flex flex-col items-center gap-0 pt-2 pb-2">
              {world.chapters.map((node, index) => {
                const status = nodeProgress[node.id]?.status ?? 'locked';
                const isAvailable = status === 'available';
                const isCompleted = status === 'completed';

                return (
                  <MapNode
                    key={node.id}
                    node={node}
                    world={world}
                    isUnlocked={isAvailable}
                    isCompleted={isCompleted}
                    isFirst={index === 0}
                    isLast={index === world.chapters.length - 1}
                    stars={nodeProgress[node.id]?.stars ?? 0}
                    maxStars={node.max_stars}
                    isCurrentNode={status === 'available' && isCurrent && !completedIds.includes(node.id)}
                    onPress={onNodePress}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
