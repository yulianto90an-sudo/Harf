'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: { current: number; target: number };
}

const achievements: Achievement[] = [
  { id: 'first_lesson', name: 'Langkah Pertama', icon: '👣', unlocked: true, rarity: 'common' },
  { id: 'streak_7', name: 'Seminggu Penuh', icon: '🔥', unlocked: true, rarity: 'rare' },
  { id: 'streak_30', name: 'Sebulan', icon: '🌟', unlocked: false, rarity: 'epic', progress: { current: 7, target: 30 } },
  { id: 'words_50', name: 'Kosakata 50', icon: '📖', unlocked: true, rarity: 'common' },
  { id: 'words_100', name: 'Kosakata 100', icon: '📚', unlocked: true, rarity: 'rare' },
  { id: 'battle_10', name: 'Petarung', icon: '⚔️', unlocked: true, rarity: 'common' },
  { id: 'battle_50', name: 'Legion', icon: '🛡️', unlocked: false, rarity: 'epic', progress: { current: 34, target: 50 } },
  { id: 'perfect_round', name: 'Sempurna', icon: '💎', unlocked: false, rarity: 'rare', progress: { current: 0, target: 1 } },
  { id: 'speed_demon', name: 'Kilat', icon: '⚡', unlocked: true, rarity: 'rare' },
  { id: 'sultan', name: 'Sultan Arabic', icon: '👑', unlocked: false, rarity: 'legendary', progress: { current: 2840, target: 6000 } },
];

const rarityColors: Record<string, string> = {
  common: 'border-white/10 bg-white/5',
  rare: 'border-emerald-500/20 bg-emerald-500/10',
  epic: 'border-gold-400/20 bg-gold-400/10',
  legendary: 'border-gold-400/30 bg-gradient-to-b from-gold-400/15 to-gold-400/5',
};

const unlockedColors: Record<string, string> = {
  common: 'border-emerald-500/20 bg-emerald-500/10',
  rare: 'border-emerald-500/30 bg-emerald-500/15',
  epic: 'border-gold-400/30 bg-gold-400/15',
  legendary: 'border-gold-400/40 bg-gradient-to-b from-gold-400/20 to-gold-400/10',
};

export function AchievementGrid() {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.25 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Pencapaian</p>
        <span className="text-micro text-text-tertiary">{unlocked}/{achievements.length}</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {achievements.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springPresets.gentle, delay: 0.25 + i * 0.02 }}
            whileTap={{ scale: 0.93 }}
            className={cn(
              'flex flex-col items-center gap-1.5 shrink-0 w-[72px] py-3 px-1.5 rounded-xl border',
              badge.unlocked ? unlockedColors[badge.rarity] : rarityColors[badge.rarity],
              !badge.unlocked && 'opacity-60',
            )}
          >
            <span className={cn('text-xl', badge.unlocked ? '' : 'grayscale opacity-50')}>{badge.icon}</span>
            <p className={cn(
              'text-micro font-semibold text-center leading-tight',
              badge.unlocked ? 'text-text-primary' : 'text-text-tertiary',
            )}>
              {badge.name}
            </p>
            {badge.progress && !badge.unlocked && (
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(badge.progress.current / badge.progress.target) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
