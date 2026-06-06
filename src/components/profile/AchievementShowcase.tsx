'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  label: string;
}

const badges: Badge[] = [
  { id: '1', name: 'First Step', icon: '👣', unlocked: true, rarity: 'common', label: 'Selesaikan 1 pelajaran' },
  { id: '2', name: 'Streak 7', icon: '🔥', unlocked: true, rarity: 'rare', label: 'Streak 7 hari' },
  { id: '3', name: 'Vocabulary', icon: '📖', unlocked: true, rarity: 'common', label: '50 kata dipelajari' },
  { id: '4', name: 'Scholar', icon: '📚', unlocked: true, rarity: 'rare', label: '100 kata dipelajari' },
  { id: '5', name: 'Warrior', icon: '⚔️', unlocked: true, rarity: 'common', label: '10 battle dimenangkan' },
  { id: '6', name: 'Speed', icon: '⚡', unlocked: true, rarity: 'rare', label: 'Combo 5 tercapai' },
  { id: '7', name: 'Streak 30', icon: '🌟', unlocked: false, rarity: 'epic', label: 'Streak 30 hari' },
  { id: '8', name: 'Legion', icon: '🛡️', unlocked: false, rarity: 'epic', label: '50 battle dimenangkan' },
  { id: '9', name: 'Perfect', icon: '💎', unlocked: false, rarity: 'epic', label: 'Sempurna 1 ronde' },
  { id: '10', name: 'Sultan', icon: '👑', unlocked: false, rarity: 'legendary', label: 'Rank Sultan Arabic' },
];

const rarityBorder: Record<string, string> = {
  common: 'border-white/5 bg-white/5',
  rare: 'border-emerald-500/20 bg-emerald-500/10',
  epic: 'border-gold-400/20 bg-gold-400/10',
  legendary: 'border-gold-400/30 bg-gradient-to-b from-gold-400/15 to-transparent',
};

const unlockedBorder: Record<string, string> = {
  common: 'border-emerald-500/20 bg-emerald-500/10',
  rare: 'border-emerald-500/30 bg-emerald-500/15',
  epic: 'border-gold-400/30 bg-gold-400/15',
  legendary: 'border-gold-400/40 bg-gradient-to-b from-gold-400/20 to-emerald-500/10',
};

export function AchievementShowcase() {
  const unlocked = badges.filter((b) => b.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.15 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Pencapaian</p>
        <span className="text-micro text-text-tertiary">{unlocked}/{badges.length}</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springPresets.gentle, delay: 0.15 + i * 0.025 }}
            whileTap={{ scale: 0.93 }}
            className={cn(
              'flex flex-col items-center gap-1.5 shrink-0 w-[76px] py-3 px-2 rounded-xl border',
              badge.unlocked ? unlockedBorder[badge.rarity] : rarityBorder[badge.rarity],
              !badge.unlocked && 'opacity-50',
            )}
            title={badge.label}
          >
            <span className={cn('text-2xl', !badge.unlocked && 'grayscale opacity-50')}>
              {badge.icon}
            </span>
            <p className={cn(
              'text-micro font-semibold text-center leading-tight',
              badge.unlocked ? 'text-text-primary' : 'text-text-tertiary',
            )}>
              {badge.name}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
