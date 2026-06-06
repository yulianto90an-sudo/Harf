'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useSwipeStore } from '@/stores/swipeStore';
import { springPresets, tweenPresets } from '@/animations/presets';
import { SWIPE_THRESHOLD, SWIPE_VELOCITY } from '@/constants/game';
import { AudioButton } from './AudioButton';
import type { Word } from '@/types/game';

const SWIPE_EXIT_X = 300;
const ROTATE_FACTOR = 15;

interface VocabCardProps {
  word: Word;
  index: number;
  isTop: boolean;
  stackOffset: number;
}

export function VocabCard({ word, index, isTop, stackOffset }: VocabCardProps) {
  const swipeCorrect = useSwipeStore((s) => s.swipeCorrect);
  const swipeIncorrect = useSwipeStore((s) => s.swipeIncorrect);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-ROTATE_FACTOR, 0, ROTATE_FACTOR]);
  const opacity = useTransform(
    x,
    [-300, -SWIPE_THRESHOLD * 300, 0, SWIPE_THRESHOLD * 300, 300],
    [0.5, 1, 1, 1, 0.5],
  );
  const scale = useTransform(
    x,
    [-300, 0, 300],
    [0.95, 1, 0.95],
  );

  const dir = word.correctDirection ?? 'right';
  const correctThreshold = dir === 'right' ? 300 : -300;
  const wrongThreshold = dir === 'right' ? -300 : 300;

  const correctGlow = useTransform(
    x,
    dir === 'right' ? [0, SWIPE_THRESHOLD * 300, 300] : [-300, -SWIPE_THRESHOLD * 300, 0],
    [0, 0, 1],
  );
  const wrongGlow = useTransform(
    x,
    dir === 'right' ? [-300, -SWIPE_THRESHOLD * 300, 0] : [0, SWIPE_THRESHOLD * 300, 300],
    [1, 0, 0],
  );

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const xOffset = info.offset.x;
    const xVelocity = info.velocity.x;
    const threshold = SWIPE_THRESHOLD * (constraintsRef.current?.clientWidth ?? 300);
    const dir = word.correctDirection ?? 'right';

    const swipedRight = xOffset > threshold || xVelocity > SWIPE_VELOCITY;
    const swipedLeft = xOffset < -threshold || xVelocity < -SWIPE_VELOCITY;

    if (swipedRight || swipedLeft) {
      const isCorrect =
        (dir === 'right' && swipedRight) ||
        (dir === 'left' && swipedLeft);
      if (isCorrect) {
        swipeCorrect(word.id);
      } else {
        swipeIncorrect(word.id);
      }
    }
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 rounded-2xl border border-white/[0.04] bg-bg-card/60"
        style={{
          scale: 1 - stackOffset * 0.03,
          y: stackOffset * 6,
          zIndex: -stackOffset,
        }}
      />
    );
  }

  return (
    <div ref={constraintsRef} className="absolute inset-0">
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, opacity, scale }}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{
          x: x.get() > 0 ? SWIPE_EXIT_X : -SWIPE_EXIT_X,
          opacity: 0,
          rotate: x.get() > 0 ? ROTATE_FACTOR : -ROTATE_FACTOR,
          transition: { duration: 0.25, ease: 'easeOut' },
        }}
        transition={springPresets.smooth}
        className={cn(
          'relative w-full h-full rounded-2xl overflow-hidden',
          'bg-gradient-to-b from-bg-elevated to-bg-card',
          'border border-white/[0.04]',
          'shadow-2xl shadow-black/40',
          'select-none touch-none',
          'cursor-grab active:cursor-grabbing',
        )}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ opacity: correctGlow, boxShadow: 'inset 0 0 60px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)' }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ opacity: wrongGlow, boxShadow: 'inset 0 0 60px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.15)' }}
        />

        <div className="absolute top-4 right-4 z-10">
          <AudioButton wordId={word.id} arabicText={word.arabic} />
        </div>

        <div className="flex flex-col items-center justify-center h-full px-6 pb-4">
          <p className="text-micro text-text-tertiary font-semibold uppercase tracking-wider mb-2">
            {word.category}
          </p>

          <p
            className="text-arabic-xl text-text-primary font-arabic leading-[1.1] mb-4 text-center"
            dir="rtl"
            lang="ar"
          >
            {word.arabic}
          </p>

          <p className="text-body-bold text-text-secondary mb-2">{word.latin}</p>

          <p className="text-body text-text-primary mb-6">{word.indonesian}</p>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.04]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-text-tertiary"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-micro text-text-tertiary">Geser ke {word.correctDirection === 'left' ? 'kiri' : 'kanan'} jika benar</span>
          </div>
        </div>

        {dir === 'right' ? (
          <>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 right-4 bg-emerald-500 px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none"
              style={{ opacity: correctGlow, scale: correctGlow }}
            >
              <span className="text-body-bold text-white font-bold tracking-wide">BENAR</span>
            </motion.div>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-4 bg-error px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none"
              style={{ opacity: wrongGlow, scale: wrongGlow }}
            >
              <span className="text-body-bold text-white font-bold tracking-wide">SALAH</span>
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-4 bg-emerald-500 px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none"
              style={{ opacity: correctGlow, scale: correctGlow }}
            >
              <span className="text-body-bold text-white font-bold tracking-wide">BENAR</span>
            </motion.div>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 right-4 bg-error px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none"
              style={{ opacity: wrongGlow, scale: wrongGlow }}
            >
              <span className="text-body-bold text-white font-bold tracking-wide">SALAH</span>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
