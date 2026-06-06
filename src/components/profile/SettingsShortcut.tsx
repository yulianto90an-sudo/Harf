'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';
import { SettingsSheet } from '@/components/shared/SettingsSheet';

const settings = [
  { icon: '🎨', label: 'Tampilan', desc: 'Tema, mode gelap/terang' },
  { icon: '🔔', label: 'Notifikasi', desc: 'Streak, pengingat belajar' },
  { icon: '🌐', label: 'Bahasa', desc: 'Indonesia, English, العربية' },
  { icon: '🎵', label: 'Audio', desc: 'Volume, kecepatan, efek suara' },
  { icon: '🔒', label: 'Akun', desc: 'Keamanan, privasi, data' },
] as const;

export function SettingsShortcut() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPresets.gentle, delay: 0.25 }}
        className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
      >
        <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-3">Pengaturan</p>

        <div className="flex flex-col gap-1">
          {settings.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.03, ...springPresets.gentle }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors tap-highlight-transparent"
            >
              <span className="text-lg w-8 text-center">{item.icon}</span>
              <div className="flex-1 text-left min-w-0">
                <p className="text-label font-semibold text-text-primary">{item.label}</p>
                <p className="text-micro text-text-tertiary truncate">{item.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <SettingsSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
