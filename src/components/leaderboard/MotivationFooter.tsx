'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mascot } from '@/components/shared/Mascot';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';
import type { MascotExpression } from '@/constants/game';

export function MotivationFooter() {
  const profile = useProfileStore((s) => s.profile);

  const message = useMemo(() => {
    if (!profile) return { text: 'Ayo mulai bersaing!', expression: 'happy' as MascotExpression };

    if (profile.weeklyXP < 2000) {
      return { text: `${3000 - profile.weeklyXP} XP lagi menuju Gold League!`, expression: 'excited' as MascotExpression };
    }
    if (profile.weeklyXP < 3000) {
      return { text: 'Satu battle lagi bisa menyelamatkan rankingmu!', expression: 'happy' as MascotExpression };
    }
    if (profile.currentStreak >= 7) {
      return { text: 'Streakmu luar biasa! Pertahankan untuk naik rank! 🔥', expression: 'proud' as MascotExpression };
    }
    return { text: `Kamu #${3} di leaderboard. Jangan sampai turun!`, expression: 'happy' as MascotExpression };
  }, [profile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.45 }}
      className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-bg-elevated to-bg-card border border-emerald-500/10 p-5"
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Mascot expression={message.expression} size="md" />
        </div>
        <div className="flex-1">
          <p className="text-body-bold text-text-primary leading-snug">
            {message.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
