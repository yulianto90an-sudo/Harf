'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

const themes = [
  { id: 'default', label: 'Default', gradient: 'from-emerald-500 to-emerald-600' },
  { id: 'gold', label: 'Gold', gradient: 'from-gold-400 to-gold-600' },
  { id: 'navy', label: 'Navy', gradient: 'from-info to-blue-700' },
  { id: 'purple', label: 'Violet', gradient: 'from-purple-500 to-purple-700' },
];

const avatars = ['M', 'A', 'S', 'R', 'N', 'L'];
const banners = [
  { id: 'b1', gradient: 'from-emerald-500/20 via-bg-card to-bg-card' },
  { id: 'b2', gradient: 'from-gold-400/15 via-bg-card to-bg-card' },
  { id: 'b3', gradient: 'from-info/15 via-bg-card to-bg-card' },
  { id: 'b4', gradient: 'from-purple-500/15 via-bg-card to-bg-card' },
];

export function Personalization() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.2 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Personalisasi</p>

      <div className="space-y-4">
        <div>
          <p className="text-micro text-text-secondary mb-2">Avatar</p>
          <div className="flex gap-2">
            {avatars.map((a, i) => (
              <motion.button
                key={a}
                whileTap={{ scale: 0.9 }}
                transition={springPresets.snappy}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-label font-bold border-2',
                  i === 0 ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-white/10 bg-white/5 text-text-secondary',
                )}
              >
                {a}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-micro text-text-secondary mb-2">Tema Profil</p>
          <div className="flex gap-2">
            {themes.map((t) => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.9 }}
                transition={springPresets.snappy}
                className={cn(
                  'w-10 h-10 rounded-xl border-2',
                  t.gradient,
                  t.id === 'default' ? 'border-emerald-400' : 'border-white/10',
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-micro text-text-secondary mb-2">Banner</p>
          <div className="flex gap-2">
            {banners.map((b, i) => (
              <motion.button
                key={b.id}
                whileTap={{ scale: 0.9 }}
                transition={springPresets.snappy}
                className={cn(
                  'w-16 h-8 rounded-lg border-2 bg-gradient-to-r',
                  b.gradient,
                  i === 0 ? 'border-emerald-500' : 'border-white/10',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
