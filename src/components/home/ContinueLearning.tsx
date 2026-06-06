'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

const lessons = [
  {
    id: 'greetings',
    title: 'Salam & Sapaan',
    category: 'Percakapan',
    difficulty: 'Mudah' as const,
    duration: '5 menit',
    progress: 3,
    total: 8,
    icon: '🌅',
  },
  {
    id: 'colors',
    title: 'Warna',
    category: 'Kosakata Dasar',
    difficulty: 'Mudah' as const,
    duration: '4 menit',
    progress: 0,
    total: 6,
    icon: '🎨',
  },
  {
    id: 'numbers',
    title: 'Angka 1-10',
    category: 'Kosakata Dasar',
    difficulty: 'Mudah' as const,
    duration: '6 menit',
    progress: 0,
    total: 10,
    icon: '🔢',
  },
];

const difficultyColors: Record<string, string> = {
  Mudah: 'text-success bg-success/10',
  Sedang: 'text-warning bg-warning/10',
  Sulit: 'text-error bg-error/10',
};

export function ContinueLearning() {
  const router = useRouter();
  const currentLesson = lessons[0];

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-heading-2 text-text-primary font-bold">Lanjut Belajar</h2>
        <button onClick={() => router.push('/swipe')} className="text-micro text-emerald-400 font-semibold">Lihat Semua</button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springPresets.gentle, delay: 0.25 }}
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-bg-card to-bg-elevated
          border border-white/[0.04] p-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <span className="text-lg">{currentLesson.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-micro text-text-tertiary">{currentLesson.category}</p>
                  <p className="text-body-bold text-text-primary mt-0.5">{currentLesson.title}</p>
                </div>
                <span className={cn(
                  'text-micro font-semibold px-2 py-0.5 rounded-md whitespace-nowrap',
                  difficultyColors[currentLesson.difficulty],
                )}>
                  {currentLesson.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-2.5">
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-text-tertiary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-micro text-text-tertiary">{currentLesson.duration}</span>
                </div>
                <div className="w-px h-3 bg-white/5" />
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-text-tertiary"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span className="text-micro text-text-tertiary">
                    {currentLesson.progress}/{currentLesson.total}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentLesson.progress / currentLesson.total) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                transition={springPresets.snappy}
                onClick={() => router.push('/swipe')}
                className="w-full mt-3 py-2.5 bg-emerald-500 rounded-xl text-white text-label font-bold
                  shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <span>Lanjutkan</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
