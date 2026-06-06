-- Harf Initial Schema
-- Migration: 20260531_initial_schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Helper Functions
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := 'HARF-' || UPPER(NEW.username);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_level(p_xp BIGINT)
RETURNS INTEGER
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  v_level INTEGER := 1;
  v_xp_needed BIGINT := 0;
BEGIN
  LOOP
    v_xp_needed := floor(50 * POWER(v_level, 1.5) + 50 * v_level)::BIGINT;
    EXIT WHEN p_xp < v_xp_needed;
    v_level := v_level + 1;
  END LOOP;
  RETURN v_level;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_next_review(confidence INTEGER)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN NOW() + (
    CASE confidence
      WHEN 0 THEN INTERVAL '0 minutes'
      WHEN 1 THEN INTERVAL '4 hours'
      WHEN 2 THEN INTERVAL '1 day'
      WHEN 3 THEN INTERVAL '3 days'
      WHEN 4 THEN INTERVAL '7 days'
      WHEN 5 THEN INTERVAL '14 days'
      ELSE INTERVAL '1 day'
    END
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- Tables
-- ============================================================

-- 1. Ranks
CREATE TABLE ranks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_xp BIGINT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT
);

-- 2. Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_order ON categories(order_index);

-- 3. Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  category TEXT CHECK (category IN ('streak', 'battle', 'vocabulary', 'social', 'special')),
  max_progress INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);

-- 4. Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  avatar_url TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  is_guest BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_users_set_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_referral_code ON users(referral_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_last_active ON users(last_active_at DESC);
CREATE INDEX idx_users_created ON users(created_at DESC);

-- 5. User Sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_info JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id, started_at DESC);

-- 6. Profiles
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  xp BIGINT DEFAULT 0 CHECK (xp >= 0),
  lifetime_xp BIGINT DEFAULT 0 CHECK (lifetime_xp >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  rank_id INTEGER REFERENCES ranks(id),
  total_words_learned INTEGER DEFAULT 0 CHECK (total_words_learned >= 0),
  total_battles_won INTEGER DEFAULT 0,
  total_battles_played INTEGER DEFAULT 0,
  highest_streak INTEGER DEFAULT 0 CHECK (highest_streak >= 0),
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  last_streak_date DATE,
  streak_freeze INTEGER DEFAULT 0 CHECK (streak_freeze >= 0),
  coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  total_coins_earned INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  showcase_badges UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_profiles_level ON profiles(level DESC);
CREATE INDEX idx_profiles_rank ON profiles(rank_id);

-- 7. Vocabulary Words
CREATE TABLE vocabulary_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arabic_text TEXT NOT NULL,
  vowelled_text TEXT,
  transliteration TEXT NOT NULL,
  meaning_id TEXT NOT NULL,
  meaning_en TEXT,
  example_sentence TEXT,
  example_meaning TEXT,
  category_id UUID REFERENCES categories(id),
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  frequency_score INTEGER DEFAULT 0,
  audio_url TEXT,
  audio_duration_ms INTEGER,
  root_letters TEXT,
  word_type TEXT CHECK (word_type IN ('noun', 'verb', 'adjective', 'particle', 'expression')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_vocabulary_words_updated_at
  BEFORE UPDATE ON vocabulary_words
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_vocab_category ON vocabulary_words(category_id);
CREATE INDEX idx_vocab_difficulty ON vocabulary_words(difficulty);
CREATE INDEX idx_vocab_active ON vocabulary_words(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_vocab_frequency ON vocabulary_words(frequency_score DESC);
CREATE INDEX idx_vocab_type ON vocabulary_words(word_type);
CREATE INDEX idx_vocab_search ON vocabulary_words USING gin(to_tsvector('indonesian', meaning_id));

-- 8. Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  order_index INTEGER DEFAULT 0,
  xp_reward INTEGER DEFAULT 100,
  word_count INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lessons_order ON lessons(order_index, difficulty);

CREATE TABLE lesson_words (
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (lesson_id, word_id)
);

CREATE INDEX idx_lesson_words_lesson ON lesson_words(lesson_id);
CREATE INDEX idx_lesson_words_word ON lesson_words(word_id);

-- 9. User Word Progress
CREATE TABLE user_word_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  confidence INTEGER DEFAULT 0 CHECK (confidence BETWEEN 0 AND 5),
  swipe_right_count INTEGER DEFAULT 0,
  swipe_left_count INTEGER DEFAULT 0,
  audio_played_count INTEGER DEFAULT 0,
  combo_max_achieved INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  is_learned BOOLEAN DEFAULT FALSE,
  is_mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE TRIGGER trg_user_word_progress_updated_at
  BEFORE UPDATE ON user_word_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_uwp_next_review ON user_word_progress(user_id, next_review_at ASC) WHERE is_mastered = FALSE;
CREATE INDEX idx_uwp_unlearned ON user_word_progress(user_id) WHERE is_learned = FALSE;
CREATE INDEX idx_uwp_user_stats ON user_word_progress(user_id, is_learned, is_mastered);
CREATE INDEX idx_uwp_srs ON user_word_progress(user_id, confidence, next_review_at);
CREATE INDEX idx_uwp_due_review ON user_word_progress(user_id, next_review_at ASC, confidence ASC) WHERE is_mastered = FALSE;

-- 10. Swipe Sessions
CREATE TABLE swipe_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  total_cards INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  reveal_count INTEGER DEFAULT 0,
  max_combo INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  words_new INTEGER DEFAULT 0,
  words_reviewed INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_swipe_sessions_user ON swipe_sessions(user_id, started_at DESC);
CREATE INDEX idx_swipe_sessions_date ON swipe_sessions(started_at DESC);

CREATE TABLE swipe_session_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES swipe_sessions(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('swipe_right', 'swipe_left', 'reveal')),
  confidence_before INTEGER,
  confidence_after INTEGER,
  combo_at_time INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  audio_played BOOLEAN DEFAULT FALSE,
  swipe_velocity REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_swipe_session_words_session ON swipe_session_words(session_id);
CREATE INDEX idx_swipe_session_words_user ON swipe_session_words(user_id, created_at DESC);
CREATE INDEX idx_swipe_session_words_word ON swipe_session_words(word_id);

-- 11. Battles
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enemy_type TEXT NOT NULL CHECK (enemy_type IN ('pemula', 'musafir', 'penuntut', 'nahwu_king')),
  enemy_level INTEGER DEFAULT 1,
  battle_date DATE DEFAULT CURRENT_DATE,
  result TEXT NOT NULL CHECK (result IN ('victory', 'defeat', 'draw', 'forfeited')),
  player_hp_remaining INTEGER,
  enemy_hp_remaining INTEGER,
  total_questions INTEGER DEFAULT 10,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  timeout_count INTEGER DEFAULT 0,
  max_combo INTEGER DEFAULT 0,
  total_damage_dealt INTEGER DEFAULT 0,
  total_damage_taken INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  is_boss BOOLEAN DEFAULT FALSE,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_battles_user ON battles(user_id, created_at DESC);
CREATE INDEX idx_battles_date ON battles(user_id, battle_date DESC);
CREATE INDEX idx_battles_result ON battles(user_id, result);
CREATE INDEX idx_battles_user_stats ON battles(user_id, battle_date, result);

CREATE TABLE battle_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID NOT NULL REFERENCES battles(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  is_timeout BOOLEAN DEFAULT FALSE,
  response_time_ms INTEGER,
  combo_at_time INTEGER DEFAULT 0,
  damage_dealt INTEGER DEFAULT 0,
  options_shown JSONB,
  correct_option_index INTEGER NOT NULL,
  selected_option_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_battle_questions_battle ON battle_questions(battle_id);

-- 12. XP Transactions
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_before INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_xp_transactions_source ON xp_transactions(source, source_id);
CREATE INDEX idx_xp_transactions_date ON xp_transactions(created_at);
CREATE INDEX idx_xp_weekly ON xp_transactions(user_id, created_at) WHERE source NOT IN ('admin_adjustment');

-- 13. Daily Missions
CREATE TABLE daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_type TEXT NOT NULL,
  mission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  target INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress <= target),
  is_completed BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  reward_xp INTEGER NOT NULL,
  reward_coins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_type, mission_date)
);

CREATE INDEX idx_daily_missions_user ON daily_missions(user_id, mission_date DESC);
CREATE INDEX idx_daily_missions_active ON daily_missions(user_id, mission_date) WHERE is_completed = FALSE AND is_claimed = FALSE;

-- 14. Streak Log
CREATE TABLE streak_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  timezone TEXT,
  local_date DATE,
  xp_earned INTEGER DEFAULT 0,
  swipe_count INTEGER DEFAULT 0,
  battle_count INTEGER DEFAULT 0,
  audio_count INTEGER DEFAULT 0,
  frozen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

CREATE INDEX idx_streak_log_user ON streak_log(user_id, activity_date DESC);

-- 15. User Badges
CREATE TABLE user_badges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_earned BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMPTZ,
  is_new BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE INDEX idx_user_badges_earned ON user_badges(user_id, is_earned) WHERE is_earned = TRUE;
CREATE INDEX idx_user_badges_new ON user_badges(user_id, is_new) WHERE is_new = TRUE;

-- 16. Leaderboard
CREATE TABLE leaderboard_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  rank_id INTEGER REFERENCES ranks(id),
  weekly_xp BIGINT DEFAULT 0,
  weekly_swipes INTEGER DEFAULT 0,
  weekly_battles INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  rank_position INTEGER,
  week_start DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_leaderboard_weekly_position ON leaderboard_weekly(week_start, rank_position ASC);
CREATE INDEX idx_leaderboard_weekly_xp ON leaderboard_weekly(week_start, weekly_xp DESC);

-- 17. Friends
CREATE TABLE friends (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, friend_id)
);

CREATE INDEX idx_friends_user ON friends(user_id, status);
CREATE INDEX idx_friends_friend ON friends(friend_id, status);

-- 18. Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);

-- 19. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  is_push_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- 20. Audio Play Log
CREATE TABLE audio_play_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  speed TEXT DEFAULT 'normal' CHECK (speed IN ('normal', 'slow', 'very_slow')),
  played_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audio_log_user ON audio_play_log(user_id, played_at DESC);
CREATE INDEX idx_audio_log_word ON audio_play_log(word_id);
-- Skipped: immutable date cast not possible with TIMESTAMPTZ

-- 21. Share Log
CREATE TABLE share_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL CHECK (share_type IN ('streak', 'badge', 'rank', 'daily_result', 'battle_result', 'referral')),
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'whatsapp', 'twitter', 'copy')),
  card_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_share_log_user ON share_log(user_id, created_at DESC);
CREATE INDEX idx_share_log_type ON share_log(share_type, created_at DESC);

-- 22. Analytics Events
CREATE TABLE analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id UUID,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE analytics_events_2026_01 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE analytics_events_2026_02 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE analytics_events_2026_03 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE analytics_events_2026_04 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
CREATE TABLE analytics_events_2026_05 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
CREATE TABLE analytics_events_2026_06 PARTITION OF analytics_events
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
CREATE TABLE analytics_events_default PARTITION OF analytics_events DEFAULT;

CREATE INDEX idx_analytics_events_name ON analytics_events(event_name, created_at DESC);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id, created_at DESC);

-- Leaderboard Friends Materialized View
CREATE MATERIALIZED VIEW leaderboard_friends AS
SELECT
  f.user_id AS viewer_id,
  f.friend_id AS friend_id,
  u.username,
  u.avatar_url,
  p.xp,
  p.level,
  p.current_streak,
  p.rank_id,
  p.total_words_learned
FROM friends f
JOIN users u ON f.friend_id = u.id
JOIN profiles p ON f.friend_id = p.user_id
WHERE f.status = 'accepted'
UNION
SELECT
  u.id AS viewer_id,
  u.id AS friend_id,
  u.username,
  u.avatar_url,
  p.xp,
  p.level,
  p.current_streak,
  p.rank_id,
  p.total_words_learned
FROM users u
JOIN profiles p ON u.id = p.user_id
ORDER BY viewer_id, xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_friends_viewer ON leaderboard_friends(viewer_id, friend_id);

-- ============================================================
-- RPC Functions
-- ============================================================

-- Earn XP
CREATE OR REPLACE FUNCTION earn_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE(new_xp BIGINT, new_level INTEGER, leveled_up BOOLEAN, rank_updated BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current_xp BIGINT;
  v_new_xp BIGINT;
  v_current_level INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
  v_rank_updated BOOLEAN := FALSE;
BEGIN
  SELECT xp, level INTO v_current_xp, v_current_level
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  v_new_xp := v_current_xp + p_amount;
  v_new_level := calculate_level(v_new_xp);

  UPDATE profiles SET
    xp = v_new_xp,
    lifetime_xp = lifetime_xp + GREATEST(p_amount, 0),
    level = v_new_level,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  IF v_new_level > v_current_level THEN v_leveled_up := TRUE; END IF;
  IF v_leveled_up THEN v_rank_updated := TRUE; END IF;

  INSERT INTO xp_transactions (user_id, amount, balance_before, balance_after, source, source_id, description, metadata)
  VALUES (p_user_id, p_amount, v_current_xp, v_new_xp, p_source, p_source_id, p_description, p_metadata);

  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up, v_rank_updated;
END;
$$;

-- Check Rank Up
CREATE OR REPLACE FUNCTION check_rank_up(p_user_id UUID)
RETURNS TABLE(rank_up BOOLEAN, new_rank_id INTEGER, new_rank_name TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current_xp BIGINT;
  v_current_rank_id INTEGER;
  v_new_rank_id INTEGER;
BEGIN
  SELECT xp, rank_id INTO v_current_xp, v_current_rank_id
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  SELECT id INTO v_new_rank_id FROM ranks
  WHERE min_xp <= v_current_xp ORDER BY id DESC LIMIT 1;

  IF v_new_rank_id > v_current_rank_id THEN
    UPDATE profiles SET rank_id = v_new_rank_id WHERE user_id = p_user_id;
    PERFORM insert_notification(p_user_id, 'rank_up', jsonb_build_object('old_rank', v_current_rank_id, 'new_rank', v_new_rank_id));
    RETURN QUERY SELECT TRUE, v_new_rank_id, (SELECT name FROM ranks WHERE id = v_new_rank_id);
  ELSE
    RETURN QUERY SELECT FALSE, v_current_rank_id, (SELECT name FROM ranks WHERE id = v_current_rank_id);
  END IF;
END;
$$;

-- Record Daily Activity
CREATE OR REPLACE FUNCTION record_daily_activity(
  p_user_id UUID,
  p_xp_earned INTEGER DEFAULT 0,
  p_swipe_count INTEGER DEFAULT 0,
  p_battle_count INTEGER DEFAULT 0,
  p_audio_count INTEGER DEFAULT 0,
  p_timezone TEXT DEFAULT 'Asia/Jakarta'
)
RETURNS TABLE(streak_count INTEGER, is_new_streak BOOLEAN, streak_milestone INTEGER)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_local_date DATE;
  v_yesterday DATE;
  v_last_active DATE;
  v_current_streak INTEGER;
  v_is_new_streak BOOLEAN := FALSE;
  v_streak_milestone INTEGER := 0;
  v_frozen_used BOOLEAN := FALSE;
BEGIN
  v_local_date := (NOW() AT TIME ZONE p_timezone)::DATE;
  v_yesterday := v_local_date - 1;

  SELECT current_streak, last_streak_date INTO v_current_streak, v_last_active
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  IF v_last_active = v_local_date THEN
    UPDATE streak_log SET
      xp_earned = xp_earned + p_xp_earned,
      swipe_count = swipe_count + p_swipe_count,
      battle_count = battle_count + p_battle_count,
      audio_count = audio_count + p_audio_count
    WHERE user_id = p_user_id AND activity_date = v_today;
    RETURN QUERY SELECT v_current_streak, FALSE, 0;
    RETURN;
  END IF;

  INSERT INTO streak_log (user_id, activity_date, timezone, local_date, xp_earned, swipe_count, battle_count, audio_count)
  VALUES (p_user_id, v_today, p_timezone, v_local_date, p_xp_earned, p_swipe_count, p_battle_count, p_audio_count);

  IF v_last_active = v_yesterday THEN
    v_current_streak := v_current_streak + 1;
    v_is_new_streak := TRUE;
  ELSIF v_last_active < v_yesterday THEN
    IF (SELECT streak_freeze FROM profiles WHERE user_id = p_user_id) > 0 THEN
      UPDATE profiles SET streak_freeze = streak_freeze - 1 WHERE user_id = p_user_id;
      v_current_streak := v_current_streak + 1;
      v_frozen_used := TRUE;
      v_is_new_streak := TRUE;
    ELSE
      v_current_streak := 1;
      v_is_new_streak := TRUE;
    END IF;
  ELSE
    v_is_new_streak := FALSE;
  END IF;

  UPDATE profiles SET
    current_streak = v_current_streak,
    last_streak_date = v_local_date,
    highest_streak = GREATEST(highest_streak, v_current_streak),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  IF v_current_streak IN (7, 14, 30, 60, 100) THEN
    v_streak_milestone := v_current_streak;
    PERFORM check_streak_badge(p_user_id, v_current_streak);
  END IF;

  RETURN QUERY SELECT v_current_streak, v_is_new_streak, v_streak_milestone;
END;
$$;

-- Check Streak Badge
CREATE OR REPLACE FUNCTION check_streak_badge(p_user_id UUID, p_streak INTEGER)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  CASE p_streak
    WHEN 7 THEN PERFORM award_badge(p_user_id, 'striker_7');
    WHEN 14 THEN PERFORM award_badge(p_user_id, 'blaze_14');
    WHEN 30 THEN PERFORM award_badge(p_user_id, 'inferno_30');
    WHEN 60 THEN PERFORM award_badge(p_user_id, 'legend_60');
    WHEN 100 THEN PERFORM award_badge(p_user_id, 'immortal_100');
    ELSE NULL;
  END CASE;
END;
$$;

-- Award Badge
CREATE OR REPLACE FUNCTION award_badge(p_user_id UUID, p_badge_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_badge_id UUID;
  v_already_earned BOOLEAN;
BEGIN
  SELECT id INTO v_badge_id FROM badges WHERE slug = p_badge_slug;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  SELECT is_earned INTO v_already_earned FROM user_badges
  WHERE user_id = p_user_id AND badge_id = v_badge_id;

  IF v_already_earned THEN RETURN FALSE; END IF;

  INSERT INTO user_badges (user_id, badge_id, progress, is_earned, earned_at, is_new)
  VALUES (p_user_id, v_badge_id, 1, TRUE, NOW(), TRUE)
  ON CONFLICT (user_id, badge_id) DO UPDATE SET
    is_earned = TRUE, earned_at = NOW(), is_new = TRUE;

  PERFORM insert_notification(p_user_id, 'badge_earned', jsonb_build_object('badge_slug', p_badge_slug));
  PERFORM earn_xp(p_user_id, 100, 'badge_earned', v_badge_id, 'Badge: ' || (SELECT name FROM badges WHERE id = v_badge_id));
  RETURN TRUE;
END;
$$;

-- Insert Notification
CREATE OR REPLACE FUNCTION insert_notification(
  p_user_id UUID,
  p_type TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_notification_id UUID;
  v_title TEXT;
  v_body TEXT;
BEGIN
  CASE p_type
    WHEN 'streak_danger' THEN
      v_title := 'Streakmu dalam bahaya!'; v_body := 'Ayo belajar sebelum streak putus!';
    WHEN 'streak_lost' THEN
      v_title := 'Streak putus...'; v_body := 'Jangan sedih, mulai lagi hari ini!';
    WHEN 'streak_milestone' THEN
      v_title := '🔥 ' || (p_data->>'days')::TEXT || ' hari streak!'; v_body := 'Luar biasa! Pertahankan!';
    WHEN 'badge_earned' THEN
      v_title := '🏅 Badge baru!'; v_body := 'Kamu mendapatkan badge baru! Cek di Progress.';
    WHEN 'rank_up' THEN
      v_title := '🎉 Rank Up!'; v_body := 'Selamat! Kamu naik rank!';
    WHEN 'level_up' THEN
      v_title := '🎉 Level Up!'; v_body := 'Kamu naik ke level ' || (p_data->>'level')::TEXT || '!';
    WHEN 'mission_reminder' THEN
      v_title := '📋 Misi belum selesai'; v_body := 'Masih ada misi yang bisa dikerjakan!';
    WHEN 'friend_active' THEN
      v_title := '👋 Teman aktif'; v_body := (p_data->>'friend_name')::TEXT || ' baru saja belajar!';
    ELSE
      v_title := 'Notifikasi'; v_body := '';
  END CASE;

  INSERT INTO notifications (user_id, type, title, body, data)
  VALUES (p_user_id, p_type, v_title, v_body, p_data)
  RETURNING id INTO v_notification_id;
  RETURN v_notification_id;
END;
$$;

-- Get Due Words (SRS)
CREATE OR REPLACE FUNCTION get_due_words(p_user_id UUID, p_limit INTEGER DEFAULT 15)
RETURNS TABLE(word_id UUID, arabic_text TEXT, transliteration TEXT, meaning_id TEXT, audio_url TEXT, confidence INTEGER, is_new BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  (SELECT v.id, v.arabic_text, v.transliteration, v.meaning_id, v.audio_url, uwp.confidence, FALSE
   FROM user_word_progress uwp
   JOIN vocabulary_words v ON uwp.word_id = v.id
   WHERE uwp.user_id = p_user_id AND uwp.next_review_at <= NOW() AND uwp.is_mastered = FALSE AND v.is_active = TRUE
   ORDER BY uwp.next_review_at ASC LIMIT p_limit)

  UNION ALL

  (SELECT v.id, v.arabic_text, v.transliteration, v.meaning_id, v.audio_url, 0::INTEGER, TRUE
   FROM vocabulary_words v
   WHERE v.id NOT IN (SELECT word_id FROM user_word_progress WHERE user_id = p_user_id) AND v.is_active = TRUE
   ORDER BY v.difficulty ASC, v.frequency_score DESC LIMIT GREATEST(p_limit / 3, 5))

  LIMIT p_limit;
END;
$$;

-- Auth User Created Handler
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Auth Trigger
-- ============================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_session_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_play_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Word progress policies
CREATE POLICY "Users can read own progress" ON user_word_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_word_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_word_progress FOR UPDATE USING (auth.uid() = user_id);

-- Swipe sessions policies
CREATE POLICY "Users can read own sessions" ON swipe_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON swipe_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own session words" ON swipe_session_words FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own session words" ON swipe_session_words FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Battle policies
CREATE POLICY "Users can read own battles" ON battles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own battles" ON battles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own battle questions" ON battle_questions FOR SELECT USING (EXISTS (SELECT 1 FROM battles WHERE battles.id = battle_id AND battles.user_id = auth.uid()));
CREATE POLICY "Users can insert own battle questions" ON battle_questions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM battles WHERE battles.id = battle_id AND battles.user_id = auth.uid()));

-- Daily missions policies
CREATE POLICY "Users can read own missions" ON daily_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own missions" ON daily_missions FOR UPDATE USING (auth.uid() = user_id);

-- XP transactions policies
CREATE POLICY "Users can read own XP log" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "XP insert via RPC only" ON xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Users can read own badge progress" ON user_badges FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Friends policies
CREATE POLICY "Users can read own friends" ON friends FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can insert own friends" ON friends FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Anyone can read weekly leaderboard" ON leaderboard_weekly FOR SELECT USING (true);

-- Public table policies
CREATE POLICY "Anyone can read ranks" ON ranks FOR SELECT USING (true);
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read vocabulary" ON vocabulary_words FOR SELECT USING (true);
CREATE POLICY "Anyone can read lessons" ON lessons FOR SELECT USING (true);

-- Referrals policies
CREATE POLICY "Users can read own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- Streak log policies
CREATE POLICY "Users can read own streak" ON streak_log FOR SELECT USING (auth.uid() = user_id);

-- Audio log policies
CREATE POLICY "Users can read own audio log" ON audio_play_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audio log" ON audio_play_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Share log policies
CREATE POLICY "Users can read own shares" ON share_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shares" ON share_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can read own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON user_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Seed Data
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Objek Sehari-hari', 'daily-objects', '📦', '#10B981'),
  ('Kata Kerja Dasar', 'basic-verbs', '🏃', '#3B82F6'),
  ('Angka', 'numbers', '🔢', '#FACC15'),
  ('Keluarga', 'family', '👨‍👩‍👧‍👦', '#F97316'),
  ('Warna', 'colors', '🎨', '#A855F7'),
  ('Makanan & Minuman', 'food-drink', '🍽️', '#EF4444'),
  ('Tempat', 'places', '📍', '#06B6D4'),
  ('Waktu', 'time', '⏰', '#8B5CF6'),
  ('Al-Quran', 'quran', '📖', '#10B981'),
  ('Doa Sehari-hari', 'daily-prayer', '🤲', '#FACC15');

-- Ranks
INSERT INTO ranks (id, name, min_xp, icon, color, description) VALUES
  (1, 'Pemula',       0,      '🌱', '#94A3B8', 'Langkah pertama menuju ilmu'),
  (2, 'Musafir',      1000,   '🧭', '#34D399', 'Pengelana yang mencari pengetahuan'),
  (3, 'Penuntut Ilmu', 5000,  '📖', '#3B82F6', 'Sungguh-sungguh dalam belajar'),
  (4, 'Ahli Nahwu',    20000, '📜', '#A855F7', 'Menguasai tata bahasa Arab'),
  (5, 'Sultan Arabic', 50000, '👑', '#FACC15', 'Penguasa bahasa Arab yang dihormati');

-- Badges
INSERT INTO badges (name, slug, description, icon, rarity, category) VALUES
  ('Striker',       'striker_7',      'Streak 7 hari',           '🔥', 'rare', 'streak'),
  ('Blaze',         'blaze_14',       'Streak 14 hari',          '🔥', 'rare', 'streak'),
  ('Inferno',       'inferno_30',     'Streak 30 hari',          '🔥', 'epic', 'streak'),
  ('Legend Streak', 'legend_60',      'Streak 60 hari',          '🔥', 'epic', 'streak'),
  ('Immortal',      'immortal_100',   'Streak 100 hari',         '🔥', 'legendary', 'streak'),
  ('First Victory', 'first_victory',  'Menang battle pertama',   '⚔️', 'common', 'battle'),
  ('Warrior',       'warrior_10',     'Menang 10 battle',        '⚔️', 'common', 'battle'),
  ('Boss Slayer',   'boss_slayer',    'Kalahkan Boss',           '👑', 'rare', 'battle'),
  ('Scholar',       'scholar_50',     'Pelajari 50 kata',        '📖', 'common', 'vocabulary'),
  ('Word Master',   'word_master_200','Pelajari 200 kata',       '📖', 'rare', 'vocabulary'),
  ('Polyglot',      'polyglot_500',   'Pelajari 500 kata',       '📖', 'epic', 'vocabulary'),
  ('Social Butterfly', 'social_5',    'Ajak 5 teman',            '🦋', 'common', 'social'),
  ('Combo King',    'combo_10',       'Combo 10x',               '💥', 'rare', 'battle'),
  ('Perfect Battle','perfect_battle', 'Battle tanpa salah',      '🎯', 'epic', 'battle'),
  ('Early Adopter', 'early_adopter',  'Bergabung di bulan pertama','⭐', 'legendary', 'special');

-- Vocabulary Words (50 MVP)
INSERT INTO vocabulary_words (arabic_text, transliteration, meaning_id, difficulty, word_type, category_id)
VALUES
  -- Daily Objects (10)
  ('كِتَاب', 'kitab', 'buku', 1, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('قَلَم', 'qalam', 'pulpen', 1, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('بَاب', 'bab', 'pintu', 1, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('نَافِذَة', 'nafidhah', 'jendela', 2, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('كُرْسِيّ', 'kursiy', 'kursi', 1, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('مَكْتَب', 'maktab', 'meja', 1, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('سَرِير', 'sariir', 'tempat tidur', 2, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('هَاتِف', 'hatif', 'telepon', 2, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('مِفْتَاح', 'miftah', 'kunci', 2, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('سَاعَة', 'saa''ah', 'jam', 1, 'noun', (SELECT id FROM categories WHERE slug = 'daily-objects')),
  -- Basic Verbs (10)
  ('أَكَل', 'akala', 'makan', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('شَرِب', 'shariba', 'minum', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('نَام', 'naama', 'tidur', 1, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('قَرَأ', 'qara''a', 'membaca', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('كَتَب', 'kataba', 'menulis', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('ذَهَب', 'dhahaba', 'pergi', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('جَاء', 'jaa''a', 'datang', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('جَلَس', 'jalasa', 'duduk', 1, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('وَقَف', 'waqafa', 'berdiri', 1, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  ('رَكَض', 'rakadha', 'berlari', 2, 'verb', (SELECT id FROM categories WHERE slug = 'basic-verbs')),
  -- Numbers (5)
  ('وَاحِد', 'wahid', 'satu', 1, 'noun', (SELECT id FROM categories WHERE slug = 'numbers')),
  ('اِثْنَان', 'ithnan', 'dua', 1, 'noun', (SELECT id FROM categories WHERE slug = 'numbers')),
  ('ثَلَاثَة', 'thalathah', 'tiga', 1, 'noun', (SELECT id FROM categories WHERE slug = 'numbers')),
  ('أَرْبَعَة', 'arba''ah', 'empat', 1, 'noun', (SELECT id FROM categories WHERE slug = 'numbers')),
  ('خَمْسَة', 'khamsah', 'lima', 1, 'noun', (SELECT id FROM categories WHERE slug = 'numbers')),
  -- Family (5)
  ('أَب', 'ab', 'ayah', 1, 'noun', (SELECT id FROM categories WHERE slug = 'family')),
  ('أُم', 'umm', 'ibu', 1, 'noun', (SELECT id FROM categories WHERE slug = 'family')),
  ('أَخ', 'akh', 'saudara laki-laki', 1, 'noun', (SELECT id FROM categories WHERE slug = 'family')),
  ('أُخْت', 'ukht', 'saudara perempuan', 1, 'noun', (SELECT id FROM categories WHERE slug = 'family')),
  ('جَدّ', 'jadd', 'kakek', 2, 'noun', (SELECT id FROM categories WHERE slug = 'family')),
  -- Colors (5)
  ('أَحْمَر', 'ahmar', 'merah', 1, 'adjective', (SELECT id FROM categories WHERE slug = 'colors')),
  ('أَزْرَق', 'azraq', 'biru', 1, 'adjective', (SELECT id FROM categories WHERE slug = 'colors')),
  ('أَخْضَر', 'akhdhar', 'hijau', 1, 'adjective', (SELECT id FROM categories WHERE slug = 'colors')),
  ('أَصْفَر', 'ashfar', 'kuning', 1, 'adjective', (SELECT id FROM categories WHERE slug = 'colors')),
  ('أَبْيَض', 'abyadh', 'putih', 1, 'adjective', (SELECT id FROM categories WHERE slug = 'colors')),
  -- Food & Drink (5)
  ('طَعَام', 'tha''am', 'makanan', 2, 'noun', (SELECT id FROM categories WHERE slug = 'food-drink')),
  ('مَاء', 'maa''', 'air', 1, 'noun', (SELECT id FROM categories WHERE slug = 'food-drink')),
  ('لَبَن', 'laban', 'susu', 2, 'noun', (SELECT id FROM categories WHERE slug = 'food-drink')),
  ('خُبْز', 'khubz', 'roti', 2, 'noun', (SELECT id FROM categories WHERE slug = 'food-drink')),
  ('تُفَّاح', 'tuffah', 'apel', 2, 'noun', (SELECT id FROM categories WHERE slug = 'food-drink')),
  -- Places (5)
  ('مَسْجِد', 'masjid', 'masjid', 1, 'noun', (SELECT id FROM categories WHERE slug = 'places')),
  ('مَدْرَسَة', 'madrasah', 'sekolah', 2, 'noun', (SELECT id FROM categories WHERE slug = 'places')),
  ('بَيْت', 'bayt', 'rumah', 1, 'noun', (SELECT id FROM categories WHERE slug = 'places')),
  ('سُوق', 'suq', 'pasar', 2, 'noun', (SELECT id FROM categories WHERE slug = 'places')),
  ('مَطْعَم', 'mat''am', 'restoran', 3, 'noun', (SELECT id FROM categories WHERE slug = 'places')),
  -- Time (5)
  ('يَوْم', 'yawm', 'hari', 1, 'noun', (SELECT id FROM categories WHERE slug = 'time')),
  ('لَيْلَة', 'laylah', 'malam', 1, 'noun', (SELECT id FROM categories WHERE slug = 'time')),
  ('سَاعَة', 'saa''ah', 'jam', 1, 'noun', (SELECT id FROM categories WHERE slug = 'time')),
  ('أُسْبُوع', 'usbuu''', 'minggu', 2, 'noun', (SELECT id FROM categories WHERE slug = 'time')),
  ('شَهْر', 'shahr', 'bulan', 2, 'noun', (SELECT id FROM categories WHERE slug = 'time'));

-- ============================================================
-- Create seed.sql for supabase/seed.sql
-- ============================================================

-- Note: The seed data above is part of the migration.
-- For `supabase db reset`, the seed.sql file can reference
-- additional development seed data (e.g., test users).
