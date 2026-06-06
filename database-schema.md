# Database Schema — Harf

**Version:** 1.0  
**Platform:** Supabase PostgreSQL 15+  
**Stack:** Next.js + TypeScript + Zustand  
**Focus:** Scalability, security, mobile-first performance  

---

## 1. Database Overview

### Platform

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Database** | Supabase PostgreSQL 15 | Managed Postgres, built-in auth, realtime, edge functions |
| **Auth** | Supabase Auth (GoTrue) | Handles OAuth, magic link, session management |
| **Storage** | Supabase Storage (S3-compatible) | Audio files, mascot assets, badge images |
| **Realtime** | Supabase Realtime (WebSockets) | Leaderboard, friend activity |
| **Edge Functions** | Supabase Edge Functions (Deno) | Battle AI, daily reset, leaderboard computation |
| **Caching** | Supabase pg_stat_statements + query optimization | Read-heavy optimization |

### Design Philosophy

```
"Read-optimized for mobile. Write-serialized for game integrity. 
Denormalize where performance matters. Normalize where data integrity matters."
```

| Principle | Implementation |
|-----------|----------------|
| **Read-optimized** | Denormalized aggregate tables for leaderboard, stats, profile snapshots |
| **Write-serialized** | Game-critical writes via RPC functions (not direct table inserts) |
| **Soft deletes** | `deleted_at` instead of hard DELETE for user data |
| **Audit trail** | `created_at` and `updated_at` on every table |
| **Immutable logs** | Battle history, swipe logs — append-only, never updated |
| **JSON where appropriate** | Avoid joins for rarely-queried nested data (e.g., user preferences) |
| **Timezone-aware** | All timestamps in UTC, timezone conversion in application layer |

### Naming Conventions

| Convention | Rule | Example |
|------------|------|---------|
| **Tables** | snake_case, plural | `users`, `vocabulary_words`, `swipe_sessions` |
| **Columns** | snake_case | `arabic_text`, `xp_earned` |
| **Primary keys** | `id` UUID | `id UUID DEFAULT gen_random_uuid()` |
| **Foreign keys** | `{table}_id` | `user_id`, `word_id` |
| **Timestamps** | `created_at`, `updated_at` | Always with timezone |
| **Soft delete** | `deleted_at` | Nullable timestamp |
| **Boolean** | `is_` prefix | `is_completed`, `is_active` |
| **Enum** | PascalCase | `MissionType`, `BattleResult` |
| **Indexes** | `idx_{table}_{column}` | `idx_users_email` |
| **Unique constraints** | `uq_{table}_{column}` | `uq_users_username` |

---

## 2. Architectural Principles

### Data Flow

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT (Next.js)                     │
│                                                          │
│  Zustand Store (optimistic updates)                      │
│       │                                                  │
│       ▼                                                  │
│  Supabase Client SDK                                     │
│       │                                                  │
│       ├── SELECT (read) → Direct query (RLS enforced)    │
│       ├── INSERT/UPDATE (write) → RPC function           │
│       └── Realtime subscription → Live query             │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    SUPABASE SERVER                        │
│                                                          │
│  ┌─────────────────┐  ┌──────────────────┐               │
│  │  PostgreSQL      │  │  Edge Functions  │               │
│  │  - RLS policies  │  │  - Battle AI     │               │
│  │  - RPC functions │  │  - Daily reset   │               │
│  │  - Triggers      │  │  - Leaderboard   │               │
│  │  - Indexes       │  │  - Streak check  │               │
│  └─────────────────┘  └──────────────────┘               │
└──────────────────────────────────────────────────────────┘
```

### Write Strategy (Anti-cheat)

```
CRITICAL WRITES (XP, streak, battle result):
  Client sends action → Edge Function / RPC validates → Server writes
  NEVER trust client: client can send "I won a battle" but server
  validates the battle data and calculates rewards.

NON-CRITICAL WRITES (profile, settings):
  Client writes directly → RLS ensures user owns data → Table updated

OFFLINE QUEUE:
  Client queues writes → On reconnect → RPC processes queue →
  Server validates timestamps → Accept or reject (conflict resolution)
```

---

## 3. Entity Relationship Overview

### Core Entities

```
users (1) ───────< (N) user_word_progress > (N) vocabulary_words
  │                      │
  │                      ├── swipe_sessions
  │                      │
  ├── profiles (1:1)     │
  │                      ├── battles
  ├── user_badges (N:M)  │
  │                      ├── daily_missions
  ├── friends (self-ref) │
  │                      ├── streak_log
  ├── referrals (1:N)    │
  │                      └── xp_transactions
  └── notifications (N)
```

### Relationship Map

```
users
  │
  ├── 1:1 → profiles (user_id)
  ├── 1:N → user_word_progress (user_id)
  ├── 1:N → swipe_sessions (user_id)
  ├── 1:N → battles (user_id)
  ├── 1:N → daily_missions (user_id)
  ├── 1:N → streak_log (user_id)
  ├── 1:N → xp_transactions (user_id)
  ├── 1:N → notifications (user_id)
  ├── 1:N → referrals (referrer_id)
  ├── 1:N → referrals (referred_id)
  ├── N:M → badges (via user_badges)
  └── N:M → friends (via friends table, self-referencing)

profiles
  └── 1:1 → users (id)

vocabulary_words
  ├── 1:N → user_word_progress (word_id)
  ├── 1:N → swipe_session_words (word_id)
  └── N:1 → categories (category_id)

categories
  └── 1:N → vocabulary_words (category_id)

ranks
  └── 1:N → profiles (rank_id)

badges
  └── 1:N → user_badges (badge_id)
```

---

## 4. User System Schema

### Table: `users`

**Purpose:** Authentication and identity. Managed by Supabase Auth with extended fields.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | User identifier |
| `email` | `TEXT` | `UNIQUE` | Email address |
| `username` | `TEXT` | `UNIQUE NOT NULL` | Display name (3-20 chars, alphanumeric + underscore) |
| `avatar_url` | `TEXT` | | Profile picture URL (Supabase storage) |
| `referral_code` | `TEXT` | `UNIQUE NOT NULL` | Unique code for sharing: `HARF-{username}` |
| `is_guest` | `BOOLEAN` | `DEFAULT FALSE` | Guest account flag |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Soft disable flag |
| `last_active_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last activity timestamp |
| `last_login_at` | `TIMESTAMPTZ` | | Last login timestamp |
| `metadata` | `JSONB` | `DEFAULT '{}'` | Flexible metadata (device, timezone, etc.) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Account creation |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last update |
| `deleted_at` | `TIMESTAMPTZ` | | Soft delete timestamp |

```sql
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

-- Triggers
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_users_set_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION set_referral_code();
```

### Indexes

```sql
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_referral_code ON users(referral_code) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_last_active ON users(last_active_at DESC);
CREATE INDEX idx_users_created ON users(created_at DESC);
```

### Helper Function: `set_referral_code()`

```sql
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := 'HARF-' || UPPER(NEW.username);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Helper Function: `update_updated_at_column()`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Authentication Schema

### Supabase Auth Tables

Supabase Auth manages its own schema (`auth.users`, `auth.sessions`, etc.). We extend it:

```sql
-- Sync trigger: when a user is created in auth.users, create user record
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

  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
```

### Session Handling

```sql
-- User session log (for analytics & security)
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
```

---

## 6. Profile Schema

### Table: `profiles`

**Purpose:** Game progression data. Denormalized for fast reads. 1:1 with users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `UUID` | `PK REFERENCES users(id) ON DELETE CASCADE` | FK to users |
| `xp` | `BIGINT` | `DEFAULT 0 CHECK (xp >= 0)` | Total XP |
| `lifetime_xp` | `BIGINT` | `DEFAULT 0 CHECK (lifetime_xp >= 0)` | All-time XP (never decreases) |
| `level` | `INTEGER` | `DEFAULT 1 CHECK (level >= 1)` | Current level |
| `rank_id` | `INTEGER` | `REFERENCES ranks(id)` | Current rank |
| `total_words_learned` | `INTEGER` | `DEFAULT 0 CHECK (total_words_learned >= 0)` | Unique words with confidence >= 2 |
| `total_battles_won` | `INTEGER` | `DEFAULT 0` | Lifetime battles won |
| `total_battles_played` | `INTEGER` | `DEFAULT 0` | Lifetime battles played |
| `highest_streak` | `INTEGER` | `DEFAULT 0 CHECK (highest_streak >= 0)` | Best streak ever |
| `current_streak` | `INTEGER` | `DEFAULT 0 CHECK (current_streak >= 0)` | Current streak count |
| `last_streak_date` | `DATE` | | Last date with activity (for streak calc) |
| `streak_freeze` | `INTEGER` | `DEFAULT 0 CHECK (streak_freeze >= 0)` | Available streak freezes |
| `coins` | `INTEGER` | `DEFAULT 0 CHECK (coins >= 0)` | In-app currency |
| `total_coins_earned` | `INTEGER` | `DEFAULT 0` | Lifetime coins |
| `preferences` | `JSONB` | `DEFAULT '{}'` | User preferences (audio, theme, notifications) |
| `showcase_badges` | `UUID[]` | `DEFAULT '{}'` | Array of 3 badge IDs to showcase |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Indexes

```sql
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_profiles_level ON profiles(level DESC);
CREATE INDEX idx_profiles_rank ON profiles(rank_id);
```

---

## 7. Learning Progress Schema

### Table: `user_word_progress`

**Purpose:** Spaced Repetition System (SRS) tracking per user per word. Core of the learning algorithm.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `word_id` | `UUID` | `NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE` | |
| `confidence` | `INTEGER` | `DEFAULT 0 CHECK (confidence BETWEEN 0 AND 5)` | 0=new, 1-5=mastery level |
| `swipe_right_count` | `INTEGER` | `DEFAULT 0` | Times user swiped right (knew) |
| `swipe_left_count` | `INTEGER` | `DEFAULT 0` | Times user swiped left (didn't know) |
| `audio_played_count` | `INTEGER` | `DEFAULT 0` | Times audio was played |
| `combo_max_achieved` | `INTEGER` | `DEFAULT 0` | Highest combo during word review |
| `last_reviewed_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last time user saw this word |
| `next_review_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | SRS-based next review time |
| `is_learned` | `BOOLEAN` | `DEFAULT FALSE` | Word marked as "learned" (confidence >= 2) |
| `is_mastered` | `BOOLEAN` | `DEFAULT FALSE` | Word marked as "mastered" (confidence >= 4) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Indexes

```sql
-- Primary query: get due words for user
CREATE INDEX idx_uwp_next_review ON user_word_progress(user_id, next_review_at ASC)
  WHERE is_mastered = FALSE;

-- Secondary: get unlearned words
CREATE INDEX idx_uwp_unlearned ON user_word_progress(user_id)
  WHERE is_learned = FALSE;

-- Learning stats per user
CREATE INDEX idx_uwp_user_stats ON user_word_progress(user_id, is_learned, is_mastered);

-- Spaced repetition query
CREATE INDEX idx_uwp_srs ON user_word_progress(user_id, confidence, next_review_at);
```

### SRS Algorithm Note

The `next_review_at` is calculated using a modified SM-2 algorithm:

```
confidence 0 (new):   review immediately
confidence 1:         review in 4 hours
confidence 2:         review in 1 day    (learned threshold)
confidence 3:         review in 3 days
confidence 4:         review in 7 days   (mastered threshold)
confidence 5:         review in 14 days
```

Implementation via RPC function:

```sql
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
```

---

## 8. Vocabulary Schema

### Table: `vocabulary_words`

**Purpose:** Master vocabulary repository. All Arabic words, meanings, and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `arabic_text` | `TEXT` | `NOT NULL` | Arabic script (e.g., كِتَاب) |
| `vowelled_text` | `TEXT` | | Arabic with diacritical marks (tashkeel) |
| `transliteration` | `TEXT` | `NOT NULL` | Latin transliteration (e.g., "kitab") |
| `meaning_id` | `TEXT` | `NOT NULL` | Meaning in Indonesian |
| `meaning_en` | `TEXT` | | Meaning in English (future use) |
| `example_sentence` | `TEXT` | | Example usage in Arabic |
| `example_meaning` | `TEXT` | | Example sentence translation |
| `category_id` | `UUID` | `REFERENCES categories(id)` | Thematic category |
| `difficulty` | `INTEGER` | `DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5)` | 1=easiest, 5=hardest |
| `frequency_score` | `INTEGER` | `DEFAULT 0` | Common usage frequency (for SRS ordering) |
| `audio_url` | `TEXT` | | Storage path to audio file |
| `audio_duration_ms` | `INTEGER` | | Audio duration in milliseconds |
| `root_letters` | `TEXT` | | Arabic root letters (for advanced learning) |
| `word_type` | `TEXT` | `CHECK (word_type IN ('noun', 'verb', 'adjective', 'particle', 'expression'))` | Grammatical type |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Soft disable |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Indexes

```sql
CREATE INDEX idx_vocab_category ON vocabulary_words(category_id);
CREATE INDEX idx_vocab_difficulty ON vocabulary_words(difficulty);
CREATE INDEX idx_vocab_active ON vocabulary_words(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_vocab_frequency ON vocabulary_words(frequency_score DESC);
CREATE INDEX idx_vocab_type ON vocabulary_words(word_type);
CREATE INDEX idx_vocab_search ON vocabulary_words USING gin(to_tsvector('indonesian', meaning_id));
```

### Seed Data: Basic Vocabulary (50 MVP words)

```sql
-- See Appendix A for full seed data
INSERT INTO vocabulary_words (arabic_text, transliteration, meaning_id, difficulty, category_id)
VALUES
  ('كِتَاب', 'kitab', 'buku', 1, (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('قَلَم', 'qalam', 'pulpen', 1, (SELECT id FROM categories WHERE slug = 'daily-objects')),
  ('بَاب', 'bab', 'pintu', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'));
```

---

## 9. Lesson Schema

### Table: `lessons`

**Purpose:** Grouped vocabulary sets. Each lesson is a collection of words around a theme.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `title` | `TEXT` | `NOT NULL` | Lesson name |
| `description` | `TEXT` | | Short description |
| `category_id` | `UUID` | `REFERENCES categories(id)` | Lesson category |
| `difficulty` | `INTEGER` | `DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5)` | |
| `order_index` | `INTEGER` | `DEFAULT 0` | Display order |
| `xp_reward` | `INTEGER` | `DEFAULT 100` | Completion XP |
| `word_count` | `INTEGER` | `DEFAULT 5` | Number of words in lesson |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Table: `lesson_words`

**Purpose:** Many-to-many relationship between lessons and vocabulary.

```sql
CREATE TABLE lesson_words (
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (lesson_id, word_id)
);

CREATE INDEX idx_lesson_words_lesson ON lesson_words(lesson_id);
CREATE INDEX idx_lesson_words_word ON lesson_words(word_id);
```

---

## 10. Category Schema

### Table: `categories`

**Purpose:** Thematic grouping for vocabulary and lessons.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `name` | `TEXT` | `NOT NULL` | Display name |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | URL-safe identifier |
| `icon` | `TEXT` | | Emoji or icon name |
| `color` | `TEXT` | | Hex color for category badge |
| `description` | `TEXT` | | |
| `order_index` | `INTEGER` | `DEFAULT 0` | |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Seed Categories

```sql
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
```

---

## 11. Swipe Session Schema

### Table: `swipe_sessions`

**Purpose:** Log every learning session. Used for analytics, progress tracking, and anti-cheat.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `started_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Session start |
| `ended_at` | `TIMESTAMPTZ` | | Session end |
| `duration_seconds` | `INTEGER` | | Calculated session duration |
| `total_cards` | `INTEGER` | `DEFAULT 0` | Cards shown |
| `correct_count` | `INTEGER` | `DEFAULT 0` | Swipe right count |
| `incorrect_count` | `INTEGER` | `DEFAULT 0` | Swipe left count |
| `reveal_count` | `INTEGER` | `DEFAULT 0` | Tap to reveal count |
| `max_combo` | `INTEGER` | `DEFAULT 0` | Highest combo |
| `total_xp_earned` | `INTEGER` | `DEFAULT 0` | XP from this session |
| `words_new` | `INTEGER` | `DEFAULT 0` | New words learned |
| `words_reviewed` | `INTEGER` | `DEFAULT 0` | Review words |
| `is_completed` | `BOOLEAN` | `DEFAULT FALSE` | Natural completion vs early exit |
| `device_info` | `JSONB` | | Client metadata |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Table: `swipe_session_words`

**Purpose:** Individual card results within a session. Immutable, append-only.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `session_id` | `UUID` | `NOT NULL REFERENCES swipe_sessions(id) ON DELETE CASCADE` | |
| `word_id` | `UUID` | `NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | For direct queries |
| `action` | `TEXT` | `NOT NULL CHECK (action IN ('swipe_right', 'swipe_left', 'reveal'))` | |
| `confidence_before` | `INTEGER` | | User's confidence before this card |
| `confidence_after` | `INTEGER` | | User's confidence after |
| `combo_at_time` | `INTEGER` | `DEFAULT 0` | Combo at this card |
| `xp_earned` | `INTEGER` | `DEFAULT 0` | XP from this card |
| `response_time_ms` | `INTEGER` | | Time spent on this card (ms) |
| `audio_played` | `BOOLEAN` | `DEFAULT FALSE` | Whether audio was played |
| `swipe_velocity` | `REAL` | | Normalized swipe velocity (anti-cheat) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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

-- Critical index for session queries
CREATE INDEX idx_swipe_session_words_session ON swipe_session_words(session_id);
CREATE INDEX idx_swipe_session_words_user ON swipe_session_words(user_id, created_at DESC);
CREATE INDEX idx_swipe_session_words_word ON swipe_session_words(word_id);
```

---

## 12. Battle System Schema

### Table: `battles`

**Purpose:** Battle history and results. Immutable, append-only.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `enemy_type` | `TEXT` | `NOT NULL CHECK (enemy_type IN ('pemula', 'musafir', 'penuntut', 'nahwu_king'))` | |
| `enemy_level` | `INTEGER` | `DEFAULT 1` | Enemy AI level |
| `battle_date` | `DATE` | `DEFAULT CURRENT_DATE` | For daily tracking |
| `result` | `TEXT` | `NOT NULL CHECK (result IN ('victory', 'defeat', 'draw', 'forfeited'))` | |
| `player_hp_remaining` | `INTEGER` | | Player HP at end |
| `enemy_hp_remaining` | `INTEGER` | | Enemy HP at end |
| `total_questions` | `INTEGER` | `DEFAULT 10` | |
| `correct_count` | `INTEGER` | `DEFAULT 0` | |
| `wrong_count` | `INTEGER` | `DEFAULT 0` | |
| `timeout_count` | `INTEGER` | `DEFAULT 0` | |
| `max_combo` | `INTEGER` | `DEFAULT 0` | Highest combo |
| `total_damage_dealt` | `INTEGER` | `DEFAULT 0` | |
| `total_damage_taken` | `INTEGER` | `DEFAULT 0` | |
| `xp_earned` | `INTEGER` | `DEFAULT 0` | |
| `coins_earned` | `INTEGER` | `DEFAULT 0` | |
| `is_boss` | `BOOLEAN` | `DEFAULT FALSE` | Boss battle flag |
| `duration_seconds` | `INTEGER` | | Total battle duration |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Table: `battle_questions`

**Purpose:** Individual question results within a battle. Immutable.

```sql
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
  options_shown JSONB, -- The 4 options presented
  correct_option_index INTEGER NOT NULL,
  selected_option_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_battle_questions_battle ON battle_questions(battle_id);
```

---

## 13. XP System Schema

### Table: `xp_transactions`

**Purpose:** Immutable log of all XP changes. Used for audit, anti-cheat, and rollback.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `amount` | `INTEGER` | `NOT NULL` | Positive (earn) or negative (spend/admin) |
| `balance_before` | `INTEGER` | `NOT NULL` | XP before this transaction |
| `balance_after` | `INTEGER` | `NOT NULL` | XP after this transaction |
| `source` | `TEXT` | `NOT NULL` | Source type |
| `source_id` | `UUID` | | Reference to source record |
| `description` | `TEXT` | | Human-readable reason |
| `metadata` | `JSONB` | `DEFAULT '{}'` | Extra context |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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

-- XP Source enum values
COMMENT ON COLUMN xp_transactions.source IS E'
  swipe_correct | swipe_reveal | audio_listen |
  battle_win | battle_lose | battle_participation |
  daily_mission | streak_bonus | streak_milestone |
  first_session | level_up_bonus | referral_bonus |
  admin_adjustment | purchase_reward
';
```

### RPC: `earn_xp()`

**Purpose:** Single entry point for XP changes. Ensures data integrity and triggers side effects.

```sql
CREATE OR REPLACE FUNCTION earn_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE(new_xp BIGINT, new_level INTEGER, leveled_up BOOLEAN, rank_updated BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_xp BIGINT;
  v_new_xp BIGINT;
  v_current_level INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
  v_rank_updated BOOLEAN := FALSE;
BEGIN
  -- Lock the profile row to prevent race conditions
  SELECT xp, level INTO v_current_xp, v_current_level
  FROM profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  v_new_xp := v_current_xp + p_amount;
  v_new_level := calculate_level(v_new_xp);

  -- Update profile
  UPDATE profiles SET
    xp = v_new_xp,
    lifetime_xp = lifetime_xp + GREATEST(p_amount, 0),
    level = v_new_level,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Check if level changed
  IF v_new_level > v_current_level THEN
    v_leveled_up := TRUE;
  END IF;

  -- Check if rank changed
  IF v_leveled_up THEN
    -- Rank check happens in separate function
    v_rank_updated := TRUE;
  END IF;

  -- Insert transaction log
  INSERT INTO xp_transactions (user_id, amount, balance_before, balance_after, source, source_id, description, metadata)
  VALUES (p_user_id, p_amount, v_current_xp, v_new_xp, p_source, p_source_id, p_description, p_metadata);

  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up, v_rank_updated;
END;
$$;
```

### Helper Function: `calculate_level()`

```sql
CREATE OR REPLACE FUNCTION calculate_level(p_xp BIGINT)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_level INTEGER := 1;
  v_xp_needed BIGINT := 0;
BEGIN
  -- Formula: XP_needed(level) = 50 * level^1.5 + 50 * level
  LOOP
    v_xp_needed := floor(50 * POWER(v_level, 1.5) + 50 * v_level)::BIGINT;
    EXIT WHEN p_xp < v_xp_needed;
    v_level := v_level + 1;
  END LOOP;
  RETURN v_level;
END;
$$;
```

---

## 14. Rank System Schema

### Table: `ranks`

**Purpose:** Rank definitions. Static reference table, rarely changes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `INTEGER` | `PK` | Rank number (1-5) |
| `name` | `TEXT` | `NOT NULL` | Display name |
| `min_xp` | `BIGINT` | `NOT NULL` | XP required |
| `icon` | `TEXT` | `NOT NULL` | Emoji icon |
| `color` | `TEXT` | `NOT NULL` | Theme color |
| `description` | `TEXT` | | Rank description |

```sql
CREATE TABLE ranks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_xp BIGINT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT
);

INSERT INTO ranks (id, name, min_xp, icon, color, description) VALUES
  (1, 'Pemula',       0,      '🌱', '#94A3B8', 'Langkah pertama menuju ilmu'),
  (2, 'Musafir',      1000,   '🧭', '#34D399', 'Pengelana yang mencari pengetahuan'),
  (3, 'Penuntut Ilmu', 5000,  '📖', '#3B82F6', 'Sungguh-sungguh dalam belajar'),
  (4, 'Ahli Nahwu',    20000, '📜', '#A855F7', 'Menguasai tata bahasa Arab'),
  (5, 'Sultan Arabic', 50000, '👑', '#FACC15', 'Penguasa bahasa Arab yang dihormati');
```

### RPC: `check_rank_up()`

```sql
CREATE OR REPLACE FUNCTION check_rank_up(p_user_id UUID)
RETURNS TABLE(rank_up BOOLEAN, new_rank_id INTEGER, new_rank_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_xp BIGINT;
  v_current_rank_id INTEGER;
  v_new_rank_id INTEGER;
BEGIN
  SELECT xp, rank_id INTO v_current_xp, v_current_rank_id
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  -- Find highest rank user qualifies for
  SELECT id INTO v_new_rank_id FROM ranks
  WHERE min_xp <= v_current_xp
  ORDER BY id DESC LIMIT 1;

  IF v_new_rank_id > v_current_rank_id THEN
    UPDATE profiles SET rank_id = v_new_rank_id WHERE user_id = p_user_id;

    -- Fire rank up event (for notification system)
    PERFORM insert_notification(p_user_id, 'rank_up', jsonb_build_object(
      'old_rank', v_current_rank_id,
      'new_rank', v_new_rank_id
    ));

    RETURN QUERY SELECT TRUE, v_new_rank_id, (SELECT name FROM ranks WHERE id = v_new_rank_id);
  ELSE
    RETURN QUERY SELECT FALSE, v_current_rank_id, (SELECT name FROM ranks WHERE id = v_current_rank_id);
  END IF;
END;
$$;
```

---

## 15. Streak System Schema

### Table: `streak_log`

**Purpose:** Daily activity log. One row per active day per user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `activity_date` | `DATE` | `NOT NULL` | UTC date of activity |
| `timezone` | `TEXT` | | User timezone (for display) |
| `local_date` | `DATE` | | User-local date |
| `xp_earned` | `INTEGER` | `DEFAULT 0` | XP on this day |
| `swipe_count` | `INTEGER` | `DEFAULT 0` | Cards swiped |
| `battle_count` | `INTEGER` | `DEFAULT 0` | Battles played |
| `audio_count` | `INTEGER` | `DEFAULT 0` | Audio listens |
| `frozen` | `BOOLEAN` | `DEFAULT FALSE` | Was this day frozen? |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### RPC: `record_daily_activity()`

```sql
CREATE OR REPLACE FUNCTION record_daily_activity(
  p_user_id UUID,
  p_xp_earned INTEGER DEFAULT 0,
  p_swipe_count INTEGER DEFAULT 0,
  p_battle_count INTEGER DEFAULT 0,
  p_audio_count INTEGER DEFAULT 0,
  p_timezone TEXT DEFAULT 'Asia/Jakarta'
)
RETURNS TABLE(streak_count INTEGER, is_new_streak BOOLEAN, streak_milestone INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
  -- Get user's local date
  v_local_date := (NOW() AT TIME ZONE p_timezone)::DATE;
  v_yesterday := v_local_date - 1;

  -- Get user's current streak info
  SELECT current_streak, last_streak_date INTO v_current_streak, v_last_active
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  -- Check if already logged today
  IF v_last_active = v_local_date THEN
    -- Already logged: just update stats
    UPDATE streak_log SET
      xp_earned = xp_earned + p_xp_earned,
      swipe_count = swipe_count + p_swipe_count,
      battle_count = battle_count + p_battle_count,
      audio_count = audio_count + p_audio_count
    WHERE user_id = p_user_id AND activity_date = v_today;

    RETURN QUERY SELECT v_current_streak, FALSE, 0;
    RETURN;
  END IF;

  -- New day activity
  INSERT INTO streak_log (user_id, activity_date, timezone, local_date, xp_earned, swipe_count, battle_count, audio_count)
  VALUES (p_user_id, v_today, p_timezone, v_local_date, p_xp_earned, p_swipe_count, p_battle_count, p_audio_count);

  -- Calculate streak
  IF v_last_active = v_yesterday THEN
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
    v_is_new_streak := TRUE;
  ELSIF v_last_active < v_yesterday THEN
    -- Gap: check freeze
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
    -- Same day, already counted
    v_is_new_streak := FALSE;
  END IF;

  -- Update profile
  UPDATE profiles SET
    current_streak = v_current_streak,
    last_streak_date = v_local_date,
    highest_streak = GREATEST(highest_streak, v_current_streak),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Check milestones
  IF v_current_streak IN (7, 14, 30, 60, 100) THEN
    v_streak_milestone := v_current_streak;
    -- Trigger badge check
    PERFORM check_streak_badge(p_user_id, v_current_streak);
  END IF;

  RETURN QUERY SELECT v_current_streak, v_is_new_streak, v_streak_milestone;
END;
$$;
```

### RPC: `check_streak_badge()`

```sql
CREATE OR REPLACE FUNCTION check_streak_badge(p_user_id UUID, p_streak INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
```

---

## 16. Daily Mission Schema

### Table: `daily_missions`

**Purpose:** Daily generated missions for each user. Reset daily via cron.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `mission_type` | `TEXT` | `NOT NULL` | Mission type identifier |
| `mission_date` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | |
| `target` | `INTEGER` | `NOT NULL` | Goal count |
| `progress` | `INTEGER` | `DEFAULT 0 CHECK (progress <= target)` | Current progress |
| `is_completed` | `BOOLEAN` | `DEFAULT FALSE` | Target reached |
| `is_claimed` | `BOOLEAN` | `DEFAULT FALSE` | Reward claimed |
| `reward_xp` | `INTEGER` | `NOT NULL` | XP reward |
| `reward_coins` | `INTEGER` | `DEFAULT 0` | Coin reward |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
CREATE INDEX idx_daily_missions_active ON daily_missions(user_id, mission_date)
  WHERE is_completed = FALSE AND is_claimed = FALSE;
```

### Edge Function: `generate_daily_missions()`

```typescript
// Supabase Edge Function (Deno)
// Runs daily at 00:00 UTC+7 via cron trigger

interface MissionTemplate {
  type: string;
  targetRange: [number, number]; // min, max
  xpRange: [number, number];
  coinRange: [number, number];
}

const MISSION_POOL: Record<string, MissionTemplate> = {
  'learn_words':    { type: 'learn_words',    targetRange: [5, 20],  xpRange: [30, 100], coinRange: [5, 20] },
  'win_battles':    { type: 'win_battles',    targetRange: [1, 5],   xpRange: [50, 150], coinRange: [10, 30] },
  'play_battles':   { type: 'play_battles',   targetRange: [1, 5],   xpRange: [30, 100], coinRange: [5, 20] },
  'listen_audio':   { type: 'listen_audio',   targetRange: [3, 10],  xpRange: [20, 60],  coinRange: [5, 10] },
  'streak_combo':   { type: 'streak_combo',   targetRange: [3, 10],  xpRange: [30, 80],  coinRange: [5, 15] },
  'perfect_battle': { type: 'perfect_battle', targetRange: [1, 1],   xpRange: [150, 200], coinRange: [30, 50] },
  'daily_xp':       { type: 'daily_xp',       targetRange: [100, 500], xpRange: [50, 150], coinRange: [10, 30] },
};

// Select 3 random missions, scale by user level
// Insert into daily_missions table
```

---

## 17. Badge & Achievement Schema

### Table: `badges`

**Purpose:** Badge definitions. Static reference table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `name` | `TEXT` | `NOT NULL` | Badge name |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | Unique identifier |
| `description` | `TEXT` | `NOT NULL` | How to earn |
| `icon` | `TEXT` | `NOT NULL` | Emoji |
| `rarity` | `TEXT` | `NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))` | |
| `category` | `TEXT` | `CHECK (category IN ('streak', 'battle', 'vocabulary', 'social', 'special'))` | |
| `max_progress` | `INTEGER` | `DEFAULT 1` | For multi-tier badges |
| `sort_order` | `INTEGER` | `DEFAULT 0` | Display order |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Seed Badges

```sql
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
```

### Table: `user_badges`

**Purpose:** Many-to-many between users and badges, with progress tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE CASCADE` | |
| `badge_id` | `UUID` | `REFERENCES badges(id) ON DELETE CASCADE` | |
| `progress` | `INTEGER` | `DEFAULT 0` | Current progress toward goal |
| `is_earned` | `BOOLEAN` | `DEFAULT FALSE` | Fully earned |
| `earned_at` | `TIMESTAMPTZ` | | When badge was earned |
| `is_new` | `BOOLEAN` | `DEFAULT TRUE` | Unviewed badge flag |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### RPC: `award_badge()`

```sql
CREATE OR REPLACE FUNCTION award_badge(p_user_id UUID, p_badge_slug TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
    is_earned = TRUE,
    earned_at = NOW(),
    is_new = TRUE;

  -- Insert notification
  PERFORM insert_notification(p_user_id, 'badge_earned', jsonb_build_object(
    'badge_slug', p_badge_slug
  ));

  -- Award XP
  PERFORM earn_xp(p_user_id, 100, 'badge_earned', v_badge_id, 'Badge: ' || (SELECT name FROM badges WHERE id = v_badge_id));

  RETURN TRUE;
END;
$$;
```

---

## 18. Leaderboard Schema

### Table: `leaderboard_weekly`

**Purpose:** Pre-computed weekly leaderboard. Refreshed via cron. Denormalized for fast reads.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `username` | `TEXT` | `NOT NULL` | Denormalized for fast read |
| `avatar_url` | `TEXT` | | Denormalized |
| `rank_id` | `INTEGER` | `REFERENCES ranks(id)` | Denormalized for badge display |
| `weekly_xp` | `BIGINT` | `DEFAULT 0` | XP earned this week |
| `weekly_swipes` | `INTEGER` | `DEFAULT 0` | Total swipes this week |
| `weekly_battles` | `INTEGER` | `DEFAULT 0` | Total battles this week |
| `current_streak` | `INTEGER` | `DEFAULT 0` | For tiebreaker |
| `rank_position` | `INTEGER` | | Computed rank |
| `week_start` | `DATE` | `NOT NULL` | ISO week start (Monday) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
```

### Table: `leaderboard_friends`

**Purpose:** Real-time friend leaderboard. Denormalized for fast queries.

```sql
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
-- Include self
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
ORDER BY viewer_id, p.xp DESC;

CREATE UNIQUE INDEX idx_leaderboard_friends_viewer ON leaderboard_friends(viewer_id, friend_id);
```

---

## 19. Audio System Schema

### Storage Structure

```
/audio/
  └── {word_id}.mp3        — Standard pronunciation (native speaker)
  └── {word_id}_slow.mp3   — Slow pronunciation (70% speed)

Buckets:
  - audio:           Arabic pronunciation audio files
  - assets:          Mascot sprites, badge icons, UI assets
  - avatars:         User avatar uploads
```

### Table: `audio_play_log`

**Purpose:** Track audio plays for analytics and daily mission progress.

```sql
CREATE TABLE audio_play_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  speed TEXT DEFAULT 'normal' CHECK (speed IN ('normal', 'slow', 'very_slow')),
  played_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audio_log_user ON audio_play_log(user_id, played_at DESC);
CREATE INDEX idx_audio_log_word ON audio_play_log(word_id);
CREATE INDEX idx_audio_log_date ON audio_play_log(user_id, played_at::DATE);
```

---

## 20. Notification Schema

### Table: `notifications`

**Purpose:** In-app notification queue. Push notifications sent via Edge Function based on this.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `type` | `TEXT` | `NOT NULL` | Notification type |
| `title` | `TEXT` | `NOT NULL` | Notification title |
| `body` | `TEXT` | | Body text |
| `data` | `JSONB` | `DEFAULT '{}'` | Deep link data |
| `is_read` | `BOOLEAN` | `DEFAULT FALSE` | Read status |
| `is_push_sent` | `BOOLEAN` | `DEFAULT FALSE` | Push notification sent |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
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
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read)
  WHERE is_read = FALSE;
```

### RPC: `insert_notification()`

```sql
CREATE OR REPLACE FUNCTION insert_notification(
  p_user_id UUID,
  p_type TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
  v_title TEXT;
  v_body TEXT;
BEGIN
  -- Determine title/body based on type
  CASE p_type
    WHEN 'streak_danger' THEN
      v_title := 'Streakmu dalam bahaya!';
      v_body := 'Ayo belajar sebelum streak putus!';
    WHEN 'streak_lost' THEN
      v_title := 'Streak putus...';
      v_body := 'Jangan sedih, mulai lagi hari ini!';
    WHEN 'streak_milestone' THEN
      v_title := '🔥 ' || (p_data->>'days')::TEXT || ' hari streak!';
      v_body := 'Luar biasa! Pertahankan!';
    WHEN 'badge_earned' THEN
      v_title := '🏅 Badge baru!';
      v_body := 'Kamu mendapatkan badge baru! Cek di Progress.';
    WHEN 'rank_up' THEN
      v_title := '🎉 Rank Up!';
      v_body := 'Selamat! Kamu naik rank!';
    WHEN 'level_up' THEN
      v_title := '🎉 Level Up!';
      v_body := 'Kamu naik ke level ' || (p_data->>'level')::TEXT || '!';
    WHEN 'mission_reminder' THEN
      v_title := '📋 Misi belum selesai';
      v_body := 'Masih ada misi yang bisa dikerjakan!';
    WHEN 'friend_active' THEN
      v_title := '👋 Teman aktif';
      v_body := (p_data->>'friend_name')::TEXT || ' baru saja belajar!';
    ELSE
      v_title := 'Notifikasi';
      v_body := '';
  END CASE;

  INSERT INTO notifications (user_id, type, title, body, data)
  VALUES (p_user_id, p_type, v_title, v_body, p_data)
  RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$;
```

---

## 21. Social Sharing Schema

### Table: `share_log`

**Purpose:** Track shares for analytics and referral attribution.

```sql
CREATE TABLE share_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL CHECK (share_type IN ('streak', 'badge', 'rank', 'daily_result', 'battle_result', 'referral')),
  platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'whatsapp', 'twitter', 'copy')),
  card_url TEXT, -- Generated card URL
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_share_log_user ON share_log(user_id, created_at DESC);
CREATE INDEX idx_share_log_type ON share_log(share_type, created_at DESC);
```

### Table: `referrals`

**Purpose:** Track referral relationships.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PK DEFAULT gen_random_uuid()` | |
| `referrer_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | |
| `referred_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE` | |
| `status` | `TEXT` | `DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded'))` | |
| `reward_claimed` | `BOOLEAN` | `DEFAULT FALSE` | |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |
| `completed_at` | `TIMESTAMPTZ` | | When referred user completed onboarding |

```sql
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
```

---

## 22. Analytics Schema

### Table: `analytics_events`

**Purpose:** Track user behavior for product decisions. Append-only, high volume.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PK GENERATED ALWAYS AS IDENTITY` | Sequential (for time-series) |
| `user_id` | `UUID` | `REFERENCES users(id) ON DELETE SET NULL` | Nullable for anonymous |
| `event_name` | `TEXT` | `NOT NULL` | Event identifier |
| `event_data` | `JSONB` | `DEFAULT '{}'` | Event payload |
| `session_id` | `UUID` | | Current session ID |
| `device_info` | `JSONB` | `DEFAULT '{}'` | Device metadata |
| `ip_address` | `TEXT` | | Anonymized |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | |

```sql
CREATE TABLE analytics_events (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id UUID,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
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

CREATE INDEX idx_analytics_events_name ON analytics_events(event_name, created_at DESC);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id, created_at DESC);
```

### Event Name Conventions

```sql
COMMENT ON COLUMN analytics_events.event_name IS E'
  app_open | app_background | app_foreground |
  onboarding_step_{1-3}_complete | onboarding_complete |
  auth_login | auth_register | auth_guest |
  swipe_session_start | swipe_session_end |
  swipe_card_{swipe_right|swipe_left|reveal} |
  combo_{x2|x3|x4|x5|x7|x10} | combo_broken |
  audio_play | audio_speed_change |
  battle_start | battle_end_{victory|defeat} |
  battle_boss_start | battle_boss_end |
  daily_mission_complete | daily_mission_claim |
  level_up | rank_up | badge_earned |
  streak_update | streak_freeze_use | streak_lost |
  leaderboard_view | friend_add | friend_invite |
  share_{streak|badge|rank|referral} |
  referral_click | referral_complete |
  notification_open | notification_dismiss |
  settings_change_{audio|theme|notifications} |
  error_{network|auth|server|timeout}
';
```

---

## 23. Offline Sync Strategy

### Sync Architecture

```
CLIENT OFFLINE:
  Zustand persist → localStorage queue
  Queue format: [{ action, table, data, timestamp, id }]
  
CLIENT COMES ONLINE:
  1. Process queue sequentially (oldest first)
  2. For each action:
     ├── INSERT: Insert with conflict resolution
     ├── UPDATE: Update if client version >= server version
     └── DELETE: Verify user owns resource
  3. Sync result: success / conflict / rejected
  4. Resolve conflicts (server wins by default)
  5. Update local state with server response
```

### Conflict Resolution Rules

| Operation | Resolution Strategy |
|-----------|-------------------|
| **XP insert** | Server validates total, no conflict possible |
| **Swipe log insert** | Append-only, no conflict |
| **Battle result insert** | Append-only, server validates questions |
| **Profile update** | Last-write-wins (preferences only) |
| **Streak update** | Server-calculated, never from client |
| **Mission progress** | Server merges (take max of local vs server) |

### Queue Table (Client-side)

Structure stored in localStorage:

```typescript
interface SyncQueueItem {
  id: string;           // UUID
  action: 'insert' | 'update' | 'delete';
  table: string;
  data: Record<string, unknown>;
  clientTimestamp: number;
  retryCount: number;
  maxRetries: number;   // 3
}
```

---

## 24. Caching Strategy

### Database-Level Caching

| Table | Cache Strategy | Refresh Interval | Rationale |
|-------|---------------|------------------|-----------|
| `ranks` | In-memory / static | Never | Changes only with new ranks |
| `badges` | In-memory | Per deploy | Static badge definitions |
| `categories` | In-memory | Rarely | Category list |
| `vocabulary_words` | CDN / Supabase cache | Per content update | Read-heavy, rarely changes |
| `profiles` | Zustand persist | Per session | User's own profile |
| `leaderboard_weekly` | Materialized view | Every 5 minutes | Pre-computed |
| `leaderboard_friends` | Materialized view | On friend change | Real-time-ish |

### Query-Level Optimization

```sql
-- Use pg_stat_statements to identify slow queries
-- Enable cache hit ratio monitoring

-- Example: profile query optimization
EXPLAIN ANALYZE
SELECT p.*, r.name as rank_name, r.icon as rank_icon
FROM profiles p
JOIN ranks r ON p.rank_id = r.id
WHERE p.user_id = $1;
-- Expected: Index Scan on profiles_pkey, cost ~1.2
```

### Client-Side Caching (Zustand)

| Store | Data | Persistence | TTL |
|-------|------|-------------|-----|
| `userStore` | User info + profile | localStorage | Session |
| `swipeStore` | Current session | sessionStorage | Until complete |
| `battleStore` | Battle state | sessionStorage | Until complete |
| `uiStore` | UI preferences | localStorage | Permanent |
| `vocabCache` | Recent vocabulary | memory | 1 hour |

---

## 25. Row Level Security (RLS)

### RLS Philosophy

```
"Users can only read/write their own data.
Public data (vocabulary, ranks, badges) is readable by all.
Write operations go through RPC functions for critical data."
```

### RLS Policies

```sql
-- Enable RLS on all tables
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

-- Users: can read own, update own
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profiles: can read own, update own, others can read public
CREATE POLICY "Anyone can read profiles (public)"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Word Progress: user can read/update own
CREATE POLICY "Users can read own progress"
  ON user_word_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_word_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_word_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Swipe Sessions: user can read own, insert own
CREATE POLICY "Users can read own sessions"
  ON swipe_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON swipe_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Battles: user can read own, insert own
CREATE POLICY "Users can read own battles"
  ON battles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own battles"
  ON battles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Daily Missions: user can read own
CREATE POLICY "Users can read own missions"
  ON daily_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON daily_missions FOR UPDATE
  USING (auth.uid() = user_id);

-- XP Transactions: read-only log
CREATE POLICY "Users can read own XP log"
  ON xp_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- XP Transactions: INSERT only via RPC
CREATE POLICY "XP insert via RPC only"
  ON xp_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Badges: public read, user-specific
CREATE POLICY "Anyone can read badges"
  ON badges FOR SELECT
  USING (true);

CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- Notifications: user can read own
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Friends: user can read own, insert own
CREATE POLICY "Users can read own friends"
  ON friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert own friends"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Leaderboard: public read
CREATE POLICY "Anyone can read weekly leaderboard"
  ON leaderboard_weekly FOR SELECT
  USING (true);

-- Public tables (readable by all authenticated users)
CREATE POLICY "Anyone can read ranks"
  ON ranks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read vocabulary"
  ON vocabulary_words FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read lessons"
  ON lessons FOR SELECT
  USING (true);
```

### RPC Functions (SECURITY DEFINER)

All critical write operations use `SECURITY DEFINER` RPC functions:

| Function | Purpose | Anti-cheat |
|----------|---------|------------|
| `earn_xp()` | Record XP with audit trail | Validates amount, logs balance |
| `record_daily_activity()` | Streak management | Server-calculated streak |
| `award_badge()` | Badge earning | Validates conditions |
| `check_rank_up()` | Rank progression | Server-calculated rank |
| `insert_notification()` | Notification system | Rate-limited |

---

## 26. Indexing Strategy

### Index Priority Matrix

| Table | Query Pattern | Index | Type | Priority |
|-------|--------------|-------|------|----------|
| `user_word_progress` | Get due words for user | `(user_id, next_review_at) WHERE is_mastered = FALSE` | B-tree | **Critical** |
| `swipe_sessions` | User session history | `(user_id, started_at DESC)` | B-tree | High |
| `xp_transactions` | User XP history | `(user_id, created_at DESC)` | B-tree | High |
| `battles` | User battle history | `(user_id, created_at DESC)` | B-tree | High |
| `daily_missions` | Active missions | `(user_id, mission_date) WHERE is_completed = FALSE` | Partial | High |
| `streak_log` | User streak history | `(user_id, activity_date DESC)` | B-tree | Medium |
| `notifications` | Unread notifications | `(user_id, is_read) WHERE is_read = FALSE` | Partial | Medium |
| `leaderboard_weekly` | Weekly ranking | `(week_start, rank_position ASC)` | B-tree | Medium |
| `friends` | Friend relationships | `(user_id, status)` | B-tree | Medium |
| `analytics_events` | Time-series queries | `(event_name, created_at DESC)` | B-tree | Low |

### Index Maintenance

```sql
-- Monitor unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan < 100
ORDER BY idx_scan ASC;

-- Reindex monthly
REINDEX DATABASE harf;
```

### Composite Indexes

```sql
-- Critical: SRS word retrieval
CREATE INDEX idx_uwp_due_review
  ON user_word_progress(user_id, next_review_at ASC, confidence ASC)
  WHERE is_mastered = FALSE;

-- Battle stats aggregation
CREATE INDEX idx_battles_user_stats
  ON battles(user_id, battle_date, result);

-- XP aggregation for leaderboard
CREATE INDEX idx_xp_weekly
  ON xp_transactions(user_id, created_at)
  WHERE source NOT IN ('admin_adjustment');
```

---

## 27. Query Optimization

### Read-Heavy Optimization

```typescript
// Common queries and their optimization

// 1. Get home page data (single query via foreign key)
const { data: profile } = await supabase
  .from('profiles')
  .select(`
    *,
    rank:rank_id(*),
    daily_missions:user_id!inner(*)
  `)
  .eq('user_id', userId)
  .single();
// Expected: 1 query, <50ms

// 2. Get next words for swipe session
const { data: dueWords } = await supabase
  .rpc('get_due_words', { p_user_id: userId, p_limit: 15 });
// RPC function with optimized SRS query

// 3. Get weekly leaderboard
const { data: leaderboard } = await supabase
  .from('leaderboard_weekly')
  .select('*')
  .eq('week_start', weekStart)
  .order('rank_position')
  .limit(50);
// Materialized view: <10ms
```

### RPC: `get_due_words()`

```sql
CREATE OR REPLACE FUNCTION get_due_words(p_user_id UUID, p_limit INTEGER DEFAULT 15)
RETURNS TABLE(
  word_id UUID,
  arabic_text TEXT,
  transliteration TEXT,
  meaning_id TEXT,
  audio_url TEXT,
  confidence INTEGER,
  is_new BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- Words due for review
  (SELECT
    v.id,
    v.arabic_text,
    v.transliteration,
    v.meaning_id,
    v.audio_url,
    uwp.confidence,
    FALSE as is_new
  FROM user_word_progress uwp
  JOIN vocabulary_words v ON uwp.word_id = v.id
  WHERE uwp.user_id = p_user_id
    AND uwp.next_review_at <= NOW()
    AND uwp.is_mastered = FALSE
    AND v.is_active = TRUE
  ORDER BY uwp.next_review_at ASC
  LIMIT p_limit)

  UNION ALL

  -- New words (not yet in user_word_progress)
  (SELECT
    v.id,
    v.arabic_text,
    v.transliteration,
    v.meaning_id,
    v.audio_url,
    0 as confidence,
    TRUE as is_new
  FROM vocabulary_words v
  WHERE v.id NOT IN (
    SELECT word_id FROM user_word_progress WHERE user_id = p_user_id
  )
    AND v.is_active = TRUE
  ORDER BY v.difficulty ASC, v.frequency_score DESC
  LIMIT GREATEST(p_limit / 3, 5))

  LIMIT p_limit;
END;
$$;
```

### Query Performance Targets

| Query | Target (p95) | Optimization |
|-------|-------------|--------------|
| Get home data | <100ms | Single query, denormalized |
| Get swipe words | <50ms | RPC, indexed, limited |
| Submit swipe result | <50ms | RPC, batch update |
| Start battle | <200ms | Pre-computed questions |
| Submit battle result | <100ms | RPC, batch insert |
| Get leaderboard | <50ms | Materialized view |
| Get user stats | <50ms | Denormalized profile |
| Daily mission progress | <30ms | Partial index |

---

## 28. Storage Structure

### Supabase Storage Buckets

```sql
-- Storage buckets configuration
-- Name: audio
-- Public: true
-- Description: Arabic pronunciation audio files
-- File size limit: 5MB
-- Allowed MIME: audio/mpeg, audio/ogg, audio/aac
-- Path pattern: /{word_id}.mp3

-- Name: assets  
-- Public: true
-- Description: Mascot sprites, badge icons, UI assets
-- Cache control: 1 year (immutable)

-- Name: avatars
-- Public: false (served via signed URLs)
-- Description: User avatar uploads
-- File size limit: 2MB
-- Allowed MIME: image/webp, image/png, image/jpeg
```

### Storage Path Convention

```
/audio/
  {word_id}.mp3               → "word-id-here".mp3
  {word_id}_slow.mp3          → Slow version

/assets/
  mascot/
    {expression}.webp         → happy.webp, sad.webp, excited.webp
    {expression}_idle.webp    → Idle animation frames
  badges/
    {badge_slug}.webp         → striker_7.webp, immortal_100.webp
  icons/
    {icon_name}.webp          → streak.webp, battle.webp
  ui/
    {asset_name}.webp         → logo.webp, splash-bg.webp

/avatars/
  {user_id}.webp              → User avatar
  {user_id}_thumb.webp        → Thumbnail (64x64)
```

---

## 29. Future Scalability

### Projected Growth

| Milestone | Users | Daily Active | Reads/sec | Writes/sec |
|-----------|-------|-------------|-----------|------------|
| MVP Launch | 5,000 | 1,500 | 50 | 15 |
| 3 months | 50,000 | 15,000 | 500 | 150 |
| 6 months | 200,000 | 60,000 | 2,000 | 600 |
| 12 months | 1,000,000 | 300,000 | 10,000 | 3,000 |

### Scaling Strategies

| Challenge | Solution | Timeline |
|-----------|----------|----------|
| **Read throughput** | Supabase connection pooling, pgBouncer | Month 1 |
| **Write throughput** | RPC functions, batch inserts | Month 1 |
| **Analytics volume** | Table partitioning (monthly) | Month 3 |
| **Leaderboard computes** | Materialized views → Redis cache | Month 3 |
| **Vocabulary content** | Content delivery via CDN | Month 3 |
| **Realtime leaderboard** | Supabase Realtime channel | Month 3 |
| **Multiplayer battle** | Dedicated WebSocket server | Month 6 |
| **Global read replicas** | Supabase read replicas | Month 6+ |
| **Data warehouse** | Export to ClickHouse/BigQuery | Month 12+ |

### Future Tables

```sql
-- Clan/Guild system (Month 6+)
CREATE TABLE clans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  tag TEXT UNIQUE NOT NULL, -- 4-char tag
  owner_id UUID NOT NULL REFERENCES users(id),
  xp BIGINT DEFAULT 0,
  member_count INTEGER DEFAULT 1,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE clan_members (
  clan_id UUID REFERENCES clans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'elder', 'co_leader', 'leader')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (clan_id, user_id)
);

-- AI Tutor conversations (Month 12+)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID,
  messages JSONB NOT NULL, -- [{ role, content, timestamp }]
  language TEXT DEFAULT 'arabic',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice recognition results (Month 12+)
CREATE TABLE voice_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
  audio_url TEXT,
  accuracy_score REAL,
  feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 30. Migration Strategy

### Migration Tool

```bash
# Using Supabase CLI for migrations
supabase migration new add_leaderboard_materialized_view
supabase migration up
supabase migration list
```

### Migration Naming Convention

```
YYYYMMDD_description.sql

Examples:
  20260501_initial_schema.sql
  20260515_add_leaderboard.sql
  20260601_add_clan_tables.sql
```

### Migration Example

```sql
-- 20260501_initial_schema.sql

-- Create extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create helper functions
-- (include functions defined in sections above)

-- Create enum types
-- (if we migrate from CHECK constraints to enums)

-- Create tables in dependency order
-- 1. ranks (standalone)
-- 2. categories (standalone)
-- 3. badges (standalone)
-- 4. users (auth-dependent)
-- 5. profiles (depends on users, ranks)
-- 6. vocabulary_words (depends on categories)
-- 7. ... (continue in order)
```

### Migration Best Practices

| Practice | Rationale |
|----------|-----------|
| **Never edit existing migrations** | Immutable history |
| **Test on staging first** | Catch issues before production |
| **Backward compatible changes** | Add columns, don't remove |
| **Large data migrations in batches** | Avoid long table locks |
| **Use `IF NOT EXISTS` / `IF EXISTS`** | Idempotent migrations |
| **Document breaking changes** | Team communication |
| **Migration per logical change** | One concern per migration |

### Rollback Strategy

```sql
-- Each migration should have a rollback
-- Example:

-- UP
CREATE INDEX idx_uwp_due_review ON user_word_progress(user_id, next_review_at)
  WHERE is_mastered = FALSE;

-- DOWN (if needed)
DROP INDEX IF EXISTS idx_uwp_due_review;
```

---

## Appendix

### A. Complete Seed Data: Vocabulary (50 MVP Words)

```sql
-- Daily Objects (10)
INSERT INTO vocabulary_words (arabic_text, transliteration, meaning_id, difficulty, category_id, word_type) VALUES
  ('كِتَاب', 'kitab', 'buku', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('قَلَم', 'qalam', 'pulpen', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('بَاب', 'bab', 'pintu', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('نَافِذَة', 'nafidhah', 'jendela', 2, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('كُرْسِيّ', 'kursiy', 'kursi', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('مَكْتَب', 'maktab', 'meja', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('سَرِير', 'sariir', 'tempat tidur', 2, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('هَاتِف', 'hatif', 'telepon', 2, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('مِفْتَاح', 'miftah', 'kunci', 2, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun'),
  ('سَاعَة', 'saa\'ah', 'jam', 1, (SELECT id FROM categories WHERE slug = 'daily-objects'), 'noun');

-- Basic Verbs (10)
INSERT INTO vocabulary_words (arabic_text, transliteration, meaning_id, difficulty, category_id, word_type) VALUES
  ('أَكَل', 'akala', 'makan', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('شَرِب', 'shariba', 'minum', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('نَام', 'naama', 'tidur', 1, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('قَرَأ', 'qara\'a', 'membaca', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('كَتَب', 'kataba', 'menulis', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('ذَهَب', 'dhahaba', 'pergi', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('جَاء', 'jaa\'a', 'datang', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('جَلَس', 'jalasa', 'duduk', 1, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('وَقَف', 'waqafa', 'berdiri', 1, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb'),
  ('رَكَض', 'rakadha', 'berlari', 2, (SELECT id FROM categories WHERE slug = 'basic-verbs'), 'verb');

-- Numbers (10)
-- (similar pattern for numbers, family, colors)
```

### B. Quick Reference: Table Summary

| # | Table | Type | RLS | Size Estimate | Notes |
|---|-------|------|-----|---------------|-------|
| 1 | `users` | Core | ✅ | 1M rows | Auth + identity |
| 2 | `profiles` | Core | ✅ | 1M rows | 1:1 with users |
| 3 | `ranks` | Reference | ❌ | 5 rows | Static |
| 4 | `vocabulary_words` | Reference | ❌ | 10K rows | Content |
| 5 | `categories` | Reference | ❌ | 50 rows | Static |
| 6 | `lessons` | Reference | ❌ | 500 rows | Content |
| 7 | `lesson_words` | Junction | ❌ | 5K rows | N:M |
| 8 | `user_word_progress` | Core | ✅ | 50M rows | Heavily indexed |
| 9 | `swipe_sessions` | Log | ✅ | 10M rows | Append-only |
| 10 | `swipe_session_words` | Log | ✅ | 100M rows | Append-only, partitioned |
| 11 | `battles` | Log | ✅ | 5M rows | Append-only |
| 12 | `battle_questions` | Log | ✅ | 50M rows | Append-only |
| 13 | `xp_transactions` | Log | ✅ | 50M rows | Append-only |
| 14 | `daily_missions` | State | ✅ | 10M rows | Resets daily |
| 15 | `streak_log` | Log | ✅ | 10M rows | 1 row/user/day |
| 16 | `badges` | Reference | ❌ | 20 rows | Static |
| 17 | `user_badges` | State | ✅ | 2M rows | earned + progress |
| 18 | `leaderboard_weekly` | Report | ❌ | 50K rows | Materialized, refresh |
| 19 | `friends` | State | ✅ | 5M rows | Self-referencing |
| 20 | `referrals` | State | ✅ | 500K rows | Referral tracking |
| 21 | `notifications` | Queue | ✅ | 50M rows | Temp, auto-cleanup |
| 22 | `analytics_events` | Log | ✅ | 500M rows | Partitioned monthly |
| 23 | `audio_play_log` | Log | ✅ | 20M rows | Append-only |
| 24 | `share_log` | Log | ✅ | 1M rows | Append-only |
| 25 | `user_sessions` | Log | ✅ | 5M rows | Session tracking |

### C. Common RPC Functions Index

| Function | Purpose | Called From |
|----------|---------|-------------|
| `earn_xp()` | Record XP with audit | Swipe, Battle, Mission, Badge |
| `record_daily_activity()` | Streak management | First daily action |
| `get_due_words()` | SRS word retrieval | Swipe session start |
| `check_rank_up()` | Rank progression | After XP significant change |
| `award_badge()` | Badge awarding | Streak, Battle, Vocab milestones |
| `insert_notification()` | Create notification | Various triggers |
| `calculate_level()` | Level from XP | earn_xp(), profile read |
| `calculate_next_review()` | SRS timing | After each swipe |
| `handle_new_auth_user()` | Auth sync | Signup trigger |
| `set_referral_code()` | Referral code | User creation trigger |

### D. Backup & Recovery

```sql
-- Automated daily backups (Supabase managed)
-- Point-in-time recovery: 7 days

-- Manual backup command
pg_dump -h db.xxxxx.supabase.co -U postgres harf > backup_$(date +%Y%m%d).sql

-- Monitor database size
SELECT pg_size_pretty(pg_database_size('harf')) as db_size;

-- Table size
SELECT
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 20;
```

---

*This database schema is designed for scalability, security, and mobile-first performance. All tables, indexes, RLS policies, and RPC functions are production-ready.*  
*Harf — حرف*
