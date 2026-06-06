'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useSwipeStore } from '@/stores/swipeStore';
import { useRoadmapStore } from '@/stores/roadmapStore';
import { getNodeById } from '@/data/roadmap';
import { springPresets } from '@/animations/presets';

function ConfettiParticle({ index }: { index: number }) {
  const colors = ['bg-emerald-400', 'bg-gold-400', 'bg-emerald-300', 'bg-gold-300', 'bg-white/80'];
  const color = colors[index % colors.length];
  const x = (Math.random() - 0.5) * 200;
  const y = -(50 + Math.random() * 150);
  const rotation = Math.random() * 360;
  const delay = Math.random() * 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x,
        y,
        rotate: rotation,
        scale: [0, 1, 0.5, 0],
      }}
      transition={{
        duration: 1.5 + Math.random() * 1,
        delay,
        ease: 'easeOut',
      }}
      className={cn('absolute w-2 h-2 rounded-sm', color)}
    />
  );
}

export function SessionSummary() {
  const router = useRouter();
  const showSummary = useSwipeStore((s) => s.showSummary);
  const correctCount = useSwipeStore((s) => s.correctCount);
  const incorrectCount = useSwipeStore((s) => s.incorrectCount);
  const xpEarned = useSwipeStore((s) => s.xpEarned);
  const maxCombo = useSwipeStore((s) => s.maxCombo);
  const words = useSwipeStore((s) => s.words);
  const resetSession = useSwipeStore((s) => s.resetSession);
  const hideSummary = useSwipeStore((s) => s.hideSummary);

  const roadmapNodeId = useSwipeStore((s) => s.roadmapNodeId);
  const lastCompletionResult = useRoadmapStore((s) => s.lastCompletionResult);
  const dismissCompletionOverlay = useRoadmapStore((s) => s.dismissCompletionOverlay);

  const total = correctCount + incorrectCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const avgXPPerWord = total > 0 ? Math.round(xpEarned / total) : 0;
  const nextNodeTitle = lastCompletionResult?.unlockedNodeTitle ?? null;
  const nextNodeId = lastCompletionResult?.unlockedNodeId ?? null;

  return (
    <AnimatePresence>
      {showSummary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={springPresets.gentle}
            className="relative w-full max-w-sm mx-4 rounded-2xl bg-gradient-to-b from-bg-elevated to-bg-card border border-white/[0.04] shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <ConfettiParticle key={i} index={i} />
              ))}
            </div>

            <div className="relative z-10 p-6 pt-10">
              <div className="flex flex-col items-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springPresets.bouncy, delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-heading-1 text-text-primary font-extrabold"
                >
                  Sesi Selesai!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-micro text-text-tertiary mt-1"
                >
                  {words.length} kata dipelajari
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                <StatCard label="XP Diperoleh" value={`+${xpEarned}`} accent="emerald" delay={0.45} />
                <StatCard label="Akurasi" value={`${accuracy}%`} accent="gold" delay={0.5} />
                <StatCard label="BENAR" value={`${correctCount}`} accent="emerald" delay={0.55} />
                <StatCard label="SALAH" value={`${incorrectCount}`} accent="error" delay={0.6} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-gradient-to-r from-gold-400/10 to-gold-500/5 rounded-xl border border-gold-400/20 p-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div className="flex-1">
                    <p className="text-label text-gold-400 font-bold">Combo Terbaik</p>
                    <p className="text-body-bold text-text-primary">x{maxCombo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-label text-text-tertiary">Rata-rata XP</p>
                    <p className="text-body-bold text-emerald-400">{avgXPPerWord}/kata</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-2.5"
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={springPresets.snappy}
                  onClick={resetSession}
                  className="w-full py-3.5 bg-emerald-500 rounded-xl text-text-primary font-bold text-label
                    shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>Belajar Lagi</span>
                </motion.button>

                {roadmapNodeId && nextNodeId && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    transition={springPresets.snappy}
                    onClick={() => {
                      hideSummary();
                      dismissCompletionOverlay();
                      const found = getNodeById(nextNodeId);
                      if (found) {
                        const { node } = found;
                        if (node.type === 'boss') router.push('/battle');
                        else if (node.lesson_id) router.push(`/swipe?lesson=${node.lesson_id}`);
                        else router.push('/swipe');
                      } else {
                        router.push('/');
                      }
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600
                      rounded-xl text-white font-bold text-label
                      shadow-lg shadow-emerald-500/30"
                  >
                    Lanjut ke &quot;{nextNodeTitle}&quot;
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={springPresets.snappy}
                  onClick={() => { hideSummary(); router.push('/'); }}
                  className="w-full py-3 bg-white/5 rounded-xl text-text-secondary font-semibold text-label
                    border border-white/5 hover:bg-white/10 transition-colors"
                >
                  Kembali ke Beranda
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  label,
  value,
  accent,
  delay,
}: {
  label: string;
  value: string;
  accent: 'emerald' | 'gold' | 'error';
  delay: number;
}) {
  const accentColors = {
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/15 text-emerald-400',
    gold: 'from-gold-400/10 to-gold-500/5 border-gold-400/15 text-gold-400',
    error: 'from-error/10 to-error/5 border-error/15 text-error',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, ...springPresets.gentle }}
      className={cn(
        'rounded-xl p-3.5 border bg-gradient-to-br text-center',
        accentColors[accent],
      )}
    >
      <p className="text-body-bold font-extrabold">{value}</p>
      <p className="text-micro text-text-tertiary mt-0.5">{label}</p>
    </motion.div>
  );
}
