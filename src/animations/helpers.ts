import { springPresets, tweenPresets } from './presets';
import type { Transition } from 'framer-motion';

type AnimationQuality = 'low' | 'mid' | 'high';

export function getAnimationQuality(): AnimationQuality {
  if (typeof window === 'undefined') return 'high';

  const mem = (navigator as any).deviceMemory;
  if (mem && mem <= 2) return 'low';

  const cores = navigator.hardwareConcurrency;
  if (cores && cores <= 4) return 'mid';

  return 'high';
}

export function getResponsiveTransition(quality: AnimationQuality): Transition {
  switch (quality) {
    case 'low':
      return tweenPresets.fast;
    case 'mid':
      return tweenPresets.normal;
    case 'high':
      return springPresets.snappy;
  }
}

export function shouldReduceParticles(quality: AnimationQuality): number {
  switch (quality) {
    case 'low': return 0;
    case 'mid': return 5;
    case 'high': return 20;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
