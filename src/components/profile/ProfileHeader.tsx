'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

const rankMeta: Record<string, { icon: string; gradient: string }> = {
  'Pemula': { icon: '🌱', gradient: 'from-text-tertiary to-text-disabled' },
  'Musafir': { icon: '🚶', gradient: 'from-emerald-400 to-emerald-600' },
  'Penuntut Ilmu': { icon: '📚', gradient: 'from-info to-blue-600' },
  'Perak': { icon: '⭐', gradient: 'from-slate-300 to-slate-500' },
  'Sultan Arabic': { icon: '👑', gradient: 'from-gold-400 to-gold-600' },
};

export function ProfileHeader() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const rank = rankMeta[profile.rank] ?? rankMeta['Pemula'];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/15 via-bg-elevated to-bg-card" />

      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl" />

      <div className="relative z-10 p-5 pt-12">
        <div className="flex items-end gap-4 -mt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springPresets.bouncy, delay: 0.1 }}
            className="relative"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 ring-4 ring-bg-primary">
              <span className="text-3xl font-bold text-text-primary">
                {profile.displayName.charAt(0)}
              </span>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springPresets.bouncy, delay: 0.3 }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-bg-primary flex items-center justify-center"
            >
              <span className="text-sm">{rank.icon}</span>
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0 pb-1">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, ...springPresets.gentle }}
              className="text-heading-1 text-text-primary font-bold truncate"
            >
              {profile.displayName}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, ...springPresets.gentle }}
              className="text-micro text-text-tertiary"
            >
              @{profile.username} &middot; Level {profile.level}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, ...springPresets.gentle }}
              className="flex items-center gap-1.5 mt-1"
            >
              <span className="text-sm">{rank.icon}</span>
              <span className={cn('text-label font-bold bg-clip-text text-transparent bg-gradient-to-r', rank.gradient)}>
                {profile.rank}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springPresets.bouncy, delay: 0.25 }}
            className="shrink-0 text-right"
          >
            <p className="text-xp-value text-gold-400 font-extrabold">
              {profile.xp.toLocaleString()}
            </p>
            <p className="text-micro text-text-tertiary">Total XP</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
