'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function generateMonthDays() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  const days: { day: number; state: 'past' | 'today' | 'future'; active: boolean; frozen: boolean }[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isPast = date < new Date(year, month, today);
    const isToday = i === today;
    const isFuture = date > now;

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

    const active = isPast || isToday;

    days.push({
      day: i,
      state: isToday ? 'today' : isFuture ? 'future' : 'past',
      active: isPast,
      frozen: false,
    });
  }

  return { firstDay, days, month, year };
}

export function StreakCalendar() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const { firstDay, days, month, year } = generateMonthDays();
  const blanks = Array.from({ length: firstDay });

  const streakLevel = profile.currentStreak >= 30 ? 'legendary' : profile.currentStreak >= 14 ? 'epic' : profile.currentStreak >= 7 ? 'great' : profile.currentStreak >= 3 ? 'good' : 'ok';

  const streakColors: Record<string, string> = {
    ok: 'bg-emerald-500/40 border-emerald-500/30',
    good: 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/50',
    great: 'bg-emerald-500 border-emerald-400 shadow shadow-emerald-500/60',
    epic: 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-300 shadow-md shadow-emerald-500/70',
    legendary: 'bg-gradient-to-b from-gold-400 to-gold-600 border-gold-300 shadow-lg shadow-gold-500/60',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.15 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider">Streak</p>
        <div className="flex items-center gap-2">
          <motion.div
            animate={profile.currentStreak > 0 ? { scale: [1, 1.2, 1] } : undefined}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-warning/10 border border-warning/20"
          >
            <span className="text-sm">🔥</span>
            <span className="text-label font-bold text-warning">{profile.currentStreak}</span>
          </motion.div>
          <span className="text-micro text-text-tertiary">hari</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-body-bold text-text-primary">{MONTHS[month]} {year}</p>
        <div className="flex items-center gap-1">
          <span className="text-micro text-text-tertiary">Terpanjang:</span>
          <span className="text-micro font-bold text-text-primary">{profile.longestStreak} 🔥</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <p key={d} className="text-micro text-text-tertiary text-center py-1">{d}</p>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((d, i) => {
          const isActive = d.active && d.day <= profile.currentStreak;
          return (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.008, ...springPresets.gentle }}
              className={cn(
                'aspect-square rounded-lg flex items-center justify-center',
                'text-micro font-semibold',
                d.state === 'today' && !isActive && 'ring-2 ring-emerald-500',
                isActive && streakColors[streakLevel],
                !isActive && d.state === 'past' && 'bg-white/5 text-text-disabled',
                !isActive && d.state === 'future' && 'text-text-tertiary/30',
                !isActive && d.state === 'today' && 'bg-white/5 text-text-primary',
              )}
            >
              {d.day}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-micro text-text-tertiary">
          <span className="text-xs">🔥</span>
          <span>{profile.currentStreak} hari berturut-turut</span>
        </div>
        <div className="flex items-center gap-1.5 text-micro text-text-tertiary">
          <span className="text-xs">⭐</span>
          <span>Level {profile.level}</span>
        </div>
      </div>
    </motion.div>
  );
}
