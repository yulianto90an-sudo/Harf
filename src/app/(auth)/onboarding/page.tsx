'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { springPresets, tweenPresets } from '@/animations/presets';
import { cn } from '@/utils/cn';

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

interface Option {
  id: string;
  icon: string;
  title: string;
  description: string;
  recommended?: boolean;
}

const STEPS = [
  {
    title: 'Apa tujuan kamu belajar bahasa Arab?',
    icon: '🎯',
    key: 'goal',
    options: [
      { id: 'quran', icon: '📖', title: 'Ngerti Al-Quran', description: 'Fokus: Quranic vocabulary' },
      { id: 'speak', icon: '🗣️', title: 'Bisa Ngobrol', description: 'Fokus: daily conversation' },
      { id: 'academic', icon: '📚', title: 'Bantu Sekolah/Kuliah', description: 'Fokus: academic vocabulary' },
    ],
  },
  {
    title: 'Seberapa bisa kamu membaca Arab?',
    icon: '📊',
    key: 'level',
    options: [
      { id: 'beginner', icon: '🌱', title: 'Pemula', description: 'Belum bisa baca Arab' },
      { id: 'intermediate', icon: '🌿', title: 'Lumayan', description: 'Bisa baca, arti terbatas', recommended: true },
      { id: 'advanced', icon: '🌳', title: 'Mahir', description: 'Bisa baca + tahu banyak arti' },
    ],
  },
  {
    title: 'Target belajar per hari?',
    icon: '⏱️',
    key: 'target',
    options: [
      { id: 'casual', icon: '😌', title: 'Santai (5 menit)', description: '5-10 kartu per sesi' },
      { id: 'moderate', icon: '💪', title: 'Sedang (10 menit)', description: '10-20 kartu per sesi', recommended: true },
      { id: 'intense', icon: '🔥', title: 'Rajin (20 menit)', description: '20-30 kartu per sesi' },
    ],
  },
];

const dotVariants = {
  active: { backgroundColor: '#34D399', scale: 1 },
  inactive: { backgroundColor: 'rgba(255,255,255,0.2)', scale: 0.85 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = STEPS[step];

  const selectOption = (optionId: string) => {
    const key = currentStep.key;
    setSelections((prev) => ({ ...prev, [key]: optionId }));

    if (step < STEPS.length - 1) {
      setDirection(1);
      setTimeout(() => setStep((s) => s + 1), 200);
    } else {
      setIsComplete(true);
      setTimeout(() => router.push('/swipe'), 800);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setTimeout(() => setStep((s) => s - 1), 200);
    }
  };

  const skip = () => {
    router.push('/swipe');
  };

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="flex flex-col min-h-full relative">
      <div className="flex items-center justify-between pt-2 pb-6">
        {step > 0 && !isComplete ? (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-body-small text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeftIcon />
            Kembali
          </button>
        ) : (
          <div />
        )}
        {!isComplete && (
          <button
            onClick={skip}
            className="text-body-small text-text-secondary hover:text-text-primary transition-colors font-medium"
          >
            Lewati
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {!isComplete ? (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springPresets.gentle}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-4xl block mb-4">{currentStep.icon}</span>
                <h1 className="text-heading-1 text-text-primary font-bold">
                  {currentStep.title}
                </h1>
              </div>

              <div className="space-y-3">
                {currentStep.options.map((opt) => {
                  const isSelected = selections[currentStep.key] === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => selectOption(opt.id)}
                      whileTap={{ scale: 0.97 }}
                      transition={springPresets.snappy}
                      className={cn(
                        'w-full text-left p-4 rounded-xl transition-all duration-200',
                        'flex items-center gap-4 border',
                        'tap-highlight-transparent select-none',
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500/50 shadow-glow-emerald/30'
                          : 'bg-white/[0.04] border-white/[0.04] hover:bg-white/[0.06]',
                        !isSelected && selections[currentStep.key] && 'opacity-40 scale-95',
                      )}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body-bold text-text-primary font-semibold">
                            {opt.title}
                          </span>
                          {opt.recommended && (
                            <span className="text-micro text-emerald-400 font-semibold bg-emerald-500/15 px-2 py-0.5 rounded-full">
                              Rekomendasi
                            </span>
                          )}
                        </div>
                        <p className="text-body-small text-text-secondary mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-center gap-1.5">
                {STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    variants={dotVariants}
                    animate={i === step ? 'active' : 'inactive'}
                    transition={springPresets.snappy}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springPresets.bouncy, delay: 0.3 }}
          >
            <motion.div
              className="flex justify-center gap-1.5 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {STEPS.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.1, ...springPresets.bouncy }}
                />
              ))}
            </motion.div>

            <motion.span
              className="text-5xl block"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 10, delay: 0.2 }}
            >
              🎉
            </motion.span>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...springPresets.gentle }}
            >
              <h2 className="text-display-2 text-text-primary font-bold">
                Mulai belajar, yuk!
              </h2>
              <p className="text-body-small text-text-secondary">
                Siapkan jari kamu untuk swipe pertama ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
