'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore } from '@/stores/battleStore';

function FloatingDamage({ damage, isEnemy, index }: { damage: number; isEnemy: boolean; index: number }) {
  const offsetX = (Math.random() - 0.5) * 40;
  const offsetY = -(40 + Math.random() * 30);

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, x: offsetX, y: offsetY, scale: 1.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 + Math.random() * 0.3, ease: 'easeOut' }}
      className={cn(
        'absolute text-xl font-extrabold pointer-events-none',
        isEnemy ? 'text-emerald-400' : 'text-error',
      )}
      style={{ left: `calc(50% + ${offsetX}px)`, top: '30%' }}
    >
      -{damage}
    </motion.div>
  );
}

export function DamageNumbers() {
  const answerState = useBattleStore((s) => s.answerState);
  const lastDamage = useBattleStore((s) => s.lastDamage);
  const phase = useBattleStore((s) => s.phase);

  const show = (answerState === 'correct' || answerState === 'wrong') && phase === 'active';

  return (
    <AnimatePresence>
      {show && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <FloatingDamage
            damage={lastDamage}
            isEnemy={answerState === 'correct'}
            index={0}
          />
          {answerState === 'correct' && (
            <>
              <FloatingDamage damage={Math.round(lastDamage * 0.3)} isEnemy={true} index={1} />
              <FloatingDamage damage={Math.round(lastDamage * 0.2)} isEnemy={true} index={2} />
            </>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
