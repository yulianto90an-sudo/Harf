'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBattleStore } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';

export function SkillEffect() {
  const showSkillEffect = useBattleStore((s) => s.showSkillEffect);
  const combo = useBattleStore((s) => s.combo);

  return (
    <AnimatePresence>
      {showSkillEffect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [0, 1.5, 1], rotate: [0, 20, -10, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 40px rgba(250,204,21,0.6)',
                  '0 0 80px rgba(250,204,21,0.8)',
                  '0 0 40px rgba(250,204,21,0.6)',
                ],
              }}
              transition={{ duration: 0.4, repeat: 2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center"
            >
              <span className="text-4xl">{combo >= 10 ? '🔥' : '⚡'}</span>
            </motion.div>
            <span className="text-heading-1 font-extrabold text-gold-400">
              SERANGAN SPESIAL!
            </span>
            <span className="text-body-bold text-gold-300">x{combo} Combo!</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
