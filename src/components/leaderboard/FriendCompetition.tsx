'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface FriendRank {
  name: string;
  initial: string;
  xp: number;
  streak: number;
  change: 'up' | 'down' | 'same';
  online: boolean;
}

const friends: FriendRank[] = [
  { name: 'Amirah', initial: 'A', xp: 3520, streak: 14, change: 'up', online: true },
  { name: 'Faris', initial: 'F', xp: 3140, streak: 9, change: 'same', online: true },
  { name: 'Zahra', initial: 'Z', xp: 2710, streak: 5, change: 'down', online: false },
  { name: 'Hakim', initial: 'H', xp: 2550, streak: 3, change: 'same', online: false },
];

const changeIcons: Record<string, string> = { up: '↑', down: '↓', same: '→' };
const changeColors: Record<string, string> = { up: 'text-emerald-400', down: 'text-error', same: 'text-text-tertiary' };

export function FriendCompetition() {
  const profile = useProfileStore((s) => s.profile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.25 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Persaingan Teman</p>
        <span className="text-micro text-emerald-400 font-semibold">
          {friends.filter((f) => f.online).length} online
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {friends.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.03, ...springPresets.gentle }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/5"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-label font-bold text-text-primary">
                {f.initial}
              </div>
              {f.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg-elevated" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-label font-semibold text-text-primary truncate">{f.name}</p>
              <div className="flex items-center gap-1.5 text-micro text-text-tertiary">
                <span>{f.xp.toLocaleString()} XP</span>
                {f.streak >= 7 && <span>🔥</span>}
              </div>
            </div>

            <div className="text-right">
              <p className="text-label font-bold text-gold-400">#{i + 1}</p>
            </div>

            <span className={cn('text-micro w-4 text-center', changeColors[f.change])}>
              {changeIcons[f.change]}
            </span>
          </motion.div>
        ))}
      </div>

      {profile && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-micro text-text-tertiary">
          <span>Peringkat #{3} dari {friends.length + 1} teman</span>
          <span className="text-emerald-400 font-semibold">
            {(profile.weeklyXP - friends[friends.length - 1].xp).toLocaleString()} XP terakhir
          </span>
        </div>
      )}
    </motion.div>
  );
}
