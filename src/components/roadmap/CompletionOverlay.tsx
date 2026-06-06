'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets, tweenPresets } from '@/animations/presets';
import type { CompletionResult } from '@/data/roadmap';

interface CompletionOverlayProps {
  result: CompletionResult;
  onContinue: () => void;
  onBackToMap: () => void;
}

function XpBurst({ xp }: { xp: number }) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springPresets.bouncy, delay: 0.15 }}
        className="relative"
      >
        <div className="text-5xl font-extrabold text-gold-400 drop-shadow-glow-gold">
          +{xp}
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="block text-center text-micro text-gold-400/60 mt-1"
        >
          XP
        </motion.span>
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#10B981' : '#F59E0B',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / 8) * Math.PI * 2) * 80,
            y: Math.sin((i / 8) * Math.PI * 2) * 80,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function StarsDisplay({ stars, maxStars }: { stars: number; maxStars: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-2">
      {Array.from({ length: maxStars }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            ...springPresets.bouncy,
            delay: 0.4 + i * 0.15,
          }}
          className={cn(
            'text-2xl',
            i < stars ? 'text-gold-400 drop-shadow-glow-gold' : 'text-white/10',
          )}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

function UnlockBanner({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...springPresets.gentle, delay: 0.6 }}
      className="mt-4 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-[10px] text-emerald-400/70 font-semibold uppercase tracking-wider"
      >
        Pelajaran Baru Terbuka!
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-body text-emerald-300 font-bold mt-1"
      >
        &ldquo;{title}&rdquo;
      </motion.p>
    </motion.div>
  );
}

function WorldCompleteBanner({ reward }: { reward: { title: string; xp: number; description: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springPresets.bouncy, delay: 0.7 }}
      className="mt-4 px-5 py-4 rounded-xl bg-gradient-to-br from-gold-400/20 to-amber-500/10 border border-gold-400/30 text-center"
    >
      <p className="text-body-bold text-gold-400 font-bold">
        {reward.title}
      </p>
      <p className="text-micro text-gold-400/60 mt-0.5">
        {reward.description}
      </p>
      <p className="text-label text-gold-400 font-bold mt-1">
        +{reward.xp} XP Bonus!
      </p>
    </motion.div>
  );
}

function BossCompleteBanner({ reward }: { reward: { chest?: string; xp_bonus: number } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...springPresets.bouncy, delay: 0.7 }}
      className="mt-4 px-5 py-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 text-center"
    >
      <p className="text-label font-bold text-purple-300 uppercase tracking-wider">
        BOSS REWARD
      </p>
      <p className="text-body-bold text-purple-300 font-bold mt-1">
        Boss Dikalahkan!
      </p>
      {reward.chest && (
        <p className="text-micro text-purple-300/60 mt-0.5">
          {reward.chest} terbuka!
        </p>
      )}
      <p className="text-label text-purple-300 font-bold mt-1">
        +{reward.xp_bonus} XP Bonus!
      </p>
    </motion.div>
  );
}

export function CompletionOverlay({
  result,
  onContinue,
  onBackToMap,
}: CompletionOverlayProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={tweenPresets.normal}
        className="fixed inset-0 z-50 flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ ...springPresets.gentle }}
          className="w-full max-w-app rounded-t-3xl bg-bg-surface border-t border-white/10 p-6 pb-10"
        >
          <div className="flex flex-col items-center text-center">
            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-micro text-emerald-400 font-semibold uppercase tracking-wider"
            >
              {result.isBoss ? 'Boss Dikalahkan!' : 'Pelajaran Selesai!'}
            </motion.p>

            {/* XP burst */}
            <div className="relative mt-4">
              <XpBurst xp={result.xpEarned} />
            </div>

            {/* Stars */}
            <StarsDisplay stars={result.stars} maxStars={3} />

            {/* Unlock next lesson */}
            {result.unlockedNodeTitle && (
              <UnlockBanner title={result.unlockedNodeTitle} />
            )}

            {/* World completed */}
            {result.worldCompleted && result.worldReward && (
              <WorldCompleteBanner reward={result.worldReward} />
            )}

            {/* Boss defeated */}
            {result.isBoss && result.bossReward && (
              <BossCompleteBanner reward={result.bossReward} />
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full mt-6">
              {result.unlockedNodeTitle && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onContinue}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600
                    rounded-xl text-white font-bold text-label
                    shadow-lg shadow-emerald-500/30"
                >
                  Lanjut ke "{result.unlockedNodeTitle}"
                </motion.button>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                whileTap={{ scale: 0.96 }}
                onClick={onBackToMap}
                className="w-full py-3 rounded-xl text-text-secondary font-semibold text-micro
                  border border-white/10 hover:bg-white/5 transition-colors"
              >
                Kembali ke Roadmap
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
