'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useBattleStore, ENEMIES } from '@/stores/battleStore';
import { springPresets } from '@/animations/presets';
import {
  BattleHUD, ArenaBackground, HPBar,
  EnemySprite, PlayerSprite, QuestionCard,
  AnswerButtons, BattleCombo, DamageNumbers,
  SkillEffect, RewardModal, BattleResult,
} from '@/components/battle';
import type { BattleEnemyData } from '@/stores/battleStore';

function BattleSelect() {
  const startBattle = useBattleStore((s) => s.startBattle);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="text-center mb-2">
        <h1 className="text-display-2 text-text-primary font-extrabold">⚔️ Battle</h1>
        <p className="text-body text-text-secondary mt-1">Pilih musuh untuk bertarung!</p>
      </div>

      <div className="flex flex-col gap-3">
        {ENEMIES.map((enemy, i) => (
          <EnemySelectCard key={enemy.id} enemy={enemy} index={i} onSelect={() => startBattle(enemy)} />
        ))}
      </div>

      <p className="text-micro text-text-tertiary text-center mt-2">
        Jawab dengan benar untuk menyerang. Hati-hati dengan serangan balik!
      </p>
    </div>
  );
}

function EnemySelectCard({ enemy, index, onSelect }: { enemy: BattleEnemyData; index: number; onSelect: () => void }) {
  const difficultyColors: Record<string, string> = {
    easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-warning bg-warning/10 border-warning/20',
    hard: 'text-error bg-error/10 border-error/20',
  };

  const difficultyLabels: Record<string, string> = {
    easy: 'Mudah',
    medium: 'Sedang',
    hard: 'Sulit',
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springPresets.gentle, delay: 0.05 * index }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-bg-elevated to-bg-card border border-white/5 p-4 text-left w-full tap-highlight-transparent"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-bg-surface flex items-center justify-center shrink-0 text-3xl">
          {enemy.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-bold text-text-primary">{enemy.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-micro text-text-secondary">{enemy.maxHp} HP</span>
            </div>
            <span className={cn('text-micro font-semibold px-2 py-0.5 rounded-full border', difficultyColors[enemy.difficulty])}>
              {difficultyLabels[enemy.difficulty]}
            </span>
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </motion.button>
  );
}

function BattleArena() {
  const phase = useBattleStore((s) => s.phase);
  const playerHp = useBattleStore((s) => s.playerHp);
  const maxPlayerHp = useBattleStore((s) => s.maxPlayerHp);
  const enemyHp = useBattleStore((s) => s.enemyHp);
  const maxEnemyHp = useBattleStore((s) => s.maxEnemyHp);
  const enemy = useBattleStore((s) => s.enemy);
  const showReward = useBattleStore((s) => s.showReward);
  const showResult = useBattleStore((s) => s.showResult);
  const isEnemyAttacking = useBattleStore((s) => s.isEnemyAttacking);

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <ArenaBackground />
      <BattleHUD />

      <div className="relative z-10 flex-1 flex flex-col px-4">
        <div className="flex items-start gap-3 pt-3">
          <div className="flex-1 min-w-0">
            <HPBar current={playerHp} max={maxPlayerHp} side="player" label="Kamu" isFlashing={isEnemyAttacking} />
          </div>
          <div className="flex-1 min-w-0">
            <HPBar current={enemyHp} max={maxEnemyHp} side="enemy" label={enemy?.name ?? ''} color="#F97316" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-2">
          <div className="flex items-center justify-center w-full relative">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <PlayerSprite />
              </div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-2xl"
              >
                ⚔️
              </motion.div>

              <div className="flex flex-col items-center">
                <EnemySprite />
              </div>
            </div>
          </div>

          <BattleCombo />
        </div>

        <div className="pb-4 space-y-3">
          <QuestionCard />
          <AnswerButtons />
        </div>
      </div>

      <DamageNumbers />
      <SkillEffect />
      <RewardModal />
      <BattleResult />
    </div>
  );
}

export default function BattlePage() {
  const phase = useBattleStore((s) => s.phase);

  return (
    <div className="flex flex-col min-h-[calc(100dvh-8rem)]">
      {phase === 'select' ? <BattleSelect /> : <BattleArena />}
    </div>
  );
}
