'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type CardVariant = 'default' | 'elevated' | 'compact';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  isPressable?: boolean;
  isGlowing?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-bg-card shadow-card border border-white/[0.04]',
  elevated: 'bg-bg-elevated shadow-xl border border-white/[0.06]',
  compact: 'bg-bg-card shadow-card border border-white/[0.04]',
};

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  variant = 'default',
  padding = 'md',
  isPressable = false,
  isGlowing = false,
  children,
  onClick,
  className,
}: CardProps) {
  const Component = isPressable ? motion.button : motion.div;
  const motionProps = isPressable
    ? {
        whileTap: { scale: 0.98 },
        whileHover: { scale: 1.01 },
        onClick,
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-xl',
        variantStyles[variant],
        paddingStyles[padding],
        isGlowing && 'shadow-glow-emerald',
        isPressable && 'cursor-pointer tap-highlight-transparent text-left w-full',
        className,
      )}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
