'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';
import { useAudioStore } from '@/stores/audioStore';

interface WordOfTheDayData {
  arabic: string;
  latin: string;
  indonesian: string;
  example: string;
}

const word: WordOfTheDayData = {
  arabic: 'السَّلَامُ عَلَيْكُمْ',
  latin: 'As-Salāmu ʿAlaykum',
  indonesian: 'Semoga keselamatan terlimpah untukmu',
  example: 'Digunakan sebagai salam pembuka',
};

const WOTD_ID = 'wotd';

function WaveformBar({ index, isPlaying }: { index: number; isPlaying: boolean }) {
  return (
    <motion.div
      animate={isPlaying ? {
        height: [4, 12 + Math.random() * 8, 4],
        transition: {
          duration: 0.4 + Math.random() * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.08,
        },
      } : { height: 4 }}
      className="w-[3px] rounded-full bg-current"
    />
  );
}

export function WordOfTheDay() {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const currentWordId = useAudioStore((s) => s.currentWordId);
  const play = useAudioStore((s) => s.play);

  const isActive = isPlaying && currentWordId === WOTD_ID;

  return (
    <section>
      <h2 className="text-heading-2 text-text-primary font-bold mb-3 px-1">Kata Hari Ini</h2>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPresets.gentle, delay: 0.3 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-bg-card via-bg-card to-emerald-500/5
          border border-white/[0.04] p-5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <p
            className="text-arabic-xl text-text-primary font-arabic leading-[1.1] mb-3"
            dir="rtl"
            lang="ar"
          >
            {word.arabic}
          </p>

          <p className="text-body text-text-secondary italic mb-1">{word.latin}</p>
          <p className="text-body-bold text-text-primary mb-4">{word.indonesian}</p>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={springPresets.snappy}
              onClick={() => play(WOTD_ID, word.arabic)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                isActive
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25',
              )}
              aria-label="Putar audio"
            >
              {isActive ? (
                <div className="flex items-center gap-[2px] h-5 text-emerald-400">
                  {[0, 1, 2, 3].map((i) => (
                    <WaveformBar key={i} index={i} isPlaying={true} />
                  ))}
                </div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-emerald-400"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </motion.button>

            <span className="text-micro text-text-tertiary">{word.example}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
