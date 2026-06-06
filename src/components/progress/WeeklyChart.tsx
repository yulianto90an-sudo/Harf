'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets, tweenPresets } from '@/animations/presets';

const DAYS_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function generateWeeklyData() {
  return [
    { day: 0, xp: 65, battles: 2, lessons: 1, label: 'Sen' },
    { day: 1, xp: 120, battles: 3, lessons: 2, label: 'Sel' },
    { day: 2, xp: 80, battles: 1, lessons: 1, label: 'Rab' },
    { day: 3, xp: 200, battles: 4, lessons: 3, label: 'Kam' },
    { day: 4, xp: 150, battles: 2, lessons: 2, label: 'Jum' },
    { day: 5, xp: 90, battles: 1, lessons: 1, label: 'Sab' },
    { day: 6, xp: 520, battles: 5, lessons: 4, label: 'Min' },
  ];
}

export function WeeklyChart() {
  const weeklyData = generateWeeklyData();
  const maxXp = Math.max(...weeklyData.map((d) => d.xp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Aktivitas Minggu Ini</p>

      <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
        {weeklyData.map((d, i) => {
          const height = maxXp > 0 ? (d.xp / maxXp) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${height}%`, opacity: 1 }}
                transition={{ ...tweenPresets.expressive, delay: 0.3 + i * 0.05 }}
                className={cn(
                  'w-full rounded-md bg-gradient-to-t from-emerald-600 to-emerald-400',
                  i === 6 && 'shadow-glow-emerald',
                )}
                style={{ minHeight: height > 0 ? 4 : 0 }}
              />
              <span className={cn(
                'text-micro',
                i === 6 ? 'text-emerald-400 font-semibold' : 'text-text-tertiary',
              )}>
                {d.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-micro text-text-tertiary">
        <span>Total: {weeklyData.reduce((a, b) => a + b.xp, 0).toLocaleString()} XP</span>
        <span>Rata-rata: {Math.round(weeklyData.reduce((a, b) => a + b.xp, 0) / 7)} XP/hari</span>
      </div>
    </motion.div>
  );
}
