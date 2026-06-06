'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

const RANKS = [
  { name: 'Pemula', icon: '🌱', xpRequired: 0, color: 'from-text-tertiary to-text-disabled' },
  { name: 'Musafir', icon: '🚶', xpRequired: 500, color: 'from-emerald-400 to-emerald-600' },
  { name: 'Penuntut Ilmu', icon: '📚', xpRequired: 1500, color: 'from-info to-blue-600' },
  { name: 'Perak', icon: '⭐', xpRequired: 3000, color: 'from-slate-300 to-slate-500' },
  { name: 'Sultan Arabic', icon: '👑', xpRequired: 6000, color: 'from-gold-400 to-gold-600' },
];

export function RankCard() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const currentRankIndex = RANKS.findIndex((r) => profile.xp < r.xpRequired || profile.xp >= r.xpRequired) - 1;
  const actualIndex = RANKS.findIndex((r, i) => {
    const next = RANKS[i + 1];
    return profile.xp >= r.xpRequired && (!next || profile.xp < next.xpRequired);
  });
  const idx = actualIndex >= 0 ? actualIndex : 0;
  const currentRank = RANKS[idx];
  const nextRank = RANKS[idx + 1];
  const xpInRank = profile.xp - (currentRank?.xpRequired ?? 0);
  const xpNeeded = nextRank ? nextRank.xpRequired - (currentRank?.xpRequired ?? 0) : 1;
  const progress = nextRank ? Math.min(xpInRank / xpNeeded, 1) : 1;
  const xpRemaining = nextRank ? nextRank.xpRequired - profile.xp : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.05 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Pangkat</p>
          <div className="flex items-center gap-2">
            {currentRank && (
              <span className={cn('text-label font-bold bg-clip-text text-transparent bg-gradient-to-r', currentRank.color)}>
                {currentRank.name}
              </span>
            )}
            <span className="text-xl">{currentRank?.icon}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-micro text-text-secondary">
              {nextRank ? `Menuju ${nextRank.name}` : 'Rank maksimal!'}
            </span>
            <span className="text-micro text-text-tertiary">
              {xpInRank.toLocaleString()} / {xpNeeded.toLocaleString()} XP
            </span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', currentRank?.color ?? 'from-emerald-500 to-emerald-400')}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={tweenPresets.slow}
            />
          </div>
        </div>

        {nextRank && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/20">
            <span className="text-sm">{nextRank.icon}</span>
            <div className="flex-1">
              <p className="text-micro font-semibold text-gold-400">{nextRank.name}</p>
              <p className="text-micro text-text-tertiary">{xpRemaining.toLocaleString()} XP lagi</p>
            </div>
            <span className="text-label font-bold text-gold-400">{xpRemaining.toLocaleString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
