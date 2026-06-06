'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  accent: 'emerald' | 'gold' | 'info' | 'text';
  delay: number;
}

const accentStyles: Record<string, string> = {
  emerald: 'text-emerald-400 from-emerald-500/10 to-emerald-600/5 border-emerald-500/15',
  gold: 'text-gold-400 from-gold-400/10 to-gold-500/5 border-gold-400/15',
  info: 'text-info from-info/10 to-info/5 border-info/15',
  text: 'text-text-primary from-white/5 to-white/5 border-white/10',
};

function StatCard({ icon, label, value, accent, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, ...springPresets.gentle }}
      className={cn('rounded-xl p-3.5 border bg-gradient-to-br', accentStyles[accent])}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{icon}</span>
        <p className="text-body-bold font-extrabold">{value}</p>
      </div>
      <p className="text-micro text-text-tertiary">{label}</p>
    </motion.div>
  );
}

export function StatCards() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const total = profile.battleWins + profile.battleLosses;
  const accuracy = total > 0 ? Math.round((profile.battleWins / total) * 100) : 0;

  const stats = [
    { icon: '📖', label: 'Kata Dipelajari', value: profile.totalWordsLearned, accent: 'emerald' as const },
    { icon: '⚔️', label: 'Battle Menang', value: profile.battleWins, accent: 'gold' as const },
    { icon: '🎯', label: 'Akurasi Battle', value: `${accuracy}%`, accent: 'info' as const },
    { icon: '📊', label: 'Total Sesi', value: profile.totalSessions, accent: 'text' as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.3 }}
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-3">Statistik</p>
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.3 + i * 0.05} />
        ))}
      </div>
    </motion.div>
  );
}
