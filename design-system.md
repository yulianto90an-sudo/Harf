# Design System — Harf

**Version:** 1.0  
**Status:** Production-ready  
**Stack:** Next.js + Tailwind CSS + Framer Motion  
**Device Focus:** Mobile-first (375px–430px)  

---

## 1. Brand Identity

| Attribute | Detail |
|-----------|--------|
| **Brand Name** | Harf (حرف) |
| **Meaning** | "Huruf" dalam bahasa Arab |
| **Brand Archetype** | The Magician + The Jester — playful, transformative, delightful |
| **Brand Personality** | Ceria, cerdas, modern, hangat, premium |
| **Tone of Voice** | Casual, encouraging, playful — seperti teman yang ngajak main, bukan guru yang ngajarin |
| **Brand Promise** | Belajar bahasa Arab serasa main game |
| **Target Feeling** | Excited, accomplished, curious, "one more card" feeling |

### Brand Taglines

| Usage | Text |
|-------|------|
| **Hero** | Belajar Bahasa Arab, Serasa Main Game |
| **Short** | Harf. Main. Belajar. Kuasai. |
| **Subtitle** | Geser. Battle. Streak. Repeat. |

---

## 2. Design Philosophy

```
"Every pixel must earn its place. Every interaction must feel rewarding."
```

### Core Design Principles

| # | Principle | Description |
|---|-----------|-------------|
| 1 | **Mobile-First** | Setiap keputusan desain dimulai dari layar genggaman tangan |
| 2 | **Joyful Minimalism** | Sederhana tapi penuh kepribadian — tidak pernah kosong, tidak pernah ramai |
| 3 | **Feedback Everywhere** | Setiap aksi user mendapat respons visual & motion yang satisfying |
| 4 | **Progressive Polish** | Detail kecil yang bikin user senyum: float XP, mascot blink, combo glow |
| 5 | **Thumb-First** | Semua kontrol dalam jangkauan thumb — bottom zone untuk aksi, top zone untuk informasi |
| 6 | **Glanceable** | User bisa paham state dalam <2 detik tanpa baca teks panjang |
| 7 | **Dark by Default** | Dark mode adalah identity, bukan fitur tambahan |
| 8 | **Game-rather-than-App** | Harf dirasa seperti game, bukan utility app |

### Design Decision Framework

Setiap desain harus tanya:  
1. **Mobile thumb-friendly?** — Bisa diakses dengan satu tangan?  
2. **Satisfying feedback?** — Apakah ada animasi/warna response?  
3. **Reduce cognitive load?** — Apa yang bisa dihilangkan?  
4. **Delight factor?** — Apakah ini bikin user senyum?  

---

## 3. Visual Direction

### Visual Mood

| Aspect | Direction | Example |
|--------|-----------|---------|
| **Texture** | Clean, smooth, glass-like | Tidak ada noise atau grain |
| **Depth** | Layered — card di atas surface, modal di atas card | Z-index via shadow & blur |
| **Light** | Dark background dengan glow accent | Glow hijau pada XP, glow emas pada streak |
| **Gradient** | Subtle, premium, diagonal | Emerald → Navy, Gold → Orange |
| **Glass** | Backdrop blur untuk overlay dan modal | `backdrop-blur-xl bg-white/5` |
| **Edges** | Rounded besar, soft | Border-radius 16-24px untuk card |
| **Shadows** | Soft ambience, bukan hard drop shadow | `box-shadow` dengan blur 20-40px |
| **Border** | Subtle, 1px dengan opacity rendah | `border border-white/10` |

### Visual Hierarchy (Mobile)

```
ZONE 1: TOP (60px)
  - Status bar area
  - Streak indicator, XP bar, mascot
  - Glanceable info, jarang ada interaksi

ZONE 2: MIDDLE (content area)
  - Card stack, battle arena, mission list
  - Interaksi utama di sini

ZONE 3: BOTTOM (60-80px)
  - Bottom navigation bar
  - Floating action buttons
  - Zona favorit thumb
```

---

## 4. UI Personality

Deskripsi bagaimana Harf "terasa" saat digunakan:

| Quality | Manifests As |
|---------|--------------|
| **Playful** | Mascot blink, bounce animation, ekspresi lucu |
| **Premium** | Glassmorphism, smooth transition, consistent spacing |
| **Fast** | <100ms response untuk tap, spring animation, no lag |
| **Clean** | Whitespace lega, tidak ada border dekoratif berlebihan |
| **Bold** | Arabic text besar, warna emerald solid, typography strong |
| **Warm** | Gold accent, cream text, mascot hangat, tone ramah |
| **Satisfying** | Setiap tombol terasa "berisi" — scale 0.95 on press, spring back |
| **Modern** | No skeuomorphism, no bevel, no gradient overload |

### What Harf UI is NOT

❌ Template admin dashboard  
❌ Aplikasi pendidikan kuno  
❌ Duolingo clone  
❌ Over-animated / cartoonish  
❌ Flat dan membosankan  

---

## 5. Color Palette

### Dark Theme (Default)

```
━ BACKGROUND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BG-Primary:      #0A0F1E    hsl(222, 50%, 8%)
  BG-Surface:      #111827    hsl(222, 40%, 12%)
  BG-Elevated:     #1E293B    hsl(222, 30%, 17%)
  BG-Card:         #1A2332    hsl(218, 32%, 15%)

━ TEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Text-Primary:    #FEFCE8    hsl(55, 100%, 95%)    [cream]
  Text-Secondary:  #94A3B8    hsl(215, 20%, 65%)
  Text-Tertiary:   #64748B    hsl(215, 16%, 45%)
  Text-Disabled:   #475569    hsl(215, 16%, 35%)

━ PRIMARY (Emerald) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Emerald-300:     #6EE7B7    hsl(160, 70%, 73%)
  Emerald-400:     #34D399    hsl(160, 65%, 63%)
  Emerald-500:     #10B981    hsl(160, 84%, 49%)   ★ PRIMARY
  Emerald-600:     #059669    hsl(160, 87%, 39%)
  Emerald-700:     #047857    hsl(160, 91%, 29%)
  Emerald-Glow:    #10B981 + 30% opacity            (For glow effects)

━ SECONDARY (Navy) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Navy-700:        #334155    hsl(218, 18%, 25%)
  Navy-800:        #1E293B    hsl(217, 33%, 17%)
  Navy-900:        #0F172A    hsl(222, 47%, 11%)

━ ACCENT (Gold) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Gold-300:        #FCD34D    hsl(48, 96%, 65%)
  Gold-400:        #FACC15    hsl(48, 96%, 55%)    ★ Accent
  Gold-500:        #EAB308    hsl(48, 96%, 47%)

━ FEEDBACK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Success:         #22C55E    hsl(142, 70%, 49%)
  Error:           #EF4444    hsl(0, 84%, 60%)
  Warning:         #F97316    hsl(25, 95%, 53%)
  Info:            #3B82F6    hsl(217, 91%, 60%)

━ SPECIAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  XP-Glow:         #10B981 + 40% opacity, blur 20px
  Combo-Glow:      #FACC15 + 30% opacity, blur 15px
  Streak-Fire:     #F97316 → #FACC15 (gradient)
  Battle-Damage:   #EF4444, flash 100ms
  Battle-Heal:     #22C55E, pulse 300ms
```

### Light Theme (Optional)

```
  BG-Primary:      #FAFAF9    hsl(60, 9%, 96%)
  BG-Surface:      #FFFFFF
  BG-Card:         #F5F5F4    hsl(60, 6%, 94%)

  Text-Primary:    #1C1917    hsl(60, 10%, 10%)
  Text-Secondary:  #57534E    hsl(60, 5%, 32%)
```

### Gradient Tokens

```css
--gradient-hero:    linear-gradient(135deg, #10B981, #047857);
--gradient-streak:  linear-gradient(135deg, #FACC15, #F97316);
--gradient-battle:  linear-gradient(135deg, #3B82F6, #7C3AED);
--gradient-rank-up: linear-gradient(135deg, #34D399, #FACC15);
--gradient-gold:    linear-gradient(135deg, #FCD34D, #EAB308);
--gradient-card:    linear-gradient(180deg, #1A2332, #111827);
--gradient-glow:    radial-gradient(circle at 50% 0%, #10B981 0%, transparent 70%);
```

---

## 6. Typography System

### Font Stack

```css
--font-sans:   'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
--font-arabic: 'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif;
--font-mono:   'JetBrains Mono', monospace;
```

### Font Loading Strategy

- **Variable fonts** untuk performance (satu file .woff2 mencakup semua weight)
- `font-display: swap` untuk FOUT minimal
- Subset fonts: hanya karakter Latin + Arabic yang dipakai
- Preload font utama di `<head>`

### Type Scale (Mobile)

```
Level          Size      Weight    Line H     Letter-Spacing    Usage
────────────────────────────────────────────────────────────────────────
Arabic-XL      48px      700       1.1        -0.01em          Arabic word on card
Arabic-L       36px      600       1.2        -0.005em         Arabic in battle
Display-1      28px      800       1.2        -0.02em          Rank name, hero text
Display-2      24px      700       1.3        -0.01em          Section title
Heading-1      20px      700       1.3        -0.005em         Card title
Heading-2      18px      600       1.4        0                Subtitle
Body           16px      400       1.5        0                Paragraph, content
Body-Bold      16px      600       1.5        0                Emphasis
Body-Small     14px      400       1.4        0.01em           Caption, metadata
Label          13px      600       1.2        0.02em           Button, nav label
Micro          12px      500       1.3        0.02em           Badge, timestamps
XP-Value       20px      800       1          0.02em           XP number (floating)
Combo-Number   32px      900       1          -0.02em          Combo counter
```

### Typography Rules

| Rule | Implementation |
|------|----------------|
| **Minimum font size** | 12px (Micro) — jangan lebih kecil |
| **Body text** | 16px — jangan lebih kecil untuk readability |
| **Line height** | 1.5 untuk body, lebih tight untuk headline |
| **Arabic vs Latin** | Arabic selalu 1.2x ukuran Latin untuk keterbacaan |
| **Max line length** | 40-60 karakter per baris (body) |
| **Touch targets label** | Label minimal 13px agar terbaca |

### Arabic Typography

```css
/* Arabic text display */
.arabic-word {
  font-family: 'Noto Naskh Arabic', 'Amiri', serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  direction: rtl;
  text-align: center;
  font-feature-settings: 'kern' 1;
  -webkit-font-smoothing: antialiased;
  letter-spacing: normal; /* Arabic tidak pakai letter-spacing */
}
```

- Arabic font size **1.2x lebih besar** dari Latin equivalent
- Gunakan `font-feature-settings` untuk proper ligatures
- Jangan gunakan `letter-spacing` untuk Arabic text (merusak ligatures)
- Line height 1.1 untuk Arabic (lebih compact dari Latin)

---

## 7. Spacing System

### Base Unit: 4px

```css
--space-0:   0px;
--space-1:   4px;    /* p-1, gap-1 */
--space-2:   8px;    /* p-2, gap-2 */
--space-3:   12px;   /* p-3 */
--space-4:   16px;   /* p-4 — default padding card */
--space-5:   20px;   /* p-5 */
--space-6:   24px;   /* p-6 — section spacing */
--space-8:   32px;   /* p-8 */
--space-10:  40px;   /* p-10 — hero spacing */
--space-12:  48px;   /* p-12 */
--space-16:  64px;   /* p-16 — page padding bottom */
```

### Spacing Rules

| Context | Value | Notes |
|---------|-------|-------|
| Page padding horizontal | 16px | Safe zone for content |
| Page padding bottom | 24px | Account for bottom nav |
| Card padding | 16-20px | Inner padding |
| Card gap (stack) | 12px | Between cards |
| Section gap | 24px | Between sections on page |
| Button padding horizontal | 24px | Comfortable tap area |
| Button padding vertical | 12px | — |
| Icon to text gap | 8px | — |
| List item gap | 12px | — |
| Modal padding | 20px | Inner padding |
| Bottom nav icon margin | 4px | Between icon and label |

---

## 8. Grid System

### Mobile Grid

```
Column: 4 columns (mobile base)
Gutter: 16px
Margin: 16px (kiri-kanan)
```

```css
--grid-columns: 4;
--grid-gutter: 16px;
--grid-margin: 16px;
--grid-max-width: 430px; /* Max width container */
```

### Layout Templates

| Layout | Columns | Usage |
|--------|---------|-------|
| Single card | 4/4 | Swipe card, battle arena |
| Two-column | 2/4 + 2/4 | Stats grid, mission pairs |
| 3/4 + 1/4 | 3/4 + 1/4 | Content + mascot side |
| Full width | 4/4 | Streak indicator, progress bar |

### Container Behavior

```css
.app-container {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding: 0 16px;
  min-height: 100dvh;
}
```

---

## 9. Radius System

### Border Radius Tokens

```css
--radius-none:    0px;
--radius-xs:      4px;
--radius-sm:      8px;
--radius-md:      12px;
--radius-lg:      16px;    /* Default card radius */
--radius-xl:      20px;
--radius-2xl:     24px;
--radius-3xl:     32px;
--radius-full:    9999px;  /* Pill, avatar */
```

### Radius by Component

| Component | Radius | Why |
|-----------|--------|-----|
| Card (default) | 16px | Premium feel, not too sharp |
| Card (small) | 12px | Mission card, badge card |
| Button (default) | 12px | Playful but not childish |
| Button (pill) | 9999px | Special CTA |
| Input field | 12px | Consistent with buttons |
| Modal | 20px (top) | Sheet-style bottom modal |
| Toast | 12px | Compact notification |
| Badge | 6px | Small element |
| Avatar | 9999px | Circular profile |
| Progress bar | 9999px | Rounded track |
| Bottom nav | 20px (top-only) | Floating nav bar |

---

## 10. Shadow System

### Shadow Tokens

```css
--shadow-sm:   0 1px 2px rgba(0,0,0,0.3);
--shadow-md:   0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
--shadow-lg:   0 10px 15px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.2);
--shadow-xl:   0 20px 30px rgba(0,0,0,0.4);
--shadow-2xl:  0 30px 50px rgba(0,0,0,0.5);

--shadow-glow-emerald: 0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1);
--shadow-glow-gold:    0 0 20px rgba(250, 204, 21, 0.3), 0 0 40px rgba(250, 204, 21, 0.1);
--shadow-glow-combo:   0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.2);
--shadow-glow-xp:      0 0 20px rgba(16, 185, 129, 0.4);
--shadow-glow-streak:  0 0 25px rgba(249, 115, 22, 0.4);
--shadow-card:         0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
--shadow-bottom-nav:   0 -4px 30px rgba(0, 0, 0, 0.4);
```

### Shadow Usage by Component

| Component | Shadow | Notes |
|-----------|--------|-------|
| Card | `shadow-card` | Soft ambient shadow |
| Bottom nav | `shadow-bottom-nav` | Float above content |
| Modal | `shadow-2xl` | Highest elevation |
| Button (default) | `shadow-md` | Slight depth |
| Button (pressed) | `shadow-sm` | Pressed state |
| Floating XP | `shadow-glow-xp` | Glow feedback |
| Combo indicator | `shadow-glow-combo` | Golden glow |
| Streak fire | `shadow-glow-streak` | Warm glow |
| Toast | `shadow-lg` | Above cards |
| Elevated card | `shadow-xl` | Active/dragged state |

---

## 11. Iconography

### Icon Style

| Attribute | Standard |
|-----------|----------|
| **Style** | Outlined, consistent 2px stroke |
| **Weight** | Regular (line thickness 2px) |
| **Corner** | Rounded (stroke-linejoin: round) |
| **Size (default)** | 24x24px |
| **Size (small)** | 16x16px |
| **Size (large)** | 32x32px |
| **Color** | CurrentColor (inherit text color) |

### Icon Naming Convention

```
icon--{name}--{variant}
```

Example: `icon--heart--filled`, `icon--swipe--right`

### Icon Set

| Category | Icons |
|----------|-------|
| **Navigation** | home, swipe (gesture), battle (sword), progress (chart), profile |
| **Game** | xp (star), coin, streak (fire), combo (chain), battle, heal, damage, shield |
| **Feedback** | check, cross, info, warning, alert, help |
| **Social** | share, friends, invite, leaderboard, trophy |
| **Actions** | plus, minus, arrow-left, arrow-right, close, menu, settings, edit |
| **Audio** | speaker, speaker-off, waveform |
| **Status** | lock, unlock, crown, badge, rank, level |
| **Mascot** | mascot-happy, mascot-sad, mascot-excited |

### Technical Requirements

- Gunakan **SVG sprite** untuk performance
- Jangan gunakan icon font (font awesome dll)
- Setiap icon harus punya `viewBox="0 0 24 24"`
- Stroke width: 2px (default)
- `fill="none"` dan `stroke="currentColor"`

---

## 12. Illustration Style

### Style Guide

| Aspect | Detail |
|--------|--------|
| **Style** | Flat vector, modern, bold shapes |
| **Shading** | Simple gradient fills, no complex shading |
| **Lines** | Minimal to none — mostly shape-based |
| **Color** | Brand palette colors |
| **Characters** | Simplistic, geometric, expressive |
| **Backgrounds** | Abstract shapes, blobs, gradient meshes |
| **Tone** | Playful, not childish |

### Illustration Usage

| Context | Type | Example |
|---------|------|---------|
| **Onboarding** | Character + scene | Mascot with Arabic letters |
| **Empty states** | Single illustration | Empty book, no battles yet |
| **Error states** | Mascot sad | Burhan crying, "Yah, error!" |
| **Achievement** | Trophy/star | Badge unlock illustration |
| **Loading** | Mascot animation | Burhan terbang muter |

---

## 13. Mascot Design Rules

### Burhan — Design Specs

| Attribute | Detail |
|-----------|--------|
| **Name** | Burhan |
| **Species** | Burung kecil (lovebird-style) |
| **Body Shape** | Round, chubby, cute |
| **Colors** | Tosca (#2DD4BF) + Gold (#FACC15) + Cream (#FEFCE8) |
| **Eyes** | Large, circular, black with white highlight |
| **Beak** | Small, orange, triangular |
| **Wings** | Small, rounded |
| **Size in UI** | 40-60px (small) / 80-120px (large) |

### Expression Set

```
HAPPY     :D   — Eyes closed, beak open (smile)
SAD       :(   — Eyes down, teardrop
EXCITED   ☆D   — Star eyes, beak wide
SLEEPY    —    — Eyes half-closed, Zzz
PROUD     >D   — Chest out, wings up
CONFUSED  o.O  — One eye squint, head tilt
ANGRY     >.<  — Eyebrows furrowed (cute)
SURPRISED O_O  — Eyes wide, beak small circle
LOVE      ♥_♥  — Heart eyes
COOL      B)   — Sunglasses (cosmetic)
LAZY      ~_~  — Flat lie down
STARSTRUCK *O* — Sparkle eyes
```

### Animation Rules

| Ekspresi | Animation | Duration | Easing |
|----------|-----------|----------|--------|
| Idle | Gentle float up-down | 3s loop | ease-in-out |
| Blink | Quick close-open | 150ms | ease-out |
| Happy | Bounce up + wing flap | 400ms | spring |
| Excited | Spin + scale up | 600ms | spring |
| Sad | Shrink + wobble | 500ms | ease-out |
| React to swipe | Turn head + expression change | 200ms | ease-out |
| React to combo | Jump + sparkle | 300ms | spring |

### Implementation

```typescript
// Mascot component
interface MascotProps {
  expression: 'happy' | 'sad' | 'excited' | 'idle' | 'proud' | 'confused';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}
```

---

## 14. Motion Design Principles

### Philosophy

> "Motion is not decoration. Motion is meaning."

| Principle | Description |
|-----------|-------------|
| **Purposeful** | Setiap animasi harus memiliki fungsi: feedback, orientasi, atau delight |
| **Fast** | Animasi harus cepat (<300ms untuk feedback, <500ms untuk transisi) |
| **Natural** | Spring physics for organic feel — jangan linear easing |
| **Subtle** | Jika user tidak sadar ada animasi, itu bagus. Jika user terganggu, terlalu banyak. |
| **Consistent** | Semua animasi dalam satu "bahasa" — easing, duration, physics yang sama |

### Performance Rules

- Hanya animasi `transform` dan `opacity` — jangan animasi `height`, `width`, `top`, `left`
- `will-change: transform` untuk elemen yang bergerak (card swipe)
- `transform: translateZ(0)` untuk GPU acceleration
- Framer Motion `layoutId` untuk shared layout animation
- Jika device low-end / battery saver: kurangi particle effect 50%

---

## 15. Animation Timing

### Spring Configs

```typescript
// Framer Motion spring presets

const spring = {
  snappy:     { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
  bouncy:     { type: 'spring', stiffness: 200, damping: 15, mass: 0.5 },
  gentle:     { type: 'spring', stiffness: 150, damping: 20, mass: 1 },
  smooth:     { type: 'spring', stiffness: 100, damping: 20, mass: 1 },
  wobbly:     { type: 'spring', stiffness: 80,  damping: 10, mass: 1 },
};

const tween = {
  fast:       { duration: 0.15, ease: 'easeOut' },
  normal:     { duration: 0.25, ease: 'easeOut' },
  slow:       { duration: 0.4,  ease: 'easeOut' },
  expressive: { duration: 0.6,  ease: [0.34, 1.56, 0.64, 1] }, // Custom overshoot
};
```

### Animation Timing Reference

| Element | Type | Config | Duration |
|---------|------|--------|----------|
| Button press (scale 0.95) | Spring | snappy | 100ms |
| Button release (scale 1) | Spring | snappy | 200ms |
| Card swipe follow finger | — | — | Real-time |
| Card dismiss (swipe out) | Spring | snappy | 300-500ms |
| Card enter (next card) | Spring | gentle | 350ms |
| XP float up + fade | Tween | expressive | 800ms |
| XP shower (multiple numbers) | Staggered | snappy | 1000ms |
| Combo counter update | Spring | bouncy | 300ms |
| Combo glow pulse | Tween | — | 1s loop |
| Battle hit (screen shake) | Tween | fast | 200ms |
| Battle damage (HP bar) | Tween | normal | 300ms |
| Battle enemy hurt flash | Tween | fast | 100ms |
| Level up celebration | Staggered | bouncy | 1500ms |
| Streak fire particle | Tween | — | Loop |
| Page transition (slide) | Tween | normal | 250ms |
| Bottom nav indicator | Spring | snappy | 200ms |
| Modal enter | Spring | gentle | 300ms |
| Modal exit | Tween | fast | 150ms |
| Toast enter | Spring | snappy | 250ms |
| Toast exit | Tween | normal | 200ms |
| Mascot idle float | Tween | — | 3s loop |
| Mascot react | Spring | wobbly | 300-500ms |
| Skeleton pulse | Tween | — | 1.5s loop |
| Progress bar fill | Tween | normal | 400ms |
| Floating element | Tween | — | 2s loop |

---

## 16. Component States

### State System

Setiap komponen interaktif harus memiliki state berikut:

```
┌────────────────────────────────────────────────────┐
│  Component States                                   │
│                                                     │
│  Default     → idle, visible, enabled              │
│  Hover       → subtle scale/color change           │
│  Active/Press → scale down, color deepen           │
│  Focus       → visible focus ring (accessibility)  │
│  Disabled    → opacity 0.4, no pointer events      │
│  Loading     → skeleton / spinner                  │
│  Error       → red border/icon + message           │
│  Success     → green flash/icon + message          │
│  Empty       → illustration + text                 │
│  Animating   → transition state                    │
└────────────────────────────────────────────────────┘
```

### Visual State Examples

**Button States**
```
Default:   bg-emerald-500 shadow-md
Hover:     bg-emerald-400 shadow-lg (scale: 1.02)
Active:    bg-emerald-600 shadow-sm (scale: 0.95)
Disabled:  bg-emerald-500/40 opacity-40 cursor-not-allowed
Loading:   show spinner, text hidden
```

**Card States**
```
Default:   bg-[#1A2332] shadow-card border border-white/5
Press:     scale 0.98, border-white/10, shadow-md
Active:    border-emerald-500/30 shadow-glow-emerald
Disabled:  opacity-50, no pointer events
Loading:   skeleton (pulse animation)
```

---

## 17. Haptic-style Feedback Patterns

Karena web tidak punya akses ke Taptic Engine, kita buat **visual haptic feedback** yang memberikan sensasi serupa.

### Visual Haptic Patterns

| Interaction | Visual Feedback | CSS |
|-------------|-----------------|-----|
| **Tap button** | Scale 0.95 → 1.0 | `transform: scale(0.95)` + spring back |
| **Swipe threshold** | Card "snap" + brief glow | `border-color` flash + box-shadow pulse |
| **Wrong answer** | Screen shake horizontal | `transform: translateX(-4px) translateX(4px)` x3 |
| **Correct answer** | Green flash + scale bounce | `backgroundColor` flash + `transform: scale(1.05)` |
| **XP earned** | Number float up + fade | `translateY(-40px)` + `opacity: 0` |
| **Combo increase** | Pulse + glow gold | `transform: scale(1.2)` + `box-shadow` glow |
| **Damage taken** | Red flash + slight shake | `filter: brightness(1.5) hue-rotate` + shake |
| **Heal** | Green pulse | `transform: scale(1.1)` ease-out |
| **Streak fire** | Subtle wiggle | `rotate: -5deg` / `5deg` loop |

### Implementation

```css
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
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-40px); opacity: 0; }
}
```

---

## 18. Mobile Interaction Rules

### Thumb Zone Map

```
 ┌──────────────────┐
 │ ⭐  🔥  [XP]    │  TOP — Info saja, jarang di-tap
 │                  │
 │                  │
 │     ┌──────┐    │
 │     │ CARD │    │  MID — Swipe, konten
 │     └──────┘    │
 │                  │
 │  [BTN]   [BTN]  │  BOTTOM — Zona utama interaksi
 │                  │
 │ [🏠][👆][⚔️][📊] │  NAV — Jangkauan thumb paling mudah
 └──────────────────┘
```

### Touch Target Guidelines

| Element | Minimum Size | Ideal Size |
|---------|-------------|------------|
| Bottom nav tab | 48x48dp | 56x56dp |
| Button | 44x44dp | 48x48dp |
| Icon button | 40x40dp | 44x44dp |
| Swipe card | Full width | Full width |
| Close button | 32x32dp | 40x40dp |
| Checkbox/Radio | 24x24dp | 28x28dp |
| Slider handle | 28x28dp | 32x32dp |

### Gesture Rules

| Gesture | Action | Sensitivity |
|---------|--------|-------------|
| **Swipe right** | "Tahu" | 30% card width |
| **Swipe left** | "Tidak tahu" | 30% card width |
| **Tap** | Select / next / action | — |
| **Long press** | (Future: detail word info) | 500ms |
| **Pinch** | — | Not used (avoid) |
| **Pull down** | Refresh | Standard |

### Anti-accidental-touch

- 200ms debounce on battle answer buttons
- Swipe-only zone (card area) vs tap-only zone (buttons)
- No swipe-to-go-back on Android (conflict with card swipe)
- Bottom nav "confirmation" on destructive actions

---

## 19. Navigation System

### Navigation Architecture

```
                   ┌─────────────┐
                   │   HOME      │
                   │  (Beranda)  │
                   └──────┬──────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  SWIPE   │    │  BATTLE  │    │ PROGRESS │
   │ (Belajar)│    │ (Battle) │    │  (Stats) │
   └──────────┘    └──────────┘    └──────────┘
                                          │
                                          ▼
                                   ┌──────────┐
                                   │  SOCIAL   │
                                   │           │
                                   └──────────┘
```

### Navigation Rules

- **Bottom navigation** adalah primary navigation
- **5 tabs max** — sesuai kapasitas cognitive user
- **No nested navigation** dalam tab (setiap tab adalah page sendiri)
- **Modal / sheet** untuk secondary action (reward claim, settings, etc.)
- **Back button** via gesture (swipe right) atau explicit back button di header

---

## 20. Bottom Navigation Design

### Visual Design

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                                                  │
│                                                  │
│                                                  │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │   🏠       👆        ⚔️        📊        │    │  ← Glassmorphic bar
│  │ Beranda  Belajar   Battle   Progress      │    │
│  │   ●                                          │    │  ← Active indicator
│  └──────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Specs

| Attribute | Value |
|-----------|-------|
| **Height** | 64px (safe area bottom included) |
| **Background** | `bg-[#111827]/80 backdrop-blur-xl` |
| **Border top** | `border-t border-white/5` |
| **Shadow** | `shadow-bottom-nav` |
| **Border radius** | `rounded-t-2xl` (top-only) |
| **Position** | `fixed bottom-0` |
| **Z-index** | `z-50` |
| **Icons** | 24x24px, outlined, 2px stroke |
| **Label** | 11px, font-semibold, tracking-wide |
| **Active color** | `text-emerald-400` |
| **Inactive color** | `text-[#64748B]` |
| **Active indicator** | 4px dot above icon, `bg-emerald-400`, `rounded-full` |

### Tab States

```
Active Tab:
  Icon:   text-emerald-400 (with subtle glow)
  Label:  text-emerald-400, font-semibold
  Dot:    visible, 4px, rounded-full, bg-emerald-400

Inactive Tab:
  Icon:   text-[#64748B]
  Label:  text-[#64748B], font-medium

Disabled Tab:
  Icon:   text-[#475569], opacity-60
  Label:  text-[#475569]
  Badge:  (Optional: "Soon" text / lock icon)
```

### Implementation Notes

- Padding bottom: `pb-[env(safe-area-inset-bottom)]` untuk notched devices
- Content padding bottom harus > nav height: `pb-20`
- Gunakan `position: fixed` + `z-50`
- Tab switching via Zustand store + router.push

---

## 21. Card Design System

### Base Card

```css
.card {
  background: #1A2332;       /* bg-[#1A2332] */
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;        /* rounded-2xl */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 16px;
}
```

### Card Variants

| Variant | Usage | Difference |
|---------|-------|------------|
| `card--default` | Generic container | Base styles |
| `card--elevated` | Swipe card, battle card | Larger shadow, slight scale |
| `card--compact` | Mission card, badge | Smaller padding (12px) |
| `card--glow` | Active/selected state | Emerald border glow |
| `card--pressable` | Touchable card | Hover/active scale states |
| `card--gradient` | Special cards | Gradient background |

### Swipe Card (Vocabulary Card)

```
┌─────────────────────────────┐
│                             │
│         🔥 x5 COMBO         │  (Top-right, gold glow)
│                             │
│                             │
│       ┌─────────────┐       │
│       │   كِتَاب     │       │  (Arabic XL — 48px, gold/cream)
│       └─────────────┘       │
│                             │
│     ┌───┐                   │
│     │ 🔊 │                  │  (Audio — circular, emerald)
│     └───┘                   │
│                             │
│   ┌──────────┐  ┌────────┐  │
│   │  ✕ Tidak │  │  ✓ Ya  │  │  (Hint buttons)
│   └──────────┘  └────────┘  │
│                             │
│   ▓▓▓▓░░░░░░░░░ 3/10       │  (Progress bar)
└─────────────────────────────┘

Width:   100% (full page width minus padding)
Height:  ~400px (dynamic, min 320px)
Radius:  20px
Shadow:  shadow-card
```

### Battle Card

```
┌──────────────────────────────┐
│                              │
│  ⏱️ 0:08                     │  (Timer, top-right)
│                              │
│  ┌────────────────────────┐  │
│  │       كِتَاب            │  │  (Arabic L — 36px)
│  └────────────────────────┘  │
│                              │
│  "Apa arti kata di atas?"    │  (Question, body-16)
│                              │
│  ┌──────────────────────┐    │
│  │  A. Meja              │    │  (Answer option, pressable)
│  ├──────────────────────┤    │
│  │  B. Buku  ← correct   │    │  (Green highlight if correct)
│  ├──────────────────────┤    │
│  │  C. Kursi             │    │
│  ├──────────────────────┤    │
│  │  D. Pulpen            │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

---

## 22. Button System

### Button Variants

```css
/* Primary */
.btn-primary {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #FEFCE8;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.btn-primary:hover {
  background: linear-gradient(135deg, #34D399, #10B981);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
}
.btn-primary:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

/* Secondary */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FEFCE8;
}
.btn-secondary:active {
  background: rgba(255, 255, 255, 0.1);
}

/* Ghost */
.btn-ghost {
  color: #94A3B8;
}
.btn-ghost:active {
  color: #FEFCE8;
  background: rgba(255, 255, 255, 0.05);
}

/* Gold (special) */
.btn-gold {
  background: linear-gradient(135deg, #FACC15, #EAB308);
  color: #0A0F1E;
  box-shadow: 0 4px 12px rgba(250, 204, 21, 0.3);
}

/* Danger */
.btn-danger {
  background: #EF4444;
  color: white;
}
```

### Button Sizes

| Size | Height | Padding X | Font | Icon Size |
|------|--------|-----------|------|-----------|
| `sm` | 36px | 16px | 14px | 16px |
| `md` | 44px | 20px | 16px | 20px |
| `lg` | 52px | 24px | 18px | 24px |
| `xl` | 60px | 32px | 20px | 28px |

### Button States Implementation

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger';
  size: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

### Animation

```typescript
// Framer Motion variants
const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.95 },
};
```

---

## 23. Input Fields

### Text Input

```css
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #FEFCE8;
  font-size: 16px;
  line-height: 1.5;
  transition: border-color 200ms ease;
}
.input:focus {
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  outline: none;
}
.input::placeholder {
  color: #64748B;
}
.input--error {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}
```

### Input Types in Harf

| Input Type | Usage | Keyboard |
|------------|-------|----------|
| Text (username) | Registration | Standard |
| Email | Auth | Email keyboard |
| Password | Auth | Secure |
| Search | Friend search | Standard |

**Note:** Harf meminimalkan input teks — prefer gesture, tap, dan swipe.

---

## 24. Progress Bars

### XP Bar

```
┌──────────────────────────────────────────┐
│                                         │
│  Level 7                    3,450/5,000 │
│                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░  69%        │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔       │
│  🟢████████████████░░░░░░░░            │
│                                         │
│  ┌──────────────────────────────┐       │
│  │  1,550 XP menuju rank naik!  │       │
│  └──────────────────────────────┘       │
└──────────────────────────────────────────┘
```

| Attribute | Value |
|-----------|-------|
| **Height** | 12px (track), 10px (fill) |
| **Track color** | `rgba(255,255,255,0.08)` |
| **Fill color** | `bg-emerald-500` with `bg-gradient-to-r from-emerald-500 to-emerald-400` |
| **Border radius** | `rounded-full` |
| **Animation** | Width transition 400ms ease-out |
| **Label** | Above bar, `text-xs` |

### HP Bar (Battle)

```
┌──────────────────────────────────────────┐
│  🛡️ Rizky                 70/100      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  70%   │
│  🟢█████████████████████░░░░░          │
│                                         │
│  👹 AI Musafir             40/100      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  40%     │
│  🔴████████████░░░░░░░░░░░░░░          │
└──────────────────────────────────────────┘
```

| HP Bar | Color | Flash |
|--------|-------|-------|
| Player HP | Emerald (fill) | Green pulse on heal |
| Enemy HP | Red (fill) → Orange at <30% | Red flash on hit |
| Low HP warning (<20%) | Pulse animation | — |

### Streak Bar

```
🔥 Hari ke-7
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  7/14 menuju Blaze!
🟡█████████████████░░░░░
```

- Track: `bg-white/5`
- Fill: `bg-gradient-to-r from-amber-500 to-orange-500`
- Berserta flame icon + animal glow

---

## 25. XP Feedback Components

### Floating XP

```
           +10 XP 🟢
            (Floating up, fade out)

     +15 XP
        ↙     ↗  +20 XP
    +COMBO x3! 🟡

           LEVEL UP! 🎉
      (Full screen celebration)
```

### Implementation

```typescript
// Floating XP component
interface FloatingXPProps {
  amount: number;
  type: 'normal' | 'combo' | 'bonus' | 'streak';
  position: { x: number; y: number };
}

// Animation
const xpVariants = {
  initial: { y: 0, opacity: 1, scale: 0.5 },
  animate: { y: -60, opacity: 0, scale: 1.2 },
  transition: { duration: 0.8, ease: 'easeOut' },
};
```

### XP Shower (Multiple At Once)

```
     +10   +15   +10   +20   +50
      ↙     ↓     ↓     ↓     ↘
         +COMBO x4!   +STREAK!
```

- Every correct swipe spawns XP float
- Staggered animation (each 100ms delay)
- Combo bonus appears as golden XP
- Streak bonus has fire icon prefix

### Level Up Screen

```
┌─────────────────────────────────────┐
│                                     │
│            🎉 LEVEL UP!            │
│                                     │
│              Level 8                │
│                                     │
│    ┌────────────────────────┐       │
│    │  +500 XP Bonus Level!  │       │
│    └────────────────────────┘       │
│                                     │
│    🔓 Fitur baru: Battle Hard     │
│                                     │
│       [ Lanjut Belajar ]            │
│                                     │
└─────────────────────────────────────┘
```

| Element | Animation | Duration |
|---------|-----------|----------|
| Background | Scale fade in | 200ms |
| "LEVEL UP!" | Scale bounce (0 → 1.2 → 1) | 500ms spring |
| Level number | Count up animation | 600ms |
| Reward text | Slide up + fade | 400ms (staggered) |
| Particle effect | Burst from center | 1.5s |
| Mascot | Jump + sparkle | 600ms |

---

## 26. Combo UI

### Combo Indicator

```
Location: Top-right of swipe card / battle screen

┌─────────┐
│  🔥 x5  │  ← Gold glow, scale bounce on increment
│  COMBO  │
└─────────┘
```

| Combo | Color | Glow | Effect |
|-------|-------|------|--------|
| x2-x3 | Gold | Subtle | Text scale 1.2 |
| x4-x6 | Gold + Orange | Medium | Pulse + sparkle |
| x7-x9 | Orange + Red | Strong | Rapid pulse + trail |
| x10+ | Red + Purple | Intense | Screen edge glow + shake |

### Combo Display Rules

```
Combo 1:  Tidak tampil (masih normal)
Combo 2:  Muncul "🔥 x2 COMBO" small
Combo 3-4: Medium size, gold glow
Combo 5:  "🔥 x5 COMBO!" large + sparkle + sound effect
Combo 7+: Large, pulsing, screen edge glow
Combo 10: "🔥 x10 COMBO!!!" + brief screen shake + mascot excited
```

### Combo Break

```
"COMBO BROKEN!"  ← Red flash, scale down animation
🔥 (breaks into particles and fades)
```

---

## 27. Battle UI

### Battle Arena Layout

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌─── PLAYER ───────────────────────┐    │
│  │  🛡️ Rizky         70/100 ▓▓▓▓▓▓▓░░│    │
│  │  🔥 Combo x3 — +30% ATK           │    │
│  └────────────────────────────────────┘    │
│                                          │
│              VS                            │
│      (Animated VS text, 500ms)             │
│                                          │
│  ┌─── ENEMY ────────────────────────┐    │
│  │  👹 AI Musafir      40/100 ▓▓▓▓░░│    │
│  └────────────────────────────────────┘    │
│                                          │
│  ┌─── QUESTION ──────────────────────┐    │
│  │       كِتَاب                        │    │
│  │  "Apa arti kata di atas?"          │    │
│  ├────────────────────────────────────┤    │
│  │  [A] Meja    [B] Buku  ✓          │    │
│  │  [C] Kursi   [D] Pulpen           │    │
│  └────────────────────────────────────┘    │
│                                          │
│  ⏱️ ▓▓▓▓▓▓▓▓▓▓░░  7/10s               │
└──────────────────────────────────────────┘
```

### Battle States

| State | Visual | Behavior |
|-------|--------|----------|
| **Intro** | VS animation, enemy appear | 1s delay before first question |
| **Answering** | Timer ticking, options visible | User taps answer |
| **Correct** | Green flash on option, damage number on enemy | +combo |
| **Wrong** | Red flash, enemy attacks, player takes damage | Combo reset |
| **Enemy defeated** | Enemy death animation, victory countdown | → Result |
| **Player defeated** | Player faint animation, defeat screen | → Result |
| **Result** | XP earned, stats, buttons | Battle Lagi / Home |

### Hit Animation

```
On correct answer:
  - Option button: brief green bg flash
  - Damage number appears on enemy: "-15 ⚔️" (float up)
  - Enemy HP bar: decreases smoothly (300ms)
  - Enemy sprite: flash red + shake (100ms)
  - Screen: subtle shake (2px)

On wrong answer:
  - Option button: brief red bg flash
  - "SALAH!" text appears briefly
  - Player HP bar: decreases
  - Player sprite: flash red
  - Combo breaks with animation
```

### Battle Result Screen

```
┌──────────────────────────────────────┐
│                                      │
│           🎉 VICTORY! 🎉            │
│                                      │
│    ┌──────────────────────────┐      │
│    │  ⚔️ Damage: 85            │      │
│    │  🔥 Max Combo: x4        │      │
│    │  ✅ 8/10 Benar            │      │
│    └──────────────────────────┘      │
│                                      │
│    +250 XP          +50 Coin 🪙     │
│                                      │
│    ┌──────────────────────┐          │
│    │  🔄 Battle Lagi      │          │
│    └──────────────────────┘          │
│    ┌──────────────────────┐          │
│    │  🏠 Kembali           │          │
│    └──────────────────────┘          │
│                                      │
└──────────────────────────────────────┘
```

---

## 28. Streak UI

### Streak Indicator (Home Page)

```
┌──────────────────────────────────────┐
│                                      │
│  🔥🔥🔥🔥🔥🔥🔥                       │
│                                      │
│  Hari ke-7 — "Striker"               │
│                                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  7/14       │
│                                      │
│  2x XP Multiplier Aktif!             │
│                                      │
└──────────────────────────────────────┘
```

### Streak Visual Identity

| Streak Count | Visual | Effect |
|-------------|--------|--------|
| 0 (broken) | Gray ember, mascot sad | — |
| 1-2 | Small flame, no glow | Subtle |
| 3-6 | Medium flame, slight orange glow | Steady |
| 7-13 | Large flames, fire animation, gold glow | Particle |
| 14-29 | Big fire, red-orange glow, mascot with fire crown | Particle + shake |
| 30+ | Inferno, purple-red glow, mascot angel/devil wings | Full particle |

### Streak Danger State

```
⚠️  Streakmu dalam bahaya!

  Hari ini belum belajar.
  Cuma butuh 1 swipe untuk selamatkan streak!

  [ 🔥 Satu Swipe Aja ]
```

- Muncul jika user belum buka app hari ini
- Threshold: jam 20:00 (notifikasi)
- Warna: amber/warning
- Urgensi meningkat menjelang tengah malam

### Streak Lost State

```
💔  Streak putus di 7 hari...

  "Jangan sedih. Mulai lagi, yuk!"
  — Burhan

  🔄 Mulai Streak Baru

  Bonus: 2x XP untuk 3 hari pertama
```

---

## 29. Badge System

### Badge Design

```
┌─────────────┐
│             │
│      🔥     │  ← Emoji/icon sesuai badge
│             │
│  STRIKER    │  ← Badge name
│  7 Hari     │  ← Subtitle
│             │
└─────────────┘
  ^          ^
 Gold border  Glow effect (by rarity)
```

### Badge Rarity

| Rarity | Border | Glow | Background Gradient |
|--------|--------|------|---------------------|
| Common | Silver (#94A3B8) | None | `bg-white/5` |
| Rare | Gold (#FACC15) | `shadow-glow-gold` | `from-amber-900/20 to-transparent` |
| Epic | Purple (#A855F7) | Purple glow | `from-purple-900/20 to-transparent` |
| Legendary | Red (#EF4444) | Red + gold glow | `from-red-900/20 to-amber-900/20` |

### Badge States

```
Default:    Normal badge, colored border
Locked:     Grayscale, lock overlay, "???" text
New:        Pulse animation, "NEW!" badge overlay
Earned:     Brief celebration animation (first time)
```

---

## 30. Modal System

### Sheet Modal (Bottom)

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  ─── (handle bar)               │    │  ← 4px, rounded-full, centered
│  │                                  │    │
│  │  🎉 Selamat!                    │    │  ← Title
│  │                                  │    │
│  │  Kamu mendapatkan badge baru!   │    │  ← Content
│  │                                  │    │
│  │  ┌────────────────────────┐      │    │
│  │  │  🔥 STRIKER — 7 Hari   │      │    │  ← Badge display
│  │  └────────────────────────┘      │    │
│  │                                  │    │
│  │  ┌──────────────────────┐        │    │
│  │  │  🎉 Keren!            │        │    │  ← CTA button
│  │  └──────────────────────┘        │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  (Backdrop: bg-black/60 backdrop-blur-sm)│
└──────────────────────────────────────────┘
```

### Modal Specs

| Attribute | Sheet | Alert | Full |
|-----------|-------|-------|------|
| **Position** | Bottom | Center | Full screen |
| **Border radius** | `rounded-t-3xl` (20px top) | `rounded-2xl` | `rounded-none` |
| **Backdrop** | `backdrop-blur-sm` | `backdrop-blur-md` | `backdrop-blur-lg` |
| **Animation in** | Slide up (300ms spring) | Scale + fade (250ms) | Fade (200ms) |
| **Animation out** | Slide down (200ms tween) | Scale + fade (150ms) | Fade (100ms) |
| **Dismiss** | Swipe down / backdrop tap | Backdrop tap | Close button |
| **Content padding** | 24px top, 20px side/bottom | 24px | 24px |
| **Max width** | 430px | 340px | 100% |
| **Z-index** | `z-40` | `z-40` | `z-40` |

### Modal Types

| Type | Use Case |
|------|----------|
| **RewardSheet** | Badge earned, level up reward, mission complete |
| **ConfirmSheet** | "Yakin ingin reset streak?" |
| **InfoSheet** | Word detail, rank info |
| **ShareSheet** | Share card options |
| **SettingsModal** | Profile settings, audio settings |

---

## 31. Toast Notification Style

### Toast Design

```
┌──────────────────────────────────┐
│  ✅  Berhasil! +50 XP           │  (Success — emerald)
├──────────────────────────────────┤
│                                  │
┌──────────────────────────────────┐
│  ⚠️  Streakmu dalam bahaya!     │  (Warning — amber)
├──────────────────────────────────┤
│                                  │
┌──────────────────────────────────┐
│  ❌  Jawaban salah!              │  (Error — red)
├──────────────────────────────────┤
│                                  │
┌──────────────────────────────────┐
│  ℹ️  Battle Hard telah terbuka  │  (Info — blue)
└──────────────────────────────────┘
```

### Toast Specs

| Attribute | Value |
|-----------|-------|
| **Position** | Top (below status bar, 60px from top) |
| **Width** | `calc(100% - 32px)` with 16px margin |
| **Max width** | 400px |
| **Padding** | 12px 16px |
| **Border radius** | 12px |
| **Background** | `bg-[#1A2332]/90 backdrop-blur-lg` |
| **Border** | Left border 4px (color by type) |
| **Shadow** | `shadow-lg` |
| **Icon** | 20px, left of text |
| **Text** | 14px, medium |
| **Duration** | 3s (auto-dismiss) |
| **Animation in** | Slide down from top (250ms spring) |
| **Animation out** | Slide up + fade (200ms tween) |

### Toast Variants

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'xp';
  message: string;
  duration?: number; // default 3000ms
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## 32. Loading Skeletons

### Skeleton Components

```
Card Skeleton:
┌──────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │  (pulse animation)
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │
│                              │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
│  ▓▓▓▓▓▓▓▓▓▓                  │
└──────────────────────────────┘

List Skeleton:
┌──────────────────────────────┐
│  ● ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
│  ● ▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │
│  ● ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
└──────────────────────────────┘
```

### Skeleton Specs

| Attribute | Value |
|-----------|-------|
| **Base color** | `bg-[#1E293B]` |
| **Highlight** | `bg-[#334155]` |
| **Animation** | Pulse (opacity 1 → 0.4 → 1) |
| **Duration** | 1.5s loop |
| **Border radius** | Same as parent component |

### Page Loading State

Silakan gunakan `loading.tsx` dari Next.js App Router.

```typescript
// loading.tsx — auto-generated by Next.js
export default function Loading() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-8 bg-[#334155] rounded-lg w-1/3" />
      <div className="h-64 bg-[#334155] rounded-2xl" />
      <div className="space-y-3">
        <div className="h-16 bg-[#334155] rounded-xl" />
        <div className="h-16 bg-[#334155] rounded-xl" />
        <div className="h-16 bg-[#334155] rounded-xl" />
      </div>
    </div>
  );
}
```

---

## 33. Empty States

### Empty State Design

```
┌──────────────────────────────────────┐
│                                      │
│           🐦 (Mascot sedih)          │  ← 80px mascot
│                                      │
│      "Belum ada data nih!"           │  ← Title (H3)
│                                      │
│  Mulai belajar untuk melihat         │  ← Body
│  progress kamu di sini.             │
│                                      │
│  ┌──────────────────────────┐        │
│  │  🎯 Mulai Belajar        │        │  ← CTA button
│  └──────────────────────────┘        │
│                                      │
└──────────────────────────────────────┘
```

### Empty State Types

| State | Mascot Expression | Title | Body | CTA |
|-------|-------------------|-------|------|-----|
| **No battles yet** | Confused | "Belum ada battle" | "Coba battle pertama kamu!" | ⚔️ Battle Sekarang |
| **No words learned** | Sad | "Belum belajar" | "Swipe kartu pertama kamu" | 👆 Mulai Swipe |
| **No friends** | Lonely | "Sepi nih" | "Ajak teman belajar bareng!" | 📨 Ajak Teman |
| **No badges** | Sleepy | "Badge masih kosong" | "Main terus untuk dapet badge" | 🎮 Main Yuk |
| **Streak broken** | Crying | "Streak putus..." | "Ayo mulai lagi!" | 🔥 Mulai Streak |
| **Search no results** | Confused | "Tidak ditemukan" | "Coba kata kunci lain" | — |

---

## 34. Error States

### Error State Design

```
┌──────────────────────────────────────┐
│                                      │
│     ⚠️  (Warning icon, besar)         │
│                                      │
│      "Yah, ada error!"               │  ← Title
│                                      │
│  Koneksi internet kamu mungkin       │  ← Description
│  bermasalah. Coba lagi ya!           │
│                                      │
│  ┌──────────────────────────┐        │
│  │  🔄 Coba Lagi            │        │  ← Retry button
│  └──────────────────────────┘        │
│                                      │
└──────────────────────────────────────┘
```

### Error States by Context

| Context | Title | Description | Action |
|---------|-------|-------------|--------|
| **Network error** | "Koneksi terputus" | "Periksa koneksi internet kamu" | 🔄 Coba Lagi |
| **Auth error** | "Gagal masuk" | "Periksa email/password kamu" | 🔄 Coba Lagi |
| **Battle timeout** | "Waktu habis!" | "Jawab lebih cepat ya!" | 🔄 Battle Lagi |
| **Server error** | "Ada yang salah" | "Tim Harf sudah diberitahu" | 🔄 Coba Lagi |
| **Rate limit** | "Nafas dulu!" | "Terlalu cepat. Istirahat sebentar ya." | ⏱️ Tunggu |
| **Word not found** | "Kata tidak ditemukan" | "Coba kata lain" | 🔍 Cari |

---

## 35. Audio Interaction Feedback

### Audio Button

```
Default:
  ┌──────┐
  │  🔊  │  ← bg-white/5, border-white/10
  └──────┘

Playing:
  ┌──────┐
  │  ▶️  │  ← bg-emerald-500, glow, waveform animation
  │  ~~~ │
  └──────┘

Done:
  ┌──────┐
  │  ✅  │  ← bg-emerald-500/50 (brief, then back to default)
  └──────┘
```

### Waveform Animation

Saat audio diputar, tampilkan waveform visual:

```
┌──────────────────────┐
│  ╻ ┃ ╻ ┃ ╻ ┃ ╻ ┃   │  ← Animated bars, varying heights
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃   │     Random bar height animation
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃   │
└──────────────────────┘
```

```css
@keyframes waveform {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

.waveform-bar {
  animation: waveform 0.5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.1s);
}
```

### Audio Loading State

Jika audio belum siap / loading:
```
┌──────┐
│  ⏳  │  ← Spinner, disabled
└──────┘
```

---

## 36. Accessibility Rules

### Color Contrast

| Combination | Ratio | WCAG |
|-------------|-------|------|
| Emerald-500 (#10B981) on Dark-Navy (#0A0F1E) | 5.9:1 | AA ✅ |
| Gold-400 (#FACC15) on Dark-Navy (#0A0F1E) | 11.2:1 | AAA ✅ |
| Cream-50 (#FEFCE8) on Dark-Navy (#0A0F1E) | 15.3:1 | AAA ✅ |
| Text-Secondary (#94A3B8) on Dark-Navy (#0A0F1E) | 6.1:1 | AA ✅ |
| Error (#EF4444) on Dark-Navy (#0A0F1E) | 5.2:1 | AA ✅ |
| Emerald-500 on Cream-50 | 3.4:1 | ❌ For small text only |

### Focus Indicators

```css
/* Custom focus ring */
*:focus-visible {
  outline: 2px solid #FACC15;
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Screen Reader Support

| Element | ARIA |
|---------|------|
| Bottom nav | `role="navigation"`, `aria-label="Navigasi utama"` |
| Swipe card | `role="button"`, `aria-label="Kata: kitab. Geser kanan jika tahu"` |
| Battle options | `role="radio"`, `aria-checked` |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Mascot | `role="img"`, `aria-label="Burhan sedang tersenyum"` |
| Streak | `aria-label="Streak 7 hari"` |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 37. Dark Mode Rules

### Dark Mode as Default

```css
:root {
  color-scheme: dark;
}

/* Light mode override */
@media (prefers-color-scheme: light) {
  :root {
    color-scheme: light;
  }
}
```

### Dark Mode Color Mapping

```
CSS Variable        Dark Value           Light Value
──────────────────────────────────────────────────────
--bg-primary        #0A0F1E              #FAFAF9
--bg-surface        #111827              #FFFFFF
--bg-elevated       #1E293B              #F5F5F4
--bg-card           #1A2332              #FFFFFF
--text-primary      #FEFCE8              #1C1917
--text-secondary    #94A3B8              #57534E
--border-default    rgba(255,255,255,0.1) rgba(0,0,0,0.08)
```

### Dark Mode Specifics

- **Always default to dark** — ini adalah identity Harf
- Light mode adalah **opt-in** melalui settings
- Transisi dark ↔ light harus smooth (CSS transition 300ms on background/color)
- Safe area bottom untuk notched devices

---

## 38. Responsive Rules

### Breakpoints

```css
/* Mobile default (375px - 430px) — target utama */
/* Tablet (768px) — centered container */
/* Desktop (1024px+) — centered container with max-w-lg */

@media (min-width: 640px) {
  /* Scale up font sizes slightly */
  .app-container {
    max-width: 480px;
  }
}

@media (min-width: 768px) {
  .app-container {
    max-width: 480px;
  }
}

@media (min-width: 1024px) {
  .app-container {
    max-width: 480px;
  }
  /* Optional: add subtle background decoration on sides */
}
```

### Responsive Strategy

- **Mobile-first** — semua desain untuk 375px
- **Larger screens** — container max-w-lg centered
- **No layout shift** — konten tetap 1 column di semua ukuran
- **Typography** — scale up secara proporsional di layar besar
- **Touch targets** — tetap 48px minimum di semua ukuran

---

## 39. Arabic Typography Rules

### Font Selection

```css
--font-arabic: 'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif;
```

### Display Rules

| Rule | Reason |
|------|--------|
| Arabic font size 1.2x Latin equivalent | Arabic script lebih detail, perlu ruang |
| Letter-spacing: normal | Arabic letters connect (ligatures), spacing merusak |
| Line-height: 1.1 (Arabic) vs 1.5 (Latin) | Arabic lebih compact secara vertikal |
| Font-weight: 700 untuk display | Bold Arabic lebih readable di layar kecil |
| Text-align: center untuk card | Fokus ke kata, bukan orientasi bacaan |
| Direction: rtl | Arabic dibaca kanan ke kiri |
| `font-feature-settings: 'kern' 1` | Optimal kerning untuk Arabic |

### Implementation

```tsx
// Arabic Text Component
function ArabicText({ children, size = 'xl' }: Props) {
  return (
    <span
      dir="rtl"
      lang="ar"
      className={cn(
        'font-arabic leading-[1.1]',
        size === 'xl' && 'text-[48px] font-bold',
        size === 'lg' && 'text-[36px] font-semibold',
        size === 'md' && 'text-[24px] font-medium',
      )}
    >
      {children}
    </span>
  );
}
```

### Transliteration

Untuk user yang belum bisa membaca Arab, sediakan transliterasi Latin:

```
  كِتَاب
  "kitab" (transliterasi)
  "buku" (arti)
```

---

## 40. Micro-interaction Guidelines

### Definition

Micro-interactions adalah animasi kecil yang terjadi sebagai respons terhadap aksi user. Mereka adalah "bumbu" yang membuat Harf terasa premium.

### Micro-interaction Catalog

| Interaction | Trigger | Animation | Duration |
|-------------|---------|-----------|----------|
| **Button press** | Any button | scale(0.95) | 100ms |
| **Tab switch** | Bottom nav tap | Dot slide + icon color transition | 200ms |
| **Card appear** | Next card loads | Slide up from bottom + fade | 350ms |
| **XP increment** | Correct answer | Float +20px up + fade | 800ms |
| **Streak increment** | Daily login | Fire flare + count bounce | 300ms |
| **Combo increment** | Consecutive correct | Number scale (1→1.3→1) + glow | 200ms |
| **Mascot blink** | Random interval | 150ms eye close/open | 150ms |
| **Header scroll** | User scrolls down | Header shrink + shadow | 200ms |
| **Progress fill** | XP update | Width animate | 400ms |
| **Like/heart tap** | Social reaction | Scale 1→1.4→1 + color | 300ms |
| **Share complete** | Share action | Brief checkmark + "Tersalin!" | 1500ms |
| **Audio play** | Tap audio button | Waveform animate | While playing |
| **Battle hit** | Correct answer | Screen shake + damage num | 200ms |
| **Error shake** | Wrong input | Input shake L/R | 300ms |

### Rule of Micro-interactions

```
1. <100ms:  Immediate feedback (button press, hit)
2. 200-400ms: Transition feedback (card appear, XP)
3. 500-1500ms: Celebration feedback (level up, reward)
```

---

## 41. Screen Transition Guidelines

### Transition Types

| Transition | Direction | Duration | Easing | Usage |
|------------|-----------|----------|--------|-------|
| **Slide Left** | Content slides left | 250ms | ease-in-out | Tab navigation (next) |
| **Slide Right** | Content slides right | 250ms | ease-in-out | Tab navigation (prev) |
| **Slide Up** | Content from bottom | 300ms | spring gentle | Sheet modal |
| **Slide Down** | Content from top | 250ms | ease-out | Toast, notification |
| **Fade** | Opacity 0→1 | 200ms | ease-out | Modal backdrop |
| **Scale Fade** | Scale 0.95 + fade | 250ms | ease-out | Alert modal |
| **Swipe Dismiss** | Follow finger | Dynamic | spring snappy | Card swipe |

### Implementation

```typescript
// Page transition variants (Framer Motion)
const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

// AnimatePresence wrapper
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

---

## 42. Design Tokens

### Token Format

```typescript
// tokens.ts — Single source of truth

export const tokens = {
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
    brand: {
      emerald: {
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
      },
      gold: {
        300: '#FCD34D',
        400: '#FACC15',
        500: '#EAB308',
      },
    },
    feedback: {
      success: '#22C55E',
      error: '#EF4444',
      warning: '#F97316',
      info: '#3B82F6',
    },
    gradients: {
      hero: 'linear-gradient(135deg, #10B981, #047857)',
      streak: 'linear-gradient(135deg, #FACC15, #F97316)',
      battle: 'linear-gradient(135deg, #3B82F6, #7C3AED)',
      rankUp: 'linear-gradient(135deg, #34D399, #FACC15)',
    },
  },

  spacing: {
    page: 16,
    section: 24,
    card: 16,
    gutter: 16,
  },

  radius: {
    card: 16,
    button: 12,
    modal: 20,
    pill: 9999,
    input: 12,
    badge: 6,
  },

  animation: {
    spring: {
      snappy: { type: 'spring', stiffness: 300, damping: 25, mass: 0.5 },
      gentle: { type: 'spring', stiffness: 150, damping: 20, mass: 1 },
      bouncy: { type: 'spring', stiffness: 200, damping: 15, mass: 0.5 },
    },
    tween: {
      fast: { duration: 0.15, ease: 'easeOut' },
      normal: { duration: 0.25, ease: 'easeOut' },
      slow: { duration: 0.4, ease: 'easeOut' },
    },
    duration: {
      press: 100,
      transition: 250,
      feedback: 300,
      celebration: 1500,
    },
  },

  typography: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      arabic: "'Noto Naskh Arabic', 'Amiri', serif",
    },
    fontSize: {
      arabicXL: '48px',
      arabicL: '36px',
      display1: '28px',
      display2: '24px',
      heading1: '20px',
      heading2: '18px',
      body: '16px',
      small: '14px',
      label: '13px',
      micro: '12px',
    },
    fontWeight: {
      bold: 700,
      semibold: 600,
      medium: 500,
      regular: 400,
    },
  },

  shadow: {
    card: '0 8px 32px rgba(0,0,0,0.3)',
    bottomNav: '0 -4px 30px rgba(0,0,0,0.4)',
    glowEmerald: '0 0 20px rgba(16,185,129,0.3)',
    glowGold: '0 0 20px rgba(250,204,21,0.3)',
    glowCombo: '0 0 30px rgba(250,204,21,0.5)',
  },
} as const;
```

---

## 43. Tailwind Mapping

### Custom Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background
        'bg-primary': '#0A0F1E',
        'bg-surface': '#111827',
        'bg-elevated': '#1E293B',
        'bg-card': '#1A2332',

        // Text
        'text-primary': '#FEFCE8',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#64748B',
        'text-disabled': '#475569',

        // Brand
        emerald: {
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        gold: {
          300: '#FCD34D',
          400: '#FACC15',
          500: '#EAB308',
        },

        // Feedback
        'feedback-success': '#22C55E',
        'feedback-error': '#EF4444',
        'feedback-warning': '#F97316',
        'feedback-info': '#3B82F6',
      },

      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'Amiri', 'serif'],
      },

      fontSize: {
        'arabic-xl': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'arabic-lg': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'arabic-md': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'display-1': ['28px', { lineHeight: '1.2', fontWeight: '800' }],
        'display-2': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-1': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-2': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
      },

      borderRadius: {
        'card': '16px',
        'button': '12px',
        'modal': '20px',
      },

      boxShadow: {
        'card': '0 8px 32px rgba(0,0,0,0.3)',
        'bottom-nav': '0 -4px 30px rgba(0,0,0,0.4)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.3)',
        'glow-gold': '0 0 20px rgba(250,204,21,0.3)',
        'glow-combo': '0 0 30px rgba(250,204,21,0.5)',
      },

      backdropBlur: {
        'glass': '20px',
      },

      maxWidth: {
        'app': '430px',
      },

      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'xp-float': 'xpFloat 0.8s ease-out forwards',
        'combo-pulse': 'comboPulse 1s ease-in-out infinite',
        'waveform': 'waveform 0.5s ease-in-out infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'streak-fire': 'streakFire 2s ease-in-out infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '50%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
        },
        xpFloat: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
        comboPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        streakFire: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 44. Component Naming Convention

### Convention

```
{Category}{Name}{Variant?}
```

Examples:
- `ButtonPrimary`
- `CardSwipe`
- `ModalReward`
- `ProgressBarXP`
- `ToastSuccess`

### Naming Rules

| Rule | Example | Instead Of |
|------|---------|------------|
| PascalCase for components | `SwipeCard` | `swipe-card` |
| Descriptive, not generic | `BattleArena` | `GameSection` |
| Variant at the end | `ButtonPrimary` | `PrimaryButton` |
| Group by folder | `swipe/SwipeCard` | `components/SwipeCard` |
| Boolean prop: `is*`/`has*` | `isLoading` | `loading` |
| Event handler: `on*` | `onSwipeComplete` | `swipeDone` |

### Component Library Structure

```
components/
├── ui/          # Generic reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ProgressBar.tsx
│
├── swipe/       # Swipe-specific
│   ├── SwipeCard.tsx
│   ├── SwipeStack.tsx
│   └── ComboIndicator.tsx
│
├── battle/      # Battle-specific
│   ├── BattleArena.tsx
│   ├── HpBar.tsx
│   ├── EnemySprite.tsx
│   └── BattleResult.tsx
│
├── home/        # Home page
│   ├── StreakIndicator.tsx
│   ├── XPBar.tsx
│   ├── DailyMissionCard.tsx
│   └── MascotReaction.tsx
│
├── progress/    # Progress page
│   ├── RankDisplay.tsx
│   ├── StatsGrid.tsx
│   └── BadgeGrid.tsx
│
├── social/      # Social page
│   ├── LeaderboardCard.tsx
│   ├── FriendActivity.tsx
│   └── InviteCard.tsx
│
└── shared/      # Shared across features
    ├── Mascot.tsx
    ├── ParticleEffect.tsx
    ├── ShareCard.tsx
    └── FloatingXP.tsx
```

---

## 45. UI Consistency Rules

### Golden Rules

| # | Rule | Rationale |
|---|------|-----------|
| 1 | **Hanya gunakan warna dari palette** | Tidak ada hex stray — semua dari token |
| 2 | **Spacing harus dari scale (4px base)** | Tidak ada margin/padding random |
| 3 | **Font size dari type scale saja** | Tidak ada font size random |
| 4 | **Semua interactive element punya pressed state** | Feedback konsisten |
| 5 | **Card border-radius = 16px** | Kecuali ada variant explicit |
| 6 | **Button border-radius = 12px** | Konsisten di semua button |
| 7 | **Animasi hanya transform + opacity** | Performance |
| 8 | **Bottom nav fixed, 5 tabs** | Tidak boleh kurang/lebih |
| 9 | **Arabic text 1.2x Latin size** | Readability |
| 10 | **Dark mode default, light optional** | Brand identity |

### Design Review Checklist

Setiap komponen/fitur sebelum diimplementasi harus dicek:

- [ ] Menggunakan design token (warna, spacing, radius)?
- [ ] Mobile-first (375px)?
- [ ] Thumb-friendly (interaksi di zone bawah)?
- [ ] Touch target ≥48x48dp?
- [ ] Punya semua state (default, hover, active, disabled)?
- [ ] Animasi menggunakan Framer Motion spring?
- [ ] Arabic text menggunakan font Arabic?
- [ ] Dark mode compatible?
- [ ] Loading state ada?
- [ ] Error state ada?
- [ ] Empty state ada?

### File Structure Check

Setiap komponen harus memiliki:

```
ComponentName/
├── ComponentName.tsx    # Main component
├── ComponentName.test.tsx  # Tests (future)
└── index.ts             # Re-export
```

Atau untuk komponen kecil: flat file di folder components.

---

## Appendix

### A. Quick Reference — Color Usage by Component

| Component | BG | Text | Border | Accent |
|-----------|-----|------|--------|--------|
| Page BG | `bg-bg-primary` | — | — | — |
| Card | `bg-bg-card` | `text-text-primary` | `border-white/5` | — |
| Bottom Nav | `bg-bg-surface/80 backdrop-blur-xl` | `text-text-tertiary` | `border-t border-white/5` | `text-emerald-400` (active) |
| Button Primary | `bg-emerald-500` | `text-text-primary` | — | Glow |
| Button Secondary | `bg-white/5` | `text-text-primary` | `border border-white/10` | — |
| XP Bar | `bg-white/5` (track) | — | — | `bg-emerald-500` (fill) |
| HP Bar | `bg-white/5` (track) | — | — | `bg-emerald-500` (player) / `bg-red-500` (enemy) |
| Streak | — | `text-gold-400` | — | Gold glow |
| Combo | — | `text-gold-400` | — | Gold glow |
| Modal | `bg-bg-elevated` | `text-text-primary` | — | — |
| Toast | `bg-bg-card/90 backdrop-blur-lg` | `text-text-primary` | Left border 4px | By type |
| Input | `bg-white/5` | `text-text-primary` | `border border-white/10` | `border-emerald-500` on focus |
| Badge | Gradient by rarity | `text-text-primary` | Gold border (rare+) | Glow by rarity |

### B. Quick Reference — Spacing

```tsx
// Common spacing patterns
<div className="px-4 py-4">           // Page section
<div className="p-4">                  // Card
<div className="space-y-3">            // Card list
<div className="gap-3 grid">           // Grid
<div className="flex gap-2">           // Inline items
<div className="mb-6">                 // Section bottom
<div className="pb-20">                // Page bottom (nav clearance)
```

### C. Component Dependency Map

```
App
├── BottomNav
├── Page (AnimatePresence)
│   ├── HomePage
│   │   ├── StreakIndicator
│   │   ├── XPBar
│   │   ├── DailyMissionCard[]
│   │   ├── MascotReaction
│   │   └── QuickActions (Button[])
│   │
│   ├── SwipePage
│   │   ├── SwipeStack
│   │   │   └── SwipeCard (FloatingXP, AudioButton, ComboIndicator)
│   │   └── ProgressBar
│   │
│   ├── BattlePage
│   │   ├── BattleArena
│   │   │   ├── HpBar (player)
│   │   │   ├── HpBar (enemy)
│   │   │   ├── EnemySprite
│   │   │   └── QuestionCard (AnswerOptions, Timer)
│   │   └── BattleResult
│   │
│   ├── ProgressPage
│   │   ├── RankDisplay
│   │   ├── StatsGrid (Card[])
│   │   └── BadgeGrid (Card[])
│   │
│   └── SocialPage
│       ├── Leaderboard (LeaderboardCard[])
│       ├── FriendActivity
│       └── InviteCard
│
├── Modal (Sheet/Alert)
├── Toast
└── Mascot (global floating)
```

---

*This design system is a living document. Update as the product evolves.*  
*Harf — حرف*
