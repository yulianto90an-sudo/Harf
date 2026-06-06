'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { pageTransition } from '@/animations/variants';
import { tweenPresets } from '@/animations/presets';

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenContainer({ children, className }: ScreenContainerProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={tweenPresets.normal}
      className={cn('pt-2', className)}
    >
      {children}
    </motion.div>
  );
}
