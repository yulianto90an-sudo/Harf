'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets, tweenPresets } from '@/animations/presets';

interface Skill {
  name: string;
  icon: string;
  level: number;
  maxLevel: number;
  progress: number;
  color: string;
}

const skills: Skill[] = [
  { name: 'Kosakata', icon: '📖', level: 8, maxLevel: 20, progress: 43, color: 'from-emerald-500 to-emerald-400' },
  { name: 'Menyimak', icon: '🎧', level: 5, maxLevel: 20, progress: 27, color: 'from-info to-blue-400' },
  { name: 'Tata Bahasa', icon: '📝', level: 3, maxLevel: 20, progress: 17, color: 'from-gold-400 to-gold-300' },
  { name: 'Pelafalan', icon: '🗣️', level: 6, maxLevel: 20, progress: 31, color: 'from-purple-500 to-purple-400' },
];

export function SkillBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.35 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-4">Skill</p>

      <div className="flex flex-col gap-4">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.05, ...springPresets.gentle }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">{skill.icon}</span>
                <span className="text-label font-semibold text-text-primary">{skill.name}</span>
              </div>
              <span className="text-micro text-text-tertiary">
                Lv.{skill.level}/{skill.maxLevel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full bg-gradient-to-r', skill.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  transition={{ ...tweenPresets.slow, delay: 0.4 + i * 0.05 }}
                />
              </div>
              <span className="text-micro text-text-tertiary w-9 text-right">{skill.progress}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
