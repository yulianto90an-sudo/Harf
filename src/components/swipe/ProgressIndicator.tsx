'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useSwipeStore } from '@/stores/swipeStore';
import { springPresets } from '@/animations/presets';

export function ProgressIndicator() {
  const words = useSwipeStore((s) => s.words);
  const currentIndex = useSwipeStore((s) => s.currentIndex);
  const results = useSwipeStore((s) => s.results);

  return (
    <div className="relative z-20 flex justify-center gap-1.5 px-6 py-2">
      {words.map((word, i) => {
        const isActive = i === currentIndex;
        const isPast = i < currentIndex;
        const result = results[i];
        const isCorrect = result === 'correct';
        const isIncorrect = result === 'incorrect';

        return (
          <motion.div
            key={word.id}
            initial={{ scale: 0 }}
            animate={{
              scale: isActive ? 1.2 : 1,
              opacity: isActive ? 1 : isPast ? 0.6 : 0.4,
            }}
            transition={springPresets.gentle}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              isActive && 'w-6 bg-emerald-400 shadow-sm shadow-emerald-400/50',
              isCorrect && '!bg-emerald-500 w-3',
              isIncorrect && '!bg-error w-3',
              !isActive && !isPast && 'w-2 bg-white/10',
              isPast && !isCorrect && !isIncorrect && 'w-2 bg-white/20',
            )}
          />
        );
      })}
    </div>
  );
}
