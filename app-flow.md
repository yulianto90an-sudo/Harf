# App Flow — Harf

**Version:** 1.0  
**Status:** Production-ready  
**Focus:** Mobile-first UX, interaction design, navigation architecture  
**Stack:** Next.js App Router + Framer Motion + Zustand  

---

## 1. App Navigation Overview

### Navigation Philosophy

```
"Setiap layar harus bisa dicapai dalam 2 tap. Setiap aksi harus memberikan feedback dalam 100ms."
```

Harf menggunakan **tab-based navigation** dengan 4 tab utama + modal/sheet untuk secondary action. Tidak ada nested navigation dalam tab — setiap tab adalah halaman mandiri.

### Navigation Types

| Type | Usage | Behavior |
|------|-------|----------|
| **Bottom Tab** | Primary navigation (4 tabs) | Instant switch, no loading |
| **Deep Link** | Swipe, Battle, Mission | Direct access from notification/home |
| **Modal Sheet** | Reward, Settings, Share | Slide up from bottom, swipe to dismiss |
| **Alert** | Confirm, Error, Info | Center modal, backdrop blur |
| **Gesture Back** | Swipe right → go back | Android back gesture + iOS swipe |

### Navigation Rules

| Rule | Reason |
|------|--------|
| No more than 4 bottom tabs | Cognitive load — user harus ingat posisi tab |
| Tab switch = instant, no loading | Zustand preloads data; skeleton if necessary |
| Modal never covers full screen (except loading) | User harus selalu sadar "masih di app" |
| Back gesture returns to previous tab state | Jangan reset state saat back |
| Deep link dari notifikasi → langsung ke action | Friction reduction |

---

## 2. Information Architecture

### Sitemap

```
HARF APP
│
├── 🔵 SPLASH / AUTH
│   ├── Splash Screen
│   ├── Onboarding (3 step)
│   ├── Login
│   └── Register
│
├── 🟢 HOME (Tab 1)
│   ├── Streak Header
│   ├── XP Bar + Level
│   ├── Daily Missions (3 cards)
│   ├── Continue Learning CTA
│   ├── Quick Battle CTA
│   └── Mascot (floating)
│
├── ⚔️ BATTLE (Tab 2)
│   ├── Battle Selection
│   │   ├── Quick Battle
│   │   ├── Boss Battle (locked/unlocked)
│   │   └── Difficulty Select
│   ├── Battle Arena
│   │   ├── Enemy Intro
│   │   ├── Question Phase (loop)
│   │   └── Result Screen
│   └── Battle History
│
├── 📊 PROGRESS (Tab 3)
│   ├── Rank Display
│   ├── XP Breakdown
│   ├── Stats Overview
│   ├── Badge Collection
│   ├── Leaderboard (friends/global)
│   └── Learning History
│
├── 👤 PROFILE (Tab 4)
│   ├── User Info
│   ├── Settings
│   │   ├── Audio Settings
│   │   ├── Notification Settings
│   │   ├── Theme Toggle
│   │   └── Account
│   ├── Invite Friends
│   ├── Achievement Showcase
│   └── Logout
│
├── 🎯 SWIPE (Deep Link)
│   ├── Swipe Session
│   └── Session Summary
│
├── 📋 MISSIONS (Modal/Sheet)
│   ├── Daily Mission Detail
│   └── Claim Reward
│
├── 🎁 REWARD (Modal)
│   ├── XP Reward
│   ├── Level Up
│   ├── Badge Unlock
│   ├── Rank Up
│   └── Streak Milestone
│
└── 🔄 MODALS
    ├── Settings Modal
    ├── Share Sheet
    ├── Confirm Dialog
    └── Word Detail Sheet
```

### Depth Analysis

| Page | Depth | Tap to reach | Back behavior |
|------|-------|--------------|---------------|
| Home | 0 | Instant (default) | — |
| Swipe Session | 1 | 1 tap (Home CTA) | End session → Home |
| Battle Select | 1 | 1 tap (Tab 2) | Back → previous tab |
| Battle Arena | 2 | 2 taps | Back → Battle Select |
| Battle Result | 3 | 3 taps | Auto-dismiss → Battle Select |
| Progress | 1 | 1 tap (Tab 3) | Back → previous tab |
| Profile | 1 | 1 tap (Tab 4) | Back → previous tab |
| Settings | 2 | 2 taps | Back → Profile |
| Reward Modal | 1 | Auto-trigger | Tap/dismiss → previous screen |
| Share Sheet | 2 | 2 taps | Swipe down → previous screen |

---

## 3. Route Structure

### Next.js App Router Routes

```
src/app/
├── page.tsx                    # Home (Tab 1)
├── layout.tsx                  # Root layout (providers, bottom nav)
│
├── battle/
│   ├── page.tsx                # Battle selection (Tab 2)
│   ├── arena/
│   │   └── page.tsx            # Battle arena
│   └── result/
│       └── page.tsx            # Battle result
│
├── progress/
│   └── page.tsx                # Progress (Tab 3)
│
├── profile/
│   ├── page.tsx                # Profile (Tab 4)
│   └── settings/
│       └── page.tsx            # Settings
│
├── auth/
│   ├── login/
│   │   └── page.tsx            # Login
│   ├── register/
│   │   └── page.tsx            # Register
│   └── callback/
│       └── page.tsx            # OAuth callback
│
└── onboarding/
    └── page.tsx                # Onboarding flow
```

### Route Protection

```typescript
// Middleware: redirect unauthenticated users to /auth/login
// Middleware: redirect users without onboarding to /onboarding
// Middleware: redirect authenticated users away from /auth/*

// Authenticated routes require:
// 1. Valid session (Supabase auth)
// 2. Onboarding completed
// 3. Profile exists
```

### Deep Link Schema

```
harf://swipe          → Start swipe session
harf://battle         → Quick battle
harf://missions       → Open daily missions
harf://profile/{id}   → View user profile
harf://badge/{id}     → View badge detail
harf://leaderboard    → Open leaderboard
```

---

## 4. Global Navigation System

### Persistent Elements

Every screen in the app shares:

```
┌─────────────────────────────────────────┐
│  STATUS BAR (system)                     │  ← 44px (safe area top)
├─────────────────────────────────────────┤
│  HEADER (optional, per page)             │  ← 0-56px
│  [Back] [Title] [Action]                 │
├─────────────────────────────────────────┤
│                                         │
│           CONTENT AREA                   │  ← Flexible
│           (scrollable)                   │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │  🏠 Home  ⚔️ Battle  📊 Progress  │  │  ← 64px Bottom Nav
│  │                👤 Profile          │  │     fixed, z-50
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Header Rules

| Page | Header Type | Elements |
|------|-------------|----------|
| Home | Minimal | Streak (L) + XP (R), no title |
| Battle Select | With title | Title "Battle" + mascot (R) |
| Battle Arena | Hidden (immersive) | Only timer + HP |
| Progress | With title | Title "Progress" |
| Profile | With title | Title "Profil" + settings icon |
| Settings | Back + title | Back arrow + "Pengaturan" |
| Auth | Hidden | Logo center |
| Onboarding | Hidden | Step indicator + skip |

### Bottom Nav Visibility

| Screen | Bottom Nav Visible? | Reason |
|--------|---------------------|--------|
| Home | ✅ Yes | Primary navigation point |
| Battle Select | ✅ Yes | Tab content |
| Battle Arena | ❌ Hidden | Immersive experience, maximize space |
| Battle Result | ❌ Hidden | Focus on result, nav appears after dismiss |
| Progress | ✅ Yes | Tab content |
| Profile | ✅ Yes | Tab content |
| Settings | ❌ Hidden | Modal/sheet behavior |
| Auth | ❌ Hidden | Pre-auth |
| Onboarding | ❌ Hidden | Full focus |
| Swipe Session | ❌ Hidden | Full focus on learning |
| Modal/Sheet | ✅ Yes (background) | Backdrop visible |

---

## 5. Bottom Navigation Flow

### Tab Configuration

```
🏠 Home       (default, index 0)
⚔️ Battle     (index 1)
📊 Progress   (index 2)
👤 Profile    (index 3)
```

### Tab Switch Behavior

```typescript
// Zustand store
interface NavigationState {
  activeTab: number;
  previousTab: number;
  tabHistory: number[]; // For back gesture
  setActiveTab: (tab: number) => void;
  goBack: () => void;
}
```

### Flow Diagram

```
User taps tab
    │
    ├── Same tab? → Scroll to top (if scrollable)
    │
    └── Different tab?
        │
        ├── Previous tab has active session (swipe/battle)?
        │   └── Pause session, save state
        │
        └── New tab
            ├── Load data (Zustand cache or fetch)
            ├── Animate: content slides in from appropriate direction
            │   ├── Tab > current: slide left
            │   └── Tab < current: slide right
            └── Update activeTab in store
```

### Tab State Preservation

| Tab | State Preserved? | What persists |
|-----|-----------------|---------------|
| Home | ✅ | Scroll position, last viewed |
| Battle | ✅ | Selected difficulty, scroll |
| Progress | ✅ | Selected section, scroll |
| Profile | ✅ | Scroll position |
| Swipe Session | ⚡️ | Paused, not destroyed |
| Battle Arena | ⚡️ | Paused, not destroyed |

### Edge Cases

```
- Rapid tab switching (debounce 300ms)
- Tab switch during animation (queue, complete current first)
- Tab switch during battle (pause battle, show confirm if needed)
- Deep link to tab (navigate directly, no animation)
- First visit vs returning (cache vs fetch)
```

---

## 6. First-Time User Experience (FTUE)

### FTUE Goal

```
"From zero to first win in under 60 seconds."
```

### FTUE Flow

```
APP INSTALL / FIRST VISIT
    │
    ▼
┌──────────────────┐
│ SPLASH SCREEN    │  ← 1.5s, logo + mascot animation
│ (1.5 detik)      │     Auto-proceed
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ ONBOARDING STEP 1 │  ← "Tujuan belajar?"
│ "Apa tujuan kamu?"│     Pilih: Ngerti Quran / Ngobrol / Sekolah
│ [3 options, tap]  │     Single tap, no scroll
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ ONBOARDING STEP 2 │  ← "Level kamu?"
│ "Level sekarang?" │     Pilih: Pemula / Sedikit bisa / Lancar
│ [3 options, tap]  │     Single tap
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ ONBOARDING STEP 3 │  ← "Target harian?"
│ "Target per hari?"│     Pilih: Santai (5menit) / Sedang (10menit) / Rajin (20menit)
│ [3 options, tap]  │     Single tap
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ FIRST LESSON     │  ← Langsung swipe 5 kartu pertama
│ (Tutorial swipe) │     Ada panah animasi "Geser kanan jika tahu"
│ 5 cards          │     Tidak ada login dulu!
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ FIRST REWARD     │  ← "+50 XP!" + "Streak Day 1!"
│ (Celebration)    │     Mascot excited, animasi reward
│ 3 detik          │     Auto-dismiss
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ ACCOUNT CREATE   │  ← "Buat akun untuk menyimpan progress!"
│ (Prompt)         │     Email + password / Google / Apple
│                   │     Atau "Nanti aja" → Guest mode
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ HOME SCREEN      │  ← Streak: Day 1, XP: 50
│ (Fully loaded)   │     Mascot: "Selamat datang di Harf!"
│                   │     Daily mission auto-unlocked
└──────────────────┘

TOTAL TIME: ~45-60 detik
```

### Guest Mode

| Feature | Guest Available? | Limit |
|---------|-----------------|-------|
| Swipe vocabulary | ✅ Yes | 20 words max |
| Battle | ✅ Yes | 3 battles max |
| Streak | ⚡️ Yes (local only) | Resets if clear cache |
| Progress saved | ⚡️ Local only | — |
| Leaderboard | ❌ No | Requires account |
| Social share | ❌ No | Requires account |
| Cloud sync | ❌ No | Requires account |

Guest → Register flow:
- Prompt muncul setelah 3 battle atau 20 kata (whichever first)
- "Progress kamu akan hilang jika tidak daftar!"
- Jika user register: merge local data to cloud

---

## 7. Onboarding Flow

### Step-by-Step Detail

### Step 1: Tujuan Belajar

```
┌──────────────────────────────────────┐
│                                      │
│  🎯  "Apa tujuan kamu belajar       │
│       bahasa Arab?"                  │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  📖  Ngerti Al-Quran         │    │  ← Option 1 (most common)
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🗣️  Bisa ngobrol            │    │  ← Option 2
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  📚  Bantu sekolah/kuliah    │    │  ← Option 3
│  └──────────────────────────────┘    │
│                                      │
│  → Ini akan menentukan konten awal   │
│    yang muncul di vocabulary list    │
│                                      │
└──────────────────────────────────────┘

Interaction: Tap card → spring scale 0.95 → select → next step
Animation: Selected card gets emerald border + glow
```

### Step 2: Level Kemampuan

```
┌──────────────────────────────────────┐
│                                      │
│  📊  "Seberapa bisa kamu            │
│       membaca Arab?"                 │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🌱  Pemula                   │    │  ← "Baru mulai"
│  │      Belum bisa baca Arab     │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🌿  Lumayan                  │    │  ← "Bisa baca tapi
│  │      Bisa baca, arti terbatas │    │     tidak tahu arti"
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🌳  Mahir                    │    │  ← "Bisa baca dan
│  │      Bisa baca + tahu banyak │    │     tahu banyak arti"
│  └──────────────────────────────┘    │
│                                      │
│  → Ini menentukan difficulty awal    │
│    (vocabulary level 1, 2, or 3)     │
│                                      │
└──────────────────────────────────────┘
```

### Step 3: Target Harian

```
┌──────────────────────────────────────┐
│                                      │
│  ⏱️  "Target belajar per hari?"     │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  😌  Santai (5 menit)        │    │  ← 5-10 cards per session
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  💪  Sedang (10 menit)       │    │  ← 10-20 cards (RECOMMENDED)
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🔥  Rajin (20 menit)        │    │  ← 20-30 cards
│  └──────────────────────────────┘    │
│                                      │
│  → Target memengaruhi daily mission  │
│    dan push notification timing      │
│                                      │
└──────────────────────────────────────┘
```

### Onboarding Technical Notes

- **No scrolling needed** — all options visible without scroll (max 3 options)
- **Tap, not swipe** — onboarding menggunakan tap untuk precision
- **Skip button** di pojok kanan atas (text: "Lewati")
- **Progress dots** di bawah: ● ● ○ (3 steps)
- **Back gesture** dari step 2/3 ke step sebelumnya (swipe right)
- **Data disimpan** ke Zustand + localStorage sebelum register
- Jika user skip onboarding: default = Ngerti Quran + Pemula + Sedang

---

## 8. Authentication Flow

### Auth Options

| Method | Implementation | Priority |
|--------|----------------|----------|
| Email + Password | Supabase Auth | 1 (fallback) |
| Google OAuth | Supabase Auth | 1 (recommended) |
| Apple OAuth | Supabase Auth | 2 |
| Magic Link | Supabase Auth | 3 |

### Auth Flow

```
USER ON LOGIN SCREEN
    │
    ├── "Masuk dengan Google" → OAuth popup → callback → redirect to Home
    │
    ├── "Masuk dengan Email" → Form email + password
    │   ├── Success → Home
    │   ├── Error → Show error toast
    │   └── "Lupa password?" → Reset password flow
    │
    ├── "Daftar" → Register form
    │   ├── Email + password + username
    │   ├── Success → Onboarding
    │   └── Error → Show error toast
    │
    └── "Nanti aja" → Guest mode (limited)

MIDDLEWARE CHECK ON EVERY ROUTE
    │
    ├── Authenticated + Onboarding done → Render page
    ├── Authenticated + No onboarding → Redirect to /onboarding
    └── Not authenticated → Redirect to /auth/login
```

### Guest → Full Account Migration

```
GUEST USER (local data exists)
    │
    └── User registers / logs in
        │
        ├── Prompt: "Progress lokal ditemukan. Gabungkan?"
        │   ├── "Ya" → Merge local → Cloud
        │   └── "Tidak" → Use cloud data (local = backup)
        │
        └── Data merged:
            ├── user_word_progress (union + dedup)
            ├── xp, level, streak (higher of two)
            └── battle_history (union)
```

### Auth UI

```
┌──────────────────────────────────────┐
│                                      │
│            🐦 HARF                   │
│                                      │
│  "Belajar Bahasa Arab,               │
│   Serasa Main Game"                  │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🔴  Lanjut dengan Google    │    │  ← Google button
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ⚫️  Lanjut dengan Apple     │    │  ← Apple button
│  └──────────────────────────────┘    │
│                                      │
│  ──────── atau ────────              │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ✉️  Email                   │    │  ← Email field
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │  🔒  Password                │    │  ← Password field
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  Masuk                       │    │
│  └──────────────────────────────┘    │
│                                      │
│  Belum punya akun? Daftar            │
│  ──── atau ────                       │
│  Nanti aja (Guest)                   │
│                                      │
└──────────────────────────────────────┘
```

---

## 9. Home Flow

### Home Screen Anatomy

```
┌─────────────────────────────────────────┐
│  🔥🔥  Hari ke-7               +250 XP │  ← Streak + XP (top bar)
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  Level 7        │  ← XP bar
│                                         │
│  🐦 "Selamat pagi, Rizky! Ayo belajar!" │  ← Mascot greeting
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  👆  Lanjut Belajar             │    │  ← CTA #1 (emerald, large)
│  │      5 kata baru menunggumu!    │    │     Full width, prominent
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ⚔️  Battle Cepat (2 menit)     │    │  ← CTA #2 (secondary)
│  └─────────────────────────────────┘    │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ 📋   │ │ 🎯   │ │ 🔊   │            │  ← Daily Missions
│  │ 10/10│ │ 0/1  │ │ 3/5  │            │     Compact cards
│  │  ✅  │ │ 🔄   │ │ 🔄   │            │     Status: done/pending
│  └──────┘ └──────┘ └──────┘            │
│                                         │
│  🏆 Peringkat: #12 di antara teman      │  ← Social nudge
│                                         │
│  [Feed: "Rizky belajar 15 kata"]        │  ← Friend activity
│  [Feed: "Aisyah naik rank!"]            │     (compact)
│                                         │
└─────────────────────────────────────────┘
```

### Element Priority (Top to Bottom)

```
1. STREAK + XP (must-see)           — Always visible, sticky top
2. MASCOT GREETING (warmth)         — Changes based on time/day
3. CONTINUE LEARNING (primary CTA)  — Biggest, most visible button
4. QUICK BATTLE (secondary CTA)     — Alternative action
5. DAILY MISSIONS (habit)           — Compact, glanceable
6. SOCIAL PROOF (retention)         — Friend activity, leaderboard
```

### Scroll Behavior

| Section | Scroll? | Behavior |
|---------|---------|----------|
| Streak/XP header | Sticky | Always visible at top |
| Mascot | Static | Below header |
| CTA buttons | Static | Below mascot |
| Daily missions | Scrollable | Horizontal scroll (3 cards) |
| Feed | Scrollable | Vertical scroll in remaining space |
| Bottom nav | Fixed | z-50, always visible |

### Animation Sequence (On Home Load)

```
1. Streak indicator: count + fire animation (500ms)
2. XP bar: fill animation (400ms)
3. Mascot: float in + greet (600ms spring)
4. CTA buttons: slide up staggered (200ms each)
5. Missions: slide in from right (300ms staggered)
6. Feed: fade in (400ms)
```

### CTA Hierarchy

| CTA | Priority | Visual Weight | When to Show |
|-----|----------|---------------|--------------|
| **Lanjut Belajar** | 1 (H1) | Full width, emerald gradient, medium button | Always |
| **Battle Cepat** | 2 (H2) | Full width, secondary style | Always |
| **Misi Harian** | 3 (H3) | Compact card, clickable | Always |
| **Ajak Teman** | 4 (L1) | Text link, subtle | If referral available |
| **Lihat Leaderboard** | 5 (L2) | Text link, subtle | If rank available |

### Home Refresh Logic

```
ON HOME VISIT:
  1. Check last_active_at
  2. If today !== last_active_at:
     → Show "Selamat pagi/siang/malam" greeting
     → Trigger streak increment
     → Trigger daily mission reset
     → Animate XP bonus for first visit
  3. If daily missions not completed:
     → Show mission cards with progress
  4. If streak in danger (evening, no activity):
     → Show streak warning
```

---

## 10. Learning Session Flow

### Session Start

```
USER TAPS "LANJUT BELAJAR" (or deep link harf://swipe)
    │
    ├── Check network → if offline, use cached words
    ├── Fetch next 10 words (SRS algorithm)
    │   ├── Priority: words due for review
    │   ├── Mix: 70% review + 30% new words
    │   └── Fallback: any unlearned words
    │
    ├── Transition to swipe screen
    │   ├── Page slide left (Home → Swipe)
    │   ├── Bottom nav hidden
    │   └── First card animate in (slide up + scale)
    │
    └── Session state:
        ├── currentIndex: 0
        ├── totalCards: 10
        ├── combo: 0
        ├── sessionXP: 0
        └── startedAt: now
```

### Session End Conditions

| Condition | Behavior |
|-----------|----------|
| All cards swiped | Show session summary |
| User taps "Selesai" | End session, show partial summary |
| App backgrounded >5 min | Auto-end session, save progress |
| Network lost | Continue if cached, else show offline mode |

### Session Summary

```
┌──────────────────────────────────────┐
│                                      │
│  🎉  Sesi Selesai!                   │
│                                      │
│  ✅  Benar: 8/10                     │
│  🔥  Combo tertinggi: x5             │
│  📊  XP didapat: +120                │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  🆕  Kata baru: 2             │    │
│  │  🔄  Review: 6                │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  👆  Lanjut Belajar (+10)    │    │  ← Continue
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │  🏠  Selesai                 │    │  ← Back to home
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

---

## 11. Swipe Vocabulary Flow

### Core Swipe Flow

```
┌─────────────────────────────────────────────┐
│  SWIPE CARD SESSION                          │
│                                              │
│  ┌─────────────────────────────────────┐     │
│  │           كِتَاب                      │     │
│  │                                     │     │
│  │         [🔊 Dengarkan]              │     │
│  │                                     │     │
│  │  ┌──────────┐         ┌──────────┐  │     │
│  │  │ ✕ Tidak  │         │  ✓ Tahu  │  │     │
│  │  └──────────┘         └──────────┘  │     │
│  │                                     │     │
│  │  ▓▓▓░░░░░░░░░░░░░  3/10            │     │
│  └─────────────────────────────────────┘     │
│                                              │
│  GESTURE ZONE (entire card area)             │
│  Swipe RIGHT → "Saya tahu artinya" (hijau)   │
│  Swipe LEFT  → "Saya tidak tahu" (merah)     │
│  Tap         → Reveal answer + options       │
└─────────────────────────────────────────────┘
```

### Gesture Mechanics

```
USER TOUCHES CARD
    │
    ├── Track finger position (x, y)
    ├── Card rotates: max 15deg based on dx
    ├── Overlay opacity: green (right) / red (left)
    │   opacity = min(abs(dx) / threshold, 1) * 0.3
    ├── Scale: slight shrink (0.95 at threshold)
    │
    ├── |dx| >= threshold (30% card width)?
    │   │
    │   ├── YES → Snap animation
    │   │   ├── direction > 0 ? swipeRight : swipeLeft
    │   │   ├── Card animates off screen (300ms spring)
    │   │   └── Process answer
    │   │
    │   └── NO → Snap back
    │       ├── Card springs back to center (200ms snappy)
    │       └── No answer recorded
    │
    └── USER RELEASES
        │
        ├── Velocity > threshold?
        │   └── Treat as swipe in velocity direction
        │
        └── Velocity < threshold?
            └── Snap back to center
```

### Answer Processing

```
SWIPE RIGHT (TAHU)
    │
    ├── ✅ Correct
    ├── XP: +10 (base) + combo bonus
    ├── Combo: +1
    ├── Sound: correct chime (satisfying)
    ├── Color: green flash
    ├── Mascot: happy reaction
    └── Word confidence: +1

SWIPE LEFT (TIDAK TAHU)
    │
    ├── ❌ Incorrect (treated as "didn't know")
    ├── XP: +2 (participation)
    ├── Combo: reset to 0
    ├── Sound: gentle "wrong" (not punishing)
    ├── Color: red flash (brief)
    ├── Reveal: show correct answer + meaning 1.5s
    ├── Mascot: supportive reaction
    └── Word confidence: -1

TAP (REVEAL)
    │
    ├── Card flips / fades to reveal side
    ├── Shows: Arabic + meaning + transliteration
    ├── User reads → taps "Sudah" to continue
    ├── Treated as "learning" (neutral)
    ├── XP: +1
    └── Word confidence: no change
```

### Combo Logic

```
COMBO SYSTEM:
    │
    ├── Consecutive correct = combo++
    ├── Combo resets on wrong answer
    ├── Combo counter always visible (top-right)
    │
    ├── Combo 1: no bonus
    ├── Combo 2: +2 XP bonus
    ├── Combo 3: +4 XP bonus
    ├── Combo 4: +6 XP bonus
    ├── Combo 5: +10 XP bonus + sparkle effect
    ├── Combo 7+: +15 XP bonus + glow + mascot excited
    ├── Combo 10: +25 XP bonus + screen effect + sound
    │
    └── Display: "🔥 x5 COMBO!" with gold color, scale bounce

COMBO BREAK:
    │
    ├── "COMBO BROKEN!" text (red, 500ms)
    ├── Combo counter shatters (particle animation)
    ├── Mascot: sad expression (500ms)
    ├── Combo resets to 0
    └── Encouraging message: "Ayo coba lagi!"
```

### Audio Playback Flow

```
USER TAPS AUDIO BUTTON
    │
    ├── Audio icon changes to ▶️ (playing state)
    ├── Waveform animation starts
    ├── Audio plays (native Arabic speaker)
    ├── Duration: ~1-2s per word
    │
    ├── On complete:
    │   ├── Icon returns to 🔊
    │   ├── Waveform stops
    │   ├── XP bonus: +2 (max 3x per word per session)
    │   └── Mascot: nods
    │
    ├── On error (audio failed):
    │   ├── Show error icon
    │   ├── Show transliteration as fallback
    │   └── Auto-retry once
    │
    └── Edge case: rapid tap → queue last tap only
```

### Progression Pacing

```
SESSION PROGRESSION:
    │
    ├── Card 1-3: Easy words (warm up)
    ├── Card 4-6: Mix of easy + medium
    ├── Card 7-9: Medium + 1 new word
    ├── Card 10: "Bonus" word (slightly harder, more XP)
    │
    ├── If user gets 3+ wrong in row:
    │   └── Insert easier card "Istirahat sebentar"
    │
    ├── If user gets 8+ correct in row:
    │   └── Insert harder card untuk challenge
    │
    └── Session ends after 10 cards (or user continues)
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| User swipes too fast | Minimum 500ms between cards, show "Slow down!" toast |
| User stuck on a word | After 10s, auto-show hint: transliteration |
| Accidental swipe | Show "Undo?" toast for 5s after each swipe |
| All words completed for today | "Kamu sudah belajar semua kata! Coba Battle!" |
| Same word appears twice | SRS prevents same-word-in-session |

---

## 12. Battle Mode Flow

### Battle Selection Screen

```
┌─────────────────────────────────────────┐
│                                         │
│  ⚔️  Battle                             │
│                                         │
│  Pilih lawan:                           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🌱  Pemula Bot                  │    │  ← Always available
│  │      50 HP | 10 soal             │    │     Easy
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🧭  Musafir Bot                 │    │  ← Unlock at rank Musafir
│  │      80 HP | 10 soal             │    │     Medium
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  👑  Boss: Nahwu King           │    │  ← Unlock every 5 ranks
│  │      200 HP | 2 phase           │    │     Lock icon if locked
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Riwayat Battle                  │    │  ← Expandable
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Battle Arena Flow (Detail)

```
USER SELECTS ENEMY → TAPS "BATTLE!"
    │
    ├── LOADING STATE (1-2s)
    │   ├── "Mencari lawan..." text
    │   ├── VS screen animation
    │   └── Enemy sprite loads
    │
    ├── INTRO (1.5s)
    │   ├── "MUSAFIR BOT muncul!" text
    │   ├── Enemy sprite: appear animation (scale 0 → 1, bounce)
    │   ├── Player sprite: ready stance
    │   ├── HP bars: slide in from sides
    │   └── "SIAP?" text → auto-start in 1s
    │
    ├── QUESTION PHASE (loop, 10 questions)
    │   │
    │   ├── New question appears:
    │   │   ├── Question card: slide up (200ms)
    │   │   ├── Options: stagger in (50ms each)
    │   │   ├── Timer starts: 10s (decreases with difficulty)
    │   │   └── Combo counter visible
    │   │
    │   ├── USER TAPS ANSWER:
    │   │   │
    │   │   ├── ✅ CORRECT:
    │   │   │   ├── Option: green flash
    │   │   │   ├── Damage number appears on enemy: "-15 ⚔️"
    │   │   │   ├── Enemy HP bar: decreases (300ms)
    │   │   │   ├── Enemy sprite: flash red + shake
    │   │   │   ├── Screen: subtle shake (2px)
    │   │   │   ├── Combo: ++
    │   │   │   ├── Sound: hit sound
    │   │   │   └── Timer stops
    │   │   │
    │   │   ├── ❌ WRONG:
    │   │   │   ├── Option: red flash
    │   │   │   ├── "SALAH!" text (500ms)
    │   │   │   ├── Player takes damage: HP bar decreases
    │   │   │   ├── Player sprite: flash red + shake
    │   │   │   ├── Combo: reset
    │   │   │   ├── Sound: damage sound
    │   │   │   └── Show correct answer (1.5s)
    │   │   │
    │   │   └── ⏱️ TIMEOUT:
    │   │       ├── Treated as wrong
    │   │       └── "WAKTU HABIS!" text
    │   │
    │   ├── Between questions (500ms gap)
    │   │   ├── Brief pause
    │   │   ├── Mascot reaction (if applicable)
    │   │   └── Next question loads
    │   │
    │   └── CHECK WIN/LOSE CONDITION:
    │       ├── Enemy HP ≤ 0 → VICTORY
    │       ├── Player HP ≤ 0 → DEFEAT
    │       └── Questions exhausted → higher HP wins
    │
    ├── VICTORY (3s celebration)
    │   ├── "VICTORY!" large text + particle
    │   ├── Enemy: defeat animation (fade/shatter)
    │   ├── Mascot: excited + confetti
    │   ├── Stats: damage dealt, combo, accuracy
    │   ├── Rewards: XP + coins shower
    │   └── Auto-proceed to result screen (2s)
    │
    ├── DEFEAT (2s)
    │   ├── "DEFEATED!" text (red)
    │   ├── Player: faint animation
    │   ├── Mascot: supportive
    │   ├── "Jangan menyerah! Coba lagi!" text
    │   ├── Small XP reward (participation)
    │   └── Auto-proceed to result (2s)
    │
    └── RESULT SCREEN
        ├── XP breakdown
        ├── Coins earned
        ├── Battle stats
        ├── [Battle Lagi] + [Kembali] buttons
        └── Share result? prompt
```

### Damage Calculation

```
BASE DAMAGE: 10 per correct answer
COMBO BONUS: +5 per combo stack
WEAKNESS BONUS: +10 if enemy type is weak to certain category
CRITICAL HIT: 15% chance, 2x damage (show "CRITICAL!" text)

PLAYER DAMAGE TAKEN: 15 per wrong answer (reduced by rank bonus)

ENEMY AI BEHAVIOR:
  - Pemula Bot: random answers, no strategy
  - Musafir Bot: occasionally uses "block" (skip dealing damage)
  - Nahwu King: phase 2 → double questions, faster timer
```

### Battle Timing

| Phase | Duration | Note |
|-------|----------|------|
| Loading | 1-2s | VS screen animation |
| Intro | 1.5s | Enemy appear + "Siap?" |
| Per question | 10s (max) | Timer counts down |
| Correct feedback | 500ms | Damage + combo |
| Wrong feedback | 1.5s | Show correct answer |
| Between questions | 500ms | Brief gap |
| Victory celebration | 3s | Particle + rewards |
| Defeat | 2s | Encouragement |
| Result screen | User-controlled | Buttons available |

**Total battle time: ~2-3 minutes (average)**

---

## 13. Boss Battle Flow

### Unlock Condition

Boss stage muncul setiap **5 level rank**:
- Rank Pemula (Level 1-5) → Boss tidak ada
- Rank Musafir (Level 6-10) → Boss pertama di Level 10
- Rank Penuntut Ilmu (Level 11-15) → Boss kedua di Level 15
- Dst.

### Boss Flow

```
NORMAL BATTLE FLOW (same as above)
    │
    └── EXCEPTIONS:
        │
        ├── PHASE 2 TRIGGER: Enemy HP ≤ 50%
        │   ├── Screen flash
        │   ├── "PHASE 2!" text + screen shake
        │   ├── Enemy sprite: transform (angry form)
        │   ├── Timer: 10s → 7s (harder)
        │   ├── Questions: double (2 questions in row)
        │   ├── Combo: preserved between double questions
        │   └── Reward pool: increased by 2x
        │
        └── REWARDS:
            ├── XP: 500 (vs 150 for normal battle)
            ├── Coins: 100 (vs 30-50)
            └── Badge: exclusive "Boss Slayer" badge
```

---

## 14. Audio Listening Flow

### Standalone Audio Mode

```
USER TAPS AUDIO BUTTON (on card / in vocabulary list)
    │
    ├── AUDIO PLAYBACK START
    │   ├── Icon: 🔊 → ▶️ (animated)
    │   ├── Waveform: 4 bars animating
    │   ├── Highlight: word border glows emerald
    │   ├── Duration: 1-2s
    │   └── XP: +2 (max 3x per word per day)
    │
    ├── DURING PLAYBACK
    │   ├── "Mendengarkan..." text
    │   ├── Waveform bars dance to audio
    │   └── All other interactions disabled briefly
    │
    ├── AFTER PLAYBACK
    │   ├── Icon: ▶️ → 🔊
    │   ├── Waveform stops
    │   ├── "+2 XP" float up
    │   ├── XP counter updates
    │   └── Mascot: nods approvingly
    │
    └── SPEED OPTIONS
        ├── Normal (100%): default
        ├── Lambat (70%): untuk pemula
        └── Pelan (50%): untuk kata sulit
```

### Audio in Swipe Session

- Setiap card memiliki audio button prominent (circular, emerald)
- User bisa tap audio kapan saja saat card visible
- Audio tidak otomatis play (user harus tap)
- Jika user swipe kiri (tidak tahu), rekomendasikan: "Coba dengarkan audio dulu!"

### Audio in Battle

- Battle tidak memiliki audio playback (fokus ke kecepatan)
- Audio adalah fitur eksklusif di mode learning/swipe

---

## 15. Daily Mission Flow

### Mission Generation

```
DAILY RESET (00:00 WIB)
    │
    ├── 3 missions generated from pool
    ├── Based on user level + target + history
    ├── Difficulty scales with rank
    └── Stored in daily_missions table
```

### Mission Display (Home)

```
┌─────────────────────────────────────────┐
│                                         │
│  📋  Misi Harian                        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ✅  Belajar 10 kata            │    │  ← Completed (green check)
│  │      [10/10]  50 XP             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🔄  Menang 1 Battle            │    │  ← In progress
│  │      [0/1]  75 XP               │    │     Tap → Battle page
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🔄  Dengarkan audio 5x         │    │  ← In progress
│  │      [3/5]  30 XP               │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌──────────────────────────┐           │
│  │  🎁  Claim All Rewards   │           │  ← Claim button
│  └──────────────────────────┘           │     (enabled if any done)
│                                         │
└─────────────────────────────────────────┘
```

### Mission Completion Flow

```
MISSION PROGRESS UPDATES (real-time)
    │
    ├── User completes action (swipe/battle/audio)
    ├── Mission progress += 1
    ├── If progress >= target:
    │   ├── Mission status: ✅ Completed
    │   ├── Card: green check + subtle glow
    │   ├── Sound: mission complete chime
    │   └── Toast: "Misi selesai! Claim reward-mu!"
    │
    └── All 3 missions complete:
        ├── All cards show ✅
        ├── "🎉 Semua misi selesai!" celebration
        └── Mascot: excited reaction

CLAIM REWARD:
    ├── Tap "Claim All"
    ├── XP shower animation (+ total XP)
    ├── Coin shower (+ total coins)
    ├── Toast: "+155 XP + 45 Coin dari misi!"
    └── Missions collapse, reset next day
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| User doesn't claim before reset | Rewards lost, toast: "Reward misi kemarin belum di-claim!" |
| Mission impossible (need battle but offline) | Show "Butuh koneksi internet" on that mission card |
| All missions done early | "Keren! Semua selesai. Tunggu misi besok ya!" + mascot proud |

---

## 16. XP & Reward Flow

### XP Flow

```
XP IS EARNED FROM MULTIPLE SOURCES
    │
    ├── Swipe correct: +10 (base) + combo bonus
    ├── Swipe wrong: +0 (or +2 if audio listened)
    ├── Audio listened: +2
    ├── Battle win: +100-250 (based on difficulty)
    ├── Battle lose: +25 (participation)
    ├── Daily mission: +30-200 (per mission)
    ├── Streak milestone: +200-1000
    ├── First session of day: +50 (login bonus)
    └── Invite friend: +100 (when friend starts)

XP ACCUMULATION:
    ├── XP updates immediately (optimistic)
    ├── XP bar animates (width transition 400ms)
    ├── XP number counts up (if applicable)
    ├── XP float (+10) appears at interaction point
    └── Total XP syncs to server in background
```

### XP Feedback Hierarchy

```
┌─────────────────────────────────────┐
│  MICRO (per swipe)                  │
│  ┌─────────────────────────────┐    │
│  │         +10 XP 🟢           │    │  ← Float up, 800ms, auto
│  └─────────────────────────────┘    │
│                                     │
│  MESO (per battle/session)          │
│  ┌─────────────────────────────┐    │
│  │     +250 XP ⚔️              │    │  ← Shower, 1.5s
│  │     +50 Coin 🪙             │    │
│  └─────────────────────────────┘    │
│                                     │
│  MACRO (level up / rank up)         │
│  ┌─────────────────────────────┐    │
│  │  🎉 LEVEL UP!                │    │  ← Full screen, 2s
│  │  +500 XP Bonus               │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Level Up Flow

```
XP BAR REACHES 100%
    │
    ├── XP bar: fill to 100% → glow → flash
    ├── "LEVEL UP!" text: scale bounce (center screen)
    ├── Current level number: count up animation
    ├── New XP bar: reset to 0, max XP increased
    ├── Particle effect: burst from level text
    ├── Sound: level up fanfare
    ├── Mascot: euphoric reaction + sparkle
    │
    ├── If rank up also triggered:
    │   └── Show rank up screen (see section 17)
    │
    └── Reward sheet (auto):
        ├── "+500 Bonus XP Level Up!"
        ├── "🔓 Fitur baru: [unlocked feature]"
        ├── [Lanjut] button
        └── Mascot: proud (hovering with crown)
```

---

## 17. Rank Up Flow

### Rank Up Trigger

```
XP MILESTONE REACHED (threshold for next rank)
    │
    ├── Check: current_xp >= rank_threshold
    ├── If yes → Rank Up sequence
    └── If no → Normal Level Up only

RANK UP SEQUENCE (3s)
    │
    ├── 1. Screen dims (100ms)
    ├── 2. Current rank icon: fade out (200ms)
    ├── 3. "RANK UP!" text: massive, gold, scale bounce
    ├── 4. New rank icon: appear with glow + sparkle
    ├── 5. New rank name: type-in or scale animation
    ├── 6. Rank privileges: list items slide in
    ├── 7. Particle: gold coins + confetti
    ├── 8. Sound: epic rank up fanfare
    ├── 9. Mascot: wearing crown, proud
    └── 10. Share card prompt: "Bagikan pencapaian?"
```

### Rank Up Screen

```
┌──────────────────────────────────────┐
│                                      │
│          🎉 RANK UP! 🎉             │
│                                      │
│          🌱  →  🧭                  │
│       PEMULA    MUSAFIR              │
│                                      │
│  "Selamat! Kamu sekarang             │
│   seorang Musafir!"                  │
│                                      │
│  🔓 Fitur baru:                      │
│  ├ Battle Hard Mode                  │
│  ├ Leaderboard                       │
│  └ Friend Challenge                  │
│                                      │
│  ┌──────────────────────────┐        │
│  │  📤 Bagikan ke teman     │        │
│  └──────────────────────────┘        │
│                                      │
│  ┌──────────────────────────┐        │
│  │  👍 Lanjut                │        │
│  └──────────────────────────┘        │
│                                      │
└──────────────────────────────────────┘
```

### Rank Demotion Flow

```
USER INACTIVE >30 DAYS (Ahli Nahwu / Sultan Arabic only)
    │
    ├── Grace period: 7 days after 30d inactive
    ├── Notification: "Rank kamu akan turun dalam 7 hari"
    ├── Notification: "Rank kamu akan turun besok!"
    ├── After grace period:
    │   ├── Rank: -1
    │   ├── Screen: rank demotion alert
    │   ├── "Rank kamu turun karena tidak aktif"
    │   ├── XP: set to midpoint of new rank
    │   └── "Ayo aktif lagi untuk naik rank!"
    └── No further demotion for 30 days after demotion
```

---

## 18. Streak Flow

### Streak Increment

```
USER COMPLETES FIRST ACTION OF THE DAY
    │
    ├── Check: last_active_date != today
    │   │
    │   ├── First action of day → Streak++
    │   ├── Streak count: update (e.g., 6 → 7)
    │   ├── Fire indicator: grow + intensify
    │   ├── Mascot: "Streak #{count}! Keren!"
    │   ├── XP bonus: +50 (first session) × streak multiplier
    │   ├── Toast: "🔥 Streak #{count} hari! +100 XP"
    │   │
    │   └── If milestone (7, 14, 30, 60, 100):
    │       ├── Milestone celebration screen
    │       ├── Badge earned (if applicable)
    │       ├── Multiplier updated (if threshold crossed)
    │       └── Share card prompt
    │
    └── Not first action → No streak change
```

### Streak Danger Flow

```
USER HAS NOT OPENED APP TODAY
    │
    ├── Time check:
    │   ├── Before 18:00 → No notification
    │   ├── 18:00-20:00 → Push: "🔥 Ayo belajar! Streak #{count}!"
    │   ├── 20:00-23:00 → Push: "⚠️ Streakmu dalam bahaya! 1 swipe aja!"
    │   └── 23:00-23:59 → Push: "🚨 Streak #{count} mau putus!"
    │
    └── Home screen (if user opens app):
        ├── Danger banner at top (amber/orange)
        ├── Mascot: worried expression
        ├── "Cepat! Streakmu mau putus!" text
        └── CTA: "🔥 Selamatkan Streak" → 1 swipe
```

### Streak Freeze Flow

```
USER HAS STREAK FREEZE ITEM AND MISSES A DAY
    │
    ├── Auto-activates at 00:01
    ├── Streak count: preserved (no change)
    ├── Streak freeze: -1
    ├── Notification: "Streakmu aman! Tapi jangan sampai habis freezenya!"
    ├── Streak visual: dimmed fire + "❄️ Frozen" badge
    └── If user opens app: banner "Streak aman berkat Freeze"

USER HAS NO FREEZE AND MISSES A DAY
    │
    ├── Streak: reset to 0
    ├── Streak lost animation:
    │   ├── Extinguish sound
    │   ├── Fire dies out (particle fade)
    │   ├── "💔 Streak putus di #{count} hari" text
    │   ├── Mascot: crying
    │   └── Encouragement: "Gapapa! Mulai lagi hari ini!"
    ├── Streak recovery bonus: 2x XP for 3 days
    └── "Kebangkitan" badge if user reaches 7 again
```

---

## 19. Leaderboard Flow

### Leaderboard Display

```
┌─────────────────────────────────────────┐
│                                         │
│  🏆  Papan Peringkat                    │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐             │
│  │ Teman│  │Global│  │Minggu│             │  ← Tabs
│  └─────┘  └─────┘  └─────┘             │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  #1  Rizky45         4,520 XP   │    │  ← Top 3 with
│  │      🔥 7 day streak            │    │     gold/silver/bronze
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  #2  Aisyah_A       3,890 XP   │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  #3  HarfMaster     3,120 XP   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ──── YOUR RANK ────                    │
│  ┌─────────────────────────────────┐    │
│  │  #4  Kamu (You)       2,450 XP  │    │  ← Highlighted row
│  │      📈 Naik 2 peringkat!       │    │     emerald bg
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  #5  AbuHanifah     2,100 XP   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌──────────────────────────┐           │
│  │  1,670 XP lagi ke #3!    │           │  ← Motivational text
│  └──────────────────────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

### Leaderboard Refresh

| Type | Refresh Rate | Data Source |
|------|-------------|-------------|
| Friends | Real-time | Supabase Realtime |
| Global | Daily (00:00) | Database query |
| Weekly | End of week | Aggregate table |

### Rank Change Animation

```
USER RANK CHANGES
    │
    ├── Positive change (+2):
    │   ├── Row: green glow flash
    │   ├── "📈 Naik 2 peringkat!" text
    │   └── Mascot: proud
    │
    └── Negative change (-1):
        ├── Row: subtle dim
        ├── "📉 Turun 1 peringkat" text (small)
        └── "Ayo belajar lagi!" encouragement
```

---

## 20. Progress Page Flow

### Progress Page Anatomy

```
┌─────────────────────────────────────────┐
│                                         │
│  📊  Progress                           │
│                                         │
│  ┌─── RANK ────────────────────────┐    │
│  │  🧭  MUSAFIR                     │    │  ← Large rank display
│  │  Level 7                         │    │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  3,450/5K │    │  ← XP to next rank
│  └──────────────────────────────────┘    │
│                                         │
│  ┌─── STATS ───────────────────────┐    │
│  │  ┌────────┐ ┌────────┐          │    │
│  │  │ 📖     │ │ 🔥     │          │    │  ← 4 stat cards in grid
│  │  │ 120    │ │ 7 hari │          │    │
│  │  │ Kata   │ │ Streak │          │    │
│  │  └────────┘ └────────┘          │    │
│  │  ┌────────┐ ┌────────┐          │    │
│  │  │ ⚔️     │ │ 🏆     │          │    │
│  │  │ 45     │ │ #4     │          │    │
│  │  │ Battle │ │ Rank   │          │    │
│  │  └────────┘ └────────┘          │    │
│  └──────────────────────────────────┘    │
│                                         │
│  ┌─── BADGE COLLECTION ─────────────┐   │
│  │  🔥  🏆  ⭐  🎯  ❓  ❓          │    │  ← Badge grid (6 cols)
│  │  Striker Champ ...               │    │     Locked = gray ?
│  └──────────────────────────────────┘    │
│                                         │
│  ┌─── LEARNING HISTORY ─────────────┐   │
│  │  🟢 10 kata — 2 Mei             │    │  ← Simple timeline
│  │  🟢 8 kata — 1 Mei              │    │
│  │  🔴 0 kata — 30 Apr             │    │
│  └──────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Scroll Behavior

- All sections scroll vertically
- Rank card is sticky (always visible when scrolling stats)
- Badge section is a horizontally scrollable grid (2 rows)
- Learning history loads more on scroll (pagination)

### Tab Switching Within Progress

```
Sub-tabs: Overview | Badges | History

Overview: Default — rank + stats + recent activity
Badges: Grid of all badges (earned & locked)
History: Timeline of learning activity (paginated)
```

---

## 21. Badge Collection Flow

### Badge Unlock Flow

```
BADGE CONDITION MET (e.g., 7-day streak)
    │
    ├── Trigger: auto-detect on relevant action
    ├── Toast: "🏅 Badge baru!" (1.5s preview)
    │
    ├── If user is mid-action (swipe/battle):
    │   └── Delay badge screen until session ends
    │
    └── Badge unlock screen (modal):
        ├── "BADGE BARU!" title
        ├── Badge animation: appear with glow + sparkle
        ├── Badge name + description
        ├── Rarity indicator (gold border for rare)
        ├── Sound: badge unlock chime
        ├── Mascot: starstruck reaction
        ├── [📤 Bagikan] + [👍 Keren!] buttons
        └── Auto-save to user_badges table
```

### Badge Collection View (Progress Page)

```
┌─────────────────────────────────────────┐
│                                         │
│  🏅  Badge Collection                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🔥                            │    │  ← Earned (full color)
│  │  Striker · Langka               │    │     Gold border
│  │  7 hari streak                  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ❓                            │    │  ← Locked (gray, ? icon)
│  │  ???                            │    │
│  │  ???                            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  8/15 badge terkumpul                   │  ← Progress indicator
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  53%              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 22. Profile Flow

### Profile Screen

```
┌─────────────────────────────────────────┐
│                                         │
│  👤  Profil                    ⚙️       │  ← Settings icon (top-right)
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🐦 (avatar placeholder)       │    │  ← Large avatar
│  │  Rizky45                        │    │  ← Username
│  │  🧭 Musafir · Level 7           │    │  ← Rank + Level
│  └──────────────────────────────────┘    │
│                                         │
│  ┌─── STATS ───────────────────────┐    │
│  │  Kata dipelajari: 120           │    │
│  │  Total XP: 12,450               │    │
│  │  Streak tertinggi: 14 hari      │    │
│  │  Battle dimenangkan: 45         │    │
│  └──────────────────────────────────┘    │
│                                         │
│  ┌─── SHOWCASE ────────────────────┐    │
│  │  Badge: 🔥 Striker              │    │  ← 3 favorite badges
│  │  Badge: 🏆 Battle Master        │    │
│  │  Badge: ⭐ Fast Learner         │    │
│  └──────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📤 Bagikan Profil              │    │  ← Share profile card
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📨 Ajak Teman (+100 XP)        │    │  ← Referral CTA
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Kode Referral: HARF-RIZKY45    │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Settings Screen (Modal/Slide-in)

```
┌─────────────────────────────────────────┐
│  ←  Pengaturan                          │
│                                         │
│  ┌─── AUDIO ────────────────────────┐   │
│  │  🔊  Suara efek          [ON]    │   │  ← Toggle
│  │  🎵  Musik latar        [OFF]   │   │
│  │  🔊  Kecepatan audio    [Normal]│   │  ← Dropdown
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─── TAMPILAN ─────────────────────┐   │
│  │  🌙  Mode Gelap          [ON]    │   │
│  │  📱  Animasi            [ON]    │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─── NOTIFIKASI ──────────────────┐    │
│  │  🔥  Streak reminder    [ON]    │    │
│  │  📋  Misi harian        [ON]    │    │
│  │  👥  Aktivitas teman   [OFF]   │    │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─── AKUN ────────────────────────┐    │
│  │  ✉️  Email              r@e.com │    │
│  │  🔑  Ganti password             │    │
│  │  🗑️  Hapus akun                │    │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🚪  Keluar                     │    │  ← Logout (red text)
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 23. Settings Flow (Detail)

### Settings Navigation

```
PROFILE PAGE → TAP ⚙️
    │
    ├── Transition: right slide-in (modal style, not full page)
    ├── Backdrop: bg-black/60 backdrop-blur-sm
    ├── Content: settings list
    ├── Tap "←" or swipe right → dismiss with slide-out
    └── No bottom nav (settings is overlay)
```

### Setting Changes

```
USER TOGGLES SETTING
    │
    ├── Optimistic update: UI changes immediately
    ├── Save to Zustand store
    ├── Persist to localStorage
    ├── Sync to Supabase (if authenticated)
    ├── Apply setting (e.g., sound off → mute all)
    └── Toast: "Pengaturan disimpan"
```

---

## 24. Notification Flow

### Notification Triggers (Push)

| Trigger | Timing | Content | Priority |
|---------|--------|---------|----------|
| Streak reminder | 19:00 (local) | "🔥 Streak #{c}, ayo jangan sampai putus!" | High |
| Streak danger | 21:00 | "⚠️ Streak mau putus! Cuma butuh 1 swipe!" | High |
| Streak lost | 00:05 | "💔 Streak putus di #{c}. Ayo mulai lagi!" | Medium |
| Mission incomplete | 18:00 | "📋 Misi hari ini: #{m}. Masih ada waktu!" | Medium |
| Mission done (unclaimed) | 20:00 | "🎁 Reward misi belum di-claim!" | Medium |
| Rank milestone | Near threshold | "🏆 #{xp} XP lagi menuju #{rank}!" | Low |
| Friend activity | Daily digest | "👋 #{friend} naik #{n} peringkat!" | Low |
| Badge earned (if away) | On unlock | "🏅 Badge baru: #{badge}" | Low |
| Inactive 3 days | 3d after last visit | "🐦 Burhan kangen kamu. Ayo main lagi!" | Medium |

### Notification Tap Behavior

```
USER TAPS NOTIFICATION
    │
    ├── Deep link to specific screen:
    │   ├── Streak → Home (with streak banner)
    │   ├── Mission → Home (missions expanded)
    │   ├── Battle → Battle select
    │   ├── Badge → Progress (badge section)
    │   ├── Rank → Progress (rank section)
    │   └── Friend → Social page
    │
    └── Animation: app opens → direct to screen (no navigation menu)
```

### In-App Notification Feed

```
┌─────────────────────────────────────────┐
│  🔔  Notifikasi                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  🔥  Hari ini — 19:30           │    │  ← Unread (highlighted)
│  │  Streak #{c} belum aman!        │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  🏅  Kemarin — 15:20            │    │  ← Read (dimmed)
│  │  Badge baru: Striker!           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📋  2 hari lalu — 10:00        │    │
│  │  Misi harian selesai            │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 25. Social Sharing Flow

### Share Trigger Moments

| Moment | Emotional Hook | Share Format |
|--------|----------------|--------------|
| **Streak milestone** (7/14/30 days) | Pride + Fear of losing | Streak card |
| **Rank up** | Achievement + Status | Rank card |
| **Badge earned** (rare+) | Exclusivity + Pride | Badge card |
| **Daily result** | "Look what I did" | Daily summary card |
| **Battle victory** (boss) | Triumph + Challenge friends | Battle result card |
| **Level up** | Progress + "I'm advancing" | Level card |
| **Referral** | Incentive + "Join me" | Referral card |

### Share Flow

```
SHARE TRIGGER (auto-prompt or user-initiated)
    │
    ├── Generate share card image (client-side Canvas)
    │   ├── Aspect ratio: 9:16 (optimized for Story/Status)
    │   ├── Background: gradient + particle effect
    │   ├── Content: dynamic (streak/badge/rank data)
    │   ├── Branding: Harf logo + "harf.app" URL
    │   ├── QR code: deep link to app/referral
    │   └── Mascot: relevant expression
    │
    ├── Share sheet opens (native Web Share API or custom)
    │   ├── TikTok Story
    │   ├── Instagram Story
    │   ├── WhatsApp Status
    │   ├── Twitter/X
    │   └── Copy link
    │
    ├── User selects platform
    │   ├── Open platform app (or fallback to download)
    │   └── Card auto-placed in story/status editor
    │
    └── After share:
        ├── Toast: "Berhasil dibagikan!"
        ├── XP bonus: +20 (if shared)
        └── Mascot: happy + wave
```

### Viral Loop

```
USER SHARES STREAK CARD
    │
    ├── Friend sees card on Instagram Story
    ├── Friend taps link / QR code
    ├── Opens Harf (or app store → download → Harf)
    ├── Friend sees onboarding
    ├── Friend registers (with referral code embedded)
    │
    ├── Original user gets:
    │   ├── +100 XP referral bonus
    │   ├── Notification: "Temanmu bergabung!"
    │   └── +50 Coin
    │
    └── Friend starts with:
        ├── +50 XP welcome bonus
        └── Pre-follow referrer (auto-friend)
```

### Share Card Design

```
┌────────────────────┐
│  🔥🔥🔥🔥🔥🔥🔥     │
│                    │
│  7 HARI STREAK!   │
│                    │
│  Aku sudah belajar │
│  7 hari berturut-  │
│  turut di Harf!   │
│                    │
│  🐦  Rizky45      │
│  🧭  Musafir      │
│                    │
│  ┌──────────┐     │
│  │ QR Code  │     │
│  └──────────┘     │
│  harf.app/r/      │
│  RIZKY45          │
│                    │
│  #Harf #BelajarArab│
└────────────────────┘

Aspect: 9:16 (1080×1920px)
Format: PNG (download) / MP4 (optional animated)
```

---

## 26. Error Handling Flow

### Error Types

| Type | Example | User Impact |
|------|---------|-------------|
| **Network** | Connection lost | Can't fetch/sync |
| **Auth** | Session expired | Redirect to login |
| **Server** | 500 Internal | Can't load content |
| **Rate limit** | Too many requests | Brief cooldown |
| **Not found** | Word/badge not found | Show empty state |
| **Validation** | Invalid input | Show field error |
| **Timeout** | Battle timeout | Auto-submit / lose |

### Global Error Handler Flow

```
ERROR OCCURS
    │
    ├── Determine error type
    ├── Show appropriate UI:
    │
    ├── NETWORK ERROR:
    │   ├── Inline: "Koneksi terputus" banner (top, dismissible)
    │   ├── Swipe: use cached words, show "Offline mode" indicator
    │   ├── Battle: "Butuh koneksi untuk battle" + disabled button
    │   └── Full page: if critical, show offline page with retry
    │
    ├── AUTH ERROR:
    │   ├── Session expired → silent refresh
    │   ├── Refresh failed → redirect to login
    │   ├── Toast: "Sesi berakhir, silakan masuk lagi"
    │   └── Save current state before redirect
    │
    ├── SERVER ERROR:
    │   ├── Toast: "Ada gangguan. Coba lagi ya!"
    │   ├── Auto-retry: 3x with exponential backoff
    │   └── After 3x: show error state with [Coba Lagi] button
    │
    └── VALIDATION ERROR:
        ├── Inline: red border + error text below field
        ├── Shake animation on input
        └── Mascot: "Hmm, coba cek lagi"
```

### Error Screen Design

```
┌──────────────────────────────────────┐
│                                      │
│  🐦  (Mascot: confused/sad)          │
│                                      │
│  "Yah, ada masalah!"                 │
│                                      │
│  Koneksi internet kamu mungkin       │
│  bermasalah. Data kamu aman,         │
│  kok!                                │
│                                      │
│  ┌──────────────────────────┐        │
│  │  🔄  Coba Lagi           │        │
│  └──────────────────────────┘        │
│                                      │
│  ┌──────────────────────────┐        │
│  │  🏠  Kembali ke Beranda  │        │
│  └──────────────────────────┘        │
│                                      │
└──────────────────────────────────────┘
```

### Error Recovery

```
USER TAPS "COBA LAGI"
    │
    ├── Show loading state
    ├── Retry operation
    │   ├── Success → dismiss error, show content
    │   └── Failed again → increment retry count
    │       ├── Count < 3: show error again
    │       └── Count ≥ 3: "Masih bermasalah. Coba nanti ya!"
    │           + Mascot: "Tim Harf sudah tahu kok!"
    │           + [Hubungi Bantuan] button
    └── Exponential backoff: 1s, 2s, 4s between retries
```

---

## 27. Empty State Flow

### Empty State Triggers

| Screen | Empty State | First Visit vs Cleared |
|--------|-------------|------------------------|
| **Swipe session** | "Belum ada kata untuk dipelajari" | First: onboarding takes priority |
| **Battle history** | "Belum ada battle" | First visit |
| **Badge collection** | "Badge masih kosong" | First visit |
| **Leaderboard (friends)** | "Ajak teman untuk lihat papan peringkat!" | No friends yet |
| **Feed** | "Belum ada aktivitas teman" | No friends |
| **Notifications** | "Belum ada notifikasi" | Cleared all |
| **Search results** | "Tidak ditemukan" | No matching results |

### Empty State Design

```
┌──────────────────────────────────────┐
│                                      │
│  🐦  (Mascot: sleepy / lonely)       │
│                                      │
│  "Masih sepi di sini..."             │
│                                      │
│  Ajak temanmu belajar bareng         │
│  di Harf! Dapatkan bonus XP juga!   │
│                                      │
│  ┌──────────────────────────┐        │
│  │  📨 Ajak Teman           │        │  ← Actionable CTA
│  └──────────────────────────┘        │
│                                      │
│  Atau mulai belajar dulu            │
│  ┌──────────────────────────┐        │
│  │  👆  Belajar Sekarang     │        │  ← Alternative CTA
│  └──────────────────────────┘        │
│                                      │
└──────────────────────────────────────┘
```

### Empty State Rules

| Rule | Implementation |
|------|----------------|
| Always have a CTA | Don't leave user stuck |
| Mascot present | Emotional connection |
| Friendly tone | "Belum ada" not "Kosong" |
| Alternative action | Secondary CTA if primary not possible |
| No robotic text | "Tidak ada data" → ❌ |

---

## 28. Offline Mode Flow

### Offline Detection

```
ONLINE → OFFLINE TRANSITION
    │
    ├── Detect: navigator.onChange → false
    ├── Banner: "Kamu sedang offline" (yellow bar, top, sticky)
    ├── Mascot: "Jangan khawatir, kamu masih bisa belajar!"
    ├── Icon: offline indicator in header
    └── Disable: Battle, Leaderboard, Social, Share

OFFLINE → ONLINE RECONNECT
    ├── Detect: navigator.onChange → true
    ├── Banner: "Kembali online!" (green, 2s, auto-dismiss)
    ├── Sync: trigger background sync
    └── Re-enable: all features
```

### Offline Feature Matrix

| Feature | Offline Support | Limitation |
|---------|----------------|------------|
| Swipe vocabulary | ✅ Full (cached) | No new words |
| Audio playback | ✅ If pre-cached | Limited to cached audio |
| Streak tracking | ✅ Local, sync later | — |
| XP tracking | ✅ Local, sync later | — |
| Daily mission | ⚡️ Progress tracked locally | Can't see new missions |
| Battle | ❌ | Requires server |
| Leaderboard | ❌ | Requires server |
| Social share | ❌ | Requires server |
| Badge unlock | ❌ | Server validation needed |
| Profile edit | ❌ | Requires server |

### Offline Sync Queue

```
USER ACTIONS OFFLINE
    │
    ├── Queue in localStorage:
    │   ├── [{ type: 'swipe', wordId, result, timestamp }]
    │   ├── [{ type: 'xp', amount, source }]
    │   └── [{ type: 'streak', date }]
    │
    ├── Queue size: max 100 entries
    ├── If full: oldest entries compressed (lose non-critical)
    │
    └── ON RECONNECT:
        ├── Process queue sequentially
        ├── Resolve conflicts (server wins)
        ├── Update UI with latest data
        ├── Show summary: "Data tersinkron! +150 XP"
        └── Clear queue
```

---

## 29. Reconnect Flow

### Session Recovery

```
APP CRASHES / USER CLOSES MID-SESSION
    │
    ├── State saved in Zustand persist + localStorage:
    │   ├── Current swipe session (index, combo, words)
    │   ├── Current battle state (question, HP, etc.)
    │   └── UI state (active tab, scroll position)
    │
    └── ON REOPEN:
        ├── Check for saved session (within 30 min)
        │   ├── Session found → prompt:
        │   │   ├── "Ada sesi yang belum selesai. Lanjutkan?"
        │   │   ├── [Lanjutkan] → restore session
        │   │   └── [Abaikan] → clear, go to home
        │   │
        │   └── No session → normal home load
        │
        └── Check network status:
            ├── Online → sync any pending data
            └── Offline → offline mode
```

### Battle Recovery

```
BATTLE INTERRUPTED (crash, call, app switch)
    │
    ├── State saved: question index, HP, combo, current question
    ├── Time elapsed since interruption:
    │   ├── < 2 min: restore exact state
    │   ├── 2-5 min: restore but give user extra time
    │   └── > 5 min: forfeit battle (treat as loss)
    │
    └── On restore:
        ├── "Battle dilanjutkan!" text
        ├── Brief re-cap (1s)
        └── Resume from same question
```

---

## 30. Loading State Flow

### Loading Types

| Type | Visual | Duration | Usage |
|------|--------|----------|-------|
| **Skeleton** | Gray pulsing blocks | >500ms | Screen/content load |
| **Spinner** | Circular spinning | >1s | Action processing |
| **Skeleton card** | Card-shaped skeleton | >300ms | List load |
| **Progress bar** | Linear indeterminate | >2s | Battle loading |
| **Skeleton text** | Text lines | >200ms | Content load |
| **Full screen spinner** | Center spinner + text | >3s | Auth/onboarding |

### Loading Sequence

```
USER TAPS / NAVIGATES
    │
    ├── Immediate UI response (100ms):
    │   ├── Button: pressed state → spinner icon
    │   ├── Tab: color change
    │   └── Card: subtle scale
    │
    ├── If loading < 300ms:
    │   └── No skeleton needed (instant response)
    │
    ├── If loading 300ms - 1s:
    │   └── Show skeleton (subtle, no text)
    │
    └── If loading > 1s:
        ├── Show skeleton with "Memuat..." text
        └── After 3s: show loading tip (rotating tips)
```

### Skeleton Specifications

```
┌──────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  ← height: 20px (title)
│                                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓             │  ← height: 14px (text)
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │
│  ▓▓▓▓▓▓▓▓▓▓                           │
│                                      │
│  ┌──────────────────────────────┐    │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │    │  ← height: 180px (card)
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘

Colors:
  Base:      bg-[#1E293B] (animate-pulse)
  Highlight: bg-[#334155]
  
Animation: opacity 1 → 0.4 → 1, 1.5s loop
```

---

## 31. Modal Flow

### Modal Hierarchy

```
Z-INDEX LAYERS:
    │
    ├── z-10: Cards, content
    ├── z-20: Bottom nav, sticky header
    ├── z-30: Toast notifications
    ├── z-40: Modals, sheets
    └── z-50: Loading overlay, splash
```

### Modal Types & Behavior

| Modal Type | Trigger | Animation | Dismiss |
|------------|---------|-----------|---------|
| **RewardSheet** | Level up, badge, rank | Slide up (300ms spring) | Tap backdrop / [Lanjut] |
| **ShareSheet** | Share action | Slide up (250ms spring) | Swipe down / backdrop |
| **ConfirmAlert** | Destructive action | Scale fade (200ms) | Tap button |
| **InfoSheet** | Word detail, rank info | Slide up (250ms spring) | Swipe down |
| **SettingsPanel** | Profile → ⚙️ | Slide right (250ms) | Swipe right / ← |
| **NotificationList** | Bell icon | Slide down (200ms) | Tap backdrop |
| **LoadingOverlay** | Long operation | Fade (150ms) | Auto-dismiss |

### Modal Stack

```
MULTIPLE MODALS (rare, but possible)
    │
    ├── Only one modal visible at a time
    ├── New modal opens → previous modal is hidden (not destroyed)
    ├── New modal closes → previous modal re-appears
    └── Backdrop blur increases with stack depth

Example:
  User levels up → RewardSheet opens
  → User taps "Bagikan" → ShareSheet opens ON TOP
  → User dismisses ShareSheet → RewardSheet visible again
  → User dismisses RewardSheet → back to game
```

---

## 32. Gesture Interactions

### Complete Gesture Map

| Gesture | Screen | Action | Visual Feedback |
|---------|--------|--------|-----------------|
| **Swipe Right** | Swipe card | "Tahu" | Card follows finger → green overlay → snap out |
| **Swipe Left** | Swipe card | "Tidak tahu" | Card follows finger → red overlay → snap out |
| **Tap (short)** | Any button | Activate | Scale 0.95 → 1.0 |
| **Tap (short)** | Card (not swipe) | Reveal answer | Card flip/fade |
| **Swipe Down** | Modal | Dismiss | Modal follows finger → opacity decrease |
| **Swipe Right (edge)** | Any page (context) | Go back | Page slides right |
| **Long Press** | Future: word detail | Show info | Haptic preview |
| **Scroll Down** | Home, Progress, etc. | Show more content | Native scroll |
| **Pull Down** | Top of scrollable | Refresh | Pull indicator → spinner |
| **Double Tap** | Future: mascot | Mascot reaction | Mascot jumps |

### Conflict Resolution

| Potential Conflict | Resolution |
|-------------------|------------|
| Swipe card vs scrolling | Card swipe = horizontal only; scroll = vertical only |
| Bottom nav tab vs swipe | Bottom nav = fixed zone, no swipe |
| Modal dismiss vs content | Modal has dedicated handle bar for swipe-down |
| Back gesture vs swipe card | Swipe card hanya aktif di swipe page; back di-restrict |
| Pull refresh vs content | Only at top of scroll, disable during swipe session |

---

## 33. Animation Transition Rules

### Page Transitions

```
TAB SWITCH:
  Tab > current: content slides LEFT (new content pushes old)
  Tab < current: content slides RIGHT (old content reveals new)

  Duration: 250ms
  Easing: ease-in-out
  Type: transform translateX, not width

DEEP LINK / DIRECT NAVIGATION:
  Content fades in (no slide)
  Duration: 200ms

MODAL:
  Open: slide up + scale (0.95 → 1.0)
  Close: slide down (+ fade)
  Duration: 300ms (open) / 200ms (close)

SESSION START (Home → Swipe):
  Home content: fade out + scale down
  Swipe content: slide up from bottom
  Duration: 350ms stagger
```

### Transition Rules

| Rule | Why |
|------|-----|
| Semua transisi <400ms | Mobile users expect speed |
| No layout shift during transition | Use absolute positioning or transform |
| Consistent direction per tab | Tab 1→2 = left, Tab 2→1 = right |
| Stagger children max 50ms apart | Group feels cohesive |
| No animation if reduced-motion | Accessibility |
| AnimatePresence for exit animations | Don't snap-remove elements |

---

## 34. Session Recovery Flow

### Scenario: App Backgrounded

```
USER SWITCHES APP (iOS/Android multitask)
    │
    ├── Immediate: save current state to Zustand persist
    │   ├── swipeStore → localStorage
    │   ├── battleStore → localStorage
    │   └── uiStore → localStorage
    │
    ├── After 2 min background:
    │   └── Show pause overlay if return:
    │       ├── "Sesi dijeda" overlay
    │       ├── [Lanjutkan] → resume
    │       └── [Selesai] → end session
    │
    └── After 10 min background:
        └── Auto-end session:
            ├── Save progress so far
            ├── Show session summary on return
            └── "Kamu offline selama #{t} menit. Sesi diakhiri."
```

### Scenario: Network Loss During Battle

```
BATTLE IN PROGRESS → NETWORK LOST
    │
    ├── Timer: pause (if currently counting)
    ├── Banner: "Koneksi terputus" (yellow, top)
    ├── Battle state: frozen (not lost)
    │
    ├── If reconnect within 30s:
    │   ├── Resume battle from same state
    │   ├── "Koneksi kembali!" banner (green, 2s)
    │   └── Timer resumes
    │
    └── If reconnect >30s:
        ├── Battle forfeited
        ├── Result: draw (no XP, no coins)
        ├── Mascot: "Koneksi bermasalah. Coba lagi ya!"
        └── Return to battle select
```

---

## 35. Mobile UX Optimization

### One-Hand Zone Design

```
PHONE HELD IN RIGHT HAND:
    │
    │   GREEN ZONE (thumb arc, easy)
    │   ├── Bottom navigation (all tabs)
    │   ├── Primary CTA buttons
    │   ├── Swipe card (center, gesture)
    │   ├── Battle options (A, B, C, D)
    │   └── Modal handle bar
    │
    │   YELLOW ZONE (reachable, stretch)
    │   ├── XP bar (top)
    │   ├── Streak indicator (top-right)
    │   ├── Mascot (top-right)
    │   └── Back button (top-left)
    │
    │   RED ZONE (hard to reach)
    │   ├── Top-left corner (minimize use)
    │   └── Settings icon (move to bottom-right if possible)
    │
    └── Design decisions:
        ├── All CTA buttons in bottom 1/3 of screen
        ├── All info in top 1/3 (glance)
        ├── Avoid top-left interactions for right-hand users
        └── Center is safe for all grips
```

### Friction Reduction Rules

| Rule | Implementation | Friction Removed |
|------|----------------|------------------|
| **Skip login for first session** | Guest mode | Registration barrier |
| **Auto-save progress** | Zustand persist | "Save" button anxiety |
| **One swipe = one action** | Card swipe | Multiple clicks |
| **No "Are you sure?" on non-destructive** | — | Confirmation dialogs |
| **Optimistic updates** | UI before server | Waiting for server |
| **Preload next content** | Next words prefetched | Loading screens |
| **Infinite scroll (not pagination)** | Feed, leaderboard | "Next page" taps |
| **Voice typing (future)** | — | Keyboard input |

### Keyboard Avoidance

- Input fields use `scroll-into-view` if near bottom
- Avoid placing critical CTA behind keyboard
- Use `inputmode` props for correct keyboard type
- Never require typing for core gameplay (only auth/search)

---

## 36. Accessibility Navigation Rules

### Screen Reader Navigation

```
USER TURNS ON SCREEN READER (VoiceOver / TalkBack)
    │
    ├── All interactive elements have:
    │   ├── aria-label (descriptive)
    │   ├── role (button, navigation, progressbar, etc.)
    │   └── aria-live (for dynamic updates)
    │
    ├── Focus order:
    │   │   1. Header (streak, XP)
    │   │   2. Primary CTA
    │   │   3. Content (card, battle, list)
    │   │   4. Secondary CTA
    │   │   5. Bottom navigation
    │   └── Logical top-to-bottom, not visual order
    │
    ├── Swipe card accessibility:
    │   ├── Swipe right = "Tahu" button (double-tap)
    │   ├── Swipe left = "Tidak tahu" button
    │   └── Card labeled: "Kata: kitab. Artinya buku"
    │
    ├── Battle accessibility:
    │   ├── Options are radio buttons
    │   ├── Timer announced: "10 detik tersisa"
    │   └── HP announced after each answer
    │
    └── Notifications:
        ├── Toast: aria-live="polite"
        └── Important: aria-live="assertive"
```

### Keyboard Navigation (Desktop)

```
TAB KEY:
  Home → CTA → Missions → Feed → Bottom Nav
  (skip decorative elements)

ENTER/SPACE:
  Activate focused element

ESC:
  Close modal / dismiss toast
  
ARROW KEYS:
  Swipe page: Left/Right = swipe
  Battle: Up/Down = navigate options, Enter = select
```

---

## 37. State Transition Map

### Global App States

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐
│  SPLASH   │────▶│  AUTH/       │────▶│  ONBOARDING  │
│  (1.5s)   │     │  LOGIN       │     │  (3 steps)   │
└──────────┘     └──────────────┘     └──────┬──────┘
                                             │
                    ┌────────────────────────┘
                    │
                    ▼
              ┌──────────┐
              │  HOME    │◀──────────────────────┐
              └────┬─────┘                       │
                   │                             │
          ┌────────┼────────┐                    │
          ▼        ▼        ▼                    │
     ┌────────┐┌────────┐┌────────┐              │
     │ SWIPE  ││ BATTLE ││PROGRESS│              │
     └───┬────┘└───┬────┘└────────┘              │
         │         │                             │
         ▼         ▼                             │
   ┌────────┐┌────────┐                          │
   │SESSION ││ ARENA  │                          │
   │SUMMARY ││ RESULT │                          │
   └────────┘└────────┘                          │
         │         │                             │
         └─────────┴─────────────────────────────┘
                    (back to home)
                    
ADDITIONAL STATES (accessible from any screen):
  ├── MODAL (reward, share, info)
  ├── SETTINGS (overlay)
  └── LOADING (temporary)
```

### State Persistence

| State | Storage | Duration | Restore On |
|-------|---------|----------|------------|
| Auth session | Zustand + Supabase | 7 days | Any page load |
| User profile | Zustand persist | Permanent | App open |
| Swipe session | Zustand persist | 30 min | App reopen |
| Battle state | Zustand persist | 5 min | App reopen |
| UI preferences | Zustand persist | Permanent | App open |
| Offline queue | localStorage | Until synced | Connected |
| Onboarding status | Zustand + localStorage | Until complete | App open |
| Streak data | Zustand + Supabase | Daily | First action |

---

## 38. Screen Priority Hierarchy

### Loading Priority

```
When a user navigates to a screen, load in this order:

HOME:
  1. Streak + XP (critical, always show first)
  2. Mascot (instant, local)
  3. Daily missions (important, fast fetch)
  4. Continue learning CTA (static)
  5. Friend activity (low priority, lazy load)

SWIPE:
  1. Next 10 words (critical, preloaded on home)
  2. Current card (instant, from cache)
  3. Next 2 cards (preload in background)
  4. Audio files (lazy load per card)

BATTLE:
  1. Enemy data + questions (critical)
  2. Battle arena UI (instant, local)
  3. Animations (loaded)
  
PROGRESS:
  1. Rank + XP data (critical)
  2. Stats (fast)
  3. Badges (medium)
  4. History (lazy, paginated)
```

### Visual Loading Strategy

```
IMMEDIATE (0-200ms):
  - Show skeleton
  - Show cached data (if any)

SOON (200-500ms):
  - Skeleton transitions to content
  - First paint of real data

LATER (500ms+):
  - Secondary content loads
  - Images/audio preloaded
  - Lazy sections populate
```

---

## 39. User Retention Hooks

### Retention Hooks in Flow

| Hook | Where | When | Mechanism |
|------|-------|------|-----------|
| **Streak fire** | Home header | Every visit | Visual fire + number + "Day X" |
| **XP bar** | Home header | Every visit | Progress toward next level |
| **Daily missions** | Home mid | Every visit | 3 cards with progress |
| **"Lanjut Belajar"** | Home CTA | Every visit | One tap to start |
| **Social proof** | Home bottom | Every visit | Friend activity feed |
| **Combo** | Swipe top-right | During session | "🔥 x5!" growing |
| **Session summary** | After swipe | End of session | XP earned + stats |
| **Battle result** | After battle | End of battle | Win/lose + rewards |
| **Rank progress** | Progress page | Periodic | XP to next rank |
| **Badge notification** | Any time | On unlock | "Badge baru!" |
| **Streak notification** | Push | Evening | "Ayo belajar!" |
| **Referral reward** | Profile | On friend join | "+100 XP!" |

### Dopamine Loop

```
TRIGGER → ACTION → REWARD → INVESTMENT → (repeat)
    │         │        │          │
    │         │        │          └── Streak, progress, friends
    │         │        │             (user has invested → will return)
    │         │        │
    │         │        └── Variable reward (XP, badge, combo)
    │         │            (surprise → more dopamine)
    │         │
    │         └── Swipe / Battle / Mission (easy action)
    │
    └── Notification / Streak / Social (external trigger)
```

---

## 40. Friction Reduction Strategy

### Friction Audit

| Friction Point | Current | Solution |
|----------------|---------|----------|
| **Registration** | Must create account | Guest mode + deferred reg |
| **Finding next lesson** | Navigate to correct screen | "Continue Learning" prominent on Home |
| **Loading time** | Fetch data | Preload next session on Home |
| **Understanding answer** | Transliteration not visible | Show card with reveal tap |
| **Combo not visible** | Hidden during swipe | Always visible top-right |
| **Too many choices** | Multiple menus | 4-tab bottom nav max |
| **Losing progress** | No auto-save | Zustand persist every action |
| **Slow battle** | Long animations | Animations < 300ms |
| **Can't skip** | Forced through animations | Skip button / tap to accelerate |
| **Forgot streak** | No reminder | Push notification at 19:00 |
| **Unclear progress** | Data not visible | Stats always on home |
| **Mascot annoying** | No toggle | Option to minimize in settings |

### Zero-Friction Rules

```
1. NO MORE THAN 1 TAP to start core action (swipe/battle)
2. NO MORE THAN 2 TAPS to reach any screen
3. NO REQUIRED TEXT INPUT for gameplay (only auth)
4. NO WAITING >500ms without skeleton
5. NO CONFIRMATION DIALOGS for non-destructive
6. NO REQUIRED UPDATE before playing
7. NO FULL SCREEN ADS (ever)
8. NO UNNECESSARY ANIMATIONS (>2s)
```

---

## Appendix

### A. Complete Navigation Map

```
                    ┌──────────────────┐
                    │                  │
                    │    SPLASH        │
                    │    (1.5s auto)   │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │                  │
                    │  ┌──────────┐    │
                    │  │  LOGIN   │    │
                    │  │  REGISTER│    │
                    │  │  GUEST   │    │
                    │  └──────────┘    │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │                  │
                    │   ONBOARDING     │
                    │   (3 steps)      │
                    │   ✓ Tujuan       │
                    │   ✓ Level        │
                    │   ✓ Target       │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │                  │
                    │  ┌── HOME ──┐    │
                    │  │ Streak   │    │
                    │  │ XP       │    │
                    │  │ CTA      │    │
                    │  │ Missions │    │
                    │  │ Activity │    │
                    │  └──────────┘    │
                    │                  │
                    │  ┌─ BATTLE ─┐    │
                    │  │ Select   │    │
                    │  │ Arena    │    │
                    │  │ Result   │    │
                    │  └──────────┘    │
                    │                  │
                    │  ┌─ PROGRESS ─┐  │
                    │  │ Rank      │   │
                    │  │ Stats     │   │
                    │  │ Badges    │   │
                    │  │ History   │   │
                    │  └───────────┘   │
                    │                  │
                    │  ┌─ PROFILE ─┐   │
                    │  │ Info      │   │
                    │  │ Settings  │   │
                    │  │ Referral  │   │
                    │  └───────────┘   │
                    │                  │
                    └──────────────────┘
```

### B. Session Types Comparison

| Attribute | Swipe Session | Battle Session | Audio Session |
|-----------|--------------|----------------|---------------|
| Duration | 2-5 min | 2-3 min | 0.5-2 min |
| Interaction | Swipe gesture | Tap options | Tap audio button |
| XP potential | 50-200 | 100-300 | 2-20 |
| Offline | ✅ Yes | ❌ No | ✅ If cached |
| Flow | Linear (cards) | Branching (correct/wrong) | Singular |
| Sound | Optional | Essential | Essential |
| Animation | Card + XP | Battle + HP + XP | Waveform |

### C. User Flow Decision Tree (Simplified)

```
USER OPENS APP
│
├── Has account?
│   ├── YES → Home
│   └── NO → Guest or Login
│
├── Home
│   ├── Tap "Lanjut Belajar" → Swipe Session → Summary → Home
│   ├── Tap "Battle" → Battle Select → Arena → Result → Home
│   ├── Tap Mission → Show detail → Navigate to relevant
│   └── Tap Friend Activity → Social page
│
├── Battle Tab
│   ├── Select difficulty → Arena → Result → Home/Battle
│   └── View history
│
├── Progress Tab
│   ├── View rank + stats
│   ├── View badges
│   └── View learning history
│
└── Profile Tab
    ├── View user info
    ├── Settings (toggle audio, dark mode, notifications)
    ├── Invite friends
    └── Logout
```

---

*This document defines the complete UX flow for Harf. Every screen, gesture, and transition is designed for maximum retention, minimal friction, and premium mobile feel.*  
*Harf — حرف*
