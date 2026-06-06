'use client';

import { motion } from 'framer-motion';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

export function ShareCTA() {
  const profile = useProfileStore((s) => s.profile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.5 }}
      className="rounded-2xl bg-gradient-to-br from-gold-400/10 to-gold-500/5 border border-gold-400/20 p-5"
    >
      <p className="text-label text-gold-400 font-bold text-center mb-3">Bagikan Progressmu!</p>

      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl">🔥</span>
          <span className="text-label font-bold text-text-primary">{profile?.currentStreak ?? 0}</span>
          <span className="text-micro text-text-tertiary">Streak</span>
        </div>
        <div className="w-px h-10 bg-gold-400/20" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl">⭐</span>
          <span className="text-label font-bold text-text-primary">{profile?.rank ?? 'Pemula'}</span>
          <span className="text-micro text-text-tertiary">Rank</span>
        </div>
        <div className="w-px h-10 bg-gold-400/20" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl">📖</span>
          <span className="text-label font-bold text-text-primary">{profile?.totalWordsLearned ?? 0}</span>
          <span className="text-micro text-text-tertiary">Kata</span>
        </div>
      </div>

      <div className="flex gap-2.5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={springPresets.snappy}
          className="flex-1 py-3 bg-emerald-500 rounded-xl text-text-primary font-bold text-label shadow-lg shadow-emerald-500/20"
        >
          Bagikan
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={springPresets.snappy}
          className="py-3 px-4 bg-white/5 rounded-xl text-text-secondary border border-white/5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
