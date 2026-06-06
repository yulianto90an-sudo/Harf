# Backend Architecture — Harf

**Version:** 1.0  
**Stack:** Supabase · PostgreSQL 15 · Edge Functions (Deno) · Realtime (WebSocket) · Storage (S3)  
**Focus:** Production-grade · Security-first · Mobile-optimized · Scalable to millions  

---

## 1. Backend Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  Next.js App Router · Zustand · Supabase Client SDK                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Auth UI  │  │ Swipe    │  │ Battle   │  │ Leaderboard/     │   │
│  │          │  │ Session  │  │ Arena    │  │ Progress          │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘   │
│       │              │             │                  │             │
│       └──────────────┴─────────────┴──────────────────┘             │
│                              │ HTTPS / WebSocket                    │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                    SUPABASE ───────────────────────────────────────  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    API GATEWAY                                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │  │
│  │  │ Auth     │  │ REST API │  │ Realtime │  │ Storage    │  │  │
│  │  │ (GoTrue) │  │(PostgREST)│ │(WebSocket)│ │ (S3)      │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    EDGE FUNCTIONS (Deno)                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │  │
│  │  │ Battle   │ │ Daily    │ │Leaderboard│ │ Streak Check   │  │  │
│  │  │ AI       │ │ Reset    │ │ Compute   │ │ + Notifications│  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                      │
│  ┌──────────────────────────▼───────────────────────────────────┐  │
│  │                    POSTGRESQL 15                               │  │
│  │                                                                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐  │  │
│  │  │ RLS Policy  │  │ RPC Funcs   │  │ Materialized Views    │  │  │
│  │  │ Layer       │  │ (50+)       │  │ Leaderboard/Stats     │  │  │
│  │  └─────────────┘  └─────────────┘  └───────────────────────┘  │  │
│  │                                                                 │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐  │  │
│  │  │ Tables      │  │ Indexes     │  │ Triggers + Queue     │  │  │
│  │  │ (25+ core)  │  │ (30+ perf)  │  │ SKIP LOCKED jobs     │  │  │
│  │  └─────────────┘  └─────────────┘  └───────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

| Pattern | Direction | Protocol | Example |
|---------|-----------|----------|---------|
| **Read** | Client → PostgREST → PostgreSQL | HTTPS GET | Load profile, vocabulary |
| **Critical Write** | Client → RPC → PostgreSQL | HTTPS POST | Earn XP, battle result |
| **Non-critical Write** | Client → PostgREST → RLS → PostgreSQL | HTTPS PATCH | Update preferences |
| **Realtime** | Client ↔ Supabase Realtime | WebSocket | Leaderboard, friend activity |
| **Cron** | Edge Function → PostgreSQL | Internal SQL | Daily reset, leaderboard recompute |
| **Auth** | Client → GoTrue → PostgreSQL | HTTPS | Login, register, OAuth |

### Write Strategy

```
CRITICAL WRITES (XP, battle result, streak, badge):
  Client sends action → RPC validates server-side → PostgreSQL writes
  NEVER trust client: client can say "I won a battle" but server
  re-validates battle data, enemy HP, and calculates rewards.

NON-CRITICAL WRITES (profile, settings, preferences):
  Client writes directly → RLS ensures user owns data → Table updated

OFFLINE QUEUE:
  Client queues writes → On reconnect → RPC processes queue →
  Server validates timestamps + idempotency → Accept or reject
```

### Performance Targets

| Operation | Target (p95) | Strategy |
|-----------|-------------|----------|
| Load home screen | <100ms | Single denormalized query |
| Start swipe session | <50ms | RPC with optimized SRS index |
| Submit swipe result | <50ms | RPC batch update + async XP |
| Start battle | <200ms | Pre-generated questions |
| Submit battle result | <100ms | RPC batch insert |
| Get leaderboard | <50ms | Materialized view |
| Sync offline queue | <500ms per item | Sequential RPC calls |

---

## 2. System Design Principles

### Core Principles

| # | Principle | Implementation |
|---|-----------|----------------|
| 1 | **Server-authoritative** | All game-critical writes through SECURITY DEFINER RPCs |
| 2 | **Read-optimized for mobile** | Denormalized aggregates, materialized views, JSONB |
| 3 | **Write-serialized for integrity** | Row locks, sequential RPCs, idempotency keys |
| 4 | **Offline-tolerant** | Client queue + server-side conflict resolution |
| 5 | **Anti-cheat by design** | Server validates every action, rate limits, anomaly detection |
| 6 | **Realtime where valuable** | Leaderboard, friend activity; not for game-critical paths |
| 7 | **PostgreSQL as platform** | Use PG for queue, cache, pub/sub before adding external services |
| 8 | **Graceful degradation** | Cache fallbacks, stale data acceptable for non-critical views |
| 9 | **Idempotency on all writes** | Every mutation has a unique key to prevent duplicate processing |
| 10 | **Audit everything** | Immutable logs for XP, swipe, battle actions |

### Decision Records

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| PostgreSQL as job queue | Zero extra infra, SKIP LOCKED pattern | Not as fast as Redis, fine for MVP |
| Edge Functions for game logic | No cold start mgmt, Deno runtime | Limited CPU/memory for AI-heavy tasks |
| RPC-only for game writes | Anti-cheat, audit trail, single entry point | Less flexible than direct table access |
| Materialized views for leaderboard | Fast reads, no expensive joins | 5-min stale, acceptable |
| JSONB for flexible metadata | Avoids migration overhead | No relational integrity |
| UTC everywhere, timezone in app | Consistent timestamps, avoids DST | Timezone conversion in app layer |

---

## 3. Service Architecture

### Service Map

```
harf-api/
├── supabase/                    # Supabase project configuration
│   ├── config.toml              # Project settings
│   ├── migrations/              # Database migrations
│   │   ├── 20260501_initial_schema.sql
│   │   ├── 20260515_rpc_functions.sql
│   │   ├── 20260601_edge_triggers.sql
│   │   └── ...
│   └── seed.sql                 # Seed data
│
├── functions/                   # Edge Functions
│   ├── battle-ai/               # Battle enemy AI logic
│   ├── daily-reset/             # Daily mission + streak cron
│   ├── leaderboard-compute/     # Weekly leaderboard calculation
│   ├── streak-check/            # Streak reminder notifications
│   ├── mission-gen/             # Daily mission generation
│   ├── badge-check/             # Achievement milestone checker
│   ├── notification-push/       # Push notification sender
│   └── health-check/            # Backend health endpoint
│
└── supabase/
    ├── rls/                     # RLS policy SQL files
    ├── rpc/                     # RPC function SQL files
    └── triggers/                # Trigger function SQL files
```

### Service Dependencies

```
Edge Functions → PostgreSQL (direct connection via Supabase internal)
Edge Functions → Supabase Storage (audio, assets)
Edge Functions → External APIs (push notifications, email)
PostgreSQL → Internal (autovacuum, pg_stat_statements)
PostgreSQL → Realtime (change data capture via WAL)
```

---

## 4. Supabase Architecture

### Supabase Services Used

| Service | Role | Configuration |
|---------|------|---------------|
| **Auth (GoTrue)** | Authentication, session, OAuth | JWT expiry: 1hr, refresh: auto |
| **PostgREST** | RESTful API for read queries | RLS enforced, row limit: 1000 |
| **Realtime** | WebSocket live updates | Broadcast + presence channels |
| **Storage** | File storage (audio, avatars, assets) | S3-compatible, CDN-backed |
| **Edge Functions** | Serverless game logic, cron | Deno runtime, 1GB memory |
| **pg_stat_statements** | Query performance monitoring | Track slow queries |

### Connection Pooling

```
All client connections go through PgBouncer (Supabase managed).
  - Transaction mode: default
  - Pool size: 15-25 connections per instance
  - Statement timeout: 30s
  - Idle timeout: 60s

Edge Functions use direct PostgreSQL connection (bypass PgBouncer).
  - One connection per function invocation
  - Connection string via environment variable
```

---

## 5. Authentication Architecture

### Auth Flow

```
USER ACTION              SUPABASE AUTH
───────────              ─────────────
Email/Password  →   POST /auth/v1/token?grant_type=password
Google OAuth     →   Redirect → Callback → GET /auth/v1/callback
Apple OAuth      →   Redirect → Callback → GET /auth/v1/callback
Magic Link       →   POST /auth/v1/magic_link → Email → Verify

SESSION MANAGEMENT:
  - JWT with 1-hour expiry
  - Auto-refresh via refresh_token (30-day expiry)
  - Session persisted in Supabase auth tables
  - Client stores token in httpOnly cookie + localStorage
```

### Auth Tables (Supabase Managed)

| Table | Purpose |
|-------|---------|
| `auth.users` | Core user identities, emails, metadata |
| `auth.sessions` | Active session tracking |
| `auth.refresh_tokens` | Refresh token rotation |
| `auth.mfa_factors` | Multi-factor authentication |

### Custom User Sync

When a user is created in `auth.users`, a trigger syncs to `public.users`:

```sql
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, avatar_url)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
```

### JWT Token Structure

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "aud": "authenticated",
  "exp": 1717000000,
  "iat": 1716996400,
  "user_metadata": { "username": "rizky45" },
  "app_metadata": { "provider": "email", "tier": "free" }
}
```

### Guest Mode

```
GUEST FLOW:
  1. Client generates anonymous ID (UUID stored in localStorage)
  2. No Supabase auth — uses anonymous user pattern
  3. Local progress stored in Zustand + localStorage
  4. When user registers, local data merges to cloud

LIMITATIONS:
  - 20 words max per session
  - 3 battles max
  - No leaderboard, no cloud sync
  - Streak is local-only (resets if cache clears)
```

---

## 6. Authorization System

### Authorization Model

```
3-TIER AUTHORIZATION:

Tier 1 — PUBLIC (no auth required):
  - Read vocabulary_words, categories, ranks, badges
  - Read leaderboard_weekly

Tier 2 — AUTHENTICATED (valid session required):
  - Read own profile, progress, history
  - Update own non-critical data (preferences, settings)
  - Read public data

Tier 3 — RPC-ONLY (SECURITY DEFINER functions):
  - All writes to game-critical tables
  - XP mutations, battle results, streak updates
  - Badge awards, rank progression
  - No direct table INSERT/UPDATE for game tables
```

### Role Hierarchy

| Role | Source | Can Read | Can Write | RPC Access |
|------|--------|----------|-----------|------------|
| `anon` | No session | Public tables only | None | None |
| `authenticated` | Valid JWT | Own data + public | Non-critical own | All game RPCs |
| `service_role` | Service key | All data | All data | All RPCs |
| `admin` | Custom claim | All data | All data | All RPCs + admin |

---

## 7. Row Level Security Strategy

### RLS Philosophy

```
"Users see their own data. Public data is visible to all.
Game writes go through RPC functions only — never direct table access."
```

### RLS Policy Matrix

| Table | SELECT | INSERT | UPDATE | DELETE | Notes |
|-------|--------|--------|--------|--------|-------|
| `users` | Own only | N/A | Own only | N/A | Auth trigger-managed |
| `profiles` | All (public) | N/A | Own only | N/A | Public for leaderboard |
| `profiles.xp` | All (public) | N/A | RPC only | N/A | Column-level security |
| `user_word_progress` | Own only | Own only | Own only | N/A | Learning progress |
| `swipe_sessions` | Own only | Own only | N/A | N/A | Append-only |
| `swipe_session_words` | Own only | Own only | N/A | N/A | Append-only |
| `battles` | Own only | Own only | N/A | N/A | Append-only |
| `battle_questions` | Own only | Via RPC | N/A | N/A | Via battle RPC |
| `xp_transactions` | Own only | RPC only | N/A | N/A | Immutable audit |
| `daily_missions` | Own only | N/A | Own only | N/A | Cron-generated |
| `streak_log` | Own only | RPC only | N/A | N/A | Via activity RPC |
| `badges` | All (public) | N/A | N/A | N/A | Static reference |
| `user_badges` | Own only | RPC only | N/A | N/A | Via award RPC |
| `leaderboard_weekly` | All (public) | N/A | N/A | N/A | Materialized |
| `notifications` | Own only | RPC only | Own only | Own only | Notification queue |
| `analytics_events` | Admin only | Own only | N/A | N/A | Append-only |
| `referrals` | Own only | Own only | Own only | N/A | Referral tracking |
| `friends` | Own+friend | Own only | Own only | Own only | Bidirectional |

### RLS Implementation Patterns

```sql
-- Pattern 1: Own data only
CREATE POLICY "user_owns_data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Pattern 2: Public read
CREATE POLICY "public_read" ON table_name
  FOR SELECT USING (true);

-- Pattern 3: RPC-only write (no direct INSERT policy)
-- No INSERT policy defined → Supabase rejects direct inserts
-- All writes go through SECURITY DEFINER RPC

-- Pattern 4: Bidirectional access
CREATE POLICY "self_or_friend" ON friends
  FOR SELECT USING (
    auth.uid() = user_id OR auth.uid() = friend_id
  );
```

---

## 8. API Architecture

### API Surface

| Endpoint | Type | Auth | Purpose |
|----------|------|------|---------|
| `POST /rest/v1/rpc/earn_xp` | RPC | Authenticated | Record XP with audit |
| `POST /rest/v1/rpc/record_daily_activity` | RPC | Authenticated | Streak management |
| `POST /rest/v1/rpc/record_swipe` | RPC | Authenticated | Process swipe result |
| `POST /rest/v1/rpc/start_battle` | RPC | Authenticated | Initialize battle |
| `POST /rest/v1/rpc/submit_battle_result` | RPC | Authenticated | Finalize battle |
| `POST /rest/v1/rpc/claim_mission_reward` | RPC | Authenticated | Claim mission XP |
| `POST /rest/v1/rpc/award_badge` | RPC | Authenticated | Award badge |
| `POST /rest/v1/rpc/check_rank_up` | RPC | Authenticated | Rank progression |
| `GET /rest/v1/rpc/get_due_words` | RPC | Authenticated | SRS word retrieval |
| `GET /rest/v1/rpc/get_leaderboard` | RPC | Authenticated | Leaderboard data |
| `GET /rest/v1/rpc/get_user_stats` | RPC | Authenticated | User stats |
| `GET /storage/v1/object/audio/{word_id}.mp3` | Storage | Public | Audio files |
| `GET /storage/v1/object/avatars/{user_id}.webp` | Storage | Signed URL | Avatars |

### RPC Naming Conventions

| Prefix | Purpose | Example |
|--------|---------|---------|
| `get_*` | Read operations (SELECT) | `get_due_words` |
| `record_*` | Write operations (INSERT) | `record_swipe` |
| `earn_*` / `award_*` | Game progression writes | `earn_xp`, `award_badge` |
| `check_*` | Validation operations | `check_rank_up` |
| `submit_*` | Multi-step process writes | `submit_battle_result` |
| `claim_*` | Reward distribution | `claim_mission_reward` |
| `calculate_*` | Pure computation | `calculate_level` |

### API Error Response Format

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please wait before swiping again.",
    "details": {
      "retry_after_ms": 500,
      "limit": 10,
      "window_seconds": 5
    }
  },
  "code": 429
}
```

| Error Code | HTTP Status | When |
|------------|-------------|------|
| `INVALID_SESSION` | 401 | Expired/invalid JWT |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INVALID_ACTION` | 400 | Action validation failed |
| `ANTI_CHEAT_BLOCKED` | 403 | Suspicious activity |
| `CONCURRENCY_CONFLICT` | 409 | Row lock timeout |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `QUOTA_EXCEEDED` | 403 | Daily/weekly limit |
| `RESOURCE_NOT_FOUND` | 404 | Missing entity |

---

## 9. Database Access Layer

### Access Patterns

```
READ HEAVY (95% of queries):
  Client → PostgREST → RLS → Materialized View / Indexed Table
  - Home screen data (single denormalized query)
  - Vocabulary words (public, cached)
  - Leaderboard (materialized view)
  - Profile data (direct table read with RLS)

WRITE CRITICAL (5% of queries):
  Client → RPC → SECURITY DEFINER → PostgreSQL → Audit log
  - XP transactions (earn_xp RPC)
  - Battle results (submit_battle_result RPC)
  - Streak updates (record_daily_activity RPC)
  - Badge awards (award_badge RPC)

WRITE NON-CRITICAL (<1%):
  Client → PostgREST → RLS → PostgreSQL → Direct table update
  - Preferences update
  - Profile bio/avatar update
  - Notification read status
```

### Connection Management

```typescript
// Edge Function database connection
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false }, db: { schema: 'public' } }
)
```

### Transaction Strategy

```sql
-- All game-critical RPCs use explicit transactions
BEGIN;
  SELECT xp INTO v_current_xp FROM profiles 
  WHERE user_id = p_user_id FOR UPDATE;
  -- Validate and compute
  -- Insert audit log
  -- Update aggregates
COMMIT;

-- Use SAVEPOINT for partial rollback
BEGIN;
  SAVEPOINT before_battle_result;
  -- Insert battle record
  -- If error: ROLLBACK TO before_battle_result;
COMMIT;
```

---

## 10. Edge Functions Strategy

### Edge Function Catalog

| Function | Trigger | Runtime | Memory | Timeout | Purpose |
|----------|---------|---------|--------|---------|---------|
| `battle-ai` | HTTP call | Deno | 256MB | 60s | Generate enemy, validate battle, award rewards |
| `daily-reset` | Cron (00:00 UTC) | Deno | 128MB | 300s | Reset missions, refresh streaks |
| `leaderboard-compute` | Cron (Sun 23:55) | Deno | 256MB | 300s | Snapshot, archive weekly leaderboard |
| `streak-check` | Cron (20:00 UTC) | Deno | 128MB | 120s | Identify pending users, send reminders |
| `mission-gen` | Cron (00:05 UTC) | Deno | 128MB | 180s | Generate 3 daily missions per active user |
| `badge-check` | Cron (hourly) | Deno | 128MB | 60s | Batch check achievement conditions |
| `notification-push` | HTTP + Cron | Deno | 128MB | 120s | Send push notifications via FCM/APNs |
| `health-check` | HTTP GET | Deno | 64MB | 10s | Return system health status |

### Cold Start Mitigation

```
STRATEGY:
  1. Keep function bundles small (<10MB)
  2. Use Supabase internal DB connection (no external network on warmup)
  3. Scheduled warm-up pings every 5 minutes during peak hours
  4. Lazy-load heavy modules (import on demand)
  5. Minimize dependencies — prefer Supabase built-ins

WARM-UP CONFIG:
  cron: "*/5 * * * *"
  function: health-check
  header: { "x-warmup": "true" }
```

### Function Error Handling

```typescript
export async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => null)
    if (!body?.user_id) {
      return new Response(
        JSON.stringify({ error: 'INVALID_REQUEST' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    const result = await processFunction(body)
    return new Response(
      JSON.stringify({ data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error.message, error.stack)
    return new Response(
      JSON.stringify({ error: 'INTERNAL_ERROR', requestId: crypto.randomUUID() }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
```

---

## 11. Learning Engine Backend Logic

### SRS Algorithm (Modified SM-2)

```
CONFIDENCE LEVELS:
  0 = New word (never reviewed)
  1 = Just introduced, needs frequent review
  2 = Recognized with effort (learned threshold)
  3 = Good recall
  4 = Strong recall (mastered threshold)
  5 = Automatic recall

REVIEW INTERVALS:
  confidence 0 → immediate review
  confidence 1 → 4 hours
  confidence 2 → 1 day (learned)
  confidence 3 → 3 days
  confidence 4 → 7 days (mastered)
  confidence 5 → 14 days

CONFIDENCE ADJUSTMENT:
  Swipe Right (knew it)  → confidence = MIN(confidence + 1, 5)
  Swipe Left (didn't know) → confidence = MAX(confidence - 1, 0)
  Reveal (looked up)     → confidence = confidence (no change)
```

### Word Selection Algorithm

```
get_due_words(user_id, limit = 15):
  1. FETCH due review words:
     WHERE next_review_at <= NOW()
     AND is_mastered = FALSE
     AND user_id = p_user_id
     ORDER BY next_review_at ASC
     LIMIT limit * 0.7  (70% review)

  2. FETCH new words:
     WHERE word_id NOT IN user_word_progress
     AND is_active = TRUE
     ORDER BY difficulty ASC, frequency_score DESC
     LIMIT limit * 0.3  (30% new)

  3. MERGE and SHUFFLE to max limit
  4. RETURN word list with metadata
```

### Session Pacing

```
SESSION FLOW:
  1. Fetch words → 70% due reviews + 30% new words
  2. Shuffle to interleave new with review
  3. First 3 cards: easiest words (warm-up)
  4. Cards 4-10: mixed difficulty
  5. If user gets 3+ wrong in a row: insert easier "breather" card
  6. If user gets 8+ correct in a row: insert harder challenge word
  7. Session ends after 10 cards or user ends early
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No due words | Return all new words, fallback to any unlearned |
| All words mastered | Show "Kamu sudah belajar semua kata! Coba Battle!" |
| Same word across sessions | SRS prevents same-word-in-active-session via check |
| User has no progress yet | Return 15 easiest words (difficulty = 1) |

---

## 12. Swipe Validation Logic

### RPC: `record_swipe()`

```sql
CREATE OR REPLACE FUNCTION record_swipe(
  p_user_id UUID,
  p_word_id UUID,
  p_action TEXT,            -- 'swipe_right', 'swipe_left', 'reveal'
  p_combo INTEGER,
  p_confidence_before INTEGER,
  p_session_id UUID,
  p_response_time_ms INTEGER,
  p_swipe_velocity REAL,
  p_audio_played BOOLEAN DEFAULT FALSE,
  p_idempotency_key TEXT
)
RETURNS TABLE(xp_earned INTEGER, new_confidence INTEGER, new_combo INTEGER, streak_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_xp INTEGER := 0;
  v_new_confidence INTEGER;
  v_combo INTEGER;
BEGIN
  -- 1. IDEMPOTENCY CHECK: skip if already processed
  IF EXISTS (SELECT 1 FROM swipe_idempotency 
             WHERE idempotency_key = p_idempotency_key) THEN
    RETURN QUERY SELECT 0, 0, 0, 0; RETURN;
  END IF;

  -- 2. RECORD idempotency key
  INSERT INTO swipe_idempotency (idempotency_key, user_id, created_at)
  VALUES (p_idempotency_key, p_user_id, NOW());

  -- 3. VALIDATION CHECKS
  IF p_response_time_ms < 300 THEN
    RAISE EXCEPTION 'RESPONSE_TOO_FAST' USING HINT = 'Minimum 300ms per card';
  END IF;
  IF p_response_time_ms > 30000 THEN
    RAISE EXCEPTION 'RESPONSE_TOO_SLOW' USING HINT = 'Session expired';
  END IF;
  IF p_swipe_velocity < 0 OR p_swipe_velocity > 5.0 THEN
    RAISE EXCEPTION 'INVALID_VELOCITY';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM swipe_sessions WHERE id = p_session_id AND user_id = p_user_id) THEN
    RAISE EXCEPTION 'INVALID_SESSION';
  END IF;

  -- 4. UPSERT word progress
  INSERT INTO user_word_progress (user_id, word_id, confidence)
  VALUES (p_user_id, p_word_id, 1)
  ON CONFLICT (user_id, word_id) DO UPDATE SET
    confidence = CASE
      WHEN p_action = 'swipe_right' THEN LEAST(user_word_progress.confidence + 1, 5)
      WHEN p_action = 'swipe_left' THEN GREATEST(user_word_progress.confidence - 1, 0)
      ELSE user_word_progress.confidence
    END,
    swipe_right_count = CASE WHEN p_action = 'swipe_right' THEN swipe_right_count + 1 ELSE swipe_right_count END,
    swipe_left_count = CASE WHEN p_action = 'swipe_left' THEN swipe_left_count + 1 ELSE swipe_left_count END,
    last_reviewed_at = NOW(),
    next_review_at = calculate_next_review(
      CASE WHEN p_action = 'swipe_right' THEN LEAST(confidence + 1, 5) ELSE GREATEST(confidence - 1, 0) END
    ),
    is_learned = (CASE WHEN p_action = 'swipe_right' THEN LEAST(confidence + 1, 5) ELSE confidence END) >= 2,
    is_mastered = (CASE WHEN p_action = 'swipe_right' THEN LEAST(confidence + 1, 5) ELSE confidence END) >= 4
  RETURNING confidence INTO v_new_confidence;

  -- 5. CALCULATE XP
  v_xp := calculate_swipe_xp(p_action, p_combo, p_confidence_before, p_audio_played);

  -- 6. INSERT audit log
  INSERT INTO swipe_session_words (session_id, word_id, user_id, action,
    confidence_before, confidence_after, combo_at_time, xp_earned, response_time_ms, audio_played, swipe_velocity)
  VALUES (p_session_id, p_word_id, p_user_id, p_action,
    p_confidence_before, v_new_confidence, p_combo, v_xp, p_response_time_ms, p_audio_played, p_swipe_velocity);

  -- 7. UPDATE session aggregates
  UPDATE swipe_sessions SET
    total_cards = total_cards + 1,
    correct_count = correct_count + CASE WHEN p_action = 'swipe_right' THEN 1 ELSE 0 END,
    incorrect_count = incorrect_count + CASE WHEN p_action = 'swipe_left' THEN 1 ELSE 0 END,
    reveal_count = reveal_count + CASE WHEN p_action = 'reveal' THEN 1 ELSE 0 END,
    max_combo = GREATEST(max_combo, p_combo + CASE WHEN p_action = 'swipe_right' THEN 1 ELSE 0 END),
    total_xp_earned = total_xp_earned + v_xp
  WHERE id = p_session_id;

  -- 8. EARN XP
  PERFORM earn_xp(p_user_id, v_xp, 'swipe_' || p_action, p_session_id, 'Swipe session ' || p_action);

  -- 9. UPDATE combo
  v_combo := CASE WHEN p_action = 'swipe_right' THEN p_combo + 1 ELSE 0 END;

  RETURN QUERY SELECT v_xp, v_new_confidence, v_combo, 0;
END;
$$;
```

### XP Calculation for Swipe

```sql
CREATE OR REPLACE FUNCTION calculate_swipe_xp(
  p_action TEXT, p_combo INTEGER, p_confidence INTEGER, p_audio_played BOOLEAN
) RETURNS INTEGER AS $$
DECLARE
  v_base_xp INTEGER;
  v_combo_bonus INTEGER := 0;
  v_audio_bonus INTEGER := 0;
  v_streak_mult NUMERIC;
BEGIN
  v_base_xp := CASE
    WHEN p_action = 'swipe_right' THEN 10
    WHEN p_action = 'swipe_left' THEN 0
    WHEN p_action = 'reveal' THEN 1
    ELSE 0
  END;

  IF p_action = 'swipe_right' THEN
    v_combo_bonus := CASE
      WHEN p_combo >= 10 THEN 15 WHEN p_combo >= 7 THEN 10
      WHEN p_combo >= 5 THEN 6  WHEN p_combo >= 3 THEN 4
      WHEN p_combo >= 2 THEN 2  ELSE 0
    END;
  END IF;

  IF p_audio_played AND p_action IN ('swipe_right', 'reveal') THEN
    v_audio_bonus := 2;
  END IF;

  SELECT CASE
    WHEN current_streak >= 100 THEN 4.0 WHEN current_streak >= 60 THEN 3.0
    WHEN current_streak >= 30 THEN 2.5 WHEN current_streak >= 14 THEN 2.0
    WHEN current_streak >= 7 THEN 1.5 ELSE 1.0
  END INTO v_streak_mult FROM profiles WHERE user_id = p_user_id;

  RETURN FLOOR((v_base_xp + v_combo_bonus + v_audio_bonus) * v_streak_mult);
END;
$$ LANGUAGE plpgsql STABLE;
```

### Anti-Exploit Checks in Swipe

```
1. MINIMUM RESPONSE TIME (300ms) — prevents bot-speed swiping
2. MAXIMUM RESPONSE TIME (30s) — prevents stale sessions
3. VELOCITY SANITY (0-5.0) — normalized swipe velocity must be realistic
4. IDEMPOTENCY KEY — prevents double-submission
5. SESSION OWNERSHIP — session must belong to user
6. DAILY LIMIT — max 200 swipes per day (anti-grind)
7. PATTERN DETECTION — uniform response times suggest bot
```

---

## 13. Battle Engine Backend Logic

### Battle Lifecycle

```
START BATTLE:
  1. Client requests start_battle(enemy_type)
  2. Server generates enemy stats (HP, level, damage)
  3. Server selects 10 questions from user's SRS pool
  4. Returns battle_id + initial state to client

DURING BATTLE (client-side display):
  - Client shows question, user taps answer
  - Client tracks HP, combo, questions locally
  - Server is NOT called per question (latency optimization)
  - All 10 questions are pre-generated at start

END BATTLE:
  1. Client submits submit_battle_result(battle_id, answers[])
  2. Server validates each answer server-side
  3. Server recalculates HP, combo, damage, XP
  4. Server determines result (victory/defeat/draw)
  5. Server awards XP, coins, checks achievements
  6. Returns final result + rewards
```

### RPC: `start_battle()`

```sql
CREATE OR REPLACE FUNCTION start_battle(
  p_user_id UUID, p_enemy_type TEXT, p_enemy_level INTEGER DEFAULT 1
)
RETURNS TABLE(battle_id UUID, questions JSONB, enemy_data JSONB, player_hp INTEGER)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_battle_id UUID;
  v_enemy_hp INTEGER;
  v_questions JSONB := '[]'::JSONB;
  v_player_level INTEGER;
  v_player_max_hp INTEGER;
  v_word_ids UUID[];
  v_word RECORD;
BEGIN
  IF p_enemy_type NOT IN ('pemula', 'musafir', 'penuntut', 'nahwu_king') THEN
    RAISE EXCEPTION 'INVALID_ENEMY_TYPE';
  END IF;

  v_enemy_hp := CASE p_enemy_type
    WHEN 'pemula' THEN 50 + (p_enemy_level - 1) * 10
    WHEN 'musafir' THEN 80 + (p_enemy_level - 1) * 15
    WHEN 'penuntut' THEN 120 + (p_enemy_level - 1) * 20
    WHEN 'nahwu_king' THEN 200 + (p_enemy_level - 1) * 30
  END;

  SELECT level INTO v_player_level FROM profiles WHERE user_id = p_user_id;
  v_player_max_hp := 100 + (v_player_level - 1) * 5;

  -- Select 10 random words (7 from progress, 3 new)
  WITH due_words AS (
    SELECT word_id FROM user_word_progress
    WHERE user_id = p_user_id AND is_mastered = FALSE
    ORDER BY RANDOM() LIMIT 7
  ), new_words AS (
    SELECT id FROM vocabulary_words
    WHERE id NOT IN (SELECT word_id FROM user_word_progress WHERE user_id = p_user_id)
    AND is_active = TRUE ORDER BY RANDOM() LIMIT 3
  )
  SELECT ARRAY_AGG(word_id) INTO v_word_ids FROM (
    SELECT word_id FROM due_words UNION ALL SELECT id FROM new_words
  ) combined;

  -- Generate question JSON
  FOR i IN 1..COALESCE(array_length(v_word_ids, 1), 0) LOOP
    SELECT arabic_text, meaning_id INTO v_word FROM vocabulary_words WHERE id = v_word_ids[i];
    -- Build question with 4 options
    v_questions := v_questions || jsonb_build_object(
      'question_index', i - 1, 'word_id', v_word_ids[i],
      'arabic_text', v_word.arabic_text, 'meaning', v_word.meaning_id
    );
  END LOOP;

  INSERT INTO battles (user_id, enemy_type, enemy_level, result, player_hp_remaining, enemy_hp_remaining, total_questions, is_boss)
  VALUES (p_user_id, p_enemy_type, p_enemy_level, 'in_progress', v_player_max_hp, v_enemy_hp, 10, p_enemy_type = 'nahwu_king')
  RETURNING id INTO v_battle_id;

  RETURN QUERY SELECT v_battle_id, v_questions,
    jsonb_build_object('name', p_enemy_type, 'max_hp', v_enemy_hp, 'current_hp', v_enemy_hp),
    v_player_max_hp;
END;
$$;
```

### Damage Formula

```
CORRECT ANSWER:
  Base Damage: 10
  Combo Bonus: +5 × combo_stack (0-indexed)
  Critical Hit: 15% chance, 2× total damage
  Boss Phase 2: 1.5× multiplier when boss HP ≤ 50%
  Damage = (10 + 5 × combo) × phase_mult × crit_mult

WRONG ANSWER:
  Player takes 15 damage (flat)
  Combo resets to 0

TIME-OUT:
  Treated as wrong: 15 damage to player
  0 XP for that question
```

### Enemy AI Definitions

| Enemy | HP | Base Damage | Special | Unlock |
|-------|-----|-------------|---------|--------|
| Pemula Bot | 50 + level×10 | Easy words | Random behavior | Always |
| Musafir Bot | 80 + level×15 | Medium words | Occasional block | Rank Musafir |
| Penuntut Bot | 120 + level×20 | Hard words | 7s timer | Rank Penuntut |
| Nahwu King | 200 + level×30 | Mixed | Phase 2 at 50% HP | Every 5 rank levels |

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Network drop during battle | Client caches state, resubmits on reconnect |
| Double submission | Idempotency key prevents double XP |
| User answers after timer | Mark as timeout, 0 XP |
| Battle submission >30 min stale | Reject — battle expired |
| Enemy/Player HP goes negative | Clamp to 0 |

---

## 14. XP Calculation System

### XP Formula

```
FINAL_XP = FLOOR(BASE_XP × STREAK_MULT × EVENT_MULT)

BASE_XP:
  Swipe correct:         10
  Swipe reveal:          1
  Audio listen:          2 (max 3 per word per day)
  Battle victory:        100 + enemy_bonus + damage_bonus
  Battle draw:           50 + enemy_bonus
  Battle defeat:         25
  Daily mission:         30-200
  Streak milestone:      200-1000 (7/14/30/60/100 days)
  First session of day:  50
  Level up bonus:        100
  Rank up bonus:         250
  Referral bonus:        100
  Badge earned:          100

STREAK_MULT:
  0-6 days:   1.0×    7-13 days:  1.5×
  14-29 days: 2.0×    30-59 days: 2.5×
  60-99 days: 3.0×    100+ days:  4.0×

EVENT_MULT (stackable, active one at a time):
  None:              1.0×
  Double XP (item):  2.0×
  Streak recovery:   2.0× (first 3 days after streak loss)
  Weekend bonus:     1.5× (Saturday/Sunday)
```

### Level Progression

```
XP_THRESHOLD(level) = FLOOR(50 × level^1.5 + 50 × level)

Level 1:   0 XP        Level 5:   850 XP
Level 2:   100 XP      Level 10:  3,000 XP
Level 3:   250 XP      Level 20:  10,000 XP
Level 4:   500 XP      Level 50:  50,000 XP

Implementation:
  LOOP:
    xp_needed = FLOOR(50 × POWER(level, 1.5) + 50 × level)
    EXIT WHEN total_xp < xp_needed
    level += 1
```

### RPC: `earn_xp()`

```sql
CREATE OR REPLACE FUNCTION earn_xp(
  p_user_id UUID, p_amount INTEGER, p_source TEXT,
  p_source_id UUID DEFAULT NULL, p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE(new_xp BIGINT, new_level INTEGER, leveled_up BOOLEAN, rank_updated BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current_xp BIGINT; v_new_xp BIGINT;
  v_current_level INTEGER; v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE; v_rank_updated BOOLEAN := FALSE;
  v_daily_xp INTEGER;
BEGIN
  -- Anti-exploit: daily XP cap per source
  SELECT COALESCE(SUM(amount), 0) INTO v_daily_xp
  FROM xp_transactions
  WHERE user_id = p_user_id AND source = p_source AND created_at::DATE = CURRENT_DATE;

  IF p_source LIKE 'swipe_%' AND v_daily_xp + p_amount > 2000 THEN
    RAISE EXCEPTION 'DAILY_XP_LIMIT_REACHED' USING HINT = 'Max 2000 XP/day from swiping';
  END IF;

  SELECT xp, level INTO v_current_xp, v_current_level
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  v_new_xp := v_current_xp + p_amount;
  v_new_level := calculate_level(v_new_xp);

  UPDATE profiles SET xp = v_new_xp, lifetime_xp = lifetime_xp + GREATEST(p_amount, 0), level = v_new_level
  WHERE user_id = p_user_id;

  IF v_new_level > v_current_level THEN
    v_leveled_up := TRUE;
    PERFORM earn_xp(p_user_id, 100, 'level_up_bonus', NULL, 'Level up bonus to ' || v_new_level);
    PERFORM insert_notification(p_user_id, 'level_up', jsonb_build_object('level', v_new_level));
  END IF;

  IF v_leveled_up THEN
    SELECT rank_up INTO v_rank_updated FROM check_rank_up(p_user_id);
  END IF;

  INSERT INTO xp_transactions (user_id, amount, balance_before, balance_after, source, source_id, description, metadata)
  VALUES (p_user_id, p_amount, v_current_xp, v_new_xp, p_source, p_source_id, p_description, p_metadata);

  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up, v_rank_updated;
END;
$$;
```

### XP Anti-Exploit

```
1. DAILY CAP PER SOURCE: Max 2000 XP/day from swipe, 1000 from battle
2. DAILY TOTAL CAP: Max 5000 XP/day total
3. MINIMUM TIME BETWEEN XP EVENTS: 300ms
4. SOURCE VALIDATION: Each source must have valid source_id (FK to real record)
5. VELOCITY CHECK: >100 XP in 5 seconds from same source triggers warning
6. AUDIT TRAIL: Every XP transaction is logged with before/after balance
```

---

## 15. Rank Progression Logic

### Rank Definitions

| Rank | ID | Min XP | Icon | Color | Privileges |
|------|-----|--------|------|-------|------------|
| Pemula | 1 | 0 | 🌱 | #94A3B8 | Basic vocabulary, swipe |
| Musafir | 2 | 1,000 | 🧭 | #34D399 | Battle unlock, streak view |
| Penuntut Ilmu | 3 | 5,000 | 📖 | #3B82F6 | Hard battle, leaderboard, friends |
| Ahli Nahwu | 4 | 20,000 | 📜 | #A855F7 | Boss battle, badge showcase |
| Sultan Arabic | 5 | 50,000 | 👑 | #FACC15 | Exclusive cosmetics, beta |

### RPC: `check_rank_up()`

```sql
CREATE OR REPLACE FUNCTION check_rank_up(p_user_id UUID)
RETURNS TABLE(rank_up BOOLEAN, new_rank_id INTEGER, new_rank_name TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_current_xp BIGINT; v_current_rank_id INTEGER; v_new_rank_id INTEGER;
BEGIN
  SELECT xp, rank_id INTO v_current_xp, v_current_rank_id
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  SELECT id INTO v_new_rank_id FROM ranks
  WHERE min_xp <= v_current_xp ORDER BY id DESC LIMIT 1;

  IF v_new_rank_id > v_current_rank_id THEN
    UPDATE profiles SET rank_id = v_new_rank_id WHERE user_id = p_user_id;
    PERFORM award_badge(p_user_id, 'rank_' || v_new_rank_id);
    PERFORM insert_notification(p_user_id, 'rank_up', jsonb_build_object('old_rank', v_current_rank_id, 'new_rank', v_new_rank_id));
    PERFORM earn_xp(p_user_id, 250, 'rank_up', NULL, 'Rank up to ' || (SELECT name FROM ranks WHERE id = v_new_rank_id));
    RETURN QUERY SELECT TRUE, v_new_rank_id, (SELECT name FROM ranks WHERE id = v_new_rank_id);
  ELSE
    RETURN QUERY SELECT FALSE, v_current_rank_id, (SELECT name FROM ranks WHERE id = v_current_rank_id);
  END IF;
END;
$$;
```

### Rank Demotion (Inactive Users)

```
POLICY:
  - Pemula, Musafir, Penuntut Ilmu: NO demotion ever
  - Ahli Nahwu: demote after 30 days inactive
  - Sultan Arabic: demote after 30 days inactive

DEMOTION PROCESS:
  1. Day 25: send push notification "Rankmu terancam!"
  2. Day 30: demote 1 rank
  3. Send notification: "Rankmu diturunkan karena tidak aktif"
  4. Grace period: if user returns within 7 days, auto-restore rank
```

---

## 16. Streak System Logic

### Streak State Machine

```
                    ┌──────────────┐
                    │   INACTIVE    │
                    └──────┬───────┘
                           │ First activity
                           ▼
                    ┌──────────────┐
              ┌────►│   ACTIVE     │◄────┐
              │     └──────┬───────┘     │
              │            │             │
         Activity      Miss 1 day    Streak freeze
              │            │             │
              │            ▼             │
              │     ┌──────────────┐     │
              │     │   FROZEN     │─────┘
              │     │  (freeze     │
              │     │   consumed)  │
              │     └──────┬───────┘
              │            │
              │       Miss >3 days
              │            │
              │            ▼
              │     ┌──────────────┐
              └─────┤   BROKEN     │ (streak reset to 0)
                    │  (restart)   │
                    └──────────────┘
```

### RPC: `record_daily_activity()`

```sql
CREATE OR REPLACE FUNCTION record_daily_activity(
  p_user_id UUID, p_xp_earned INTEGER DEFAULT 0,
  p_swipe_count INTEGER DEFAULT 0, p_battle_count INTEGER DEFAULT 0,
  p_audio_count INTEGER DEFAULT 0, p_timezone TEXT DEFAULT 'Asia/Jakarta'
)
RETURNS TABLE(streak_count INTEGER, is_new_streak BOOLEAN, streak_milestone INTEGER, freeze_used BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_local_date DATE; v_yesterday DATE;
  v_last_active DATE; v_current_streak INTEGER;
  v_is_new_streak BOOLEAN := FALSE; v_streak_milestone INTEGER := 0;
  v_freeze_used BOOLEAN := FALSE;
BEGIN
  v_local_date := (NOW() AT TIME ZONE p_timezone)::DATE;
  v_yesterday := v_local_date - 1;

  SELECT current_streak, last_streak_date INTO v_current_streak, v_last_active
  FROM profiles WHERE user_id = p_user_id FOR UPDATE;

  -- Already logged today
  IF v_last_active IS NOT NULL AND v_last_active >= v_local_date THEN
    UPDATE streak_log SET xp_earned = xp_earned + p_xp_earned,
      swipe_count = swipe_count + p_swipe_count,
      battle_count = battle_count + p_battle_count,
      audio_count = audio_count + p_audio_count
    WHERE user_id = p_user_id AND activity_date = v_today;
    RETURN QUERY SELECT v_current_streak, FALSE, 0, FALSE; RETURN;
  END IF;

  INSERT INTO streak_log (user_id, activity_date, timezone, local_date, xp_earned, swipe_count, battle_count, audio_count)
  VALUES (p_user_id, v_today, p_timezone, v_local_date, p_xp_earned, p_swipe_count, p_battle_count, p_audio_count);

  IF v_last_active = v_yesterday THEN
    v_current_streak := v_current_streak + 1;
    v_is_new_streak := TRUE;
  ELSIF v_last_active IS NOT NULL AND v_last_active < v_yesterday THEN
    -- Gap: check freeze
    IF (SELECT streak_freeze FROM profiles WHERE user_id = p_user_id) > 0 THEN
      UPDATE profiles SET streak_freeze = streak_freeze - 1 WHERE user_id = p_user_id;
      v_freeze_used := TRUE;
      v_is_new_streak := TRUE;
    ELSE
      v_current_streak := 1;
      v_is_new_streak := TRUE;
      PERFORM insert_notification(p_user_id, 'streak_lost', jsonb_build_object('previous_streak', v_current_streak));
    END IF;
  ELSE
    v_current_streak := 1;
    v_is_new_streak := TRUE;
  END IF;

  UPDATE profiles SET current_streak = v_current_streak, last_streak_date = v_local_date,
    highest_streak = GREATEST(highest_streak, v_current_streak)
  WHERE user_id = p_user_id;

  IF v_current_streak IN (7, 14, 30, 60, 100) THEN
    v_streak_milestone := v_current_streak;
    PERFORM check_streak_badge(p_user_id, v_current_streak);
  END IF;

  RETURN QUERY SELECT v_current_streak, v_is_new_streak, v_streak_milestone, v_freeze_used;
END;
$$;
```

### Streak Freeze Logic

```
STREAK FREEZE RULES:
  1. User gets 1 free streak freeze per week (awarded Monday 00:00 UTC)
  2. User can purchase additional freezes: 100 coins each
  3. Maximum active freezes: 3
  4. Freeze auto-consumes when user misses a day
  5. Freeze preserves streak count (doesn't increment)
  6. Freeze only available if user had >=500 XP on the missed day
  7. Notification sent when freeze is consumed
```

### Timezone Handling

```
1. All timestamps stored in UTC
2. Streak day boundary calculated in user's local timezone
3. User stores timezone preference in profiles.preferences
4. Default timezone: Asia/Jakarta (WIB)
5. Cron jobs run in UTC, streak check uses user's local date
```

---

## 17. Daily Mission Engine

### Mission Pool

| Mission Type | Target Range | XP Range | Coin Range | Priority |
|-------------|-------------|----------|------------|----------|
| `learn_words` | 5-20 | 30-100 | 5-20 | High |
| `win_battles` | 1-5 | 50-150 | 10-30 | High |
| `play_battles` | 1-5 | 30-100 | 5-20 | High |
| `listen_audio` | 3-10 | 20-60 | 5-10 | Medium |
| `streak_combo` | 3-10 | 30-80 | 5-15 | Medium |
| `perfect_battle` | 1 | 150-200 | 30-50 | Low |
| `daily_xp` | 100-500 | 50-150 | 10-30 | Medium |

### Mission Generation Algorithm

```
generate_missions(user):
  1. SELECT 3 random mission types from pool
     - Weighted by user's weak areas
     - Always include at least 1 easy mission
  2. For each mission:
     - Scale target based on user level
     - Scale XP/coin reward based on difficulty
     - Ensure targets are achievable (>50% of user's average daily activity)
  3. INSERT into daily_missions table
  4. If 3 missions already exist for today: skip
```

### RPC: `claim_mission_reward()`

```sql
CREATE OR REPLACE FUNCTION claim_mission_reward(
  p_user_id UUID, p_mission_id UUID DEFAULT NULL
)
RETURNS TABLE(total_xp INTEGER, total_coins INTEGER, claimed_count INTEGER)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_mission RECORD; v_total_xp INTEGER := 0;
  v_total_coins INTEGER := 0; v_claimed INTEGER := 0;
BEGIN
  FOR v_mission IN (
    SELECT * FROM daily_missions
    WHERE user_id = p_user_id AND mission_date = CURRENT_DATE
      AND is_completed = TRUE AND is_claimed = FALSE
      AND (p_mission_id IS NULL OR id = p_mission_id)
    FOR UPDATE
  ) LOOP
    UPDATE daily_missions SET is_claimed = TRUE WHERE id = v_mission.id;
    PERFORM earn_xp(p_user_id, v_mission.reward_xp, 'daily_mission', v_mission.id, v_mission.mission_type);
    UPDATE profiles SET coins = coins + v_mission.reward_coins,
      total_coins_earned = total_coins_earned + v_mission.reward_coins
    WHERE user_id = p_user_id;
    v_total_xp := v_total_xp + v_mission.reward_xp;
    v_total_coins := v_total_coins + v_mission.reward_coins;
    v_claimed := v_claimed + 1;
  END LOOP;
  RETURN QUERY SELECT v_total_xp, v_total_coins, v_claimed;
END;
$$;
```

---

## 18. Achievement Engine

### Badge Catalog

| Badge Slug | Name | Category | Rarity | Condition |
|------------|------|----------|--------|-----------|
| `striker_7` | Striker | streak | Rare | 7-day streak |
| `blaze_14` | Blaze | streak | Rare | 14-day streak |
| `inferno_30` | Inferno | streak | Epic | 30-day streak |
| `legend_60` | Legend Streak | streak | Epic | 60-day streak |
| `immortal_100` | Immortal | streak | Legendary | 100-day streak |
| `first_victory` | First Victory | battle | Common | First battle win |
| `warrior_10` | Warrior | battle | Common | 10 battle wins |
| `warrior_50` | War Veteran | battle | Rare | 50 battle wins |
| `boss_slayer` | Boss Slayer | battle | Rare | Defeat a boss |
| `perfect_battle` | Perfect Battle | battle | Epic | Win without wrong answer |
| `combo_10` | Combo King | battle | Rare | 10× combo in battle |
| `scholar_50` | Scholar | vocabulary | Common | 50 words learned |
| `word_master_200` | Word Master | vocabulary | Rare | 200 words learned |
| `polyglot_500` | Polyglot | vocabulary | Epic | 500 words learned |
| `social_5` | Social Butterfly | social | Common | 5 friends invited |
| `speed_demon` | Speed Demon | battle | Rare | Answer <2s for 10 questions |
| `early_adopter` | Early Adopter | special | Legendary | Join in first month |

### RPC: `award_badge()`

```sql
CREATE OR REPLACE FUNCTION award_badge(p_user_id UUID, p_badge_slug TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_badge_id UUID; v_badge_name TEXT; v_already_earned BOOLEAN;
BEGIN
  SELECT id, name INTO v_badge_id, v_badge_name FROM badges WHERE slug = p_badge_slug;
  IF NOT FOUND THEN RETURN FALSE; END IF;

  SELECT is_earned INTO v_already_earned FROM user_badges
  WHERE user_id = p_user_id AND badge_id = v_badge_id;
  IF v_already_earned THEN RETURN FALSE; END IF;

  INSERT INTO user_badges (user_id, badge_id, progress, is_earned, earned_at, is_new)
  VALUES (p_user_id, v_badge_id, 1, TRUE, NOW(), TRUE)
  ON CONFLICT (user_id, badge_id) DO UPDATE SET is_earned = TRUE, earned_at = NOW(), is_new = TRUE;

  PERFORM insert_notification(p_user_id, 'badge_earned', jsonb_build_object('badge_slug', p_badge_slug, 'badge_name', v_badge_name));
  PERFORM earn_xp(p_user_id, 100, 'badge_earned', v_badge_id, 'Badge: ' || v_badge_name);
  RETURN TRUE;
END;
$$;
```

### Rarity Colors

| Rarity | Color | Display |
|--------|-------|---------|
| Common | #94A3B8 | Silver border |
| Rare | #3B82F6 | Blue glow |
| Epic | #A855F7 | Purple glow + particles |
| Legendary | #FACC15 | Gold glow + special animation |

---

## 19. Leaderboard Engine

### Leaderboard Architecture

```
TYPES:
  1. Weekly Global: All users, sorted by weekly XP, resets Sunday
  2. Friends: User + friends, sorted by total XP, realtime-ish
  3. Rank-based: Users within same rank, sorted by level

DATA SOURCE:
  Weekly: leaderboard_weekly table (materialized, refreshed via cron)
  Friends: leaderboard_friends materialized view
  Rank: Direct query on profiles with rank_id filter

REFRESH STRATEGY:
  Weekly leaderboard: recomputed every 5 min during peak,
  every 30 min off-peak. Full recompute Sunday 23:55 UTC.
```

### Materialized View

```sql
CREATE MATERIALIZED VIEW leaderboard_weekly AS
SELECT
  ROW_NUMBER() OVER (PARTITION BY week_start ORDER BY weekly_xp DESC) AS rank_position,
  user_id, username, avatar_url, rank_id, level,
  weekly_xp, weekly_swipes, weekly_battles, current_streak, week_start
FROM (
  SELECT
    p.user_id, u.username, u.avatar_url, p.rank_id, p.level, p.current_streak,
    COALESCE(SUM(CASE WHEN xt.created_at >= date_trunc('week', NOW()) THEN xt.amount ELSE 0 END), 0) AS weekly_xp,
    COUNT(DISTINCT CASE WHEN ss.created_at >= date_trunc('week', NOW()) THEN ss.id END) AS weekly_swipes,
    COUNT(DISTINCT CASE WHEN b.created_at >= date_trunc('week', NOW()) THEN b.id END) AS weekly_battles,
    date_trunc('week', NOW())::DATE AS week_start
  FROM profiles p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN xp_transactions xt ON p.user_id = xt.user_id
  LEFT JOIN swipe_sessions ss ON p.user_id = ss.user_id
  LEFT JOIN battles b ON p.user_id = b.user_id
  WHERE u.is_active = TRUE
  GROUP BY p.user_id, u.username, u.avatar_url, p.rank_id, p.level, p.current_streak
) ranked;

CREATE UNIQUE INDEX idx_lb_weekly_pos ON leaderboard_weekly(week_start, rank_position);
```

### Weekly Reset Process

```
PHASE 1 (Snapshot — Sunday 23:55 UTC):
  1. Compute current leaderboard (materialized view refresh)
  2. INSERT INTO leaderboard_archive SELECT * FROM leaderboard_weekly

PHASE 2 (Archive):
  leaderboard_archive stores: week_start, user_id, rank_position, weekly_xp

PHASE 3 (Reset — Sunday 23:58 UTC):
  1. TRUNCATE leaderboard_weekly
  2. Reset weekly_xp to 0 for all users

PHASE 4 (New Week — Monday 00:00 UTC):
  1. Enable new week writes
  2. First compute of new week's leaderboard
```

### Anti-Cheat for Leaderboard

```
1. DAILY XP CAP: Max 5000 XP/day across all sources
2. WEEKLY XP CAP: Max 25,000 XP/week
3. MINIMUM ACTIVITY: Must have >0 swipes in the week to qualify
4. RANK TIEBREAK: if XP tied, higher streak wins; if still tied, earlier join
5. SUSPICIOUS PATTERN: XP spikes >3× normal → flag for review
```

---

## 20. Reward Distribution Logic

### Reward Types and Sources

| Reward | Source | Distribution Method | Idempotent? |
|--------|--------|--------------------|-------------|
| XP | Swipe, Battle, Mission, Streak, Badge | `earn_xp()` RPC | Yes |
| Coins | Battle, Mission, Streak, Referral | Direct profile update | Yes |
| Badge | Milestone, Battle, Streak | `award_badge()` RPC | Yes |
| Streak Freeze | Weekly award, Purchase | Profile increment | Yes |

### Idempotency

```sql
CREATE TABLE xp_idempotency (
  idempotency_key TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Cleanup: DELETE WHERE created_at < NOW() - INTERVAL '7 days'
```

### Reward Claim Flow (Client)

```
1. Client performs action (swipe, battle, etc.)
2. Server processes via RPC, returns rewards earned
3. Client shows reward animation (XP float, coin shower)
4. Server response includes:
   - new_xp, new_level, coins_earned, new_badges[]
   - leveled_up, rank_updated (boolean)
5. Client updates Zustand store optimistically
6. On reconnect/refresh, fetch canonical values from server
```
