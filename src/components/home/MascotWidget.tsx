'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { Mascot } from '@/components/shared/Mascot';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';
import type { MascotExpression } from '@/constants/game';

interface ContextMessage {
  text: string;
  expression: MascotExpression;
}

export function MascotWidget() {
  const profile = useProfileStore((s) => s.profile);

  const message: ContextMessage = useMemo(() => {
    if (!profile) return { text: 'Ayo mulai belajar!', expression: 'happy' };

    if (profile.currentStreak >= 7) return { text: `${profile.currentStreak} hari berturut-turut! Luar biasa! 🔥`, expression: 'excited' };
    if (profile.currentStreak >= 3) return { text: `${profile.currentStreak} hari streak! Jangan putus ya!`, expression: 'proud' };
    if (profile.currentStreak >= 1) return { text: 'Streak aman! Lanjutkan besok juga!', expression: 'happy' };
    if (profile.currentStreak === 0 && profile.totalSessions > 0) return { text: 'Streak putus... Yuk mulai lagi! 💪', expression: 'sad' };

    if (profile.totalWordsLearned > 100) return { text: `${profile.totalWordsLearned} kata sudah dikuasai! Hebat!`, expression: 'proud' };
    if (profile.totalWordsLearned > 50) return { text: 'Keren! Kamu sudah melewati setengah jalan!', expression: 'excited' };

    return { text: 'Siap belajar hari ini?', expression: 'happy' };
  }, [profile]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message.text + message.expression}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={springPresets.gentle}
        className="flex items-center gap-3 px-1"
      >
        <div className="shrink-0">
          <Mascot expression={message.expression} size="md" />
        </div>
        <div className="relative bg-bg-elevated rounded-xl px-4 py-2.5 border border-white/[0.04] flex-1">
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-bg-elevated border-l border-b border-white/[0.04] rotate-45" />
          <p className="text-body text-text-primary">{message.text}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
