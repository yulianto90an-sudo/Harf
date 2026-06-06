'use client';

import { motion } from 'framer-motion';
import { useBattleStore } from '@/stores/battleStore';

function Particle({ index }: { index: number }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: Math.random() * 400 - 200,
        y: Math.random() * 800,
        scale: 0,
      }}
      animate={{
        opacity: [0, 0.5, 0],
        y: [null, Math.random() * -200 - 100],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 6,
        repeat: Infinity,
        delay: Math.random() * 8,
        ease: 'easeInOut',
      }}
      className="absolute w-1 h-1 rounded-full bg-emerald-400/30"
    />
  );
}

export function ArenaBackground() {
  const phase = useBattleStore((s) => s.phase);

  if (phase === 'select') return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/95 to-bg-surface" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute -top-40 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-72 h-72 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
      </motion.div>

      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
