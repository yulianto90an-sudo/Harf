'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { tweenPresets } from '@/animations/presets';

interface HPBarProps {
  current: number;
  max: number;
  side: 'player' | 'enemy';
  label: string;
  color?: string;
  isFlashing?: boolean;
}

const sideConfig = {
  player: { align: 'items-start' as const, barDir: 'left-to-right' as const },
  enemy: { align: 'items-end' as const, barDir: 'right-to-left' as const },
};

export function HPBar({ current, max, side, label, color, isFlashing }: HPBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isLow = percentage <= 25;
  const config = sideConfig[side];

  const barColor = color ?? (side === 'player' ? '#10B981' : '#EF4444');

  return (
    <div className={cn('flex flex-col gap-1 w-full', config.align)}>
      <div className="flex items-center gap-2">
        <span className="text-micro text-text-secondary font-semibold">{label}</span>
        <span className={cn(
          'text-micro font-bold',
          isLow ? 'text-error' : 'text-text-primary',
        )}>
          {current}/{max}
        </span>
      </div>
      <div className={cn(
        'relative w-full h-2 bg-white/5 rounded-full overflow-hidden',
        side === 'enemy' && 'transform',
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full',
            isLow && side === 'player' ? 'shadow-glow-streak' : '',
          )}
          style={{
            background: isLow && side === 'player'
              ? 'linear-gradient(90deg, #EF4444, #DC2626)'
              : `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
            boxShadow: isLow && side === 'player' ? '0 0 15px rgba(239,68,68,0.5)' : undefined,
            transformOrigin: side === 'enemy' ? 'right center' : 'left center',
          }}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={tweenPresets.slow}
        />
        {isFlashing && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.3, repeat: 2 }}
          />
        )}
      </div>
    </div>
  );
}
