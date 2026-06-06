'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface LeaderboardEntry {
  id: string;
  displayName: string;
  xp: number;
  rank: number;
  isUser?: boolean;
}

const leaderboard: LeaderboardEntry[] = [
  { id: '2', displayName: 'Amirah', xp: 3520, rank: 1 },
  { id: '3', displayName: 'Faris', xp: 3140, rank: 2 },
  { id: '1', displayName: 'Masyul', xp: 2840, rank: 3, isUser: true },
  { id: '4', displayName: 'Zahra', xp: 2710, rank: 4 },
  { id: '5', displayName: 'Hakim', xp: 2550, rank: 5 },
];

const rankColors: Record<number, string> = {
  1: 'text-gold-400',
  2: 'text-text-secondary',
  3: 'text-warning',
};

const rankBgColors: Record<number, string> = {
  1: 'bg-gold-400/15 border-gold-400/25',
  2: 'bg-white/5 border-white/10',
  3: 'bg-warning/15 border-warning/25',
};

const rankEmojis: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export function MiniLeaderboard() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const top3 = leaderboard.slice(0, 3);
  const userPos = leaderboard.find((e) => e.isUser);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-heading-2 text-text-primary font-bold">Papan Skor</h2>
        <button onClick={() => router.push('/social')} className="text-micro text-emerald-400 font-semibold">Minggu Ini</button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPresets.gentle, delay: 0.35 }}
        className="rounded-xl bg-bg-elevated border border-white/[0.04] overflow-hidden"
        onClick={() => router.push('/social')}
      >
        {top3.map((entry, i) => (
          <div
            key={entry.id}
            className={cn(
              'flex items-center gap-2.5 px-4 py-2.5',
              i < 2 && 'border-b border-white/[0.04]',
              entry.isUser && 'bg-emerald-500/5',
            )}
          >
            <span className="w-6 text-center">
              <span className="text-base">{rankEmojis[i + 1]}</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-bg-surface to-bg-elevated
              flex items-center justify-center text-text-primary text-micro font-bold shrink-0
              border border-white/5"
            >
              {entry.displayName.charAt(0)}
            </div>
            <span className={cn(
              'flex-1 text-label font-semibold',
              entry.isUser ? 'text-emerald-400' : 'text-text-primary',
            )}>
              {entry.displayName}
            </span>
            <span className="text-body-bold text-gold-400">{entry.xp.toLocaleString()}</span>
          </div>
        ))}

        {userPos && userPos.rank > 3 && (
          <>
            <div className="flex items-center justify-center py-1.5">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/5 border-t border-white/[0.04]">
              <span className="w-6 text-center text-label text-text-tertiary font-semibold">
                #{userPos.rank}
              </span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600
                flex items-center justify-center text-white text-micro font-bold shrink-0"
              >
                {profile?.displayName.charAt(0)}
              </div>
              <span className="flex-1 text-label font-semibold text-emerald-400">
                {profile?.displayName}
              </span>
              <span className="text-body-bold text-gold-400">{userPos.xp.toLocaleString()}</span>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
