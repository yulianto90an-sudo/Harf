'use client';

import { useSwipeStore } from '@/stores/swipeStore';
import { AnimatePresence } from 'framer-motion';
import { VocabCard } from './VocabCard';

const STACK_SIZE = 3;

export function CardStack() {
  const words = useSwipeStore((s) => s.words);
  const currentIndex = useSwipeStore((s) => s.currentIndex);

  const remainingWords = words.slice(currentIndex);
  const visibleWords = remainingWords.slice(0, STACK_SIZE);
  const topKey = visibleWords[0]?.id;

  if (visibleWords.length === 0) return null;

  return (
    <div className="relative w-full flex-1 mx-auto max-w-sm" style={{ minHeight: 420 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <AnimatePresence mode="popLayout">
            <VocabCard
              key={topKey}
              word={visibleWords[0]}
              index={currentIndex}
              isTop={true}
              stackOffset={0}
            />
          </AnimatePresence>

          {visibleWords.slice(1).map((word, i) => (
            <VocabCard
              key={word.id}
              word={word}
              index={currentIndex + i + 1}
              isTop={false}
              stackOffset={i + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
