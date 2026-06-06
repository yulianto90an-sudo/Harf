'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useProfileStore } from '@/stores/profileStore';
import { springPresets } from '@/animations/presets';

interface ShareCardProps {
  type: 'streak' | 'xp' | 'rank' | 'achievement';
  icon: string;
  label: string;
  value: string | number;
  gradient: string;
  delay: number;
}

function ShareCard({ type, icon, label, value, gradient, delay }: ShareCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, ...springPresets.gentle }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative overflow-hidden rounded-xl p-4 border cursor-pointer',
        'bg-gradient-to-br',
        gradient,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-label font-extrabold text-text-primary">{value}</p>
          <p className="text-micro text-text-tertiary">{label}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary shrink-0">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </div>
    </motion.div>
  );
}

export function SocialShare() {
  const profile = useProfileStore((s) => s.profile);
  if (!profile) return null;

  const cards = [
    { type: 'streak' as const, icon: '🔥', label: 'Streak Harian', value: `${profile.currentStreak} Hari!`, gradient: 'from-warning/15 to-warning/5 border-warning/20', delay: 0.2 },
    { type: 'xp' as const, icon: '⭐', label: 'Total XP', value: profile.xp.toLocaleString(), gradient: 'from-gold-400/15 to-gold-500/5 border-gold-400/20', delay: 0.25 },
    { type: 'rank' as const, icon: '👑', label: `Level ${profile.level} ${profile.rank}`, value: profile.rank, gradient: 'from-emerald-500/15 to-emerald-600/5 border-emerald-500/20', delay: 0.3 },
    { type: 'achievement' as const, icon: '📖', label: 'Kata Dipelajari', value: profile.totalWordsLearned, gradient: 'from-info/15 to-blue-500/5 border-info/20', delay: 0.35 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.15 }}
      className="rounded-2xl bg-gradient-to-br from-bg-elevated to-bg-card border border-white/5 p-5"
    >
      <p className="text-label text-text-tertiary font-semibold uppercase tracking-wider mb-3">Bagikan Progress</p>

      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <ShareCard key={card.type} {...card} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-micro text-text-tertiary mt-3"
      >
        Bagikan ke TikTok, Instagram, atau WhatsApp
      </motion.p>
    </motion.div>
  );
}
