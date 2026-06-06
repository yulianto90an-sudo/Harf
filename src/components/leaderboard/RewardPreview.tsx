'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

const rewards = [
  { icon: '⭐', label: 'Bonus XP', value: '+500 XP', color: 'from-emerald-500/10 border-emerald-500/20 text-emerald-400' },
  { icon: '🔥', label: 'Streak Shield', value: '1 Freeze', color: 'from-warning/10 border-warning/20 text-warning' },
  { icon: '💎', label: 'Badge Langka', value: 'Top 10%', color: 'from-gold-400/10 border-gold-400/20 text-gold-400' },
  { icon: '🎫', label: 'Tiket Battle', value: '+3 Tiket', color: 'from-info/10 border-info/20 text-info' },
];

export function RewardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.35 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Hadiah Akhir Pekan</p>

      <div className="grid grid-cols-2 gap-2.5">
        {rewards.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.04, ...springPresets.gentle }}
            className={cn('rounded-xl p-3.5 border bg-gradient-to-br', r.color)}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{r.icon}</span>
              <p className="text-label font-bold">{r.value}</p>
            </div>
            <p className="text-micro text-text-tertiary">{r.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-3 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/20 text-center"
      >
        <p className="text-micro text-gold-400 font-semibold">
          Rank Gold+ mendapat hadiah tambahan!
        </p>
      </motion.div>
    </motion.div>
  );
}
