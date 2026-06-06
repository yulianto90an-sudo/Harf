'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Yah, ada yang error!',
  message = 'Coba lagi, ya.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className,
      )}
    >
      <motion.span
        className="text-5xl block mb-5"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={springPresets.bouncy}
      >
        😅
      </motion.span>
      <h3 className="text-heading-2 text-text-primary font-semibold mb-2">{title}</h3>
      <p className="text-body-small text-text-secondary max-w-xs mb-6">{message}</p>
      {onRetry && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={springPresets.snappy}
          onClick={onRetry}
          className="px-6 py-3 bg-emerald-500 rounded-xl text-label font-semibold text-white shadow-glow-emerald hover:bg-emerald-400 active:bg-emerald-600 transition-colors"
        >
          Coba Lagi
        </motion.button>
      )}
    </motion.div>
  );
}
