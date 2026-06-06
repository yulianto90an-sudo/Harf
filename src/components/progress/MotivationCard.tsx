'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { Mascot } from '@/components/shared/Mascot';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';
import type { MascotExpression } from '@/constants/game';

interface Insight {
  text: string;
  expression: MascotExpression;
}

export function MotivationCard() {
  const profile = useProfileStore((s) => s.profile);

  const insight: Insight = useMemo(() => {
    if (!profile) return { text: 'Ayo mulai perjalanan belajarmu!', expression: 'happy' };

    const statements: Insight[] = [
      { text: `Kamu belajar ${profile.totalWordsLearned} kata — lebih dari ${Math.min(82, 50 + profile.level * 2)}% pemain lainnya!`, expression: 'proud' },
      { text: `Streak ${profile.currentStreak} hari sedang menjadi legenda! 🔥`, expression: 'excited' },
      { text: `${profile.battleWins} battle dimenangkan! Kamu petarung sejati!`, expression: 'excited' },
      { text: `Level ${profile.level} sudah dicapai. Teruslah belajar!`, expression: 'proud' },
      { text: `${profile.totalSessions} sesi belajar — konsistensi adalah kunci!`, expression: 'happy' },
    ];

    return statements[Math.floor(Math.random() * statements.length)];
  }, [profile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.45 }}
      className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-bg-elevated to-bg-elevated border border-emerald-500/10 p-5"
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <Mascot expression={insight.expression} size="md" />
        </div>
        <div className="flex-1">
          <p className="text-body-bold text-text-primary leading-snug">
            {insight.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
