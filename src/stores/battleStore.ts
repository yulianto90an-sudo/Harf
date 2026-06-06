import { create } from 'zustand';
import {
  XP_BATTLE_WIN, XP_BATTLE_LOSE, XP_COMBO_BONUS,
  BATTLE_QUESTIONS_PER_ROUND, PLAYER_MAX_HP,
  DAMAGE_PER_CORRECT, DAMAGE_PER_WRONG,
} from '@/constants/game';
import type { Word } from '@/types/game';
import { WORDS as VOCAB_WORDS, getBattleWords } from '@/data/vocabulary';
import { createBattle, completeBattle, getDueWords } from '@/services/supabase/queries';
import { useAudioStore } from './audioStore';

export interface BattleEnemyData {
  id: string;
  name: string;
  emoji: string;
  maxHp: number;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
}

export interface BattleQuestionData {
  id: string;
  word: Word;
  options: string[];
  correctIndex: number;
}

export type BattlePhase = 'select' | 'intro' | 'active' | 'victory' | 'defeat';
export type AnswerResult = 'none' | 'correct' | 'wrong';

function vocabToWord(v: typeof VOCAB_WORDS[number]): Word {
  return {
    id: v.id,
    arabic: v.arabic,
    latin: v.transliteration,
    indonesian: v.meaning_id,
    category: v.category,
    difficulty: v.difficulty <= 1 ? 'easy' : v.difficulty <= 3 ? 'medium' : 'hard',
  };
}

const EASY_WORDS: Word[] = getBattleWords('easy').map(vocabToWord);
const MEDIUM_WORDS: Word[] = getBattleWords('medium').map(vocabToWord);
const HARD_WORDS: Word[] = getBattleWords('hard').map(vocabToWord);
const ALL_WORDS: Word[] = [...EASY_WORDS, ...MEDIUM_WORDS, ...HARD_WORDS];

function generateQuestions(count: number, tier: 'easy' | 'medium' | 'hard' = 'easy'): BattleQuestionData[] {
  const pool = tier === 'hard' ? ALL_WORDS : tier === 'medium' ? [...EASY_WORDS, ...MEDIUM_WORDS] : EASY_WORDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((word) => {
    const wrongOptions = pool
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.indonesian);

    const options = [word.indonesian, ...wrongOptions].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(word.indonesian);

    return { id: word.id, word, options, correctIndex };
  });
}

export const ENEMIES: BattleEnemyData[] = [
  { id: 'e1', name: 'Hantu Kosakata', emoji: '👻', maxHp: 60, difficulty: 'easy', color: '#22C55E' },
  { id: 'e2', name: 'Golem Tata Bahasa', emoji: '🗿', maxHp: 80, difficulty: 'easy', color: '#3B82F6' },
  { id: 'e3', name: 'Naga Arab', emoji: '🐉', maxHp: 100, difficulty: 'medium', color: '#F97316' },
  { id: 'e4', name: 'Raja Iblis', emoji: '👑', maxHp: 130, difficulty: 'hard', color: '#EF4444' },
];

interface BattleState {
  phase: BattlePhase;
  enemy: BattleEnemyData | null;
  questions: BattleQuestionData[];
  currentQuestionIndex: number;
  playerHp: number;
  maxPlayerHp: number;
  enemyHp: number;
  maxEnemyHp: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  xpEarned: number;
  answerState: AnswerResult;
  selectedAnswerIndex: number | null;
  lastDamage: number;
  isEnemyAttacking: boolean;
  showSkillEffect: boolean;
  showReward: boolean;
  showResult: boolean;
  currentBattleId: string | null;
  isConnected: boolean;
  isLoading: boolean;
}

interface BattleActions {
  startBattle: (enemy: BattleEnemyData) => Promise<void>;
  answerQuestion: (index: number) => void;
  nextQuestion: () => void;
  finishBattle: () => void;
  resetBattle: () => void;
  closeResult: () => void;
}

type BattleStore = BattleState & BattleActions;

export const useBattleStore = create<BattleStore>()((set, get) => ({
  phase: 'select',
  enemy: null,
  questions: [],
  currentQuestionIndex: 0,
  playerHp: PLAYER_MAX_HP,
  maxPlayerHp: PLAYER_MAX_HP,
  enemyHp: 0,
  maxEnemyHp: 0,
  combo: 0,
  maxCombo: 0,
  correctCount: 0,
  wrongCount: 0,
  xpEarned: 0,
  answerState: 'none',
  selectedAnswerIndex: null,
  lastDamage: 0,
  isEnemyAttacking: false,
  showSkillEffect: false,
  showReward: false,
  showResult: false,
  currentBattleId: null,
  isConnected: false,
  isLoading: false,

  startBattle: async (enemy) => {
    const questions = generateQuestions(BATTLE_QUESTIONS_PER_ROUND, enemy.difficulty);
    const userId = '';
    const result = userId ? await createBattle(userId, enemy.id === 'e4' ? 'nahwu_king' : enemy.id === 'e3' ? 'penuntut' : enemy.id === 'e2' ? 'musafir' : 'pemula', 1, enemy.id === 'e4') : null;

    set({
      phase: 'intro',
      enemy,
      questions,
      currentQuestionIndex: 0,
      playerHp: PLAYER_MAX_HP,
      maxPlayerHp: PLAYER_MAX_HP,
      enemyHp: enemy.maxHp,
      maxEnemyHp: enemy.maxHp,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      xpEarned: 0,
      answerState: 'none',
      selectedAnswerIndex: null,
      lastDamage: 0,
      isEnemyAttacking: false,
      showSkillEffect: false,
      showReward: false,
      showResult: false,
      currentBattleId: result?.data?.id ?? null,
      isConnected: !!result?.data,
    });

    setTimeout(() => set({ phase: 'active' }), 1500);
  },

  answerQuestion: (index) => {
    const state = get();
    if (state.answerState !== 'none' || state.phase !== 'active') return;

    const question = state.questions[state.currentQuestionIndex];
    if (!question) return;

    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      const newCombo = state.combo + 1;
      if (newCombo >= 3) useAudioStore.getState().playSFX('combo');
      else useAudioStore.getState().playSFX('correct');
      const baseDamage = DAMAGE_PER_CORRECT;
      const comboBonus = newCombo >= 5 ? DAMAGE_PER_CORRECT * 0.5 : newCombo >= 3 ? DAMAGE_PER_CORRECT * 0.25 : 0;
      const skillBonus = newCombo >= 8 ? DAMAGE_PER_CORRECT * 0.5 : 0;
      const totalDamage = Math.round(baseDamage + comboBonus + skillBonus);
      const bonusXp = newCombo >= 5 ? XP_COMBO_BONUS * 2 : newCombo >= 2 ? XP_COMBO_BONUS : 0;

      const newEnemyHp = Math.max(0, state.enemyHp - totalDamage);
      const showSkill = newCombo >= 8;

      set({
        answerState: 'correct',
        selectedAnswerIndex: index,
        combo: newCombo,
        maxCombo: Math.max(state.maxCombo, newCombo),
        correctCount: state.correctCount + 1,
        enemyHp: newEnemyHp,
        xpEarned: state.xpEarned + 10 + bonusXp,
        lastDamage: totalDamage,
        showSkillEffect: showSkill,
      });

      if (showSkill) {
        setTimeout(() => set({ showSkillEffect: false }), 800);
      }

      if (newEnemyHp <= 0) {
        useAudioStore.getState().playSFX('levelup');
        const totalXp = state.xpEarned + 10 + bonusXp + XP_BATTLE_WIN;
        if (state.currentBattleId) {
          completeBattle(state.currentBattleId, 'victory', {
            player_hp_remaining: state.playerHp,
            enemy_hp_remaining: 0,
            total_questions: state.correctCount + state.wrongCount + 1,
            correct_count: state.correctCount + 1,
            wrong_count: state.wrongCount,
            max_combo: Math.max(state.maxCombo, newCombo),
            total_damage_dealt: state.correctCount > 0 ? DAMAGE_PER_CORRECT * (state.correctCount + 1) : DAMAGE_PER_CORRECT,
            total_damage_taken: state.wrongCount > 0 ? DAMAGE_PER_WRONG * state.wrongCount : 0,
            xp_earned: totalXp,
            coins_earned: 5,
            duration_seconds: 0,
          });
        }
        setTimeout(() => set({
          phase: 'victory',
          xpEarned: totalXp,
          showReward: true,
        }), 700);
      } else {
        setTimeout(() => get().nextQuestion(), 800);
      }
    } else {
      useAudioStore.getState().playSFX('battle_hit');
      const enemyDamage = DAMAGE_PER_WRONG;
      const newPlayerHp = Math.max(0, state.playerHp - enemyDamage);

      set({
        answerState: 'wrong',
        selectedAnswerIndex: index,
        combo: 0,
        wrongCount: state.wrongCount + 1,
        playerHp: newPlayerHp,
        isEnemyAttacking: true,
        lastDamage: enemyDamage,
      });

      setTimeout(() => set({ isEnemyAttacking: false }), 500);

      if (newPlayerHp <= 0) {
        useAudioStore.getState().playSFX('incorrect');
        const totalXp = state.xpEarned + XP_BATTLE_LOSE;
        if (state.currentBattleId) {
          completeBattle(state.currentBattleId, 'defeat', {
            player_hp_remaining: 0,
            enemy_hp_remaining: state.enemyHp,
            total_questions: state.correctCount + state.wrongCount + 1,
            correct_count: state.correctCount,
            wrong_count: state.wrongCount + 1,
            max_combo: state.maxCombo,
            total_damage_dealt: DAMAGE_PER_CORRECT * state.correctCount,
            total_damage_taken: DAMAGE_PER_WRONG * (state.wrongCount + 1),
            xp_earned: totalXp,
            coins_earned: 0,
            duration_seconds: 0,
          });
        }
        setTimeout(() => set({
          phase: 'defeat',
          xpEarned: totalXp,
          showResult: true,
        }), 1000);
      } else {
        setTimeout(() => get().nextQuestion(), 1000);
      }
    }
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= state.questions.length) {
      const totalXp = state.xpEarned + XP_BATTLE_WIN;
      if (state.currentBattleId) {
        completeBattle(state.currentBattleId, 'victory', {
          player_hp_remaining: state.playerHp,
          enemy_hp_remaining: state.enemyHp,
          total_questions: state.correctCount + state.wrongCount,
          correct_count: state.correctCount,
          wrong_count: state.wrongCount,
          max_combo: state.maxCombo,
          total_damage_dealt: DAMAGE_PER_CORRECT * state.correctCount,
          total_damage_taken: DAMAGE_PER_WRONG * state.wrongCount,
          xp_earned: totalXp,
          coins_earned: 5,
          duration_seconds: 0,
        });
      }
      set({
        phase: 'victory',
        currentQuestionIndex: nextIndex,
        answerState: 'none',
        selectedAnswerIndex: null,
        xpEarned: totalXp,
        showReward: true,
      });
    } else {
      set({
        currentQuestionIndex: nextIndex,
        answerState: 'none',
        selectedAnswerIndex: null,
      });
    }
  },

  finishBattle: () => {
    set({ showReward: false, showResult: true });
  },

  resetBattle: () => {
    set({
      phase: 'select',
      enemy: null,
      questions: [],
      currentQuestionIndex: 0,
      playerHp: PLAYER_MAX_HP,
      maxPlayerHp: PLAYER_MAX_HP,
      enemyHp: 0,
      maxEnemyHp: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      xpEarned: 0,
      answerState: 'none',
      selectedAnswerIndex: null,
      lastDamage: 0,
      isEnemyAttacking: false,
      showSkillEffect: false,
      showReward: false,
      showResult: false,
      currentBattleId: null,
      isConnected: false,
    });
  },

  closeResult: () => {
    set({ showResult: false, phase: 'select', currentBattleId: null, isConnected: false });
  },
}));
