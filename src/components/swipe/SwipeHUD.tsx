'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useSwipeStore } from '@/stores/swipeStore';
import { springPresets } from '@/animations/presets';

export function SwipeHUD() {
  const router = useRouter();
  const combo = useSwipeStore((s) => s.combo);
  const xpEarned = useSwipeStore((s) => s.xpEarned);
  const currentIndex = useSwipeStore((s) => s.currentIndex);
  const words = useSwipeStore((s) => s.words);
  const maxCombo = useSwipeStore((s) => s.maxCombo);
  const endSession = useSwipeStore((s) => s.endSession);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative z-30 mx-2 mt-2 rounded-2xl bg-bg-elevated/60 backdrop-blur-xl border border-white/[0.04] shadow-lg"
    >
      <div className="flex items-center justify-between px-4 py-2.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={springPresets.snappy}
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center"
            aria-label="Kembali"
          >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="text-text-secondary"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>

        <div className="flex items-center gap-1.5">
          <div className={cn(
            'flex items-center gap-1.5 h-7 px-2.5 rounded-full',
            combo >= 5 ? 'bg-gold-400/10' : combo >= 3 ? 'bg-emerald-500/10' : 'bg-white/5',
          )}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={combo >= 5 ? 'text-gold-400' : combo >= 3 ? 'text-emerald-400' : 'text-text-secondary'}
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className={cn(
              'text-micro font-bold',
              combo >= 5 ? 'text-gold-400' : combo >= 3 ? 'text-emerald-400' : 'text-text-primary',
            )}>
              {combo > 0 ? `x${combo}` : 'x0'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-emerald-500/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-emerald-400"
            >
              <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="text-micro font-bold text-emerald-400">+{xpEarned}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-micro text-text-tertiary font-medium">
            {Math.min(currentIndex + 1, words.length)}/{words.length}
          </span>
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${words.length > 0 ? ((currentIndex) / words.length) * 100 : 0}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
