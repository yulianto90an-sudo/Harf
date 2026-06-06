# Frontend Architecture — Harf

**Version:** 1.0  
**Stack:** Next.js 14+ App Router · TypeScript · Tailwind CSS · Framer Motion · Zustand · Supabase  
**Device Focus:** Mobile-first (375px–430px)  

---

## 1. Frontend Architecture Overview

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  PUBLIC       │  │  APP LAYER   │  │  API LAYER            │   │
│  │  Routes       │  │  ├─ Root     │  │  ├─ Server Actions    │   │
│  │  ├─ landing   │  │  ├─ (auth)   │  │  ├─ API Routes       │   │
│  │  ├─ auth      │  │  ├─ (main)   │  │  └─ Supabase SSR     │   │
│  │  └─ static    │  │  └─ error    │  │                       │   │
│  └──────────────┘  └──────┬───────┘  └──────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼──────────────────────────────────┐  │
│  │                    COMPONENT LAYER                          │  │
│  │  ┌──────────┐ ┌──────────────┐ ┌────────────────────┐     │  │
│  │  │  Shared  │ │  Feature     │ │  Layout             │     │  │
│  │  │  UI Kit  │ │  Components  │ │  Components         │     │  │
│  │  └──────────┘ └──────────────┘ └────────────────────┘     │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼──────────────────────────────────┐  │
│  │                    STATE LAYER (Zustand)                     │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │  │
│  │  │ Auth │ │Swipe │ │Battle│ │ UI   │ │Audio │ │ XP   │   │  │
│  │  │Store │ │Store │ │Store │ │Store │ │Store │ │Store │   │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │  │
│  └─────────────────────────┬──────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼──────────────────────────────────┐  │
│  │                    SERVICE LAYER                             │  │
│  │  ┌──────────┐ ┌──────────────┐ ┌────────────────────┐     │  │
│  │  │Supabase  │ │  Audio       │ │  Analytics          │     │  │
│  │  │Client    │ │  Service     │ │  Service            │     │  │
│  │  └──────────┘ └──────────────┘ └────────────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Dependency Direction |
|-------|---------------|---------------------|
| **App Router** | Routing, layouts, data fetching, SSR | → Components |
| **Components** | Rendering UI, handling events, composing | → Stores, Services |
| **Stores (Zustand)** | State management, persistence, logic | → Services |
| **Services** | API calls, audio, analytics, external | → No internal deps |
| **Animations** | Framer Motion presets, wrappers | → Components |
| **Utils** | Shared helpers, constants, types | → No internal deps |

### Dependency Rules

```
1. A feature component can import: UI kit, hooks, stores, services, utils
2. A UI kit component can import: only utils, constants, types
3. A store can import: services, utils
4. A service can import: only utils, types
5. NEVER import a store from a service (circular dependency)
6. NEVER import a feature component from the UI kit
7. ALWAYS import from barrel files (index.ts)
```

---

## 2. Design Principles

### Frontend Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Mobile-first** | Every component starts at 375px viewport |
| 2 | **Optimistic UI** | Update UI immediately, confirm with server |
| 3 | **Skeleton-first** | Every data-dependent view has a skeleton state |
| 4 | **100ms rule** | Responses under 100ms feel instant |
| 5 | **Progressive enhancement** | Works without JS, better with it |
| 6 | **Immutable props** | Never mutate props directly |
| 7 | **Single source of truth** | Data lives in one place (Zustand or server) |
| 8 | **Composable > Inheritable** | Composition over inheritance |
| 9 | **Co-location** | Place code closest to where it's used |
| 10 | **Zero-warnings** | Strict TypeScript, no `any` |

### Anti-Patterns to Avoid

```
❌ Prop drilling through 5+ levels (use store instead)
❌ Giant components >300 lines (split into sub-components)
❌ `useEffect` for data fetching (use React Query / Server Components)
❌ Inline styles (use Tailwind utility classes)
❌ Magic numbers (use design tokens)
❌ Duplicated state (single source of truth)
❌ Mutating store outside actions
❌ Heavy computation in render (memoize or compute in store)
```

---

## 3. App Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (providers, fonts, global styles)
│   ├── page.tsx            # Home page (/) — Tab 1
│   ├── loading.tsx         # Home loading skeleton
│   ├── error.tsx           # Global error boundary
│   ├── not-found.tsx       # 404 page
│   │
│   ├── (auth)/             # Auth route group (no bottom nav)
│   │   ├── layout.tsx      # Auth layout (centered form, logo)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── page.tsx    # OAuth callback
│   │
│   ├── (main)/             # Main app route group (with bottom nav)
│   │   ├── layout.tsx      # App shell: TopBar + BottomNav + Content
│   │   ├── page.tsx        # Home (redirect from (main)/)
│   │   │
│   │   ├── swipe/
│   │   │   └── page.tsx    # Swipe learning session
│   │   │
│   │   ├── battle/
│   │   │   ├── page.tsx    # Battle selection
│   │   │   └── [id]/
│   │   │       └── page.tsx # Battle arena (dynamic)
│   │   │
│   │   ├── progress/
│   │   │   └── page.tsx    # Progress, stats, badges
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx    # User profile
│   │   │   └── settings/
│   │   │       └── page.tsx # Settings
│   │   │
│   │   └── social/
│   │       └── page.tsx    # Leaderboard, friends
│   │
│   └── api/                # API routes (if needed)
│       └── .../
│
├── components/             # All components
│   ├── ui/                 # Shared UI kit (button, card, modal, etc.)
│   ├── layout/             # Layout components (BottomNav, TopBar, Shell)
│   ├── shared/             # Shared non-UI components (Mascot, ShareCard)
│   ├── swipe/              # Swipe feature components
│   ├── battle/             # Battle feature components
│   ├── home/               # Home page components
│   ├── progress/           # Progress page components
│   ├── social/             # Social page components
│   ├── auth/               # Auth page components
│   └── animations/         # Animation wrappers (AnimatedCard, FadeIn, etc.)
│
├── stores/                 # Zustand stores
│   ├── authStore.ts
│   ├── swipeStore.ts
│   ├── battleStore.ts
│   ├── profileStore.ts
│   ├── uiStore.ts
│   ├── audioStore.ts
│   └── notificationStore.ts
│
├── hooks/                  # Custom React hooks
│   ├── useSwipe.ts         # Swipe gesture hook
│   ├── useStreak.ts        # Streak calculation
│   ├── useBattle.ts        # Battle state machine
│   ├── useAudio.ts         # Audio playback
│   ├── useXP.ts            # XP feedback
│   ├── useKeyboard.ts      # Keyboard accessibility
│   └── useNetwork.ts       # Network status
│
├── services/               # External service integrations
│   ├── supabase/
│   │   ├── client.ts       # Supabase browser client
│   │   ├── server.ts       # Supabase server client
│   │   ├── auth.ts         # Auth functions
│   │   ├── profile.ts      # Profile queries
│   │   ├── vocabulary.ts   # Vocabulary queries
│   │   ├── battle.ts       # Battle queries
│   │   └── leaderboard.ts  # Leaderboard queries
│   │
│   ├── audio.ts            # Audio playback service
│   └── analytics.ts        # Analytics service
│
├── animations/             # Framer Motion configs and presets
│   ├── presets.ts          # Spring and tween presets
│   ├── variants.ts         # Animation variant objects
│   ├── transitions.ts      # Page transition configs
│   └── keyframes.ts        # CSS keyframes
│
├── styles/                 # Global styles
│   └── globals.css         # Tailwind base, custom utilities, fonts
│
├── types/                  # TypeScript type definitions
│   ├── database.ts         # Supabase-generated types
│   ├── game.ts             # Game-specific types
│   ├── ui.ts               # UI component types
│   └── api.ts              # API response types
│
├── constants/              # App constants
│   ├── game.ts             # XP formulas, ranks, battle config
│   ├── theme.ts            # Color palette, spacing tokens
│   ├── animation.ts        # Animation durations, spring configs
│   └── routes.ts           # Route paths, tab config
│
├── utils/                  # Utility functions
│   ├── cn.ts               # Tailwind class merge
│   ├── format.ts           # Number formatting (XP, time)
│   ├── share.ts            # Share card generation
│   ├── storage.ts          # localStorage helpers
│   └── validation.ts       # Form validation
│
└── middleware.ts            # Next.js middleware (auth protection)
```

---

## 4. Routing Architecture

### Route Map

```
/                    → Home (Tab 1)
/auth/login          → Login page
/auth/register       → Register page
/auth/callback       → OAuth callback
/swipe               → Swipe session (immersive, no bottom nav)
/battle              → Battle selection (Tab 2)
/battle/[id]         → Battle arena (immersive)
/progress            → Progress page (Tab 3)
/profile             → Profile page (Tab 4)
/profile/settings    → Settings (overlay)
/social              → Social / leaderboard
```

### Route Groups

```
(app)         → With bottom nav → (main)/
(auth)        → Without bottom nav → (auth)/
              → Centered layout, logo header

(immersive)   → Without bottom nav, full screen
              → Swipe session, battle arena
              → Hidden nav, gesture-based back
```

### Middleware

```typescript
// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  const isOnboardingRoute = req.nextUrl.pathname.startsWith('/onboarding');
  const isPublicRoute = req.nextUrl.pathname === '/';

  // Allow public access to home (landing) and auth routes
  if (isPublicRoute && !session) return res;
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (!session && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|audio|assets).*)'],
};
```

---

## 5. Layout Architecture

### Layout Hierarchy

```
RootLayout (html, body, providers)
  │
  ├── AuthLayout (centered, logo, no nav)
  │   └── Login | Register | Callback
  │
  └── MainLayout (app shell)
      ├── TopBar (streak, XP, mascot)
      ├── Content (page content with AnimatePresence)
      └── BottomNav (4 tabs, fixed)
           │
           ├── Home
           ├── Battle | Battle Arena (no nav)
           ├── Progress
           └── Profile | Settings (slide-in)
```

### Root Layout

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans bg-bg-primary text-text-primary antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
```

### Providers Component

```typescript
// src/components/providers.tsx
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
```

### Main Layout (App Shell)

```typescript
// src/app/(main)/layout.tsx
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh max-w-app mx-auto relative">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}
```

---

## 6. Component Architecture

### Component Types

```
┌─────────────────────────────────────────────────────────┐
│  COMPONENT HIERARCHY                                     │
│                                                          │
│  Page Components (app/page.tsx)                          │
│      │  ← Composition                                     │
│      ▼                                                    │
│  Feature Components (home/StreakIndicator.tsx)           │
│      │  ← Composition                                     │
│      ▼                                                    │
│  Shared UI Components (ui/Button.tsx)                    │
│      │  ← Composition                                     │
│      ▼                                                    │
│  Base Elements (HTML + Tailwind)                         │
└─────────────────────────────────────────────────────────┘
```

### Component Categories

| Category | Location | Importable By | Examples |
|----------|----------|---------------|----------|
| **Page** | `app/**/page.tsx` | App router only | HomePage, SwipePage |
| **Feature** | `components/{feature}/` | Pages, other feature components | StreakIndicator, BattleArena |
| **Shared UI** | `components/ui/` | Any component | Button, Card, Modal, ProgressBar |
| **Layout** | `components/layout/` | App layouts | BottomNav, TopBar, AppShell |
| **Animation** | `components/animations/` | Any component | AnimateIn, SlideUp, FadeIn |
| **Shared** | `components/shared/` | Any component | Mascot, ShareCard, ParticleEffect |

### Component Template

```typescript
// components/feature/ComponentName.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useStore } from '@/stores/exampleStore';
import { springPresets } from '@/animations/presets';

interface ComponentNameProps {
  label: string;
  variant?: 'default' | 'primary';
  isDisabled?: boolean;
  onAction?: () => void;
  className?: string;
}

export function ComponentName({
  label,
  variant = 'default',
  isDisabled = false,
  onAction,
  className,
}: ComponentNameProps) {
  return (
    <motion.button
      className={cn(
        'rounded-button px-4 py-3 text-label font-semibold',
        variant === 'primary' && 'bg-emerald-500 text-text-primary',
        variant === 'default' && 'bg-white/5 text-text-primary border border-white/10',
        isDisabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
      onClick={onAction}
      disabled={isDisabled}
      whileTap={{ scale: 0.95 }}
      transition={springPresets.snappy}
    >
      {label}
    </motion.button>
  );
}
```

---

## 7. Shared UI System

### UI Kit Components

| Component | Props | States |
|-----------|-------|--------|
| `Button` | variant, size, icon, loading, disabled, fullWidth | default, hover, active, disabled, loading |
| `Card` | variant, padding, isPressable, isGlowing | default, elevated, compact, pressable |
| `Modal` | open, onClose, variant, title | open, closed, entering, exiting |
| `BottomNav` | activeTab, onTabChange | active, inactive, disabled |
| `ProgressBar` | value, max, variant, animated | empty, partial, full, animated |
| `Avatar` | src, size, badge, isOnline | default, loading, error |
| `Badge` | label, variant, icon, isNew | default, locked, new, earned |
| `Toast` | message, type, duration, action | entering, visible, exiting |
| `Skeleton` | width, height, variant, count | pulse, shimmer |
| `Tooltip` | content, position | visible, hidden |
| `Icon` | name, size, color | default, disabled |
| `Mascot` | expression, size, animate, onClick | idle, happy, sad, excited |
| `FloatingXP` | amount, type, position | entering, floating, exiting |
| `ComboIndicator` | combo, maxCombo | idle, increasing, max, broken |
| `HpBar` | current, max, variant | safe, danger, critical, healing, damaged |
| `AnimatedCounter` | value, duration, prefix, suffix | counting, complete |

### Component Export Pattern

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
export { ProgressBar } from './ProgressBar';
export { Toast } from './Toast';
// ... etc

// Usage: import { Button, Card } from '@/components/ui';
```

---

## 8. Feature Module Structure

### Feature Module Pattern

Each feature follows the same structure:

```
components/{feature}/
├── index.ts                    # Public exports
├── FeatureName.tsx             # Main component
├── FeatureName.test.tsx        # Tests
├── components/                 # Sub-components (private to feature)
│   ├── SubComponentA.tsx
│   └── SubComponentB.tsx
└── utils.ts                    # Feature-specific utilities (optional)
```

### Feature Modules

| Module | Main Component | Sub-Components | Store |
|--------|----------------|----------------|-------|
| **home** | `HomePage` | `StreakIndicator`, `XPBar`, `DailyMissionCard`, `MascotReaction`, `QuickActions` | `profileStore` |
| **swipe** | `SwipePage` | `SwipeCard`, `SwipeStack`, `ComboIndicator`, `AudioButton`, `SessionProgress` | `swipeStore` |
| **battle** | `BattlePage` | `BattleSelect`, `BattleArena`, `HpBar`, `EnemySprite`, `QuestionCard`, `AnswerOptions`, `BattleResult` | `battleStore` |
| **progress** | `ProgressPage` | `RankDisplay`, `StatsGrid`, `BadgeGrid`, `LearningHistory` | `profileStore` |
| **social** | `SocialPage` | `LeaderboardTable`, `FriendActivity`, `InviteCard`, `FriendList` | — |
| **profile** | `ProfilePage` | `ProfileCard`, `SettingsPanel`, `ReferralCard`, `ShowcaseBadges` | `authStore` |
| **auth** | `LoginPage` | `LoginForm`, `OAuthButtons`, `GuestPrompt` | `authStore` |

---

## 9. State Management Strategy

### State Categories

| Category | Location | Persistence | Examples |
|----------|----------|-------------|----------|
| **Server State** | Supabase / Server | Database | XP, rank, vocabulary, badges |
| **Client State** | Zustand | localStorage (partial) | UI theme, current tab |
| **Session State** | Zustand | sessionStorage | Swipe session, battle state |
| **URL State** | Next.js Router | URL | Tab index, battle ID |
| **Form State** | Local `useState` | None | Login form, search |

### State Management Decision Tree

```
Q: Does this data come from the server?
│
├── YES → Q: Is it needed across multiple components?
│   │   ├── YES → Zustand store (with sync to Supabase)
│   │   └── NO  → React Query / Server Component
│
└── NO → Q: Is it needed across multiple components?
    │   ├── YES → Zustand store
    │   └── NO  → useState / useRef
```

### Own vs External State

```
OWN STATE (Zustand):
  - Current swipe session (index, combo, XP)
  - Current battle (HP, question index, timer)
  - UI preferences (sound on/off, dark mode)
  - Auth state (user, session)

EXTERNAL STATE (Supabase / Server):
  - User profile (XP, rank, streak)
  - Vocabulary data
  - Leaderboard
  - Friend list
  - Badges

BRIDGE (Zustand + Sync):
  - Daily mission progress (sync on action)
  - Streak (sync on first action of day)
  - XP (sync via RPC on earn)
```

---

## 10. Zustand Store Architecture

### Store Template

```typescript
// stores/exampleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExampleState {
  // State
  count: number;
  isLoading: boolean;
  error: string | null;

  // Computed (getters)
  getDouble: () => number;

  // Actions
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set, get) => ({
      // Initial state
      count: 0,
      isLoading: false,
      error: null,

      // Computed
      getDouble: () => get().count * 2,

      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'harf-example-store',
      partialize: (state) => ({ count: state.count }), // Only persist count
    },
  ),
);
```

### Store Inventory

```typescript
// ─── AUTH STORE ──────────────────────────────────────────────
// Persisted: true (session)
// Sync: Supabase Auth
interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

// ─── SWIPE STORE ─────────────────────────────────────────────
// Persisted: true (sessionStorage) — recover on crash
interface SwipeState {
  // Session
  sessionId: string | null;
  words: Word[];
  currentIndex: number;
  isSessionActive: boolean;
  startedAt: number | null;

  // Progress
  combo: number;
  maxCombo: number;
  sessionXP: number;
  correctCount: number;
  incorrectCount: number;
  revealCount: number;

  // Status
  isComplete: boolean;

  // Actions
  startSession: (words: Word[]) => void;
  swipeCard: (direction: 'left' | 'right') => SwipeResult;
  revealCard: () => void;
  nextCard: () => void;
  endSession: () => SessionSummary;
  resetSession: () => void;
}

// ─── BATTLE STORE ────────────────────────────────────────────
// Persisted: true (sessionStorage) — recover on crash/interrupt
interface BattleState {
  // Battle state
  status: 'idle' | 'loading' | 'intro' | 'active' | 'victory' | 'defeat';
  enemy: Enemy | null;
  questions: Question[];
  currentQuestionIndex: number;

  // Combat
  playerHp: number;
  enemyHp: number;
  combo: number;
  correctCount: number;
  wrongCount: number;

  // Timer
  timeRemaining: number;
  isTimerRunning: boolean;

  // Result
  xpEarned: number;
  coinsEarned: number;

  // Actions
  startBattle: (enemyType: string) => Promise<void>;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
  tickTimer: () => void;
  endBattle: () => void;
  reset: () => void;
}

// ─── PROFILE STORE ───────────────────────────────────────────
// Persisted: true (localStorage)
// Sync: Supabase on change
interface ProfileState {
  profile: Profile | null;
  rank: Rank | null;
  badges: UserBadge[];
  isLoading: boolean;

  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  addXP: (amount: number) => void;
  refreshBadges: () => Promise<void>;
}

// ─── UI STORE ────────────────────────────────────────────────
// Persisted: true (localStorage)
interface UIState {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  activeTab: number;
  isMascotMinimized: boolean;

  currentToast: Toast | null;
  currentModal: ModalConfig | null;

  setTheme: (theme: 'dark' | 'light') => void;
  setActiveTab: (tab: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  showToast: (toast: Toast) => void;
  dismissToast: () => void;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

// ─── AUDIO STORE ─────────────────────────────────────────────
// Persisted: false (in-memory)
interface AudioState {
  isPlaying: boolean;
  currentWordId: string | null;
  queue: AudioQueueItem[];
  volume: number;
  speed: 'normal' | 'slow' | 'very_slow';

  play: (wordId: string) => Promise<void>;
  stop: () => void;
  setSpeed: (speed: AudioState['speed']) => void;
  setVolume: (volume: number) => void;
}

// ─── NOTIFICATION STORE ──────────────────────────────────────
// Persisted: false (fetched from server)
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}
```

### Store Consumption Rules

```typescript
// ✅ GOOD: Select only what you need
const xp = useProfileStore((s) => s.profile?.xp);
const addXP = useProfileStore((s) => s.addXP);

// ❌ BAD: Subscribing to entire store (re-renders on any change)
const profile = useProfileStore();

// ✅ GOOD: Colocate selectors
const streak = useProfileStore((s) => s.profile?.currentStreak);
const isStreakDanger = streak !== undefined && streak === 0;

// ✅ GOOD: Use shallow comparison for objects
const { xp, level } = useProfileStore(
  (s) => ({ xp: s.profile?.xp, level: s.profile?.level }),
  shallow,
);
```

---

## 11. API Client Structure

### Service Layer Pattern

```typescript
// services/supabase/vocabulary.ts
import { supabase } from './client';
import type { Word } from '@/types/game';

export const vocabularyService = {
  async getDueWords(userId: string, limit = 15): Promise<Word[]> {
    const { data, error } = await supabase
      .rpc('get_due_words', {
        p_user_id: userId,
        p_limit: limit,
      });

    if (error) throw error;
    return data;
  },

  async submitSwipeResult(
    userId: string,
    wordId: string,
    action: 'swipe_right' | 'swipe_left' | 'reveal',
    combo: number,
    xpEarned: number,
  ): Promise<void> {
    const { error } = await supabase
      .rpc('record_swipe', {
        p_user_id: userId,
        p_word_id: wordId,
        p_action: action,
        p_combo: combo,
        p_xp_earned: xpEarned,
      });

    if (error) throw error;
  },
};
```

### Service Organization

```
services/
├── supabase/
│   ├── client.ts           # Supabase browser client (singleton)
│   ├── server.ts           # Supabase server client (cookies)
│   ├── auth.ts             # login, register, logout, OAuth
│   ├── profile.ts          # getProfile, updateProfile, getStats
│   ├── vocabulary.ts       # getDueWords, submitSwipe, getWord
│   ├── battle.ts           # startBattle, submitAnswer, getHistory
│   ├── leaderboard.ts      # getWeekly, getFriends
│   ├── missions.ts         # getDailyMissions, claimReward
│   ├── badges.ts           # getBadges, getUserBadges
│   └── notifications.ts    # getNotifications, markRead
│
├── audio.ts                # AudioService (play, stop, preload)
└── analytics.ts            # AnalyticsService (track event)
```

### Service Factory Pattern

```typescript
// services/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

---

## 12. Supabase Integration

### Client vs Server

```typescript
// Browser client (singleton) — for client components
// services/supabase/client.ts
export const supabase = createBrowserClient(url, key);

// Server client (per-request) — for server components / API routes
// services/supabase/server.ts
export const createServerSupabaseClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};
```

### Realtime Subscriptions

```typescript
// hooks/useLeaderboardRealtime.ts
export function useLeaderboardRealtime(weekStart: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard_weekly',
          filter: `week_start=eq.${weekStart}`,
        },
        () => {
          // Refetch leaderboard
          fetchLeaderboard(weekStart).then(setLeaderboard);
        },
      )
      .subscribe();

    // Initial fetch
    fetchLeaderboard(weekStart).then(setLeaderboard);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weekStart]);

  return leaderboard;
}
```

---

## 13. Authentication Flow

### Auth Provider

```typescript
// components/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, setSession, setIsLoading } = useAuthStore();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
```

### Protecting Client Routes

```typescript
// Middleware handles server-side protection.
// Client-side: check auth store.

// In any page component:
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
if (!isAuthenticated) {
  redirect('/auth/login');
}
```

---

## 14. Animation System

### Architecture Overview

```
animations/
├── presets.ts          # Spring/tween configuration objects
├── variants.ts         # Reusable Framer Motion variant objects
├── transitions.ts      # Page and screen transition configs
└── keyframes.css       # CSS @keyframes for simple animations

components/animations/  # Reusable animation wrapper components
├── AnimateIn.tsx       # Generic fade/slide/scale wrapper
├── SlideUp.tsx         # Slide up on mount
├── FadeIn.tsx          # Fade in on mount
├── StaggerChildren.tsx # Stagger child animations
├── ScaleOnPress.tsx    # Scale down on press
├── XPFloat.tsx         # XP floating number animation
├── ComboPulse.tsx      # Combo counter pulse
├── ShakeOnError.tsx    # Shake animation for errors
└── StreakFire.tsx      # Streak fire particle loop
```

### Animation Presets

```typescript
// animations/presets.ts
export const springPresets = {
  snappy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 0.5,
  },
  bouncy: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 15,
    mass: 0.5,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 20,
    mass: 1,
  },
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
  wobbly: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 10,
    mass: 1,
  },
};

export const tweenPresets = {
  fast: { duration: 0.15, ease: 'easeOut' as const },
  normal: { duration: 0.25, ease: 'easeOut' as const },
  slow: { duration: 0.4, ease: 'easeOut' as const },
  expressive: {
    duration: 0.6,
    ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
};
```

### Animation Variants

```typescript
// animations/variants.ts
export const cardVariants = {
  initial: { scale: 0.9, y: 50, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  swipeRight: { x: 400, rotate: 15, opacity: 0 },
  swipeLeft: { x: -400, rotate: -15, opacity: 0 },
};

export const xpFloatVariants = {
  initial: { y: 0, opacity: 1, scale: 0.5 },
  animate: { y: -60, opacity: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const modalVariants = {
  initial: { y: 100, opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: 100, opacity: 0, scale: 0.95 },
};

export const staggerVariants = {
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
```

### Animation Wrapper Components

```typescript
// components/animations/AnimateIn.tsx
'use client';

import { motion } from 'framer-motion';
import { fadeSlideUp } from '@/animations/variants';

interface AnimateInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimateIn({ children, delay = 0, className }: AnimateInProps) {
  return (
    <motion.div
      variants={fadeSlideUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

## 15. Motion Architecture

### Motion Component Inventory

| Component | Motion Type | Duration | Trigger | Notes |
|-----------|-------------|----------|---------|-------|
| `SwipeCard` | Drag (x-axis) | Real-time + 300ms snap | User drag | Pan gesture, spring snap |
| `AnswerOption` | Scale + color | 100ms | Tap | scale: 0.95 on press |
| `BattleHit` | Screen shake | 200ms | Correct answer | translateX oscillation |
| `XP Float` | TranslateY + fade | 800ms | XP earned | Multiple simultaneous |
| `Combo Counter` | Scale bounce | 300ms | Combo increase | 1 → 1.3 → 1 |
| `Level Up` | Staggered burst | 1500ms | Level threshold | Multiple elements |
| `Page Transition` | Slide X | 250ms | Tab switch | Direction depends on tab |
| `Modal` | Slide up + scale | 300ms | Open/close | Drag to dismiss |
| `Mascot` | Float (idle) + bounce (react) | 3s loop / 400ms | Timer / trigger | CSS + Framer |
| `Toast` | Slide down + fade | 250ms in / 200ms out | Show/dismiss | Auto-dismiss 3s |
| `ProgressBar` | Width transition | 400ms | Value change | CSS transition |
| `StreakFire` | Scale + opacity pulse | 2s loop | Streak active | CSS animation |

### Frame Budget

```
Mobile animation budget per frame: 16ms (60fps)

Priority:
  1. Card swipe (drag) → must be 60fps
  2. Button press → must be 60fps
  3. XP float → can drop to 30fps
  4. Particle effects → can drop to 30fps
  5. Background animations → can drop to 24fps

Strategies:
  - Use transform/opacity only (GPU-composited)
  - will-change: transform on swipe cards
  - Reduce particle count on low-end devices
  - Respect prefers-reduced-motion
```

---

## 16. Mobile Interaction System

### Touch Handling Architecture

```
User Touch → TouchEvent → Gesture Detector → Action → Animation → Feedback
                │               │               │          │
                ▼               ▼               ▼          ▼
          touchstart/     useSwipe        Zustand      Framer Motion
          touchmove/      hook            store        + haptic viz
          touchend
```

### Safe Area Handling

```typescript
// constants/safearea.ts
export const safeArea = {
  top: 'env(safe-area-inset-top, 0px)',
  bottom: 'env(safe-area-inset-bottom, 0px)',
  left: 'env(safe-area-inset-left, 0px)',
  right: 'env(safe-area-inset-right, 0px)',
};

// Usage in Tailwind:
// pb-[env(safe-area-inset-bottom)]
// pt-[env(safe-area-inset-top)]
```

### Viewport Configuration

```html
<!-- In layout.tsx head -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### Preventing Scroll Conflicts

```typescript
// Prevent pull-to-refresh on swipe page
// Prevent default touchmove on card area during swipe

// In SwipePage:
useEffect(() => {
  const preventScroll = (e: TouchEvent) => {
    if (/* card is being dragged */) {
      e.preventDefault();
    }
  };
  document.addEventListener('touchmove', preventScroll, { passive: false });
  return () => document.removeEventListener('touchmove', preventScroll);
}, []);
```

---

## 17. Gesture System

### Swipe Gesture Hook

```typescript
// hooks/useSwipe.ts
import { useState, useCallback, useRef } from 'react';

interface SwipeConfig {
  threshold?: number;    // 30% of card width
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeCancel?: () => void;
}

interface SwipeState {
  isDragging: boolean;
  startX: number;
  currentX: number;
  offsetX: number;
  rotation: number;
  opacity: number;
  direction: 'left' | 'right' | null;
}

export function useSwipe(config: SwipeConfig) {
  const { threshold = 0.3, onSwipeLeft, onSwipeRight, onSwipeCancel } = config;
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    offsetX: 0,
    rotation: 0,
    opacity: 1,
    direction: null,
  });

  const handleStart = useCallback((x: number) => {
    setState((prev) => ({
      ...prev,
      isDragging: true,
      startX: x,
      currentX: x,
    }));
  }, []);

  const handleMove = useCallback((x: number) => {
    setState((prev) => {
      if (!prev.isDragging) return prev;
      const offsetX = x - prev.startX;
      const cardWidth = cardRef.current?.offsetWidth ?? 300;
      const rotation = Math.max(-15, Math.min(15, offsetX / cardWidth * 15));
      const direction = offsetX > 0 ? 'right' : 'left';
      const progress = Math.abs(offsetX) / (cardWidth * threshold);

      return {
        ...prev,
        currentX: x,
        offsetX,
        rotation,
        direction,
        opacity: 1 - Math.min(progress * 0.3, 0.3),
      };
    });
  }, [threshold]);

  const handleEnd = useCallback(() => {
    setState((prev) => {
      const cardWidth = cardRef.current?.offsetWidth ?? 300;
      const thresholdPx = cardWidth * threshold;

      if (Math.abs(prev.offsetX) > thresholdPx) {
        if (prev.offsetX > 0) {
          onSwipeRight?.();
          return { ...prev, isDragging: false, offsetX: 800 }; // animate out
        } else {
          onSwipeLeft?.();
          return { ...prev, isDragging: false, offsetX: -800 }; // animate out
        }
      } else {
        onSwipeCancel?.();
        return {
          ...prev, isDragging: false, offsetX: 0,
          rotation: 0, opacity: 1, direction: null,
        };
      }
    });
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeCancel]);

  const swipeBind = {
    onMouseDown: (e: React.MouseEvent) => handleStart(e.clientX),
    onMouseMove: (e: React.MouseEvent) => handleMove(e.clientX),
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: (e: React.TouchEvent) => handleStart(e.touches[0].clientX),
    onTouchMove: (e: React.TouchEvent) => handleMove(e.touches[0].clientX),
    onTouchEnd: handleEnd,
  };

  return { swipeBind, cardRef, swipeState: state };
}
```

### Gesture Priority

```
Swipe Page:
  1. Horizontal swipe (card) — primary
  2. Vertical scroll (disabled during swipe)
  3. Tap (audio button, reveal)

Home Page:
  1. Vertical scroll (feed)
  2. Tap (CTA, missions)
  3. Horizontal scroll (mission cards)

Battle Page:
  1. Tap (answer options) — primary
  2. Vertical scroll (disabled during battle)
```

---

## 18. Navigation System

### Tab Navigation

```typescript
// constants/routes.ts
export const TABS = [
  { id: 0, label: 'Beranda', href: '/', icon: 'home' },
  { id: 1, label: 'Battle', href: '/battle', icon: 'battle' },
  { id: 2, label: 'Progress', href: '/progress', icon: 'progress' },
  { id: 3, label: 'Profil', href: '/profile', icon: 'profile' },
] as const;

// BottomNav uses router.push with shallow routing
// Tab state synced with URL via usePathname

// During immersive modes (swipe, battle):
// Bottom nav is hidden, back is via gesture/button
```

### Navigation Events

```typescript
// When tab changes:
// 1. Update activeTab in uiStore
// 2. If current page has active session → pause, save state
// 3. Animate page transition (slide left/right)
// 4. New page preloads data (if not cached)

// Tab switch animation direction:
// newTab > oldTab = slide left
// newTab < oldTab = slide right
```

---

## 19. Error Boundary Strategy

### Error Boundary Architecture

```
┌─────────────────────────────────────────┐
│  RootErrorBoundary (app/error.tsx)      │
│  ┌───────────────────────────────────┐  │
│  │  FeatureErrorBoundary             │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  ComponentErrorBoundary     │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Error Boundary Implementation

```typescript
// components/shared/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
    // Log to error tracking service
    console.error('ErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-4xl mb-4">😅</div>
            <h2 className="text-heading-1 mb-2">Yah, ada error!</h2>
            <p className="text-text-secondary mb-6">Coba refresh halaman ini.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-emerald-500 text-text-primary px-6 py-3 rounded-button"
            >
              🔄 Coba Lagi
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

---

## 20. Loading State Architecture

### Loading State Types

```typescript
// constants/loading.ts
export const LOADING_STRATEGY = {
  // Immediate (< 300ms): no skeleton, just inline state change
  button: 'inline',

  // Quick (300ms - 1s): small skeleton placeholder
  card: 'skeleton',

  // Medium (1s - 3s): full skeleton with text
  page: 'page-skeleton',

  // Slow (> 3s): skeleton + loading tip
  slow: 'skeleton-with-tip',
} as const;
```

### Page Loading Pattern

```typescript
// app/(main)/loading.tsx — Auto-used by Next.js for route loading
export default function PageLoading() {
  return (
    <div className="space-y-4 animate-pulse p-4">
      {/* Skeleton for the page */}
      <div className="h-12 bg-bg-elevated rounded-card w-2/3" />
      <div className="h-32 bg-bg-elevated rounded-card" />
      <div className="space-y-3">
        <div className="h-20 bg-bg-elevated rounded-card" />
        <div className="h-20 bg-bg-elevated rounded-card" />
        <div className="h-20 bg-bg-elevated rounded-card" />
      </div>
    </div>
  );
}
```

### Component Loading Pattern

```typescript
// In feature components:
function StreakIndicator() {
  const profile = useProfileStore((s) => s.profile);
  const isLoading = useProfileStore((s) => s.isLoading);

  if (isLoading) {
    return <div className="h-16 bg-bg-elevated rounded-card animate-pulse" />;
  }

  if (!profile) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl">🔥</span>
      <span className="text-display-2">{profile.currentStreak}</span>
    </div>
  );
}
```

---

## 21. Offline Support Architecture

### Offline Detection

```typescript
// hooks/useNetwork.ts
import { useState, useEffect } from 'react';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
```

### Offline Queue

```typescript
// services/offline-queue.ts
interface QueueItem {
  id: string;
  action: 'insert' | 'update';
  table: string;
  data: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
}

const STORAGE_KEY = 'harf-offline-queue';

export const offlineQueue = {
  add(item: Omit<QueueItem, 'id' | 'timestamp' | 'retryCount'>) {
    const queue = this.getAll();
    queue.push({
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  },

  getAll(): QueueItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  },

  remove(id: string) {
    const queue = this.getAll().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  },

  async processQueue() {
    const queue = this.getAll();
    for (const item of queue) {
      try {
        await this.processItem(item);
        this.remove(item.id);
      } catch {
        item.retryCount++;
        if (item.retryCount >= 3) {
          this.remove(item.id); // Drop after 3 retries
        } else {
          // Update retry count
          const all = this.getAll();
          const idx = all.findIndex((i) => i.id === item.id);
          if (idx >= 0) all[idx].retryCount = item.retryCount;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        }
      }
    }
  },

  async processItem(item: QueueItem) {
    // Route to appropriate service based on table
    // ...
  },
};
```

### Service Worker Strategy

```typescript
// public/sw.js (simplified)
// Cache vocabulary data, audio files, static assets

const CACHE_NAME = 'harf-v1';
const STATIC_ASSETS = [
  '/',
  '/swipe',
  '/battle',
  '/*.css',
  '/*.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Stale-while-revalidate for vocabulary data
      if (event.request.url.includes('/api/vocabulary')) {
        return cached ?? fetch(event.request);
      }
      return cached ?? fetch(event.request);
    }),
  );
});
```

---

## 22. Caching Strategy

### Cache Layers

```
L1: Zustand store (in-memory)       → Fastest, cleared on tab close
L2: localStorage (persisted)        → Fast, survives tab close
L3: Supabase query cache            → Network, configurable TTL
L4: Service Worker (PWA)            → Offline support
```

### Cache Rules

| Data | Cache Layer | TTL | Strategy |
|------|-------------|-----|----------|
| User profile | Zustand persist | Session + sync | Cache then network |
| Vocabulary words | Zustand + SW | 1 hour | Stale-while-revalidate |
| Due words | Zustand | 5 min | Cache then network |
| Battle questions | Zustand (session) | Until battle ends | Network only |
| Leaderboard | Zustand | 5 min | Network with cache |
| Ranks | Zustand persist | Permanent | Cache only |
| Badges | Zustand persist | 1 hour | Cache then network |
| Audio files | Service Worker | Permanent | Cache first |
| UI preferences | Zustand persist | Permanent | Cache only |

### Zustand Persist Middleware

```typescript
// Example: persist profile store
export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'harf-profile',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields (exclude functions)
        profile: state.profile,
        preferences: state.preferences,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after state is rehydrated from storage
        // Can trigger background sync
      },
    },
  ),
);
```

---

## 23. Optimistic UI Strategy

### Pattern

```typescript
// In any service/store action:

async function claimMissionReward(missionId: string) {
  const store = useMissionStore.getState();

  // 1. OPTIMISTIC UPDATE
  store.updateMissionOptimistic(missionId, { isClaimed: true });

  try {
    // 2. SERVER CALL
    await supabase.rpc('claim_mission_reward', {
      p_mission_id: missionId,
    });

    // 3. CONFIRM (optional)
    store.confirmMissionUpdate(missionId);
  } catch (error) {
    // 4. ROLLBACK
    store.rollbackMissionUpdate(missionId);
    showToast({ type: 'error', message: 'Gagal claim reward. Coba lagi.' });
  }
}
```

### When to Use Optimistic Updates

| Action | Optimistic? | Risk | Rollback |
|--------|-------------|------|----------|
| Swipe result | ✅ Yes | Low | None (append-only) |
| XP earn | ✅ Yes | Low | Auto-sync corrects |
| Battle result | ✅ Yes | Low | Append-only |
| Claim reward | ✅ Yes | Low | Toast on error |
| Profile update | ✅ Yes | Low | Revert on error |
| Leaderboard | ❌ No | Medium | Read-only |
| Streak update | ❌ No | High | Server-calculated |

---

## 24. Form Handling

### Forms in Harf

Harf meminimalkan form input. Form hanya ada di:

| Form | Fields | Validation |
|------|--------|------------|
| Login | Email, Password | Email format, min 6 chars |
| Register | Email, Password, Username | Email, min 6, 3-20 alphanumeric |
| Settings | Toggles (no text input) | — |
| Search (friends) | Username search | 3+ chars |

### Form Pattern

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Email tidak valid');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError('Email atau password salah');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-button
                   text-text-primary placeholder:text-text-tertiary
                   focus:outline-none focus:border-emerald-500"
        autoComplete="email"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-button
                   text-text-primary placeholder:text-text-tertiary
                   focus:outline-none focus:border-emerald-500"
        autoComplete="current-password"
      />
      {error && (
        <p className="text-feedback-error text-body-small">{error}</p>
      )}
      <Button type="submit" variant="primary" fullWidth loading={isLoading}>
        Masuk
      </Button>
    </form>
  );
}
```

---

## 25. Audio System Architecture

### Audio Service

```typescript
// services/audio.ts
class AudioService {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private cache = new Map<string, HTMLAudioElement>();

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  async preload(wordId: string, url: string): Promise<void> {
    if (this.cache.has(wordId)) return;

    const audio = new Audio(url);
    audio.preload = 'auto';
    this.cache.set(wordId, audio);
    // Don't await — preload in background
    audio.load();
  }

  async play(wordId: string, url: string, speed: 'normal' | 'slow' | 'very_slow' = 'normal'): Promise<void> {
    this.stop();

    let audio = this.cache.get(wordId);
    if (!audio) {
      audio = new Audio(url);
      this.cache.set(wordId, audio);
    }

    audio.playbackRate = speed === 'normal' ? 1 : speed === 'slow' ? 0.7 : 0.5;
    this.currentAudio = audio;

    try {
      await audio.play();
    } catch (error) {
      console.error('Audio playback failed:', error);
      // Fallback: show transliteration
    }
  }

  stop(): void {
    this.currentAudio?.pause();
    this.currentAudio = null;
  }

  setVolume(volume: number): void {
    AudioService.volume = Math.max(0, Math.min(1, volume));
  }

  static volume = 1;
}

export const audioService = new AudioService();
```

### Audio Preloading Strategy

```typescript
// In swipe session: preload next 3 words' audio
// In home: no preload (audio only used during swipe)

// hooks/useAudio.ts
export function useAudio() {
  const preloadNextWords = useCallback(async (words: Word[], currentIndex: number) => {
    const nextWords = words.slice(currentIndex + 1, currentIndex + 4);
    await Promise.all(
      nextWords.map((word) =>
        word.audio_url ? audioService.preload(word.id, word.audio_url) : Promise.resolve(),
      ),
    );
  }, []);
}
```

---

## 26. Battle Engine Frontend Logic

### Battle State Machine

```
                   ┌──────────┐
                   │  IDLE    │
                   └────┬─────┘
                        │ startBattle()
                        ▼
                   ┌──────────┐
                   │ LOADING  │ ← Fetch questions from API
                   └────┬─────┘
                        │ loaded
                        ▼
                   ┌──────────┐
                   │  INTRO   │ ← VS animation, 1.5s
                   └────┬─────┘
                        │ auto
                        ▼
              ┌─────────────────────┐
         ┌────│       ACTIVE        │────┐
         │    └──────────┬──────────┘    │
         │               │               │
         │         answerQuestion()      │
         │               │               │
         ▼               ▼               ▼
   ┌──────────┐   ┌──────────┐   ┌──────────┐
   │ CORRECT  │   │  WRONG   │   │ TIMEOUT  │
   │ +combo   │   │ -HP      │   │ -HP      │
   │ -enemyHP │   │ combo=0  │   │ combo=0  │
   └────┬─────┘   └────┬─────┘   └────┬─────┘
        │              │              │
        └──────────────┴──────────────┘
                       │
                       ├── enemyHP <= 0 → VICTORY
                       ├── playerHP <= 0 → DEFEAT
                       └── questions done → higher HP wins
                       │
                       ▼
                   ┌──────────┐
                   │  RESULT  │ ← Show stats, XP, coins
                   └──────────┘
```

### Battle Engine Hook

```typescript
// hooks/useBattle.ts
export function useBattle() {
  const store = useBattleStore();

  const startBattle = useCallback(async (enemyType: string) => {
    store.setLoading(true);

    try {
      const { questions, enemy } = await battleService.startBattle(enemyType);
      store.initBattle(enemy, questions);
      store.setStatus('intro');
    } catch (error) {
      store.setError('Gagal memulai battle');
    }
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    const current = store.questions[store.currentQuestionIndex];
    const isCorrect = answerIndex === current.correctIndex;

    if (isCorrect) {
      const damage = 10 + store.combo * 5;
      const newEnemyHp = Math.max(0, store.enemyHp - damage);
      store.setEnemyHp(newEnemyHp);
      store.incrementCombo();
      store.incrementCorrect();

      if (newEnemyHp <= 0) {
        store.setStatus('victory');
        return;
      }
    } else {
      const damage = 15;
      const newPlayerHp = Math.max(0, store.playerHp - damage);
      store.setPlayerHp(newPlayerHp);
      store.resetCombo();
      store.incrementWrong();

      if (newPlayerHp <= 0) {
        store.setStatus('defeat');
        return;
      }
    }

    // Next question or end
    if (store.currentQuestionIndex >= store.questions.length - 1) {
      // No more questions, determine winner by HP
      store.setStatus(store.playerHp >= store.enemyHp ? 'victory' : 'defeat');
    } else {
      store.nextQuestion();
    }
  }, [store]);

  return { startBattle, handleAnswer, battleState: store };
}
```

---

## 27. Swipe Engine Frontend Logic

### Swipe Session Flow

```
START SESSION
    │
    ├── Fetch due words from Supabase (RPC: get_due_words)
    ├── Initialize swipeStore
    │   ├── words (15 items)
    │   ├── currentIndex: 0
    │   ├── combo: 0
    │   └── sessionXP: 0
    │
    ├── Display Card 0
    │   ├── Arabic text (large)
    │   ├── Audio button
    │   └── Progress indicator
    │
    ├── USER SWIPES
    │   ├── Swipe right (know) → +10 XP, combo++
    │   ├── Swipe left (don't know) → show answer, combo=0
    │   └── Tap to reveal → show meaning, combo preserved
    │
    ├── Animate card out → Animate next card in (350ms)
    ├── Preload next 3 cards' data + audio
    │
    ├── If currentIndex >= words.length:
    │   ├── Fetch 5 more words (background)
    │   └── OR show "Sesi selesai" prompt
    │
    └── On END:
        ├── Save session to Supabase
        ├── Sync XP + progress
        └── Show session summary
```

### Swipe Engine Hook

```typescript
// hooks/useSwipeSession.ts
export function useSwipeSession() {
  const store = useSwipeStore();
  const { addXP } = useXP();

  const startSession = useCallback(async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    store.setLoading(true);
    try {
      const words = await vocabularyService.getDueWords(userId);
      store.startSession(words);
      store.setLoading(false);
    } catch {
      store.setError('Gagal memuat kata');
      store.setLoading(false);
    }
  }, []);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentWord = store.words[store.currentIndex];
    const isCorrect = direction === 'right';

    // Calculate XP
    const baseXp = isCorrect ? 10 : 0;
    const comboBonus = isCorrect ? store.combo * 2 : 0;
    const xpEarned = baseXp + comboBonus;

    // Update store
    store.swipeCard(direction);
    if (isCorrect) store.incrementCombo();
    else store.resetCombo();

    // Send to server (optimistic)
    vocabularyService.submitSwipeResult(
      useAuthStore.getState().user!.id,
      currentWord.id,
      direction === 'right' ? 'swipe_right' : 'swipe_left',
      store.combo,
      xpEarned,
    );

    // Update XP (optimistic)
    if (xpEarned > 0) addXP(xpEarned);

    // Advance to next card
    setTimeout(() => {
      store.nextCard();
    }, 300);
  }, [store, addXP]);

  return { startSession, handleSwipe, swipeState: store };
}
```

---

## 28. XP Animation System

### XP Feedback Architecture

```
XP EARNED
    │
    ├── MICRO (+10, +15, etc.) — Single floating number
    │   ├── Origin: at swipe location / card center
    │   ├── Animation: float up 60px + fade out
    │   ├── Duration: 800ms
    │   └── Color: emerald (base) / gold (combo bonus)
    │
    ├── MESO (+250, shower) — Multiple floating numbers + summary
    │   ├── Origin: bottom center
    │   ├── Animation: staggered float up
    │   ├── Duration: 1.5s
    │   └── Trigger: battle result, session summary
    │
    └── MACRO (Level Up) — Full screen celebration
        ├── Animation: scale bounce + particle burst
        ├── Duration: 2s
        ├── Trigger: level threshold crossed
        └── Components: XPBar fill, level counter, mascot, particles
```

### XP Float Component

```typescript
// components/animations/XPFloat.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XPFloatProps {
  amount: number;
  type?: 'normal' | 'combo' | 'streak' | 'bonus';
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export function XPFloat({ amount, type = 'normal', position, onComplete }: XPFloatProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const colorMap = {
    normal: 'text-emerald-400',
    combo: 'text-gold-400',
    streak: 'text-orange-400',
    bonus: 'text-purple-400',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 0.5 }}
          animate={{ y: -60, opacity: 0, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`absolute pointer-events-none text-xl font-extrabold ${colorMap[type]}`}
          style={position ? { left: position.x, top: position.y } : undefined}
        >
          +{amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Level Up Screen Trigger

```typescript
// In profileStore or XP hook:
async function checkLevelUp(newXp: number, userId: string) {
  const newLevel = calculateLevel(newXp);
  const currentLevel = get().profile?.level ?? 1;

  if (newLevel > currentLevel) {
    // Trigger level up animation
    useUIStore.getState().openModal({
      type: 'levelUp',
      data: { oldLevel: currentLevel, newLevel },
    });

    // Also check rank up
    const { rank_up } = await supabase.rpc('check_rank_up', {
      p_user_id: userId,
    });

    if (rank_up) {
      // Queue rank up screen after level up
    }
  }
}
```

---

## 29. Combo Animation System

### Combo Indicator

```typescript
// components/animations/ComboPulse.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ComboPulseProps {
  combo: number;
  isBroken?: boolean;
}

export function ComboPulse({ combo, isBroken }: ComboPulseProps) {
  if (combo < 2) return null;

  const glowIntensity = Math.min(combo / 10, 1);
  const color = combo >= 7 ? 'text-red-400' : combo >= 5 ? 'text-orange-400' : 'text-gold-400';
  const glowSize = 10 + glowIntensity * 20;

  if (isBroken) {
    return (
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-red-500 text-lg font-bold text-center"
      >
        COMBO BROKEN!
      </motion.div>
    );
  }

  return (
    <motion.div
      key={combo}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      className={`relative ${color} text-center`}
      style={{
        filter: `drop-shadow(0 0 ${glowSize}px currentColor)`,
      }}
    >
      <span className="text-lg">🔥</span>
      <span className="text-3xl font-black">x{combo}</span>
      <span className="block text-xs font-bold uppercase tracking-widest">COMBO</span>
    </motion.div>
  );
}
```

### Combo Glow Effect

```css
/* styles/globals.css */
@keyframes combo-pulse {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(250, 204, 21, 0.6));
  }
}

.combo-glow {
  animation: combo-pulse 1s ease-in-out infinite;
}

.combo-glow-5 {
  animation: combo-pulse 0.6s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.5));
}

.combo-glow-10 {
  animation: combo-pulse 0.3s ease-in-out infinite;
  filter: drop-shadow(0 0 30px rgba(239, 68, 68, 0.6));
}
```

---

## 30. Theme System

### Theme Provider

```typescript
// components/providers/ThemeProvider.tsx
'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
```

### Tailwind Dark Mode Config

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // Toggle via .dark class on <html>
  theme: {
    extend: {
      // Colors map to CSS variables for dark/light switching
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-surface': 'var(--color-bg-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        // ... etc
      },
    },
  },
};
```

### CSS Variables (globals.css)

```css
@layer base {
  :root.dark {
    --color-bg-primary: #0A0F1E;
    --color-bg-surface: #111827;
    --color-bg-elevated: #1E293B;
    --color-bg-card: #1A2332;
    --color-text-primary: #FEFCE8;
    --color-text-secondary: #94A3B8;
    --color-text-tertiary: #64748B;
  }

  :root.light {
    --color-bg-primary: #FAFAF9;
    --color-bg-surface: #FFFFFF;
    --color-bg-elevated: #F5F5F4;
    --color-bg-card: #FFFFFF;
    --color-text-primary: #1C1917;
    --color-text-secondary: #57534E;
    --color-text-tertiary: #78716C;
  }
}
```

---

## 31. Dark Mode Architecture

### Default Behavior

```typescript
// Always default to dark mode
// Light mode is opt-in via settings

// Detect system preference (optional)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('harf-theme');

// Priority:
// 1. Saved preference
// 2. System preference
// 3. Dark (default)

const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'dark');
```

### Theme Transition

```css
/* Smooth theme transition */
*, *::before, *::after {
  transition: background-color 300ms ease,
              color 300ms ease,
              border-color 300ms ease,
              box-shadow 300ms ease;
}
```

---

## 32. Typography System

### Font Loading

```typescript
// In root layout.tsx
import { Plus_Jakarta_Sans } from 'next/font/google';
import localFont from 'next/font/local';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const arabic = localFont({
  src: '../public/fonts/noto-naskh-arabic.woff2',
  variable: '--font-arabic',
  display: 'swap',
});
```

### Tailwind Typography

```typescript
// tailwind.config.ts — font sizes
fontSize: {
  'arabic-xl': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
  'display-1': ['28px', { lineHeight: '1.2', fontWeight: '800' }],
  'display-2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
  'heading-1': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
  'heading-2': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
  'body': ['16px', { lineHeight: '1.5' }],
  'body-small': ['14px', { lineHeight: '1.4' }],
  'label': ['13px', { lineHeight: '1.2', fontWeight: '600' }],
  'micro': ['12px', { lineHeight: '1.3' }],
},
```

---

## 33. Responsive Strategy

### Mobile-First Approach

```
Default styles: 375px (iPhone SE)
Scale up:       390px (iPhone 14) → minor spacing adjustments
Scale up:       414px (iPhone Plus) → slightly larger font
Tablet+:        max-width: 430px container (centered)
```

### Container Strategy

```css
/* App container — centering on larger screens */
.app-container {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
  position: relative;
}

/* Larger screens: decorative background */
@media (min-width: 768px) {
  body {
    background-color: #05080F; /* slightly darker than app bg */
  }
}
```

### Responsive Font Sizes

```typescript
// Use clamp() for fluid typography
fontSize: {
  'display-1': ['clamp(24px, 5vw, 32px)', { ... }],
  'body': ['clamp(14px, 4vw, 16px)', { ... }],
},
```

---

## 34. Accessibility Architecture

### ARIA Implementation

```typescript
// Example: SwipeCard with screen reader support
function SwipeCard({ word }: { word: Word }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Kata bahasa Arab: ${word.arabic_text}. 
                   Artinya: ${word.meaning_id}. 
                   Geser ke kanan jika tahu, ke kiri jika tidak tahu.`}
      aria-describedby={`transliteration-${word.id}`}
    >
      <span id={`transliteration-${word.id}`} className="sr-only">
        Transliterasi: {word.transliteration}
      </span>
      {/* ... */}
    </div>
  );
}
```

### Reduced Motion

```typescript
// animations/respectReducedMotion.ts
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// In Framer Motion components:
<motion.div
  animate={shouldReduceMotion() ? {} : { y: 0, opacity: 1 }}
  transition={shouldReduceMotion() ? { duration: 0 } : { duration: 0.3 }}
>
```

### Focus Management

```typescript
// After modal closes, return focus to trigger element
// Use next/navigation for route changes
// Keyboard: Tab through interactive elements
```

---

## 35. Performance Optimization

### Rendering Optimization

| Technique | Where | Impact |
|-----------|-------|--------|
| `React.memo` | Card components, list items | Prevents re-render on same props |
| `useMemo` | Expensive calculations (XP, rank) | Memoizes computed values |
| `useCallback` | Event handlers passed to children | Stable function references |
| Dynamic imports | Heavy components (battle, animations) | Code splitting |
| `next/dynamic` with ssr: false | Components that use `window` | Reduced bundle |
| Server Components | Data-fetching pages | Zero JS for static content |

### Memoization Strategy

```typescript
// ✅ GOOD: Memoize expensive computation
const levelProgress = useMemo(() => {
  if (!profile) return 0;
  return calculateLevelProgress(profile.xp, profile.level);
}, [profile?.xp, profile?.level]);

// ✅ GOOD: Memoize callbacks for list items
const handleCardSwipe = useCallback((direction: 'left' | 'right') => {
  handleSwipe(direction);
}, [currentIndex]);

// ✅ GOOD: Memoize full component
const SwipeCardMemo = React.memo(SwipeCard);
```

### Bundle Optimization

```typescript
// Dynamic import for heavy animation libraries
const ParticleEffect = dynamic(() => import('@/components/animations/ParticleEffect'), {
  ssr: false,
  loading: () => null,
});

// Dynamic import for battle engine (large state machine)
const BattleArena = dynamic(() => import('@/components/battle/BattleArena'), {
  ssr: false,
  loading: () => <BattleArenaSkeleton />,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

// Use Next.js Image component
<Image
  src={mascotUrl}
  alt="Burhan si burung"
  width={80}
  height={80}
  priority // For above-the-fold images
  loading="lazy" // For below-the-fold
  placeholder="blur" // Show blur placeholder
  blurDataURL="data:image/webp;base64,..." // Tiny preview
/>
```

---

## 36. Code Splitting Strategy

### Split Points

```
ROUTE-BASED (automatic via App Router):
  / → HomePage chunk
  /swipe → SwipePage chunk
  /battle → BattlePage chunk + BattleArena chunk
  /progress → ProgressPage chunk

COMPONENT-BASED (manual dynamic imports):
  BattleArena (heavy, only during battle)
  ParticleEffect (heavy animation, only on level up)
  ShareCard (canvas generation, only on share)
  Mascot (large sprite sheet, below the fold)
  LevelUpScreen (rare, celebration)

LIBRARY-BASED:
  Framer Motion (only on client components)
  Canvas-confetti (only on celebrations)
```

### Component Loading Strategy

```typescript
// Priority-based loading
// 1. Critical (above fold, interactive): Eager load
// 2. High (visible, not interactive): Eager load
// 3. Medium (below fold): Lazy load
// 4. Low (rarely used): Dynamic import

<>
  {/* Critical — render immediately */}
  <StreakIndicator />
  <XPBar />

  {/* High — render immediately */}
  <DailyMissionCard />

  {/* Medium — lazy load on scroll */}
  <LazyLoad>
    <FriendActivityFeed />
  </LazyLoad>

  {/* Low — dynamic import, not SSR */}
  <Suspense fallback={null}>
    <Mascot />
  </Suspense>
</>
```

---

## 37. Lazy Loading Strategy

### Intersection Observer Hook

```typescript
// hooks/useLazyLoad.ts
import { useEffect, useRef, useState } from 'react';

export function useLazyLoad(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
```

### Lazy Loading Component

```typescript
function LazyLoad({ children, placeholder }: { children: React.ReactNode; placeholder?: React.ReactNode }) {
  const { ref, isVisible } = useLazyLoad();

  return (
    <div ref={ref}>
      {isVisible ? children : (placeholder ?? <div className="h-32 bg-bg-elevated rounded-card animate-pulse" />)}
    </div>
  );
}
```

---

## 38. Image Optimization

### Next.js Image Configuration

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 390, 414, 750, 828],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};
```

### Image Components

```typescript
// Avatar (user profile)
<Image
  src={profile.avatar_url ?? '/default-avatar.webp'}
  alt={profile.username}
  width={64}
  height={64}
  className="rounded-full"
  priority
/>

// Mascot (decorative)
<Image
  src={`/assets/mascot/${expression}.webp`}
  alt=""
  width={80}
  height={80}
  loading="lazy"
  aria-hidden
/>

// Badge (list item)
<Image
  src={`/assets/badges/${badge.slug}.webp`}
  alt={badge.name}
  width={48}
  height={48}
  loading="lazy"
/>
```

---

## 39. Reusable Hooks Structure

### Custom Hook Inventory

| Hook | Purpose | Returns | Dependencies |
|------|---------|---------|--------------|
| `useSwipe` | Card swipe gesture | `{ swipeBind, cardRef, swipeState }` | Framer Motion |
| `useBattle` | Battle state machine | `{ startBattle, handleAnswer, battleState }` | battleStore |
| `useAudio` | Audio playback | `{ play, stop, preload, isPlaying }` | audioService |
| `useStreak` | Streak calculation | `{ streak, isDanger, milestone }` | profileStore |
| `useXP` | XP feedback animation | `{ addXP, showFloat, showShower }` | — |
| `useNetwork` | Online/offline status | `{ isOnline }` | window event |
| `useKeyboard` | Keyboard navigation | `{ bindings }` | window event |
| `useLazyLoad` | Intersection observer | `{ ref, isVisible }` | IntersectionObserver |
| `useSafeArea` | Safe area insets | `{ top, bottom }` | env() CSS |
| `useTimer` | Countdown timer | `{ time, isRunning, start, stop }` | setInterval |
| `useLongPress` | Long press gesture | `{ onMouseDown, onMouseUp }` | setTimeout |
| `useDebounce` | Debounced value | `debouncedValue` | setTimeout |

### Hook Pattern

```typescript
// hooks/useTimer.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime: number;  // seconds
  onTick?: (timeLeft: number) => void;
  onExpire?: () => void;
}

export function useTimer({ initialTime, onTick, onExpire }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const start = useCallback(() => {
    setTimeLeft(initialTime);
    setIsRunning(true);
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setTimeLeft(initialTime);
  }, [initialTime, stop]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          setIsRunning(false);
          onExpire?.();
          clearInterval(intervalRef.current);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTick, onExpire]);

  return { timeLeft, isRunning, start, stop, reset };
}
```

---

## 40. Utility Function Structure

### Utility Inventory

```typescript
// utils/cn.ts — Tailwind class merge
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/format.ts — Number and time formatting
export const formatXP = (xp: number): string => {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toLocaleString('id-ID');
};

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

// utils/storage.ts — LocalStorage helpers
export const storage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

// utils/validation.ts
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);
```

---

## 41. Constants & Config Structure

### Constants

```typescript
// constants/game.ts
export const GAME_CONSTANTS = {
  // XP
  XP_SWIPE_CORRECT: 10,
  XP_SWIPE_REVEAL: 2,
  XP_AUDIO_LISTEN: 2,
  XP_BATTLE_WIN_BASE: 100,
  XP_BATTLE_LOSE: 25,
  XP_FIRST_SESSION: 50,
  XP_REFERRAL: 100,

  // Combo
  COMBO_BONUS_BASE: 2,
  COMBO_BONUS_STEP: 2,
  COMBO_MAX_STACK: 10,

  // Battle
  BATTLE_TIME_PER_QUESTION: 10,
  BATTLE_BASE_DAMAGE: 10,
  BATTLE_COMBO_DAMAGE_BONUS: 5,
  BATTLE_WRONG_DAMAGE: 15,

  // Streak
  STREAK_MILESTONES: [7, 14, 30, 60, 100] as const,
  STREAK_MULTIPLIER_7: 2,
  STREAK_MULTIPLIER_30: 3,
  STREAK_MULTIPLIER_100: 4,

  // Session
  MIN_SWIPE_INTERVAL_MS: 500,
  SWIPE_THRESHOLD_RATIO: 0.3,
  MAX_CARDS_PER_SESSION: 15,

  // Onboarding
  ONBOARDING_GOALS: ['quran', 'conversation', 'academic'] as const,
  ONBOARDING_LEVELS: ['beginner', 'intermediate', 'advanced'] as const,
  ONBOARDING_TARGETS: ['casual', 'moderate', 'intense'] as const,
} as const;

// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SWIPE: '/swipe',
  BATTLE: '/battle',
  BATTLE_ARENA: (id: string) => `/battle/${id}`,
  PROGRESS: '/progress',
  PROFILE: '/profile',
  SETTINGS: '/profile/settings',
  SOCIAL: '/social',
} as const;

// constants/theme.ts
export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;
```

---

## 42. Environment Variables Strategy

### Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# .env.production (production)
# Same variables, different values

# Public variables (exposed to client)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=https://harf.app
NEXT_PUBLIC_SENTRY_DSN=

# Private variables (server only)
SUPABASE_SERVICE_ROLE_KEY=
SENTRY_DSN=
ANALYTICS_WRITE_KEY=
```

### Environment Variable Usage

```typescript
// services/supabase/client.ts
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

---

## 43. Error Logging Strategy

### Error Tracking

```typescript
// services/analytics.ts — Error logging
export const logError = (error: Error, context?: Record<string, unknown>) => {
  // Development: console.error
  if (process.env.NODE_ENV === 'development') {
    console.error('[Harf Error]', error.message, context);
    return;
  }

  // Production: send to Sentry or similar
  console.error('[Harf Error]', error.message, context);
  // Sentry.captureException(error, { extra: context });
};

// Global error handler
window.onerror = (message, source, lineno, colno, error) => {
  logError(error ?? new Error(String(message)), { source, lineno, colno });
};

window.onunhandledrejection = (event) => {
  logError(event.reason, { type: 'unhandled_promise' });
};
```

### User-Facing Error Messages

```typescript
// constants/errors.ts
export const ERROR_MESSAGES: Record<string, string> = {
  NETWORK: 'Koneksi internet terputus. Coba lagi ya!',
  AUTH: 'Sesi berakhir. Silakan masuk lagi.',
  SERVER: 'Ada gangguan dari server. Tim Harf sudah tahu!',
  RATE_LIMIT: 'Nafas dulu! Terlalu cepat.',
  NOT_FOUND: 'Data tidak ditemukan.',
  VALIDATION: 'Coba periksa kembali input kamu.',
  BATTLE_TIMEOUT: 'Waktu habis! Coba lagi lebih cepat.',
  OFFLINE_BATTLE: 'Battle butuh koneksi internet.',
  GUEST_LIMIT: 'Daftar akun untuk akses fitur ini.',
};

// ErrorBoundary passes to ErrorDisplay component
```

---

## 44. Analytics Integration

### Analytics Service

```typescript
// services/analytics.ts
type EventName =
  | 'app_open'
  | 'swipe_session_start'
  | 'swipe_session_end'
  | 'swipe_card_correct'
  | 'swipe_card_wrong'
  | 'battle_start'
  | 'battle_end'
  | 'level_up'
  | 'rank_up'
  | 'badge_earned'
  | 'streak_update'
  | 'daily_mission_complete'
  | 'share_content'
  | 'friend_invite'
  | 'auth_login'
  | 'auth_register';

export const analytics = {
  track(event: EventName, properties?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
      return;
    }

    // Send to Supabase analytics_events table
    try {
      supabase.from('analytics_events').insert({
        event_name: event,
        event_data: properties ?? {},
        session_id: useAuthStore.getState().session?.access_token,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Silently fail analytics (non-critical)
    }
  },
};

// Usage:
analytics.track('swipe_card_correct', { word_id: 'xxx', combo: 5 });
```

### Analytics Hook

```typescript
// hooks/useAnalytics.ts
export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track('page_view', { page: pathname });
  }, [pathname]);
}
```

---

## 45. Testing Strategy

### Testing Layers

```
UNIT TESTS (Jest + React Testing Library):
  - Pure utility functions
  - Zustand store logic
  - Individual components

INTEGRATION TESTS (React Testing Library):
  - Feature interactions (swipe → store → animation)
  - Battle state machine
  - XP calculation flow

E2E TESTS (Playwright):
  - Critical user flows:
  - Onboarding → swipe → battle → streak
  - Auth → profile → settings
  - Offline → reconnect → sync
```

### Test File Structure

```typescript
// components/swipe/__tests__/SwipeCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SwipeCard } from '../SwipeCard';

const mockWord = {
  id: '1',
  arabic_text: 'كِتَاب',
  transliteration: 'kitab',
  meaning_id: 'buku',
};

describe('SwipeCard', () => {
  it('renders arabic text', () => {
    render(<SwipeCard word={mockWord} />);
    expect(screen.getByText('كِتَاب')).toBeInTheDocument();
  });

  it('calls onSwipeRight when gesture exceeds threshold', () => {
    const onSwipe = jest.fn();
    render(<SwipeCard word={mockWord} onSwipeRight={onSwipe} />);
    // Simulate swipe gesture...
  });
});
```

### Testing Utilities

```typescript
// utils/test-utils.tsx
import { render, type RenderOptions } from '@testing-library/react';
import { Providers } from '@/components/providers';

function customRender(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
```

---

## 46. Folder Naming Convention

### Naming Rules

| Entity | Convention | Example |
|--------|------------|---------|
| **Components** | PascalCase | `StreakIndicator.tsx` |
| **Hooks** | camelCase, `use` prefix | `useSwipe.ts` |
| **Stores** | camelCase, `Store` suffix | `swipeStore.ts` |
| **Services** | camelCase | `audio.ts` |
| **Utils** | camelCase | `format.ts` |
| **Types** | PascalCase | `GameTypes.ts` |
| **Constants** | UPPER_SNAKE | `GAME_CONSTANTS.ts` |
| **Animations** | camelCase | `variants.ts` |
| **Styles** | kebab-case | `globals.css` |
| **Test files** | `{name}.test.tsx` | `Button.test.tsx` |

### Folder Structure Rules

```
1. One component per file
2. One default export per component file
3. Barrel exports (index.ts) for related groups
4. Tests co-located with source files
5. No deeply nested folders (>3 levels)
6. Feature folders contain only feature-specific code
```

---

## 47. Component Naming Rules

### Component Names

```typescript
// ✅ GOOD: Descriptive
StreakIndicator
DailyMissionCard
BattleArena
AnswerOption
XPBar
ComboIndicator
SwipeCard

// ❌ BAD: Generic or unclear
GameComponent
Section
Item
BigCard
FeatureComponent

// Rule: Component name = what it IS, not where it IS
// Incorrect: HomeButton (implies location)
// Correct: StreakIndicator (implies function)
```

### File Naming

```
ComponentName.tsx          → Main component
ComponentName.test.tsx     → Tests
ComponentName.module.css   → Module styles (if not using Tailwind)
index.ts                   → Public exports
types.ts                   → Component-specific types
utils.ts                   → Component-specific utilities
```

---

## 48. Scalability Strategy

### Current vs Future

| Aspect | MVP (5K users) | Scale (1M users) |
|--------|----------------|------------------|
| **State** | Zustand only | Zustand + React Query |
| **Data** | Direct Supabase queries | CDN cache layer |
| **Images** | Supabase Storage | CDN (Cloudflare/Imgix) |
| **Real-time** | Supabase Realtime | Dedicated WebSocket |
| **Animations** | Framer Motion | Optimized canvas (wasm) for particles |
| **Bundle** | Single Next.js app | Micro-frontends (future) |

### Code Maintainability Rules

```
1. Max 300 lines per component (split if exceeded)
2. Max 3 levels of prop drilling (use store or context)
3. No circular dependencies (enforced via ESLint)
4. Every store action must be a pure function
5. Every service must be stateless
6. Types must be shared, not duplicated
7. Dead code must be removed (not commented)
```

---

## 49. Technical Debt Prevention

### Code Review Checklist

```
- [ ] Follows folder structure conventions?
- [ ] No `any` types?
- [ ] No `eslint-disable`?
- [ ] Component < 300 lines?
- [ ] Proper error handling?
- [ ] Loading states handled?
- [ ] Empty states handled?
- [ ] Mobile-responsive (375px)?
- [ ] Dark mode tested?
- [ ] Animations have reduced-motion fallback?
- [ ] No hardcoded strings (use constants)?
- [ ] Proper memoization?
- [ ] Tests included?
```

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react-hooks/exhaustive-deps": "warn",
    "import/no-cycle": "error"
  }
}
```

---

## 50. Future Expansion Strategy

### Architecture for Growth

| Feature | Architecture Change | Timeline |
|---------|-------------------|----------|
| **Multiplayer battle** | WebSocket server, matchmaking service | Month 6 |
| **AI conversation** | Server-side AI integration, streaming | Month 12 |
| **Voice recognition** | Web Audio API + ML model | Month 12 |
| **Clan/guild system** | Group CRUD, clan leaderboard | Month 6 |
| **Native apps** | React Native / Turbo Modules | Month 9+ |
| **Internationalization** | i18n framework, translation keys | Month 6 |
| **Offline-first PWA** | Workbox, IndexedDB, full sync | Month 3 |

### Technology Additions

```
Phase 1 (MVP):    Next.js + Zustand + Supabase + Framer Motion
Phase 2 (Growth): Add React Query, Redis cache, CDN
Phase 3 (Scale):  Add WebSocket server, micro-frontends
Phase 4 (Native): Add React Native, native modules
```

### Migrating from Zustand to React Query

```typescript
// Future pattern: server data via React Query
// Client-only state via Zustand

// services/queries.ts
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId),
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 30 * 60 * 1000,   // 30 min cache
  });
}

// Zustand still used for:
// - UI state (theme, active tab)
// - Session state (current swipe/battle)
// - Form state
// - Optimistic updates
```

---

## Appendix

### A. Dependency Map

```
Component → Hook → Store → Service → Supabase
    │         │       │        │
    │         │       │        └── db queries, RPC calls
    │         │       │
    │         │       └── state, actions, persistence
    │         │
    │         └── reusable interaction logic
    │
    └── UI rendering, event handlers, composition

Utils → No dependencies (pure functions)
Constants → No dependencies
Types → No dependencies
Animations → Framer Motion only
```

### B. Bundle Size Budget

| Asset | Budget | Current Estimate |
|-------|--------|-----------------|
| Initial JS (gzip) | <150KB | ~120KB |
| Swipe page JS | <50KB | ~35KB |
| Battle page JS | <80KB | ~60KB |
| CSS (gzip) | <20KB | ~15KB |
| Fonts | <30KB | ~25KB |
| Images (per page) | <100KB | ~50KB |

### C. Key Technology Versions

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.2 | Framework |
| react | ^18.3 | UI library |
| typescript | ^5.4 | Type safety |
| tailwindcss | ^3.4 | Styling |
| framer-motion | ^11.0 | Animation |
| zustand | ^4.5 | State management |
| @supabase/supabase-js | ^2.45 | Backend client |
| @supabase/auth-helpers-nextjs | ^0.10 | Auth integration |
| clsx | ^2.1 | Class utilities |
| tailwind-merge | ^2.3 | Class dedup |

### D. Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | <1.5s | Lighthouse |
| Time to Interactive | <3s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| First Input Delay | <100ms | Web Vitals |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| Animation Frame Rate | 60fps | DevTools Performance |
| Bundle Size (initial) | <150KB gzipped | Webpack Bundle Analyzer |
| API Response Time | <200ms (p95) | Supabase Metrics |

---

*This frontend architecture defines a scalable, production-ready, mobile-first system for Harf. Every pattern, hook, store, and component is designed for maintainability and polish.*  
*Harf — حرف*
