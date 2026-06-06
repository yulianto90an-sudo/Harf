'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { springPresets, tweenPresets } from '@/animations/presets';
import { fadeIn } from '@/animations/variants';
import { cn } from '@/utils/cn';

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

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.3 + i * 0.08, ...springPresets.gentle },
  }),
};

export default function LoginPage() {
  const router = useRouter();
  const { login, continueAsGuest } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setError('');
    setIsLoading(true);
    try {
      const { createClient } = await import('@/services/supabase/client');
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) setError(error.message);
    } catch {
      setError('Gagal membuka Google login');
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
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-8">
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.gentle}
        >
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center shadow-glow-emerald/30">
              <span className="text-arabic-xl text-emerald-400 font-arabic leading-none" dir="rtl" lang="ar">
                حرف
              </span>
            </div>
          </div>
          <h1 className="text-display-1 text-text-primary font-extrabold tracking-tight">
            HARF
          </h1>
          <p className="text-body-small text-text-secondary">
            Belajar Bahasa Arab, Serasa Main Game
          </p>
        </motion.div>

        <div className="space-y-3">
          <motion.button
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading}
            className={cn(
              'w-full h-13 rounded-xl flex items-center justify-center gap-3',
              'text-body-bold font-semibold',
              'bg-white text-stone-900 border border-white/10',
              'hover:bg-stone-50 active:bg-stone-100 transition-all duration-150',
              'shadow-sm hover:shadow-md',
              'tap-highlight-transparent select-none',
              isLoading && 'opacity-40 pointer-events-none',
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Lanjut dengan Google
          </motion.button>

          <motion.button
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            onClick={() => handleSocialAuth('apple')}
            disabled={isLoading}
            className={cn(
              'w-full h-13 rounded-xl flex items-center justify-center gap-3',
              'text-body-bold font-semibold',
              'bg-white text-stone-900 border border-white/10',
              'hover:bg-stone-50 active:bg-stone-100 transition-all duration-150',
              'shadow-sm hover:shadow-md',
              'tap-highlight-transparent select-none',
              isLoading && 'opacity-40 pointer-events-none',
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Lanjut dengan Apple
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-micro text-text-tertiary font-medium">atau</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            <label className="text-label text-text-secondary block">Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                inputMode="email"
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

          <motion.div
            custom={3}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            <label className="text-label text-text-secondary block">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <LockIcon />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
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
            custom={4}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full h-13 rounded-xl flex items-center justify-center gap-2',
              'text-body-bold font-semibold text-white',
              'bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600',
              'shadow-glow-emerald/50',
              'transition-all duration-150',
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
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </motion.button>
        </form>

        <motion.div
          custom={5}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4"
        >
          <Link
            href="/forgot-password"
            className="text-body-small text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            Lupa password?
          </Link>

          <Link
            href="/register"
            className="text-body-small text-text-secondary hover:text-text-primary transition-colors"
          >
            Belum punya akun?{' '}
            <span className="text-emerald-400 font-semibold">Daftar</span>
          </Link>
        </motion.div>

        <motion.div
          custom={6}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
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
