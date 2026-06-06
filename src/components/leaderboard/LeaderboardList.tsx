'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface Player {
  rank: number;
  name: string;
  initial: string;
  xp: number;
  streak: number;
  change: 'up' | 'down' | 'same';
  isUser?: boolean;
  league: string;
}

const players: Player[] = [
  { rank: 1, name: 'Amirah', initial: 'A', xp: 3520, streak: 14, change: 'up', league: 'Gold' },
  { rank: 2, name: 'Faris', initial: 'F', xp: 3140, streak: 9, change: 'same', league: 'Gold' },
  { rank: 3, name: 'Masyul', initial: 'M', xp: 2840, streak: 7, change: 'up', league: 'Gold', isUser: true },
  { rank: 4, name: 'Zahra', initial: 'Z', xp: 2710, streak: 5, change: 'down', league: 'Silver' },
  { rank: 5, name: 'Hakim', initial: 'H', xp: 2550, streak: 3, change: 'same', league: 'Silver' },
  { rank: 6, name: 'Siti', initial: 'S', xp: 2320, streak: 11, change: 'up', league: 'Silver' },
  { rank: 7, name: 'Budi', initial: 'B', xp: 2100, streak: 2, change: 'down', league: 'Silver' },
  { rank: 8, name: 'Rina', initial: 'R', xp: 1950, streak: 6, change: 'same', league: 'Bronze' },
  { rank: 9, name: 'Doni', initial: 'D', xp: 1780, streak: 1, change: 'down', league: 'Bronze' },
  { rank: 10, name: 'Mira', initial: 'M', xp: 1520, streak: 4, change: 'up', league: 'Bronze' },
];

const changeIcons: Record<string, string> = { up: '↑', down: '↓', same: '→' };
const changeColors: Record<string, string> = { up: 'text-emerald-400', down: 'text-error', same: 'text-text-tertiary' };

export function LeaderboardList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.1 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 overflow-hidden"
    >
      <div className="px-5 pt-5 pb-2">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Peringkat</p>
      </div>

      <div className="flex flex-col">
        {players.map((p, i) => (
          <motion.div
            key={p.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.02, ...springPresets.gentle }}
            className={cn(
              'flex items-center gap-3 px-5 py-3',
              i < players.length - 1 && 'border-b border-white/5',
              p.isUser && 'bg-emerald-500/5',
            )}
          >
            <span className={cn(
              'w-7 text-center text-label font-bold',
              p.rank <= 3 ? 'text-gold-400' : 'text-text-tertiary',
            )}>
              #{p.rank}
            </span>

            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-label font-bold shrink-0',
              p.isUser
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-text-primary'
                : 'bg-white/5 text-text-primary border border-white/5',
            )}>
              {p.initial}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  'text-label font-semibold truncate',
                  p.isUser ? 'text-emerald-400' : 'text-text-primary',
                )}>
                  {p.name}
                </span>
                {p.streak >= 7 && <span className="text-xs">🔥</span>}
              </div>
              <p className="text-micro text-text-tertiary">{p.league}</p>
            </div>

            <div className="text-right">
              <p className="text-label font-bold text-gold-400">{p.xp.toLocaleString()}</p>
            </div>

            <span className={cn('text-micro w-4 text-center', changeColors[p.change])}>
              {changeIcons[p.change]}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
