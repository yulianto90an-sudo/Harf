'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { springPresets, tweenPresets } from '@/animations/presets';
import { fadeIn } from '@/animations/variants';
import { cn } from '@/utils/cn';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Masukkan email kamu');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSent(true);
    } catch {
      setError('Gagal mengirim. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-full"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={tweenPresets.normal}
    >
      <Link
        href="/login"
        className="self-start flex items-center gap-1.5 text-body-small text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ChevronLeftIcon />
        Kembali
      </Link>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full gap-6">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={springPresets.gentle}
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4 border border-white/[0.04]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h1 className="text-display-2 text-text-primary font-bold">Lupa password?</h1>
                <p className="text-body-small text-text-secondary">
                  Masukkan email untuk link reset password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
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
                </div>

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

                <button
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
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Link Reset'
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPresets.bouncy}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto shadow-glow-emerald/30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </motion.div>
              <h1 className="text-display-2 text-text-primary font-bold">Cek email kamu</h1>
              <p className="text-body-small text-text-secondary">
                Link reset password sudah dikirim ke{' '}
                <span className="text-emerald-400 font-medium">{email}</span>
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-body-small text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                ← Kembali ke login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
