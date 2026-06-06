'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

const rankMeta: Record<string, { icon: string; color: string; from: number; to: number }> = {
  'Pemula': { icon: '🌱', color: 'from-text-tertiary to-text-disabled', from: 0, to: 500 },
  'Musafir': { icon: '🚶', color: 'from-emerald-400 to-emerald-600', from: 500, to: 1500 },
  'Penuntut Ilmu': { icon: '📚', color: 'from-info to-blue-600', from: 1500, to: 3000 },
  'Perak': { icon: '⭐', color: 'from-slate-300 to-slate-500', from: 3000, to: 6000 },
  'Sultan Arabic': { icon: '👑', color: 'from-gold-400 to-gold-600', from: 6000, to: Infinity },
};

export function ProgressHeader() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const rankInfo = rankMeta[profile.rank] ?? rankMeta['Pemula'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <span className="text-2xl font-bold text-text-primary">
            {profile.displayName.charAt(0)}
          </span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-body-bold text-text-primary truncate">
            {profile.displayName}
          </p>
          <p className="text-micro text-text-tertiary">
            @{profile.username}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm">{rankInfo.icon}</span>
            <span className={cn('text-label font-bold bg-clip-text text-transparent bg-gradient-to-r', rankInfo.color)}>
              {profile.rank}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <motion.p
            key={profile.xp}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springPresets.bouncy}
            className="text-xp-value text-gold-400 font-extrabold"
          >
            {profile.xp.toLocaleString()}
          </motion.p>
          <p className="text-micro text-text-tertiary">Total XP</p>
        </div>
      </div>
    </motion.div>
  );
}
