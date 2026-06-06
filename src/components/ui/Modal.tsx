'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets, tweenPresets } from '@/animations/presets';
import { modalBackdrop, modalContent } from '@/animations/variants';
import { Button } from './Button';

type ModalVariant = 'center' | 'bottom-sheet';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: ModalVariant;
  showClose?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = 'center',
  showClose = true,
  className,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={tweenPresets.fast}
        >
          <motion.div
            className="absolute inset-0 bg-bg-overlay backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className={cn(
              'relative z-10 w-full bg-bg-elevated border border-white/[0.06] shadow-xl',
              variant === 'center' ? 'max-w-sm rounded-2xl p-5' : 'rounded-t-2xl p-5 pb-safe-bottom mt-auto max-w-lg',
              className,
            )}
            variants={variant === 'center' ? modalContent : undefined}
            initial={variant === 'center' ? 'hidden' : { y: '100%' }}
            animate={variant === 'center' ? 'visible' : { y: 0 }}
            exit={variant === 'center' ? 'exit' : { y: '100%' }}
            transition={springPresets.gentle}
          >
            {(title || showClose) && (
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 className="text-heading-2 text-text-primary font-semibold">{title}</h2>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Tutup"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors tap-highlight-transparent"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
