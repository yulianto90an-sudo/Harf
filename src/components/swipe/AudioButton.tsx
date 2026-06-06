'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useAudioStore } from '@/stores/audioStore';
import { springPresets } from '@/animations/presets';

interface AudioButtonProps {
  wordId: string;
  arabicText?: string;
  className?: string;
}

function WaveformBar({ index, isPlaying }: { index: number; isPlaying: boolean }) {
  return (
    <motion.div
      animate={
        isPlaying
          ? {
              height: [4, 12 + Math.random() * 8, 4],
              transition: {
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.08,
              },
            }
          : { height: 4 }
      }
      className="w-[3px] rounded-full bg-current"
    />
  );
}

export function AudioButton({ wordId, arabicText, className }: AudioButtonProps) {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const currentWordId = useAudioStore((s) => s.currentWordId);
  const play = useAudioStore((s) => s.play);
  const isLoading = false;

  const isActive = isPlaying && currentWordId === wordId;

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      transition={springPresets.snappy}
      onClick={(e) => {
        e.stopPropagation();
        play(wordId, arabicText);
      }}
      disabled={isLoading}
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-full',
        'bg-white/5 border border-white/10',
        'hover:bg-white/10 active:bg-white/15',
        'transition-colors duration-150',
        isActive && 'bg-emerald-500/20 border-emerald-500/30',
        className,
      )}
      aria-label="Putar pengucapan"
    >
      {isLoading ? (
        <svg className="animate-spin w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : isActive ? (
        <div className="flex items-center gap-[2px] h-5 text-emerald-400">
          {[0, 1, 2, 3].map((i) => (
            <WaveformBar key={i} index={i} isPlaying={true} />
          ))}
        </div>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-text-secondary"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </motion.button>
  );
}
