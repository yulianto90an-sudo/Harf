'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { springPresets, tweenPresets } from '@/animations/presets';
import { fadeIn } from '@/animations/variants';
import { cn } from '@/utils/cn';

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.25 + i * 0.07, ...springPresets.gentle },
  }),
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, continueAsGuest } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Semua field wajib diisi');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    if (!agreed) {
      setError('Setujui Syarat & Ketentuan untuk melanjutkan');
      return;
    }

    setIsLoading(true);
    try {
      await register(form.email, form.password, form.name);
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal daftar. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    router.push('/');
  };

  return (
    <motion.div
      className="flex flex-col min-h-full"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={tweenPresets.normal}
    >
      <motion.button
        onClick={() => router.back()}
        className="self-start flex items-center gap-1.5 text-body-small text-text-secondary hover:text-text-primary transition-colors mb-8"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springPresets.gentle}
      >
        <ChevronLeftIcon />
        Kembali
      </motion.button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-6">
        <motion.div
          className="text-center space-y-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.gentle}
        >
          <p className="text-micro tracking-[0.2em] text-text-tertiary font-semibold">H A R F</p>
          <h1 className="text-display-2 text-text-primary font-bold">Buat akun baru</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Nama lengkap', icon: <UserIcon />, placeholder: 'Nama kamu', type: 'text', autoComplete: 'name' },
            { key: 'email', label: 'Email', icon: <MailIcon />, placeholder: 'email@example.com', type: 'email', autoComplete: 'email', inputMode: 'email' as const },
            { key: 'password', label: 'Password', icon: <LockIcon />, placeholder: 'Min. 6 karakter', type: 'password', autoComplete: 'new-password' },
            { key: 'confirmPassword', label: 'Konfirmasi password', icon: <LockIcon />, placeholder: 'Ulangi password', type: 'password', autoComplete: 'new-password' },
          ].map((field, i) => (
            <motion.div
              key={field.key}
              custom={i}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1.5"
            >
              <label className="text-label text-text-secondary block">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{field.icon}</span>
                <input
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  inputMode={field.inputMode}
                  className={cn(
                    'w-full h-13 pl-10 pr-3.5 rounded-xl',
                    'bg-white/[0.04] border border-white/[0.04] text-text-primary',
                    'text-body placeholder:text-text-disabled',
                    'focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20',
                    'transition-all duration-200',
                  )}
                />
              </div>
            </motion.div>
          ))}

          <motion.div
            custom={4}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="flex items-start gap-3"
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={agreed}
              onClick={() => setAgreed(!agreed)}
              className={cn(
                'w-5 h-5 rounded-lg mt-0.5 shrink-0 flex items-center justify-center',
                'border transition-all duration-200',
                'tap-highlight-transparent select-none',
                agreed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'bg-white/[0.04] border-white/[0.04]',
              )}
            >
              {agreed && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <p className="text-micro text-text-tertiary leading-relaxed">
              Saya setuju dengan{' '}
              <span className="text-emerald-400">Syarat &amp; Ketentuan</span>
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={springPresets.snappy}
                className="text-body-small text-error font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            custom={5}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full h-13 rounded-xl flex items-center justify-center gap-2',
              'text-body-bold font-semibold text-white',
              'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600',
              'shadow-glow-emerald/50 transition-all duration-150',
              'tap-highlight-transparent select-none',
              isLoading && 'opacity-60 pointer-events-none',
            )}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mendaftar...
              </>
            ) : (
              'Daftar'
            )}
          </motion.button>
        </form>

        <motion.div
          custom={6}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-3"
        >
          <Link
            href="/login"
            className="text-body-small text-text-secondary hover:text-text-primary transition-colors"
          >
            Sudah punya akun?{' '}
            <span className="text-emerald-400 font-semibold">Masuk</span>
          </Link>

          <button
            onClick={handleGuest}
            disabled={isLoading}
            className="text-micro text-text-tertiary hover:text-text-secondary transition-colors font-medium"
          >
            Nanti aja (Guest)
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
