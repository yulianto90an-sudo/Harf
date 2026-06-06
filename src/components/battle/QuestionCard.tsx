'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';

export function QuestionCard() {
  const questions = useBattleStore((s) => s.questions);
  const currentIndex = useBattleStore((s) => s.currentQuestionIndex);
  const phase = useBattleStore((s) => s.phase);
  const answerState = useBattleStore((s) => s.answerState);

  if (phase !== 'active' || !questions[currentIndex]) return null;

  const question = questions[currentIndex];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={springPresets.gentle}
      className={cn(
        'w-full rounded-2xl p-5 text-center',
        'bg-gradient-to-b from-bg-elevated to-bg-card',
        'border shadow-2xl shadow-black/30',
        answerState === 'correct' && 'border-emerald-500/30 shadow-glow-emerald',
        answerState === 'wrong' && 'border-error/30 shadow-glow-streak',
        answerState === 'none' && 'border-white/[0.04]',
      )}
    >
      <p className="text-micro text-text-tertiary font-semibold uppercase tracking-wider mb-2">
        {question.word.category}
      </p>

      <p
        className="text-arabic-l text-text-primary font-arabic leading-[1.2] mb-3"
        dir="rtl"
        lang="ar"
      >
        {question.word.arabic}
      </p>

      <p className="text-body-bold text-text-secondary">{question.word.latin}</p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-micro text-text-tertiary mt-4 pt-3 border-t border-white/5"
      >
        Pilih arti yang benar
      </motion.p>
    </motion.div>
  );
}
