import type { Transition } from 'framer-motion';

export const springPresets = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 25, mass: 0.5 },
  bouncy: { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.5 },
  gentle: { type: 'spring' as const, stiffness: 150, damping: 20, mass: 1 },
  smooth: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 1 },
  wobbly: { type: 'spring' as const, stiffness: 80, damping: 10, mass: 1 },
} satisfies Record<string, Transition>;

export const tweenPresets = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.25, ease: 'easeOut' },
  slow: { duration: 0.4, ease: 'easeOut' },
  expressive: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
} satisfies Record<string, Transition>;
