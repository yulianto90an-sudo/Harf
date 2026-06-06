'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { toastEnter } from '@/animations/variants';
import { tweenPresets } from '@/animations/presets';
import type { ToastConfig } from '@/types/ui';

interface ToastProps {
  toast: ToastConfig | null;
  onDismiss: () => void;
}

const typeStyles: Record<string, string> = {
  success: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  error: 'bg-error/10 border-error/25 text-error',
  info: 'bg-info/10 border-info/25 text-info',
  warning: 'bg-warning/10 border-warning/25 text-warning',
};

const typeIcons: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className={cn(
            'fixed bottom-24 left-1/2 -translate-x-1/2 z-50',
            'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl',
            'min-w-[280px] max-w-sm shadow-xl',
            'cursor-pointer select-none',
            typeStyles[toast.type],
          )}
          variants={toastEnter}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={tweenPresets.normal}
          onClick={onDismiss}
          role="alert"
          aria-live="assertive"
        >
          <span className="text-lg font-bold shrink-0">{typeIcons[toast.type]}</span>
          <p className="flex-1 text-body-small font-medium">{toast.message}</p>
          {toast.action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.action!.onClick();
                onDismiss();
              }}
              className="text-label font-bold underline shrink-0 opacity-80 hover:opacity-100"
            >
              {toast.action.label}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
