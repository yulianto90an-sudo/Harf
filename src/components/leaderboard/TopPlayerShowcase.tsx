'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

export function TopPlayerShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/10 via-bg-elevated to-bg-card"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl" />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-label text-gold-400 font-bold">Pemain Teratas</p>
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xl"
          >
            👑
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springPresets.bouncy, delay: 0.35 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-display-2 font-bold text-text-primary shadow-xl shadow-gold-500/30">
              A
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center">
              <span className="text-xs">👑</span>
            </div>
          </motion.div>

          <div className="flex-1">
            <p className="text-body-bold text-text-primary font-extrabold">Amirah</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">🥇</span>
              <span className="text-label font-bold text-gold-400">Gold League</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-micro text-text-tertiary">🔥 14 hari</span>
              <span className="text-micro text-text-tertiary">📖 234 kata</span>
              <span className="text-micro text-emerald-400 font-semibold">3.520 XP</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {['🏆', '💎', '⚡', '📚'].map((badge, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35 + i * 0.04, ...springPresets.bouncy }}
              className="w-9 h-9 rounded-lg bg-gold-400/15 border border-gold-400/20 flex items-center justify-center"
            >
              {badge}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
