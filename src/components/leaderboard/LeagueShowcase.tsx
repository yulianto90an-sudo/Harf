'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

const LEAGUES = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', gradient: 'from-amber-600 to-amber-800', text: 'text-amber-400', xpRequired: 0 },
  { id: 'silver', name: 'Silver', icon: '🥈', gradient: 'from-slate-300 to-slate-600', text: 'text-slate-300', xpRequired: 500 },
  { id: 'gold', name: 'Gold', icon: '🥇', gradient: 'from-gold-400 to-gold-700', text: 'text-gold-400', xpRequired: 1500 },
  { id: 'emerald', name: 'Emerald', icon: '💎', gradient: 'from-emerald-400 to-emerald-700', text: 'text-emerald-400', xpRequired: 3000 },
  { id: 'diamond', name: 'Diamond', icon: '💠', gradient: 'from-info to-blue-700', text: 'text-info', xpRequired: 5000 },
  { id: 'sultan', name: 'Sultan', icon: '👑', gradient: 'from-gold-400 to-gold-600', text: 'text-gold-400', xpRequired: 8000 },
];

export function LeagueShowcase() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const userLeagueIdx = LEAGUES.findIndex((l, i) => {
    const next = LEAGUES[i + 1];
    return profile.weeklyXP >= l.xpRequired && (!next || profile.weeklyXP < next.xpRequired);
  });
  const idx = userLeagueIdx >= 0 ? userLeagueIdx : 0;
  const current = LEAGUES[idx];
  const next = LEAGUES[idx + 1];
  const xpIn = profile.weeklyXP - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.05 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Liga</p>

      <div className="flex items-center justify-between mb-4">
        {LEAGUES.map((l, i) => {
          const isCurrent = i === idx;
          const isPassed = i < idx;
          return (
            <motion.div
              key={l.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05 + i * 0.04, ...springPresets.bouncy }}
              className={cn(
                'flex flex-col items-center gap-1',
                isCurrent && 'scale-110',
              )}
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2',
                isCurrent ? 'border-emerald-400 bg-emerald-500/20 shadow-glow-emerald' : isPassed ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-white/5',
              )}>
                {l.icon}
              </div>
              <span className={cn(
                'text-micro font-semibold',
                isCurrent ? l.text : isPassed ? 'text-emerald-500' : 'text-text-tertiary/50',
              )}>
                {l.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', current.gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${(xpIn / xpNeeded) * 100}%` }}
          transition={tweenPresets.slow}
        />
      </div>

      {next && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/20">
          <span className="text-lg">{next.icon}</span>
          <p className="text-micro text-gold-400 font-semibold">
            {(next.xpRequired - profile.weeklyXP).toLocaleString()} XP menuju {next.name}
          </p>
        </div>
      )}
    </motion.div>
  );
}
