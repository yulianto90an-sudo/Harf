'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { fadeIn, slideUp, slideDown, scaleIn } from '@/animations/variants';
import { tweenPresets } from '@/animations/presets';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: AnimatedWrapperProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...tweenPresets.normal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, className }: AnimatedWrapperProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...tweenPresets.normal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideDown({ children, delay = 0, className }: AnimatedWrapperProps) {
  return (
    <motion.div
      variants={slideDown}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...tweenPresets.normal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, className }: AnimatedWrapperProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...tweenPresets.normal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
