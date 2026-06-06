# Engineering Rules — Harf

**Version:** 1.0  
**Status:** Enforced  
**Audience:** All Engineering Team Members  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS · Framer Motion · Zustand · Supabase  

---

## Table of Contents

1. Engineering Philosophy
2. Core Development Principles
3. Frontend Architecture Rules
4. Backend Architecture Rules
5. Mobile-First Rules
6. UI Consistency Rules
7. Animation Rules
8. Component Rules
9. State Management Rules
10. API Integration Rules
11. Database Access Rules
12. Supabase Rules
13. Folder Structure Rules
14. Naming Convention Rules
15. File Organization Rules
16. TypeScript Rules
17. Tailwind Rules
18. Accessibility Rules
19. Performance Rules
20. Reusability Rules
21. Scalability Rules
22. Error Handling Rules
23. Logging Rules
24. Security Rules
25. Authentication Rules
26. Offline Support Rules
27. Testing Rules
28. QA Rules
29. Refactoring Rules
30. Git Workflow Rules
31. Pull Request Rules
32. Documentation Rules
33. Animation Performance Rules
34. Responsive Rules
35. Code Review Checklist
36. Technical Debt Prevention
37. Anti-Pattern Warnings
38. Production Readiness Rules
39. Future Expansion Rules

---

## 1. Engineering Philosophy

### The Harf Engineering Mindset

```
Kami tidak membuat aplikasi belajar.
Kami membuat game yang kebetulan mengajarkan bahasa Arab.

Setiap baris kode harus terasa seperti bagian dari game —
responsif, memuaskan, dan tidak pernah membuat user menunggu.
```

### Three Pillars

| Pillar | Description |
|--------|-------------|
| **Craft over speed** | Write code like you're crafting a game mechanic. Every component is an interaction. Every millisecond counts. |
| **Consistency over cleverness** | Clever one-liners are tech debt. Boring, predictable code is production-grade. |
| **Mobile-first, always** | If it doesn't work on a 375px screen with one thumb, it doesn't ship. |

### The User's Expectations

Harf users are mobile gamers, not students. They expect:
- **<100ms** response to any tap
- **60fps** animations at all times
- **Zero** loading spinners on navigation
- **Satisfying** feedback for every action
- **Recoverable** state if they close the app mid-session

---

## 2. Core Development Principles

### The 10 Non-Negotiables

| # | Principle | If Broken |
|---|-----------|-----------|
| 1 | **Mobile-first** — 375px is the starting point, not an afterthought | PR rejected |
| 2 | **Zero `any`** — TypeScript strict mode enforced at CI | CI fails |
| 3 | **No inline styles** — Every visual value comes from a token | PR rejected |
| 4 | **No prop drilling >4 levels** — Use Zustand or context | Review mandatory |
| 5 | **No `useEffect` for data fetching** — Server Components or React Query | PR rejected |
| 6 | **No duplicated animation logic** — Import from `@/animations/presets` | PR rejected |
| 7 | **Every data view has 4 states** — loading, empty, error, success | PR rejected |
| 8 | **Touch targets ≥44x44dp** — No exceptions for interactive elements | PR rejected |
| 9 | **No console.log in production** — Use proper logging service | CI fails |
| 10 | **Components ≤300 lines** — Split or be split | Review mandatory |

### Decision Framework

Before writing any code, answer:

1. **Does this need to be a new component, or can I compose from existing ones?**
2. **Does this need shared state, or is local state sufficient?**
3. **Does this need to be a Client Component, or can it be a Server Component?**
4. **Does this handle all 4 states (loading, empty, error, success)?**
5. **Does this respect the dependency direction?** (Pages → Features → UI → Utils)

---

## 3. Frontend Architecture Rules

### Layer Dependency

```
APP ROUTER (pages, layouts)
    ↓ imports
FEATURE COMPONENTS (swipe, battle, home, progress)
    ↓ imports
SHARED UI KIT (Button, Card, Modal, Toast)
    ↓ imports
ANIMATION PRESETS + UTILITIES (presets, cn, types)
```

### Hard Rules

| Rule | Enforcement |
|------|-------------|
| Feature components can import UI kit, hooks, stores, services | In code review |
| UI kit components can import only utils, constants, types | In code review |
| Stores can import only services, utils | In code review |
| Services can import only utils, types | In code review |
| NEVER import a store from a service | CI lint rule |
| NEVER import a feature component from the UI kit | CI lint rule |
| ALWAYS import from barrel files (`index.ts`) | In code review |

### Client vs Server Component Decision

```typescript
// ✅ GOOD: Server Component for static data
// src/app/(main)/page.tsx
export default async function HomePage() {
  const supabase = await createServerSupabase();
  const { data: profile } = await supabase.from('profiles').select('*').single();
  return <HomeScreen profile={profile} />;
}

// ✅ GOOD: Client Component only when needed
// 'use client' required for: interactivity, effects, browser APIs, Zustand, Framer Motion
'use client';
export function SwipeCard() { ... }

// ❌ BAD: 'use client' on everything (defeats RSC benefits)
// ❌ BAD: Server Component that uses browser APIs
// ❌ BAD: Data fetching in Client Component when Server Component suffices
```

---

## 4. Backend Architecture Rules

### Supabase as Backend

Harf uses Supabase as its primary backend. Rules:

| Rule | Rationale |
|------|-----------|
| All business logic in Supabase RLS policies or Edge Functions | Never trust the client |
| XP calculation happens server-side | Prevent XP cheating |
| Streak validation happens server-side | Prevent streak manipulation |
| Battle outcomes validated server-side | Prevent battle result tampering |
| Server Actions for mutations where possible | Type safety end-to-end |

### Server Action Pattern

```typescript
// ✅ GOOD: Server Action for XP update
'use server';
import { createServerSupabase } from '@/services/supabase/server';

export async function claimDailyReward(userId: string) {
  const supabase = await createServerSupabase();
  // Validate streak eligibility
  // Calculate XP server-side
  // Update profile
  // Return new XP + streak
}

// ❌ BAD: Client-side XP update (can be tampered)
// ❌ BAD: Direct Supabase insert from client (bypasses validation)
```

---

## 5. Mobile-First Rules

### Viewport Rules

| Rule | Implementation |
|------|----------------|
| All components designed at 375px first | Check in browser DevTools before PR |
| Container max-width 430px | `max-w-app` in Tailwind config |
| No horizontal scroll on mobile | `overflow-x-hidden` on body, check all children |
| Padding 16px on all screens | Standard page padding |
| Bottom elements account for safe area | `pb-safe-bottom` with `env(safe-area-inset-bottom)` |

### Thumb Zone Design

```
ZONE 1 (top):      Info only — streak, XP, mascot. No critical interactions here.
ZONE 2 (middle):   Content — cards, battle arena. Primary reading zone.
ZONE 3 (bottom):   Actions + navigation — CTA buttons, bottom tabs. Thumb's home.
```

### Hard Rules

| Rule | Why |
|------|-----|
| All touch targets ≥44x44dp | Apple HIG + Material Design guidelines |
| Actions buttons in bottom third | Thumb reachability |
| No hover-dependent interactions | Hover doesn't exist on mobile |
| No pinch-to-zoom on app content | Conflicts with swipe |
| System font scaling respected | Accessibility for visually impaired |

---

## 6. UI Consistency Rules

### Design Token Usage

```typescript
// ✅ GOOD: Design token reference
<div className="bg-bg-card rounded-lg shadow-card p-4" />

// ❌ BAD: Hardcoded values
<div className="bg-[#1A2332] rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-4" />
```

### Mandatory Tokens

| Category | Must Use | Never Hardcode |
|----------|----------|----------------|
| Colors | `bg-bg-*`, `text-text-*`, `text-{emerald/gold}-*` | `bg-#hex`, `text-#hex` |
| Spacing | `p-*`, `gap-*`, `m-*` (4px base) | `p-[13px]`, `gap-[7px]` |
| Radius | `rounded-{sm/md/lg/xl/2xl/full}` | `rounded-[13px]` |
| Shadows | `shadow-{card/bottom-nav/glow-*}` | `shadow-[custom]` |
| Typography | `text-{body/heading-1/label/micro}` | `text-[15px]` |

### Spacing Enforcement

```typescript
// ✅ GOOD: Consistent spacing
<div className="p-4 gap-3">
  <Card className="p-4">
    <h2 className="text-heading-2 mb-2">Selamat Datang</h2>
    <p className="text-body text-text-secondary">...</p>
  </Card>
</div>

// ❌ BAD: Inconsistent spacing
<div style={{ padding: '17px' }}>
  <div style={{ marginBottom: '11px' }}>
```

---

## 7. Animation Rules

### Preset Enforcement

```typescript
// ✅ GOOD: Import from presets
import { springPresets, tweenPresets } from '@/animations/presets';
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={springPresets.snappy}
/>

// ❌ BAD: Inline animation config
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 312, damping: 27, mass: 0.48 }}
/>
```

### Mandatory Animation Rules

| Rule | Enforcement |
|------|-------------|
| All animations use only `transform` and `opacity` | Code review |
| All spring configs from `@/animations/presets` | Code review |
| All variants from `@/animations/variants` | Code review |
| All components with exit animation have `exit` variant | Code review |
| `AnimatePresence` wraps all conditional renders with animations | Code review |
| No animation on `prefers-reduced-motion: reduce` | Code review |

### Animation by Component Type

| Component Type | Must Have Animation | Preset |
|----------------|-------------------|--------|
| Page wrapper | Enter/exit slide+fade | `tweenPresets.normal` |
| Modal | Enter spring gentle, exit tween fast | `springPresets.gentle` |
| Toast | Enter spring snappy, exit tween normal | `springPresets.snappy` |
| Button | Press scale 0.95 | `springPresets.snappy` |
| Card | Enter slide up staggered | `tweenPresets.normal` |
| SwipeCard | Drag gesture with spring snap | Real-time + `springPresets.snappy` |

---

## 8. Component Rules

### Shared Component Ownership

| Directory | Owner | Can Import |
|-----------|-------|------------|
| `components/ui/` | UI Kit team | Utils, types, animation presets only |
| `components/layout/` | Layout team | UI kit, animation presets |
| `components/animations/` | Animation team | Utils, types |
| `components/shared/` | Core team | UI kit, animation presets, stores |
| `components/{feature}/` | Feature team | UI kit, animation presets, stores, services |

### Feature Component Boundaries

```typescript
// ✅ GOOD: Feature component owns its sub-components
// components/swipe/
// ├── index.ts
// ├── SwipeCard.tsx
// ├── SwipeStack.tsx
// ├── SessionProgress.tsx
// └── components/
//     └── SwipeHint.tsx

// ❌ BAD: Feature components leaking into shared
// components/ui/SwipeCard.tsx (NO - swipe is a feature)
// components/shared/SwipeUtils.ts (NO - co-locate with feature)

// ❌ BAD: Shared components in feature folders
// components/swipe/Button.tsx (NO - Button is in ui/)
```

### Component Naming

| Pattern | Example | Rule |
|---------|---------|------|
| PascalCase for components | `SwipeCard`, `BottomNavigation` | Always |
| camelCase for hooks | `useSwipe`, `useNetwork` | Always |
| camelCase for utilities | `cn`, `formatXP` | Always |
| Feature prefix for feature components | `SwipeCard`, `BattleArena` | Mandatory |
| No prefix for shared UI components | `Button`, `Card`, `Modal` | Mandatory |

### Props Design Rules

```typescript
// ✅ GOOD: Explicit props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

// ❌ BAD: Props spreading without interface
function Button(props: any) { ... }

// ❌ BAD: Boolean props without 'is' prefix
function Button({ loading, disabled, wide }: { loading: boolean; disabled: boolean; wide: boolean }) { ... }

// ✅ GOOD: Consistent boolean prefix
interface CardProps {
  isPressable?: boolean;
  isGlowing?: boolean;
}
```

### Composition Rules

```typescript
// ✅ GOOD: Composition over inheritance
function SwipeCard({ word, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  return (
    <Card variant="elevated" isPressable className="aspect-[3/4]">
      <ArabicText text={word.arabic} size="xl" />
      <AudioButton wordId={word.id} />
      <SwipeHint direction="left" label="Tidak Tahu" />
      <SwipeHint direction="right" label="Tahu" />
    </Card>
  );
}

// ❌ BAD: Inheritance-based component (extends base class)
// ❌ BAD: One giant component doing everything
```

### Variant Rules

Components with visual variants must use a single `variant` prop, not multiple boolean flags.

```typescript
// ✅ GOOD: Single variant prop
<Button variant="primary" />
<Button variant="secondary" />
<Button variant="danger" />

// ❌ BAD: Boolean explosion
<Button primary secondary danger />
// What happens when primary + danger are both true?
```

---

## 9. State Management Rules

### State Location Decision Tree

```
Q: Does this data come from the server?
│
├── YES → Q: Is it needed across multiple components?
│   │   ├── YES → Zustand store (with sync to Supabase)
│   │   └── NO  → Server Component (fetch directly)
│
└── NO → Q: Is it needed across multiple components?
    │   ├── YES → Zustand store
    │   └── NO  → useState / useRef
```

### Zustand Rules

```typescript
// ✅ GOOD: Selective subscription
const xp = useProfileStore((s) => s.profile?.xp);
const addXP = useProfileStore((s) => s.addXP);

// ❌ BAD: Full store subscription
const profile = useProfileStore(); // Re-renders on ANY change

// ✅ GOOD: Shallow compare for objects
const { xp, level } = useProfileStore(
  (s) => ({ xp: s.profile?.xp, level: s.profile?.level }),
  shallow,
);

// ✅ GOOD: Actions must be plain functions, not inline
// In store:
addXP: (amount: number) => set((state) => ({
  profile: state.profile ? { ...state.profile, xp: state.profile.xp + amount } : null,
})),

// ❌ BAD: Mutating state outside store
useProfileStore.getState().profile!.xp += 100; // DIRECT MUTATION - BANNED
```

### Store Design Rules

| Rule | Rationale |
|------|-----------|
| Max 15 actions per store | Beyond that, split the store |
| Max 20 state properties per store | Beyond that, split the store |
| Persist only what's needed | Use `partialize` to limit localStorage bloat |
| No derived state in store | Compute in selectors or consume components |
| No side effects in reducers | Side effects go in action functions |
| All store mutations through defined actions | Enforce with no direct `set()` calls outside store |

---

## 10. API Integration Rules

### Server Actions for Mutations

```typescript
// ✅ GOOD: Server Action for XP claim
'use server';
export async function claimDailyXP(userId: string) {
  const supabase = await createServerSupabase();
  // Validate server-side
  // Calculate and update
  // Return result
}

// ❌ BAD: Client-side XP mutation
const { data } = await supabase.from('profiles').update({ xp: newXP }); // TAMPERABLE
```

### API Route Rules

| Rule | Reason |
|------|--------|
| Prefer Server Actions over API routes | Type safety, fewer round trips |
| API routes only for webhooks or external services | Standard pattern |
| All API routes rate-limited | Prevent abuse |
| All API routes authenticated | RLS + server-side auth check |
| Response types always typed | `interface ApiResponse<T>` |

---

## 11. Database Access Rules

### From Server Components

```typescript
// ✅ GOOD: Server Component direct DB access
export default async function ProgressPage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .single();

  return <ProgressScreen profile={data} />;
}
```

### From Client Components

```typescript
// ✅ GOOD: Supabase calls through service layer
// services/supabase/vocabulary.ts
export async function getTodayWords(userId: string) {
  const supabase = createClient();
  return supabase
    .from('vocabulary')
    .select('*')
    .eq('user_id', userId)
    .gte('next_review', new Date().toISOString());
}

// In component:
const words = await getTodayWords(user.id);

// ❌ BAD: Direct Supabase calls in component
const { data } = await supabase
  .from('vocabulary')
  .select('*')
  .eq('user_id', userId); // Logic leak in component
```

---

## 12. Supabase Rules

### RLS Policy Rules

| Rule | Implementation |
|------|----------------|
| Every table MUST have RLS enabled | Non-negotiable |
| Never use `USING (true)` in production | Security hole |
| User isolation via `auth.uid()` | `USING (user_id = auth.uid())` |
| Admin operations via service role only | Not from client |

### Policy Examples

```sql
-- ✅ GOOD: User-level isolation
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- ✅ GOOD: Read-only for most tables
CREATE POLICY "Users can read vocabulary"
  ON vocabulary FOR SELECT
  USING (true);  -- Vocabulary is public data

-- ❌ BAD: No policy (table accessible to all)
-- ❌ BAD: Allow insert without auth
-- ❌ BAD: Allow update on XP without server validation
```

### Supabase Client Rules

| Rule | Implementation |
|------|----------------|
| Browser client only in `'use client'` components | `createClient()` in `services/supabase/client.ts` |
| Server client only in Server Components/Actions | `createServerSupabase()` in `services/supabase/server.ts` |
| Never use service role key in browser | Environment variable leak risk |
| Auth state synced via `onAuthStateChange` | In `AuthProvider` component |

---

## 13. Folder Structure Rules

### Mandatory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (providers, fonts)
│   ├── page.tsx            # Home
│   ├── loading.tsx         # Root loading
│   ├── error.tsx           # Root error boundary
│   ├── not-found.tsx       # 404
│   ├── (auth)/             # Auth routes (no bottom nav)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/             # Main app (with bottom nav)
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Home
│   │   ├── swipe/page.tsx
│   │   ├── battle/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── settings/page.tsx
│   │   └── social/page.tsx
│   └── api/                # API routes (rare)
│
├── components/             # All components
│   ├── ui/                 # Shared UI kit
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── index.ts        # Barrel export
│   │   └── ...
│   ├── layout/             # Layout components
│   ├── shared/             # Shared non-UI components
│   ├── animations/         # Animation wrappers
│   ├── auth/               # Auth feature
│   ├── home/               # Home feature
│   ├── swipe/              # Swipe feature
│   ├── battle/             # Battle feature
│   ├── progress/           # Progress feature
│   └── social/             # Social feature
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
├── hooks/                  # Custom hooks
│   ├── useSwipe.ts
│   ├── useNetwork.ts
│   └── ...
│
├── services/               # Service layer
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   └── ...
│   ├── audio.ts
│   └── analytics.ts
│
├── animations/             # Framer Motion configs
│   ├── presets.ts
│   ├── variants.ts
│   └── transitions.ts
│
├── styles/
│   └── globals.css
│
├── types/
│   ├── database.ts
│   ├── game.ts
│   ├── ui.ts
│   └── api.ts
│
├── constants/
│   ├── game.ts
│   ├── routes.ts
│   └── animation.ts
│
└── utils/
    ├── cn.ts
    ├── format.ts
    └── storage.ts
```

### Folder Structure Rules

| Rule | Rationale |
|------|-----------|
| Max 3 levels deep from `src/` | Prevents import path hell |
| Barrel files (`index.ts`) for all `components/*` directories | Clean imports |
| One component per file | Git diff clarity, tree-shaking |
| Test files co-located (`Component.test.tsx`) | Easy to find |
| No `utils/` dumping ground | Group by domain (`utils/format.ts`, `utils/storage.ts`) |

---

## 14. Naming Convention Rules

### General

| What | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `SwipeCard`, `BottomNavigation` |
| Hooks | camelCase with `use` prefix | `useSwipe`, `useNetwork` |
| Stores | camelCase with `Store` suffix | `swipeStore.ts`, `authStore.ts` |
| Services | camelCase | `audio.ts`, `analytics.ts` |
| Utils | camelCase | `format.ts`, `storage.ts` |
| Types | PascalCase with domain prefix | `Word`, `BattleStatus`, `ApiResponse<T>` |
| Interfaces | PascalCase with `Props` suffix for components | `ButtonProps`, `SwipeCardProps` |
| Constants | UPPER_SNAKE_CASE | `MAX_COMBO`, `SWIPE_THRESHOLD` |
| Enums | PascalCase | `BattleStatus`, `SwipeDirection` |
| CSS classes | Tailwind utility classes only | Never custom CSS class names |
| Files | camelCase, match the main export | `Button.tsx`, `useSwipe.ts` |

### File Naming

```typescript
// ✅ GOOD: File name matches export
// File: Button.tsx
export function Button() { ... }

// File: useSwipe.ts
export function useSwipe() { ... }

// ❌ BAD: Mismatched file and export
// File: CustomButton.tsx
export function Button() { ... }
```

---

## 15. File Organization Rules

### Within a File

```typescript
// ✅ GOOD: Consistent file structure
// 1. Imports (grouped: external → internal)
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { springPresets } from '@/animations/presets';

// 2. Types/Interfaces
interface ButtonProps { ... }

// 3. Component
export function Button({ ... }: ButtonProps) { ... }

// 4. Sub-components (if needed, but prefer separate files)
function ButtonIcon() { ... }

// ❌ BAD: Random import order, types at bottom, mixed concerns
```

### Import Order

```typescript
// 1. External libraries (alphabetical)
import { motion } from 'framer-motion';
import { useEffect } from 'react';

// 2. Internal absolute imports (alphabetical by path)
import { springPresets } from '@/animations/presets';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

// 3. Relative imports (when necessary, avoid when barrel exists)
import { SwipeHint } from './components/SwipeHint';

// 4. CSS imports (last)
import './styles.css';
```

---

## 16. TypeScript Rules

### Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": false  // Allow undefined for optional props
  }
}
```

### `any` is Banned

```typescript
// ❌ BAD: any type
function formatXP(xp: any) { return `${xp} XP`; }

// ✅ GOOD: Proper typing
function formatXP(xp: number): string { return `${xp} XP`; }

// ❌ BAD: Casting to any to bypass
const data = response.data as any;

// ✅ GOOD: Proper type assertion with guard
const data = response.data as ApiResponse<Profile>;

// ⚠️ ALLOWED: `unknown` when type is truly unknown (with narrowing)
function handleError(error: unknown) {
  if (error instanceof Error) { ... }
}
```

### Typed Store Example

```typescript
// ✅ GOOD: Fully typed store
interface SwipeState {
  currentIndex: number;
  combo: number;
  isComplete: boolean;
  words: Word[];
}

interface SwipeActions {
  swipeCard: (direction: 'left' | 'right') => void;
  startSession: (words: Word[]) => void;
  endSession: () => SessionSummary;
  resetSession: () => void;
}

type SwipeStore = SwipeState & SwipeActions;

export const useSwipeStore = create<SwipeStore>()(...);
```

### Typed API Responses

```typescript
// ✅ GOOD: Generic API response type
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: 'success' | 'error';
}

// Usage
async function getProfile(): Promise<ApiResponse<Profile>> {
  const { data, error } = await supabase.from('profiles').select('*').single();
  return { data, error: error?.message ?? null, status: error ? 'error' : 'success' };
}
```

---

## 17. Tailwind Rules

### Semantic Utility Grouping

```typescript
// ✅ GOOD: Grouped by concern (layout → visual → typography → interactive)
<div className="
  flex items-center justify-between   /* layout */
  bg-bg-card rounded-lg shadow-card   /* visual */
  text-text-primary text-body         /* typography */
  active:scale-95 transition-transform /* interactive */
" />

// ❌ BAD: Random order, no grouping
<div className="
  text-body shadow-card rounded-lg flex text-text-primary
  active:scale-95 bg-bg-card items-center transition-transform justify-between
" />
```

### Mandatory Order (by category)

1. **Layout** — `flex`, `grid`, `absolute`, `relative`, `block`, `hidden`
2. **Position** — `top-*`, `left-*`, `z-*`
3. **Sizing** — `w-*`, `h-*`, `max-w-*`, `aspect-*`
4. **Spacing** — `p-*`, `m-*`, `gap-*`, `space-x-*`
5. **Typography** — `text-*`, `font-*`, `leading-*`, `tracking-*`
6. **Visual** — `bg-*`, `rounded-*`, `shadow-*`, `border-*`
7. **Interactive** — `hover:*`, `active:*`, `focus:*`, `transition-*`
8. **Misc** — `cursor-*`, `select-*`, `overflow-*`

### Avoid Class Duplication

```typescript
// ❌ BAD: Same classes repeated
<div className="flex items-center gap-3 p-4 bg-bg-card rounded-lg">
<div className="flex items-center gap-3 p-4 bg-bg-card rounded-lg">

// ✅ GOOD: Extract to component or cn() helper
const cardClass = 'flex items-center gap-3 p-4 bg-bg-card rounded-lg';
<div className={cardClass} />
<div className={cardClass} />
```

### CVA (Class Variance Authority) When Needed

```typescript
// Use CVA when a component has many variant combinations
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-label transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-500 text-text-primary shadow-md hover:bg-emerald-400',
        secondary: 'bg-white/5 text-text-primary border border-white/10',
        ghost: 'bg-transparent text-text-secondary',
        danger: 'bg-error text-white',
      },
      size: {
        sm: 'h-9 px-4 text-micro',
        md: 'h-11 px-5 text-label',
        lg: 'h-13 px-6 text-body-bold',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

function Button({ variant, size, fullWidth, className }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, fullWidth }), className)} />
  );
}
```

---

## 18. Accessibility Rules

### Minimum Touch Targets

```typescript
// ✅ GOOD: 44x44 minimum
<button className="w-11 h-11 flex items-center justify-center" aria-label="Close">
  <CloseIcon />
</button>

// ❌ BAD: Too small
<button className="w-6 h-6" onClick={close}>✕</button>
```

### Color Contrast

| Text Size | Minimum Contrast | Tool |
|-----------|-----------------|------|
| Large text (≥18px bold / ≥24px) | 3:1 | WebAIM Contrast Checker |
| Small text (<18px) | 4.5:1 | WebAIM Contrast Checker |

Design tokens in `design-system.md` have been pre-validated for contrast against `#0A0F1E` (bg-primary).

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
```

### Mandatory ARIA

| Element | ARIA Requirement |
|---------|-----------------|
| Icon-only button | `aria-label="description"` |
| Toast notification | `role="alert"` `aria-live="assertive"` |
| Live XP/combo updates | `aria-live="polite"` |
| Modal | `role="dialog"` `aria-modal="true"` `aria-labelledby` |
| Navigation | `<nav>` with `aria-label="Main navigation"` |
| Error messages | `role="alert"` |
| Progress bar | `role="progressbar"` `aria-valuenow` `aria-valuemax` |
| Tab panel | `role="tablist"`, `role="tab"`, `role="tabpanel"` |

---

## 19. Performance Rules

### Render Optimization

```typescript
// ✅ GOOD: React.memo for pure UI components
const MemoizedCard = React.memo(Card);

// ✅ GOOD: Zustand granular selectors
const xp = useProfileStore((s) => s.profile?.xp); // Only re-renders when xp changes

// ❌ BAD: Full store subscription
const profile = useProfileStore();

// ✅ GOOD: useCallback for stable references
const handleSwipe = useCallback((direction: 'left' | 'right') => {
  swipeCard(direction);
}, [swipeCard]);

// ❌ BAD: Inline callback (breaks memo)
<SwipeCard onSwipeLeft={() => swipeCard('left')} />
```

### Bundle Optimization

```typescript
// ✅ GOOD: Dynamic imports for heavy screens
const BattleArena = dynamic(() => import('@/components/battle/BattleArena'), {
  loading: () => <BattleSkeleton />,
  ssr: false,
});

const RewardModal = dynamic(() => import('@/components/shared/RewardModal'), {
  ssr: false,
});

// ❌ BAD: Static import of heavy component
import { BattleArena } from '@/components/battle/BattleArena'; // Loaded on every page
```

### Animation Performance

```typescript
// ✅ GOOD: GPU-accelerated properties only
<motion.div
  animate={{ x: 100, opacity: 0.5 }}    // transform + opacity = GPU
/>

// ❌ BAD: Layout-affecting animation
<motion.div
  animate={{ width: '50%', height: '200px' }}  // Layout recalc = CPU
/>

// ✅ GOOD: will-change hint
<motion.div
  style={{ willChange: 'transform' }}
  drag="x"
/>
```

### Performance Budget

| Metric | Target | If Exceeded |
|--------|--------|-------------|
| JS Bundle (gzipped) | <200KB | Split dynamic imports |
| FCP | <1.5s | Optimize fonts, reduce CSS |
| LCP | <2.5s | Lazy load images, optimize server |
| TTI | <3.5s | Reduce client JS |
| Animation FPS | 60fps | Reduce particle count, use GPU |
| Zustand dispatch | <1ms | Check selector granularity |

---

## 20. Reusability Rules

### The Rule of Three

```
If you write the same logic/component 3+ times, extract it.

1st time: Write it
2nd time: Note the duplication, consider extracting
3rd time: EXTRACT immediately
```

### Extraction Priority

| Pattern | Where to Extract |
|---------|-----------------|
| Repeated Tailwind class groups | Extract to `cn()` or shared className constant |
| Repeated animation configs | Extract to `@/animations/presets` |
| Repeated API call patterns | Extract to `services/supabase/{entity}.ts` |
| Repeated UI patterns | Extract to `components/ui/{Component}.tsx` |
| Repeated business logic | Extract to `utils/{domain}.ts` or custom hook |
| Repeated state logic | Extract to Zustand store action |

```typescript
// ❌ BAD: Repeated pattern in multiple files
// In SwipeCard.tsx:
const cardClass = 'bg-bg-card rounded-lg shadow-card border border-white/5';
// In BattleCard.tsx:
const cardClass = 'bg-bg-card rounded-lg shadow-card border border-white/5';

// ✅ GOOD: Use the Card component
<Card variant="default">...content...</Card>
```

---

## 21. Scalability Rules

### Feature Isolation

Each feature module is independent. You should be able to remove an entire feature folder without breaking others.

```typescript
// ✅ GOOD: Feature only depends on shared modules
// components/swipe/ — can be deleted without affecting battle/

// ❌ BAD: Feature-to-feature dependency
// components/swipe/SwipeCard.tsx imports from components/battle/
```

### State Isolation

```typescript
// ✅ GOOD: Feature-specific store
// swipeStore is only imported by swipe/ components

// ❌ BAD: Store shared across unrelated features
// profileStore used by home, swipe, battle, progress (OK if profile data is generic)
// swipeStore used by battle (WRONG — cross-feature store dependency)
```

### Growth Projections

| Scale | Action |
|-------|--------|
| 5k users | Current architecture handles |
| 50k users | Add CDN for audio, optimize Supabase queries |
| 500k users | Edge Functions for battle, Redis for leaderboard |
| 5M users | Migrate battle to WebSocket, add read replicas |

---

## 22. Error Handling Rules

### Error State Pattern

```typescript
// ✅ GOOD: Every data-dependent view handles error
function SwipeSession() {
  const { words, isLoading, error, retry } = useSwipeStore();

  if (isLoading) return <SwipeSkeleton />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!words || words.length === 0) return <EmptyState />;

  return <SwipeStack words={words} />;
}

// ❌ BAD: No error handling
function SwipeSession() {
  const { words } = useSwipeStore();
  return <SwipeStack words={words} />; // Crashes if words is null
}
```

### Error Boundary

```typescript
// ✅ GOOD: Error boundary per screen
// src/components/shared/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to Sentry
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorState />;
    }
    return this.props.children;
  }
}
```

### Error Types

| Error Type | User Message | Recovery |
|-----------|--------------|----------|
| Network | "Koneksi terputus" | Auto-retry on reconnect |
| Server 500 | "Server sedang sibuk" | Manual retry button |
| Auth expired | "Sesi habis" | Redirect to login |
| Rate limited | "Terlalu cepat" | Cooldown + retry |
| Not found | "Tidak ditemukan" | Back to home |
| Validation | Error-specific message | Fix input + retry |

---

## 23. Logging Rules

### Console.log Ban

```typescript
// ❌ BAD: console.log in production code
console.log('User swiped card:', cardId);

// ✅ GOOD: Debug logging via service
import { logger } from '@/services/logger';
logger.debug('User swiped card', { cardId });

// ✅ GOOD: Error logging via service
logger.error('Failed to save session', { error });
```

### What to Log

| Level | When | Destination |
|-------|------|-------------|
| `error` | Caught exceptions, API failures | Sentry |
| `warn` | Non-critical issues, rate limit approaching | Sentry |
| `info` | Key user actions (session start, battle win) | Analytics |
| `debug` | Development-only (stripped in production) | Console |

---

## 24. Security Rules

### Never Trust the Client

```typescript
// ❌ BAD: Client-side XP calculation
function calculateXP(correct: number): number {
  return correct * 10; // User can modify in DevTools
}

// ✅ GOOD: Server-side XP calculation
'use server';
export async function calculateAndAwardXP(userId: string, sessionId: string) {
  const supabase = await createServerSupabase();
  // Fetch session from DB (verifiable)
  // Calculate XP server-side
  // Update profile
  // Return authorized XP amount
}
```

### Input Sanitization

| Input Type | Sanitization |
|------------|-------------|
| User display name | Strip HTML, max 50 chars |
| Arabic text display | Render via `dangerouslySetInnerHTML`? NO. Never. |
| URL params | Validate with Zod or type guard |
| Form inputs | Zod schema validation before sending |

### RLS Policy Rules

```sql
-- ✅ GOOD: Row-level security enforced
CREATE POLICY "Users can only update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ❌ BAD: No RLS
-- CREATE POLICY "Allow all" ON profiles FOR ALL USING (true);

-- ❌ BAD: Trusting client-provided user_id
-- CREATE POLICY "Update" ON profiles FOR UPDATE
--   USING (id = [client-provided id]);  -- User can spoof
```

---

## 25. Authentication Rules

### Auth Flow

```
Login/Register → Supabase Auth → Session stored in Zustand
                                  → Middleware checks session
                                  → Protected routes redirect to /auth/login
                                  → onAuthStateChange syncs session
```

### Session Management

```typescript
// ✅ GOOD: Session from Supabase Auth, not custom JWT
const { data: { session } } = await supabase.auth.getSession();

// ✅ GOOD: Auth state synced via provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        useAuthStore.getState().setSession(session);
      },
    );
    return () => subscription.unsubscribe();
  }, []);
}
```

### Auth Rules

| Rule | Why |
|------|-----|
| Use Supabase Auth, not custom auth | Battle-tested, secure, OOTB features |
| No storing passwords | Supabase handles this |
| OAuth (Google) as primary login method | Lower friction than email/password |
| Guest mode supported | Store guest progress, prompt sign-up at key moments |
| Session refresh handled by Supabase | `@supabase/ssr` handles cookie refresh |

---

## 26. Offline Support Rules

### Offline Architecture

```
Online:  Supabase → Realtime sync → Zustand
Offline: Zustand → localStorage queue → Sync on reconnect
```

### What Works Offline

| Feature | Offline Support |
|---------|----------------|
| Swipe session (cached vocabulary) | ✅ Full support |
| Session save | ✅ Queued, sync on reconnect |
| XP display (cached) | ✅ Cached value shown |
| Profile view (cached) | ✅ Cached value shown |
| Battle | ❌ "Memerlukan koneksi internet" |
| Leaderboard | ❌ "Data mungkin tidak terbaru" |
| Streak | ⚠️ Checked on reconnect |

### Sync Queue

```typescript
// ✅ GOOD: Queue mutations when offline
interface SyncQueueItem {
  id: string;
  action: string;
  payload: unknown;
  timestamp: number;
}

const syncQueue: SyncQueueItem[] = JSON.parse(
  localStorage.getItem('harf-sync-queue') ?? '[]',
);

// Process on reconnect
window.addEventListener('online', async () => {
  for (const item of syncQueue) {
    await processSyncItem(item);
  }
  localStorage.removeItem('harf-sync-queue');
});
```

---

## 27. Testing Rules

### Test Coverage Targets

| Layer | Minimum Coverage | Tool |
|-------|-----------------|------|
| Utils | 100% | Vitest |
| Hooks | 100% | Vitest + @testing-library/react |
| Stores | 100% | Vitest |
| UI Components | 80% | Vitest + @testing-library/react |
| Integration flows | 100% of critical paths | Vitest |
| E2E | All critical user flows | Playwright |

### What to Test

```typescript
// ✅ GOOD: Store test (state transitions)
describe('swipeStore', () => {
  it('should increment combo on correct swipe', () => {
    useSwipeStore.getState().startSession(mockWords);
    useSwipeStore.getState().swipeCard('right');
    expect(useSwipeStore.getState().combo).toBe(1);
  });

  it('should reset combo on incorrect swipe', () => {
    useSwipeStore.getState().startSession(mockWords);
    useSwipeStore.getState().swipeCard('right');
    useSwipeStore.getState().swipeCard('left');
    expect(useSwipeStore.getState().combo).toBe(0);
  });

  it('should end session when all cards swiped', () => {
    useSwipeStore.getState().startSession(mockWords);
    mockWords.forEach(() => useSwipeStore.getState().swipeCard('right'));
    expect(useSwipeStore.getState().isComplete).toBe(true);
  });
});

// ✅ GOOD: Component test (behavior)
describe('Button', () => {
  it('should call onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Klik</Button>);
    await userEvent.click(screen.getByText('Klik'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should show loading state', () => {
    render(<Button isLoading>Klik</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### What NOT to Test

- Animation implementation details (Framer Motion handles its own testing)
- Exact CSS class strings (test behavior, not styling)
- Third-party library internals (Supabase, Zustand, Framer Motion)
- Visual appearance (leave to visual regression tools like Chromatic)

---

## 28. QA Rules

### Pre-QA Checklist

Before any build is sent to QA:

- [ ] All 4 states implemented (loading, empty, error, success)
- [ ] No console.log statements
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No ESLint warnings
- [ ] Test coverage ≥80%
- [ ] Lighthouse score ≥90
- [ ] Tested on 375px viewport
- [ ] Tested on 430px viewport
- [ ] Touch targets meet minimum 44x44
- [ ] Dark mode renders correctly
- [ ] Reduced motion mode works
- [ ] Keyboard navigation works through screen

### QA Testing Matrix

| Area | Test Cases |
|------|-----------|
| **Mobile responsiveness** | 320px, 375px, 390px, 430px, 768px, 1024px |
| **Animation smoothness** | Swipe card at 60fps, battle effects, page transitions |
| **Loading states** | Skeleton visible on first load, smooth transition to content |
| **Empty states** | Each screen without data shows correct empty state |
| **Error states** | Network off, server error, auth error all show correct UI |
| **Dark mode** | All screens, all components render correctly in dark mode |
| **Edge cases** | Rapid tapping, double swipe, battle timeout, midnight streak reset |
| **Offline behavior** | Cache available, no cache, reconnect sync |
| **Performance** | FPS during swipe, bundle size, memory leaks on navigation |

---

## 29. Refactoring Rules

### When to Refactor

| Trigger | Action |
|---------|--------|
| Component >300 lines | Extract sub-components |
| File imports >15 dependencies | Split into smaller modules |
| Store has >20 actions | Split into multiple stores |
| Same pattern 3+ times | Extract to shared utility |
| CSS class list >5 conditionals | Use CVA or variant prop |

### Refactoring Process

1. **Write tests** first for the code to be refactored
2. **Extract** logic to appropriate layer
3. **Replace** all references (grep for old usage)
4. **Verify** all tests pass + manual QA
5. **Delete** the old code (no commented-out code)

### Refactoring Priorities

| Priority | Type | Example |
|----------|------|---------|
| P0 | Bug fix in messy code | Fix while you refactor |
| P1 | Performance bottleneck | Rerender issue in swipe card |
| P2 | Readability | Giant component with mixed concerns |
| P3 | Consistency | Component using inline styles instead of tokens |
| P4 | Future-proofing | Adding types to untyped code |

---

## 30. Git Workflow Rules

### Branch Naming

```
{type}/{description}

Types:
  feat/     → New feature
  fix/      → Bug fix
  refactor/ → Code refactor
  perf/     → Performance improvement
  test/     → Adding/modifying tests
  docs/     → Documentation
  style/    → Code style (formatting, no logic change)
  chore/    → Maintenance, dependencies

Examples:
  feat/swipe-card-animation
  fix/battle-hp-bar-overflow
  refactor/battle-store
  perf/reduce-swipe-rerenders
```

### Commit Messages

```
{type}({scope}): {description}

Examples:
  feat(swipe): add drag gesture with threshold snap
  fix(battle): correct HP bar overflow when damage > max
  refactor(store): split swipeStore into session and progress
  perf(swipe): memoize SwipeCard to reduce rerenders
  test(store): add swipeStore state transition tests
```

### Commit Rules

| Rule | Reason |
|------|--------|
| One commit = one logical change | Easy to revert |
| Imperative mood ("add", "fix", "refactor") | Git convention |
| Max 72 chars for subject line | Git log readability |
| Reference issue number when applicable | Traceability |
| No `WIP` commits on main/master | Branch work-in-progress |

---

## 31. Pull Request Rules

### PR Template

```markdown
## Description
Brief description of the change.

## Type
- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] perf
- [ ] test
- [ ] docs
- [ ] chore

## Screenshots / Videos
(For UI changes)

## Checklist
- [ ] TypeScript strict mode passes
- [ ] ESLint passes (no warnings)
- [ ] Tests pass (existing + new)
- [ ] Tested on 375px viewport
- [ ] Touch targets ≥44x44
- [ ] Dark mode checked
- [ ] Reduced motion checked
- [ ] No console.log
```

### PR Review Rules

| Rule | Automation |
|------|-----------|
| CI must pass | GitHub Actions |
| At least 1 approval | Branch protection |
| No `any` types allowed | ESLint rule |
| No bundle size increase >10% | Bundle analyzer |
| No new ESLint warnings | ESLint rule |

### What Reviewers Check

1. Does this follow the architecture dependency direction?
2. Are all 4 states handled (loading, empty, error, success)?
3. Are animation presets imported (not inline)?
4. Are design tokens used (not hardcoded values)?
5. Is it mobile-first?
6. Are there any unnecessary re-renders?
7. Are TypeScript types strict?

---

## 32. Documentation Rules

### What Must Be Documented

| Artifact | Location | Format |
|----------|----------|--------|
| Component API | In component file (Props interface) | TypeScript JSDoc |
| Store API | In store file | TypeScript |
| Service functions | In service file | TypeScript |
| Architecture decisions | `docs/adr/{id}-{title}.md` | ADR format |
| UI implementation plan | `ui-implementation-plan.md` | Already exists |
| Engineering rules | `engineering-rules.md` | This document |

### JSDoc Style

```typescript
/**
 * SwipeCard component for swipe learning.
 *
 * Renders a draggable vocabulary card. Users swipe right for "Tahu"
 * and left for "Tidak Tahu". Cards snap to threshold positions.
 *
 * @example
 * <SwipeCard
 *   word={word}
 *   isTop={true}
 *   onSwipeRight={() => handleCorrect()}
 *   onSwipeLeft={() => handleIncorrect()}
 * />
 */
export function SwipeCard({ word, isTop, onSwipeRight, onSwipeLeft }: SwipeCardProps) {
```

### Documentation Anti-Patterns

| Anti-Pattern | Better Approach |
|-------------|-----------------|
| Outdated comments | Delete comments; make code self-documenting |
| "How" comments (explaining obvious code) | Let code speak for itself |
| No README for complex modules | Brief README with architecture + usage |
| Over-documenting internal logic | Unit tests document behavior better |

---

## 33. Animation Performance Rules

### GPU-Accelerated Properties Only

```typescript
// ✅ GOOD: GPU-composited
transform: translateX(100px)
transform: scale(1.5)
transform: rotate(15deg)
opacity: 0.5

// ❌ BAD: CPU-layout-triggering (causes repaint)
width: 50%
height: 200px
margin-top: 20px
top: 100px
padding: 16px
```

### Performance Monitoring

| Metric | Good | Warning | Bad |
|--------|------|---------|-----|
| FPS during animation | 60fps | 30-59fps | <30fps |
| Frame duration | <16ms | 16-33ms | >33ms |
| Layout shifts | 0 | 1-2 | >2 |

### Animation Count Rules

| Device Tier | Max Simultaneous Animations | Action |
|-------------|---------------------------|--------|
| High-end (iPhone 15, S24) | 10+ | Full particles, glow, parallax |
| Mid-range (iPhone 11, A52) | 5-8 | Reduce particles by 50% |
| Low-end (iPhone 8, J7) | 3-5 | Disable glow, reduce particles to 0 |

```typescript
// ✅ GOOD: Device-aware animation quality
const deviceTier = useDeviceTier(); // 'low' | 'mid' | 'high'
const particleCount = deviceTier === 'high' ? 20 : deviceTier === 'mid' ? 10 : 0;

// ❌ BAD: Same animation intensity for all devices
<Particles count={20} /> // Lags on low-end devices
```

---

## 34. Responsive Rules

### Breakpoint Strategy

Harf is mobile-first. Breakpoints are for progressive enhancement only.

```typescript
// tailwind.config.ts
screens: {
  'mobile': '375px',   // Base — all design starts here
  'tablet': '768px',   // iPad — center content in max-w-app
  'desktop': '1024px', // Laptop — center content + keyboard shortcuts
}
```

### Responsive Patterns

```typescript
// ✅ GOOD: Mobile-first (default = mobile, override for larger)
<div className="
  p-4                    /* Mobile: 16px padding */
  tablet:p-6             /* Tablet: 24px padding */
  desktop:p-8            /* Desktop: 32px padding */
" />

// ❌ BAD: Desktop-first (default = desktop, override for mobile)
<div className="
  p-8                    /* Desktop default */
  tablet:p-6
  mobile:p-4
" />

// ✅ GOOD: Content max-width constraint on large screens
<div className="max-w-app mx-auto w-full">
  {/* Content stays at 430px max, centered on desktop */}
</div>
```

---

## 35. Code Review Checklist

### Structural

- [ ] Follows folder structure rules (§13)
- [ ] Follows naming conventions (§14)
- [ ] Imports from barrel files where available
- [ ] No circular dependencies
- [ ] Component ≤300 lines

### TypeScript

- [ ] No `any` types
- [ ] All props typed via interface
- [ ] Store typed with full interface (state + actions)
- [ ] API responses typed
- [ ] `strict: true` compliance

### UI

- [ ] No inline styles
- [ ] Design tokens used instead of hardcoded values
- [ ] Mobile-first (375px tested)
- [ ] Touch targets ≥44x44
- [ ] All 4 states present (loading, empty, error, success)

### Animation

- [ ] Presets from `@/animations/presets` (not inline)
- [ ] Variants from `@/animations/variants` where applicable
- [ ] Only `transform` and `opacity` animated
- [ ] Exit variants set for AnimatePresence
- [ ] Reduced motion respected

### State

- [ ] Zustand selectors are granular (no full store subscription)
- [ ] No prop drilling >4 levels
- [ ] No store mutations outside actions
- [ ] No store imports in services

### Performance

- [ ] No unnecessary `useState`/`useEffect`
- [ ] Dynamic imports for heavy components
- [ ] `React.memo` on pure presentational components
- [ ] No inline functions in render (for memoized children)

### Accessibility

- [ ] Icon-only elements have `aria-label`
- [ ] Interactive elements have visible focus
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader labels present

---

## 36. Technical Debt Prevention

### Daily Practices

| Practice | Enforcement |
|----------|-------------|
| Run `npm run lint` before every commit | Pre-commit hook |
| Run `npm run typecheck` before every commit | Pre-commit hook |
| Delete dead code immediately | No "I'll clean it up later" |
| Write tests alongside code | PR review gate |
| Review your own PR before requesting review | Self-review habit |

### Technical Debt Register

When tech debt is unavoidable, it **must** be logged:

```markdown
<!-- In the PR description or issue -->
## Technical Debt
- [ ] Refactor battleStore after v1 launch (split into battleSession + battleProgress)
- [ ] Replace inline animation config in SwipeCard with preset (see line 89)
- [ ] Add proper error handling to audio preloading
```

### Debt Review (Sprint Cadence)

Every 2 weeks, review:
1. Components exceeding 300 lines
2. Stores with >15 actions
3. Files with >15 imports
4. Unused exports
5. Console.log statements

---

## 37. Anti-Pattern Warnings

### BANNED Patterns (PR will be rejected)

```typescript
// ❌ BANNED: any type
function process(data: any) { ... }

// ❌ BANNED: Inline styles
<div style={{ color: '#10B981', fontSize: '16px' }} />

// ❌ BANNED: Direct DOM manipulation
document.getElementById('card')?.classList.add('active');

// ❌ BANNED: Mutating Zustand outside actions
useStore.getState().value = newValue;

// ❌ BANNED: API call in component (use service layer)
supabase.from('profiles').select('*'); // In component? NO.

// ❌ BANNED: useEffect for data fetching
useEffect(() => { fetchData(); }, []);

// ❌ BANNED: Duplicating animation presets
transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}

// ❌ BANNED: Console.log in production code
console.log('debug stuff');

// ❌ BANNED: Magic numbers
<div className="mt-[13px] p-[17px] rounded-[22px]" />

// ❌ BANNED: Large inline SVGs as components (use Icon component)
function MyCustomSvg() { return <svg>...</svg>; } // NO — put in Icon system

// ❌ BANNED: Exporting default (use named exports always)
export default function Button() { ... } // NO — use export function Button()
```

### Strongly Discouraged (Review will question)

```typescript
// ⚠️ DISCOURAGED: Prop drilling >4 levels
<App>
  <Main>
    <Content>
      <Section>
        <Button onClick={handleClick} /> {/* handleClick passed through 4 levels */}
      </Section>
    </Content>
  </Main>
</App>

// ⚠️ DISCOURAGED: Single-letter variable names
const x = words.filter(w => w.correct);

// ⚠️ DISCOURAGED: Nested ternaries
return isCorrect ? 'success' : isWrong ? 'danger' : isSkipped ? 'warning' : 'default';

// ⚠️ DISCOURAGED: Commented-out code
// const oldThing = () => { ... } /* DELETE THIS */
```

### Why These Are Banned

| Anti-Pattern | Impact |
|-------------|--------|
| `any` type | Breaks type safety, causes runtime errors |
| Inline styles | Breaks design system, inconsistent |
| Direct DOM | Conflicts with React, breaks SSR |
| Store mutation | Breaks reactivity, causes stale UI |
| API in component | Untestable, violates SRP |
| `useEffect` fetching | Race conditions, no caching |
| Animation duplication | Inconsistent feel, hard to tune |
| Console.log | Clogs prod, privacy risk |
| Magic numbers | Unmaintainable, inconsistent |
| Default exports | Bad tree-shaking, inconsistent imports |

---

## 38. Production Readiness Rules

### Pre-Deployment Checklist

- [ ] `tsc --noEmit` passes (zero errors)
- [ ] `next lint` passes (zero warnings)
- [ ] All tests pass (unit + integration + e2e)
- [ ] Bundle size ≤200KB gzipped
- [ ] Lighthouse scores ≥90 (all categories)
- [ ] Tested on real device (iPhone SE, Galaxy A52 minimum)
- [ ] Offline mode tested
- [ ] Reduced motion tested
- [ ] Screen reader tested (VoiceOver + TalkBack)
- [ ] Error boundary tested (simulate crash → fallback → recover)
- [ ] Analytics events firing correctly
- [ ] Sentry error tracking configured
- [ ] RLS policies verified (no data leaks)

### Monitoring After Launch

| What | Tool | Alert If |
|------|------|----------|
| JS errors | Sentry | Rate >0.1% of sessions |
| API errors | Sentry | Rate >1% of requests |
| Page load time | Vercel Analytics | p95 >4s |
| Animation FPS | Chrome UX Report | p50 <55fps |
| Auth failures | Supabase | >5% of login attempts |
| XP calculation mismatches | Custom monitoring | Any discrepancy |

---

## 39. Future Expansion Rules

### Architecture Resilience

The layered architecture handles these future scenarios:

| Scenario | What Changes |
|----------|-------------|
| **Add grammar lessons** | New feature module `components/grammar/` + `stores/grammarStore.ts` |
| **Add writing practice** | New immersive screen + Canvas-based component |
| **Add multiplayer battle** | WebSocket service + `services/websocket.ts` |
| **Add AI tutor** | New service `services/ai.ts`, integrate into swipe/battle |
| **Add subscription** | Feature flags in Zustand + `services/payment.ts` |
| **Go native (React Native)** | Keep stores + services; replace UI kit + animations |
| **Add PWA offline** | Service worker + IndexedDB cache |
| **Multiple target languages** | Content-driven, no architecture change |
| **Desktop support** | Responsive breakpoints already in Tailwind |

### Rules for Future Code

1. **Don't over-engineer for the future** — YAGNI. Build what's needed now, but structure so extension is easy.
2. **Leave extension points** — Hooks, services, and stores are designed to be extended, not rewritten.
3. **Never hardcode feature flags** — Use environment variables or a feature toggle service.
4. **Feature modules are replaceable** — `components/swipe/` can be completely rewritten without touching `components/battle/`.

### Scaling Rules

```
Current:   5k users → 1 instance, no caching
Scale 1:  50k users → Add CDN for audio, optimize DB queries
Scale 2: 500k users → Edge Functions for battle, Redis for leaderboard
Scale 3:   5M users → WebSocket for real-time battle, read replicas
```

Each scaling level should add infrastructure, not require frontend rewrites.

---

*End of Engineering Rules — Harf v1.0*

*These rules are enforced from the first commit. No exceptions without written exemption from the Principal Engineer.*
