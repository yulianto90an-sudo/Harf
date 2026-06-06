export interface Word {
  id: string;
  arabic: string;
  latin: string;
  indonesian: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioUrl?: string;
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalWordsLearned: number;
  battleWins: number;
  battleLosses: number;
  createdAt: string;
}

export interface SessionSummary {
  sessionId: string;
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
  xpEarned: number;
  combo: number;
  duration: number;
}

export interface BattleEnemy {
  id: string;
  name: string;
  maxHp: number;
  sprite: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BattleQuestion {
  id: string;
  word: Word;
  options: string[];
  correctIndex: number;
}

export type BattleStatus = 'idle' | 'loading' | 'intro' | 'active' | 'victory' | 'defeat';

export interface BattleState {
  status: BattleStatus;
  enemy: BattleEnemy | null;
  questions: BattleQuestion[];
  currentQuestionIndex: number;
  playerHp: number;
  enemyHp: number;
  combo: number;
  correctCount: number;
  wrongCount: number;
  timeRemaining: number;
  xpEarned: number;
  coinsEarned: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  type: 'swipe' | 'battle' | 'streak' | 'xp';
  target: number;
  progress: number;
  reward: {
    xp: number;
    coins?: number;
  };
  isCompleted: boolean;
  isClaimed: boolean;
}
