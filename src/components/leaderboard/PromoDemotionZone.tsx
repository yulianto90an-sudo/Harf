'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

const PROMO_XP = 3200;
const DANGER_XP = 2600;
const USER_XP = 2840;

export function PromoDemotionZone() {
  const promoProgress = Math.min((USER_XP - DANGER_XP) / (PROMO_XP - DANGER_XP), 1);
  const inDanger = USER_XP <= DANGER_XP + 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5 overflow-hidden"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Zona Kompetitif</p>

      <div className="relative mb-4">
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-gradient-to-r from-error/30 to-warning/30" />
            <div className="flex-1 bg-gradient-to-r from-warning/30 to-emerald-500/30" />
            <div className="flex-1 bg-gradient-to-r from-emerald-500/30 to-gold-400/30" />
          </div>
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-text-primary border-2 border-emerald-500 shadow-lg"
            initial={{ left: '0%' }}
            animate={{ left: `${promoProgress * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ marginLeft: -10 }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-micro text-error font-semibold">Degradasi</span>
          <span className="text-micro text-warning font-semibold">Zona Aman</span>
          <span className="text-micro text-emerald-400 font-semibold">Promosi</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className={cn(
            'rounded-xl p-3.5 border',
            inDanger
              ? 'bg-error/10 border-error/30 shadow-glow-streak'
              : 'bg-emerald-500/10 border-emerald-500/20',
          )}
        >
          <p className={cn('text-label font-bold', inDanger ? 'text-error' : 'text-emerald-400')}>
            {inDanger ? '⚠️ Bahaya!' : '✅ Aman'}
          </p>
          <p className="text-micro text-text-tertiary mt-0.5">
            {inDanger ? 'Kamu bisa turun peringkat!' : `${(USER_XP - DANGER_XP).toLocaleString()} XP dari degradasi`}
          </p>
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.97 }}
          className="rounded-xl p-3.5 border border-gold-400/20 bg-gold-400/10"
        >
          <p className="text-label font-bold text-gold-400">🏆 Promosi</p>
          <p className="text-micro text-text-tertiary mt-0.5">
            {(PROMO_XP - USER_XP).toLocaleString()} XP lagi ke rank berikutnya
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
