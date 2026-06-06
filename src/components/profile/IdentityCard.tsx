'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  accent: string;
  delay: number;
}

function StatItem({ icon, label, value, accent, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...springPresets.gentle }}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5"
    >
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-micro text-text-tertiary truncate">{label}</p>
        <p className={cn('text-body-bold font-bold', accent)}>{value}</p>
      </div>
    </motion.div>
  );
}

export function IdentityCard() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const total = profile.battleWins + profile.battleLosses;
  const winRate = total > 0 ? Math.round((profile.battleWins / total) * 100) : 0;

  const stats = [
    { icon: '🔥', label: 'Streak', value: `${profile.currentStreak} hari`, accent: 'text-warning', delay: 0.15 },
    { icon: '⭐', label: 'XP Total', value: profile.xp.toLocaleString(), accent: 'text-gold-400', delay: 0.2 },
    { icon: '📖', label: 'Kata Dipelajari', value: profile.totalWordsLearned, accent: 'text-emerald-400', delay: 0.25 },
    { icon: '⚔️', label: 'Win Rate', value: `${winRate}%`, accent: 'text-info', delay: 0.3 },
    { icon: '🎯', label: 'Akurasi', value: `${Math.min(100, 70 + profile.level * 2)}%`, accent: 'text-emerald-400', delay: 0.35 },
    { icon: '📚', label: 'Kategori Favorit', value: 'Salam', accent: 'text-text-primary', delay: 0.4 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.05 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-3">Identitas</p>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </motion.div>
  );
}
