'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

const RANKS = [
  { name: 'Pemula', icon: '🌱', xpRequired: 0, gradient: 'from-text-tertiary to-text-disabled' },
  { name: 'Musafir', icon: '🚶', xpRequired: 500, gradient: 'from-emerald-400 to-emerald-600' },
  { name: 'Penuntut Ilmu', icon: '📚', xpRequired: 1500, gradient: 'from-info to-blue-600' },
  { name: 'Perak', icon: '⭐', xpRequired: 3000, gradient: 'from-slate-300 to-slate-500' },
  { name: 'Sultan Arabic', icon: '👑', xpRequired: 6000, gradient: 'from-gold-400 to-gold-600' },
];

export function RankShowcase() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const idx = RANKS.findIndex((r, i) => {
    const next = RANKS[i + 1];
    return profile.xp >= r.xpRequired && (!next || profile.xp < next.xpRequired);
  });
  const currentIndex = idx >= 0 ? idx : RANKS.length - 1;
  const current = RANKS[currentIndex];
  const next = RANKS[currentIndex + 1];

  const xpInRank = profile.xp - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? Math.min(xpInRank / xpNeeded, 1) : 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.1 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Pangkat</p>

        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springPresets.bouncy, delay: 0.15 }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-bg-surface to-bg-elevated border border-white/5 flex items-center justify-center shadow-lg"
          >
            <span className="text-4xl">{current.icon}</span>
          </motion.div>
          <div className="flex-1">
            <p className={cn('text-body-bold font-extrabold bg-clip-text text-transparent bg-gradient-to-r', current.gradient)}>
              {current.name}
            </p>
            <p className="text-micro text-text-tertiary">Level {profile.level}</p>

            {next && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs">{next.icon}</span>
                <span className="text-micro text-text-tertiary">{next.name}</span>
                <span className="text-micro text-text-tertiary ml-auto">
                  {xpInRank.toLocaleString()}/{xpNeeded.toLocaleString()} XP
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full rounded-full bg-gradient-to-r', current.gradient)}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={tweenPresets.slow}
          />
        </div>

        {next && (
          <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/20">
            <span className="text-lg">{next.icon}</span>
            <div className="flex-1">
              <p className="text-label font-bold text-gold-400">{next.name}</p>
              <p className="text-micro text-text-tertiary">
                {(next.xpRequired - profile.xp).toLocaleString()} XP lagi menuju rank berikutnya
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
