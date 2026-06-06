'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';

function ConfettiPiece({ index }: { index: number }) {
  const colors = ['bg-emerald-400', 'bg-gold-400', 'bg-gold-300', 'bg-emerald-300', 'bg-white/60'];
  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: (Math.random() - 0.5) * 160,
        y: -(30 + Math.random() * 120),
        rotate: Math.random() * 360,
        scale: [0, 1, 0.5, 0],
      }}
      transition={{ duration: 1.2 + Math.random() * 0.8, delay: Math.random() * 0.3, ease: 'easeOut' }}
      className={cn('absolute w-2 h-2 rounded-sm', colors[index % colors.length])}
    />
  );
}

export function RewardModal() {
  const showReward = useBattleStore((s) => s.showReward);
  const xpEarned = useBattleStore((s) => s.xpEarned);
  const combo = useBattleStore((s) => s.maxCombo);
  const correctCount = useBattleStore((s) => s.correctCount);
  const wrongCount = useBattleStore((s) => s.wrongCount);
  const finishBattle = useBattleStore((s) => s.finishBattle);
  const enemy = useBattleStore((s) => s.enemy);

  const total = correctCount + wrongCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={springPresets.gentle}
            className="relative mx-4 w-full max-w-sm rounded-2xl bg-gradient-to-b from-bg-elevated to-bg-card border border-white/[0.04] overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <ConfettiPiece key={i} index={i} />
              ))}
            </div>

            <div className="relative z-10 p-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...springPresets.bouncy, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/30"
              >
                {enemy && <span className="text-2xl">{enemy.emoji}</span>}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-heading-1 text-text-primary font-extrabold"
              >
                {correctCount > wrongCount ? 'Kemenangan!' : 'Bertahan!'}
              </motion.h2>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.35 }}
                className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"
              />

              <div className="grid grid-cols-3 gap-3 w-full mb-4">
                <StatBox value={`+${xpEarned}`} label="XP" delay={0.4} />
                <StatBox value={`${accuracy}%`} label="Akurasi" delay={0.45} />
                <StatBox value={`x${combo}`} label="Combo" delay={0.5} />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={springPresets.snappy}
                onClick={finishBattle}
                className="w-full py-3 bg-emerald-500 rounded-xl text-text-primary font-bold text-label shadow-lg shadow-emerald-500/30"
              >
                Lanjut
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBox({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, ...springPresets.gentle }}
      className="rounded-xl bg-white/5 border border-white/5 p-3 text-center"
    >
      <p className="text-body-bold font-extrabold text-emerald-400">{value}</p>
      <p className="text-micro text-text-tertiary mt-0.5">{label}</p>
    </motion.div>
  );
}
