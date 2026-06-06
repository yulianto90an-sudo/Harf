'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

export function UserRankSpotlight() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const currentRank = 3;
  const xpToNext = 2840 - 2710 + 1;
  const safetyMargin = 350;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.15 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-bg-elevated to-bg-card"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-label text-emerald-400 font-bold">Peringkatmu</p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30"
          >
            <span className="text-label font-bold text-emerald-400">#{currentRank}</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <p className="text-micro text-text-tertiary">XP ke rank #2</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={tweenPresets.slow}
                />
              </div>
              <span className="text-label font-bold text-text-primary">{xpToNext.toLocaleString()}</span>
            </div>
          </div>
          <div className="w-px h-10 bg-white/5" />
          <div className="text-right">
            <p className="text-micro text-text-tertiary">Zona aman</p>
            <p className="text-label font-bold text-emerald-400">+{safetyMargin} XP</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
          <span className="text-sm">📈</span>
          <p className="text-micro text-text-secondary flex-1">
            Naik 1 peringkat minggu ini
          </p>
          <span className="text-label font-bold text-emerald-400">+2 posisi</span>
        </div>
      </div>
    </motion.div>
  );
}
