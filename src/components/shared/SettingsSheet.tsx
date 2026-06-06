'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { springPresets } from '@/animations/presets';
import { cn } from '@/utils/cn';
import { useUIStore } from '@/stores/uiStore';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToggleRowProps {
  icon: string;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, label, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center h-12 px-1 border-b border-white/5 last:border-0">
      <span className="text-lg mr-3 shrink-0">{icon}</span>
      <span className="text-body-small text-text-primary flex-1">{label}</span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={cn(
          'w-11 h-6 rounded-full p-0.5 transition-colors duration-200',
          'tap-highlight-transparent select-none',
          enabled ? 'bg-emerald-500' : 'bg-white/10',
        )}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{ x: enabled ? 22 : 0 }}
          transition={springPresets.snappy}
        />
      </button>
    </div>
  );
}

interface NavRowProps {
  icon: string;
  label: string;
  subtitle?: string;
  danger?: boolean;
  onClick?: () => void;
}

function NavRow({ icon, label, subtitle, danger, onClick }: NavRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center h-12 px-1 border-b border-white/5 last:border-0 w-full text-left"
    >
      <span className="text-lg mr-3 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className={cn('text-body-small', danger ? 'text-error' : 'text-text-primary')}>
          {label}
        </span>
        {subtitle && (
          <span className="text-micro text-text-tertiary ml-2">{subtitle}</span>
        )}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

const sectionTitle = 'text-micro text-text-tertiary font-semibold tracking-wider uppercase mb-1 px-1';

export function SettingsSheet({ isOpen, onClose }: SettingsSheetProps) {
  const {
    theme, soundEnabled, musicEnabled,
    toggleTheme, toggleSound, toggleMusic,
  } = useUIStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springPresets.snappy}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-50"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-bg-surface rounded-t-xl max-h-[85vh] overflow-y-auto pb-safe-bottom">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-8 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="px-5 pb-6 space-y-6">
                <h2 className="text-heading-2 text-text-primary font-semibold text-center">
                  ⚙️ Pengaturan
                </h2>

                <div>
                  <p className={sectionTitle}>TAMPILAN</p>
                  <div className="bg-white/5 rounded-xl px-4">
                    <ToggleRow icon="🌙" label="Tema Gelap" enabled={theme === 'dark'} onToggle={toggleTheme} />
                    <NavRow icon="🔤" label="Ukuran Font" subtitle="Normal" />
                  </div>
                </div>

                <div>
                  <p className={sectionTitle}>AUDIO</p>
                  <div className="bg-white/5 rounded-xl px-4">
                    <ToggleRow icon="🔊" label="Suara Efek" enabled={soundEnabled} onToggle={toggleSound} />
                    <ToggleRow icon="🎵" label="Musik Latar" enabled={musicEnabled} onToggle={toggleMusic} />
                    <NavRow icon="🔊" label="Volume" subtitle="80%" />
                  </div>
                </div>

                <div>
                  <p className={sectionTitle}>NOTIFIKASI</p>
                  <div className="bg-white/5 rounded-xl px-4">
                    <ToggleRow icon="🔥" label="Pengingat Streak" enabled={true} onToggle={() => {}} />
                    <ToggleRow icon="📋" label="Misi Harian" enabled={true} onToggle={() => {}} />
                    <ToggleRow icon="🏆" label="Update Peringkat" enabled={false} onToggle={() => {}} />
                    <ToggleRow icon="📤" label="Aktivitas Teman" enabled={false} onToggle={() => {}} />
                  </div>
                </div>

                <div>
                  <p className={sectionTitle}>BAHASA</p>
                  <div className="bg-white/5 rounded-xl px-4">
                    <NavRow icon="🌐" label="Bahasa Aplikasi" subtitle="Indonesia" />
                    <NavRow icon="📖" label="Bahasa Target" subtitle="Arab" />
                  </div>
                </div>

                <div>
                  <p className={sectionTitle}>AKUN</p>
                  <div className="bg-white/5 rounded-xl px-4">
                    <NavRow icon="👤" label="Edit Profil" />
                    <NavRow icon="🔗" label="Hubungkan Akun" />
                    <NavRow icon="🗑️" label="Hapus Data Belajar" danger />
                  </div>
                </div>

                <div>
                  <p className={sectionTitle}>PRIVASI</p>
                  <div className="bg-white/5 rounded-xl px-4">
                    <ToggleRow icon="👁️" label="Profil Publik" enabled={true} onToggle={() => {}} />
                    <ToggleRow icon="🔒" label="Tampil di Leaderboard" enabled={true} onToggle={() => {}} />
                  </div>
                </div>

                <p className="text-micro text-text-tertiary text-center">Versi 1.0.0</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
