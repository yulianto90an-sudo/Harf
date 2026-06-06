'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';

export function AnswerButtons() {
  const questions = useBattleStore((s) => s.questions);
  const currentIndex = useBattleStore((s) => s.currentQuestionIndex);
  const phase = useBattleStore((s) => s.phase);
  const answerState = useBattleStore((s) => s.answerState);
  const selectedAnswerIndex = useBattleStore((s) => s.selectedAnswerIndex);
  const answerQuestion = useBattleStore((s) => s.answerQuestion);

  if (phase !== 'active' || !questions[currentIndex]) return null;

  const question = questions[currentIndex];

  return (
    <div className="grid grid-cols-2 gap-2.5 w-full">
      {question.options.map((option, i) => {
        const isSelected = selectedAnswerIndex === i;
        const isCorrectOption = i === question.correctIndex;

        let btnState: 'default' | 'correct' | 'wrong' = 'default';
        if (answerState !== 'none' && isSelected) {
          btnState = isCorrectOption ? 'correct' : 'wrong';
        } else if (answerState !== 'none' && isCorrectOption) {
          btnState = 'correct';
        }

        return (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springPresets.gentle, delay: 0.05 * i }}
            whileTap={answerState === 'none' ? { scale: 0.95 } : undefined}
            onClick={() => answerQuestion(i)}
            disabled={answerState !== 'none'}
            className={cn(
              'relative overflow-hidden rounded-xl p-4 text-center min-h-[64px]',
              'border-2 transition-colors duration-200',
              'tap-highlight-transparent select-none',
              btnState === 'correct' && 'border-emerald-500 bg-emerald-500/15 shadow-glow-emerald',
              btnState === 'wrong' && 'border-error bg-error/15 shadow-glow-streak',
              btnState === 'default' && answerState === 'none' && 'border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15',
              btnState === 'default' && answerState !== 'none' && 'border-white/5 bg-white/5 opacity-40',
            )}
          >
            <span className={cn(
              'text-body-bold block',
              btnState === 'correct' && 'text-emerald-400',
              btnState === 'wrong' && 'text-error',
              btnState === 'default' && 'text-text-primary',
            )}>
              {option}
            </span>

            {btnState === 'correct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springPresets.bouncy}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}

            {btnState === 'wrong' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springPresets.bouncy}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-error flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
