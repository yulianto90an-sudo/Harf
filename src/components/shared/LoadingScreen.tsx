'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({
  message = 'Memuat...',
  fullScreen = false,
  className,
}: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen ? 'fixed inset-0 z-50 bg-bg-primary' : 'py-24',
        className,
      )}
    >
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <div className="absolute inset-1 border-2 border-emerald-500/20 border-b-emerald-500 rounded-full animate-spin animation-duration-1.5s" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      <p className="text-body-small text-text-tertiary font-medium">{message}</p>
    </motion.div>
  );
}
