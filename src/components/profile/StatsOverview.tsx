'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent: 'emerald' | 'gold' | 'info' | 'warning' | 'text';
  delay: number;
}

const accentMap: Record<string, string> = {
  emerald: 'from-emerald-500/10 border-emerald-500/15 text-emerald-400',
  gold: 'from-gold-400/10 border-gold-400/15 text-gold-400',
  info: 'from-info/10 border-info/15 text-info',
  warning: 'from-warning/10 border-warning/15 text-warning',
  text: 'from-white/5 border-white/10 text-text-primary',
};

function StatCard({ icon, label, value, sub, accent, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ...springPresets.gentle }}
      className={cn('rounded-xl p-3.5 border bg-gradient-to-br', accentMap[accent])}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <p className="text-body-bold font-extrabold">{value}</p>
      </div>
      <p className="text-micro text-text-tertiary">{label}</p>
      {sub && <p className="text-micro text-text-tertiary/60 mt-0.5">{sub}</p>}
    </motion.div>
  );
}

export function StatsOverview() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const totalBattles = profile.battleWins + profile.battleLosses;
  const winRate = totalBattles > 0 ? Math.round((profile.battleWins / totalBattles) * 100) : 0;

  const stats = [
    { icon: '⚔️', label: 'Battle Dimenangkan', value: profile.battleWins, sub: `${winRate}% win rate`, accent: 'gold' as const, delay: 0.2 },
    { icon: '📊', label: 'Sesi Belajar', value: profile.totalSessions, sub: 'Total sesi', accent: 'text' as const, delay: 0.25 },
    { icon: '💥', label: 'Combo Terbaik', value: `x${14}`, sub: 'Streak 7 hari', accent: 'warning' as const, delay: 0.3 },
    { icon: '🎧', label: 'Sesi Mendengar', value: 47, sub: `${Math.round(47 * 2.5)} menit`, accent: 'info' as const, delay: 0.35 },
  ];

  return (
    <>
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Statistik</p>
      <div className="grid grid-cols-2 gap-2.5 mt-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </>
  );
}
