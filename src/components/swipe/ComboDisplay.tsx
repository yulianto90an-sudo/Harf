'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useSwipeStore } from '@/stores/swipeStore';
import { springPresets } from '@/animations/presets';

export function ComboDisplay() {
  const combo = useSwipeStore((s) => s.combo);

  if (combo < 2) return null;

  const intensity = Math.min(combo / 10, 1);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={combo}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={springPresets.bouncy}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full',
          'border shadow-lg',
          combo >= 10
            ? 'bg-gold-400/15 border-gold-400/30 shadow-glow-combo'
            : combo >= 5
              ? 'bg-gold-400/10 border-gold-400/20 shadow-glow-gold'
              : 'bg-emerald-500/10 border-emerald-500/20 shadow-glow-emerald',
        )}
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="text-sm"
        >
          {combo >= 10 ? '🔥' : combo >= 5 ? '⚡' : '💥'}
        </motion.span>
        <span
          className={cn(
            'text-label font-extrabold tracking-wider',
            combo >= 10 ? 'text-gold-400' : combo >= 5 ? 'text-gold-400' : 'text-emerald-400',
          )}
        >
          x{combo} Combo
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
