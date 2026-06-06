'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { MascotExpression } from '@/constants/game';

interface MascotProps {
  expression?: MascotExpression;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 100,
};

export function Mascot({
  expression = 'idle',
  size = 'md',
  className,
  animate = true,
  onClick,
}: MascotProps) {
  const s = sizeMap[size];

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center cursor-pointer', className)}
      onClick={onClick}
      animate={animate ? { y: [0, -6, 0] } : undefined}
      transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
      style={{ width: s, height: s }}
    >
      <svg width={s} height={s} viewBox="0 0 60 60" fill="none">
        <circle
          cx="30"
          cy="30"
          r="18"
          className="fill-emerald-400/20 stroke-emerald-400"
          strokeWidth="2"
        />
        <ellipse
          cx="30"
          cy="30"
          rx="14"
          ry="12"
          className="fill-emerald-400/30"
        />
        {expression === 'happy' || expression === 'excited' || expression === 'proud' ? (
          <>
            <line x1="23" y1="26" x2="25" y2="26" stroke="#FEFCE8" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="26" x2="37" y2="26" stroke="#FEFCE8" strokeWidth="2" strokeLinecap="round" />
            <path d="M26 33 C28 36 32 36 34 33" stroke="#FEFCE8" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : expression === 'surprised' ? (
          <>
            <circle cx="25" cy="26" r="2" fill="#FEFCE8" />
            <circle cx="35" cy="26" r="2" fill="#FEFCE8" />
            <ellipse cx="30" cy="33" rx="2" ry="3" fill="#FEFCE8" />
          </>
        ) : (
          <>
            <circle cx="25" cy="26" r="2" fill="#FEFCE8" />
            <circle cx="35" cy="26" r="2" fill="#FEFCE8" />
            <path d="M27 33 C28 34 32 34 33 33" stroke="#FEFCE8" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    </motion.div>
  );
}
