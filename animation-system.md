# Harf Animation System

> Animation is not decoration. Animation is the core gameplay feedback system — it delivers dopamine, simulates tactile response, communicates emotional state, and makes learning feel like playing a premium mobile game.

---

## 1. Animation Philosophy

Harf's motion design follows three axioms:

**1. Every animation serves a purpose.**  
No animation exists purely for visual flair. Every motion communicates state, feedback, or emotion. If an animation doesn't help the user understand something or feel something, it is removed.

**2. Speed is respect.**  
All animations complete within 300ms for utility motions and 800ms for celebratory motions. The app never slows the user down. Mobile users expect instant feedback — animations must feel immediate.

**3. Intensity scales with achievement.**  
A correct swipe gets a subtle green glow. A 10-combo streak triggers gold glow, screen pulse, particle burst, and mascot celebration. Motion intensity is proportional to emotional significance.

---

## 2. Motion Design Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Responsive First** | Every animation responds instantly to touch. Zero delay on interaction feedback. 60fps guaranteed on mid-range devices. |
| 2 | **Tactile Simulation** | Motion mimics physical objects — spring physics for cards, momentum for swipes, elastic bounce for popups. Digital objects feel real. |
| 3 | **Emotional Mapping** | Motion quality maps to emotional state: snappy and bright for success, gentle and warm for encouragement, dramatic for achievements. |
| 4 | **Progressive Intensity** | Animation intensity escalates with game significance. A simple correct answer gets a micro-bounce. A boss defeat gets full screen celebration. |
| 5 | **Low Cognitive Load** | Motions never require user attention. They happen peripherally, reinforcing feedback without demanding focus. |
| 6 | **Performance Budget** | Every animation is GPU-accelerated (transform + opacity only). No layout-triggering properties animated. Target: 60fps on iPhone X / mid-range Android. |

---

## 3. Emotional Design Goals

| Emotion | Trigger | Motion Response | Timing |
|---------|---------|-----------------|--------|
| **Achievement** | Correct answer | Green glow + scale bounce + XP float | 400ms |
| **Excitement** | 5+ combo | Gold pulse + emoji shake + screen glow | 500ms |
| **Euphoria** | 10+ combo | Fire aura + burst particles + mascot celebration | 800ms |
| **Triumph** | Battle victory | Full confetti + screen shake + enemy defeat | 1200ms |
| **Encouragement** | Wrong answer | Gentle red fade + mascot sad + "semangat" text | 300ms |
| **Anticipation** | Card appear | Spring slide-up + scale entrance | 350ms |
| **Urgency** | Low HP | Red glow pulse + HP bar shake | 200ms loop |
| **Satisfaction** | Progress fill | Smooth bar interpolation + sparkle | 400ms |
| **Surprise** | Special attack | Gold burst + screen flash + enemy stun | 600ms |
| **Pride** | Level up | Full screen celebration + rank reveal | 1500ms |

---

## 4. Motion Language System

Harf uses a consistent motion vocabulary across all interactions. Every motion belongs to one of four "languages":

### 4.1 Utility Language
Fast, minimal motions for functional feedback.  
Timing: 100–200ms. Easing: easeOut.  
Used for: button press, toggle, navigation tap, progress fill.

### 4.2 Feedback Language
Visible but non-distracting motions for interaction confirmation.  
Timing: 200–400ms. Physics: spring snappy.  
Used for: correct/wrong answer, card snapback, toast, modal open.

### 4.3 Celebration Language
Expressive, layered motions for achievements and milestones.  
Timing: 400–1500ms. Physics: spring bouncy.  
Used for: combo display, XP burst, level up, battle victory.

### 4.4 Ambient Language
Subtle, looping motions for idle states and background life.  
Timing: 2–4s loops. Easing: easeInOut.  
Used for: mascot idle float, background particle drift, shimmer skeletons.

---

## 5. Animation Hierarchy

Motions are classified by rendering priority. Higher priority animations preempt lower ones.

```
Priority 0: Interaction Feedback (instant)
  - button press, tap ripple, drag response
  - Must render within 1 frame (16ms) of input

Priority 1: Game State Feedback (100-200ms)
  - correct/wrong flash, HP change, damage number
  - Must not exceed 200ms

Priority 2: UI Transitions (200-400ms)
  - page enter/exit, modal open/close, card stack
  - Acceptable up to 400ms

Priority 3: Celebration Effects (400-1500ms)
  - confetti, particle burst, XP shower, level up
  - Can be interrupted by P0/P1 motions

Priority 4: Ambient Effects (continuous)
  - mascot idle, background particles, glow pulse
  - Lowest priority, skipped if frame budget exceeded
```

---

## 6. Motion Timing Rules

### 6.1 Duration Tokens

```typescript
export const TIMING = {
  // Utility - must feel instant
  buttonPress:    100,  // ms
  buttonRelease:  150,
  tapFeedback:    100,
  
  // Feedback - must feel responsive
  cardSwipeOut:   400,
  cardEnter:      350,
  correctFlash:   200,
  wrongFlash:     200,
  hpChange:       250,
  damageNumber:   700,
  
  // Transitions - must feel smooth
  pageEnter:      250,
  pageExit:       200,
  modalEnter:     300,
  modalExit:      150,
  toastEnter:     250,
  toastExit:      200,
  
  // Celebrations - must feel satisfying
  xpFloat:        800,
  xpBurst:        600,
  comboUpdate:    300,
  comboPulse:     400,
  battleHit:      200,
  confetti:       1500,
  levelUp:        1500,
  skillEffect:    800,
  
  // Ambient
  mascotIdle:     3000, // loop
  glowPulse:      2000, // loop
  skeletonPulse:  1500, // loop
  particleDrift:  4000, // loop
} as const;
```

### 6.2 Stagger Delays

```typescript
export const STAGGER = {
  cardList:      0.05,  // cards in a list
  badgeGrid:     0.05,  // achievement badges
  leaderboard:   0.03,  // leaderboard rows
  missionList:   0.08,  // daily missions
  particleBurst: 0.02,  // confetti particles
  answerOptions: 0.05,  // battle answer buttons
  menuItems:     0.04,  // settings rows
} as const;
```

---

## 7. Spring Physics Rules

Springs are used for interactive, tactile motions. Tween is used for UI transitions.

### 7.1 Spring Presets

```typescript
// File: src/animations/presets.ts
export const springPresets = {
  // Snappy: buttons, toggles, micro-interactions
  // Feels: instant, precise, premium
  // Use: press feedback, tap, small UI elements
  snappy: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
  
  // Bouncy: popups, combo display, rewards
  // Feels: playful, celebratory, exciting
  // Use: modal content, badge reveal, star pop
  bouncy: { type: 'spring', stiffness: 200, damping: 15, mass: 0.5 },
  
  // Gentle: cards, panels, section entrances
  // Feels: smooth, natural, polished
  // Use: section slides, card appearance, list items
  gentle: { type: 'spring', stiffness: 150, damping: 20, mass: 1 },
  
  // Smooth: page transitions, large elements
  // Feels: premium, fluid, native
  // Use: page enter/exit, modal backdrop, large panels
  smooth: { type: 'spring', stiffness: 100, damping: 20, mass: 1 },
  
  // Wobbly: special effects, exaggerated motions
  // Feels: playful, bouncy, game-like
  // Use: special attack, character reactions, celebration
  wobbly: { type: 'spring', stiffness: 80, damping: 10, mass: 1 },
} as const;
```

### 7.2 Spring Selection Guide

| Interaction | Spring | Why |
|-------------|--------|-----|
| Button press | snappy | Must feel instant, zero delay |
| Card swipe | smooth | Must follow finger exactly |
| Card snapback | gentle | Natural deceleration |
| Modal appear | bouncy | Joyful entrance |
| Stack card | smooth | Subtle depth shift |
| Combo pop | bouncy | Celebratory emphasis |
| XP float | tween | One-way, no overshoot |
| Damage number | tween | Quick fade, no bounce |
| Mascot idle | tween | Smooth loop, no physics |
| Toast | snappy | Quick in, stay, quick out |

### 7.3 Physics Anti-Patterns

- **Never use springs for position loops.** Springs with `repeat: Infinity` accumulate energy and jitter. Use tweens for looping motions.
- **Never set `mass` above 2.** Heavy springs feel sluggish and unresponsive on mobile.
- **Never use damping below 8.** Under-damped springs oscillate visibly and feel broken.
- **Never mix spring and tween in the same AnimatePresence.** Variants should use consistent transition types within a single presence context.

---

## 8. Easing System

Tweens are used for non-interactive transitions: page entrances, floating text, particles, progress bars.

### 8.1 Tween Presets

```typescript
export const tweenPresets = {
  // Fast: quick fades, micro transitions
  fast:     { duration: 0.15, ease: 'easeOut' },
  
  // Normal: standard UI transitions
  normal:   { duration: 0.25, ease: 'easeOut' },
  
  // Slow: deliberate reveals, emphasis
  slow:     { duration: 0.40, ease: 'easeOut' },
  
  // Expressive: celebratory, dramatic effects
  // Custom cubic-bezier: overshoot then settle
  expressive: { duration: 0.60, ease: [0.34, 1.56, 0.64, 1] },
} as const;
```

### 8.2 Easing Curves

| Use Case | Curve | Behavior |
|----------|-------|----------|
| Button feedback | `easeOut` | Fast start, gentle stop |
| Page enter | `easeOut` | Slide in, decelerate |
| Page exit | `easeIn` | Accelerate out |
| Floating text | `easeOut` | Float up, fade gently |
| Particles | `easeOut` | Burst outward, decelerate |
| Progress bar | `easeOut` | Smooth fill, no overshoot |
| Confetti | `easeOut` | Explode, gravity deceleration |
| Mascot idle | `easeInOut` | Smooth float oscillation |
| Modal overlay | `easeOut` | Quick opacity fade |
| Stagger items | `easeOut` | Sequential reveal |

---

## 9. Animation Performance Principles

### 9.1 GPU-Accelerated Properties Only

**Only animate these properties:**
- `transform` (translate, scale, rotate)
- `opacity`

**Never animate these properties:**
- `width`, `height` — triggers layout recalculation
- `top`, `left`, `right`, `bottom` — triggers layout
- `margin`, `padding` — triggers layout
- `box-shadow` — expensive to repaint
- `border-radius` — expensive to repaint
- `filter` — GPU-assisted but slower than transform

**Exception:** Glow effects use `box-shadow` via CSS classes, not animated properties. The class is toggled, not the property animated.

### 9.2 Layout Thrashing Prevention

```typescript
// GOOD: transform-based animation
<motion.div
  animate={{ x: 100 }}
  // x uses transform: translateX() — no layout trigger
/>

// BAD: layout-triggering animation
<motion.div
  animate={{ left: 100 }}
  // left triggers layout recalculation every frame
/>
```

### 9.3 Batch DOM Reads

When reading layout properties (for calculations before animation), batch all reads together and all writes together to prevent layout thrashing:

```typescript
// GOOD: batch reads, then writes
const rect = element.getBoundingClientRect();  // read
const parentRect = parent.getBoundingClientRect();  // read
requestAnimationFrame(() => {
  element.style.transform = `translateX(${x}px)`;  // write
});

// BAD: interleaved reads and writes
element.style.transform = `translateX(${value}px)`;  // write
const rect = element.getBoundingClientRect();  // read (forced layout)
```

### 9.4 Performance Budget

| Metric | Target | Enforcement |
|--------|--------|-------------|
| Frame rate | 60fps (16ms per frame) | DevTools FPS meter |
| JS frame budget | < 8ms | Performance profiler |
| Particle count | ≤ 30 per burst | Code review |
| Active animations | ≤ 8 simultaneous | Monitoring |
| Memory (animations) | < 5MB heap | Chrome memory tab |
| Initial mount time | < 100ms for animations | Lighthouse |

---

## 10. Mobile Motion Principles

### 10.1 Touch Latency

The perceived latency for touch feedback must be zero. This means:

- Button press feedback renders on `onPointerDown`, not `onClick`
- Drag gestures respond immediately via `useMotionValue` (not state)
- Visual feedback precedes any logic — show the hit, then process the action

```typescript
// GOOD: instant visual feedback on touch
<motion.button
  whileTap={{ scale: 0.95 }}  // Renders on pointer down
  onClick={handleSubmit}       // Logic happens after
/>
```

### 10.2 Low-End Device Strategy

Devices with ≤2GB RAM or ≤4 CPU cores should receive reduced animations:

```typescript
// File: src/animations/helpers.ts
export function getAnimationQuality(): 'low' | 'mid' | 'high' {
  if (typeof window === 'undefined') return 'high';
  const mem = (navigator as any).deviceMemory;
  if (mem && mem <= 2) return 'low';
  const cores = navigator.hardwareConcurrency;
  if (cores && cores <= 4) return 'mid';
  return 'high';
}

export function shouldReduceParticles(quality: AnimationQuality): number {
  switch (quality) {
    case 'low': return 0;   // No particles
    case 'mid': return 5;   // Minimal particles
    case 'high': return 20; // Full effect
  }
}
```

### 10.3 Battery Efficiency

- Animations pause when tab is hidden (`document.hidden` check via `visibilitychange`)
- Looping animations use `requestAnimationFrame`-based scheduling (not `setInterval`)
- Heavy particle effects limit to 30 particles max
- Complex animations skip on `prefers-reduced-motion` or low battery

---

## 11. Gesture Animation System

### 11.1 Drag Gesture Rules

- Use `useMotionValue` + `useTransform` for drag — never React state for drag position
- Spring physics on drag release (snapback) via `dragSnapToOrigin` or manual spring
- `dragElasticity: 0.9` for cards — feels bouncy but not floaty
- `dragConstraints` should match parent container bounds
- Rotation follows drag: `rotate = x * 0.05` (15° max at 300px offset)

### 11.2 Swipe Threshold Logic

```typescript
const SWIPE_THRESHOLD_RATIO = 0.3;  // 30% of card width
const SWIPE_VELOCITY_THRESHOLD = 500;  // pixels/second

// In VocabCard:
const handleDragEnd = (_: any, info: PanInfo) => {
  const xOffset = info.offset.x;
  const xVelocity = info.velocity.x;
  const threshold = SWIPE_THRESHOLD_RATIO * containerWidth;

  if (xOffset > threshold || xVelocity > SWIPE_VELOCITY_THRESHOLD) {
    swipeCorrect(word.id);  // swipe right = known
  } else if (xOffset < -threshold || xVelocity < -SWIPE_VELOCITY_THRESHOLD) {
    swipeIncorrect(word.id);  // swipe left = unknown
  }
  // else: snap back to center (spring physics handles this)
};
```

### 11.3 Gesture Feedback During Drag

```typescript
// Motion values track drag in real-time
const x = useMotionValue(0);

// Derived values update every frame without re-render
const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
const opacity = useTransform(x, [-300, 0, 300], [0.5, 1, 0.5]);
const correctGlow = useTransform(x, [0, 200, 300], [0, 0, 1]);
const wrongGlow = useTransform(x, [-300, -200, 0], [1, 0, 0]);

// "BENAR" and "SALAH" labels fade in as thresholds approach
// Green/red glow intensifies with drag distance
// Card scale slightly compresses at extremes (0.95)
```

### 11.4 Gesture Anti-Patterns

- **Never use state for drag position.** State updates trigger re-render, causing frame drops during drag.
- **Never `onDrag` with setState.** Use `onDragEnd` for state changes, `motionValue.on('change')` for side effects.
- **Never block `drag` with async operations.** Gesture response must be synchronous.
- **Never set `dragElasticity` above 1.** The card flies off-screen before user releases.

---

## 12. Page Transition System

### 12.1 Transition Configuration

```typescript
// File: src/animations/transitions.ts
export const pageTransitionConfig = {
  type: 'tween',
  duration: 0.25,
  ease: 'easeOut',
};
```

### 12.2 Page Variants

```typescript
// File: src/animations/variants.ts
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};
```

### 12.3 ScreenContainer Usage

Every page wraps content in `ScreenContainer` which applies page transitions:

```typescript
// File: src/components/shared/ScreenContainer.tsx
export function ScreenContainer({ children, className }: ScreenContainerProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={tweenPresets.normal}
      className={cn('pt-2', className)}
    >
      {children}
    </motion.div>
  );
}
```

### 12.4 AppShell Wrap

The `AppShell` wraps `AnimatePresence mode="wait"` around children so exit animations complete before new page enters:

```typescript
<AnimatePresence mode="wait">
  {children}
</AnimatePresence>
```

### 12.5 Page Transition Rules

| Rule | Detail |
|------|--------|
| Direction | Content slides up 10px on enter, -10px on exit. Creates subtle forward momentum. |
| Opacity | Crossfade between pages. Prevents jarring cuts. |
| Duration | 250ms — fast enough to feel instant, slow enough to feel smooth. |
| Stagger | Sections within a page use staggered delays (0.05–0.08s) for sequential reveal. |
| Swipe screen | Uses standalone layout — no page transition wrapper. Full-screen game mode needs different treatment. |

### 12.6 Staggered Section Entrance

Home page sections use staggered delays to create a cascading entrance:

```
Section 0: HomeHeader       — delay: 0.00s
Section 1: HeroProgressCard — delay: 0.05s
Section 2: MascotWidget     — delay: 0.10s (approximate)
Section 3: DailyMissions    — delay: 0.10s + i*0.06s
Section 4: ContinueLearning — delay: 0.25s
Section 5: WordOfTheDay     — delay: 0.30s
Section 6: MiniLeaderboard  — delay: 0.35s
Section 7: AchievementPreview — delay: 0.40s (approximate)
```

Each section uses `springPresets.gentle` with increasing delay. Total cascade: ~400ms.

---

## 13. Shared Motion Presets

### 13.1 Variant Library

```typescript
// File: src/animations/variants.ts

// Universal fade — any element
fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }

// Content sliding up — sections, cards, list items
slideUp: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }

// Content sliding down — dropdowns, expandable panels
slideDown: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } }

// Content sliding in from right — modals, drawers
slideInRight: { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 } }

// Scale entrance — badges, popups, emphasis elements
scaleIn: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 } }

// Swipe card states
swipeCard: { center: { opacity: 1, scale: 1, rotate: 0 }, left: { opacity: 0.5, x: -300, rotate: -15 }, right: { opacity: 0.5, x: 300, rotate: 15 } }

// XP floating text
xpFloat: { initial: { opacity: 1, y: 0, scale: 1 }, animate: { opacity: 0, y: -40, scale: 1.3 } }

// Combo pulse animation
comboPulse: { idle: { scale: 1 }, increase: { scale: [1, 1.3, 1] } }

// Modal backdrop (semi-transparent overlay)
modalBackdrop: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }

// Modal content panel
modalContent: { hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.9, y: 20 } }

// Toast notification
toastEnter: { hidden: { opacity: 0, y: 50, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -20, scale: 0.95 } }

// Button press feedback
buttonPress: { whileTap: { scale: 0.95 }, whileHover: { scale: 1.02 } }

// Mascot gentle float
mascotIdle: { animate: { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } } }
```

### 13.2 AnimatedWrappers

Reusable wrapper components for common animation patterns:

```typescript
// These provide a clean API for consistent entrance animations:
<FadeIn delay={0.1}>...</FadeIn>
<SlideUp delay={0.15}>...</SlideUp>
<SlideDown delay={0.2}>...</SlideDown>
<ScaleIn delay={0.05}>...</ScaleIn>
```

Each wrapper accepts `children`, `delay`, and `className`. They apply the corresponding variant with `tweenPresets.normal`.

---

## 14. Microinteraction System

### 14.1 Button Feedback

| Button Type | Press Effect | Timing | Notes |
|-------------|-------------|--------|-------|
| Primary (emerald) | Scale 0.95 | 100ms | Shadow reduces with scale |
| Secondary (ghost) | Scale 0.95 + bg lighten | 100ms | Border stays |
| Icon | Scale 0.90 | 80ms | Tight, precise |
| Navigation tab | Scale 0.95 + indicator slide | 100ms | layoutId animated |
| CTA (large) | Scale 0.97 | 120ms | Slightly slower for perceived weight |

Implementation pattern:

```typescript
<motion.button
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}
/>
```

### 14.2 Card Interaction

| Interaction | Effect | Timing |
|-------------|--------|--------|
| Tap | Scale 0.97 quick bounce | 100ms |
| Press (hold) | Scale 0.97 + shadow deepen | 200ms |
| Hover (desktop) | Scale 1.01 + border highlight | 150ms |

### 14.3 Progress Bar Interpolation

- Use `animate={{ width: X% }}` with `transition={{ duration: 0.4, ease: 'easeOut' }}`
- Progress fills left-to-right with smooth deceleration
- At completion (100%), subtle green glow pulse on the bar
- On XP progress, counter also animates (see Section 32)

### 14.4 Navigation Feedback

- Bottom nav tab indicator uses `layoutId="nav-indicator"` for shared layout animation
- Active tab icon and label color shift to `text-emerald-400`
- Tab press: scale 0.95 with snappy spring
- Page transition: 250ms fade + slide

### 14.5 Toggle Motion

- Switch track: background color transition 200ms easeOut
- Switch knob: spring snappy (stiffness: 300, damping: 25)
- Checkbox: scale 0 → 1 spring bouncy on checkmark

---

## 15. Feedback Animation System

### 15.1 Correct Answer Feedback

```
Sequence (total 400ms):
  0ms:    Green glow appears on card (opacity 0→1, 100ms)
  80ms:   Card scales 1→1.02→1 (spring bouncy, 200ms)
  100ms:  XP burst particles emit (8 particles, 600ms)
  120ms:  Floating "+XP" text appears (800ms float up + fade)
  150ms:  Combo counter updates (if applicable)
  200ms:  "BENAR!" label slides in (spring bouncy)
  400ms:  Card exits (direction of swipe, 300ms)
  600ms:  Next card enters (spring gentle, 350ms)
```

### 15.2 Wrong Answer Feedback

```
Sequence (total 300ms):
  0ms:    Red glow appears on card (opacity 0→1, 100ms)
  80ms:   Card shakes (x: [0, -5, 5, -5, 0], 300ms)
  100ms:  Combo resets to 0 (counter resize animation)
  150ms:  "SALAH" label slides in (red, spring snappy)
  400ms:  Card exits (direction of swipe)
  600ms:  Next card enters
```

### 15.3 Answer State Transitions

| State | Visual | Duration |
|-------|--------|----------|
| `none` | Default card appearance | — |
| `correct` | Green glow + particles + XP float | 400ms |
| `incorrect` | Red glow + shake + combo break | 300ms |

---

## 16. Reward Animation System

### 16.1 Session Summary

Triggered when swipe session completes (10 cards done):

```
0ms:    Backdrop fades in (opacity 0→1, 200ms)
100ms:  Modal slides up (spring gentle, y: 100→0)
200ms:  Checkmark icon pops in (scale 0→1, spring bouncy)
300ms:  "Sesi Selesai!" text fades up
350ms:  Confetti explodes (20 particles, 1.5s)
400ms:  Stat cards stagger in (4 cards, each 50ms apart, spring gentle)
550ms:  Combo card slides in
600ms:  Action buttons appear (staggered)
```

### 16.2 Battle Victory

```
0ms:    Backdrop fade (200ms)
100ms:  Modal slide up (spring gentle)
200ms:  Enemy emoji in circle pops (spring bouncy)
300ms:  "VICTORY!" text (scale 0→1, spring bouncy)
350ms:  Confetti (25 particles, 1.5-2.5s)
400ms:  Stat grid staggers in (4 cards)
550ms:  Result dots + accuracy
600ms:  Buttons appear
```

### 16.3 Battle Defeat

Same structure as Victory, but:
- Red/dark color scheme
- "DEFEAT" text instead
- Minimal confetti (0-5 particles, or none on low-end)
- Encouraging text
- "Coba Lagi" primary button instead

### 16.4 Reward Modal (Battle Mid-Flow)

```
0ms:    Backdrop fade (200ms)
100ms:  Modal slide up (spring gentle)
200ms:  Enemy emoji circle + "Kemenangan!" / "Bertahan!" text
300ms:  Confetti (15 particles)
350ms:  Divider line
400ms:  Stat grid (3 columns: XP, Accuracy, Combo)
500ms:  "Lanjut" button
```

### 16.5 Confetti Particle Definition

```typescript
function ConfettiParticle({ index }: { index: number }) {
  const colors = ['bg-emerald-400', 'bg-gold-400', 'bg-gold-300', 'bg-emerald-300', 'bg-white/60'];
  const color = colors[index % colors.length];
  const x = (Math.random() - 0.5) * 200;    // ±100px horizontal spread
  const y = -(50 + Math.random() * 150);     // 50-200px upward
  const rotation = Math.random() * 360;       // random spin
  const delay = Math.random() * 0.3;          // staggered start

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x, y,
        rotate: rotation,
        scale: [0, 1, 0.5, 0],
      }}
      transition={{
        duration: 1.5 + Math.random() * 1,    // 1.5-2.5s
        delay,
        ease: 'easeOut',
      }}
      className={cn('absolute w-2 h-2 rounded-sm', color)}
    />
  );
}
```

Implementation notes:
- Particles use `position: absolute` inside a `overflow-hidden` container
- Max 30 particles per burst
- On low-end devices, particle count drops to 0 (confetti is purely cosmetic)
- Color array cycles: emerald, gold, white — matches brand palette
- Randomization happens at mount time via `Math.random()` (deterministic within component lifecycle)

---

## 17. Combo Animation System

### 17.1 Combo Tiers

| Combo | Tier | Visual Effect | Color | Emoji |
|-------|------|---------------|-------|-------|
| 2-4 | Bronze | Subtle pulse + text scale | Emerald | 💥 |
| 5-7 | Silver | Gold glow + emoji shake | Gold | ⚡ |
| 8-9 | Gold | Strong glow + aura | Gold | ⚡ |
| 10+ | Legendary | Fire aura + intense glow + screen flash | Gold | 🔥 |

### 17.2 Combo Meter Animation

```typescript
export function ComboDisplay() {
  const combo = useSwipeStore((s) => s.combo);
  if (combo < 2) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={combo}           // Key changes on every combo update → re-triggers animation
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={springPresets.bouncy}
        className={cn(
          combo >= 10 && 'bg-gold-400/15 border-gold-400/30 shadow-glow-combo',
          combo >= 5  && 'bg-gold-400/10 border-gold-400/20 shadow-glow-gold',
          combo < 5   && 'bg-emerald-500/10 border-emerald-500/20 shadow-glow-emerald',
        )}
      >
        <motion.span
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {combo >= 10 ? '🔥' : combo >= 5 ? '⚡' : '💥'}
        </motion.span>
        <span className={cn('text-label font-extrabold', combo >= 5 ? 'text-gold-400' : 'text-emerald-400')}>
          x{combo} Combo
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
```

### 17.3 Combo Behavior Rules

- Combo updates trigger `AnimatePresence mode="wait"` exit/enter animation
- At 5+ combo, background glow intensifies via CSS class switch
- At 10+ combo, the glow reaches maximum intensity with fire emoji
- Emoji shake animation only plays on the icon, not the text — keeps text readable
- Combo display sits above the card stack, centered, with `pointer-events: none`
- Combo badge in HUD also reflects tier:
  - 3+: subtle emerald tint
  - 5+: gold tint
  - 10+: fire emoji + gold border glow

### 17.4 Battle Combo

Battle combo uses same tier system but positioned differently (above characters in arena):

```
2-4:   💥 x2  (emerald)
5-7:   ⚡ x5   (gold, shadow glow)
8+:    🔥 x8   (gold, max glow — triggers special attack)
```

At combo 8+ in battle, `showSkillEffect` triggers:
- Gold circle burst animation
- "SERANGAN SPESIAL!" text
- Extra damage bonus applied

---

## 18. XP Burst System

### 18.1 Particle Burst

When a correct answer is registered, 8 particles emit radially from the center of the card:

```typescript
function Particle({ index }: { index: number }) {
  const angle = (index / 8) * Math.PI * 2;      // Even distribution around circle
  const distance = 40 + Math.random() * 40;       // 40-80px travel distance
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: 0,
        scale: 0,
        x,
        y,
      }}
      transition={{ duration: 0.6 + Math.random() * 0.3, ease: 'easeOut' }}
      className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
    />
  );
}
```

### 18.2 Floating XP Text

A floating "+XP" number rises above the burst:

```typescript
<motion.div
  key={lastXpGain}                            // Key changes on each gain → re-mounts
  initial={{ opacity: 1, y: 0, scale: 0.5 }}
  animate={{ opacity: 0, y: -60, scale: 1.5 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="absolute -top-4 -left-6 text-xp-value font-extrabold text-emerald-400"
>
  +{lastXpGain}
</motion.div>
```

### 18.3 XP Burst Layering

```
Layer 1 (z-index 30): SwipeFeedbackLayer — "BENAR!" / "SALAH" overlay
Layer 2 (z-index 40): XpBurst — particles + floating XP  
Layer 3 (z-index 50): VocabCard glow overlay — green/red inner glow

All layers: pointer-events-none — don't block interaction
```

### 18.4 XP Burst Timing

```
0ms:    Answer registered (correct)
50ms:   "BENAR!" text appears (SwipeFeedbackLayer)
80ms:   XP burst particles emit (8 particles, 600ms)
100ms:  Floating "+XP" text rises (800ms)
200ms:  Combo counter updates
600ms:  Card exits (nextCard timeout)
```

### 18.5 XP Burst Variants

| Variant | Particles | XP Text | When |
|---------|-----------|---------|------|
| Correct (1x) | 8 | +10 XP | Individual correct swipe |
| Correct (combo 2-4) | 8 | +15 XP | With combo bonus |
| Correct (combo 5-9) | 12 | +20 XP | With 2x combo bonus |
| Correct (combo 10+) | 16 | +25 XP | With 3x combo bonus |
| Incorrect | 0 | +2 XP | Small, no particles |

---

## 19. Swipe Animation System

### 19.1 Cards as Physical Objects

VocabCard is designed as a physical card with mass, friction, and elasticity:

**Spring Physics:**
```typescript
// Card movement follows user's finger exactly
drag="x"
dragConstraints={{ left: 0, right: 0 }}    // No vertical drag
dragElasticity={0.9}                         // Bouncy limit
transition={springPresets.smooth}            // Follows finger with momentum
```

**Rotation follows drag:**
```typescript
const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
// At -300px (swipe left): rotated -15° (tilting away)
// At 0px (center): perfectly straight
// At +300px (swipe right): rotated +15° (tilting toward)
```

**Opacity decreases at edges:**
```typescript
const opacity = useTransform(
  x,
  [-300, -SWIPE_THRESHOLD * 300, 0, SWIPE_THRESHOLD * 300, 300],
  [0.5, 1, 1, 1, 0.5],
);
```

**Scale compresses at edges:**
```typescript
const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);
```

### 19.2 Threshold Visualization

```
Swipe Left (unknown)           Center (neutral)          Swipe Right (known)
     │                              │                          │
     │   ❌ SALAH                   │                          │  ✅ BENAR
     │                              │                          │
     │                              │                          │
-300 ──── -90 ──────── 0 ──────── +90 ──── +300
     │  threshold                   │            threshold    │
     │  (exit)                      │            (exit)       │
     │                              │                          │
     opacity: 0.5                   opacity: 1               opacity: 0.5
     rotate: -15°                   rotate: 0°               rotate: +15°
     glow: red                      glow: none               glow: green
```

### 19.3 Snapback Motion

When drag ends within threshold (not enough to trigger action):

```
1. Framer Motion detects drag end
2. Spring physics takes over (dragSnapToOrigin not used — manual transform)
3. x motion value springs back to 0
4. rotate, opacity, scale all spring back to defaults
5. Card "snaps" into center position with smooth deceleration
```

### 19.4 Card Exit Animation

When swipe threshold is crossed:

```typescript
exit={{
  x: x.get() > 0 ? SWIPE_EXIT_X : -SWIPE_EXIT_X,  // Continue direction
  opacity: 0,
  rotate: x.get() > 0 ? ROTATE_FACTOR : -ROTATE_FACTOR,
  transition: { duration: 0.25, ease: 'easeOut' },
}}
```

Direction is preserved: swipe right → exit right, swipe left → exit left.

### 19.5 Card Stack Transitions

```
Stack depth: 3 cards visible at any time
Offset per layer: scale 0.97, y +6px

Current:  Card A (top, draggable)     — scale: 1.0, y: 0
Card 1:   Card B (behind)             — scale: 0.97, y: 6px
Card 2:   Card C (further behind)     — scale: 0.94, y: 12px

When Card A exits:
  Card B moves to top (y: 6→0, scale: 0.97→1.0)
  Card C moves to position 1 (y: 12→6, scale: 0.94→0.97)
  New Card D enters at position 2 (scale: 0.94, y: 12)
```

Stack cards are static (non-animated) positioned elements. The depth effect comes from CSS `scale` and `y` translation. No AnimatePresence on stack cards — they're always rendered.

### 19.6 Swipe Anti-Patterns

- **Never animate card stack with layout animations.** Stack cards are statically positioned. Animating their positions on every swipe is expensive.
- **Never use `dragSnapToOrigin`.** It conflicts with `onDragEnd` threshold logic. Instead, let spring physics handle snapback via motion values.
- **Never set `dragConstraints` to exact pixel values.** Use container ref for dynamic sizing.
- **Never animate `left` or `marginLeft` for swipe.** Use `transform: translateX()` via the `x` motion value.

---

## 20. Battle Animation System

### 20.1 Phase Transitions

```
select ──(startBattle)──→ intro ──(1500ms)──→ active ──(victory)──→ victory
                                                  │                    │
                                                  └──(defeat)───→ defeat
```

| Phase | Animation | Duration |
|-------|-----------|----------|
| `select` | Enemy cards stagger in (spring gentle, staggered) | 300ms |
| `select→intro` | Selected enemy card expands to arena | — |
| `intro` | Arena fade in, characters enter | 1500ms |
| `active` | Questions slide in, answers stagger | 350ms |
| `active→victory` | Enemy HP hits 0, defeat animation | 700ms |
| `active→defeat` | Player HP hits 0, player stagger | 1000ms |

### 20.2 Arena Background

Gradient background with floating particles:

```typescript
// 12 floating emerald particles with slow drift
// Each particle: random position, random size, random drift speed
// Uses CSS animation + opacity, not Framer Motion (performance)
// Particles are positioned absolutely, drift via translate3d 4s loop
```

### 20.3 Enemy Select Card

```typescript
<motion.button
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ ...springPresets.gentle, delay: 0.05 * index }}
  whileTap={{ scale: 0.97 }}
/>
```

Each enemy card staggers in by 50ms based on its index (0, 1, 2, 3).

---

## 21. Damage Animation System

### 21.1 Damage Numbers

When user answers correctly, damage number floats up from the enemy:

```typescript
function FloatingDamage({ damage, isEnemy, index }) {
  const offsetX = (Math.random() - 0.5) * 40;  // ±20px horizontal
  const offsetY = -(40 + Math.random() * 30);    // 40-70px upward

  return (
    <motion.div
      initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, x: offsetX, y: offsetY, scale: 1.3 }}
      transition={{ duration: 0.7 + Math.random() * 0.3, ease: 'easeOut' }}
      className="absolute text-xl font-extrabold text-emerald-400"
    >
      -{damage}
    </motion.div>
  );
}
```

On correct answer: 3 damage numbers appear (main + 2 smaller sub-numbers for visual impact).
On wrong answer: 1 damage number on player side (red, smaller).

### 21.2 HP Bar Animation

```typescript
// Smooth fill with spring interpolation
<motion.div
  animate={{ width: `${hpPercentage}%` }}
  transition={{ duration: 0.25, ease: 'easeOut' }}
/>

// Flash on hit: quick red overlay
<motion.div
  animate={isFlashing ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
  transition={{ duration: 0.3 }}
/>
```

### 21.3 Screen Shake

On hit (both player and enemy):

```typescript
// Applied to the character area
<motion.div
  animate={isHit ? { x: [0, -4, 4, -2, 2, 0] } : { x: 0 }}
  transition={{ duration: 0.2 }}
/>
```

### 21.4 Enemy Defeat

```
0ms:    HP bar drops to 0 (200ms)
100ms:  Enemy sprite shakes violently (x: [0, -8, 8, -8, 8, 0], 300ms)
200ms:  Enemy sprite fades + grayscale (400ms)
300ms:  "KO" badge pops in (scale 0→1, spring bouncy)
400ms:  Victory text appears
500ms:  Reward modal slides up
```

### 21.5 Enemy Hit Reaction

```
0ms:    Damage number spawns
50ms:   Enemy sprite shakes (short, 150ms)
100ms:  Enemy sprite scales down slightly (1→0.95→1, 200ms)
150ms:  Enemy flash white (opacity 0→0.3→0, 200ms)
200ms:  HP bar decreases smoothly (250ms)
```

### 21.6 Player Hit Reaction

```
0ms:    Red flash on left side of screen
50ms:   Player sprite shakes
100ms:  Player sprite expression changes to "hurt"
150ms:  HP bar decreases (red flash on bar)
200ms:  "isEnemyAttacking" visual indicator on player
500ms:  Player recovers (expression back to normal)
```

### 21.7 Special Attack (8+ Combo)

```
0ms:    Gold glow circle expands from center (scale 0→2, opacity 1→0, 600ms)
200ms:  "SERANGAN SPESIAL!" text pops in (spring bouncy)
300ms:  Screen flash gold (opacity 0→0.4→0, 300ms)
400ms:  Multiple damage numbers (3x, staggered)
600ms:  Enemy takes extra damage (50% bonus)
800ms:  Skill effect fades out
```

---

## 22. Mascot Animation System

### 22.1 Idle Animation

The mascot has a gentle floating idle animation:

```typescript
<motion.div
  animate={animate ? { y: [0, -6, 0] } : undefined}
  transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
>
  <svg>...</svg>
</motion.div>
```

- Duration: 3 seconds per cycle
- Displacement: 6px upward
- Easing: easeInOut (smooth float, no jerking)
- Infinite loop
- Respects `prefers-reduced-motion` via `animate` prop

### 22.2 Expression States

| Expression | Eye Shape | Mouth | Trigger |
|------------|-----------|-------|---------|
| `idle` | Circles | Gentle arc | Default state |
| `happy` | Lines (^_^) | Big smile | Correct answer, login |
| `excited` | Lines (^_^) | Open smile | 5+ combo, level up |
| `proud` | Lines (^_^) | Confident smile | Streak milestone, achievement |
| `sad` | Circles | Frown | Wrong answer, streak broken |
| `sleepy` | Half circles | Small "o" | Low activity, idle |
| `surprised` | Large circles | Oval "O" | Special attack, rare event |
| `confused` | One squint | Wavy line | Error, unexpected state |

### 22.3 Emotional Reaction Animation

When the mascot reacts to an event:

```
0ms:    Current expression fades out (50ms)
50ms:   New expression fades in (100ms)
150ms:  Mascot scales 1→1.15→1 (spring bouncy, 300ms)
250ms:  Floating text appears above mascot (if applicable)
```

### 22.4 Streak Celebration (7+ days)

```
0ms:    Mascot expression → "excited"
50ms:   Mascot bounces (1→1.2→1, spring bouncy)
150ms:  Fire emoji appears above
200ms:  Floating text: "{streak} hari berturut-turut! 🔥"
300ms:  Background gold glow pulse
500ms:  Mascot continues floating, slightly higher amplitude
```

### 22.5 Mascot Anti-Patterns

- **Never change expression mid-idle cycle.** Wait for idle cycle completion.
- **Never stack expression animations.** Queue them or drop lower-priority ones.
- **Never animate SVG paths directly.** Toggle between pre-built path groups. SVG path animation is expensive.

---

## 23. Loading Animation System

### 23.1 App Loading

Initial app load shows a branded spinner/logo animation:

- Logo fades in (300ms)
- Logo scales slightly (1→1.05→1, 2s loop)
- Subtle emerald glow pulse
- After load complete: logo fades out → content fades in (200ms crossfade)

### 23.2 Route Loading

Next.js `loading.tsx` at route level:

- Skeleton screens for content-heavy pages
- Minimal spinner (18px, subtle) for navigation loads under 1s
- Full skeleton with shimmer after 1s

---

## 24. Skeleton Animation System

### 24.1 Skeleton Pattern

```typescript
// Shimmer effect via CSS animation
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

// Applied via Tailwind:
// bg-gradient-to-r from-bg-elevated via-bg-surface to-bg-elevated
// bg-[length:200%_100%] animate-shimmer
```

### 24.2 Skeleton Rules

- Skeleton width/height matches content layout exactly (prevents layout shift)
- Shimmer animation: 1.5s loop, moves gradient left to right
- Reduced motion: static gray placeholder instead of shimmer
- Content appears with `fadeIn` once loaded

---

## 25. Modal Animation System

### 25.1 Center Modal

```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div                      // Backdrop
      variants={modalBackdrop}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      <motion.div                    // Content
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={springPresets.gentle}
      >
        {children}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

Timing:
- Backdrop: 200ms easeOut
- Content: spring gentle (y: 20→0, opacity: 0→1)
- Exit: 150ms, content scales down + fades

### 25.2 Bottom Sheet Modal

Same structure but content enters from bottom:

```typescript
const bottomSheetContent: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};
```

Used for: SessionSummary, BattleResult, share panels.

### 25.3 Modal Types

| Type | Enter Animation | Exit Animation | Backdrop |
|------|----------------|----------------|----------|
| Center popup | Scale up + fade | Scale down + fade | Dark blur |
| Bottom sheet | Slide up + fade | Slide down + fade | Dark blur |
| Full screen | Scale up | Scale down | None |
| Toast | Slide up + scale | Slide up + fade | None |

---

## 26. Notification Animation System

### 26.1 Toast

```typescript
// File: src/components/ui/Toast.tsx
<motion.div
  variants={toastEnter}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={springPresets.snappy}
/>
```

- Enter: slide up 50px + scale 0.95→1 (250ms)  
- Visible: stays 3s (auto-dismiss)  
- Exit: slide up -20px + fade (200ms)  
- Queue: stacked, each offset by 60px  

### 26.2 Toast Types

| Type | Icon | Color | Duration |
|------|------|-------|----------|
| success | Checkmark | Emerald | 3s |
| error | X | Red | 4s |
| warning | Alert | Yellow | 4s |
| info | Info | Blue | 3s |

---

## 27. Navigation Animation System

### 27.1 Bottom Navigation

```typescript
// Tab indicator uses layoutId for shared layout animation
{isActive && (
  <motion.div
    layoutId="nav-indicator"
    className="absolute -top-0.5 w-8 h-1 bg-emerald-500 rounded-full"
    transition={springPresets.snappy}
  />
)}
```

- Indicator slides horizontally between tabs with spring snappy
- Icon/text color transitions (200ms)
- Tab press: scale 0.95 (100ms)
- Page transition: 250ms fade + y slide

### 27.2 Back Navigation

- Back button (swipe X, profile back): fades current page out, next page fades in
- 200ms crossfade
- Direction: exiting content slides up slightly

---

## 28. Scroll Animation Rules

### 28.1 Scroll Containers

- Horizontal scroll containers use `scrollbar-none` utility
- Content within scroll containers uses static entrance animation (non-scroll-driven)
- No scroll-triggered animations (parallax, reveal) — too expensive on mobile

### 28.2 Scrollbar

- Custom styled scrollbar on `::-webkit-scrollbar`
- Thin (4px), transparent, fades on scroll
- Desktop only — mobile browsers hide scrollbars natively

---

## 29. Floating Animation Rules

### 29.1 Floating Particle System

Background particles (arena, achievement screens):

```
- 12 particles max
- Random position (x: 0-100%, y: 0-100%)
- Random size (2-6px)
- Random speed (3-6s per cycle)
- Opacity: 0.2-0.5
- CSS transform animation (translate3d + opacity)
- No Framer Motion (too many elements would overload motion system)
```

### 29.2 Float Patterns

```typescript
// CSS-based float for performance
@keyframes float {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -10px, 0); }
}

// Tailwind utility for float animation
.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

---

## 30. Glow Animation Rules

### 30.1 Glow Variants

```typescript
// Defined in Tailwind globals.css as shadow utilities
shadow-glow-emerald  — subtle green glow (correct answer, primary actions)
shadow-glow-gold     — warm gold glow (combo 5+, achievements)
shadow-glow-combo    — intense gold glow (combo 10+, special attacks)
shadow-glow-streak   — red glow (danger states, low HP)
shadow-glow-card     — soft white glow (elevated cards)
```

### 30.2 Glow Pulse (Looping)

For idle glow states (achievement badges, rank emblems):

```typescript
<motion.div
  animate={{
    boxShadow: [
      '0 0 20px rgba(16, 185, 129, 0.1)',
      '0 0 30px rgba(16, 185, 129, 0.2)',
      '0 0 20px rgba(16, 185, 129, 0.1)',
    ],
  }}
  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
/>
```

Note: `boxShadow` animation is GPU-accelerated via composite layer. Still, limit to 1-2 simultaneous glow-pulse elements to avoid paint overhead.

### 30.3 Glow Anti-Patterns

- **Never use `box-shadow` animation on more than 3 elements simultaneously.** Causes paint bottlenecks.
- **Never animate `boxShadow` on large elements** (>200px). Use smaller glow rings instead.
- **Prefer CSS `box-shadow` transitions over Framer Motion `boxShadow` animation** when possible.

---

## 31. Idle Animation Rules

### 31.1 What Gets Idle Animations

| Element | Animation | Duration | Priority |
|---------|-----------|----------|----------|
| Mascot | Gentle float (y: -6px) | 3s | High |
| Streak fire emoji | Subtle rotation (emoji) | 500ms burst, 5s repeat | Medium |
| Background particles | Slow drift | 4-6s | Low |
| Achievement badges | Subtle glow pulse | 2s | Low |
| Rank emblems | Subtle glow pulse | 2s | Low |
| Battle VS divider | Opacity pulse | 2s | Low |

### 31.2 Idle Rules

- Idle animations **must** respect `prefers-reduced-motion`
- Idle animations on visible elements only — not rendered off-screen
- Maximum 3 simultaneous idle animations to stay within performance budget
- Idle animations pause when tab is hidden

---

## 32. Progress Animation Rules

### 32.1 Progress Bar Fill

```typescript
<motion.div
  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
/>
```

- Duration: 400ms
- Easing: easeOut (starts fast, decelerates into position)
- Delay: 300ms (waits for parent entrance)
- No bounce on progress (bars don't overshoot)
- XP counter animates independently (see below)

### 32.2 XP Counter Animation

```typescript
<motion.p
  key={profile.xp}                   // Key changes → re-triggers animation
  initial={{ scale: 1.3, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={springPresets.bouncy}
>
  {profile.xp.toLocaleString()}
</motion.p>
```

- When XP value changes, number pops (scale 1.3→1, spring bouncy)
- New value replaces old value immediately (no count-up animation)
- Count-up animation reserved for level-up celebrations

### 32.3 Level Up Celebration

```
0ms:    Screen dims (backdrop, 300ms)
100ms:  Level up badge appears (scale 0→1, spring bouncy)
300ms:  "Level 13!" text slides up
400ms:  New rank revealed (if applicable)
500ms:  Confetti burst (25 particles)
600ms:  XP counter animates from old to new (count-up, 1s)
1000ms:  "Lanjut" button appears
1500ms:  User dismisses
```

---

## 33. Confetti & Particle System

### 33.1 Confetti Specification

| Property | Session Summary | Battle Victory | Battle Reward | Level Up |
|----------|----------------|----------------|---------------|----------|
| Count | 20 | 25 | 15 | 25 |
| Colors | emerald/gold/white | emerald/gold/white/error | emerald/gold | emerald/gold/white |
| Duration | 1.5-2.5s | 1.5-2.5s | 1.2-2s | 1.5-2.5s |
| Spread | ±100px x, 50-200px y | ±100px x, 40-200px y | ±80px x, 30-150px y | ±100px x, 50-200px y |
| Size | 8px squares | 10px squares | 8px squares | 10px squares |
| Rotation | Random 360° | Random 360° | Random 360° | Random 360° |
| Delay | 0-300ms staggered | 0-500ms staggered | 0-300ms staggered | 0-300ms staggered |

### 33.2 Particle Pool

Particles are rendered as `motion.div` elements inside an `AnimatePresence` wrapper:

```typescript
<AnimatePresence>
  {show && (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </div>
  )}
</AnimatePresence>
```

On low-end devices: `PARTICLE_COUNT = 0` (no confetti).

### 33.3 Particle Reuse

- Particles are never reused — they mount, animate, and unmount
- New burst = new set of particles (fresh randomization)
- `AnimatePresence` handles cleanup

---

## 34. Sound + Motion Synchronization

### 34.1 Timing Map

| Animation Event | Sound Effect | Timing Offset |
|----------------|--------------|---------------|
| Correct answer | Soft chime | +0ms (simultaneous) |
| Wrong answer | Buzz/error | +0ms |
| Combo 5+ | Power-up sound | +50ms (after visual) |
| Combo 10+ | Fire roar | +50ms |
| Battle hit | Impact thud | +0ms |
| Enemy defeat | Victory fanfare | +200ms (after visual) |
| Level up | Level-up jingle | +100ms |
| Button press | Click/tap | +0ms |
| Page transition | Whoosh | +50ms |
| XP burst | Coin collect | +50ms |

### 34.2 Audio Preloading

Sounds are preloaded at app init and cached. No audio plays before it's loaded.

### 34.3 Audio + Visual Lockstep

Audio and visual must stay synchronized. If audio is delayed (loading), visual proceeds without it. Never delay visual feedback for audio.

---

## 35. Motion Accessibility Rules

### 35.1 Reduced Motion Detection

```typescript
// File: src/animations/helpers.ts
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

### 35.2 Reduced Motion Behavior

When `prefers-reduced-motion: reduce` is active:

| Animation Type | Fallback |
|----------------|----------|
| Page transitions | Instant opacity 0→1 (no slide) |
| Card swipe | Follows finger, no rotation/glow transform |
| Particles/confetti | None |
| Mascot idle | Static (no float) |
| Combo display | Static (no pulse/rotation) |
| Progress fill | Instant |
| Modal | Instant appearance (no scale/translate) |
| Stagger | All elements appear simultaneously |
| Glow pulse | Static glow |
| Skeleton shimmer | Static gray |
| Everything else | Duration 0, skip to end state |

Implementation approach:
- Animated elements accept a `reducedMotion` prop or context
- Variants swap to instant (duration: 0) when reduced motion is preferred
- Particle effects don't render
- Spring physics replaced with instant tweens

### 35.3 Flashing Content

- No animation flashes more than 3 times per second
- No full-screen brightness flashes
- Screen shake limited to 4px displacement (not 8px)
- Confetti particles are small (≤10px) and semi-transparent — safe for photosensitivity

### 35.4 Cognitive Load

- Animations don't require user attention to understand
- Motion is peripheral, not focal
- No animation plays for longer than 2.5 seconds
- User can dismiss any celebration animation (tap to skip)

---

## 36. Reduced Motion Strategy

### 36.1 System-Level Detection

```typescript
// In ThemeProvider or root layout
const [reducedMotion, setReducedMotion] = useState(false);

useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReducedMotion(mq.matches);
  const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}, []);
```

### 36.2 Motion Context

```typescript
// React context provides reducedMotion value to all components
// Components check context before deciding animation intensity
// Default: false (animations enabled)
```

### 36.3 Reduced Motion Preset Override

When reduced motion is active, all animation presets become instant tweens:

```typescript
export const reducedMotionPresets = {
  snappy: { duration: 0 },
  bouncy: { duration: 0 },
  gentle: { duration: 0 },
  smooth: { duration: 0 },
  wobbly: { duration: 0 },
};
```

---

## 37. Animation Performance Budget

### 37.1 Budget Table

| Metric | Budget | Measurement |
|--------|--------|-------------|
| JS heap (animations) | < 5MB | Chrome DevTools Memory |
| Active Framer Motion elements | ≤ 30 | React DevTools |
| Simultaneous transforms | ≤ 15 | Performance profiler |
| Particle elements | ≤ 30 | DOM counter |
| Spring evaluations per frame | ≤ 10 | Framer Motion stats |
| Layout thrashing events | 0 | Performance profiler |
| Frame time (mobile) | ≤ 16ms | Performance profiler |
| Frame time (desktop) | ≤ 12ms | Performance profiler |
| First paint after interaction | ≤ 50ms | Lighthouse |

### 37.2 Budget Enforcement

- Regular performance audits using React Profiler
- FPS counter available in dev mode (`?fps=true`)
- Automatic quality downgrade on low-end devices (see Section 10.2)
- CI performance regression checks (future)

---

## 38. GPU Optimization Rules

### 38.1 Layer Promotion

For animations to run on the GPU, layers must be promoted to composite layers:

```typescript
// GOOD: GPU-composited
className="transform-gpu"  // or
style={{ willChange: 'transform' }}
```

### 38.2 Will-Change Strategy

Apply `willChange` sparingly and only to actively animating elements:

```typescript
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
/>
```

Rules:
- Apply `willChange: transform` on drag-enabled elements
- Apply `willChange: opacity` on fading elements
- Remove `willChange` after animation completes (Framer Motion handles this automatically with `style`)
- Never apply `willChange` to more than 3-4 elements simultaneously

### 38.3 GPU Anti-Patterns

- **Never promote layers unconditionally.** Each composite layer uses GPU memory.
- **Never use `willChange` on static elements.** Wastes GPU memory.
- **Never force GPU on large lists.** Compositing 100+ list items will crash GPU.
- **Never animate `filter: blur()` on large elements.** Causes repaint on every frame. Use backdrop blur via CSS on static overlays instead.

---

## 39. Re-render Prevention Strategy

### 39.1 Selector Optimization

Use granular Zustand selectors to prevent unnecessary re-renders:

```typescript
// BAD: Entire store subscription — re-renders on ANY store change
const store = useSwipeStore();

// GOOD: Single property subscription — re-renders only when combo changes
const combo = useSwipeStore((s) => s.combo);
```

### 39.2 Motion Value Optimization

Use `useMotionValue` + `useTransform` for properties that change every frame during gestures:

```typescript
// GOOD: motion values don't trigger re-render
const x = useMotionValue(0);
const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

// BAD: state-based drag position causes re-render on every frame
const [x, setX] = useState(0);
onDrag={(_, info) => setX(info.offset.x)}  // 60 re-renders per second!
```

### 39.3 Memoization

```typescript
// Memoize components that re-render frequently
const VocabCard = React.memo(({ word, isTop }: VocabCardProps) => {
  // ...
});

// Memoize computed values
const message = useMemo(() => {
  return getContextMessage(profile);
}, [profile]);
```

### 39.4 Component Splitting

Split large components to isolate animation-driven re-renders:

```typescript
// BAD: One component re-renders entirely on combo change
// GOOD: ComboDisplay is a separate component — only it re-renders on combo change

// In parent:
return (
  <div>
    <ComboDisplay />    {/* Re-renders on combo change */}
    <CardStack />        {/* Does NOT re-render on combo change */}
    <XpBurst />          {/* Does NOT re-render on combo change */}
  </div>
);
```

---

## 40. Animation Architecture

### 40.1 File Structure

```
src/
  animations/
    presets.ts          — Spring and tween presets
    variants.ts          — Framer Motion Variants
    transitions.ts       — Composite transition configs (stagger, etc.)
    helpers.ts           — Device quality detection, reduced motion
    
  components/
    animations/
      AnimatedWrappers.tsx  — Reusable FadeIn, SlideUp, etc. wrappers
      
  constants/
    animation.ts         — Timing and stagger constants
    
  styles/
    globals.css          — Keyframe definitions (shimmer, float)
                          via @keyframes in CSS
```

### 40.2 Animation Data Flow

```
User Input (touch/click)
  │
  ▼
Zustand Store (onClick handler, drag end)
  │
  ▼
State Change (combo++, xpEarned, answerState)
  │
  ▼
React Re-render (only subscribed components)
  │
  ▼
Framer Motion (animates based on new state)
  │
  ▼
GPU Composite (transform + opacity only)
```

### 40.3 Component-Animation Coupling

| Component | Animation Type | Data Source | Trigger |
|-----------|---------------|-------------|---------|
| VocabCard | Drag gesture, exit | motionValue, swipeStore | User drag |
| CardStack | Stack offset (CSS) | swipeStore.currentIndex | State change |
| ComboDisplay | Scale pulse | swipeStore.combo | State change |
| SwipeFeedbackLayer | Scale/fade | swipeStore.answerState | State change |
| XpBurst | Particle float | swipeStore.answerState | State change |
| SessionSummary | Slide up | swipeStore.showSummary | State change |
| BattleHUD | Fade in | battleStore.phase | State change |
| HPBar | Width tween | battleStore.playerHp | State change |
| DamageNumbers | Float up | battleStore answerState | State change |
| SkillEffect | Scale/fade circle | battleStore.showSkillEffect | State change |
| RewardModal | Scale slide up | battleStore.showReward | State change |
| BattleResult | Slide up | battleStore.showResult | State change |
| Mascot | Float idle | always | Mount |
| ScreenContainer | Page transition | always | Mount |

---

## 41. Framer Motion Structure

### 41.1 Motion Component Patterns

**Pattern 1: Variants + Transition**
```typescript
// For mount/unmount animations
<motion.div
  variants={myVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={springPresets.gentle}
/>
```
Used by: ScreenContainer, Modals, Stagger lists, Sections

**Pattern 2: Direct Values + Transition**
```typescript
// For state-driven animations
<motion.div
  animate={{ scale: isActive ? 1.1 : 1 }}
  transition={springPresets.snappy}
/>
```
Used by: Interactive elements, State indicators

**Pattern 3: Motion Values + Gestures**
```typescript
// For drag animations
const x = useMotionValue(0);
const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);

return (
  <motion.div
    drag="x"
    style={{ x, rotate }}
    onDragEnd={handleDragEnd}
  />
);
```
Used by: VocabCard

**Pattern 4: AnimatePresence Key Switching**
```typescript
// For element swap animations
<AnimatePresence mode="wait">
  <motion.div key={currentValue}>
    {content based on currentValue}
  </motion.div>
</AnimatePresence>
```
Used by: ComboDisplay, BattleCombo, SwipeFeedbackLayer

### 41.2 AnimatePresence Mode Guide

| Mode | Behavior | Use Case |
|------|----------|----------|
| `"wait"` | Exit completes before enter | Page transitions, Tab content |
| `"popLayout"` | Exit removed immediately, remaining elements pop | Card stack |
| `"sync"` (default) | Exit/enter simultaneous | Overlays, Modals |

---

## 42. Motion Token System

### 42.1 Complete Token Reference

```
Duration Tokens (ms)
  buttonPress:    100
  buttonRelease:  150
  cardSwipeOut:   400
  cardEnter:      350
  xpFloat:        800
  comboUpdate:    300
  battleHit:      200
  pageTransition: 250
  modalEnter:     300
  modalExit:      150
  toastEnter:     250
  toastExit:      200
  mascotBlink:    150
  mascotReact:    400
  skeletonPulse:  1500
  progressFill:   400

Spring Presets
  snappy:  { stiffness: 300, damping: 25,  mass: 0.5 }
  bouncy:  { stiffness: 200, damping: 15,  mass: 0.5 }
  gentle:  { stiffness: 150, damping: 20,  mass: 1   }
  smooth:  { stiffness: 100, damping: 20,  mass: 1   }
  wobbly:  { stiffness: 80,  damping: 10,  mass: 1   }

Tween Presets
  fast:        { duration: 0.15, ease: 'easeOut' }
  normal:      { duration: 0.25, ease: 'easeOut' }
  slow:        { duration: 0.40, ease: 'easeOut' }
  expressive:  { duration: 0.60, ease: [0.34, 1.56, 0.64, 1] }

Glow Presets
  shadow-glow-emerald  — rgba(16, 185, 129, 0.3) 15px
  shadow-glow-gold     — rgba(234, 179, 8, 0.3) 15px
  shadow-glow-combo    — rgba(234, 179, 8, 0.5) 25px
  shadow-glow-streak   — rgba(239, 68, 68, 0.3) 15px
  shadow-glow-card     — rgba(255, 255, 255, 0.05) 10px

Stagger Presets
  cardList:      0.05
  badgeGrid:     0.05
  leaderboard:   0.03
  missionList:   0.08
  particleBurst: 0.02
  answerOptions: 0.05
```

---

## 43. Reusable Motion Wrappers

### 43.1 AnimatedWrappers

See `src/components/animations/AnimatedWrappers.tsx`:

- `FadeIn` — simple opacity entrance
- `SlideUp` — content slides up from below
- `SlideDown` — content slides down from above
- `ScaleIn` — content scales in from center

### 43.2 StaggerContainer

```typescript
// Pattern for staggering children
export function StaggerContainer({ children, delay = 0.05 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Child item variant:
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

### 43.3 AnimatedCounter

```typescript
// For XP/streak/stat number transitions
// When value changes, use key prop to trigger entrance animation
export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={springPresets.bouncy}
      className={className}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
```

---

## 44. State Transition Mapping

### 44.1 Swipe State → Animation

| State Change | Visual | Animated Component | Duration |
|-------------|--------|-------------------|----------|
| answerState: none → correct | Green glow, particles, XP | VocabCard, XpBurst, SwipeFeedbackLayer | 400ms |
| answerState: none → incorrect | Red glow, shake, no particles | VocabCard, SwipeFeedbackLayer | 300ms |
| currentIndex: n → n+1 | Card exit, next card enters | CardStack (AnimatePresence key change) | 600ms |
| showSummary: false → true | Backdrop, modal, confetti | SessionSummary | 600ms |

### 44.2 Battle State → Animation

| State Change | Visual | Animated Component | Duration |
|-------------|--------|-------------------|----------|
| phase: select → intro | Enemies selected, arena fade | BattlePage, ArenaBackground | 1500ms |
| phase: intro → active | Questions appear | QuestionCard, AnswerButtons | 350ms |
| answer: none → correct | Green highlight, damage | AnswerButtons, DamageNumbers, HPBar | 400ms |
| answer: none → wrong | Red highlight, player damage | AnswerButtons, DamageNumbers, HPBar, PlayerSprite | 400ms |
| enemyHp: hits 0 | Enemy defeat, victory | EnemySprite, HPBar, BattleResult | 700ms |
| playerHp: hits 0 | Player defeat | PlayerSprite, HPBar, BattleResult | 1000ms |
| showReward: false → true | Reward modal | RewardModal | 500ms |
| showResult: false → true | Battle result | BattleResult | 600ms |

### 44.3 Profile/Progress → Animation

| State Change | Visual | Animated Component | Duration |
|-------------|--------|-------------------|----------|
| Page mount | Sections stagger in | ScreenContainer + section animations | 400ms |
| XP change | Counter pop | AnimatedCounter | 300ms |
| Streak update | Badge color/text change | HomeHeader streak badge | 200ms |

---

## 45. Animation QA Checklist

### 45.1 Performance Checklist

- [ ] All animated properties are `transform` or `opacity` (no layout animation)
- [ ] No re-renders during drag gestures (motion values used correctly)
- [ ] Particle count ≤ 30 (or 0 on low-end)
- [ ] No more than 8 simultaneous active animations
- [ ] FPS stays at 60fps on mid-range device during: swipe, battle, profile scroll
- [ ] Animations pause when tab hidden (browser default, but verify)

### 45.2 UX Checklist

- [ ] All interactive elements have `whileTap` or `whileHover` feedback
- [ ] Button feedback renders on pointer down (not up)
- [ ] No animation delays user interaction
- [ ] Page transitions complete within 300ms
- [ ] Celebrations can be dismissed (tap to skip)
- [ ] Reduced motion removes all non-essential animations
- [ ] Wrong answer feedback is fast (≤300ms) — user doesn't wait to try again
- [ ] Correct answer feedback is satisfying but doesn't slow down gameplay

### 45.3 Consistency Checklist

- [ ] Same animation type uses same preset (e.g., all button presses use `snappy`)
- [ ] Same variant used for same pattern (e.g., all section slides use `slideUp`)
- [ ] Stagger delays match STAGGER constants
- [ ] Timing matches ANIMATION_DURATIONS constants
- [ ] Spring preset matches use case (button vs card vs modal)

### 45.4 Code Quality Checklist

- [ ] No inline animation values (use presets/tokens)
- [ ] No magic numbers for durations (use constants)
- [ ] Store subscriptions use granular selectors
- [ ] Components split by animation boundary
- [ ] motion values used for gesture-driven properties
- [ ] `AnimatePresence` mode correctly specified
- [ ] `key` props correctly set for element swap animations

---

## 46. Anti-Pattern Warnings

### 🚫 Spring + Layout Animation

**Problem:** Animating layout properties (width, height) with spring physics causes layout thrashing.
**Solution:** Use tweens for layout properties, springs only for transforms.

### 🚫 State in Motion Values

**Problem:** Using `useMotionValue` for state that other components need.
**Solution:** Motion values are for animation-only data. Put game state in Zustand.

### 🚫 Too Many Particles

**Problem:** 50+ `motion.div` elements for confetti on a low-end device drops to 20fps.
**Solution:** Cap particles at 30, or 0 on low-end. Use `shouldReduceParticles()`.

### 🚫 Infinite Spring Loops

**Problem:** `animate: { scale: [1, 1.1, 1] }` with spring physics accumulates energy.
**Solution:** Use tween easing for looping animations, not spring.

### 🚫 AnimatePresence Without Keys

**Problem:** `AnimatePresence` children need unique keys to properly detect enter/exit.
**Solution:** Always provide a stable, unique `key` prop to `AnimatePresence` children.

### 🚫 Nested AnimatePresence

**Problem:** Nested `AnimatePresence` components can cause unexpected behavior.
**Solution:** Flatten where possible. Use `AnimatePresence mode="wait"` at page level.

### 🚫 Heavy SVG Path Animation

**Problem:** Animating SVG `d` attribute or individual path elements is expensive.
**Solution:** Toggle between pre-built path groups. Don't animate path data.

### 🚫 Box-Shadow Animation on Large Elements

**Problem:** Animating `boxShadow` on >200px elements causes paint bottlenecks.
**Solution:** Use small glow rings, pseudo-elements, or CSS transitions instead.

### 🚫 Forcing GPU on Lists

**Problem:** `transform: translateZ(0)` on 100+ list items consumes GPU memory.
**Solution:** Only promote actively animating elements to their own composite layer.

### 🚫 Scroll-Triggered Animations

**Problem:** Scroll-driven animations (parallax, reveal-on-scroll) cause jank on mobile.
**Solution:** Don't use scroll-triggered animations. Use mount-triggered entrances instead.

### 🚫 Animating During Page Load

**Problem:** Animations fire before fonts/network/assets are ready.
**Solution:** Use `loading.tsx` with skeletons. Let content fully load before animating.

---

## 47. Future Expansion Strategy

### 47.1 Lottie Integration

For complex character animations (mascot celebrations, special effects), consider Lottie:
- Exportable from After Effects via Bodymovin
- JSON-based → small file size
- GPU-accelerated rendering
- Playback control (play, pause, speed, segment)
- Fallback: static SVG for reduced motion

Integration point:
```typescript
// Future pattern
import Lottie from 'lottie-react';
import celebrationAnimation from './lotties/celebration.json';

<Lottie
  animationData={celebrationAnimation}
  loop={false}
  autoplay={true}
  speed={1.5}  // Slightly faster for mobile feel
/>
```

### 47.2 Gesture Handler v2

For more complex gestures (pinch, multi-touch, custom swipes):
- `@use-gesture/react` for unified gesture handling
- Spring physics from `@react-spring/web` (alternative to Framer Motion for heavy gesture work)
- Combine with Zustand for game state

### 47.3 Motion Layout Groups

For shared element transitions between pages (future enhancement):
- Framer Motion `layoutId` for hero transitions
- Image/card expands from list to detail view
- Avatar transitions between profile and header

### 47.4 Web Animation API

For ultra-lightweight animations that don't need React reconciliation:
- `Element.animate()` for non-interactive CSS animations
- Use for: background particles, skeleton shimmer, ambient glow
- Bypasses React's render cycle entirely

### 47.5 Animation Editor / Debug Tools

Future dev tools:
- Visual animation preview panel
- Timing curve editor
- Spring physics visualizer (stiffness/damping/mass graph)
- FPS overlay (production toggle via `?fps=true`)
- Animation recording/export for QA

---

## Appendix A: Quick Reference

### Spring → Use Case

```
snappy  → button press, toggle, icon tap, navigation tab
bouncy  → modal content, badge pop, star pop, combo display
gentle  → card entrance, section slide, list item, toast
smooth  → page transition, large panel, modal backdrop
wobbly  → special attack, celebration, character reaction
```

### Tween → Use Case

```
fast    → micro fade, opacity flash, quick color shift
normal  → page enter/exit, standard transitions
slow    → deliberate reveal, emphasis, progress fill
expressive → celebratory pop, achievement reveal
```

### Duration → Use Case

```
100ms   → button press, tap feedback, hit flash
200ms   → correct/wrong flash, button release, modal exit
250ms   → page transition, toast, progress fill, HP change
300ms   → combo update, modal enter, card enter
400ms   → card swipe out, section stagger
800ms   → XP float, skill effect, particle burst
1500ms  → confetti, level up, celebration
```

### Glow → Use Case

```
shadow-glow-emerald  → correct answer, primary CTA
shadow-glow-gold     → combo 5+, achievement, rank reveal
shadow-glow-combo    → combo 10+, special attack, max intensity
shadow-glow-streak   → danger state, low HP, streak at risk
shadow-glow-card     → card elevation, subtle depth
```

---

*Harf Animation System v1.0 — Designed for premium mobile-native learning experience.*
