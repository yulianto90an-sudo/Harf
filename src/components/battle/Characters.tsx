'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';
import { Mascot } from '@/components/shared/Mascot';

export function EnemySprite() {
  const enemy = useBattleStore((s) => s.enemy);
  const enemyHp = useBattleStore((s) => s.enemyHp);
  const maxEnemyHp = useBattleStore((s) => s.maxEnemyHp);
  const phase = useBattleStore((s) => s.phase);
  const isEnemyAttacking = useBattleStore((s) => s.isEnemyAttacking);
  const answerState = useBattleStore((s) => s.answerState);

  if (!enemy) return null;

  const hpPercent = maxEnemyHp > 0 ? enemyHp / maxEnemyHp : 1;
  const isDefeated = enemyHp <= 0 || phase === 'victory';
  const isLow = hpPercent <= 0.25;

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={enemy.id + (isDefeated ? '-defeated' : '-alive')}
          initial={phase === 'intro' ? { scale: 0, y: -50, opacity: 0 } : false}
          animate={
            isDefeated
              ? { scale: 0, y: -30, opacity: 0, rotate: -10 }
              : isEnemyAttacking
                ? { x: [0, 20, 0] }
                : answerState === 'correct'
                  ? { x: [0, -10, 5, -5, 0] }
                  : phase === 'intro'
                    ? { y: 0, scale: 1, opacity: 1 }
                    : { y: [0, -4, 0], scale: isLow ? [1, 0.97, 1] : 1 }
          }
          transition={
            phase === 'intro'
              ? { ...springPresets.bouncy, delay: 0.3 }
              : { duration: 0.3, ease: 'easeInOut' }
          }
          className="flex flex-col items-center gap-1"
        >
          <motion.span
            animate={{ rotate: isEnemyAttacking ? [0, -10, 10, 0] : 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'text-6xl select-none',
              isDefeated && 'grayscale opacity-50',
            )}
          >
            {enemy.emoji}
          </motion.span>

          <p className={cn(
            'text-label font-bold',
            isDefeated ? 'text-text-tertiary' : 'text-text-primary',
          )}>
            {enemy.name}
          </p>

          {isDefeated && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springPresets.bouncy, delay: 0.2 }}
              className="mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"
            >
              <span className="text-micro text-emerald-400 font-bold">K.O.!</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function PlayerSprite() {
  const phase = useBattleStore((s) => s.phase);
  const playerHp = useBattleStore((s) => s.playerHp);
  const isEnemyAttacking = useBattleStore((s) => s.isEnemyAttacking);
  const answerState = useBattleStore((s) => s.answerState);
  const combo = useBattleStore((s) => s.combo);

  if (phase === 'select') return null;

  const isDefeated = playerHp <= 0 || phase === 'defeat';

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={
          isDefeated
            ? { scale: 0.7, opacity: 0.4, rotate: -5 }
            : isEnemyAttacking
              ? { x: [0, -15, 10, -10, 0] }
              : answerState === 'correct'
                ? { y: [0, -15, 0], scale: [1, 1.1, 1] }
                : combo >= 3
                  ? { y: [0, -3, 0] }
                  : {}
        }
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Mascot
          expression={
            isDefeated ? 'sad' : answerState === 'correct' ? 'excited' : 'happy'
          }
          size="lg"
          animate={!isDefeated}
        />
      </motion.div>

      {combo >= 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center"
        >
          <span className="text-micro text-bg-primary font-extrabold">⚡</span>
        </motion.div>
      )}
    </div>
  );
}
