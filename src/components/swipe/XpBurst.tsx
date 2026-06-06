'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeStore } from '@/stores/swipeStore';
import { springPresets } from '@/animations/presets';

function Particle({ index }: { index: number }) {
  const angle = (index / 8) * Math.PI * 2;
  const distance = 40 + Math.random() * 40;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: 0,
        scale: 0,
        x,
        y,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 + Math.random() * 0.3, ease: 'easeOut' }}
      className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
    />
  );
}

export function XpBurst() {
  const answerState = useSwipeStore((s) => s.answerState);
  const lastXpGain = useSwipeStore((s) => s.lastXpGain);
  const show = answerState === 'correct';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
        >
          <div className="relative">
            {Array.from({ length: 8 }).map((_, i) => (
              <Particle key={i} index={i} />
            ))}
            <motion.div
              key={lastXpGain}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -60, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute -top-4 -left-6 text-xp-value font-extrabold text-emerald-400"
            >
              +{lastXpGain}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
