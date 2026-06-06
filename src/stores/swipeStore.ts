import { create } from 'zustand';
import { XP_PER_SWIPE_CORRECT, XP_PER_SWIPE_INCORRECT, XP_COMBO_BONUS } from '@/constants/game';
import type { Word } from '@/types/game';
import { WORDS as VOCAB_WORDS } from '@/data/vocabulary';
import { getDueWords, logSwipeCardResult, upsertWordProgress, completeSwipeSession, createSwipeSession } from '@/services/supabase/queries';
import { useRoadmapStore } from './roadmapStore';
import { getNodeById } from '@/data/roadmap';
import { useAudioStore } from './audioStore';

type AnswerState = 'none' | 'correct' | 'incorrect';

const MOCK_WORDS: Word[] = VOCAB_WORDS.slice(0, 30).map((v) => ({
  id: v.id,
  arabic: v.arabic,
  latin: v.transliteration,
  indonesian: v.meaning_id,
  category: v.category,
  difficulty: v.difficulty <= 1 ? 'easy' : 'medium' as const,
  audioUrl: undefined,
}));

interface SwipeState {
  words: Word[];
  currentIndex: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  incorrectCount: number;
  xpEarned: number;
  lastXpGain: number;
  answerState: AnswerState;
  results: Record<number, 'correct' | 'incorrect' | undefined>;
  isComplete: boolean;
  showSummary: boolean;
  sessionStartTime: number;
  sessionId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  roadmapNodeId: string | null;
}

interface SwipeActions {
  swipeCorrect: (wordId: string) => void;
  swipeIncorrect: (wordId: string) => void;
  nextCard: () => void;
  endSession: () => void;
  resetSession: () => void;
  hideSummary: () => void;
  loadWords: (userId?: string) => Promise<void>;
  setRoadmapNodeId: (nodeId: string | null) => void;
}

type SwipeStore = SwipeState & SwipeActions;

export const useSwipeStore = create<SwipeStore>()((set, get) => ({
  words: MOCK_WORDS,
  currentIndex: 0,
  combo: 0,
  maxCombo: 0,
  correctCount: 0,
  incorrectCount: 0,
  xpEarned: 0,
  lastXpGain: 0,
  answerState: 'none',
  results: {},
  isComplete: false,
  showSummary: false,
  sessionStartTime: Date.now(),
  sessionId: null,
  isConnected: false,
  isLoading: false,
  roadmapNodeId: null,

  loadWords: async (userId) => {
    const state = get();
    let lessonWords: Word[] | undefined;
    if (state.roadmapNodeId) {
      const node = getNodeById(state.roadmapNodeId);
      if (node?.node.lesson_id) {
        lessonWords = VOCAB_WORDS
          .filter((v) => v.lesson_id === node.node.lesson_id)
          .map((v) => ({
            id: v.id,
            arabic: v.arabic,
            latin: v.transliteration,
            indonesian: v.meaning_id,
            category: v.category,
            difficulty: v.difficulty <= 1 ? 'easy' : 'medium' as const,
            audioUrl: undefined,
          }));
      }
    }
    if (!userId) {
      set({ words: (lessonWords || [...MOCK_WORDS]).sort(() => Math.random() - 0.5), isConnected: false, isLoading: false });
      return;
    }
    set({ isLoading: true });
    const result = await getDueWords(userId, 15);
    if (result.data && result.data.length > 0) {
      const words: Word[] = result.data.map((w) => ({
        id: w.word_id,
        arabic: w.arabic_text,
        latin: w.transliteration,
        indonesian: w.meaning_id,
        category: '',
        difficulty: 'easy',
        audioUrl: w.audio_url ?? undefined,
      }));
      const sessionResult = await createSwipeSession(userId);
      set({
        words,
        sessionId: sessionResult.data?.id ?? null,
        isConnected: true,
        isLoading: false,
        currentIndex: 0,
        combo: 0,
        maxCombo: 0,
        correctCount: 0,
        incorrectCount: 0,
        xpEarned: 0,
        sessionStartTime: Date.now(),
      });
    } else {
      set({ words: (lessonWords || [...MOCK_WORDS]).sort(() => Math.random() - 0.5), isConnected: false, isLoading: false });
    }
  },

  swipeCorrect: (wordId) => {
    const state = get();
    if (state.answerState !== 'none') return;

    const newCombo = state.combo + 1;
    if (newCombo >= 3) useAudioStore.getState().playSFX('combo');
    else useAudioStore.getState().playSFX('correct');
    const bonusXp = newCombo >= 10 ? XP_COMBO_BONUS * 3 : newCombo >= 5 ? XP_COMBO_BONUS * 2 : newCombo >= 2 ? XP_COMBO_BONUS : 0;
    const totalXpGain = XP_PER_SWIPE_CORRECT + bonusXp;

    set({
      answerState: 'correct',
      combo: newCombo,
      maxCombo: Math.max(state.maxCombo, newCombo),
      correctCount: state.correctCount + 1,
      xpEarned: state.xpEarned + totalXpGain,
      lastXpGain: totalXpGain,
      results: { ...state.results, [state.currentIndex]: 'correct' },
    });

    if (state.isConnected && state.sessionId) {
      logSwipeCardResult(state.sessionId, '', wordId, 'swipe_right', null, null, newCombo, totalXpGain, null);
      upsertWordProgress('', wordId, Math.min(newCombo, 5), 'swipe_right');
    }

    setTimeout(() => get().nextCard(), 600);
  },

  swipeIncorrect: () => {
    const state = get();
    if (state.answerState !== 'none') return;

    useAudioStore.getState().playSFX('incorrect');
    set({
      answerState: 'incorrect',
      combo: 0,
      incorrectCount: state.incorrectCount + 1,
      xpEarned: state.xpEarned + XP_PER_SWIPE_INCORRECT,
      lastXpGain: XP_PER_SWIPE_INCORRECT,
      results: { ...state.results, [state.currentIndex]: 'incorrect' },
    });

    if (state.isConnected && state.sessionId) {
      const wordId = state.words[state.currentIndex]?.id ?? '';
      logSwipeCardResult(state.sessionId, '', wordId, 'swipe_left', null, null, 0, XP_PER_SWIPE_INCORRECT, null);
      upsertWordProgress('', wordId, 0, 'swipe_left');
    }

    setTimeout(() => get().nextCard(), 600);
  },

  nextCard: () => {
    const state = get();
    const nextIndex = state.currentIndex + 1;

    if (nextIndex >= state.words.length) {
      const duration = Math.round((Date.now() - state.sessionStartTime) / 1000);
      if (state.isConnected && state.sessionId) {
        completeSwipeSession(state.sessionId, {
          total_cards: state.words.length,
          correct_count: state.correctCount,
          incorrect_count: state.incorrectCount,
          reveal_count: 0,
          max_combo: state.maxCombo,
          total_xp_earned: state.xpEarned,
          words_new: 0,
          words_reviewed: state.words.length,
          duration_seconds: duration,
        });
      }
      if (state.roadmapNodeId) {
        useRoadmapStore.getState().completeNode(
          state.roadmapNodeId,
          state.correctCount,
          state.words.length,
        );
      }
      set({ isComplete: true, showSummary: true, currentIndex: nextIndex, answerState: 'none' });
    } else {
      set({ currentIndex: nextIndex, answerState: 'none' });
    }
  },

  endSession: () => {
    const state = get();
    const duration = Math.round((Date.now() - state.sessionStartTime) / 1000);
    if (state.isConnected && state.sessionId) {
      completeSwipeSession(state.sessionId, {
        total_cards: state.words.length,
        correct_count: state.correctCount,
        incorrect_count: state.incorrectCount,
        reveal_count: 0,
        max_combo: state.maxCombo,
        total_xp_earned: state.xpEarned,
        words_new: 0,
        words_reviewed: state.words.length,
        duration_seconds: duration,
      });
    }
    if (state.roadmapNodeId) {
      useRoadmapStore.getState().completeNode(
        state.roadmapNodeId,
        state.correctCount,
        state.words.length,
      );
    }
    set({ showSummary: true });
  },

  resetSession: () => {
    const state = get();
    let lessonWords: Word[] | undefined;
    if (state.roadmapNodeId) {
      const node = getNodeById(state.roadmapNodeId);
      if (node?.node.lesson_id) {
        lessonWords = VOCAB_WORDS
          .filter((v) => v.lesson_id === node.node.lesson_id)
          .map((v) => ({
            id: v.id,
            arabic: v.arabic,
            latin: v.transliteration,
            indonesian: v.meaning_id,
            category: v.category,
            difficulty: v.difficulty <= 1 ? 'easy' : 'medium' as const,
            audioUrl: undefined,
          }));
      }
    }
    set({
      currentIndex: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      incorrectCount: 0,
      xpEarned: 0,
      lastXpGain: 0,
      answerState: 'none',
      results: {},
      isComplete: false,
      showSummary: false,
      sessionStartTime: Date.now(),
      sessionId: null,
      words: (lessonWords || [...MOCK_WORDS]).sort(() => Math.random() - 0.5),
    });
  },

  setRoadmapNodeId: (nodeId: string | null) => {
    const state = get();
    let words: Word[];
    if (nodeId) {
      const node = getNodeById(nodeId);
      if (node?.node.lesson_id) {
        words = VOCAB_WORDS
          .filter((v) => v.lesson_id === node.node.lesson_id)
          .map((v) => ({
            id: v.id,
            arabic: v.arabic,
            latin: v.transliteration,
            indonesian: v.meaning_id,
            category: v.category,
            difficulty: v.difficulty <= 1 ? 'easy' : 'medium' as const,
            audioUrl: undefined,
          }));
      } else {
        words = [...MOCK_WORDS];
      }
    } else {
      words = [...MOCK_WORDS];
    }
    set({
      roadmapNodeId: nodeId,
      words: words.sort(() => Math.random() - 0.5),
      currentIndex: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      incorrectCount: 0,
      xpEarned: 0,
      lastXpGain: 0,
      answerState: 'none',
      results: {},
      isComplete: false,
      showSummary: false,
      sessionStartTime: Date.now(),
      sessionId: null,
    });
  },

  hideSummary: () => set({ showSummary: false, isComplete: false }),
}));
