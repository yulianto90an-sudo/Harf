'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';
import { XP_BATTLE_WIN, XP_BATTLE_LOSE } from '@/constants/game';

function ConfettiPiece({ index }: { index: number }) {
  const colors = ['bg-emerald-400', 'bg-gold-400', 'bg-gold-300', 'bg-emerald-300', 'bg-white/60', 'bg-error/50'];
  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: (Math.random() - 0.5) * 200,
        y: -(40 + Math.random() * 160),
        rotate: Math.random() * 360,
        scale: [0, 1, 0.5, 0],
      }}
      transition={{ duration: 1.5 + Math.random() * 1, delay: Math.random() * 0.5, ease: 'easeOut' }}
      className={cn('absolute w-2.5 h-2.5 rounded-sm', colors[index % colors.length])}
    />
  );
}

export function BattleResult() {
  const showResult = useBattleStore((s) => s.showResult);
  const phase = useBattleStore((s) => s.phase);
  const xpEarned = useBattleStore((s) => s.xpEarned);
  const maxCombo = useBattleStore((s) => s.maxCombo);
  const correctCount = useBattleStore((s) => s.correctCount);
  const wrongCount = useBattleStore((s) => s.wrongCount);
  const enemy = useBattleStore((s) => s.enemy);
  const closeResult = useBattleStore((s) => s.closeResult);

  const isVictory = phase === 'victory';
  const total = correctCount + wrongCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <AnimatePresence>
      {showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={springPresets.gentle}
            className="relative w-full max-w-sm mx-4 rounded-2xl bg-gradient-to-b from-bg-elevated to-bg-card border border-white/[0.04] overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 25 }).map((_, i) => (
                <ConfettiPiece key={i} index={i} />
              ))}
            </div>

            <div className="relative z-10 p-6 pt-10">
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springPresets.bouncy, delay: 0.2 }}
                  className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mb-4',
                    isVictory
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-br from-error to-error/80 shadow-lg shadow-error/30',
                  )}
                >
                  {enemy ? (
                    <span className="text-3xl">{enemy.emoji}</span>
                  ) : (
                    <span className="text-3xl">{isVictory ? '🏆' : '💔'}</span>
                  )}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-display-2 text-text-primary font-extrabold"
                >
                  {isVictory ? 'VICTORY!' : 'DEFEAT'}
                </motion.h2>
                {enemy && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-micro text-text-tertiary mt-1"
                  >
                    vs {enemy.name}
                  </motion.p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-5"
              >
                <ResultCard value={`+${xpEarned}`} label="XP" accent="emerald" delay={0.45} />
                <ResultCard value={`${isVictory ? XP_BATTLE_WIN : XP_BATTLE_LOSE}`} label="Bonus" accent={isVictory ? 'gold' : 'text'} delay={0.5} />
                <ResultCard value={`${accuracy}%`} label="Akurasi" accent={accuracy >= 80 ? 'emerald' : 'gold'} delay={0.55} />
                <ResultCard value={`x${maxCombo}`} label="Combo Terbaik" accent="gold" delay={0.6} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex items-center justify-center gap-1.5 mb-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: total }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-2 h-2 rounded-full',
                        i < correctCount ? 'bg-emerald-500' : 'bg-error/50',
                      )}
                    />
                  ))}
                </div>
                <span className="text-micro text-text-tertiary ml-1">
                  {correctCount}/{total} benar
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-2.5"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={springPresets.snappy}
                  onClick={closeResult}
                  className="w-full py-3.5 bg-emerald-500 rounded-xl text-text-primary font-bold text-label shadow-lg shadow-emerald-500/30"
                >
                  {isVictory ? 'Battle Lagi' : 'Coba Lagi'}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={springPresets.snappy}
                  className="w-full py-3 bg-white/5 rounded-xl text-text-secondary font-semibold text-label border border-white/5"
                >
                  Bagikan Hasil
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResultCard({
  value, label, accent, delay,
}: {
  value: string; label: string; accent: 'emerald' | 'gold' | 'text'; delay: number;
}) {
  const accentColors = {
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/15 text-emerald-400',
    gold: 'from-gold-400/10 to-gold-500/5 border-gold-400/15 text-gold-400',
    text: 'from-white/5 to-white/5 border-white/10 text-text-secondary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, ...springPresets.gentle }}
      className={cn('rounded-xl p-3.5 border bg-gradient-to-br text-center', accentColors[accent])}
    >
      <p className="text-body-bold font-extrabold">{value}</p>
      <p className="text-micro text-text-tertiary mt-0.5">{label}</p>
    </motion.div>
  );
}
