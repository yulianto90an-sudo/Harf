'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface FriendEntry {
  id: string;
  name: string;
  initial: string;
  activity: string;
  time: string;
  icon: string;
  xp?: number;
  online: boolean;
}

const friends: FriendEntry[] = [
  { id: 'f1', name: 'Amirah', initial: 'A', activity: 'Menyelesaikan streak 14 hari 🔥', time: '2 menit lalu', icon: '🔥', online: true },
  { id: 'f2', name: 'Faris', initial: 'F', activity: 'Memenangkan battle melawan Naga Arab', time: '15 menit lalu', icon: '⚔️', xp: 50, online: true },
  { id: 'f3', name: 'Zahra', initial: 'Z', activity: 'Mencapai 200 kosakata! 📖', time: '1 jam lalu', icon: '📖', online: false },
  { id: 'f4', name: 'Hakim', initial: 'H', activity: 'Naik peringkat ke #4 di leaderboard', time: '3 jam lalu', icon: '📈', online: false },
  { id: 'f5', name: 'Siti', initial: 'S', activity: 'Belajar 30 kata baru hari ini', time: '5 jam lalu', icon: '📚', online: false },
];

export function FriendActivity() {
  const profile = useProfileStore((s) => s.profile);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPresets.gentle}
      >
        <h1 className="text-display-2 text-text-primary font-extrabold">Sosial</h1>
        <p className="text-body text-text-secondary mt-1">Aktivitas teman-temanmu</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPresets.gentle, delay: 0.05 }}
        className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Online</p>
          <span className="text-micro text-emerald-400 font-semibold">{friends.filter((f) => f.online).length} online</span>
        </div>

        <div className="flex gap-3">
          {friends.filter((f) => f.online).map((friend) => (
            <motion.div
              key={friend.id}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-text-primary text-label font-bold">
                  {friend.initial}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-bg-primary" />
              </div>
              <p className="text-micro text-text-primary font-medium truncate max-w-[56px] text-center">
                {friend.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="space-y-2">
        {friends.map((friend, i) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04, ...springPresets.gentle }}
            className="rounded-xl bg-gradient-to-r from-bg-elevated to-bg-card border border-white/5 p-4"
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-label font-bold shrink-0',
                'bg-gradient-to-br from-emerald-400 to-emerald-600 text-text-primary',
              )}>
                {friend.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-label font-semibold text-text-primary">{friend.name}</p>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    friend.online ? 'bg-emerald-500' : 'bg-text-disabled',
                  )} />
                </div>
                <p className="text-body-small text-text-secondary mt-0.5 leading-snug">
                  {friend.icon} {friend.activity}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-micro text-text-tertiary">{friend.time}</span>
                  {friend.xp && (
                    <span className="text-micro text-emerald-400 font-semibold">+{friend.xp} XP</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
