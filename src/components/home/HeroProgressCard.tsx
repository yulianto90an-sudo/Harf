'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

export function HeroProgressCard() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const progress = Math.min((profile.xp / profile.xpToNextLevel) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springPresets.gentle, delay: 0.05 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/25 via-emerald-500/15 to-bg-elevated
        border border-emerald-500/15 shadow-glow-emerald"
    >
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-emerald-400/5 rounded-full blur-2xl" />

      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-micro text-emerald-300 font-semibold uppercase tracking-wider">
              Level {profile.level}
            </p>
            <p className="text-display-1 font-bold text-text-primary mt-0.5">
              {profile.rank}
            </p>
          </div>
          <div className="text-right">
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

        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-micro text-text-secondary font-medium">XP ke level {profile.level + 1}</span>
            <span className="text-micro text-text-tertiary">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-bg-surface/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ...tweenPresets.slow, delay: 0.3 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-warning/20 flex items-center justify-center">
              <span className="text-warning text-xs">🔥</span>
            </div>
            <div>
              <p className="text-body-bold text-text-primary">{profile.currentStreak}</p>
              <p className="text-micro text-text-tertiary">Streak</p>
            </div>
          </div>
          <div className="w-px h-7 bg-white/5" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-xs">📖</span>
            </div>
            <div>
              <p className="text-body-bold text-text-primary">{profile.totalWordsLearned}</p>
              <p className="text-micro text-text-tertiary">Kata</p>
            </div>
          </div>
          <div className="w-px h-7 bg-white/5" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gold-400/20 flex items-center justify-center">
              <span className="text-gold-400 text-xs">⚔️</span>
            </div>
            <div>
              <p className="text-body-bold text-text-primary">{profile.battleWins}</p>
              <p className="text-micro text-text-tertiary">Menang</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-5 pb-5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.01 }}
          transition={springPresets.snappy}
          onClick={() => router.push('/swipe')}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600
            rounded-xl text-white font-bold text-label
            shadow-lg shadow-emerald-500/30
            flex items-center justify-center gap-2"
        >
          <span>Lanjut Belajar</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
