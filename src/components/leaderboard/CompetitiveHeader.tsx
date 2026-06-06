'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

const LEAGUES = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', color: 'from-amber-600 to-amber-800', text: 'text-amber-400' },
  { id: 'silver', name: 'Silver', icon: '🥈', color: 'from-slate-300 to-slate-600', text: 'text-slate-300' },
  { id: 'gold', name: 'Gold', icon: '🥇', color: 'from-gold-400 to-gold-700', text: 'text-gold-400' },
  { id: 'emerald', name: 'Emerald', icon: '💎', color: 'from-emerald-400 to-emerald-700', text: 'text-emerald-400' },
  { id: 'diamond', name: 'Diamond', icon: '💠', color: 'from-info to-blue-700', text: 'text-info' },
  { id: 'sultan', name: 'Sultan', icon: '👑', color: 'from-gold-400 to-gold-600', text: 'text-gold-400' },
];

export function CompetitiveHeader() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const leagueIdx = Math.min(Math.floor(profile.level / 2), LEAGUES.length - 1);
  const league = LEAGUES[leagueIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
      className="relative overflow-hidden rounded-2xl border border-white/5"
    >
      <div className={cn('absolute inset-0 bg-gradient-to-b opacity-20', league.color)} />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-micro text-text-tertiary font-semibold uppercase tracking-wider">Liga</p>
            <p className={cn('text-heading-1 font-extrabold', league.text)}>{league.name}</p>
          </div>
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...springPresets.bouncy, delay: 0.15 }}
            className="text-4xl"
          >
            {league.icon}
          </motion.span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-label font-bold text-emerald-400">{profile.weeklyXP.toLocaleString()}</span>
            <span className="text-micro text-text-tertiary">minggu ini</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
            <span className="text-sm">🔥</span>
            <span className="text-label font-bold text-warning">{profile.currentStreak}x</span>
            <span className="text-micro text-text-tertiary">streak</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
