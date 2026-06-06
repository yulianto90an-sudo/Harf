# UI Implementation Plan — Harf

**Version:** 1.0  
**Status:** Draft  
**Audience:** Frontend Engineering Team  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS · Framer Motion · Zustand · Supabase  
**Device Focus:** Mobile-first (375px–430px)

---

## Table of Contents

1. Frontend Implementation Overview
2. Development Philosophy
3. UI Build Order Strategy
4. Milestone Breakdown
5. Dependency Graph
6. Shared Foundation Setup
7. Design Token Implementation
8. Tailwind Configuration Plan
9. Theme System Setup
10. Typography Setup
11. Animation Foundation Setup
12. Framer Motion Preset Setup
13. Zustand Store Setup
14. API Layer Setup
15. Supabase Client Setup
16. Shared Component Implementation Order
17. Layout Component Build Plan
18. Navigation System Build Plan
19. Home Screen Build Plan
20. Swipe Learning Build Plan
21. Battle Mode Build Plan
22. Progress Screen Build Plan
23. Leaderboard Build Plan
24. Profile Screen Build Plan
25. Settings Screen Build Plan
26. Share Card System Build Plan
27. Reward Modal Build Plan
28. Mascot System Build Plan
29. Notification System Build Plan
30. Loading State System Build Plan
31. Skeleton UI Build Plan
32. Empty State Build Plan
33. Error State Build Plan
34. Offline Support Build Plan
35. Gesture System Build Plan
36. Audio System Build Plan
37. Analytics Integration Plan
38. Performance Optimization Plan
39. Accessibility Validation Plan
40. Mobile Optimization Plan
41. QA Checklist
42. Testing Strategy
43. Refactoring Strategy
44. Code Review Rules
45. CI/CD Preparation
46. Production Readiness Checklist
47. Technical Debt Prevention
48. Future Expansion Readiness

---

## 1. Frontend Implementation Overview

Harf is a mobile-first language learning game. The frontend is built on Next.js App Router with a strict layered architecture. Every component, store, and service follows dependency rules defined in `frontend-architecture.md`.

### Architecture at a Glance

```
src/
├── app/              Next.js App Router pages & layouts
├── components/       UI kit, layout, feature, animation, shared
├── stores/           Zustand state management (6 stores)
├── hooks/            Custom React hooks (gesture, audio, network)
├── services/         Supabase, audio, analytics integrations
├── animations/       Framer Motion presets, variants, transitions
├── styles/           globals.css, Tailwind layers
├── types/            TypeScript definitions (DB, game, UI, API)
├── constants/        Game formulas, configs, routes
└── utils/            cn(), format, storage, share helpers
```

### Core Design Decisions

| Decision | Rationale |
|----------|-----------|
| Zustand over Redux | Minimal boilerplate, great TypeScript inference, built-in persist middleware |
| Server Components for data | Reduce client JS bundle for Supabase queries |
| Framer Motion for animation | Best-in-class gesture + spring + layout animation API |
| Tailwind CSS for styling | Zero-runtime CSS, built-in dark mode, consistent design tokens |
| `cn()` utility | Merge Tailwind classes without conflicts (clsx + tailwind-merge) |
| Barrel exports | Clean imports via `@/components/ui` pattern |

---

## 2. Development Philosophy

### Principles

1. **Foundation-first** — Build the base layer (tokens, theme, presets) before any screen.
2. **Reusable-first** — If a pattern appears twice, extract it into a shared component.
3. **Mobile-first** — Every component is designed at 375px viewport; tablet/desktop are progressive enhancements.
4. **Animation-aware** — Every component considers its enter/exit/press/swipe animation from the start.
5. **Scalable architecture** — Dependency direction is one-way: Pages → Features → UI Kit → Utils.

### Decision Framework

Before writing any component, ask:

1. Does this already exist in the UI kit?
2. Can this be composed from existing components instead of built from scratch?
3. Does this need to be animated? What's the enter/exit/press/gesture behavior?
4. Is this mobile-friendly? Thumb zone? Touch target size?
5. What states does this have? (loading, empty, error, success)

### Anti-Patterns

| Anti-Pattern | Why | Solution |
|---|---|---|
| Building screens before foundation | Inconsistent styling, duplicated logic | Always complete Phase 1-3 before Phase 6 |
| Prop drilling >4 levels | Brittle, hard to refactor | Extract to Zustand store or context |
| Inline animation values | Inconsistent feel | Import from `@/animations/presets` |
| Magic numbers in Tailwind | Hard to maintain | Use Tailwind theme extension tokens |
| `useEffect` for data fetching | Race conditions, no caching | Use Server Components or React Query |
| Client components wrapping server components unnecessarily | More JS sent to browser | Keep leaves as Server Components where possible |

---

## 3. UI Build Order Strategy

### Why This Order

The build order follows the dependency chain: you cannot build a screen until its components exist, and you cannot build feature components until the shared UI kit exists, and you cannot build the UI kit until the design tokens and animation presets exist.

### Build Order Summary

```
Phase 1: Foundation       → Tokens, Tailwind, Theme, Typography, Animation Presets
Phase 2: Shared UI        → Button, Card, Modal, Toast, Avatar, ProgressBar, Tabs
Phase 3: Layout           → AppShell, BottomNavigation, TopBar, ScreenContainer
Phase 4: Core Learning    → SwipeCard, VocabularyCard, ComboIndicator, XPBurst, AudioButton
Phase 5: Battle           → BattleArena, HPBar, DamageText, RewardChest
Phase 6: Screens          → Home, Swipe, Battle, Progress, Profile
Phase 7: Polish           → Animations, Micro-interactions, Transitions, Optimization
```

### Dependency Rule

```
Utils → Tokens → Animation Presets → Shared UI → Layout → Feature Components → Screens
```

Never skip phases. If you build a screen without its foundation, you will create technical debt that requires a refactor.

---

## 4. Milestone Breakdown

### M1: Foundation (Week 1)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| Initialize Next.js + TypeScript + Tailwind | 2h | None |
| Configure Tailwind theme extension | 3h | Design tokens from `design-system.md` |
| Implement theme system (dark/light) | 4h | Tailwind config |
| Set up typography with variable fonts | 2h | Theme system |
| Create animation presets (Framer Motion) | 4h | None |
| Build `cn()` utility | 0.5h | None |
| Set up Zustand stores (all 6) | 6h | TypeScript types |
| Set up Supabase client + service layer | 4h | Store interfaces |
| Build `useSwipe` + `useNetwork` hooks | 4h | None |

### M2: Shared UI Kit (Week 2)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| Button (7 variants, 4 sizes, loading state) | 4h | Foundation |
| Card (3 variants, pressable, glowing) | 3h | Foundation |
| Modal + BottomSheet (enter/exit animation) | 4h | Button |
| Toast system (queue, auto-dismiss) | 3h | Card, Animation |
| Avatar (size, badge, status) | 2h | Foundation |
| ProgressBar (animated, multiple variants) | 2h | Animation presets |
| Tabs (animated indicator, horizontal scroll) | 2h | Animation presets |

### M3: Layout & Navigation (Week 3)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| SafeAreaWrapper | 1h | Foundation |
| AppShell (layout orchestration) | 3h | SafeAreaWrapper |
| TopBar (streak, XP, mascot) | 4h | Shared UI, Mascot |
| BottomNavigation (4 tabs, animated indicator) | 4h | Shared UI, Animation |
| ScreenContainer (AnimatePresence wrapper) | 2h | Animation presets |

### M4: Core Feature Components (Weeks 3-4)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| VocabularyCard (flip, audio, progress) | 6h | Shared UI, Animation |
| SwipeCard (drag gesture, threshold snap) | 8h | VocabularyCard, useSwipe |
| ComboIndicator (glow, counter, streak) | 4h | Animation presets |
| XPBurst (float numbers, particle effect) | 4h | Animation presets |
| AudioButton (play, loading, error) | 3h | AudioService |
| Mascot (8 expressions, idle animation) | 6h | Animation presets |

### M5: Battle Components (Week 4)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| HPBar (animated, damage/heal flash) | 3h | Animation presets |
| BattleArena (layout, timer, state machine) | 8h | HPBar, QuestionCard |
| DamageText (float up, red/green) | 2h | Animation presets |
| RewardChest (open animation, loot reveal) | 4h | Modal, Animation |

### M6: Screens (Weeks 5-6)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| Home Screen | 8h | All Phase 1-3, Home components |
| Swipe Session Screen | 10h | All Phase 4 |
| Battle Select + Arena Screens | 12h | All Phase 5 |
| Progress + Leaderboard Screens | 8h | Shared UI, Charts |
| Profile + Settings Screens | 6h | Shared UI, BottomSheet |

### M7: Polish (Week 7)

| Task | Est. Effort | Dependencies |
|------|-------------|--------------|
| Page transitions (shared layout animation) | 4h | Phase 6 |
| Micro-interactions (button ripple, card lift) | 4h | Phase 6 |
| Skeleton loading screens | 4h | Phase 6 |
| Performance audit + optimization | 6h | Phase 6 |
| Accessibility audit | 4h | Phase 6 |

---

## 5. Dependency Graph

### Full Dependency Map

```
Utils
├── cn.ts                    ← No deps
├── format.ts                ← No deps
├── storage.ts               ← No deps
└── share.ts                 ← HTML Canvas API

Animation Presets
├── presets.ts               ← No deps
├── variants.ts              ← presets.ts
├── transitions.ts           ← variants.ts
└── keyframes.ts             ← No deps

Design Tokens (Tailwind Config)
├── colors                   ← design-system.md §5
├── spacing                  ← design-system.md §7
├── borderRadius             ← design-system.md §9
├── boxShadow                ← design-system.md §10
└── fontFamily + fontSize    ← design-system.md §6

Shared UI Kit
├── Button                   ← cn.ts, Animation presets
├── Card                     ← cn.ts, Animation presets
├── Modal                    ← cn.ts, Animation presets, Button
├── Toast                    ← cn.ts, Animation presets
├── Avatar                   ← cn.ts
├── ProgressBar              ← cn.ts, Animation presets
├── Badge                    ← cn.ts
├── Skeleton                 ← cn.ts, Animation presets
├── Icon                     ← cn.ts
└── Tabs                     ← cn.ts, Animation presets

Layout Components
├── SafeAreaWrapper          ← cn.ts
├── TopBar                   ← Shared UI, Mascot
├── BottomNavigation         ← Shared UI, Animation presets
├── AppShell                 ← SafeAreaWrapper, TopBar, BottomNavigation
└── ScreenContainer          ← Animation presets (AnimatePresence)

Feature Components (Learning)
├── VocabularyCard           ← Card, AudioButton, Animation presets
├── SwipeCard                ← VocabularyCard, useSwipe, Animation presets
├── SwipeStack               ← SwipeCard, swipeStore
├── ComboIndicator           ← Animation presets
├── XPBurst                  ← Animation presets
├── AudioButton              ← audioService, Animation presets
└── SessionProgress          ← ProgressBar

Feature Components (Battle)
├── HPBar                    ← ProgressBar, Animation presets
├── QuestionCard             ← Card, AudioButton
├── AnswerOptions            ← Button, Animation presets
├── BattleArena              ← HPBar, QuestionCard, AnswerOptions, battleStore
├── DamageText               ← Animation presets
├── RewardChest              ← Modal, Animation presets
└── BattleResult             ← Modal, RewardChest, XPBurst

Feature Components (Other)
├── StreakIndicator          ← Icon, Animation presets
├── XPBar                    ← ProgressBar, Animation presets
├── DailyMissionCard         ← Card, ProgressBar
├── RankDisplay              ← Avatar, Badge
├── StatsGrid                ← Card
├── BadgeGrid                ← Card, Badge
├── LeaderboardRow           ← Avatar, Badge
└── Mascot                   ← Animation presets (all expressions)

Screens
├── HomePage                 ← StreakIndicator, XPBar, DailyMissionCard, Mascot, QuickActions
├── SwipePage                ← SwipeStack, ComboIndicator, XPBurst, SessionProgress
├── BattleSelectPage         ← Card, Button, BattleArena
├── BattleArenaPage          ← BattleArena
├── ProgressPage             ← RankDisplay, StatsGrid, BadgeGrid
├── LeaderboardPage          ← LeaderboardRow, Tabs
├── ProfilePage              ← Avatar, BadgeGrid, StatsGrid
└── SettingsPage             ← BottomSheet, Button, Toggle
```

### Circular Dependency Warning

```
❌ NEVER: Store → imports → Component → imports → Store
❌ NEVER: Service → imports → Store
❌ NEVER: Component (ui) → imports → Feature Component

✅ Store → Service → Utils
✅ Component → imports → Store
✅ Component → imports → Service
```

---

## 6. Shared Foundation Setup

### Root Layout

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload font files */}
      </head>
      <body className="font-sans bg-bg-primary text-text-primary antialiased">
        <Providers>
          {children}
        </Providers>
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
          <AudioProvider>
            {children}
          </AudioProvider>
        </ThemeProvider>
      </AuthProvider>
    </SupabaseProvider>
  );
}
```

### Utility: cn()

```typescript
// src/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-family': ['font-sans', 'font-arabic', 'font-mono'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 7. Design Token Implementation

### Color Tokens

```typescript
// src/styles/globals.css
@layer base {
  :root {
    /* Dark theme (default) */
    --bg-primary: #0A0F1E;
    --bg-surface: #111827;
    --bg-elevated: #1E293B;
    --bg-card: #1A2332;
    --text-primary: #FEFCE8;
    --text-secondary: #94A3B8;
    --text-tertiary: #64748B;
    --text-disabled: #475569;
    --accent-emerald: #10B981;
    --accent-emerald-300: #6EE7B7;
    --accent-emerald-600: #059669;
    --accent-gold: #FACC15;
    --accent-gold-300: #FCD34D;
    --success: #22C55E;
    --error: #EF4444;
    --warning: #F97316;
    --info: #3B82F6;
  }

  .light {
    --bg-primary: #FAFAF9;
    --bg-surface: #FFFFFF;
    --bg-elevated: #F5F5F4;
    --bg-card: #FFFFFF;
    --text-primary: #1C1917;
    --text-secondary: #57534E;
    --text-tertiary: #78716C;
    --text-disabled: #A8A29E;
  }
}
```

### Spacing + Radius + Shadow

All listed in `design-system.md` §7-10. These go into the Tailwind theme extension (see §8).

---

## 8. Tailwind Configuration Plan

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0F1E',
          surface: '#111827',
          elevated: '#1E293B',
          card: '#1A2332',
        },
        text: {
          primary: '#FEFCE8',
          secondary: '#94A3B8',
          tertiary: '#64748B',
          disabled: '#475569',
        },
        emerald: {
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        navy: {
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        gold: {
          300: '#FCD34D',
          400: '#FACC15',
          500: '#EAB308',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', '"Amiri"', '"Traditional Arabic"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'arabic-xl': ['48px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.01em' }],
        'arabic-l': ['36px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.005em' }],
        'display-1': ['28px', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.02em' }],
        'display-2': ['24px', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.01em' }],
        'heading-1': ['20px', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.005em' }],
        'heading-2': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-bold': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-small': ['14px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'label': ['13px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.02em' }],
        'micro': ['12px', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0.02em' }],
        'xp-value': ['20px', { lineHeight: '1', fontWeight: '800', letterSpacing: '0.02em' }],
        'combo-number': ['32px', { lineHeight: '1', fontWeight: '900', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        'none': '0px',
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0,0,0,0.3)',
        'md': '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
        'lg': '0 10px 15px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2)',
        'xl': '0 20px 30px rgba(0,0,0,0.4)',
        '2xl': '0 30px 50px rgba(0,0,0,0.5)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
        'glow-gold': '0 0 20px rgba(250, 204, 21, 0.3), 0 0 40px rgba(250, 204, 21, 0.1)',
        'glow-combo': '0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.2)',
        'glow-xp': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-streak': '0 0 25px rgba(249, 115, 22, 0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
        'bottom-nav': '0 -4px 30px rgba(0,0,0,0.4)',
      },
      maxWidth: {
        'app': '430px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Configuration Rules

1. Never add arbitrary colors in JSX — always reference theme token first, then extend if truly needed.
2. Custom `fontSize` entries should match the type scale in `design-system.md` §6 exactly.
3. Keep shadows in the theme; never inline shadow values.
4. The `max-w-app: 430px` container constraint ensures mobile-first layout doesn't stretch on desktop.

---

## 9. Theme System Setup

```typescript
// src/components/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('harf-theme') as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('harf-theme', t);
    document.documentElement.className = t;
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

### Implementation Notes

- Default is `dark` — Harf is designed "dark by default" per design philosophy.
- A `light` class on `<html>` overrides CSS custom properties defined in `:root .light`.
- Theme is persisted to localStorage for consistency across sessions.
- The theme toggle lives in Settings but should be accessible from Profile screen.

---

## 10. Typography Setup

### Font Loading Strategy

```typescript
// src/app/layout.tsx (additional head content)
const fontSans = `url('/fonts/PlusJakartaSans-Variable.woff2') format('woff2-variations')`;
const fontArabic = `url('/fonts/NotoNaskhArabic-Variable.woff2') format('woff2-variations')`;
```

```css
/* src/styles/globals.css */
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Variable.woff2') format('woff2-variations');
  font-weight: 200 800;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Noto Naskh Arabic';
  src: url('/fonts/NotoNaskhArabic-Variable.woff2') format('woff2-variations');
  font-weight: 400 700;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}
```

### Arabic Text Component

```typescript
// src/components/shared/ArabicText.tsx
interface ArabicTextProps {
  text: string;
  size?: 'xl' | 'l' | 'body' | 'body-small';
  className?: string;
}

export function ArabicText({ text, size = 'xl', className }: ArabicTextProps) {
  return (
    <span
      className={cn(
        'font-arabic leading-[1.1]',
        {
          'text-arabic-xl': size === 'xl',
          'text-arabic-l': size === 'l',
          'text-body': size === 'body',
          'text-body-small': size === 'body-small',
        },
        className,
      )}
      dir="rtl"
      lang="ar"
    >
      {text}
    </span>
  );
}
```

### Typography Rules

| Rule | Implementation |
|------|----------------|
| Min font size | 12px (micro) — never smaller |
| Body text | 16px — never smaller for readability |
| Arabic 1.2x | Arabic font size is inherently larger by design token |
| Max line length | Container `max-w-app: 430px` with 16px padding = ~398px |
| Arabic letter-spacing | None — it breaks ligatures |
| Touch target labels | min 13px with `font-label` class |

---

## 11. Animation Foundation Setup

### Performance Rules

1. Animate only `transform` and `opacity` — never `width`, `height`, `top`, `left`, `margin`.
2. Use `will-change: transform` on animated elements (Framer Motion does this automatically).
3. Use `transform: translateZ(0)` for GPU acceleration on static elements.
4. Use `layoutId` for shared layout animations between screens.
5. Reduce particle effects by 50% on low-end / battery-saver devices.

### CSS Keyframes

```css
/* src/styles/globals.css */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
}

@keyframes flash-green {
  0% { background-color: transparent; }
  50% { background-color: rgba(34, 197, 94, 0.2); }
  100% { background-color: transparent; }
}

@keyframes xp-float {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
}

@keyframes pulse-glow-emerald {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
}

@keyframes pulse-glow-gold {
  0%, 100% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.3); }
  50% { box-shadow: 0 0 40px rgba(250, 204, 21, 0.6); }
}

@keyframes skeleton-pulse {
  0% { opacity: 0.4; }
  50% { opacity: 0.8; }
  100% { opacity: 0.4; }
}

@keyframes float-up-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
```

---

## 12. Framer Motion Preset Setup

### Spring Presets

```typescript
// src/animations/presets.ts
import type { Spring, Transition } from 'framer-motion';

export const springPresets = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 25, mass: 0.5 },
  bouncy: { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.5 },
  gentle: { type: 'spring' as const, stiffness: 150, damping: 20, mass: 1 },
  smooth: { type: 'spring' as const, stiffness: 100, damping: 20, mass: 1 },
  wobbly: { type: 'spring' as const, stiffness: 80, damping: 10, mass: 1 },
} satisfies Record<string, Spring>;

export const tweenPresets = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.25, ease: 'easeOut' },
  slow: { duration: 0.4, ease: 'easeOut' },
  expressive: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
} satisfies Record<string, Transition>;
```

### Variants

```typescript
// src/animations/variants.ts
import type { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const swipeCard: Variants = {
  center: { opacity: 1, scale: 1, rotate: 0 },
  left: { opacity: 0.5, x: -300, rotate: -15 },
  right: { opacity: 0.5, x: 300, rotate: 15 },
};

export const xpFloat: Variants = {
  initial: { opacity: 1, y: 0, scale: 1 },
  animate: { opacity: 0, y: -40, scale: 1.3 },
};

export const comboPulse: Variants = {
  idle: { scale: 1 },
  increase: { scale: 1.3 },
};

export const buttonPress = {
  whileTap: { scale: 0.95 },
  whileHover: { scale: 1.02 },
};

export const mascotIdle: Variants = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};
```

### Transition Configs

```typescript
// src/animations/transitions.ts
export const pageTransition = {
  type: 'tween' as const,
  duration: 0.25,
  ease: 'easeOut',
};

export const modalTransition = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 20,
  mass: 1,
};

export const toastTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};
```

### Animation-Wrapper Components

```typescript
// src/components/animations/FadeIn.tsx
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ...tweenPresets.normal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// src/components/animations/SlideUp.tsx
interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SlideUp({ children, delay = 0, className }: SlideUpProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ ...tweenPresets.normal, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### Implementation Rules

| Rule | Explanation |
|------|-------------|
| Always import from `@/animations/presets` | Never write inline spring/tween configs |
| Use `variants` for complex multi-child animations | Keeps animation logic out of components |
| Use wrapper components for repeated patterns | `FadeIn`, `SlideUp`, `ScaleIn` reduce boilerplate |
| Always set `exit` variants | Required for `AnimatePresence` to work |
| Match animation timing to `design-system.md` §15 | Consistent feel across all components |

---

## 13. Zustand Store Setup

### Store Inventory

| Store | Persistence | Key State | Key Actions |
|-------|-------------|-----------|-------------|
| `authStore` | localStorage (session) | user, session, isAuthenticated | login, logout, continueAsGuest |
| `swipeStore` | sessionStorage | currentIndex, combo, sessionXP | swipeCard, startSession, endSession |
| `battleStore` | sessionStorage | status, playerHp, enemyHp, timer | startBattle, answerQuestion, endBattle |
| `profileStore` | localStorage | profile, rank, badges | fetchProfile, addXP, refreshBadges |
| `uiStore` | localStorage | theme, soundEnabled, activeTab, toast/modal | showToast, openModal, setTheme |
| `audioStore` | none (in-memory) | isPlaying, queue, volume, speed | play, stop, setSpeed |
| `notificationStore` | none (fetched) | notifications, unreadCount | fetchNotifications, markAsRead |

### Store Best Practices

```typescript
// ✅ GOOD: Select only what you need
const xp = useProfileStore((s) => s.profile?.xp);
const addXP = useProfileStore((s) => s.addXP);

// ❌ BAD: Full store subscription (re-renders on every change)
const profile = useProfileStore();

// ✅ GOOD: Shallow compare for object selectors
const { xp, level } = useProfileStore(
  (s) => ({ xp: s.profile?.xp, level: s.profile?.level }),
  shallow,
);

// ✅ GOOD: Colocate derived values
const streak = useProfileStore((s) => s.profile?.currentStreak);
const isDanger = streak !== undefined && streak === 0;
```

### Anti-Pattern Warnings

| Anti-Pattern | Fix |
|---|---|
| Storing computed values in store | Compute in selector or component |
| Mutating store outside of actions | All mutations must go through defined action methods |
| Persisting entire store | Use `partialize` to persist only what's needed |
| Importing store in service layer | Circular dependency — keep services store-free |

---

## 14. API Layer Setup

```typescript
// src/services/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// src/services/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    },
  );
}
```

### Service Functions

```
src/services/supabase/
├── client.ts              Browser Supabase client
├── server.ts              Server Supabase client
├── auth.ts                login, register, logout, OAuth
├── profile.ts             getProfile, updateProfile, updateXP
├── vocabulary.ts          getWords, getWordById, getTodayWords
├── battle.ts              startBattle, submitAnswer, getBattleResult
└── leaderboard.ts         getGlobalRanking, getFriendRanking
```

---

## 15. Supabase Client Setup

```typescript
// src/components/supabase-provider.tsx
'use client';

import { createContext, useContext, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/services/supabase/client';
import type { Database } from '@/types/database';

interface SupabaseContextValue {
  supabase: SupabaseClient<Database>;
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider');
  return ctx.supabase;
}
```

### Auth Provider

```typescript
// src/components/auth-provider.tsx
'use client';

import { useEffect } from 'react';
import { useSupabase } from './supabase-provider';
import { useAuthStore } from '@/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase, setSession, setUser]);

  return <>{children}</>;
}
```

---

## 16. Shared Component Implementation Order

Components must be built in this exact order. Each component depends on those before it.

### Order

1. **Icon** — Base icon component (SVG sprite). Required by almost everything.
2. **Skeleton** — Loading placeholder. Required by every data-dependent component.
3. **Badge** — Status indicator. Used by Avatar, Card, tabs.
4. **Avatar** — User image. Used by Profile, Leaderboard, TopBar.
5. **Button** — Most fundamental interactive element. 7 variants, 4 sizes.
6. **Card** — Primary content container. 3 variants, pressable state.
7. **ProgressBar** — Used by XP, HP, missions. Animated fill.
8. **Toast** — Feedback system. Queue + auto-dismiss.
9. **Tabs** — Horizontal tab navigation with animated indicator.
10. **Modal** + **BottomSheet** — Overlay components. Animated enter/exit.
11. **Tooltip** — Helper text on hover/focus.

### Button Specification

```typescript
// src/components/ui/Button.tsx
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'gold' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}
```

| Variant | Visual |
|---------|--------|
| primary | `bg-emerald-500 text-text-primary` — Main CTA |
| secondary | `bg-white/5 text-text-primary border border-white/10` — Default action |
| ghost | `bg-transparent text-text-secondary` — Low emphasis |
| danger | `bg-error text-white` — Destructive action |
| success | `bg-success text-white` — Correct answer |
| gold | `bg-gold-400 text-bg-primary` — Premium action |
| outline | `border border-emerald-500 text-emerald-500 bg-transparent` — Alternative |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | 36px | px-4 py-2 | label |
| md | 44px | px-5 py-3 | label |
| lg | 52px | px-6 py-4 | body-bold |
| xl | 60px | px-8 py-5 | body-bold |

### Card Specification

```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'compact';
  isPressable?: boolean;
  isGlowing?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

| Variant | Background | Shadow | Border |
|---------|-----------|--------|--------|
| default | `bg-bg-card` | `shadow-card` | `border border-white/5` |
| elevated | `bg-bg-elevated` | `shadow-xl` | `border border-white/10` |
| compact | `bg-bg-card` | `shadow-md` | `border border-white/5` |

---

## 17. Layout Component Build Plan

### AppShell

```typescript
// src/components/layout/AppShell.tsx
interface AppShellProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export function AppShell({ children, showTopBar = true, showBottomNav = true, className }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-dvh max-w-app mx-auto relative bg-bg-primary">
      {showTopBar && <TopBar />}
      <main className={cn('flex-1 overflow-y-auto px-4 pb-6', className)}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
```

### SafeAreaWrapper

```typescript
// src/components/layout/SafeAreaWrapper.tsx
interface SafeAreaWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function SafeAreaWrapper({ children, className }: SafeAreaWrapperProps) {
  return (
    <div
      className={cn(
        'pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right',
        className,
      )}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {children}
    </div>
  );
}
```

### ScreenContainer (Page Animation Wrapper)

```typescript
// src/components/layout/ScreenContainer.tsx
interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenContainer({ children, className }: ScreenContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={tweenPresets.normal}
      className={cn('pt-2', className)}
    >
      {children}
    </motion.div>
  );
}
```

### Main Layout (App Router)

```typescript
// src/app/(main)/layout.tsx
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
```

---

## 18. Navigation System Build Plan

### BottomNavigation

```typescript
// src/components/layout/BottomNavigation.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { springPresets } from '@/animations/presets';

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const TABS: TabConfig[] = [
  { id: 'home', label: 'Beranda', icon: <HomeIcon />, path: '/' },
  { id: 'battle', label: 'Battle', icon: <SwordIcon />, path: '/battle' },
  { id: 'progress', label: 'Progress', icon: <ChartIcon />, path: '/progress' },
  { id: 'profile', label: 'Profil', icon: <ProfileIcon />, path: '/profile' },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const activeIndex = TABS.findIndex((t) => pathname.startsWith(t.path));

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app
      bg-bg-surface/90 backdrop-blur-xl border-t border-white/5
      shadow-bottom-nav rounded-t-2xl z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center justify-center
                w-16 h-full gap-0.5 tap-highlight-transparent"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 bg-emerald-500 rounded-full"
                  transition={springPresets.snappy}
                />
              )}
              <span className={cn(
                'transition-colors duration-200',
                isActive ? 'text-emerald-400' : 'text-text-tertiary',
              )}>
                {tab.icon}
              </span>
              <span className={cn(
                'text-micro transition-colors duration-200',
                isActive ? 'text-emerald-400' : 'text-text-tertiary',
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

### Navigation Rules

1. 4 tabs max — cognitive limit per app-flow.md.
2. Active indicator uses `layoutId` for smooth Framer Motion spring animation.
3. Tab switch instan — no loading because Zustand preloads data.
4. Bottom nav has `backdrop-blur-xl` and `bg-bg-surface/90` for glassmorphism.
5. Add `pb-safe-bottom` (env(safe-area-inset-bottom)) padding to AppShell main content to prevent nav overlap.

### TopBar

```typescript
// src/components/layout/TopBar.tsx
'use client';

import { useProfileStore } from '@/stores/profileStore';
import { Mascot } from '@/components/shared/Mascot';

export function TopBar() {
  const profile = useProfileStore((s) => s.profile);
  const streak = profile?.currentStreak ?? 0;
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/90 backdrop-blur-lg
      border-b border-white/5 px-4 py-2">
      <div className="flex items-center justify-between max-w-app mx-auto">
        {/* Left: Streak */}
        <div className="flex items-center gap-1">
          <StreakIcon className="text-warning" />
          <span className="text-body-bold text-warning">{streak}</span>
        </div>

        {/* Center: Mascot */}
        <Mascot expression="happy" size="sm" />

        {/* Right: XP + Level */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <XPStarIcon className="text-emerald-400" />
            <span className="text-body-bold text-emerald-400">{xp.toLocaleString()}</span>
          </div>
          <span className="text-micro text-text-tertiary">Lv.{level}</span>
        </div>
      </div>
    </header>
  );
}
```

---

## 19. Home Screen Build Plan

### Component Tree

```
HomePage
├── ScreenContainer
│   ├── StreakIndicator        Daily streak + fire animation
│   ├── XPBar                  Progress to next level
│   ├── DailyMissionCard x3    Stacked mission cards with progress
│   ├── ContinueLearningCTA    "Lanjut Belajar" button (deep link to swipe)
│   ├── QuickBattleCTA         "Battle Cepat" button (deep link to battle)
│   └── Mascot                 Floating mascot with reactive expressions
```

### Data Flow

```typescript
// src/app/(main)/page.tsx (Server Component wrapper)
import { createServerSupabase } from '@/services/supabase/server';

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase.from('profiles').select('*').single();
  const { data: missions } = await supabase.from('daily_missions').select('*');

  return <HomeScreen profile={profile} missions={missions} />;
}

// src/components/home/HomeScreen.tsx ('use client')
interface HomeScreenProps {
  profile: Profile;
  missions: DailyMission[];
}
```

### Key Components

| Component | States | Animation |
|-----------|--------|-----------|
| StreakIndicator | loading, active, danger (0 streak), frozen | Fire glow pulse |
| XPBar | loading, empty, partial, full (level up) | Smooth fill + burst at 100% |
| DailyMissionCard | loading, locked, in-progress, completed, claimed | Slide up stagger (50ms delay each) |
| ContinueLearningCTA | default, has-session (resume) | Soft pulse glow |
| QuickBattleCTA | default | Scale on press |

---

## 20. Swipe Learning Build Plan

### Component Tree

```
SwipePage
├── SwipeHeader
│   ├── SessionProgress       Current card / total cards
│   ├── ComboIndicator        Combo counter + glow
│   └── CloseButton           Exit session (with confirm)
├── SwipeStack
│   └── SwipeCard x3          3-card stack (top card draggable)
│       ├── ArabicText         Large Arabic word
│       ├── Translation        Indonesian translation (reveal on swipe)
│       ├── AudioButton        Play pronunciation
│       └── ProgressIndicator  Know / Don't know marks
├── XPBurst                    Floating XP numbers on correct swipe
└── SessionSummary             Modal on session end
```

### SwipeCard Gesture Implementation

```typescript
// src/components/swipe/SwipeCard.tsx
'use client';

import { useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { swipeCard } from '@/animations/variants';

interface SwipeCardProps {
  word: Word;
  onSwipeLeft: () => void;  // "Tidak Tahu"
  onSwipeRight: () => void; // "Tahu"
  onTap: () => void;        // Reveal answer
  isTop: boolean;           // Only top card is draggable
}

export function SwipeCard({ word, onSwipeLeft, onSwipeRight, onTap, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.5, 1, 1, 1, 0.5]);
  const background = useTransform(
    x,
    [-300, -50, 50, 300],
    ['rgba(239,68,68,0.15)', 'rgba(239,68,68,0)', 'rgba(34,197,94,0)', 'rgba(34,197,94,0.15)'],
  );

  const controls = useDragControls();

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 100;
    const velocity = 500;

    if (info.offset.x > threshold || (info.offset.x > 50 && info.velocity.x > velocity)) {
      onSwipeRight();
    } else if (info.offset.x < -threshold || (info.offset.x < -50 && info.velocity.x < -velocity)) {
      onSwipeLeft();
    }
  };

  if (!isTop) {
    // Non-top cards are stacked with offset and scale
    return (
      <motion.div
        className="absolute inset-0 rounded-2xl bg-bg-card border border-white/5"
        style={{ scale: 0.95, y: 8 }}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl cursor-grab active:cursor-grabbing"
      style={{ x, rotate, background }}
      drag="x"
      dragControls={controls}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card content */}
      <div className="flex flex-col items-center justify-center h-full p-6">
        <ArabicText text={word.arabic} size="xl" />
        <AudioButton wordId={word.id} />
        {/* Translation shown after reveal */}
      </div>

      {/* Swipe hint overlays */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
      >
        <span className="text-error text-label font-bold">✗ Tidak Tahu</span>
      </motion.div>
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2"
        style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
      >
        <span className="text-success text-label font-bold">✓ Tahu</span>
      </motion.div>
    </motion.div>
  );
}
```

### SwipeStack (Card Management)

```typescript
// src/components/swipe/SwipeStack.tsx
export function SwipeStack() {
  const { words, currentIndex, swipeCard, revealCard } = useSwipeStore();
  const maxVisible = 3;
  const visibleWords = words.slice(currentIndex, currentIndex + maxVisible);

  return (
    <div className="relative w-full aspect-[3/4] mx-auto">
      {visibleWords.map((word, i) => (
        <SwipeCard
          key={word.id}
          word={word}
          isTop={i === 0}
          onSwipeLeft={() => swipeCard('left')}
          onSwipeRight={() => swipeCard('right')}
          onTap={revealCard}
        />
      ))}
    </div>
  );
}
```

### Swipe Session Flow

```
Start Session → Show Card 1 → Swipe Right (Tahu) → Combo +1, XP +10
                              → Swipe Left (Tidak Tahu) → Combo reset, show answer
                              → Tap → Reveal translation + audio play
                              → Next Card → After all cards → Session Summary Modal
```

### Key Animations

| Moment | Animation | Config |
|--------|-----------|--------|
| Card enter | Slide up + scale in | spring gentle |
| Card follow finger | Real-time rotation + opacity | MotionValue (no config) |
| Swipe dismiss (correct) | Fly right + fade + rotate | spring snappy, 300ms |
| Swipe dismiss (incorrect) | Fly left + fade + rotate | spring snappy, 300ms |
| Card return (not threshold) | Snap back to center | spring snappy |
| Combo increase | Scale 1→1.3→1 + gold glow | spring bouncy, 300ms |
| Combo break | Shake + red flash + scale down | tween fast, 200ms |
| XP burst | Multiple numbers float up + fade | staggered, expressive |

---

## 21. Battle Mode Build Plan

### Component Tree

```
BattleSelectPage
├── BattleHeader
├── QuickBattleCard            "Battle Cepat" — start immediately
├── BossBattleCard             "Boss Battle" — locked if not available
└── DifficultySelector         Easy / Medium / Hard (affects enemy HP + timer)

BattleArenaPage
├── BattleArena
│   ├── EnemySprite + HPBar   Top: enemy with health bar
│   ├── TimerBar              Countdown per question
│   ├── PlayerHPBar           Player health
│   ├── QuestionCard          Arabic word + options
│   ├── AnswerOptions x4       Multiple choice buttons
│   └── ComboIndicator        Answer streak during battle
├── DamageText                 Floating damage/heal numbers
└── BattleResult (Modal)
    ├── VictoryScreen          XP + coins + loot
    └── DefeatScreen           Retry option
```

### Battle State Machine

```
IDLE → LOADING → INTRO → ACTIVE → VICTORY / DEFEAT → IDLE
                (fetch)  (enemy   (question    (result modal)
                          intro)   loop)
```

### BattleArena Implementation

```typescript
// src/components/battle/BattleArena.tsx
export function BattleArena() {
  const { status, enemy, playerHp, enemyHp, questions, currentQuestionIndex, timeRemaining } =
    useBattleStore();

  if (status === 'loading') return <BattleSkeleton />;
  if (status === 'intro') return <EnemyIntro enemy={enemy!} />;

  if (status === 'active') {
    return (
      <div className="flex flex-col h-full gap-4 p-4">
        <EnemySection hp={enemyHp} maxHp={enemy?.maxHp ?? 100} enemy={enemy!} />
        <TimerBar value={timeRemaining} max={15} />
        <PlayerSection hp={playerHp} maxHp={100} />
        <QuestionCard question={questions[currentQuestionIndex]} />
        <AnswerOptions
          question={questions[currentQuestionIndex]}
          onAnswer={(idx) => answerQuestion(idx)}
        />
      </div>
    );
  }

  if (status === 'victory') return <VictoryScreen />;
  if (status === 'defeat') return <DefeatScreen />;

  return null;
}
```

### HPBar with Animation

```typescript
// src/components/battle/HPBar.tsx
interface HPBarProps {
  current: number;
  max: number;
  variant: 'player' | 'enemy';
}

export function HPBar({ current, max, variant }: HPBarProps) {
  const percentage = (current / max) * 100;
  const barColor = percentage > 50 ? 'bg-success'
    : percentage > 25 ? 'bg-warning'
    : 'bg-error';

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-micro font-semibold text-text-secondary">
          {variant === 'player' ? 'HP Kamu' : 'HP Musuh'}
        </span>
        <span className="text-micro font-semibold text-text-secondary">
          {current}/{max}
        </span>
      </div>
      <div className="h-3 bg-bg-surface rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', barColor)}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={tweenPresets.normal}
        />
      </div>
    </div>
  );
}
```

### Battle Effects

| Effect | Animation | Trigger |
|--------|-----------|---------|
| Correct answer | Green flash on answer + enemy HP decreases | Answer correct |
| Wrong answer | Red flash + screen shake + player HP decreases | Answer wrong |
| Enemy damage | Enemy sprite flash red + HP bar shrink | Correct answer |
| Player damage | Screen shake + HP bar shrink + red vignette | Wrong answer |
| Timer warning | Timer bar pulses red when <5s | Time remaining <5s |
| Victory | Confetti + XP burst + reward chest open | Battle end (win) |
| Defeat | Mascot sad + fade + "Coba Lagi" | Battle end (lose) |

---

## 22. Progress Screen Build Plan

### Component Tree

```
ProgressPage
├── RankDisplay               Current rank badge + level + XP to next
├── XPBreakdown               Today's XP, weekly XP, total XP
├── StatsGrid
│   ├── StatCard              Total words learned
│   ├── StatCard              Current streak
│   ├── StatCard              Battle wins
│   └── StatCard              Total sessions
├── BadgeGrid                 Grid of earned/locked badges
└── LearningHistory           Recent activity feed
```

### Data Flow

```typescript
// Server Component wrapper
export default async function ProgressPage() {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase.from('profiles').select('*').single();
  const { data: badges } = await supabase.from('user_badges').select('*, badges(*)');
  const { data: history } = await supabase.from('learning_sessions')
    .select('*').order('created_at', { ascending: false }).limit(20);

  return <ProgressScreen profile={profile} badges={badges} history={history} />;
}
```

### Badge Grid

```typescript
// src/components/progress/BadgeGrid.tsx
interface BadgeGridProps {
  badges: UserBadge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...tweenPresets.normal, delay: i * 0.05 }}
        >
          <Badge
            label={badge.badges.name}
            icon={badge.badges.icon}
            variant={badge.isEarned ? 'earned' : 'locked'}
            isNew={badge.isNew}
          />
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 23. Leaderboard Build Plan

### Component Tree

```
LeaderboardPage
├── Tabs                      Friends / Global
├── UserRankCard              Current user's rank (sticky top)
│   ├── RankNumber            #42
│   ├── Avatar                User avatar
│   ├── Username + Level
│   └── XP                    Total XP
└── LeaderboardList
    └── LeaderboardRow x50    Virtualized list
        ├── RankNumber        Rank position
        ├── Avatar            User avatar
        ├── Username + Level
        ├── XP                Total XP
        └── WinStreak         Current battle streak
```

### Virtualization

For 50+ leaderboard entries, use a virtualized list to maintain 60fps scroll performance. Use `react-virtual` or a lightweight custom implementation with `IntersectionObserver`.

```typescript
// Virtual list approach
const ROW_HEIGHT = 64; // px
const OVERSCAN = 5;

function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });

  // IntersectionObserver-based virtualization
  // Only render rows in visible range + overscan
}
```

---

## 24. Profile Screen Build Plan

### Component Tree

```
ProfilePage
├── ProfileCard
│   ├── Avatar                User photo (editable)
│   ├── Username              Display name
│   ├── Level + Rank          Current rank badge
│   └── EditButton            Edit profile
├── StatsGrid                 4 stat cards (words, streak, battles, days)
├── BadgeShowcase             Favorite badges (max 3)
├── InviteCard                "Ajak Teman" referral card
└── SettingsButton            Navigate to settings
```

---

## 25. Settings Screen Build Plan

Settings uses a BottomSheet (not a full page) per app-flow.md.

### Component Tree

```
SettingsSheet (BottomSheet)
├── SheetHeader               "Pengaturan" + close button
├── AudioSection
│   ├── Toggle                Sound Effects
│   ├── Toggle                Background Music
│   └── Slider                Volume
├── DisplaySection
│   ├── Toggle                Dark Mode / Light Mode
│   └── Toggle                Reduce Animations
├── AccountSection
│   ├── Button                Change Password
│   ├── Button                Email Preferences
│   └── Button (danger)       Logout
└── AppInfo                   Version, licenses, logout
```

### BottomSheet Implementation

```typescript
// src/components/ui/BottomSheet.tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: number[]; // e.g., [50, 80] = 50% or 80% height
}

export function BottomSheet({ isOpen, onClose, children, snapPoints = [50] }: BottomSheetProps) {
  // Drag to dismiss
  // Backdrop blur
  // Spring animation on open/close
  // Snap to nearest snap point on drag end
}
```

---

## 26. Share Card System Build Plan

### Implementation

```typescript
// src/components/shared/ShareCard.tsx
interface ShareCardProps {
  achievement: {
    type: 'streak' | 'level_up' | 'badge' | 'battle_win';
    count: number;
    label: string;
  };
  username: string;
}

export function ShareCard({ achievement, username }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate share card as canvas image
  // Includes: Harf branding, achievement graphic, username
  // Exports as PNG for sharing via Web Share API

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    );

    if (blob && navigator.share) {
      await navigator.share({
        title: 'Harf - Pencapaian',
        text: `Aku dapat ${achievement.label} di Harf!`,
        files: [new File([blob], 'achievement.png', { type: 'image/png' })],
      });
    }
  };
  // ...
}
```

### Share Triggers

| Event | Share Content |
|-------|---------------|
| Level up | "Naik level {n} di Harf!" + XP progress card |
| Streak milestone | "Streak {n} hari! 🔥" + streak card |
| Badge earned | "Dapat badge {name}!" + badge card |
| Battle win streak | "Menang {n} battle berturut-turut!" + battle card |

---

## 27. Reward Modal Build Plan

```typescript
// src/components/shared/RewardModal.tsx
interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: {
    xp?: number;
    coins?: number;
    badge?: Badge;
    streak?: number;
  };
  type: 'session_complete' | 'level_up' | 'battle_win' | 'mission_complete';
}

export function RewardModal({ isOpen, onClose, rewards, type }: RewardModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springPresets.bouncy}
        className="text-center p-6"
      >
        {/* Reward icon/illustration */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.6 }}
        >
          <RewardIcon />
        </motion.div>

        {/* XP reward with float animation */}
        {rewards.xp && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xp-value text-emerald-400">
              +{rewards.xp} XP
            </span>
          </motion.div>
        )}

        {/* Continue button */}
        <Button variant="gold" onClick={onClose} className="mt-6">
          Lanjut
        </Button>
      </motion.div>
    </Modal>
  );
}
```

---

## 28. Mascot System Build Plan

```typescript
// src/components/shared/Mascot.tsx
type MascotExpression = 'idle' | 'happy' | 'sad' | 'excited' | 'proud' | 'confused' | 'sleepy' | 'surprised';
type MascotSize = 'sm' | 'md' | 'lg';

interface MascotProps {
  expression?: MascotExpression;
  size?: MascotSize;
  className?: string;
  animate?: boolean;
  onClick?: () => void;
}

export function Mascot({ expression = 'idle', size = 'md', className, animate = true, onClick }: MascotProps) {
  const sizeMap = { sm: 40, md: 60, lg: 100 };

  return (
    <motion.div
      className={cn('relative cursor-pointer', className)}
      onClick={onClick}
      animate={animate ? getMascotAnimation(expression) : undefined}
      transition={getMascotTransition(expression)}
    >
      {/* SVG sprite based on expression */}
      <svg width={sizeMap[size]} height={sizeMap[size]} viewBox="0 0 60 60">
        <MascotBody expression={expression} />
      </svg>
    </motion.div>
  );
}

// Animation configs for each expression
function getMascotAnimation(expression: MascotExpression) {
  switch (expression) {
    case 'idle': return { y: [0, -4, 0] };
    case 'happy': return { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] };
    case 'excited': return { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] };
    case 'sad': return { scale: [1, 0.95, 1], y: [0, 2, 0] };
    case 'confused': return { rotate: [0, -15, 15, -15, 0] };
    default: return {};
  }
}

function getMascotTransition(expression: MascotExpression) {
  switch (expression) {
    case 'idle': return { duration: 3, repeat: Infinity, ease: 'easeInOut' };
    case 'happy': return { ...springPresets.wobbly, duration: 0.5 };
    case 'excited': return { ...springPresets.bouncy, duration: 0.6 };
    case 'sad': return { ...tweenPresets.slow };
    default: return { ...springPresets.snappy };
  }
}
```

### Expression Triggers

| Event | Expression | Duration |
|-------|-----------|----------|
| App idle | idle (float) | Loop |
| Correct swipe | happy | 500ms |
| Wrong swipe | sad | 500ms |
| Combo x5+ | excited | 600ms |
| Level up | proud | 800ms |
| Battle win | excited | 600ms |
| Battle lose | sad | 500ms |
| Streak milestone | proud | 600ms |

---

## 29. Notification System Build Plan

### Toast Component

```typescript
// src/components/ui/Toast.tsx
type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top' | 'bottom';

interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;     // ms, default 3000
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: ToastPosition;
}

// Managed by uiStore
interface ToastState {
  currentToast: ToastConfig | null;
  queue: ToastConfig[];
  showToast: (config: ToastConfig) => void;
  dismissToast: () => void;
}
```

### Toast States

| State | Visual |
|-------|--------|
| Enter | Slide up from bottom (or slide down from top), spring snappy |
| Visible | Static with auto-dismiss timer |
| Exit (auto) | Slide out + fade, tween fast |
| Exit (tap) | Immediate dismiss |

---

## 30. Loading State System Build Plan

### Loading State Architecture

Every data-dependent view must implement the ENTER → LOADING → RENDERED state machine from `screen-specs.md`.

```typescript
// Pattern for all screens
export function ScreenWithData() {
  const isLoading = useStore((s) => s.isLoading);
  const error = useStore((s) => s.error);
  const data = useStore((s) => s.data);

  if (isLoading) return <ScreenSkeleton />;
  if (error) return <ScreenError onRetry={retry} />;
  if (!data || data.length === 0) return <ScreenEmpty />;

  return <ScreenContent data={data} />;
}
```

### Loading by Duration

| Expected Duration | Visual |
|------------------|--------|
| <200ms | Nothing (instant) |
| 200ms – 1s | Skeleton (pulse) |
| 1s – 3s | Skeleton + "Memuat..." |
| >3s | Skeleton + progress indicator + mascot animation |

---

## 31. Skeleton UI Build Plan

### Skeleton Component

```typescript
// src/components/ui/Skeleton.tsx
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
  className?: string;
}

export function Skeleton({ width, height, variant = 'text', count = 1, className }: SkeletonProps) {
  const baseClass = 'bg-bg-elevated animate-skeleton-pulse rounded-md';

  const variantClass = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'h-32 w-full rounded-2xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(baseClass, variantClass[variant], className)}
          style={{ width, height }}
        />
      ))}
    </>
  );
}
```

### Screen Skeletons

| Screen | Skeleton Layout |
|--------|-----------------|
| Home | 3 skeleton cards stacked + 2 skeleton bars |
| Swipe | 1 large skeleton card (aspect-ratio 3/4) |
| Battle | Skeleton enemy + skeleton HP bar + skeleton question |
| Progress | 4 skeleton stat cards + 8 skeleton badges (grid) |
| Leaderboard | 10 skeleton rows |

---

## 32. Empty State Build Plan

### Empty State Pattern

```typescript
// src/components/shared/EmptyState.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  mascot?: boolean;
}

export function EmptyState({ icon, title, description, action, mascot = true }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {mascot ? (
        <Mascot expression="confused" size="lg" />
      ) : icon}
      <h3 className="text-heading-2 text-text-primary mt-4">{title}</h3>
      <p className="text-body text-text-secondary mt-2">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
```

### Empty States Per Screen

| Screen | Empty State |
|--------|-------------|
| Swipe | "Belum ada kata untuk dipelajari hari ini" + "Ambil Vocabulary Baru" |
| Battle History | "Belum pernah battle" + "Battle Sekarang" |
| Badges | "Kumpulkan badge dengan rajin belajar" |
| Leaderboard (friends) | "Ajak temanmu belajar di Harf" + "Ajak Teman" |
| Notifications | "Tidak ada notifikasi" |

---

## 33. Error State Build Plan

### Error State Pattern

```typescript
// src/components/shared/ErrorState.tsx
interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = "Yah, ada yang error!", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <Mascot expression="sad" size="lg" />
      <h3 className="text-heading-2 text-text-primary mt-4">{message}</h3>
      <p className="text-body text-text-secondary mt-2">
        Coba periksa koneksi internetmu
      </p>
      <Button variant="primary" onClick={onRetry} className="mt-6">
        Coba Lagi
      </Button>
    </div>
  );
}
```

### Error State Triggers

| Situation | Error Message | Recovery |
|-----------|---------------|----------|
| Network offline | "Koneksi terputus" | Auto-retry on reconnect |
| API 500 | "Server sedang sibuk" | Manual retry |
| Auth expired | "Sesi habis, login lagi" | Redirect to login |
| Rate limited | "Terlalu cepat, istirahat dulu" | Auto-retry after cooldown |
| Vocabulary fetch fail | "Gagal memuat kata" | Manual retry |

---

## 34. Offline Support Build Plan

### Strategy

```typescript
// src/hooks/useNetwork.ts
export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return isOnline;
}
```

### Offline Behavior

| Feature | Online | Offline |
|---------|--------|---------|
| Swipe learning | Fetch words from Supabase | Use cached vocabulary (localStorage) |
| Session save | Sync to Supabase | Queue in localStorage, sync on reconnect |
| Battle | Real-time from server | "Mode Battle memerlukan koneksi internet" |
| XP update | Immediate sync | Queue batch update, sync on reconnect |
| Leaderboard | Live data | Show cached data + "Data mungkin tidak terbaru" |
| Profile | Fetch latest | Show cached profile |
| Mascot reactions | Based on real events | Based on cached/local events |

### Offline Banner

```typescript
// Offline indicator (managed by uiStore)
export function OfflineBanner() {
  const isOnline = useNetwork();

  if (isOnline) return null;

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-warning text-bg-primary
        text-label text-center py-2"
    >
      Kamu sedang offline. Data akan tersimpan.
    </motion.div>
  );
}
```

---

## 35. Gesture System Build Plan

### useSwipe Hook

```typescript
// src/hooks/useSwipe.ts
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number;   // px, default 50
  velocity?: number;    // px/ms, default 500
  preventDefault?: boolean;
}

export function useSwipe(
  ref: RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  config: SwipeConfig = {},
) {
  // Track touchstart/touchend coordinates
  // Calculate dx, dy, velocity
  // Compare against threshold + velocity
  // Call appropriate handler
}
```

### Gesture Map

| Gesture | Component | Action | Threshold |
|---------|-----------|--------|-----------|
| Swipe left | SwipeCard | "Tidak Tahu" | 30% card width |
| Swipe right | SwipeCard | "Tahu" | 30% card width |
| Tap | SwipeCard | Reveal answer | — |
| Tap | Button | Execute action | — |
| Long press | (Future) | Word detail | 500ms |
| Swipe down | BottomSheet | Dismiss | 30% sheet height |
| Swipe right | Screen | Go back (native) | System gesture |

### Framer Motion Drag vs Custom

| Use Case | Approach |
|----------|----------|
| SwipeCard | Framer Motion `<motion.div drag>` — handles physics, spring, snap |
| BottomSheet | Framer Motion `<motion.div drag="y">` with snap points |
| Button press | Framer Motion `whileTap` |
| Custom gesture (no animation) | Raw `useSwipe` hook (e.g., swipe to refresh) |
| System back gesture | Native (browser handles) |

---

## 36. Audio System Build Plan

### Audio Service

```typescript
// src/services/audio.ts
class AudioService {
  private audioContext: AudioContext | null = null;
  private cache: Map<string, AudioBuffer> = new Map();
  private queue: string[] = [];
  private isPlaying = false;

  async init() {
    this.audioContext = new AudioContext();
  }

  async preload(wordId: string, url: string) {
    if (this.cache.has(wordId)) return;
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext!.decodeAudioData(buffer);
    this.cache.set(wordId, audioBuffer);
  }

  async play(wordId: string) {
    const buffer = this.cache.get(wordId);
    if (!buffer || !this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  playSFX(type: 'correct' | 'incorrect' | 'combo' | 'levelup' | 'battle_hit') {
    // Short sound effect from preloaded sprite
  }

  setSpeed(speed: 'normal' | 'slow' | 'very_slow') {
    // Adjust playbackRate on AudioBufferSourceNode
    const rates = { normal: 1, slow: 0.75, very_slow: 0.5 };
    // Apply to next playback
  }
}

export const audioService = new AudioService();
```

### AudioButton Component

```typescript
// src/components/shared/AudioButton.tsx
interface AudioButtonProps {
  wordId: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function AudioButton({ wordId, size = 'md', className }: AudioButtonProps) {
  const { isPlaying, play, stop } = useAudioStore();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => isPlaying ? stop() : play(wordId)}
      className={cn(
        'rounded-full bg-white/10 flex items-center justify-center',
        'active:bg-white/20 transition-colors',
        size === 'md' ? 'w-12 h-12' : 'w-10 h-10',
        isPlaying && 'bg-emerald-500/20',
        className,
      )}
    >
      {isPlaying ? (
        <WaveformIcon className="text-emerald-400" />
      ) : (
        <SpeakerIcon className="text-text-secondary" />
      )}
    </motion.button>
  );
}
```

### Audio Preloading Strategy

| When | What to Preload |
|------|-----------------|
| App mount | UI sound effects sprite |
| Session start | Current batch of vocabulary audio |
| Next card prep | Preload next 3 cards' audio in background |

---

## 37. Analytics Integration Plan

### Analytics Service

```typescript
// src/services/analytics.ts
type EventName =
  | 'session_start'
  | 'session_complete'
  | 'swipe_correct'
  | 'swipe_incorrect'
  | 'combo_milestone'
  | 'battle_start'
  | 'battle_win'
  | 'battle_lose'
  | 'level_up'
  | 'streak_milestone'
  | 'badge_earned'
  | 'mission_complete'
  | 'share';

interface EventProperties {
  [key: string]: string | number | boolean;
}

class AnalyticsService {
  private enabled = true;

  track(event: EventName, properties?: EventProperties) {
    if (!this.enabled) return;
    // Send to analytics provider (PostHog / GA4 / Mixpanel)
    // In development: console.log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, properties);
    }
  }

  identify(userId: string, traits?: Record<string, string | number>) {
    // Identify user in analytics provider
  }

  pageView(path: string) {
    this.track('page_view', { path });
  }
}

export const analytics = new AnalyticsService();
```

### Key Events to Track

| Event | When | Properties |
|-------|------|------------|
| `session_start` | User starts swipe session | word_count, time_of_day |
| `swipe_correct` | Card swiped right | word_id, combo_count |
| `swipe_incorrect` | Card swiped left | word_id, combo_count |
| `combo_milestone` | Combo reaches 5/10/25/50 | combo_count |
| `battle_start` | Battle begins | difficulty, enemy_type |
| `battle_win` | Battle won | xp_earned, accuracy |
| `battle_lose` | Battle lost | accuracy, enemy |
| `level_up` | User reaches new level | new_level, total_xp |
| `streak_milestone` | Streak reaches 7/30/100 | streak_count |
| `badge_earned` | Badge unlocked | badge_name, badge_type |
| `share` | User shares achievement | share_type |
| `mission_complete` | Daily mission done | mission_type |

---

## 38. Performance Optimization Plan

### Optimization Checklist

| Category | Technique | Priority |
|----------|-----------|----------|
| **Bundle** | Dynamic imports for heavy components (BattleArena, RewardModal) | High |
| **Bundle** | Code splitting by route (Next.js App Router does this automatically) | High |
| **Bundle** | Tree-shake unused Framer Motion features | Medium |
| **Rendering** | `React.memo` on pure UI components (Button, Card, Badge, Icon) | High |
| **Rendering** | Zustand selector optimization (avoid full store subscriptions) | High |
| **Rendering** | `useMemo` for expensive computations (badge progress, XP math) | Medium |
| **Rendering** | `useCallback` for event handlers passed to child components | Medium |
| **Animation** | GPU-accelerated properties only (transform, opacity) | High |
| **Animation** | `will-change: transform` on draggable/swipeable elements | High |
| **Animation** | Reduce particle count on low-end devices | Medium |
| **Images** | Next.js `Image` component with lazy loading | High |
| **Images** | WebP format with AVIF fallback | Medium |
| **Fonts** | Variable fonts (single file for all weights) | High |
| **Fonts** | `font-display: swap` to prevent invisible text | High |
| **Data** | Server Components for initial data fetch | High |
| **Data** | Optimistic UI updates (update Zustand before server confirms) | High |
| **Layout** | `content-visibility: auto` on far-content (leaderboard rows) | Low |
| **Layout** | Avoid layout shifts (set explicit dimensions on images/cards) | High |

### Dynamic Import Strategy

```typescript
// Heavy components loaded only when needed
const BattleArena = dynamic(() => import('@/components/battle/BattleArena'), {
  loading: () => <BattleSkeleton />,
  ssr: false,
});

const RewardModal = dynamic(() => import('@/components/shared/RewardModal'), {
  ssr: false,
});

const ShareCard = dynamic(() => import('@/components/shared/ShareCard'), {
  ssr: false,
});
```

### Rerender Prevention

```typescript
// ❌ BAD: Full store subscription causes rerender on ANY store change
const store = useProfileStore();

// ✅ GOOD: Selective subscription
const xp = useProfileStore((s) => s.profile?.xp);
const addXP = useProfileStore((s) => s.addXP);

// ✅ GOOD: React.memo for pure presentational components
const MemoizedCard = React.memo(Card);
const MemoizedButton = React.memo(Button);
const MemoizedBadge = React.memo(Badge);

// ❌ BAD: Inline function in render (breaks memo)
<MemoizedButton onClick={() => handleClick(id)} />

// ✅ GOOD: Stable callback (useCallback or store action)
const handleClick = useCallback(() => handleClick(id), [id]);
```

### Performance Budget

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Time to Interactive | <3.5s | Lighthouse |
| Total Bundle Size (JS) | <200KB gzipped | Bundle analyzer |
| Animation Frame Rate | 60fps | Chrome DevTools Performance |
| Zustand Store Updates | <1ms per dispatch | Chrome DevTools |
| Touch Response | <100ms | Chrome DevTools |

---

## 39. Accessibility Validation Plan

### Standards

- WCAG 2.1 AA minimum
- Target: WCAG 2.1 AAA for color contrast

### Checklist

| Category | Requirement | Implementation |
|----------|-------------|----------------|
| **Semantic HTML** | Use `<button>` for buttons, `<nav>` for nav, `<main>` for content | All interactive elements use semantic tags |
| **ARIA Labels** | Icon buttons need `aria-label` | `aria-label="Putar audio"` on AudioButton |
| **ARIA Live** | Toast notifications use `role="alert"` `aria-live="assertive"` | Toast component |
| **Focus** | Visible focus ring on all interactive elements | `focus-visible:ring-2 ring-emerald-400` |
| **Focus Order** | Logical tab order through battle flow | TabIndex managed in battle question loop |
| **Touch Target** | Minimum 44x44dp for all interactive elements | All buttons meet or exceed this |
| **Color Contrast** | Text meets 4.5:1 ratio on all backgrounds | Design tokens validated against bg-primary |
| **Reduced Motion** | Respect `prefers-reduced-motion` | Reduce all animations to fade transitions |
| **Screen Reader** | Arabic text has `lang="ar"` | ArabicText component |
| **Screen Reader** | Swipe actions announced | `aria-live="polite"` on combo, XP changes |
| **Keyboard** | All actions accessible via keyboard | Swipe cards have keyboard alternatives (← →) |
| **Error** | Error messages announced | `role="alert"` on error state |

### Reduced Motion

```typescript
// src/hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Usage: Replace spring with tween fade when reduced motion
const animation = useReducedMotion()
  ? { transition: tweenPresets.fast, animate: { opacity: 1 } }
  : { variants: slideUp, transition: springPresets.gentle };
```

---

## 40. Mobile Optimization Plan

### Thumb Zone Design

```
┌──────────────────┐
│ ⭐  🔥  [XP]    │  ZONE TOP (info only — 60px)
│                  │      Reach: hard (thumb stretch)
│                  │      Content: streak, XP, mascot
│                  │
│     ┌──────┐    │
│     │ CARD │    │  ZONE MID (swipe — content)
│     └──────┘    │      Reach: moderate
│                  │      Content: vocabulary, battle
│                  │
│  [BTN]   [BTN]  │  ZONE BOTTOM (action — 80px)
│                  │      Reach: natural thumb zone
│ [🏠][👆][⚔️][📊]│      Content: CTA buttons, nav
└──────────────────┘
```

### Mobile-Specific CSS

```css
/* Safe area insets for notched devices */
@supports (padding: env(safe-area-inset-bottom)) {
  .pb-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
  .pt-safe-top { padding-top: env(safe-area-inset-top); }
}

/* Prevent text size adjust on orientation change */
html { -webkit-text-size-adjust: 100%; }

/* Disable double-tap zoom on interactive elements */
button, a { touch-action: manipulation; }

/* Smooth scrolling but not on carousel/swipe areas */
.app-scroll {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
}
```

### Mobile Viewport Meta

```typescript
// In RootLayout head
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0A0F1E" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### Touch Optimization

| Technique | Implementation |
|-----------|----------------|
| 200ms debounce on battle answers | `useRef` + `setTimeout` to prevent double-tap |
| Swipe-only zone (card) vs tap-only zone (buttons) | Separate event handling by DOM region |
| No swipe-to-go-back on Android | CSS `overscroll-behavior-x: none` on swipe page |
| Prevent text selection during swipe | `user-select: none` on swipe card |
| Remove tap highlight | `-webkit-tap-highlight-color: transparent` |

---

## 41. QA Checklist

### UI Consistency Checklist

- [ ] All buttons use variants from the Button component (no custom button styles)
- [ ] All cards use the Card component with proper variant
- [ ] All modals use the Modal or BottomSheet component
- [ ] All loading states use the Skeleton component
- [ ] All empty states use the EmptyState component
- [ ] All error states use the ErrorState component
- [ ] All Arabic text uses the ArabicText component
- [ ] All icons use the Icon component (no inline SVGs)
- [ ] Spacing follows the 4px base unit consistently
- [ ] Border radius follows the radius tokens consistently
- [ ] Shadows follow the shadow tokens consistently

### Animation Consistency Checklist

- [ ] All spring animations use presets from `@/animations/presets`
- [ ] All page transitions use variants from `@/animations/variants`
- [ ] All animation durations match `design-system.md` §15
- [ ] Button press always uses `whileTap={{ scale: 0.95 }}`
- [ ] Modal enter uses spring gentle, exit uses tween fast
- [ ] Toast enter uses spring snappy, exit uses tween normal
- [ ] No animation on `prefers-reduced-motion: reduce`
- [ ] No layout-affecting animations (width, height, top, left)

### Responsive Checklist

- [ ] Layout works on 320px (small mobile)
- [ ] Layout works on 375px (iPhone SE)
- [ ] Layout works on 390px (iPhone 14)
- [ ] Layout works on 430px (iPhone 14 Pro Max)
- [ ] Layout works on 768px (tablet — centered container)
- [ ] Layout works on 1024px+ (desktop — centered container with max-w-app)
- [ ] Safe area insets respected on notched devices
- [ ] Bottom nav not overlapping content on devices with home indicator

### Accessibility Checklist

- [ ] All interactive elements have visible focus indicators
- [ ] All icon-only buttons have `aria-label`
- [ ] All images have `alt` text
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- [ ] App is fully keyboard-navigable
- [ ] Swipe actions have keyboard alternatives
- [ ] Screen reader announces XP changes, combos, errors
- [ ] Arabic text is properly tagged with `lang="ar"`
- [ ] Reduced motion mode disables all decorative animations

### Performance Checklist

- [ ] No unnecessary re-renders (verified with React DevTools Profiler)
- [ ] All images use Next.js Image with lazy loading
- [ ] Dynamic imports used for heavy components (BattleArena, RewardModal)
- [ ] Zustand selectors are granular (no full store subscriptions)
- [ ] Bundle size analyzed and under 200KB gzipped
- [ ] Lighthouse score ≥90 for all categories
- [ ] 60fps during swipe animation (verified with Chrome DevTools)
- [ ] 60fps during battle animations (verified with Chrome DevTools)
- [ ] No layout shifts during page transitions

---

## 42. Testing Strategy

### Unit Tests (Vitest)

| Layer | What to Test | Target Coverage |
|-------|-------------|-----------------|
| Utils | `cn()`, `format()`, `storage()` | 100% |
| Hooks | `useSwipe`, `useNetwork`, `useReducedMotion` | 100% |
| Stores | All Zustand actions + state transitions | 100% |
| Services | All Supabase service functions (mocked) | 100% |
| Components (ui) | Button, Card, Modal, Toast, Skeleton, Badge | 80%+ |

### Integration Tests (Vitest + Testing Library)

| Feature | What to Test |
|---------|-------------|
| Swipe flow | Start session → swipe correct → XP earned → next card → session end |
| Battle flow | Start battle → answer → HP changes → victory/defeat → reward |
| Auth flow | Login → redirect to home → logout → redirect to auth |
| Streak flow | Open app → streak shows → complete session → streak increments |

### E2E Tests (Playwright / Cypress)

| Flow | What to Verify |
|------|---------------|
| Full onboarding | Splash → onboard → auth → home |
| Full swipe session | Home → swipe → 10 cards → summary modal → XP added |
| Full battle | Battle select → arena → answer all → result → XP |
| Leaderboard view | Profile → progress → leaderboard → ranking visible |

### Test Patterns

```typescript
// Store test example
describe('swipeStore', () => {
  beforeEach(() => {
    useSwipeStore.setState(initialSwipeState);
  });

  it('should increment combo on correct swipe', () => {
    useSwipeStore.getState().startSession(mockWords);
    useSwipeStore.getState().swipeCard('right');

    expect(useSwipeStore.getState().combo).toBe(1);
    expect(useSwipeStore.getState().currentIndex).toBe(1);
  });

  it('should reset combo on incorrect swipe', () => {
    useSwipeStore.getState().startSession(mockWords);
    useSwipeStore.getState().swipeCard('right'); // combo = 1
    useSwipeStore.getState().swipeCard('left');  // combo reset

    expect(useSwipeStore.getState().combo).toBe(0);
  });

  it('should end session when all cards are swiped', () => {
    useSwipeStore.getState().startSession(mockWords);
    mockWords.forEach(() => useSwipeStore.getState().swipeCard('right'));

    expect(useSwipeStore.getState().isComplete).toBe(true);
  });
});

// Component test example
describe('Button', () => {
  it('should render children', () => {
    render(<Button>Klik</Button>);
    expect(screen.getByText('Klik')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoading', () => {
    render(<Button isLoading>Klik</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Klik')).not.toBeInTheDocument();
  });

  it('should apply correct variant classes', () => {
    render(<Button variant="danger">Hapus</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-error');
  });
});
```

### Testing Tools

| Layer | Tool | Config |
|-------|------|--------|
| Unit + Integration | Vitest | `vitest.config.ts` with jsdom environment |
| Component Testing | @testing-library/react + @testing-library/user-event | Vitest setup |
| E2E | Playwright | `playwright.config.ts` with mobile viewport |
| Animation | Vitest + jest-axe | Verify accessibility, not visual output |
| Visual Regression | Chromatic / Percy | On PR review |

---

## 43. Refactoring Strategy

### When to Refactor

| Trigger | Action |
|---------|--------|
| Component exceeds 300 lines | Extract sub-components |
| File imports >15 dependencies | Split into smaller modules |
| Store has >20 actions | Split into multiple stores |
| Animation logic mixed with business logic | Extract animation to wrapper component |
| Same pattern appears 3+ times | Extract to shared utility or component |
| css class string >3 conditionals | Extract to `cn()` with variants object |
| Zustand selector pattern repeated | Create custom hook or selector file |

### Refactoring Process

1. **Identify** — Run code analysis (ESlint complexity, bundle size impact)
2. **Isolate** — Write tests for the code to be refactored
3. **Extract** — Move logic to appropriate layer (hook → store → service)
4. **Replace** — Update all references
5. **Verify** — Run full test suite + manual QA pass

### Code Deletion Rules

- Dead code >2 weeks old with no references → delete
- Commented-out code → delete (git history has it)
- Console.log in production → delete
- Unused imports → delete (enforce via ESLint `no-unused-vars`)

---

## 44. Code Review Rules

### Mandatory Checks

| Check | Automation | Reviewer |
|-------|-----------|----------|
| TypeScript strict mode passes | CI | — |
| ESLint passes (no warnings) | CI | — |
| Prettier formatting | CI | — |
| No `any` types | CI | — |
| No console.log | CI | — |
| Test coverage maintained | CI | — |
| Bundle size within budget | CI | — |
| No duplicate components | — | Reviewer |
| No inline animation configs | — | Reviewer |
| No store mutations outside actions | — | Reviewer |
| Proper Zustand selectors (no full store) | — | Reviewer |
| Mobile-first (not desktop-first) | — | Reviewer |

### Review Checklist for New Components

- [ ] Does this component already exist in the UI kit?
- [ ] Can this be composed from existing components?
- [ ] Are all states handled (loading, empty, error, success)?
- [ ] Are all animation presets imported from `@/animations/`?
- [ ] Is the component mobile-first (375px)?
- [ ] Are touch targets ≥44x44dp?
- [ ] Are ARIA labels provided for icon-only elements?
- [ ] Is the component memoized if it receives props?
- [ ] Are there any hardcoded values that should be tokens?

---

## 45. CI/CD Preparation

### Pipeline Stages

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm run test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - uses: actions/download-artifact@v4
        with:
          name: build-output
      - run: npm run test:e2e
```

### Required Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && prettier --check .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## 46. Production Readiness Checklist

### Pre-Launch Checklist

- [ ] All 48 sections of this plan implemented
- [ ] TypeScript strict mode — zero errors
- [ ] ESLint — zero warnings
- [ ] All unit tests pass (coverage ≥80%)
- [ ] All E2E tests pass
- [ ] Lighthouse scores ≥90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Bundle size ≤200KB gzipped (analyzed via `@next/bundle-analyzer`)
- [ ] All animations tested at 60fps on mid-range Android device
- [ ] Offline mode tested (airplane mode → cached content → reconnect → sync)
- [ ] Reduced motion mode tested
- [ ] Screen reader tested (VoiceOver iOS + TalkBack Android)
- [ ] Safe area insets tested on notched devices (iPhone 14 Pro Max, Pixel 7 Pro)
- [ ] PWA manifest configured + service worker registered
- [ ] OAuth flow tested (Google login complete)
- [ ] Streak recovery tested (what happens at midnight?)
- [ ] Battle timeout tested (what happens if user walks away during battle?)
- [ ] Error boundaries tested (throw error → fallback UI → recover)
- [ ] Analytics events validated
- [ ] `Sentry` / error tracking configured

### Post-Launch Monitoring

| Metric | Target | Tool |
|--------|--------|------|
| Page Load Time (p50) | <2s | Vercel Analytics |
| Page Load Time (p95) | <4s | Vercel Analytics |
| Animation FPS (p50) | 60fps | Chrome User Experience Report |
| JS Error Rate | <0.1% | Sentry |
| API Error Rate | <1% | Sentry |
| User Session Duration | >5min | Analytics |
| Daily Active Users | — | Analytics |
| Crash-Free Rate | >99.5% | Sentry |

---

## 47. Technical Debt Prevention

### Rules to Live By

1. **No skipping phases** — Never build a screen before its shared components exist.
2. **No inline styles** — Everything in Tailwind classes or theme tokens.
3. **No magic numbers** — Every value comes from a token, constant, or config.
4. **No duplicate logic** — If you write it twice, extract it.
5. **No large components** — Max 300 lines. Split or die.
6. **No deep imports** — Import from barrel files, not nested paths.
7. **No store in services** — Circular dependency risk.
8. **No `any`** — TypeScript strict mode enforced.
9. **No useEffect for data** — Server Components or React Query.
10. **No untested stores** — Every store action must have a unit test.

### Code Review as Debt Prevention

Every PR must be reviewed with the "Technical Debt Prevention" lens:
- Does this introduce an anti-pattern listed in this document?
- Does this bypass the dependency hierarchy (e.g., importing a store from a service)?
- Does this add complexity that could be solved by an existing component?

### Architecture Decision Records

For significant architectural decisions, create an ADR in `docs/adr/`:

```
docs/adr/
├── 001-use-zustand-over-redux.md
├── 002-mobile-first-constraint.md
├── 003-animation-preset-system.md
└── ...
```

---

## 48. Future Expansion Readiness

### Architecture Resilience

The layered architecture is designed for:

| Future Feature | How It Fits |
|----------------|-------------|
| **Native app (React Native)** | Shared Zustand stores + service layer can be reused; UI kit replaced with RN components |
| **Grammar lessons** | New feature module `components/grammar/` + `stores/grammarStore.ts` |
| **Writing practice (Arabic script)** | New immersive screen + canvas-based handwriting component |
| **Social features (chat, guilds)** | New feature module `components/social/` with sub-navigation |
| **AI tutor** | New service `services/ai.ts` integrated into swipe/battle |
| **Subscription / Premium** | New `services/payment.ts` + feature flags in Zustand |
| **Desktop / Tablet** | Responsive breakpoints already in Tailwind; `max-w-app` container centers content |
| **Push notifications** | Service worker + `services/notifications.ts` |
| **AR / Camera features** | New immersive screen with camera permission flow |
| **Multiple language targets** | Content-driven; architecture doesn't change |

### Scaling Considerations

| Concern | Mitigation |
|---------|------------|
| Store complexity | Split stores at 15+ actions; use slices pattern |
| Component count >200 | Reorganize by domain; consider Nx monorepo |
| Bundle growth >300KB | Aggressive code splitting; route-based chunks |
| Animation complexity | Move heavy effects to Web Workers / Canvas |
| State management | Consider Zustand middleware (immer, devtools) at scale |
| Testing time | Snapshot testing for UI; integration tests for flows |

### Performance Budgets for Future

| Metric | Current Target | Future Target (v2) |
|--------|---------------|-------------------|
| JS Bundle | <200KB gzipped | <150KB gzipped |
| FCP | <1.5s | <1s |
| LCP | <2.5s | <1.8s |
| TTI | <3.5s | <2.5s |
| Animation FPS | 60fps | 120fps on ProMotion |

---

## Appendix: Implementation Timeline Example

### Week 1-2: Foundation + UI Kit

```
Day 1-2:  Next.js init, Tailwind config, design tokens, globals.css
Day 3-4:  Animation presets, variants, wrapper components
Day 5:    cn() utility, types, constants
Day 6-7:  All Zustand stores (auth, swipe, battle, profile, ui, audio)
Day 8-9:  Supabase client + all service functions
Day 10:   useSwipe, useNetwork, useReducedMotion hooks
Day 11-14: Shared UI kit (Icon, Skeleton, Badge, Avatar, Button, Card)
```

### Week 3-4: UI Kit + Layout + Core Features

```
Day 15-16: ProgressBar, Toast, Tabs, Modal, BottomSheet
Day 17-18: SafeAreaWrapper, AppShell, TopBar, BottomNavigation
Day 19:    Home page components (StreakIndicator, XPBar, DailyMissionCard)
Day 20-22: Swipe feature (VocabularyCard, SwipeCard, SwipeStack)
Day 23-24: ComboIndicator, XPBurst, AudioButton, SessionProgress
Day 25:    Mascot (all expressions + animations)
Day 26-28: Battle feature (HPBar, QuestionCard, AnswerOptions, BattleArena)
```

### Week 5-6: Screens

```
Day 29-30: Home screen + data fetching
Day 31-32: Swipe session screen
Day 33-34: Battle select + arena screens
Day 35:    Progress screen
Day 36:    Profile + Settings screens
Day 37:    Leaderboard + social screens
Day 38:    Reward Modal, Share Card, Notifications
```

### Week 7: Polish + QA

```
Day 39-40: Page transitions + micro-interactions
Day 41:    Skeleton loading states for all screens
Day 42:    Offline support + sync queue
Day 43:    Performance audit + optimization
Day 44:    Accessibility audit + fixes
Day 45:    E2E tests
Day 46-47: QA + bug fixes
Day 48:    Production build + CI/CD verification
```

---

*End of UI Implementation Plan — Harf v1.0*
