'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useSwipeStore } from '@/stores/swipeStore';
import { springPresets } from '@/animations/presets';

export function SwipeFeedbackLayer() {
  const answerState = useSwipeStore((s) => s.answerState);
  const combo = useSwipeStore((s) => s.combo);
  const xpEarned = useSwipeStore((s) => s.xpEarned);
  const lastXpGain = useSwipeStore((s) => s.lastXpGain);

  const isCorrect = answerState === 'correct';
  const isWrong = answerState === 'incorrect';
  const show = isCorrect || isWrong;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={springPresets.bouncy}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              'px-6 py-3 rounded-2xl',
              isCorrect
                ? 'bg-emerald-500 shadow-xl shadow-emerald-500/40'
                : 'bg-error shadow-xl shadow-error/40',
            )}>
              <span className="text-heading-1 font-extrabold text-white tracking-wider">
                {isCorrect ? 'BENAR!' : 'SALAH'}
              </span>
            </div>

            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ...springPresets.gentle }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="text-emerald-400"
                >
                  <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span className="text-label font-bold text-emerald-400">+{lastXpGain} XP</span>
                {combo >= 2 && (
                  <>
                    <span className="text-text-tertiary text-micro">|</span>
                    <span className="text-label font-bold text-gold-400">x{combo} combo!</span>
                  </>
                )}
              </motion.div>
            )}

            {isWrong && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-micro text-text-tertiary px-4 text-center"
              >
                Semangat, coba lagi!
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
