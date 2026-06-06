'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isUser?: boolean;
  change: 'up' | 'down' | 'same';
}

const entries: LeaderboardEntry[] = [
  { rank: 1, name: 'Amirah', xp: 3520, change: 'up' },
  { rank: 2, name: 'Faris', xp: 3140, change: 'same' },
  { rank: 3, name: 'Masyul', xp: 2840, isUser: true, change: 'up' },
  { rank: 4, name: 'Zahra', xp: 2710, change: 'down' },
  { rank: 5, name: 'Hakim', xp: 2550, change: 'same' },
];

const changeIcons: Record<string, string> = {
  up: '↑',
  down: '↓',
  same: '→',
};

const changeColors: Record<string, string> = {
  up: 'text-emerald-400',
  down: 'text-error',
  same: 'text-text-tertiary',
};

export function LeaderboardCard() {
  const profile = useProfileStore((s) => s.profile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.4 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Papan Skor</p>
        <span className="text-micro text-emerald-400 font-semibold">Minggu Ini</span>
      </div>

      <div className="flex flex-col gap-1">
        {entries.map((e) => (
          <div
            key={e.rank}
            className={cn(
              'flex items-center gap-3 px-2 py-2 rounded-lg',
              e.isUser && 'bg-emerald-500/5',
            )}
          >
            <span className={cn(
              'w-6 text-center text-label font-bold',
              e.rank <= 3 ? 'text-gold-400' : 'text-text-tertiary',
            )}>
              #{e.rank}
            </span>
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-micro font-bold shrink-0',
              e.isUser
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-text-primary'
                : 'bg-white/5 text-text-primary border border-white/5',
            )}>
              {e.name.charAt(0)}
            </div>
            <span className={cn(
              'flex-1 text-label font-semibold',
              e.isUser ? 'text-emerald-400' : 'text-text-primary',
            )}>
              {e.name}
            </span>
            <span className={cn(
              'text-label font-bold',
              e.rank <= 3 ? 'text-gold-400' : 'text-text-secondary',
            )}>
              {e.xp.toLocaleString()}
            </span>
            <span className={cn('text-micro', changeColors[e.change])}>
              {changeIcons[e.change]}
            </span>
          </div>
        ))}
      </div>

      {profile && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-micro text-text-tertiary">
          <span>Peringkat #{profile.battleWins > 30 ? 3 : 10} dari 128 pemain</span>
          <span className="text-emerald-400 font-semibold">Top 10%</span>
        </div>
      )}
    </motion.div>
  );
}
