'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'gold' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 text-white shadow-glow-emerald hover:bg-emerald-400 active:bg-emerald-600',
  secondary: 'bg-white/[0.04] text-text-primary border border-white/[0.08] hover:bg-white/[0.08] active:bg-white/[0.12]',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary active:text-text-primary',
  danger: 'bg-error text-white shadow-lg hover:opacity-90 active:opacity-80',
  success: 'bg-success text-white shadow-lg hover:opacity-90 active:opacity-80',
  gold: 'bg-gold-400 text-black hover:bg-gold-300 active:bg-gold-500 shadow-glow-gold',
  outline: 'bg-transparent text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/10 active:bg-emerald-500/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-micro gap-1.5',
  md: 'h-11 px-5 text-label gap-2',
  lg: 'h-13 px-6 text-body-bold gap-2.5',
  xl: 'h-15 px-8 text-body-bold gap-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  children,
  onClick,
  className,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold',
        'tap-highlight-transparent select-none',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (isDisabled || isLoading) && 'opacity-40 cursor-not-allowed pointer-events-none',
        className,
      )}
      whileTap={!isDisabled && !isLoading ? { scale: 0.96 } : undefined}
      transition={springPresets.snappy}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && !isLoading && <span className="shrink-0">{icon}</span>}
    </motion.button>
  );
}
