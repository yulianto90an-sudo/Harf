'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets, tweenPresets } from '@/animations/presets';
import type { ChapterNode, World } from '@/data/roadmap';

interface MapNodeProps {
  node: ChapterNode;
  world: World;
  isUnlocked: boolean;
  isCompleted: boolean;
  isFirst: boolean;
  isLast: boolean;
  stars: number;
  maxStars: number;
  isCurrentNode: boolean;
  onPress: (node: ChapterNode) => void;
}

export function MapNode({
  node,
  world,
  isUnlocked,
  isCompleted,
  isFirst,
  isLast,
  stars,
  maxStars,
  isCurrentNode,
  onPress,
}: MapNodeProps) {
  const isBoss = node.type === 'boss';
  const isReview = node.type === 'review';
  const dimmed = !isUnlocked && !isCompleted;

  return (
    <div className="flex flex-col items-center relative">
      {/* Path line above */}
      {!isFirst && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 24 }}
          transition={tweenPresets.slow}
          className={cn(
            'w-0.5',
            isCompleted ? 'bg-emerald-500' : dimmed ? 'bg-white/5' : 'bg-emerald-500/30',
          )}
          style={{ height: '24px' }}
        />
      )}

      {/* Node circle */}
      <motion.button
        whileTap={isUnlocked || isCompleted ? { scale: 0.9 } : undefined}
        whileHover={isUnlocked ? { scale: 1.1 } : undefined}
        onClick={() => {
          if (isUnlocked || isCompleted) onPress(node);
        }}
        disabled={dimmed}
        transition={springPresets.snappy}
        className={cn(
          'relative z-10 flex items-center justify-center',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-full',
          isBoss ? 'w-16 h-16' : 'w-12 h-12',
          isCompleted
            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40 cursor-pointer'
            : isUnlocked
              ? cn(
                  'border-2 cursor-pointer bg-bg-elevated',
                  isBoss ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10' : 'border-emerald-500/40',
                )
              : 'bg-white/5 border-2 border-white/5 cursor-not-allowed',
        )}
        aria-label={`${node.title}${isCompleted ? ' (selesai)' : isUnlocked ? ' (tersedia)' : ' (terkunci)'}`}
      >
        {/* Glow for available/current */}
        {isCurrentNode && (
          <motion.span
            className="absolute inset-0 rounded-full bg-emerald-500/20"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {isCompleted ? (
          <motion.svg
            key={`check-${node.id}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        ) : (
          <span className={cn('text-sm', isBoss && 'text-lg', dimmed && 'opacity-30')}>
            <span className={cn('text-xs font-bold', isCompleted && 'text-white')}>
              {isBoss ? 'BOSS' : isReview ? 'REVIEW' : 'LATIHAN'}
            </span>
          </span>
        )}
      </motion.button>

      {/* Stars for completed */}
      {isCompleted && maxStars > 0 && (
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: maxStars }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 300, damping: 10 }}
              className={cn('text-[9px]', i < stars ? 'text-gold-400' : 'text-white/10')}
            >
              ★
            </motion.span>
          ))}
        </div>
      )}

      {/* Label */}
      <div className={cn('text-center mt-1', isBoss && 'mt-1.5')}>
        <p
          className={cn(
            'text-[11px] font-semibold leading-tight',
            isCompleted ? 'text-emerald-400' : dimmed ? 'text-white/20' : isCurrentNode ? 'text-emerald-300' : 'text-text-primary',
          )}
        >
          {node.title}
        </p>
        <p
          className={cn(
            'text-[9px] leading-tight',
            isCompleted ? 'text-emerald-400/60' : dimmed ? 'text-white/10' : 'text-text-tertiary',
          )}
        >
          {node.subtitle}
        </p>
        {node.type === 'lesson' && node.word_count > 0 && (
          <p className={cn('text-[8px] mt-0.5', dimmed ? 'text-white/10' : 'text-text-tertiary/50')}>
            {node.word_count} kata &middot; {node.xp_reward} XP
          </p>
        )}
        {dimmed && (
          <p className="text-[8px] text-white/15 mt-0.5 uppercase tracking-wider">terkunci</p>
        )}
      </div>

      {/* Path line below */}
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 24 }}
          transition={tweenPresets.slow}
          className={cn(
            'w-0.5',
            isCompleted ? 'bg-emerald-500' : dimmed ? 'bg-white/5' : 'bg-emerald-500/30',
          )}
          style={{ height: '24px' }}
        />
      )}
    </div>
  );
}
