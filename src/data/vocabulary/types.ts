export interface VocabEntry {
  id: string;
  arabic: string;
  transliteration: string;
  meaning_id: string;
  category: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xp_reward: number;
  lesson_id: string;
  mastery_level: number;
  review_priority: number;
  audio_text: string;
  example_sentence_ar: string;
  example_sentence_id: string;
  tags: string[];
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  xp_reward: number;
  word_count: number;
  word_ids: string[];
  review_word_ids: string[];
}

export type DifficultyTier = 'easy' | 'medium' | 'hard';

export interface BattlePool {
  tier: DifficultyTier;
  label: string;
  word_ids: string[];
  min_combo_for_unlock: number;
}

export interface SRSConfig {
  review_intervals_minutes: number[];
  confusion_risk_words: string[];
  high_priority_words: string[];
  beginner_retention_targets: string[];
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
