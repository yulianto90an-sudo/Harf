'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

function calculateTimeLeft() {
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  const diff = endOfWeek.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { days, hours, minutes, total: diff };
}

export function WeeklyCountdown() {
  const { days, hours, minutes } = calculateTimeLeft();
  const isUrgent = days === 0 && hours < 6;

  const segments = [
    { value: days, label: 'Hari' },
    { value: hours, label: 'Jam' },
    { value: minutes, label: 'Menit' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.4 }}
      className={cn(
        'rounded-2xl p-5 border',
        isUrgent
          ? 'bg-error/10 border-error/30'
          : 'bg-gradient-to-br from-bg-elevated to-bg-card border-white/5',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-label font-semibold uppercase tracking-wider text-text-tertiary">Reset Mingguan</p>
        {isUrgent && (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="text-micro text-error font-bold"
          >
            ⚠️ Sisa sedikit!
          </motion.span>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        {segments.map((seg, i) => (
          <motion.div
            key={seg.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05, ...springPresets.bouncy }}
            className="flex flex-col items-center"
          >
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center',
              isUrgent ? 'bg-error/15 border border-error/30' : 'bg-white/5 border border-white/10',
            )}>
              <span className={cn(
                'text-display-2 font-extrabold',
                isUrgent ? 'text-error' : 'text-text-primary',
              )}>
                {String(seg.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-micro text-text-tertiary mt-1">{seg.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 mt-3 text-micro text-text-tertiary">
        <span className={cn('w-2 h-2 rounded-full', isUrgent ? 'bg-error animate-pulse' : 'bg-emerald-500')} />
        <span>Peringkat akan direset</span>
      </div>
    </motion.div>
  );
}
