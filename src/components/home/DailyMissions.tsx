'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  rewardXP: number;
  type: 'swipe' | 'battle' | 'listen';
}

const missions: Mission[] = [
  {
    id: '1',
    title: 'Belajar 10 Kata',
    description: 'Geser kartu kosakata baru',
    target: 10,
    progress: 7,
    rewardXP: 50,
    type: 'swipe',
  },
  {
    id: '2',
    title: 'Menang 3 Battle',
    description: 'Kalahkan musuh di arena',
    target: 3,
    progress: 1,
    rewardXP: 75,
    type: 'battle',
  },
  {
    id: '3',
    title: 'Dengar 5 Audio',
    description: 'Putar pengucapan kata',
    target: 5,
    progress: 5,
    rewardXP: 30,
    type: 'listen',
  },
];

const typeIcons: Record<string, string> = {
  swipe: '👆',
  battle: '⚔️',
  listen: '🎧',
};

const typeColors: Record<string, string> = {
  swipe: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
  battle: 'from-gold-400/20 to-gold-500/10 border-gold-400/20',
  listen: 'from-info/20 to-info/10 border-info/20',
};

const typeProgressColors: Record<string, string> = {
  swipe: 'bg-emerald-500',
  battle: 'bg-gold-400',
  listen: 'bg-info',
};

const missionRoutes: Record<string, string> = {
  swipe: '/swipe',
  battle: '/battle',
  listen: '/swipe',
};

export function DailyMissions() {
  const router = useRouter();
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-heading-2 text-text-primary font-bold">Misi Harian</h2>
        <span className="text-micro text-text-tertiary font-medium">
          {missions.filter((m) => m.progress >= m.target).length}/{missions.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {missions.map((mission, i) => {
          const isComplete = mission.progress >= mission.target;
          const percentage = Math.min((mission.progress / mission.target) * 100, 100);

          return (
            <motion.button
              key={mission.id}
              onClick={() => router.push(missionRoutes[mission.type])}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springPresets.gentle, delay: 0.1 + i * 0.06 }}
              className={cn(
                'relative overflow-hidden rounded-xl border p-3 text-left',
                'bg-gradient-to-r',
                typeColors[mission.type],
                isComplete && 'opacity-50',
              )}
            >
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springPresets.bouncy}
                  className="absolute top-2 right-2 w-5 h-5 bg-success rounded-full flex items-center justify-center"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
                    strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
              )}

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                  <span className="text-base">{typeIcons[mission.type]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-label font-semibold text-text-primary truncate">
                      {mission.title}
                    </p>
                    <span className="text-micro text-emerald-400 font-semibold shrink-0">
                      +{mission.rewardXP}
                    </span>
                  </div>
                  <p className="text-micro text-text-tertiary mt-0.5">{mission.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', typeProgressColors[mission.type])}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-micro text-text-tertiary shrink-0">
                      {mission.progress}/{mission.target}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
