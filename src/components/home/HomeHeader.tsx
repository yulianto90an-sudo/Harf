'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';

export function HomeHeader() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const streak = profile.currentStreak;
  const isDanger = streak === 0;
  const isMilestone = streak > 0 && streak % 7 === 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-center justify-between px-1 pt-2 pb-1"
    >
      <div className="flex items-center gap-2.5">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600
            flex items-center justify-center text-white font-bold text-micro shadow-lg shadow-emerald-500/20"
        >
          {profile.displayName.charAt(0)}
        </motion.div>
        <div>
          <p className="text-body-bold text-text-primary leading-tight">
            Halo, {profile.displayName}!
          </p>
          <p className="text-micro text-text-tertiary">
            Level {profile.level} &middot; {profile.rank}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative w-9 h-9 rounded-full bg-bg-elevated border border-white/5
            flex items-center justify-center"
          aria-label="Notifikasi"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-text-secondary"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full border-2 border-bg-primary" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className={cn(
            'flex items-center gap-1.5 h-9 px-2.5 rounded-full border',
            isDanger
              ? 'bg-error/10 border-error/20 text-error'
              : isMilestone
                ? 'bg-gold-400/10 border-gold-400/20 text-gold-400'
                : 'bg-warning/10 border-warning/20 text-warning',
          )}
          aria-label={`Streak ${streak} hari`}
        >
          <motion.span
            animate={streak > 0 ? { rotate: [0, -5, 5, -5, 0] } : undefined}
            transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 5 }}
            className="text-xs"
          >
            {isDanger ? '🔥' : isMilestone ? '🌟' : '🔥'}
          </motion.span>
          <span className="text-micro font-bold">{streak}</span>
        </motion.button>
      </div>
    </motion.header>
  );
}


