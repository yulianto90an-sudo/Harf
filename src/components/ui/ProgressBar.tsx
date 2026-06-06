'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { tweenPresets } from '@/animations/presets';

type ProgressVariant = 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'xp';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  isAnimated?: boolean;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const variantStyles: Record<ProgressVariant, string> = {
  default: 'bg-emerald-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-error',
  gold: 'bg-gold-400',
  xp: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max,
  variant = 'default',
  size = 'md',
  isAnimated = true,
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-micro text-text-secondary font-medium">{label}</span>}
          {showLabel && (
            <span className="text-micro text-text-tertiary">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-white/[0.06] rounded-full overflow-hidden',
          sizeStyles[size],
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          className={cn('h-full rounded-full', variantStyles[variant])}
          initial={isAnimated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={isAnimated ? tweenPresets.normal : { duration: 0 }}
        />
      </div>
    </div>
  );
}
