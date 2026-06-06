'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';

export function BattleCombo() {
  const combo = useBattleStore((s) => s.combo);
  const phase = useBattleStore((s) => s.phase);

  if (combo < 2 || phase !== 'active') return null;

  const isHigh = combo >= 8;
  const isMid = combo >= 5;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={combo}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={springPresets.bouncy}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full border',
          isHigh && 'bg-gold-400/15 border-gold-400/30 shadow-glow-combo',
          isMid && !isHigh && 'bg-gold-400/10 border-gold-400/20 shadow-glow-gold',
          !isMid && 'bg-emerald-500/10 border-emerald-500/20',
        )}
      >
        <span className="text-sm">{isHigh ? '🔥' : isMid ? '⚡' : '💥'}</span>
        <span className={cn(
          'text-label font-extrabold',
          isHigh ? 'text-gold-400' : isMid ? 'text-gold-400' : 'text-emerald-400',
        )}>
          x{combo}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
