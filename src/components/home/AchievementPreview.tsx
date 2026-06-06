'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  progress?: { current: number; target: number };
}

const achievements: Achievement[] = [
  { id: 'first_swipe', name: 'Pertama Kali', icon: '👆', unlocked: true },
  { id: 'streak_7', name: '7 Hari', icon: '🔥', unlocked: true },
  { id: 'battle_10', name: 'Petarung', icon: '⚔️', unlocked: true },
  { id: 'words_50', name: 'Kosakata', icon: '📖', unlocked: true },
  { id: 'speed_demon', name: 'Kilat', icon: '⚡', unlocked: false, progress: { current: 7, target: 10 } },
  { id: 'perfectionist', name: 'Sempurna', icon: '💎', unlocked: false, progress: { current: 3, target: 5 } },
  { id: 'legend', name: 'Legenda', icon: '👑', unlocked: false, progress: { current: 1, target: 3 } },
];

export function AchievementPreview() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-heading-2 text-text-primary font-bold">Pencapaian</h2>
        <span className="text-micro text-text-tertiary font-medium">
          {achievements.filter((a) => a.unlocked).length}/{achievements.length}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4"
      >
        {achievements.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springPresets.gentle, delay: 0.4 + i * 0.03 }}
            whileTap={{ scale: 0.93 }}
            className={cn(
              'flex flex-col items-center gap-1.5 shrink-0 w-[72px] py-2.5 px-1.5 rounded-xl border',
              badge.unlocked
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-white/[0.03] border-white/[0.04] opacity-50',
            )}
          >
            <span className="text-lg">{badge.icon}</span>
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
      </motion.div>
    </section>
  );
}
