import { springPresets, tweenPresets } from './presets';

export const pageTransitionConfig = {
  type: 'tween' as const,
  duration: 0.25,
  ease: 'easeOut',
};

export const modalTransitionConfig = {
  ...springPresets.gentle,
};

export const toastTransitionConfig = {
  ...springPresets.snappy,
};

export const staggerChildren = (delay: number = 0.05) => ({
  visible: {
    transition: {
      staggerChildren: delay,
    },
  },
});

export const listItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};
