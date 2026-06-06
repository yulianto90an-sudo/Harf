'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <motion.p
      key={value}
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springPresets.bouncy}
      className="text-xp-value font-extrabold text-text-primary"
    >
      {value.toLocaleString()}{suffix}
    </motion.p>
  );
}

export function XpSection() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const dailyXp = 120;
  const weeklyXp = profile.weeklyXP;
  const weeklyAvg = Math.round(weeklyXp / Math.max(1, profile.currentStreak));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.1 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">XP Overview</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-micro text-text-tertiary mb-1">Total</p>
          <AnimatedCounter value={profile.xp} />
        </div>
        <div className="text-center">
          <p className="text-micro text-text-tertiary mb-1">Hari Ini</p>
          <AnimatedCounter value={dailyXp} />
        </div>
        <div className="text-center">
          <p className="text-micro text-text-tertiary mb-1">Minggu Ini</p>
          <AnimatedCounter value={weeklyXp} />
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/5">
        <span className="text-micro text-text-secondary">Rata-rata harian</span>
        <span className="text-label font-bold text-emerald-400">{weeklyAvg} XP/hari</span>
      </div>
    </motion.div>
  );
}
