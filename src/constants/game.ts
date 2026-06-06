export const XP_PER_SWIPE_CORRECT = 10;
export const XP_PER_SWIPE_INCORRECT = 2;
export const XP_COMBO_BONUS = 5;
export const XP_BATTLE_WIN = 50;
export const XP_BATTLE_LOSE = 10;
export const XP_DAILY_MISSION = 25;

export const MAX_COMBO = 999;
export const SWIPE_THRESHOLD = 0.3;
export const SWIPE_VELOCITY = 500;

export const BATTLE_TIMER_SECONDS = 15;
export const BATTLE_QUESTIONS_PER_ROUND = 5;
export const PLAYER_MAX_HP = 100;
export const DAMAGE_PER_WRONG = 20;
export const DAMAGE_PER_CORRECT = 15;

export const STREAK_FREEZE_DAYS = 1;
export const STREAK_DANGER_DAYS = 0;

export const LEVEL_BASE_XP = 100;
export const LEVEL_XP_MULTIPLIER = 1.5;

export const LEADERBOARD_PAGE_SIZE = 50;
export const MAX_FRIENDS = 100;

export const MASCOT_EXPRESSIONS = [
  'idle', 'happy', 'sad', 'excited', 'proud', 'confused', 'sleepy', 'surprised',
] as const;

export type MascotExpression = typeof MASCOT_EXPRESSIONS[number];
