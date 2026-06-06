# Screen Specifications — Harf

**Version:** 1.0  
**Status:** Production-ready  
**Stack:** Next.js App Router + Tailwind CSS + Framer Motion  
**Device Focus:** Mobile-first (375px–430px)  

---

## Table of Contents

1. Screen Architecture Overview
2. Navigation Hierarchy
3. Global Layout Rules
4. Shared Screen Patterns
5. Animation Rules
6. Gesture Rules
7. Safe Area Rules
8. Loading State Rules
9. Empty State Rules
10. Error State Rules
11. Splash Screen
12. Onboarding Screens
13. Authentication Screens
14. Home Screen
15. Swipe Learning Screen
16. Battle Mode Screen
17. Boss Battle Screen
18. Battle Selection Screen
19. Progress Screen
20. Leaderboard Screen
21. Profile Screen
22. Settings Screen
23. Reward Modal
24. Notification Components

---

## 1. Screen Architecture Overview

### Screen Taxonomy

Harf memiliki 3 kategori screen:

```
PUBLIC (No auth required)
├── Splash
├── Onboarding (3-step wizard)
└── Auth (Login / Register / Forgot Password)

MAIN (Auth required, bottom nav visible)
├── Home (Tab 1 — Beranda)
├── Battle Select (Tab 2 — Battle)
├── Progress (Tab 3 — Progress)
└── Profile (Tab 4 — Profil)

IMMERSIVE (Auth required, bottom nav hidden)
├── Swipe Session
├── Battle Arena
└── Boss Battle Arena

OVERLAY (Rendered on top of current screen)
├── Reward Modal
├── Settings Sheet
├── Share Sheet
├── Word Detail Sheet
├── Confirm Dialog
└── Toast / Notification
```

### Screen State Machine

Setiap screen memiliki siklus state yang konsisten:

```
ENTER (mount) → LOADING (fetch) → RENDERED (active) → EXIT (unmount)
                                     │
                                     ├── ERROR (retry)
                                     └── EMPTY (action)
```

| State | Duration | Visual | Behavior |
|-------|----------|--------|----------|
| ENTER | 200-350ms | Slide/fade transition | Animation in |
| LOADING | <3s (target) | Skeleton / spinner | Fetch data |
| RENDERED | User-controlled | Full UI | Interaction |
| EMPTY | Until action | Illustration + CTA | Guide user |
| ERROR | Until retry | Mascot sad + message | Retry button |
| EXIT | 150-250ms | Slide/fade transition | Animation out |

---

## 2. Navigation Hierarchy

### Navigation Depth Rules

```
PUBLIC ZONE (depth 0-1)
  Splash → auto → Onboarding → auto → Auth OR Home

MAIN ZONE (depth 0, bottom nav)
  [Tab 1] Home
  [Tab 2] Battle Select
  [Tab 3] Progress
  [Tab 4] Profile

DEEP ZONE (depth 1-2)
  Home → Swipe Session (deep 1)
  Battle Select → Battle Arena (deep 2)
  Battle Arena → Boss Battle Arena (deep 2)
  Profile → Settings (deep 1, sheet)

OVERLAY ZONE (depth 0-1, modal)
  Any → Reward Modal
  Any → Share Sheet
  Any → Confirm Dialog
  Any → Word Detail Sheet
```

### Navigation Transition Matrix

| From | To | Transition | Duration | Nav Visibility |
|------|----|-----------|----------|----------------|
| Any tab | Same tab | Scroll to top | 200ms | Visible |
| Home | Swipe | Slide left (page push) | 250ms | Hidden |
| Home | Battle Arena | Slide left + scale | 300ms | Hidden |
| Battle Select | Battle Arena | Zoom in (VS effect) | 400ms | Hidden |
| Battle Arena | Battle Select | Slide down + fade | 250ms | Visible |
| Any page | Modal | Slide up (bottom sheet) | 300ms | Dimmed background |
| Modal | Any page | Slide down | 200ms | Restore |
| Auth | Onboarding | Slide left | 250ms | Hidden |
| Onboarding | Home | Zoom out (reveal) | 400ms | Appear after |

### Back Navigation Behavior

| Screen | Back Action | Result |
|--------|------------|--------|
| Onboarding Step 2/3 | Swipe right or arrow | Previous step |
| Swipe Session | Button "Selesai" (not gesture) | Session summary to Home |
| Battle Arena | Button "Menyerah" (not gesture) | Confirm to Battle Select |
| Battle Result | Auto-dismiss 3s or tap | Battle Select or Home |
| Settings | Swipe right or arrow | Profile |
| Modal | Swipe down or backdrop tap | Dismiss |

---

## 3. Global Layout Rules

### Screen Canvas

Setiap screen dibangun di atas canvas yang konsisten:

```
───────────────────────────────────────────────  safe-area-top (44px)
STATUS BAR (system)
───────────────────────────────────────────────
HEADER (per-screen, 0-56px)
───────────────────────────────────────────────

┌───────────────────────────────────────────────┐
│                                                │
│         CONTENT AREA                           │  max-w-[430px], mx-auto
│         (overflow-y-auto)                      │  px-4 (16px)
│                                                │
│                                                │
└───────────────────────────────────────────────┘

───────────────────────────────────────────────
BOTTOM NAV (64px, only in MAIN zone)            pb-safe
───────────────────────────────────────────────
```

### Container Dimensions

```css
.screen-container {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.screen-content {
  flex: 1;
  overflow-y: auto;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 24px; /* +64px if bottom nav visible */
  -webkit-overflow-scrolling: touch;
}

.screen-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}
```

### Header Patterns

| Header Type | Height | Elements | Used On |
|------------|--------|----------|---------|
| minimal | 48px | Streak (L) + XP (R) | Home |
| title | 56px | Back? + Title + Action? | Battle, Progress, Profile |
| centered | 56px | Logo centered | Auth, Splash |
| hidden | 0px | None (immersive) | Swipe, Battle Arena |
| onboarding | 48px | Step dots (L) + Skip (R) | Onboarding |

### Page Padding Rules

| Zone | Top Padding | Bottom Padding | Horizontal |
|------|------------|----------------|------------|
| Main pages (with nav) | 8px | 96px (24 + 64 nav + 8 safe) | 16px |
| Immersive pages | 8px | 24px | 16px |
| Auth pages | 48px | 24px | 24px |
| Onboarding | 24px | 32px | 24px |
| Modal content | 0px (handle: 12px) | 24px | 20px |

---

## 4. Shared Screen Patterns

### Skeleton Loading Pattern

```
───────────────────────────────────────────────
SKELETON SCREEN (while data loads)

  ▓▓▓▓▓▓▓▓▓▓▓▓▓  (h-8, w-1/3, rounded)       Title skeleton

  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              Card skeleton
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              (h-32, rounded-2xl)
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                     Card skeleton
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                     (h-24)
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

  Animasi: pulse (opacity 1 to 0.4 to 1)
  Duration: 1.5s loop
───────────────────────────────────────────────
```

### Empty State Pattern

```
───────────────────────────────────────────────
EMPTY STATE

          🐦 (mascot sad/lazy)                80-120px

    "Belum ada data nih!"                      title (heading-1)

    Mulai belajar untuk melihat                description (body)
    progress kamu di sini.

  ┌───────────────────────────────────────┐
  │  👆  Mulai Belajar                    │   CTA (primary button)
  └───────────────────────────────────────┘

Spacing:
  - Mascot: margin-bottom 16px
  - Title: margin-bottom 8px
  - Description: margin-bottom 24px
  - CTA: full width
───────────────────────────────────────────────
```

### Error State Pattern

```
───────────────────────────────────────────────
ERROR STATE

        🐦😅 (mascot confused/sad)

    "Yah, ada yang error!"

    Sepertinya ada masalah.
    Coba lagi ya!

  ┌───────────────────────────────────────┐
  │  🔄  Coba Lagi                       │   Primary button
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  🏠  Ke Beranda                      │   Secondary button
  └───────────────────────────────────────┘
───────────────────────────────────────────────
```

### Offline Indicator

```css
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  height: 32px;
  background: #F97316;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #FEFCE8;
  transform: translateY(0);
  transition: transform 250ms ease-out;
}
```

---

## 5. Animation Rules

### Screen Transitions

| Transition | Type | Config | Usage |
|-----------|------|--------|-------|
| slideLeft | Page push | x: 100 to 0 + opacity | Tab forward, deep link |
| slideRight | Page pop | x: -100 to 0 + opacity | Back navigation |
| slideUp | Modal/Sheet | y: 100% to 0 + opacity | Bottom sheet, reward |
| slideDown | Dismiss modal | y: 0 to 100% | Close sheet |
| zoomIn | Immersive | scale: 0.8 to 1 + opacity | Battle arena entry |
| zoomOut | Exit immersive | scale: 1 to 0.8 + opacity | Battle exit |
| fadeIn | Overlay | opacity: 0 to 1 | Backdrop, dialog |

### Framer Motion Variants

```typescript
export const pageTransition = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

export const modalTransition = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
  transition: { type: 'spring', stiffness: 200, damping: 25, mass: 0.8 },
};

export const backdropTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const zoomTransition = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.85, opacity: 0 },
  transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
};
```

### Stagger Children Pattern

```typescript
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};
```

### Element Animation Reference

| Element | Enter | Exit | Interactive |
|---------|-------|------|-------------|
| Card | scale(0.95) + y(20) to 0, 300ms | scale(0.95) + opacity(0), 200ms | scale(0.98) on press |
| Button | Slide up 20px to 0, 200ms | Fade out, 150ms | scale(0.95) on press |
| List item | Stagger fade + slide | Fade | --- |
| Modal | Spring y(100% to 0), 300ms | Tween y(0 to 100%), 200ms | Drag to dismiss |
| Backdrop | Fade in, 200ms | Fade out, 150ms | Tap to close |
| Mascot | Fall in + bounce, 500ms | Fade + shrink, 300ms | --- |
| XP Float | Scale(0.5 to 1) + y(0 to -60), 800ms | --- | --- |
| Toast | Slide down y(-20 to 0), 250ms | Slide up + fade, 200ms | Auto 3s |

### Performance Rules

1. Hanya transform dan opacity -- jangan animasi width, height, top, left
2. will-change: transform untuk elemen yang bergerak (swipe cards, modals)
3. transform: translateZ(0) untuk GPU acceleration di iOS Safari
4. AnimatePresence hanya untuk mount/unmount
5. Batch state updates sebelum animasi dimulai
6. prefers-reduced-motion -- semua animasi jadi fade 100ms

---

## 6. Gesture Rules

### System-Wide Gestures

| Gesture | Zone | Action | Screen |
|---------|------|--------|--------|
| Swipe right | Full card | "Tahu" (correct) | Swipe |
| Swipe left | Full card | "Tidak tahu" (incorrect) | Swipe |
| Tap | Card | Reveal answer + meaning | Swipe |
| Tap | Audio button | Play pronunciation | Swipe |
| Tap | Answer option | Submit answer | Battle |
| Swipe down | Modal | Dismiss | All modals |
| Tap backdrop | Outside modal | Dismiss | All modals |
| Swipe right | Screen edge | Go back | Settings, Onboarding |

### Thumb-Friendly Touch Zones

```
────────────────────────────────────
 ZONE TOP (0-120px): Info only
    Streak, XP, Level display
    No interactive elements

 ZONE MID (120-400px): Content
    Cards, swipe zone, scrollable content

 ZONE BOTTOM (400-600px): Actions
    Primary buttons, CTAs

 ZONE NAV (600+ px): Navigation
    Bottom nav bar (thumb-friendliest)
────────────────────────────────────
```

### Touch Target Minimums

| Element | Min Size | Ideal Size |
|---------|----------|------------|
| Bottom nav tab | 48x48 | 56x56 |
| Primary button | 44x44 | 52x52 |
| Secondary button | 44x44 | 48x48 |
| Icon button (audio, close) | 40x40 | 44x44 |
| Swipe card | full width | full width |
| Answer option (battle) | 44px height | 52px height |
| Horizontal scroll item | 120x120 | 140x140 |

### Swipe Sensitivity

| Parameter | Value | Notes |
|-----------|-------|-------|
| Threshold | 30% of card width | Minimum drag to trigger |
| Max rotation | 15 degrees | Clamped at threshold |
| Snap-back spring | stiffness: 300, damping: 25 | Returns in 200ms |
| Swipe-out spring | stiffness: 200, damping: 20 | Exits in 300-500ms |
| Velocity threshold | 500px/s | Fast flick = immediate swipe |
| Debounce | 500ms | Min time between cards |

---

## 7. Safe Area Rules

### Safe Area Implementation

```css
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sar: env(safe-area-inset-right, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
}
```

### Safe Area By Screen

| Screen | Top Safe | Bottom Safe | Notes |
|--------|----------|-------------|-------|
| Splash | 0 (full screen) | 0 | Full bleed |
| Onboarding | 44px | 0 | Status bar only |
| Auth | 44px | 24px | Status bar + keyboard |
| Home | 44px | nav + sab | Streak/XP in safe zone |
| Swipe | 0 (full screen) | sab | Immersive |
| Battle Arena | 0 (full screen) | sab | Immersive |
| Progress | 44px | nav + sab | --- |
| Profile | 44px | nav + sab | --- |
| Settings | 44px | sab + 16px | Sheet style |
| Modal | 0 | sab + 16px | Sheet style |

### Notch / Dynamic Island Handling

```typescript
export const SAFE_AREA = {
  top: 'pt-[max(12px,env(safe-area-inset-top))]',
  bottom: 'pb-[max(8px,env(safe-area-inset-bottom))]',
  headerTop: 'pt-[max(44px,env(safe-area-inset-top))]',
  navBottom: 'pb-[max(8px,env(safe-area-inset-bottom))]',
};
```

### Keyboard Avoidance

| Screen | Keyboard Behavior |
|--------|-------------------|
| Login (email) | Scroll to field, fixed elements adjust |
| Register | Same as login |
| Forgot Password | Same as login |
| Profile Edit | Same as login |
| All other screens | No text input, no keyboard needed |

```typescript
function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    };

    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, []);

  return height;
}
```

---

## 8. Loading State Rules

### Loading Strategy By Duration

| Duration | Strategy | Visual |
|----------|----------|--------|
| <300ms | No loading indicator | Instant render |
| 300ms-1s | Inline skeleton | Small placeholder |
| 1s-3s | Page skeleton | Full skeleton layout |
| >3s | Skeleton + loading tip | Skeleton + rotating tip |

### Skeleton Design System

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}
```

### Per-Component Skeleton Sizes

| Component | Skeleton Size | Shape |
|-----------|--------------|-------|
| Streak indicator | h-10 w-32 | rounded-lg |
| XP bar | h-12 w-full | rounded-full |
| Mission card | h-20 w-full | rounded-2xl |
| Swipe card | h-[400px] w-full | rounded-2xl |
| Battle card | h-[300px] w-full | rounded-2xl |
| Stats card | h-24 w-full | rounded-2xl |
| Badge grid item | h-24 w-24 | rounded-2xl |
| Leaderboard row | h-16 w-full | rounded-xl |
| Profile card | h-32 w-full | rounded-2xl |

### Loading Sequence Per Screen

| Screen | First Render | Then Load | Finally |
|--------|-------------|-----------|---------|
| Home | Skeleton layout | Profile, streak, missions | Animate in sections |
| Battle | Skeleton cards | Enemy list, user stats | Animate in cards |
| Progress | Skeleton grid | Stats, badges, chart | Animate in staggered |
| Profile | Skeleton card | User data, badges | Animate in |
| Swipe | Full-screen skeleton | Word list (10 cards) | First card slide in |
| Battle Arena | VS animation (cover) | Questions, enemy data | Battle start |
| Leaderboard | Skeleton rows | Rankings | Animate rows |

---

## 9. Empty State Rules

### Empty State Triggers

| Screen | Empty Condition | CTA |
|--------|----------------|-----|
| Home | First visit, no data yet | "Mulai Belajar" |
| Battle | No battles completed | "Coba Battle Pertama" |
| Progress | No progress data | "Belajar Sekarang" |
| Leaderboard | No friends on leaderboard | "Ajak Teman" |
| Badges | No badges earned | "Mulai Dapatkan Badge" |
| History | No learning history | "Mulai Belajar" |
| Notifications | No notifications | (dismiss) |

### Empty State Layout

```typescript
interface EmptyStateProps {
  mascot: MascotExpression; // 'sad' | 'lazy' | 'confused'
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  secondaryAction?: { label: string; onAction: () => void };
}
```

Spacing: mascot (80px, mb-4), title (20px, mb-2), description (body, mb-6), CTA (full width button)

---

## 10. Error State Rules

### Error Screen Hierarchy

```
1. OFFLINE ERROR
   ├── No internet connection
   ├── Show offline banner (sticky top)
   ├── Allow cached content
   └── Retry automatically when online

2. SERVER ERROR (5xx)
   ├── Mascot confused
   ├── "Yah, server-nya sibuk!"
   ├── Retry button
   └── Auto-retry after 5s (if retryable)

3. CLIENT ERROR (4xx)
   ├── Auth error to redirect to login
   ├── Not found to 404 page
   └── Validation to inline error message

4. TIMEOUT
   ├── "Koneksi lambat nih..."
   ├── Retry button
   └── Offline mode suggestion
```

### Error UI By Screen

| Screen | Error Type | Visual | Action |
|--------|-----------|--------|--------|
| Splash | Loading timeout | Mascot confused | Retry |
| Auth | Wrong password | Inline red text | "Lupa password?" link |
| Auth | Network error | Toast + retry | Retry button |
| Home | Fetch failed | Full error state | Retry or offline |
| Swipe | Word fetch failed | Error card | Skip to next |
| Battle | Question fetch failed | Error overlay | Retry question |
| Battle | Network lost | "Menunggu koneksi..." | Auto-reconnect |
| Progress | Stats failed | Section error state | Retry section |

---

## 11. Splash Screen

### Purpose

First impression -- brand intro, asset preloading, mascot introduction. Duration: 1.5-2.5s.

### Layout Structure

```
───────────────────────────────────────────────
(full viewport, no safe area)

                    🐦                        Burhan mascot
                (scale 0 to 1)                 120px, center

              ┌─────────────┐
              │   حَرْف      │                 Arabic (48px, gold)
              └─────────────┘

               H A R F                          Latin brand (28px)

      Belajar Bahasa Arab, Serasa Main Game    Tagline (14px)

              ░░░░░░░░░░░░░░░                  Loading bar
              (indeterminate)                  (hidden if <1s)

          v1.0  --  Harf                       Version (12px, bottom)

Background: bg-bg-primary (#0A0F1E) with subtle gradient-glow at center
```

### Animation Sequence

```
TIME 0.0s:  Screen appears (instant)
   ├── Background: fade in from black (300ms)
   ├── Gradient-glow: scale up (2s, slow pulse)

TIME 0.3s:  First element
   ├── Mascot: scale 0 to 1, spring bounce (600ms)
   │   ├── stiffness: 150, damping: 12 (bouncy)
   │   └── followed by: idle float animation

TIME 0.8s:  Brand appears
   ├── Arabic "حَرْف": slide up + fade (400ms, delay 200ms)
   ├── Latin "HARF": slide up + fade (400ms, delay 100ms from Arabic)
   ├── Tagline: fade in (300ms, delay 200ms from Latin)

TIME 1.2s:  Mascot blink
   ├── Burhan: blink animation (100ms)

TIME 1.8s:  Loading bar (if assets still loading)
   ├── Indeterminate progress bar: pulse animation

TIME 2.0s:  Transition out
   ├── Scale down + fade (300ms)
   ├── Mascot waves goodbye (200ms)
   └── to Onboarding (first time) or to Home (returning)
```

### Loading Behavior

| Condition | Duration | Action |
|-----------|----------|--------|
| First visit, assets cached | 1.5s min | Show full splash, proceed to onboarding |
| Returning user, data synced | 1.5s min | Show full splash, proceed to home |
| App restored from background | 0s | Skip splash entirely |
| Slow network (assets loading) | Wait max 3s | Show loading bar, then proceed |
| Loading error (asset failed) | 2s max | Skip to next screen, log error |

### Mascot Intro

```
Position: Center, y-offset -20px from exact center
Size: 120px (huge for impact)
Expression: HAPPY to blink to IDLE
Float: gentle y-offset 8px, 3s loop, ease-in-out

On splash end:
  Mascot: excited jump (scale 1.2 to 1, 300ms)
  Then: fade out (200ms)
```

### Implementation Notes

- Gunakan AnimatePresence untuk exit transition
- Preload critical assets (fonts, mascot sprite, logo) selama splash
- Jangan render bottom nav atau screen shell selama splash
- will-change: transform pada mascot untuk float animation
- Arabic dan Latin text harus independent animation (jangan dalam satu container)

---

## 12. Onboarding Screens

### Flow Overview

```
ONBOARDING (3-step wizard)
  Step 1: Tujuan Belajar (goal)
  Step 2: Level Kemampuan (skill)
  Step 3: Target Harian (daily goal)

Each step:
  - Single choice card selection
  - No scrolling needed (3 options max, full viewport)
  - Progress dots at top
  - Skip button top-right
```

### Step 1 -- Tujuan Belajar

```
───────────────────────────────────────────────
  ○ ○ ○                          [Lewati]      Progress dots + skip

        🎯  "Apa tujuan kamu                   Question (20px, bold)
             belajar bahasa Arab?"

  ┌───────────────────────────────────────┐
  │  📖  Ngerti Al-Quran                 │    Option 1 (big card)
  │       Fokus: Quranic vocabulary       │    h-24, rounded-2xl
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  🗣️  Bisa Ngobrol                    │    Option 2
  │       Fokus: daily conversation       │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  📚  Bantu Sekolah/Kuliah            │    Option 3
  │       Fokus: academic vocabulary      │
  └───────────────────────────────────────┘

    (No button -- tap card to proceed)
───────────────────────────────────────────────

Spacing:
  Question: margin-top 48px, margin-bottom 32px
  Card gap: 12px
  Card height: 96px (h-24)
```

### Step 2 -- Level Kemampuan

```
───────────────────────────────────────────────
  ● ○ ○                          [Lewati]

       📊  "Seberapa bisa kamu
            membaca Arab?"

  ┌───────────────────────────────────────┐
  │  🌱  Pemula                          │
  │       Belum bisa baca Arab           │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  🌿  Lumayan                         │    RECOMMENDED
  │       Bisa baca, arti terbatas       │    (subtle label)
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  🌳  Mahir                           │
  │       Bisa baca + tahu banyak arti   │
  └───────────────────────────────────────┘

       ← Kembali          (tap card to next)
───────────────────────────────────────────────
```

### Step 3 -- Target Harian

```
───────────────────────────────────────────────
  ● ● ○                          [Lewati]

       ⏱️  "Target belajar per hari?"

  ┌───────────────────────────────────────┐
  │  😌  Santai (5 menit)               │
  │       5-10 kartu per sesi            │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  💪  Sedang (10 menit)               │    RECOMMENDED
  │       10-20 kartu per sesi           │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  🔥  Rajin (20 menit)               │
  │       20-30 kartu per sesi           │
  └───────────────────────────────────────┘

       ← Kembali          (tap card to next)
───────────────────────────────────────────────
```

### Onboarding Completion (Trigger)

Setelah Step 3, user langsung masuk ke First Swipe Session (tutorial 5 cards). Tidak ada "completion screen" -- transisi langsung ke action.

```
After Step 3:
  Brief 500ms transition:
  ● ● ● to checkmark animation
  "Mulai belajar, yuk!" (mascot excited)
  to auto-proceed to Swipe (tutorial)
```

### Card Selection Animation

```typescript
// When user taps an option card:
const cardVariants = {
  default: {
    scale: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  selected: {
    scale: 0.98,
    borderColor: 'rgba(16,185,129,0.5)',
    boxShadow: '0 0 20px rgba(16,185,129,0.2)',
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  unselected: {
    opacity: 0.4,
    scale: 0.95,
  },
};

// On tap:
// 1. Selected card: scale 0.98 + emerald border + glow
// 2. Other cards: fade to 0.4 opacity
// 3. Wait 300ms
// 4. All cards slide left + fade
// 5. Next step enters (slide right)
```

### Progress Dots

```
● ○ ○  Step 1 (current)
● ● ○  Step 2 (current)
● ● ●  Step 3 (current, then completion)

Specs:
  - Size: 8px diameter
  - Active: bg-emerald-400
  - Inactive: bg-white/20
  - Gap: 6px
  - Container: center, below question
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| User taps skip | Save defaults (Quran + Pemula + Sedang), go to swipe |
| User taps back | Restore previous selection, animate reverse |
| User re-taps different card | Deselect previous, select new (no delay) |
| Network error during onboarding | Not needed (all local), proceed offline |
| App killed during onboarding | Restart from step 1 (no persistence until complete) |

### Implementation Notes

- Onboarding adalah client-only -- tidak perlu fetching data
- Gunakan useRef untuk tracking current step
- Card options: gunakan motion.div dengan whileTap={{ scale: 0.95 }}
- Progress dots: gunakan motion.div dengan layout untuk animated dot movement
- Header: position: absolute di atas content
- Skip button: text-text-secondary, text-label, font-semibold

---

## 13. Authentication Screens

### Login Screen

```
───────────────────────────────────────────────

              ┌─────────────┐
              │   حَرْف      │                 Arabic brand (36px)
              └─────────────┘
               H A R F                          Latin brand (24px)

   "Belajar Bahasa Arab, Serasa Main Game"    Tagline (14px)

  ┌───────────────────────────────────────┐
  │  🔴  Lanjut dengan Google            │    Google OAuth
  └───────────────────────────────────────┘    btn-secondary style

  ┌───────────────────────────────────────┐
  │  ⚫️  Lanjut dengan Apple             │    Apple OAuth
  └───────────────────────────────────────┘

  ──────────── atau ────────────               Divider

  ┌───────────────────────────────────────┐
  │  ✉️  Email                            │    Input field
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  🔒  Password                        │    Input field
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  Masuk                               │    Primary button
  └───────────────────────────────────────┘

  Lupa password?

  ──── Belum punya akun? ────
  ┌───────────────────────────────────────┐
  │  Daftar                               │    Ghost button
  └───────────────────────────────────────┘

  ──── atau ────
  Nanti aja (Guest)

───────────────────────────────────────────────
```

### Register Screen

```
───────────────────────────────────────────────
  ← Kembali                         H A R F    Minimal header

       "Buat akun baru"                        Title

  ┌───────────────────────────────────────┐
  │  👤  Nama lengkap / username         │    Input
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  ✉️  Email                            │    Input
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  🔒  Password                        │    Input
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  🔒  Konfirmasi password             │    Input
  └───────────────────────────────────────┘

  ☐  Saya setuju dengan Syarat & Ketentuan

  ┌───────────────────────────────────────┐
  │  Daftar                               │    Primary button
  └───────────────────────────────────────┘

  Sudah punya akun?  Masuk

  ──── atau ────
  Nanti aja (Guest)
───────────────────────────────────────────────
```

### Forgot Password Screen

```
───────────────────────────────────────────────
  ← Kembali

       🔒  "Lupa password?"

   Masukkan email untuk link reset password

  ┌───────────────────────────────────────┐
  │  ✉️  Email                            │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  Kirim Link Reset                    │    Primary button
  └───────────────────────────────────────┘

  (After success)
  ✅  Cek email kamu untuk link reset

  ← Kembali ke login
───────────────────────────────────────────────
```

### Auth Button Specifications

```css
/* OAuth Buttons */
.btn-google {
  background: #FFFFFF;
  color: #1C1917;
  border: 1px solid rgba(0,0,0,0.1);
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-apple {
  background: #000000;
  color: #FFFFFF;
  border: 1px solid rgba(255,255,255,0.1);
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
```

### Input Validation States

| State | Border | Text | Icon |
|-------|--------|------|------|
| Default | border-white/10 | text-text-secondary | --- |
| Focused | border-emerald-500 | text-text-primary | --- |
| Filled | border-white/10 | text-text-primary | ✅ |
| Error | border-red-500 | text-red-400 | ❌ |
| Success | border-emerald-500 | text-emerald-400 | ✅ |

### Guest Mode Prompt

Setelah 3 battle atau 20 kata (guest), muncul bottom sheet:

```
  🐦  "Progress kamu akan hilang
       jika tidak daftar!"

  Data kamu:
  - XP: 350
  - Streak: 3 hari
  - Kata dipelajari: 20

  ┌───────────────────────────────────────┐
  │  📝  Daftar Sekarang                 │    Primary CTA
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  Nanti (progress lokal disimpan)     │    Ghost button
  └───────────────────────────────────────┘
```

### Implementation Notes

- Auth screens: route group (auth)/ -- no bottom nav, centered layout
- Gunakan useFormState untuk form validation
- Optimistic UI: tombol "Masuk" ke loading spinner ke success/error
- Social auth: buka popup window, listen for callback

---

## 14. Home Screen

### Layout Structure

```
───────────────────────────────────────────────  safe-area-top
  🔥🔥 Hari ke-7   Striker    +250 XP   Lv 7   Streak + XP Header
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  7/14 to Blaze!      Streak progress bar
───────────────────────────────────────────────

  🐦  "Selamat pagi, Rizky! Ayo belajar!"      Mascot greeting

  ┌───────────────────────────────────────┐
  │  👆  Lanjut Belajar                  │    Primary CTA (full width)
  │      5 kata baru menunggumu!         │    h-14, emerald gradient
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  ⚔️  Battle Cepat (2 menit)          │    Secondary CTA
  └───────────────────────────────────────┘

  📋  Misi Harian                             Section title

  ┌──────┐ ┌──────┐ ┌──────┐                 Horizontal scroll
  │ 📖   │ │ ⚔️   │ │ 🔊   │                 mission cards
  │ 10/10│ │ 0/1  │ │ 3/5  │                 3 cards, 140px wide
  │ ✅   │ │ 50XP │ │ 30XP │
  └──────┘ └──────┘ └──────┘

  🏆  Peringkat: #12 di antara teman          Leaderboard preview

  👤 Rizky -- belajar 15 kata            (2m) Friend activity feed
  👤 Aisyah -- naik rank!                (15m) 2-3 items
  👤 Budi -- streak 5 hari 🔥            (1j)

  📖  Kata Hari Ini                           Word of the day
  ┌───────────────────────────────────────┐
  │  السلام عليكم                        │    Arabic (36px)
  │  "Assalamu'alaikum"                  │    Transliteration
  │  Semoga keselamatan atasmu           │    Meaning
  └───────────────────────────────────────┘

───────────────────────────────────────────────
  🏠         ⚔️        📊        👤           Bottom nav (64px)
───────────────────────────────────────────────
```

### Element Detail

#### Streak + XP Header

```
Position: Sticky top, below safe area
Height: 48px
Background: transparent

Left side: Streak
  - Fire icon: 20px, animated (subtle sway)
  - Streak number: 20px, font-extrabold
  - Streak label "Striker": 12px, text-text-tertiary

Right side: XP
  - Level: 12px, text-text-secondary
  - XP amount: 14px, font-bold, text-emerald-400
  - XP bar: 12px height, w-full max-w-[150px], rounded-full
```

#### Mascot Greeting

```
Position: Below header
Height: auto (~64px with text)
Padding: 12px 0

Mascot: 40px, expression: HAPPY
Text: 16px, font-medium, text-text-primary

Time-based greeting:
  04:00-10:59 -> "Selamat pagi"
  11:00-14:59 -> "Selamat siang"
  15:00-17:59 -> "Selamat sore"
  18:00-03:59 -> "Selamat malam"
```

#### Primary CTA (Lanjut Belajar)

```
Height: 56px (h-14)
Radius: 16px (rounded-2xl)
Gradient: bg-gradient-to-r from-emerald-500 to-emerald-600
Shadow: shadow-lg shadow-emerald-500/20
Press: scale 0.97

Subtitle conditions:
  - Due words >0: "X kata menunggumu!"
  - New words available: "X kata baru!"
  - All reviewed: "Keren! Semua sudah dipelajari!"
  - First visit: "Mulai belajar sekarang!"
```

#### Secondary CTA (Battle Cepat)

```
Height: 48px (h-12)
Radius: 16px (rounded-2xl)
Background: bg-white/5, border border-white/10
Press: scale 0.97, bg-white/10
```

#### Daily Missions Section

```
Mission card specs:
  Width: 140px
  Height: 96px
  Radius: 16px
  Background: bg-bg-card
  Border: border-white/5
  Padding: 12px

States:
  - Active: normal border, icon colored
  - Completed: green check + emerald border + subtle glow
  - Claimable: gold border + pulse glow
  - Locked: opacity 0.5, lock icon
```

#### Leaderboard Preview

```
  🏆  Peringkat: #12 di antara teman   to

  #1  👤 Aisyah      2,450 XP  🔥🔥
  #2  👤 Budi        2,100 XP  🔥
  #3  👤 Citra       1,890 XP  🔥

  Top 3 only, "to" navigates to full leaderboard
  Height: ~120px
  Tap anywhere to navigate
```

#### Word of the Day

```
Card: rounded-2xl, bg-bg-card, padding 16px
Arabic: centered, 36px, font-arabic, text-gold-300
Transliteration: centered, 14px, text-text-secondary
Meaning: centered, 16px, text-text-primary
Actions: horizontal row, gap 8px (audio, bookmark, save)
```

### Scroll Behavior

```
Section Hierarchy (top to bottom):
  1. STREAK/XP HEADER -- sticky top (z-10)
  2. MASCOT GREETING -- normal flow
  3. PRIMARY CTA -- above fold
  4. SECONDARY CTA -- above fold
  5. DAILY MISSIONS -- horizontal scroll (overflow-x-auto)
  6. LEADERBOARD PREVIEW -- normal
  7. FRIEND ACTIVITY -- normal
  8. WORD OF THE DAY -- normal

Sticky header: position: sticky, top: 0, z-index: 10, bg-bg-primary
```

### Animation Sequence

```typescript
// On home page mount (in order):
const homeAnimation = {
  // 1. Streak indicator (500ms)
  streak: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  // 2. XP bar fill (400ms)
  xpBar: { width: "${percentage}%", transition: { duration: 0.4, ease: 'easeOut' } },
  // 3. Mascot greeting (600ms spring)
  mascot: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 150, damping: 15 } },
  // 4. Primary CTA (200ms)
  cta1: { opacity: 1, y: 0, transition: { delay: 0.2 } },
  // 5. Secondary CTA (200ms, delayed)
  cta2: { opacity: 1, y: 0, transition: { delay: 0.35 } },
  // 6. Missions (300ms, stagger)
  missionCards: staggerItems(0.1, 0.05),
  // 7. Leaderboard + feed (400ms)
  social: { opacity: 1, transition: { delay: 0.5 } },
  // 8. Word of day (400ms)
  wod: { opacity: 1, y: 0, transition: { delay: 0.6 } },
};
```

### States

| State | Handling |
|-------|----------|
| Loading | Skeleton layout |
| Empty (first visit) | Mascot excited, "Welcome!" text |
| Error | Error toast, retry sections individually |
| Offline | Subtle banner, cached data |
| Streak danger | Amber warning banner |

### Implementation Notes

- Home page: app/(main)/page.tsx
- Gunakan useProfileStore dan useStreak hook
- Streak logic: useStreak hook handles calc + display
- Horizontal mission scroll: overflow-x-auto, scroll-snap-type: x mandatory
- Sticky header: CSS position: sticky dengan top: 0
- Word of the day: fetch dari Supabase RPC get_word_of_day
- All sections gracefully degrade (if one fails, others still render)

---

## 15. Swipe Learning Screen

### Layout Structure

```
───────────────────────────────────────────────  Full screen (no safe top)
  🔥 x5 COMBO                      ⏱️ 0:45    Combo (L) + Session timer (R)

  ┌───────────────────────────────────────┐
  │                                        │
  │              كِتَاب                      │    Arabic word (48px)
  │                                        │    font-arabic, gold
  │                                        │
  │          ┌────┐                        │
  │          │ 🔊 │                        │    Audio button (circular)
  │          └────┘                        │    center, emerald
  │                                        │
  │  ┌──────────┐    ┌──────────┐          │
  │  │ ✕  Tidak │    │  ✓  Tahu │          │    Hint buttons (bottom)
  │  └──────────┘    └──────────┘          │
  │                                        │
  │  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░  3/10             │    Progress bar (bottom)
  └───────────────────────────────────────┘    Card (rounded-2xl)

  🐦  "Kamu bisa! Ayo geser!"                 Mascot reaction (bottom)

  ┌──────────────────────┐ ┌──────────────┐   Bottom actions
  │  🔊  Putar Semua      │ │  ✋  Selesai  │
  └──────────────────────┘ └──────────────┘
───────────────────────────────────────────────
```

### Card Specs

| Attribute | Value |
|-----------|-------|
| Width | 100% - 16px (margin left/right 8px) |
| Height | calc(100dvh - 200px) (dynamic, min 320px) |
| Radius | 24px (rounded-3xl) |
| Background | bg-bg-card with subtle gradient |
| Border | border border-white/5 |
| Shadow | shadow-card |
| Drag axis | X only (Y locked) |
| Rotation | Max 15deg at swipe threshold |

### Card Content Layout

```
┌──────────────────────────────────────┐
│  Arabic Word (48px, font-arabic)     │  Center, y-offset -20px
│  font-weight 700, text-gold-300      │
│                                      │
│  ┌────┐                              │  Audio button, 20px below Arabic
│  │ 🔊 │                              │  emerald-400 bg, white icon
│  └────┘                              │
│                                      │
│  (Revealed state)                    │  Only visible after tap/swipe-left
│  "buku" -- 16px, text-text-secondary  │
│  "Kitabun artinya buku" -- 14px       │
│                                      │
│  ┌──────────┐  ┌──────────┐          │  Hint buttons, bottom 20px
│  │ ✕  Tidak │  │  ✓  Tahu │          │  from card edge
│  └──────────┘  └──────────┘          │
│                                      │
│  ▓▓▓▓▓▓▓▓▓▓░░░  3/10                │  Progress, bottom 12px
│                                      │
└──────────────────────────────────────┘
```

### Swipe Gesture Mechanics

```
TOUCH START
  ├── Record startX (clientX)
  ├── Set isDragging = true
  └── Disable vertical scroll (preventDefault touchmove)

TOUCH MOVE
  ├── Calculate offsetX = clientX - startX
  ├── Calculate rotation = clamp(offsetX / cardWidth * 15, -15, 15)
  ├── Calculate overlay opacity:
  │   ├── If offsetX > 0 (right) to green overlay (opacity = min(offsetX/threshold * 0.3, 0.3))
  │   └── If offsetX < 0 (left) to red overlay (opacity = min(abs(offsetX)/threshold * 0.3, 0.3))
  ├── Card scale: slight shrink (1 to 0.95 at threshold)
  └── Update visual: translateX(offsetX) + rotate(rotation) + scale + overlay

TOUCH END
  ├── Calculate velocity (px/s)
  ├── If velocity > 500px/s to FLING
  │   ├── Direction = velocity sign
  │   ├── Animate card off-screen (translateX * 3, 300ms)
  │   └── Process answer
  ├── If |offsetX| > threshold (30% card width) to SWIPE
  │   ├── Direction = offsetX sign
  │   ├── Animate card off-screen (translateX 800, 400ms spring)
  │   └── Process answer
  └── If |offsetX| < threshold to SNAP BACK
      ├── Animate card to center (200ms snappy spring)
      ├── Reset rotation, scale, overlay
      └── No answer recorded
```

### Overlay Visual Feedback

During drag, card shows contextual overlay:

```
SWIPE RIGHT (Tahu):
  ✓  TAHU (large text, centered)
  Background: rgba(16, 185, 129, 0.15) (increases with drag distance)
  Border: emerald-500 glow (increases with drag)

SWIPE LEFT (Tidak Tahu):
  ✕  TIDAK TAHU (large text, centered)
  Background: rgba(239, 68, 68, 0.15) (increases with drag)
  Border: red glow
```

### Answer Processing

```
SWIPE RIGHT (TAHU):
  ├── Result: CORRECT
  ├── Haptic visual: green flash (100ms)
  ├── XP: +10 base + combo bonus
  ├── Combo: +1 to update combo counter (scale bounce)
  ├── Mascot: happy expression (200ms)
  ├── Audio: correct chime (if sound on)
  └── Next card: slide in (350ms gentle spring)

SWIPE LEFT (TIDAK TAHU):
  ├── Result: INCORRECT
  ├── Haptic visual: red flash (100ms)
  ├── Card reveals: Arabic + transliteration + meaning
  ├── XP: +2 (participation)
  ├── Combo: reset to 0 to combo break animation
  ├── Mascot: supportive reaction (300ms)
  ├── Audio: gentle wrong sound
  └── Auto-advance to next card after 1.5s reveal

TAP (REVEAL):
  ├── Card shows answer in-place
  ├── XP: +1
  ├── Combo: no change (neutral)
  └── Card stays visible until user swipes or taps "Sudah"
```

### Combo Animation

```
COMBO INCREASE:
  ├── Counter: scale 1 to 1.3 to 1 (spring, 300ms)
  ├── Color: text-gold-300 at x2-4, text-orange-400 at x5+, text-red-400 at x10+
  ├── Glow: shadow-glow-gold, increases with combo
  └── "🔥 x5 COMBO!" text

COMBO LEVELS:
  0: Not shown
  1: Not shown (still "warming up")
  2: "x2" small, gold text
  3-4: "x4 Medium combo!" medium text + subtle glow
  5: "🔥 x5 COMBO!" large text + sparkle effect + sound
  7+: Pulses, screen edge glow (subtle)
  10: "🔥 x10 COMBO!!!" + brief screen shake + mascot excited

COMBO BREAK:
  ├── "COMBO BROKEN!" text (red, scale down, 500ms)
  ├── Counter: shatters (particle effect, 300ms)
  ├── Mascot: sad to supportive (500ms)
  └── Encouraging text: "Ayo coba lagi!" (fade out 2s)
```

### XP Popup

```
On correct swipe:
    +10 XP 🟢
    Floats up from card center
    y: 0 to -60px
    opacity: 1 to 0
    800ms

On combo bonus:
    +10 COMBO! 🟡
    Golden XP, slightly larger
    Appears after base XP

Implementation:
  <motion.div
    initial={{ y: 0, opacity: 1, scale: 0.5 }}
    animate={{ y: -60, opacity: 0, scale: 1.2 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    +{amount} XP
  </motion.div>
```

### Timer Display

```
  ⏱️ 0:45    Top-right, subtle
Position: Top-right of screen (below safe zone)
Color: text-text-secondary (normal), text-warning (under 30s)
Purpose: Session tracking (not countdown)
Format: MM:SS
Update: every 1s
```

### Mascot Reaction

```
Position: Below card, center
Size: 40px

Reactions map:
  ├── Correct swipe: HAPPY (bounce, 400ms)
  ├── Wrong swipe: SUPPORTIVE (nod, 300ms)
  ├── Combo x5+: EXCITED (jump + sparkle, 600ms)
  ├── Combo break: SAD (shrink, 300ms) to HAPPY (recovery, 500ms)
  ├── Audio played: LISTENING (head tilt, 1s)
  └── Idle: gentle float (3s loop)
```

### Session Completion

```
After last card -- Session Summary:

  🎉  Sesi Selesai!                    Scale bounce in

  ✅  Benar: 8/10
  🔥  Combo tertinggi: x5
  📊  XP Didapat: +120

  🆕  Kata baru: 2
  🔄  Review: 6

  ┌───────────────────────────────────────┐
  │  👆  Lanjut Belajar (+10)            │    Continue
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  🏠  Selesai                         │    Back to home
  └───────────────────────────────────────┘

  Animation sequence:
    1. Background darkens (200ms)
    2. "🎉 Sesi Selesai!" -- scale 0 to 1, spring bounce (500ms)
    3. Stats -- stagger slide up (each 100ms)
    4. Buttons -- slide up (200ms each)
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Swipe too fast (<500ms between cards) | Toast "Slow down! Santai aja 🐦", ignore swipe |
| Card stuck mid-drag | Snap back to center, reset drag state |
| All words completed for today | "Kamu sudah belajar semua kata! Coba Battle!" |
| Network lost mid-session | Continue offline, cache results, sync when back |
| App backgrounded | Save session state, resume within 10min or end |
| Accidental swipe | Show "Undo?" toast for 5s |
| Word playback error | Fallback to transliteration display, no XP bonus |

### Implementation Notes

- app/swipe/page.tsx -- immersive mode (no layout, no bottom nav)
- useSwipe hook handles all gesture logic
- swipeStore manages session state, combo, XP
- Card enter: initial={{ scale: 0.9, y: 50 }}, animate={{ scale: 1, y: 0 }}
- Card exit: swipe direction to x: +/-800, rotate: +/-15
- Audio: audioStore manages playback queue
- Prevent scroll: touchmove preventDefault during drag

---

## 16. Battle Mode Screen

### Layout Structure

```
───────────────────────────────────────────────  Full screen, immersive
  ┌─── PLAYER ─────────────────────────────┐
  │  🛡️ Rizky                    70/100   │    Player HP bar
  │  🔥 Combo x3 (+30% ATK)               │    Player name + HP
  └───────────────────────────────────────┘

  ┌─── VS ────────────────────────────────┐
  │             VS                         │    VS animation (intro only)
  └───────────────────────────────────────┘

  ┌─── ENEMY ─────────────────────────────┐
  │  👹 AI Musafir               40/100   │    Enemy HP bar
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░            │    Enemy name + HP
  └───────────────────────────────────────┘

  ┌─── QUESTION ──────────────────────────┐
  │                                        │
  │            كِتَاب                        │    Arabic word (36px)
  │                                        │
  │  "Apa arti kata di atas?"              │    Question text (16px)
  │                                        │
  │  ┌────────────────────────────┐        │
  │  │  A. Meja                    │        │    Option button
  │  ├────────────────────────────┤        │
  │  │  B. Buku  ✓ correct        │        │    Green highlight
  │  ├────────────────────────────┤        │
  │  │  C. Kursi                   │        │
  │  ├────────────────────────────┤        │
  │  │  D. Pulpen                 │        │
  │  └────────────────────────────┘        │
  │                                        │
  │  ⏱️ ▓▓▓▓▓▓▓▓▓▓░░░░  7/10s            │    Timer bar
  └────────────────────────────────────────┘

  🐦 "Ayo, kamu pasti bisa!"                 Mascot (bottom-left)
                                ✋ Menyerah   Surrender button (bottom-right)
───────────────────────────────────────────────
```

### HP Bars

#### Player HP Bar

```
  🛡️ Rizky                    70/100        Name (L) + HP value (R)
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░       Track (12px height)
  🟢█████████████████████████░░░░░░░░░       Fill color

Background: bg-bg-card (same as screen)
Track height: 12px
Radius: rounded-full
Fill: bg-emerald-500
Fill animation: width transition 300ms ease-out
Low HP (<30%): fill turns amber-500
Critical HP (<15%): fill turns red-500 + pulse animation
```

#### Enemy HP Bar

```
  👹 AI Musafir                  40/100
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░
  🔴████████████████░░░░░░░░░░░░░░░░░░░░

Fill: bg-gradient-to-r from-red-500 to-orange-500
Same structure as player HP bar
When HP <= 0: fill = 0, enemy "death" animation
```

### Question Card

```
Card: rounded-2xl, bg-bg-card, padding 16px
Question: text-center, body-16, text-text-secondary
Options: full width, 4 options stacked, gap 8px
```

### Answer Option States

```
DEFAULT:         bg-white/5, border-white/5
PRESSED:         bg-white/10, scale 0.97
CORRECT:         bg-emerald-500/20, border-emerald-500, text-emerald-400
WRONG:           bg-red-500/20, border-red-500, text-red-400
DISABLED:        opacity 0.4, pointer-events: none
```

### Timer Bar

```
  ⏱️ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  7/10s

Track: h-1.5, bg-white/5, rounded-full
Fill: bg-white/30 (decreases as time runs)
Color changes:
  >5s: white
  3-5s: amber
  0-3s: red + pulse
Width: currentTime / maxTime * 100%
Animation: width transition 1000ms linear
```

### Battle Animation Sequences

#### Correct Answer

```
1. Option: bg-green-500/20 + scale 1.05 (100ms)
2. Damage number on enemy: "-15 ⚔️" float up from enemy (800ms)
3. Enemy HP bar: width decrease (300ms ease-out)
4. Enemy sprite: flash red + shake (100ms)
5. Screen: subtle horizontal shake (2px, 100ms)
6. Combo: scale bounce (300ms)
7. Total feedback time: ~500ms
```

#### Wrong Answer

```
1. Option: bg-red-500/20 + "SALAH!" text (500ms)
2. Show correct answer: green highlight on correct option
3. Player HP bar: width decrease (300ms ease-out)
4. Player sprite: flash red (100ms)
5. Screen: medium shake (4px, 150ms)
6. Combo break: shatter animation (300ms)
7. Show correct answer for 1.5s before next question
8. Total feedback time: ~1.5s
```

### Battle Result Screen

```
  VICTORY! / DEFEATED!                       Large text, centered

  ⚔️  Damage dealt: 85
  🔥  Max combo: x4
  ✅  Correct: 8/10
  📊  Accuracy: 80%

  +250 XP 🟢               +50 Coin 🪙       Rewards

  ┌───────────────────────────────────────┐
  │  🔄  Battle Lagi                     │    CTA (primary)
  └───────────────────────────────────────┘
  ┌───────────────────────────────────────┐
  │  🏠  Kembali ke Beranda              │    CTA (secondary)
  └───────────────────────────────────────┘

  📤  Bagikan hasil

VICTORY:
  ├── "VICTORY!" -- scale 0 to 1.2 to 1, gold color, 600ms spring
  ├── Confetti particles burst from center (2s)
  ├── Stats -- stagger slide up (100ms each)
  ├── Rewards -- XP shower + coin shower (1s)
  ├── Mascot: EXCITED (jump + sparkle)
  └── Auto-dismiss: no (wait for user action)

DEFEAT:
  ├── "DEFEATED!" -- fade in, red color, 400ms
  ├── "Jangan menyerah! Coba lagi!" text (14px, supportive)
  ├── Small XP reward: +25 (participation)
  ├── Mascot: SAD to PROUD (transition 500ms)
  └── Auto-dismiss: no (wait for user action)
```

### Battle Loading / Intro State

```
  ⏳  "Mencari lawan..."                    Loading text

       ┌────┐   VS   ┌────┐
       │ 🛡️ │       │ 👹 │                VS screen
       │    │       │    │                Player vs Enemy
       └────┘       └────┘                sprites loading

              ░░░░░░░░░░░░░░░              Loading bar

Loading time: 1-2s
On complete:
  ├── VS screen animates out (scale up + fade, 300ms)
  ├── Battle arena slides in (300ms)
  ├── Enemy sprite: appear animation (scale 0 to 1, bounce)
  ├── HP bars: slide in from sides (200ms)
  └── First question appears after "MULAI!" text (500ms)

Intro sequence:
              SIAP?                          1s, fade in/out
              3...                           countdown
              2...
              1...
            MULAI!                           scale bounce
```

### Combat State Machine

```
BATTLE STATES:
LOADING to INTRO to QUESTION to CORRECT/WRONG to (next question or) to CHECK WIN
                                                                        ├── Enemy HP <= 0 to VICTORY
                                                                        ├── Player HP <= 0 to DEFEAT
                                                                        └── Questions exhausted to HIGHER HP WINS
VICTORY/DEFEAT to RESULT to BATTLE AGAIN / HOME
```

### Mascot Reactions During Battle

| Event | Expression | Duration |
|-------|-----------|----------|
| Battle start | EXCITED | 600ms |
| Correct answer | HAPPY (bounce) | 400ms |
| Wrong answer | SAD (shrink) to SUPPORTIVE | 500ms total |
| Combo x3+ | PROUD | 300ms |
| Combo x5+ | EXCITED (jump) | 600ms |
| Combo break | CONFUSED to HAPPY | 500ms total |
| Low HP | CONCERNED | until healed |
| Victory | EXCITED (confetti) | 2s |
| Defeat | SAD to PROUD (support) | 800ms total |

### Surrender Flow

```
User taps "Menyerah" (top-right, ghost button):
  ├── Confirm dialog appears:
  │   "Kamu yakin mau menyerah?"
  │   [Ya, Menyerah] [Tetap Battle]
  ├── If yes:
  │   ├── Treated as DEFEAT
  │   ├── No XP reward
  │   └── Battle counted in history
  └── If no:
      └── Resume battle
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Timer expires | Treated as wrong answer, auto-submit |
| Answer all 10 questions, both alive | Higher HP wins; tie to draw (both get 50% reward) |
| Network lost mid-battle | Freeze, "Menunggu koneksi..." overlay, auto-resume |
| App backgrounded | Pause timer (max 5min), show "Battle di-pause" |
| Rapid answer tapping | 200ms debounce on option buttons |
| Critical HP reached | Warning pulse on HP bar, "Hati-hati!" text |

### Implementation Notes

- app/battle/arena/[id]/page.tsx -- immersive, no nav
- battleStore manages all state machine transitions
- Damage: server-authoritative via RPC, client shows optimistic
- Timer: useEffect with setInterval(1000) during active state
- Option buttons: motion.button with layout for smooth repositioning
- HP bars: motion.div with animate={{ width }} for smooth transitions
- Screen shake: CSS keyframes on battle container

---

## 17. Boss Battle Screen

### Differences from Normal Battle

Boss battle adalah enhanced version dari normal battle.

### Dramatic Intro

```
  ⚠️  BOSS BATTLE ⚠️                     Large, red-gold gradient

           ┌──────────────┐
           │  👑 NAHWU    │                Boss sprite (huge)
           │    KING      │                160px, pulsing glow
           └──────────────┘

         "Kamu berani lawan aku?"             Boss dialog

  ┌───────────────────────────────────────┐
  │  ⚔️  MULAI BATTLE!                   │    Gold CTA button
  └───────────────────────────────────────┘

  🎯  Rewards: 500 XP / 100 Coin / Badge      Loot preview

Duration: 2s before battle starts
Animation: dramatic zoom in, screen shake on boss roar
```

### Boss HP Bar

```
  👑 Nahwu King                    200/200
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  🟣████████████████████████████████████████

Color: purple-500 (unique to boss)
Height: 14px (slightly larger than normal)
Has "PHASE" indicator (1/2 or 2/2)
```

### Phase 2 Trigger

```
When Boss HP <= 50%:

    ⚡ PHASE 2 ⚡                          Full screen flash

    "Kau pikir itu saja?!"                Boss dialog

    Timer: 10s to 7s
    Double questions!
    +50% damage taken

Animation:
  1. Screen flash white (100ms)
  2. Screen shake (300ms)
  3. Boss sprite: "angry" transform (scale 1 to 1.2, red glow)
  4. "PHASE 2" text slide in (200ms)
  5. New rules displayed (300ms)
  6. Continue to next question (auto, 1s)
```

### Enhanced Animations

| Element | Normal | Boss |
|---------|--------|------|
| Intro | Fade in | Zoom + shake + dialog |
| Correct hit | -15 damage | -20 damage, larger shake |
| Wrong answer | -15 to player | -20 to player |
| Combo effect | Standard | Enhanced glow + larger particles |
| Timer | 10s | 10s (7s in phase 2) |
| Victory | Confetti | Mega confetti + "BOSS SLAIN!" + special sound |
| Background | Static | Subtle animated glow (red/purple) |

### Reward Chest

```
On victory:

          👑 BOSS SLAIN! 👑               Gold, massive

  ┌───────────────────────────────────────┐
  │          ┌────────────┐               │
  │          │ 🎁 CHEST   │               │    Animated chest
  │          │   (tap)    │               │    shake + glow
  │          └────────────┘               │
  └───────────────────────────────────────┘

  Tap chest untuk membuka!

Chest states:
  Closed: gold chest, "glow" pulse animation
  Opening: lid opens, light burst (500ms)
  Opened: shows 3 items (XP, coins, badge)

Items:
  ├── 500 XP (guaranteed)
  ├── 100 Coin (guaranteed)
  └── Boss Slayer Badge (first time only, then random item)
```

### Progression Pacing

```
BOSS SCHEDULE:
  - First boss: Level 10 (Rank Musafir)
  - Second boss: Level 15 (Rank Penuntut Ilmu)
  - Third boss: Level 20 (Rank Mujtahid)
  - Every 5 ranks to new boss

BOSS LEVEL SCALING:
  Level 10 boss: 200 HP, 2 phases, timer 10s/7s
  Level 15 boss: 300 HP, 3 phases, timer 8s/6s
  Level 20 boss: 400 HP, 3 phases, timer 7s/5s
```

---

## 18. Battle Selection Screen

### Layout Structure

```
  ←                    ⚔️  Battle        🐦    Header

  "Pilih lawanmu!"                            Subtitle

  ┌───────────────────────────────────────┐
  │  🌱 Pemula Bot                       │    Battle card
  │  50 HP | 10 soal                     │    Always available
  │  💰 100-150 XP | 30-50 Coin          │
  │  ┌────────────────────────────────┐   │
  │  │  ⚔️  BATTLE!                   │   │    CTA
  │  └────────────────────────────────┘   │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  🧭 Musafir Bot                      │    Unlock at rank Musafir
  │  80 HP | 10 soal                     │    (level 6+)
  │  💰 150-250 XP | 50-80 Coin          │
  │  ┌────────────────────────────────┐   │
  │  │  🔒 Buka di Level 6           │   │    Locked state
  │  └────────────────────────────────┘   │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  👑 Nahwu King                       │    Boss, every 5 ranks
  │  200 HP | 2 Phase | Boss             │
  │  💰 500 XP | 100 Coin | Badge        │
  │  ┌────────────────────────────────┐   │
  │  │  👑 Lawan Boss!               │   │    Boss CTA
  │  └────────────────────────────────┘   │
  └───────────────────────────────────────┘

  ⚔️  Riwayat Battle                        Expandable section
  ✅ Lawan Pemula Bot -- Menang  (2j)
  ❌ Lawan Pemula Bot -- Kalah  (5j)
  ✅ Lawan Musafir Bot -- Menang (1h)
```

### Battle Card Specs

```css
.battle-card {
  background: bg-bg-card;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  margin-bottom: 12px;
}

.battle-card--locked {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.battle-card--boss {
  border-color: rgba(250, 204, 21, 0.3);
  background: linear-gradient(180deg, #1A2332, rgba(250, 204, 21, 0.05));
}
```

| State | Visual | Button |
|-------|--------|--------|
| Available | Normal | "⚔️ BATTLE!" -- primary button |
| Locked | Reduced opacity, grayscale | "🔒 Buka di Level X" -- disabled |
| Boss (locked) | Gold border, purple tint | "👑 Buka di Level X" -- disabled |
| Boss (available) | Gold border, glow | "👑 Lawan Boss!" -- gold button |

### Battle Card Animation

```typescript
const cardStagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItem = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};
```

---

## 19. Progress Screen

### Layout Structure

```
  ←           📊 Progress                     Header

  ┌─── RANK CARD ──────────────────────────┐
  │     ┌──────────────────┐               │
  │     │   RANK BADGE    │               │    Rank icon (80px)
  │     │   (Musafir)     │               │
  │     └──────────────────┘               │
  │   Musafir  --  Level 7                 │    Rank name + level
  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  3,450/5K  │    XP bar
  │   🟢███████████████████░░░░            │
  │   1,550 XP menuju rank naik!           │    Next rank progress
  └────────────────────────────────────────┘

  ┌─── QUICK STATS ───────────────────────┐
  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
  │  │ Total │ │ Streak│ │ Hari │ │Rank  │ │    2x2 grid
  │  │ XP    │ │ Tert. │ │Active│ │ #    │ │
  │  │ 2,450 │ │ 12    │ │ 45   │ │ 12   │ │
  │  └──────┘ └──────┘ └──────┘ └──────┘ │
  └────────────────────────────────────────┘

  ┌─── WEEKLY ACTIVITY ───────────────────┐
  │  📊  Aktivitas Minggu Ini              │
  │  S  S  R  K  J  S  M                  │    7-day chart bars
  │  █  █  █  █  ░  █  █                  │
  │  56 72 45 80 0  90 65                  │
  └────────────────────────────────────────┘

  ┌─── BADGE COLLECTION ──────────────────┐
  │  🏅  Lencana (3/12)                  │
  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │    Horizontal scroll
  │  │ 🔥 │ │ 📖 │ │ ⚔️ │ │ 🔒 │ │ 🔒 │ │    5 badges visible
  │  │  7  │ │ 50  │ │  5  │ │    │ │    │ │
  │  └────┘ └────┘ └────┘ └────┘ └────┘ │
  │  Lihat semua to                       │
  └────────────────────────────────────────┘

  ┌─── STATISTICS ────────────────────────┐
  │  📈  Statistik Belajar                │
  │  Total kata dipelajari: 45           │
  │  Total battle: 23 (15 menang)        │
  │  Rata-rata combo: 3.2                │
  │  Akurasi: 78%                        │
  └────────────────────────────────────────┘
```

### Rank Card Detail

```
┌──────────────────────────────────────────┐
│     ┌────────────────────┐               │
│     │      🧭            │               │  Rank badge (80x80px)
│     │   Musafir          │               │  bg-bg-elevated
│     └────────────────────┘               │  rounded-2xl
│  "Musafir"                               │  Heading-1, gold
│  Level 7                                 │  Body, text-text-secondary
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  3,450/5,000 │  XP bar
│  🟢███████████████████░░░░░              │
│  1,550 XP menuju "Penuntut Ilmu"        │  Next rank
└──────────────────────────────────────────┘
```

### Quick Stats Grid

```
┌──────────────┐  ┌──────────────┐
│  2,450       │  │  12          │  2x2 grid
│  Total XP    │  │  Streak Terl │  Gap: 10px
└──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  45          │  │  #12         │
│  Hari Aktif  │  │  Rank Global │
└──────────────┘  └──────────────┘

Stat card: bg-bg-card, rounded-2xl, p-3
Value: 24px, font-bold
Label: 12px, text-text-tertiary
```

### Weekly Activity Chart

```
  S   S   R   K   J   S   M
  █   █   █   █   ░   █   █
 56  72  45  80  0   90  65

Bars: width 32px, max height 80px, radius 4px top
Fill: bg-emerald-500 (with gradient)
Empty day: bg-white/5, height 4px
Today: pulse animation
Missed day: red-500
```

### Badge Collection

```
Horizontal scroll container
Badge card: 88x96px, rounded-2xl, bg-bg-card

States:
  Earned: full color + border based on rarity
  Locked: grayscale, "???" text
  New: pulse glow + "NEW" badge
```

### Statistics Section

```
  📈 Statistika Belajar

  Total kata dipelajari    45              Row: label (L) + value (R)
  Total battle             23              16px label + 16px value
  Menang                    15 (65%)        gap between: auto
  Rata-rata combo          3.2
  Akurasi belajar          78%
  XP per hari (rata-rata)  120

Row: h-10, border-b border-white/5 (last row no border)
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No badges earned | Empty state "Mulai dapatkan badge pertamamu!" |
| First week (no weekly data) | "Belum ada data minggu ini. Mulai belajar!" |
| No rank yet (guest) | "Daftar untuk melihat rank!" |
| All badges earned | "Kamu sudah mendapatkan semua badge! Keren!" |
| Streak = 0 | Show "Mulai streak baru!" instead of streak calendar |

### Implementation Notes

- app/progress/page.tsx -- main tab with bottom nav
- Data: fetch dari Supabase get_profile_stats, get_badges
- Chart: custom SVG bar chart (lightweight, no chart library)
- Badge grid: horizontal scroll, snap-x
- All sections: graceful degradation (skeleton per section)
- Rank card: animated XP bar on mount (count up + bar fill)

---

## 20. Leaderboard Screen

### Layout Structure

```
  ←          🏆 Leaderboard                   Header

  [Minggu Ini]  [Bulan Ini]  [Semua]          Pill tabs

  ┌─── TOP 3 PODIUM ──────────────────────┐
  │         ┌──────┐                       │
  │         │ #1   │                       │  Gold (center, larger)
  │         │ 🥇   │                       │
  │         │Aisyah│                       │
  │         │2,450 │                       │
  │         └──────┘                       │
  │  ┌──────┐       ┌──────┐              │
  │  │ #2   │       │ #3   │              │  Silver (L) & Bronze (R)
  │  │ 🥈   │       │ 🥉   │              │  slightly smaller
  │  │ Budi │       │Citra │              │
  │  │2,100 │       │1,890 │              │
  │  └──────┘       └──────┘              │
  └────────────────────────────────────────┘

  #4  👤  Dimas        1,750 XP    🔥       Ranking rows
  #5  👤  Erika        1,620 XP    🔥
  #6  👤  Fajar        1,510 XP
  ...
  #12 👤  Rizky (Kamu)  890 XP    🔥       Current user highlight
  #13 👤  Hana          850 XP

  ┌─── YOUR RANK STICKY ──────────────────┐
  │  🏆  Peringkatmu: #12                  │  Sticky bottom
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  890 / 1,510       │  to reach #11
  │  ┌────────────────────────────────┐    │
  │  │  🔥  Belajar Lagi!             │    │  CTA
  │  └────────────────────────────────┘    │
  └────────────────────────────────────────┘
```

### Top 3 Podium

```
  ┌──────────────────────────────────────────┐
  │         ┌──────┐                         │
  │         │ #1   │                         │  Elevated (higher y)
  │         │ 👑   │                         │  Gold background glow
  │         │Aisyah│                         │  88x104px
  │         │2,450 │                         │
  │         └──────┘                         │
  │  ┌──────┐       ┌──────┐                │
  │  │ #2   │       │ #3   │                │  Same baseline
  │  │ Budi │       │Citra │                │  80x96px
  │  │2,100 │       │1,890 │                │
  │  └──────┘       └──────┘                │
  └──────────────────────────────────────────┘

Podium card:
  #1: bg-amber-500/10, border-amber-500/30, shadow-glow-gold
  #2: bg-slate-300/10, border-slate-300/30
  #3: bg-orange-500/10, border-orange-500/30
```

### Ranking Row

```
  #4  👤  Dimas        1,750 XP    🔥🔥    h-14

Layout:
  [Rank #] 28px, font-bold
  [Avatar] 28px
  [Name] fill remaining, text-primary
  [XP] right-aligned, text-emerald-400
  [Streak icon] if streak >3

Highlight for current user:
  Background: bg-emerald-500/5
  Border-left: 3px solid emerald-400
  Label: "(Kamu)" after name
```

### Your Rank Sticky Footer

```
Position: Sticky, bottom: 0 (above bottom nav)
Background: bg-bg-card (solid, not transparent)
Padding: 12px 16px
Border-top: border-white/5

Components:
  - "Peringkatmu: #12" (heading)
  - Progress bar to next rank
  - "1,550 XP untuk naik peringkat!"
  - "🔥 Belajar Lagi!" CTA button
```

### Animation

```typescript
// On mount:
leaderboardAnimation = {
  podium: staggerItems(0.2, 0.1),
  rows: staggerItems(0.3, 0.03),
  yourRank: { y: 30, opacity: 0 to 1, delay: 0.4 },
};
```

### State Handling

| State | Visual |
|-------|--------|
| Loading | 10 skeleton rows |
| Empty (no data) | "Belum ada peringkat minggu ini" |
| Error | Error state with retry |
| You're not ranked | "Main battle untuk masuk peringkat!" |
| You're #1 | Crown emoji + "Kamu juara minggu ini!" |
| Weekly reset | Banner: "Peringkat akan di-reset dalam X jam" |

---

## 21. Profile Screen

### Layout Structure

```
  ←              👤 Profil            ⚙️     Header + settings icon

  ┌─── PROFILE CARD ──────────────────────┐
  │        ┌────────────┐                  │
  │        │   👤        │                  │  Avatar (64px)
  │        │   Rizky    │                  │  rounded-full
  │        └────────────┘                  │
  │   Rizky Pratama                        │  Name (20px, bold)
  │   @rizkypratama                        │  Username (14px)
  │   🧭  Musafir  ·  Level 7             │  Rank + level
  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  3,450/5,000 │  XP bar
  │   🟢███████████████████░░              │
  │   📤  Bagikan Progress                 │  Share button (ghost)
  └────────────────────────────────────────┘

  ┌─── STATS GRID ────────────────────────┐
  │  ┌──────┐ ┌──────┐ ┌──────┐          │
  │  │ 2,450│ │ 12   │ │ 45   │          │  3 stats inline
  │  │Total │ │Streak│ │Hari  │          │
  │  │ XP   │ │Terl. │ │Aktif │          │
  │  └──────┘ └──────┘ └──────┘          │
  └────────────────────────────────────────┘

  ┌─── ACHIEVEMENT SHOWCASE ──────────────┐
  │  🏅  Lencana Unggulan                  │
  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │  Badge showcase
  │  │ 🔥 │ │ 📖 │ │ ⚔️ │ │ 🎯 │          │  max 4 visible
  │  └────┘ └────┘ └────┘ └────┘          │
  │  Kelola Lencana to                     │
  └────────────────────────────────────────┘

  ┌─── RECENT ACTIVITY ───────────────────┐
  │  📋  Aktivitas Terbaru                │
  │  📖 Belajar 15 kata -- 2 jam lalu     │  12px rows
  │  ⚔️  Menang Battle -- 5 jam lalu      │
  │  🏆 Naik rank! -- 1 hari lalu         │
  │  🔥 Streak 7 hari -- 2 hari lalu      │
  └────────────────────────────────────────┘

  ┌─── SETTINGS SHORTCUTS ────────────────┐
  │  ⚙️  Pengaturan                    to │  Settings link
  │  👥  Ajak Teman                    to │  Invite link
  │  ❓  Bantuan                       to │  Help link
  │  🚪  Keluar                        to │  Logout (red)
  └────────────────────────────────────────┘
```

### Profile Card Detail

```
Avatar: 64px, rounded-full, border 2px emerald-400
Name: 20px, font-bold, text-text-primary
Username: 14px, text-text-secondary
Rank + Level: inline "🧭 Musafir · Level 7"
XP Bar: same as progress screen, animated fill on mount
```

### Settings Shortcuts

```
  ⚙️  Pengaturan                    to    h-12, flex row
  👥  Ajak Teman                    to
  ❓  Bantuan                       to
  🚪  Keluar                        to    Red text

Each row: h-12, border-b border-white/5
Icon: 20px (L), Label: 16px (fill), Arrow: to (R)
Last row: no border
Logout: text-red-400
```

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No avatar | Show initial letter in circle |
| No badges | Empty badge showcase "Dapatkan badge pertamamu!" |
| No activity | "Belum ada aktivitas. Mulai belajar!" |
| Long username | Truncate with ellipsis (max 20 chars) |
| Profile loading | Full profile card skeleton |

### Implementation Notes

- app/profile/page.tsx -- main tab with bottom nav
- Avatar: gunakan next/image untuk optimasi
- Badge showcase: horizontal scroll (same as progress)
- Share: HTML Canvas rendering atau native Web Share API
- Logout: confirm dialog then auth.logout()
- Settings icon: navigasi ke settings sheet/modal

---

## 22. Settings Screen

Settings dibuka sebagai bottom sheet modal dari Profile screen.

### Layout Structure

```
  ───                                          Sheet handle (4px bar, centered)
───────────────────────────────────────────────
  ⚙️  Pengaturan                              Title

  ┌─── TAMPILAN ──────────────────────────┐
  │  🌙  Tema Gelap                 🟢    │  Toggle row
  │  🔤  Ukuran Font                Normal│  Selector row
  └────────────────────────────────────────┘

  ┌─── AUDIO ─────────────────────────────┐
  │  🔊  Suara Efek                  🟢    │  Toggle row
  │  🎵  Musik Latar                 🔴    │  Toggle row
  │  🔊  Volume                        ░░░  │  Slider
  └────────────────────────────────────────┘

  ┌─── NOTIFIKASI ────────────────────────┐
  │  🔥  Pengingat Streak            🟢    │  Toggle row
  │  📋  Misi Harian                  🟢    │  Toggle row
  │  🏆  Update Peringkat             🔴    │  Toggle row
  │  📤  Aktivitas Teman              🔴    │  Toggle row
  └────────────────────────────────────────┘

  ┌─── BAHASA ────────────────────────────┐
  │  🌐  Bahasa Aplikasi          Indonesia│  Selector row
  │  📖  Bahasa Target               Arab │  Selector row
  └────────────────────────────────────────┘

  ┌─── AKUN ──────────────────────────────┐
  │  👤  Edit Profil                  to  │  Navigation row
  │  🔗  Hubungkan Akun              to  │
  │  🗑️  Hapus Data Belajar          to  │  Red text
  └────────────────────────────────────────┘

  ┌─── PRIVASI ───────────────────────────┐
  │  👁️  Profil Publik               🟢    │  Toggle row
  │  🔒  Tampil di Leaderboard        🟢    │  Toggle row
  └────────────────────────────────────────┘

  Versi 1.0.0                               Bottom, 12px, center
───────────────────────────────────────────────
```

### Toggle Row

```
  🔊  Suara Efek                    🟢    h-12

Layout: [Icon 20px] [Label 16px] [Spacer] [Toggle switch]
Toggle switch: 44x24px, active bg-emerald-500, inactive bg-white/20
Knob: 20px circle, white
Animation: spring, stiffness 300, damping 25
```

### Selector Row

```
  🔤  Ukuran Font                   to    h-12
       Normal                             subtitle

Layout: [Icon 20px] [Label 16px] [Subtitle 12px] [Spacer] [to arrow]
On tap: opens inline picker or bottom sheet with options
```

### Settings Modal Specs

```
Sheet:
  - Max height: 85% of viewport
  - Rounded top: 20px
  - Handle: 4px bar, centered, bg-white/20
  - Background: bg-bg-surface
  - Animation: spring slide up (stiffness 200, damping 25)
  - Dismiss: drag down or tap backdrop

Sections:
  - Gap between sections: 16px
  - Section title: 12px, text-text-tertiary, uppercase
  - Rows: h-12, border-b border-white/5
  - Last row in section: no border
```

### Implementation Notes

- Settings: modal/sheet, not a separate page
- Gunakan uiStore untuk theme, audio, notification preferences
- Toggle: motion.div dengan layout animation
- Slider: input type="range" dengan custom styling
- All preferences persisted via Zustand persist middleware

---

## 23. Reward Modal

### Overview

Reward modal muncul secara otomatis ketika user mencapai milestone:
- XP earned (micro reward)
- Level up (macro reward)
- Badge unlock
- Rank up
- Streak milestone
- Mission completion

### Modal Types

#### XP Reward (Micro)

```
───────────────────────────────────────────────
  ───                                          Handle

  +250 XP 🟢                                   XP amount (32px, bold)

  Dari sesi belajar                            Source (14px)

  Total XP: 2,450 / 5,000                     Current XP
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░                    XP bar animation

  ┌───────────────────────────────────────┐
  │  👆  Lanjut Belajar                   │    CTA
  └───────────────────────────────────────┘

Animation:
  1. Sheet slides up (300ms spring)
  2. XP number counts up from 0 to amount (600ms)
  3. XP bar extends (400ms)
  4. Mascot: happy (200ms)
  Total duration: ~1.5s
───────────────────────────────────────────────
```

#### Level Up (Macro)

```
───────────────────────────────────────────────
  🎉 LEVEL UP! 🎉                              Gold, scale bounce

              Level 8                          Large number

  +500 XP Bonus Level!                         Reward text

  🔓 Fitur baru: Battle Hard                  Unlock text

  ┌───────────────────────────────────────┐
  │  Lanjut Belajar                       │
  └───────────────────────────────────────┘

Animation sequence:
  1. Background: radial golden glow expands (300ms)
  2. "LEVEL UP!" text: scale 0 to 1.2 to 1, spring (500ms)
  3. Level number: count up animation (600ms)
  4. Reward + unlock text: slide up + fade (400ms each, staggered)
  5. Particle effect: golden burst from center (1.5s)
  6. Mascot: EXCITED (jump + sparkle, 600ms)
───────────────────────────────────────────────
```

#### Badge Unlock

```
───────────────────────────────────────────────
  ───

  🏅  Badge Baru!                               Title

  ┌───────────────────────────────────────┐
  │          🔥                            │    Badge icon (64px)
  │                                        │
  │       STRIKER                          │    Badge name
  │       Streak 7 Hari                    │    Badge description
  │                                        │
  │       "Luarr biasa! Streak 7           │    Mascot message
  │        hari! Pertahankan ya!"          │
  └───────────────────────────────────────┘

  ┌───────────────────────────────────────┐
  │  🎉  Keren!                           │    CTA
  └───────────────────────────────────────┘

Animation:
  1. Badge: scale 0 to 1, bounce + glow (500ms)
  2. Name: slide up (200ms)
  3. Description: fade in (200ms)
  4. Badge border: shimmer animation (1s loop, then stop)
───────────────────────────────────────────────
```

#### Rank Up

```
───────────────────────────────────────────────
  🏆 RANK UP! 🏆

  ┌───────────────────────────────────────┐
  │                                        │
  │        🧭  →  📖                       │    Old rank to New rank
  │                                        │
  │     Musafir  →  Penuntut Ilmu          │
  │                                        │
  └───────────────────────────────────────┘

  Bonus: +1,000 XP!                        Rank up bonus

Animation:
  1. Old rank fades out (300ms)
  2. Arrow animation: slide right (300ms)
  3. New rank slides in + glow (500ms)
  4. XP shower: +1,000 XP particles (1s)
  5. Confetti burst
───────────────────────────────────────────────
```

#### Streak Milestone

```
───────────────────────────────────────────────
  ───

  🔥🔥🔥  Streak 7 Hari! 🔥🔥🔥                 Fire animation

  Kamu sudah belajar 7 hari berturut-turut!    Message

  +200 XP Bonus Streak!                        Bonus

  ┌───────────────────────────────────────┐
  │  🔥  Pertahankan!                    │    CTA
  └───────────────────────────────────────┘

Animation:
  1. Fire icons: scale + sway animation (500ms)
  2. Flame: grows with streak number
  3. XP bonus: count up (600ms)
  4. Streak bar: fills to milestone (400ms)
───────────────────────────────────────────────
```

### Confetti / Particle System

```css
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

@keyframes confetti-fall {
  0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
```

### Modal Behavior Rules

| Rule | Implementation |
|------|----------------|
| Auto-trigger | Modal appears immediately when condition met |
| Stacking | Only one modal at a time (queue if multiple) |
| Dismiss | Tap anywhere outside content area or swipe down |
| Auto-dismiss | Micro rewards dismiss after 2s; macro rewards wait for user |
| Background | Backdrop: bg-black/60 backdrop-blur-sm |
| Animation | Spring: stiffness 200, damping 25, mass 0.8 |
| Accessibility | Focus trap inside modal, close on Escape |

---

## 24. Notification Components

### Toast System

#### Toast Types

| Type | Icon | Color | Duration |
|------|------|-------|----------|
| Success | ✅ | Emerald | 3s |
| Error | ❌ | Red | 5s |
| Warning | ⚠️ | Amber | 4s |
| Info | 💡 | Blue | 3s |
| XP | 🟢 +XP | Emerald | 2s |
| Streak | 🔥 | Orange | 3s |

#### Toast Layout

```
───────────────────────────────────────────────
  🔥  Streakmu dalam bahaya!        ✕           Notification (top)
       Satu swipe untuk selamatkan!
───────────────────────────────────────────────

Position: Fixed top (below safe area, z-60)
Width: calc(100% - 32px) (16px margin each side)
Max-width: 430px
Margin: 0 auto
Padding: 12px 16px
Radius: 12px
Background: bg-bg-surface (with backdrop-blur)

Animation in: slide down y(-20 to 0) + fade, 250ms spring
Animation out: slide up y(0 to -20) + fade, 200ms tween
Auto-dismiss: based on type duration (3s default)
Manual dismiss: tap X button

Layout:
  [Icon 20px] [Title 14px bold + Message 13px] [Spacer] [X 16px]
```

#### Toast Stacking

```
Max 2 toasts visible at once
If 3rd arrives, oldest is dismissed
Stack: newest at top, with slight y-offset for previous
```

### Achievement Notification

```
───────────────────────────────────────────────
  🏅  Badge Baru: Striker!                     Achievement toast
      Streak 7 Hari — Luar biasa!
───────────────────────────────────────────────

Same as toast but:
  - Larger icon (24px)
  - Gold border
  - Subtle glow effect
  - Duration: 4s
  - Tap to open badge detail
```

### Streak Reminder

```
───────────────────────────────────────────────
  🔥🔥  Streak: Hari ke-7                       Streak reminder
       Jangan sampai putus! Ayo belajar!
  ┌────────────────────────────────────────┐
  │  👆  Belajar Sekarang                  │    CTA
  └────────────────────────────────────────┘
───────────────────────────────────────────────

Appears when:
  - First app open of the day
  - Evening (20:00+) if no activity
  - Streak in danger (missed yesterday)

Style: Slightly larger toast (h-20), with embedded CTA button
```

### Mission Completion Notification

```
───────────────────────────────────────────────
  📋  Misi Selesai!                            Mission toast
      Belajar 10 kata ✅  +50 XP
      Klik untuk claim reward!
───────────────────────────────────────────────

Appears when mission progress reaches target
Duration: 4s
Tap to open mission detail / claim
```

### Push Notification Types (Planned)

| Type | Trigger | Message |
|------|---------|---------|
| Streak Reminder | No activity by 20:00 | "🔥 Streakmu dalam bahaya! Ayo belajar 1 kata aja!" |
| Daily Mission | New missions available | "📋 Misi baru hari ini! Selesaikan untuk XP bonus!" |
| Streak Lost | Missed a day | "💔 Streak putus... Mulai lagi yuk! 2x XP untuk 3 hari!" |
| Level Up | Reached new level | "🎉 Level up! Kamu sekarang Level X!" |
| Rank Up | Rank promotion | "🏆 Rank up! Selamat naik ke rank X!" |
| Badge Unlock | Badge earned | "🏅 Badge baru! Cek badge kamu!" |
| Friend Activity | Friend progress | "👤 Temanmu Aisyah naik rank!" |
| Boss Unlock | Boss available | "👑 Boss battle terbuka! Lawan Nahwu King!" |
| Daily Summary | End of day | "📊 Hari ini: 45 XP · 3 streak · 2 misi selesai!" |

### Notification Center (Future)

```
───────────────────────────────────────────────
  🔔  Notifikasi                               Header

  ┌─── TODAY ──────────────────────────────┐
  │  📋 Misi: Belajar 10 kata ✅   (1j)    │
  │  🔥 Streak 7 hari!             (3j)    │
  └────────────────────────────────────────┘

  ┌─── YESTERDAY ──────────────────────────┐
  │  🏆 Naik rank!                (1h)     │
  └────────────────────────────────────────┘
───────────────────────────────────────────────

Sectioned by time:
  - Today
  - Yesterday
  - This Week
  - Earlier
```

---

## Final Notes

### Implementation Priority

1. Splash + Onboarding screens (first impression)
2. Auth screens (entry point)
3. Home screen (primary engagement)
4. Swipe Learning screen (core gameplay)
5. Battle Mode screen (secondary gameplay)
6. Progress + Profile screens (retention)
7. Leaderboard + Social (virality)
8. Settings + Notifications (polish)

### State Coverage Checklist

Untuk setiap screen, pastikan:
- [ ] Loading skeleton state
- [ ] Empty state (if applicable)
- [ ] Error state with retry
- [ ] Offline behavior
- [ ] Transition animation (enter/exit)
- [ ] Gesture handling
- [ ] Keyboard handling (if has inputs)
- [ ] Safe area compliance
- [ ] Reduced motion support

### Design Consistency

Semua screen harus:
- Menggunakan spacing 4px base unit (Tailwind)
- Menggunakan color palette dari design-system.md
- Punya touch target >= 44x44px
- Menggunakan Framer Motion spring configs yang konsisten
- Mendukung dark mode (default) dan light mode
- Memiliki skeleton loading sebelum data muncul
- Menggunakan mascot Burhan untuk personality
- Responsif dalam 375px-430px viewport

---

*Document version 1.0 -- Production-ready*
*Last updated: June 2026*
*Harf -- Belajar Bahasa Arab, Serasa Main Game*
