# Harf Sound Design

> Sound is not decoration. Sound is the emotional reinforcement layer — it delivers dopamine, creates tactile illusion, builds habit attachment, and makes every interaction feel alive without demanding attention.

---

## 1. Sound Design Philosophy

Harf's audio identity follows three axioms:

**1. Sound is felt, not heard.**  
Audio operates at the periphery of attention. The user should never consciously think "that sound effect was nice" — they should simply feel more satisfied, more motivated, and more engaged. Good audio is invisible.

**2. Warmth over excitement.**  
Harf is a learning companion, not an arcade game. Sounds are warm (soft attack, gentle decay, rounded harmonics), never harsh or aggressive. Even battle impacts are thuds, not cracks. Even error sounds are soft, not jarring.

**3. Silence is a sound.**  
The absence of audio is a deliberate design tool. Long learning sessions need quiet. Background music breathes. Sound effects have space around them. Not every interaction needs a sound — only meaningful ones.

**Audio should:**
- Reinforce learning success
- Reward consistency
- Create emotional warmth
- Support focus
- Enhance tactile feel

**Audio should NEVER:**
- Punish harshly
- Create anxiety
- Overwhelm
- Interrupt concentration
- Feel manipulative
- Sound like a casino

---

## 2. Emotional Audio Goals

| Emotion | Trigger | Audio Response | Character | Duration |
|---------|---------|----------------|-----------|----------|
| **Satisfaction** | Correct answer | Soft ascending chime, warm harmonics | Major key, soft attack | 400ms |
| **Accomplishment** | 5+ combo | Layered chime with sparkle overlay | Ascending stack, brighter | 600ms |
| **Euphoria** | 10+ combo | Full harmonic stack + shimmer | Rich major chord, airy | 800ms |
| **Triumph** | Battle victory | Rising brass-like fanfare | Bold, warm, celebratory | 1200ms |
| **Pride** | Level up | Heroic swell + chime cascade | Uplifting, wide staging | 1500ms |
| **Anticipation** | Card appear | Soft whoosh + subtle ping | Airy, brief | 200ms |
| **Encouragement** | Wrong answer | Gentle low tone, no harshness | Warm, muted, forgiving | 500ms |
| **Urgency** | Low HP | Subtle low pulse | Rumbling, not panicked | 1s loop |
| **Curiosity** | Chest appear | Resonant metallic shimmer | Mysterious, inviting | 300ms |
| **Surprise** | Special attack | Whoosh + impact + shimmer | Dynamic, exciting | 500ms |
| **Peace** | Home screen ambient | Soft pad, warm texture | Calming, warm | Loop |
| **Focus** | Learning session | Sparse ambient, no percussion | Minimal, spacious | Loop |
| **Joy** | Streak milestone | Rising bell sequence | Bright, resonant | 1000ms |

---

## 3. Audio Identity System

Harf's sonic identity is based on three audio layers that combine to create a unique, recognizable sound:

### 3.1 Core Palette

| Element | Instrumentation | Character | Usage |
|---------|----------------|-----------|-------|
| **Chimes** | Soft mallet instruments (marimba, vibraphone, glockenspiel) | Warm, rounded, major key | Correct answers, rewards, progression |
| **Textures** | Airy pads, soft noise, gentle reverb tails | Warm, spacious, non-intrusive | Ambient, transitions, backgrounds |
| **Impacts** | Rounded thuds, soft clicks, felted hits | Warm, tactile, satisfying | Buttons, taps, interactions |
| **Whooshes** | Filtered noise sweeps, air swishes | Smooth, dynamic, brief | Card appears, page transitions, gestures |
| **Sparks** | Shimmer, chime harmonics, bell overtones | Bright, magical, precious | XP, combos, rare unlocks |
| **Tones** | Sine wave, soft sawtooth, filtered square | Pure, warm, non-fatiguing | Alerts, notifications, feedback |

### 3.2 Audio Color System

Sounds are "colored" by their emotional intent:

| Color | Character | Applied To |
|-------|-----------|------------|
| **Emerald** | Warm, bright, satisfying | Correct, XP gain, combo, success |
| **Gold** | Rich, resonant, precious | Milestone, level up, streak, rare reward |
| **Crimson** | Soft, muted, gentle | Wrong answer, low HP, danger |
| **Blue** | Calm, spacious, airy | Ambient, idle, home screen |
| **Amber** | Warm, energetic, building | Combo escalation, battle buildup |

### 3.3 Musical Key

All melodic audio elements are in **C Major** — the warmest, most universally approachable key. This ensures:
- All chimes and harmonic elements sound naturally good together
- Layering multiple sounds creates harmonious stacks, not dissonance
- Emotional direction maps intuitively: ascending = positive, descending = gentle

---

## 4. Core Sound Principles

### 4.1 Feedback Timing

Every sound effect has a precise temporal relationship with the visual event:

```
Visual Event (t=0ms)
  +0ms:  Sound effect begins (preload guarantees zero latency)
  +16ms: First frame of animation visible
  +50ms: Sound reaches peak intensity (aligned with animation peak)
```

### 4.2 Sound Density Rules

| Context | Max Sfx/min | Rationale |
|---------|-------------|-----------|
| Learning session (swipe) | 15/min | Every swipe has feedback, but space between |
| Battle mode | 20/min | More events, but still room to breathe |
| Home screen navigation | 5/min | Minimal, UI-only clicks |
| Progress/reward screens | 8/min | Celebration moments are sparse |
| Settings/profile | 3/min | Almost silent, utility-focused |

### 4.3 Sound Fatigue Prevention

- Sounds shorter than 800ms never repeat identically within 2 seconds
- Combo sounds use pitch variation (semitones shift per tier)
- No single sound file longer than 2 seconds (except ambient beds)
- High-frequency content (above 8kHz) is filtered for non-celebration sounds
- All sounds have soft attack (5-15ms fade-in) to prevent clicks and jarring starts

---

## 5. UX Audio Rules

### 5.1 Interface Sound Rules

| UI Element | Sound | When | Priority |
|------------|-------|------|----------|
| Button press (primary) | Soft click, felted | On pointer down | High |
| Button press (icon) | Micro tap, lighter | On pointer down | High |
| Toggle on | Gentle switch, ascending | On toggle | Medium |
| Toggle off | Gentle switch, descending | On toggle | Medium |
| Tab switch | Subtle swipe whoosh | On tab change | Medium |
| Page transition | Airy whoosh, 150ms | On page enter | Low |
| Modal open | Soft resonant rise | On open | Medium |
| Modal close | Soft exhale whoosh | On close | Medium |
| Dropdown expand | Quick air puff | On expand | Low |
| Pull to refresh | Rising tension tone | On pull | Low |
| Drag start | Soft fabric tear | On drag start | Low |
| Snap back | Quick air pop | On snap | Medium |

### 5.2 Sound Timing for UI

```
Button press:
  t=0ms:   Visual press (scale 0.95)
  t=0ms:   Audio click (8ms duration)
  t=80ms:  Audio release (no sound — silence is the release)
  t=100ms: Visual release (scale returns)

Toggle:
  t=0ms:   Visual toggle
  t=0ms:   Audio switch (30ms)
  t=50ms:  Visual settle

Tab switch:
  t=0ms:   Visual indicator starts moving (layoutId animation)
  t=30ms:  Audio whoosh (100ms)
  t=200ms: Visual settle
  t=250ms: Page transition complete
```

### 5.3 No-Sound Zones

Some interactions MUST remain silent to prevent audio fatigue:

- Scrolling (list, leaderboard, achievement grid)
- Progress bar filling (the bar animation is visual enough)
- Text input fields
- Drag within bounds (without threshold crossing)
- Repeated identical navigation (back-to-back tab switches use single sound)
- Any interaction that triggers within 200ms of a previous sound (debounce)

---

## 6. Reward Psychology Through Sound

### 6.1 Dopamine Delivery Architecture

Sound is a primary dopamine trigger in Harf. The system is designed using operant conditioning principles:

**Fixed Ratio Schedule (predictable):**
- Every correct swipe → chime (consistent reward)
- Every level up → fanfare (consistent milestone)
- Every battle win → victory stinger (consistent outcome)

**Variable Ratio Schedule (surprising):**
- Random bonus XP → unexpected sparkle
- Rare badge unlock → special harmonic sequence
- Chest contents → layered reveal

**Interval Schedule (time-based):**
- Daily streak milestone → daily bell
- Chest ready → notification chime
- League reset → weekly tone

### 6.2 Reward Sound Escalation

Reward sounds escalate based on emotional significance:

```
Micro-reward (correct swipe):
  Single chime, C5, 200ms, soft attack, gentle release
  → Satisfying but brief

Meso-reward (5+ combo):
  Chime + harmony, C5 + G5, 400ms, layer enters at 200ms
  → Fuller, more satisfying

Macro-reward (level up):
  Full chord progression, C-E-G-C ascending, 1200ms, reverb tail
  → Emotionally significant, memorable

Legendary reward (streak 30+):
  Complete cadence, I-IV-V-I, 2000ms, wide stereo, long reverb
  → Rare, precious, share-worthy
```

### 6.3 Sound + Variable Reward Psychology

Chest rewards use a three-phase audio structure to maximize anticipation → suspense → relief:

```
Phase 1 — Anticipation (0-500ms):
  Metallic shimmer, high resonance, slow build
  → "Something good is coming"

Phase 2 — Suspense (500-1200ms):
  Tremolo effect, rising pitch, tension increases
  → "What will it be?"

Phase 3 — Reveal (1200ms+):
  Based on rarity:
    Common: Soft pop + chime
    Rare:   Sparkle + ascending harmony
    Epic:   Full chord + shimmer + reverb
    Legendary: Orchestral swell + bell cascade + reverb tail
```

---

## 7. Learning Reinforcement Audio

### 7.1 Correct Answer

```
Sound:    Ascending chime, C5 → E5 (major third)
Duration: 400ms
Attack:   8ms (soft felt mallet)
Decay:    200ms to silence
Tone:     Pure sine + soft harmonics, bandpass filtered 1-4kHz
Character: Warm, satisfying, unhurried
Psychology: The ascending interval signals "progress" — you moved forward.
```

### 7.2 Wrong Answer

```
Sound:    Descending tone, G4 → E4 (minor third, but soft)
Duration: 500ms
Attack:   15ms (very soft — no sting)
Decay:    300ms to silence
Tone:     Low-pass filtered sine, 200-800Hz, very warm
Character: Gentle, forgiving, low urgency
Psychology: The descending interval signals "feedback, not failure."
            Low frequency is calming, not anxiety-inducing.
            It says "try again" not "you lost."
```

### 7.3 Learning Complete (Session End)

```
Sound:    Rising arpeggio, C-E-G-C' (do-mi-sol-do'), piano tone
Duration: 1000ms
Texture:  Soft reverb, 1.5s tail
Character: Accomplished, warm, complete
Psychology: The perfect cadence (IV-I) signals closure.
            User feels "I finished something."
```

### 7.4 Spaced Repetition (Word Review)

```
Sound for known word:
  Micro chime, C6, 100ms
  → Confirms recall, minimal interruption

Sound for forgotten word:
  Soft resonance, G4, 200ms
  → Gentle reminder without punishment
```

---

## 8. Interaction Sound System

### 8.1 Button Sound Implementation

```typescript
// Implementation pattern in audioStore:

playSFX('tap'): {
  // Short, low-volume click
  // Use AudioContext OscillatorNode + GainNode
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = 800;
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  gain.gain.setValueAtTime(0.15 * volume, ctx.currentTime);  // Very quiet
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}
```

### 8.2 Tactile Illusion Sounds

These sounds simulate physical feedback for non-physical digital interactions:

| Interaction | Physical Illusion | Audio Texture |
|-------------|------------------|---------------|
| Button press | Felted button click | Soft impact + release |
| Card drag | Paper on glass | Light fabric rustle (filtered noise, 80ms) |
| Card release | Card snapping into place | Quick air pop (filtered click) |
| Toggle slide | Mechanical switch | Soft click + slide (filtered noise sweep) |
| Pull to refresh | Rubber band stretch | Rising tension tone (sinusoidal, pitch rises with pull) |

### 8.3 Audio Debounce

```typescript
// Prevent sound stacking on rapid interactions

const lastSfxTime: Record<string, number> = {};

function playSFXDebounced(type: SfxType, minInterval: number = 150) {
  const now = performance.now();
  if (now - (lastSfxTime[type] || 0) < minInterval) return;
  lastSfxTime[type] = now;
  playSFX(type);
}
```

---

## 9. XP Sound System

### 9.1 Single XP Gain

```
Sound:    Soft sparkle, C6 (two octaves above middle C)
Duration: 200ms
Layers:   
  Layer 1 (0-200ms): Sine wave at C6, gentle attack, quick decay
  Layer 2 (50-150ms): White noise burst, high-pass >8kHz, very quiet
Volume:   -12dB relative to master
Character: Light, airy, satisfying
Psychology: The high frequency signals "value gained."
            Short duration means "this is quick, do more."
            It never interrupts the learning flow.
```

### 9.2 XP Gain with Combo (2-4)

```
Sound:    Double sparkle, C6 then E6 (major third interval)
Duration: 350ms
Pitch:    First sparkle at C6, second at E6 (ascending major third)
Layering: Sparkle 1 at 0ms, Sparkle 2 at 150ms
Volume:   -9dB relative to master
Psychology: The ascending interval says "better than before."
            The slight delay extends the reward sensation.
```

### 9.3 XP Gain with Combo (5-9)

```
Sound:    Triple chime sequence: C6 → E6 → G6 (C major triad ascending)
Duration: 500ms
Layering: 
  Chime 1 (0ms): C6, soft mallet, 8ms attack
  Chime 2 (150ms): E6, slightly brighter
  Chime 3 (300ms): G6, full harmonics
Volume:   -6dB relative to master
Psychology: The full triad signals "completeness" and "harmony."
            Each chime builds on the last — rewards stack.
            User feels "I'm on a roll."
```

### 9.4 XP Gain with Combo (10+)

```
Sound:    Full chime chord + shimmer: C6-E6-G6-C7 (add octave)
Duration: 800ms
Layering:
  0ms:      Full chord strike (C-E-G-C), warm mallet
  100ms:    Shimmer layer enters (high-pass filtered noise + harmonics)
  300ms:    Airy pad swell (filtered sawtooth, quiet)
  500ms:    Gentle decay with reverb tail (1.2s)
Volume:   -3dB relative to master (briefly louder for impact)
Character: Rich, resonant, precious
Psychology: The full harmonic spectrum says "maximum reward."
            The reverb tail extends the feeling of accomplishment.
            This sounds rare — user wants to hear it again.
```

### 9.5 XP Sound Anti-Patterns

- **Never repeat identical XP sounds within 1 second.** Use pitch shift on subsequent plays (shift by 1-2 semitones randomly).
- **Never play XP sound for incorrect answers.** Wrong answers get +2 XP but NO sound — silence reinforces "this isn't optimal."
- **Never allow XP sounds to overlap.** Queue and truncate. One XP sound at a time.
- **Never pitch the XP chime above C7.** Higher frequencies fatigue the ear and sound cheap.

---

## 10. Combo Sound System

### 10.1 Combo Tier Audio

| Combo | Sound | Rhythm | Emotion |
|-------|-------|--------|---------|
| 2-4 | Double chime, ascending third | 150ms apart | "Getting started" |
| 5-7 | Triad chime ascending | 100ms apart | "Now we're playing" |
| 8-9 | Triad + shimmer | 80ms apart | "Almost legendary" |
| 10+ | Full chord + sparkle + air | Simultaneous | "Maximum power" |
| 15+ | Same as 10+ with +2 semitone shift | — | "Beyond expected" |

### 10.2 Combo Rhythm Acceleration

As combo count increases, the time between chime notes decreases:
```
Tier 2-4:  150ms between notes → relaxed, deliberate
Tier 5-7:  100ms between notes → building energy
Tier 8-9:  80ms between notes → exciting, urgent
Tier 10+:  60ms between notes → intense, peak
```

This rhythm acceleration is the audio equivalent of combo glow intensification — both escalate together.

### 10.3 Combo Sound + Motion Sync

```
Combo event (t=0ms):
  0ms:    Visual combo badge pops in (spring bouncy)
  0ms:    Audio chime starts (tier-appropriate)
  50ms:   Emoji shake animation begins
  100ms:  Visual glow intensifies (CSS class switch)
  150ms:  Next chime note (if multi-note combo)
  300ms:  Visual settles
  400ms:  Audio ends (reverb tail continues silently)
```

### 10.4 Combo Break Sound

When combo resets to 0 (wrong answer):

```
Sound:    Soft exhale, low-pass filtered noise burst
Duration: 200ms
Pitch:    Non-musical (intentionally not a melody)
Volume:   -15dB relative to master (barely audible)
Character: Gentle, forgiving, brief
Psychology: The combo break sound is deliberately underwhelming.
            It doesn't punish — it just acknowledges the reset.
            The low volume ensures user barely registers it.
            Motivation to rebuild combo comes from visual, not audio.
```

### 10.5 Combo Sound Anti-Patterns

- **Never play alarm or descending tones on combo break.** That's punishment audio. Harf uses gentle forgiveness.
- **Never increase urgency in audio beyond 10+ combo.** Above 10, the sound stays at legendary tier. Further escalation is visual-only.
- **Never allow combo sounds to feel frantic.** Even at 10+, the rhythm is controlled — it peaks, it doesn't spiral.

---

## 11. Streak Sound System

### 11.1 Daily Streak Milestones

| Milestone | Sound | Character | Duration |
|-----------|-------|-----------|----------|
| 3 days | Soft bell, C5 | Warm, gentle encouragement | 400ms |
| 7 days | Rising chime sequence, C5-E5-G5 | Proud, accomplished | 800ms |
| 14 days | Full C major arpeggio, C-E-G-C' | Significant, resonant | 1200ms |
| 30 days | Fanfare: brass-like chord swell + bell cascade | Triumphant, rare | 2000ms |
| 60 days | Same as 30, with warm reverb tail doubled | Legendary, emotional | 2500ms |
| 100 days | Complete victory sequence: full orchestral hit | Ultra-rare, memorial | 3000ms |

### 11.2 Daily Login Sound

Every time a user opens the app with an active streak:

```
Sound:    Single warm chime, C5, very soft, 300ms
          Followed by soft pad chord if streak > 7 days
Volume:   -18dB relative to master (barely conscious)
Psychology: This is a "welcome back" sound — warm, familiar, comforting.
            It says "we've been waiting for you" without words.
            The volume is low so it doesn't interrupt the user's intent.
```

### 11.3 Streak Danger Sound

When streak is about to break (no activity before midnight):

```
Sound:    Very soft single tone, G4, 500ms, slow fade
Volume:   -20dB relative to master (almost subliminal)
Character: Not alarming — a gentle "remember me?"
Psychology: The soft tone creates a tiny emotional tug.
            It's NOT an alarm — alarms feel manipulative.
            It's a whisper, not a shout.
```

### 11.4 Streak Frozen Sound

When streak freeze is used to protect a streak:

```
Sound:    Gentle shimmer + soft click, 200ms
Character: "Safe" feeling — a soft shield
Psychology: Relief — the streak is protected.
            The sound is quiet because the relief is personal.
```

### 11.5 Streak Lost Sound

When a streak breaks despite freeze protection:

```
Sound:    Gentle exhale, low rumble, 300ms
Volume:   -18dB relative master
Character: Not sad — just acknowledging.
Psychology: No punishment. No alarm. No guilt.
            The low rumble says "that's okay, you can start again."
            After this, the morning after sound is encouraging again.
```

---

## 12. Swipe Sound System

### 12.1 Card Drag Audio

```
As user drags card:
  Sound:    Very subtle texture — low-pass filtered noise
  Volume:   Scales with drag velocity (0 to -24dB)
  Pitch:    Pitches up slightly with velocity (200-400Hz)
  Duration: Continuous during drag
  Cutoff:   Stops immediately on release

Implementation:
  AudioContext OscillatorNode (type: 'sawtooth', heavily filtered)
  Gain scales: 0.01 × (|velocity| / maxVelocity) × volume
  Only active during drag — silence is default state
```

### 12.2 Swipe Correct Sound

```
Sound:    Percussive "snap" + chime
Duration: 300ms
Layers:
  0ms:     Soft snap (filtered noise burst, 50ms)
  50ms:    Chime starts (C6, warm mallet)
  150ms:   Chime decays
  300ms:   Silence
Psychology: The snap creates tactile satisfaction (card "locked in").
            The chime confirms correctness.
            Together they simulate a physical card snapping into a slot.
```

### 12.3 Swipe Wrong Sound

```
Sound:    Soft "thud" + descending tone
Duration: 350ms
Layers:
  0ms:     Soft thud (low-pass filtered noise, 60ms)
  80ms:    Descending tone (G4 → E4, soft sine)
  250ms:   Fade to silence
Psychology: The thud gives tactile feedback (card rejected).
            The descending tone is gentle feedback without punishment.
            Duration is only 50ms longer than correct — user quickly moves on.
```

### 12.4 Swipe Threshold Audio Feedback

```
As card approaches threshold (70-100% of threshold distance):
  Sound:    Subtle pitch rise, 100-300Hz, 100ms
  Volume:   0 to -12dB (scales with proximity to threshold)
  Effect:   Creates anticipation — user knows they're about to trigger

At threshold crossing:
  Sound:    Quick "click" (8ms, filtered)
  Purpose:  Confirms action will trigger
```

### 12.5 Card Stack Entrance Sound

As new card slides in from bottom:

```
Sound:    Airy whoosh, 150ms
Pitch:    Low-pass filtered noise sweep, 200Hz→800Hz
Volume:   -18dB relative to master (very quiet)
Psychology: The whoosh creates spatial awareness — a card "moved into view."
            It's quiet enough to ignore but adds depth to the stack experience.
```

---

## 13. Battle Sound System

### 13.1 Battle Start

```
Sound:    Low resonant drum hit + air swell
Duration: 800ms
Layers:
  0ms:     Drum hit (low-pass filtered thud, 200ms decay)
  50ms:    Air swell (filtered noise, rising volume, 600ms)
  300ms:   Subtle harmonic layer (C3, soft pad)
Character: Bold but warm — "prepare yourself" without aggression
Psychology: The low drum signals "something important is starting."
            The air swell creates anticipation.
            No high frequencies — this is grounded and calm.
```

### 13.2 Correct Attack Sound

```
Sound:    Quick impact + chime
Duration: 200ms
Layers:
  0ms:     Impact thud (filtered noise, 60ms, soft attack)
  30ms:    Chime (C5, very brief, 100ms)
Character: Satisfying but quick — action feels impactful but snappy
Psychology: The impact creates tactile feedback for dealing damage.
            The chime confirms it was correct.
            Combined they say "good hit."
```

### 13.3 Wrong Attack (Player Takes Damage)

```
Sound:    Soft thud + low tone
Duration: 300ms
Layers:
  0ms:     Thud (low-pass filtered, 80ms)
  50ms:    Low tone (E3, soft sine, 200ms)
Volume:   -6dB relative to correct impact (quieter)
Character: Impactful but gentle — "you got hit" without frustration
Psychology: The lower volume makes wrong answers feel less significant.
            The low tone is grounding, not alarming.
```

### 13.4 Combo Attack (5+ Combo in Battle)

```
Sound:    Normal attack sound + additional harmonic layer
Duration: 300ms
Layers:
  0ms:     Attack thud (same as regular)
  20ms:    Extra chime layer, E5 (higher than C5)
  50ms:    Subtle sparkle overlay
Psychology: The added harmony signals "this hit was stronger."
            The sparkle signals "special bonus damage."
```

### 13.5 Special Attack (8+ Combo)

```
Sound:    Whoosh + resonant impact + shimmer + harmonic hit
Duration: 600ms
Layers:
  0ms:     Whoosh buildup (filtered noise sweep, 200ms)
  150ms:   Big impact (full spectrum thud, 100ms)
  200ms:   Chord hit (C-E-G, full triad, 200ms)
  250ms:   Shimmer (high-pass sparkle, 300ms)
  400ms:   Reverb tail (400ms)
Character: Cinematic, exciting, powerful
Psychology: This is the audio peak of battle.
            It should feel earned — the user worked up to 8+ combo.
            The full triad + shimmer = "you unleashed something special."
```

### 13.6 Enemy Defeat

```
Sound:    Satisfying resolution + fade
Duration: 1200ms
Layers:
  0ms:     Final impact thud (emphasized, 100ms)
  80ms:    Enemy "break" sound (filtered noise crumple, 200ms)
  200ms:   Victory tone sequence (C → E → G → C', ascending, 600ms)
  500ms:   Ambient pad swell (quiet C major chord, 700ms)
  800ms:   Soft reverb tail
Character: Triumphant but warm — "you won" without arrogance
Psychology: The ascending cadence provides emotional closure.
            The pad swell adds emotional weight.
            No brass, no aggression — victory feels earned, not gloating.
```

### 13.7 Player Defeat

```
Sound:    Gentle descent + warm pad
Duration: 1200ms
Layers:
  0ms:     Soft exhale (filtered noise, quiet)
  100ms:   Descending tone (G → E → C, soft, 500ms)
  400ms:   Warm pad swell (C major, very quiet, 800ms)
Character: Gentle, encouraging — "try again" not "you lost"
Psychology: The descending sequence acknowledges the loss without dwelling.
            The warm pad underneath says "it's okay, we'll get them next time."
            No sad sounds — sadness is demotivating.
```

### 13.8 Battle End Screen

```
Sound:    Result stinger based on outcome
Victory:  Rising two-note chime (C5 → G5, "you won")
Defeat:   Soft single tone (C4, "session ended")
Duration: 400ms (both)
Volume:   -6dB relative to master
```

### 13.9 Battle Background Music

See Section 22 — Battle Mode music differs from ambient in subtle ways only.

---

## 14. Reward Chest Audio

### 14.1 Chest Appear

```
Sound:    Metallic shimmer, resonant
Duration: 500ms
Layers:
  0ms:     Metallic ping (high-pass filtered sine, G6, 50ms)
  50ms:    Resonant body (filtered noise, warm, 400ms)
  100ms:   Reverb tail (500ms, shimmer)
Character: Mysterious, inviting — "something valuable is here"
Psychology: The metallic timbre signals "treasure."
            The shimmer creates curiosity — "what's inside?"
```

### 14.2 Chest Opening — Build-up

```
Sound:    Slow resonant rise, 0-600ms
Pitch:    C4 → C5 (one octave rise over 600ms)
Layers:
  0ms:     Low rumble (sub-200Hz, feel more than hear)
  200ms:   Mid shimmer enters
  400ms:   High sparkles enter (pitched noise)
  600ms:   Cut to silence — reveal moment
Character: Suspenseful, exciting — "any second now"
Psychology: The slow rise builds anticipation.
            The sub-rumble creates physical tension.
            The cut to silence creates the reveal moment.
```

### 14.3 Chest Reveal by Rarity

| Rarity | Sound | Duration |
|--------|-------|----------|
| Common | Single chime, C5, quick sparkle | 300ms |
| Rare | Two chimes, C5 → E5, sparkle | 500ms |
| Epic | Triad chime, C-E-G, shimmer trail | 800ms |
| Legendary | Full chord + orchestral hit + bell cascade + reverb | 2000ms |

### 14.4 Chest Sound + Motion Sync

```
Chest opening sequence:

  0ms:     User taps chest
  0ms:     Visual: chest lid begins to open (spring gentle)
  0ms:     Audio: build-up begins (sub-rumble)
  
  300ms:   Visual: lid half open
  300ms:   Audio: shimmer layer enters
  
  600ms:   Visual: lid fully open, glow emits
  600ms:   Audio: silence (100ms gap for impact)
  
  700ms:   Visual: reward icon appears (spring bouncy)
  700ms:   Audio: reveal sound based on rarity
  
  1200ms:  Visual: reward settles
  1200ms:  Audio: reverb tail fades
```

---

## 15. Badge Unlock Audio

### 15.1 Badge Earned Sound

```
Sound:    Prestigious chime + lock-click + sparkle
Duration: 600ms
Layers:
  0ms:     Lock "click" open (filtered click, 40ms)
  50ms:    Chime sequence (C5 → E5 → G5, ascending, 300ms)
  200ms:   Sparkle overlay (high-pass shimmer, 400ms)
  400ms:   Reverb tail (gentle, 400ms)
Character: Prestigious, collectible — "I earned this"
Psychology: The lock-click creates a "unlock" sensation.
            The ascending chime says "achievement unlocked."
            The sparkle says "this is special."
```

### 15.2 Badge Rarity Differentiation

| Rarity | Sound Difference | Feeling |
|--------|-----------------|---------|
| Common | Single chime, no sparkle, 300ms | "Nice" |
| Rare | Two chimes, soft sparkle, 450ms | "Cool" |
| Epic | Triad chime, shimmer, 600ms | "Amazing!" |
| Legendary | Full harmony + reverb + sparkle cascade, 1000ms | "INCREDIBLE!" |

### 15.3 Badge Collection Sound

When viewing earned badges (not first unlock, just viewing):

```
Sound:    Subtle resonance, single chime, 200ms
Volume:   -15dB (barely audible)
Purpose:  Confirms "this badge exists in your collection"
          without re-playing the full unlock fanfare
```

---

## 16. Rank Up Audio

### 16.1 Rank Promotion Sound

```
Sound:    Ascending fanfare, warm brass-like synth, C-E-G-C'
Duration: 1500ms
Layers:
  0ms:     Introduction hit (soft timpani-like thud, 100ms)
  100ms:   Fanfare begins (C → E → G → C', each 200ms apart)
  300ms:   Harmonic pad enters (C major, warm)
  700ms:   Final note (C') holds with shimmer
  1000ms:  Reverb tail (500ms)
Character: Prestigious, warm, triumphant — "you leveled up in life"
Psychology: The fanfare structure signals "ceremony."
            The warm harmonics prevent arrogance.
            It should feel like a warm embrace, not a victory lap.
```

### 16.2 Rank Demotion Danger Sound

```
Sound:    Very soft low tone, G3, 400ms
Volume:   -20dB relative to master
Character: Subtle — "you might want to play more"
Psychology: Not a warning — just an acknowledgment of position.
            Too subtle to cause anxiety, present enough to notice.
```

### 16.3 League Promotion Sound

```
Sound:    Modified rank-up fanfare with added sparkle
Duration: 1500ms
Difference from rank up:
  + Extra shimmer layer at 500ms
  + Slightly wider stereo spread
  + 0.5s longer reverb tail
Psychology: League promotion > rank up. More prestige.
```

---

## 17. Mascot Voice System

### 17.1 Mascot Audio Philosophy

The mascot communicates through **non-verbal vocalizations** — soft tones, hums, and chirps — not words. This avoids:
- Cringe voice acting
- Repetitive phrase fatigue
- Language barrier (Indonesian and Arabic users)

### 17.2 Mascot Sound Palette

| Expression | Sound | Character | Duration |
|------------|-------|-----------|----------|
| Happy | Rising chirp, C5 → E5, quick | Light, bird-like | 200ms |
| Excited | Rapid double chirp, E5 → G5 → E5 | Energetic, playful | 300ms |
| Proud | Warm hum, G3, soft resonance | Grounded, warm | 500ms |
| Sad | Descending coo, E4 → C4, very soft | Gentle, comforting | 400ms |
| Surprised | Quick inhale chirp, G5, sharp | Startled, cute | 150ms |
| Sleepy | Slow descending tone, C4 → G3, 1s | Relaxed, warm | 1000ms |
| Confused | Wobbly tone, C4 → C#4 → C4, | Quizzical, playful | 300ms |

### 17.3 Mascot Voice Triggers

| Trigger | Expression | Sound | Priority |
|---------|-----------|-------|----------|
| App open (streak active) | Happy | Rising chirp | High |
| Correct answer | Happy | Quick chirp | Medium |
| 5+ combo | Excited | Double chirp | Medium |
| 10+ combo | Excited + Proud | Chirp + hum | High |
| Wrong answer | Sad (brief) | Soft coo | Low |
| Streak milestone | Proud | Warm hum | High |
| Level up | Excited | Rapid chirps | High |
| Battle start | Surprised | Quick inhale | Medium |
| Battle victory | Excited | Double chirp + hum | High |
| Battle defeat | Sad → Encouraging | Coo then chirp | Medium |
| Idle (5s+ no input) | Sleepy | Slow descending tone | Low |
| Idle (30s+ no input) | Sleepy (repeat) | None (silence) | Never |

### 17.4 Mascot Voice Anti-Patterns

- **Never play mascot sound when user is actively swiping.** The mascot sound interrupts the learning flow.
- **Never play mascot sound on every interaction.** Max 1 mascot sound per 10 seconds.
- **Never let mascot sound overlap with reward sounds.** Mascot sound yields to reward sounds.
- **Never play mascot sound for wrong answers (except very brief).** Wrong answers don't need character commentary.
- **Never use words or phrases.** Non-verbal only. Words get annoying. Chirps are universal.

---

## 18. Navigation Audio

### 18.1 Bottom Navigation

```
Tab switch sound:
  Sound:    Subtle whoosh + click
  Duration: 100ms
  Volume:   -18dB relative to master
  Character: Smooth, functional — "you moved to a new tab"
  
  Rule: Sound only plays on tab switch, not on initial page load.
```

### 18.2 Page Entrance

```
Sound:    Airy whoosh, stereo sweep left-to-right
Duration: 150ms
Volume:   -20dB (very quiet)
Character: Spatial — creates a sense of "entering" a new space
Psychology: The stereo sweep adds depth to page transitions.
            At -20dB it's nearly subliminal — felt more than heard.
```

### 18.3 Back Navigation

```
Sound:    Reverse whoosh, right-to-left (opposite of entrance)
Duration: 120ms
Volume:   -20dB
Character: Symmetrical to entrance — creates spatial consistency
```

### 18.4 Link/External Navigation

```
Sound:    Soft "pop" + brief whoosh
Duration: 100ms
Volume:   -15dB
Character: Confirms action without interrupting
```

---

## 19. Notification Audio

### 19.1 Notification Sound Types

| Type | Sound | Duration | Volume |
|------|-------|----------|--------|
| Streak reminder | Soft bell, C5 | 300ms | -15dB |
| Chest ready | Metallic ping, G5 | 200ms | -12dB |
| League danger | Low tone, G3 | 400ms | -20dB |
| Friend activity | Quiet chirp, E5 | 150ms | -18dB |
| Achievement unlocked | Sparkle + chime | 500ms | -10dB |
| Daily reset | Warm pad chord | 800ms | -15dB |

### 19.2 Notification Timing Rules

- Notifications only play when app is in background (system push notification sound)
- In-app notifications use visual-only (toast) — sound would interrupt the learning flow
- Exception: Achievement unlocked in-app plays sound (it's a reward, not a distraction)

### 19.3 Push Notification Sounds

```
Streak reminder (push):
  Sound:    Warm bell tone, 200ms
  Purpose:  "Come back to Harf" — welcoming, not urgent

Chest ready (push):
  Sound:    Sparkle ping, 150ms
  Purpose:  "Something's waiting" — curious, not demanding

Friend challenge (push):
  Sound:    Double chirp, 200ms
  Purpose:  "Someone's playing" — social connection
```

---

## 20. Ambient Audio Strategy

### 20.1 Ambient Layers

Harf's ambient audio is built from three subtle layers:

```
Layer 1 — Harmonic Bed (always present):
  Sound:    Soft pad, C major, very quiet
  Duration: Continuous loop, 30 seconds
  Volume:   -24dB (just above silence)
  Character: Warm, spacious, non-intrusive
  Purpose:   Fills silence with warmth

Layer 2 — Rhythmic Element (learning sessions):
  Sound:    Very soft pulse, 60 BPM (resting heart rate)
  Duration: Continuous loop, 15 seconds
  Volume:   -30dB (barely perceptible)
  Purpose:   Subtle grounding rhythm — calming, meditative

Layer 3 — Texture (sparse, occasional):
  Sound:    Soft wind, filtered noise, random intervals
  Duration: 2-5 seconds, every 20-40 seconds
  Volume:   -28dB
  Purpose:   Prevents audio "stagnation" — adds subtle movement
```

### 20.2 Ambient Volume

The total ambient volume should be **at or near the threshold of conscious perception.** The user shouldn't "hear" ambient sounds — they should just feel that the app sounds "warm" and "alive."

If the user consciously notices the ambient audio, it's too loud.

### 20.3 Ambient Pause

Ambient audio pauses when:
- User is in a battle (battle sounds take over)
- User has headphones and hasn't interacted in 30+ seconds (battery save)
- System audio focus is lost (phone call, other media)
- User is on a call (OS handles this automatically)

---

## 21. Background Music Strategy

### 21.1 Music Philosophy

Harf uses **ambient soundscapes**, not traditional music. There are no melodies, no hooks, no percussion. The goal is:
- Reduce mental fatigue during long learning sessions
- Create emotional warmth without demanding attention
- Support focus, not distract

### 21.2 Music by Screen State

| Screen | Music Style | Character | Volume |
|--------|-------------|-----------|--------|
| Home | Warm pad, C major, 60 BPM pulse | Calming, welcoming | -24dB |
| Swipe learning | Same as home, slightly brighter | Focused, warm | -24dB |
| Battle | Low drone + subtle rhythmic pulse, 80 BPM | Energized, bold | -20dB |
| Battle (combo 5+) | Added harmonic layer, brightening | Building excitement | -18dB |
| Battle (combo 10+) | Full harmonic stack, fuller | Peak energy | -16dB |
| Progress/Profile | Home variant, slightly fuller | Reflective, proud | -24dB |
| Leaderboard | Home variant, slightly wider stereo | Open, aspirational | -24dB |
| Reward/Chest | Swelling pad, rising pitch | Anticipation | -20dB |
| Level up | Full warm chord, gradually released | Triumphant | -18dB |

### 21.3 Music Transitions

Screen transitions crossfade between music states:

```
Screen A → Screen B:
  t=0ms:   Music state A begins fade-out (100ms)
  t=50ms:  Music state B begins fade-in (200ms)
  t=200ms: Music state B at full volume
  
  Total crossfade: 200ms — smooth, seamless, subconscious
```

### 21.4 Music Loop Points

All music loops are designed with seamless loop points:
- Harmonic beds loop at 30-second intervals
- Rhythmic pulses loop at 15-second intervals
- No audible click or gap at loop boundary
- Crossfade at loop point: 50ms (software or pre-rendered)

### 21.5 Music vs Ambiënt

```
Ambient (always on):    Harmonic bed + texture + rhythm (if learning)
Music (battle only):    Extended soundscape with dynamic layers

Home/Swipe/Progress:    Ambient only (no music)
Battle:                 Music (dynamic, layer-based)
Reward/Level up:        Music (swell-based, timed to event)
```

---

## 22. Audio Layering Rules

### 22.1 Layer Priority

When multiple sounds compete for the same audio channel, priority determines what plays:

```
Priority 1 (always plays):
  - Reward sounds (level up, rank up, streak milestone)
  - Mascot sounds (expressive reactions)
  - Notification sounds (system push)

Priority 2 (plays if no P1 within 200ms):
  - Correct/incorrect feedback
  - Battle sounds (attack, hit, victory)
  - Chest sounds (build-up, reveal)

Priority 3 (plays if no P1/P2 within 100ms):
  - UI sounds (tab switch, button click)
  - Swipe sounds (drag texture, snap, whoosh)
  - XP chime

Priority 4 (always plays, but ducked):
  - Ambient bed (volume reduces by 6dB when P1/P2 play)
  - Battle background (volume reduces by 6dB during attacks)
```

### 22.2 Layer Ducking

When a high-priority sound plays, lower-priority layers automatically reduce in volume:

```
P1 plays → Ambient: duck -6dB, Attack sounds: duck -3dB
P2 plays → Ambient: duck -3dB, UI sounds: duck -6dB
P3 plays → No ducking (too brief to matter)
```

### 22.3 Maximum Simultaneous Sounds

| Device Tier | Max Voices | Strategy |
|-------------|------------|----------|
| High-end | 8 | Full layering |
| Mid-range | 6 | Drop lowest priority |
| Low-end | 4 | Skip ambient + reduce layer count |

---

## 23. Audio Timing Rules

### 23.1 Sound Event Timing

```
Sound event lifecycle (typical 300ms sound):
  
  t=0ms:     Script triggers playSFX(type)
  t=0-2ms:   AudioContext.createBufferSource() / preloaded buffer
  t=2ms:     source.start(0) — sound begins
  t=2-50ms:  Attack phase (volume rises to peak)
  t=50-200ms: Sustain phase (constant volume)
  t=200-300ms: Release phase (volume decays to zero)
  t=300ms:   source.stop() / onended callback
  t=300ms:   Cleanup (disconnect nodes, null references)
```

### 23.2 Visual-Audio Latency Budget

```
Total allowed latency from user action to audio output: 50ms

Breakdown:
  JavaScript execution:  0-5ms
  Audio buffer decode:   0ms (preloaded) or 10ms (streamed)
  AudioContext startup:  0-15ms (warm, pre-activated)
  OS audio output:       5-15ms (varies by device)
  Speaker/headphone:     <1ms
  Total budget:          20-45ms ✓
```

### 23.3 Pre-warming AudioContext

```typescript
// AudioContext must be created on first user interaction to comply with autoplay policy
// After creation, it stays active for the session

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  // Resume if suspended (autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}
```

---

## 24. Audio + Motion Synchronization

### 24.1 Sync Timing Map

Full sync between audio events and animation events:

| Animation Event | Audio Event | Offset | Rationale |
|----------------|-------------|--------|-----------|
| Correct answer: green glow appears | Correct chime starts | 0ms | Instant feedback |
| Correct answer: scale bounce peak | Chime peak | 50ms | Motion + audio peak together |
| Correct answer: XP burst emits | Sparkle layer | 80ms | Particles + sound align |
| Wrong answer: red glow appears | Descending tone | 0ms | Instant feedback |
| Wrong answer: shake animation | Soft thud | 20ms | Impact sync |
| Combo badge: scale 1.3 peak | Combo chime peak | 0ms | Badge pop + sound peak |
| Card swipe: crosses threshold | Snap click | 0ms | Tactile confirmation |
| Card swipe: begins exit | Whoosh | 50ms | Motion follows sound |
| Battle attack: hit frame | Impact thud | 0ms | Impact sync |
| Battle special: circle expands | Whoosh buildup | 0ms | Scale sync |
| Battle special: impact frame | Big impact | 200ms | Build → release |
| Enemy defeat: grayscale fade | Defeat chord | 0ms | Visual + audio closure |
| Chest: lid opens | Build-up starts | 0ms | Suspense sync |
| Chest: reward appears | Reveal chime | 700ms | Reveal sync |
| Level up: badge appears | Fanfare starts | 0ms | Ceremony sync |
| Confetti: particles burst | Sparkle shower | 50ms | Visual + audio celebration |

### 24.2 Group Delay by Event Type

| Event Group | Audio Delay from Visual | Reason |
|-------------|------------------------|--------|
| Feedback (correct/wrong) | 0ms | Must feel instant |
| Tactile (swipe, button) | 0ms | Must feel connected to touch |
| Impact (battle hit) | 0ms | Impact must be simultaneous |
| Ceremony (level up, rank) | +50ms | Brief delay builds anticipation |
| Reward (chest, badge) | +100ms | Delay creates suspense |
| Ambient (idle, background) | N/A | No visual trigger |

---

## 25. Emotional Escalation System

### 25.1 Escalation Architecture

Harf's audio escalates through five emotional intensity levels. Each level adds more audio layers and harmonic richness:

```
Level 1 — Calm (home, progress, settings):
  Audio:    Ambient pad only
  Layers:   1 (harmonic bed)
  Goal:     Relaxation, clarity

Level 2 — Engaged (swipe learning, 0-4 combo):
  Audio:    Ambient + interaction sounds
  Layers:   1 + occasional feedback sounds
  Goal:     Focus, gentle reward

Level 3 — Excited (5-9 combo, battle active):
  Audio:    Fuller chimes, sparkle layers, rhythmic pulse
  Layers:   2-3 (ambient + richer feedback)
  Goal:     Building energy, positive excitement

Level 4 — Peak (10+ combo, special attack, chest reveal):
  Audio:    Full harmonic stacks, shimmer, reverb
  Layers:   3-4 (chords + sparkle + air)
  Goal:     Euphoria, maximum reward sensation

Level 5 — Transcendent (level up, streak 30+, legendary):
  Audio:    Complete musical phrases, wide stereo, long reverb
  Layers:   4-5 (orchestral swells, bell cascades)
  Goal:     Emotional memory, pride, attachment
```

### 25.2 Escalation Upward (Building Excitement)

```
Combo 2→3→4:   Chimes get slightly brighter (EQ high shelf +0.5dB per tier)
Combo 5:       Sparkle layer added (new harmonic content)
Combo 6→7:     Slightly louder (+0.5dB per tier), sparkle brightens
Combo 8→9:     Reverb increases (larger "space" feeling)
Combo 10:      Full harmonic stack, widest stereo
```

### 25.3 Escalation Ceiling

Above combo 10, audio stops escalating. Further visual escalation happens without audio change. This prevents:
- Audio fatigue from ever-increasing intensity
- Ear discomfort from excessive brightness/loudness
- Desensitization (if it always gets bigger, nothing feels special)

### 25.4 Escalation Reset

After a peak event, audio returns to Level 1-2 baseline within 2 seconds:

```
Combo 10+ achieved:
  t=0ms:    Peak audio (Level 4)
  t=800ms:  Begin decay to Level 2
  t=2000ms: Return to Level 2 baseline

Level up achieved:
  t=0ms:    Peak audio (Level 5)
  t=1500ms: Begin decay
  t=3000ms: Return to Level 1 baseline
```

---

## 26. Progression Audio Evolution

### 26.1 Audio as Reward Milestone

As the user progresses through levels, certain audio elements evolve to reflect their journey:

| Milestone | Audio Change | Why |
|-----------|-------------|-----|
| Level 5 (Battle unlocked) | Battle theme becomes available | New content, new sound |
| Level 10 (Profile unlock) | Slightly richer home ambient | "You've earned more depth" |
| Level 20 (200+ words) | XP chime gets a 2nd harmonic | "Your rewards are fuller now" |
| Level 30 (500+ words) | Streak chime adds reverb | "Your streaks carry more weight" |
| Level 50 (1000+ words) | All chimes get 15% longer reverb | "You've earned more resonance" |

### 26.2 Evolution Implementation

```typescript
// Progression-based audio parameters

const progressionParams = {
  xpChimeReverb: Math.min(0.3 + level * 0.005, 0.8),   // 0.3 → 0.8 over 100 levels
  fanfareHarmonics: level >= 30 ? 3 : level >= 15 ? 2 : 1,
  ambientBrightness: Math.min(level * 0.02, 1),           // EQ high shelf
  sparkleDensity: Math.min(5 + level * 0.5, 30),          // particles per burst
};
```

### 26.3 Evolution Anti-Patterns

- **Never change core identity sounds.** The "correct answer" chime should always be recognizable, even at level 100. Evolution adds depth, not replacement.
- **Never make audio worse with progression.** Evolution only adds — never removes harmonics or reverb.
- **Never gate essential feedback audio behind levels.** Correct/wrong sounds are always clear, regardless of level.

---

## 27. Rare Reward Audio Psychology

### 27.1 Rarity Spectrum

```
Legendary (0.1% chance):
  Audio: Full orchestral hit, 8-part harmony, 2s reverb, wide stereo
  Effect: Dopamine peak — user will remember this sound
  Risk: Overuse desensitizes. Max 1-2 legendary moments per month.

Epic (2% chance):
  Audio: Triad + shimmer + medium reverb, 1s
  Effect: Strong satisfaction — feels special but not overwhelming
  Risk: Use 2-3 times per week. Enough to feel rare, not common.

Rare (10% chance):
  Audio: Double chime + soft sparkle, 600ms
  Effect: Noticeable improvement — "better than usual"
  Risk: This is the sweet spot. Use daily.

Common (87.8% chance):
  Audio: Single chime, 300ms
  Effect: Baseline reward — expected, still satisfying
  Risk: Must still sound good. Never let "common" feel cheap.
```

### 27.2 Variable Ratio Reinforcement

The rare reward audio follows a variable ratio schedule:
- User never knows when the "rare" version will play
- The audio variation itself becomes the reward (not just the content)
- This creates dopamine anticipation — every chime might be "the special one"

### 27.3 Rarity Fatigue Prevention

- Legendary audio has a 30-day cooldown per user (server-side check)
- Epic audio has a 24-hour cooldown
- Rare audio: no cooldown, but never twice in a row
- If a rare reward isn't earned, the NEXT common sound gets a slightly brighter timbre (almost-rare compensation)

---

## 28. Social Reward Audio

### 28.1 Friend Challenge Sound

```
Sound:    Double chirp + chime, rising, 400ms
Character: Playful, social — "someone wants to play with you"
Trigger:  Friend sends battle challenge
```

### 28.2 Leaderboard Movement Sound

```
Sound when overtaken:   Soft descending tone, 200ms (quiet)
Sound when overtaking:  Soft ascending tone, 200ms (quiet)
Sound for top 3:        Subtle sparkle, 300ms
Volume:                 -20dB (social feedback is subtle)
```

### 28.3 Friend Achievement Sound

```
Sound:    Muted chime, 200ms
Volume:   -18dB
Purpose:  "Your friend did something cool" — positive social reinforcement
Rule:     Only plays once per friend per session (prevent spam)
```

---

## 29. Failure Feedback Audio

### 29.1 Failure Sound Philosophy

Harf NEVER uses punishing audio. Failure sounds are designed to:
- Acknowledge the outcome without dwelling
- Encourage the next attempt
- Maintain warm emotional tone

### 29.2 Wrong Answer Sound (Detailed)

See Section 7.2 — already defined. Key points:
- Descending minor third (G4→E4), not a full minor chord
- Low-pass filtered — warm, not bright
- Volume is -6dB quieter than correct answer sound
- No "buzz" or "error" timbre — those sound like punishment

### 29.3 Battle Defeat Sound

See Section 13.7 — already defined. Key points:
- Descending sequence (G→E→C), not alarms
- Warm pad underneath says "it's okay"
- Equal duration to victory sound (respects user's time)

### 29.4 Missed Daily Mission

```
Sound:    Very soft exhale, 200ms
Volume:   -20dB
Character: "There's always tomorrow"
Psychology: So quiet it barely registers.
            Missed missions are not punished — just acknowledged.
```

### 29.5 Failure Audio Anti-Patterns

- **Never play descending minor chords.** They sound "sad" and manipulative.
- **Never use buzzer sounds.** Buzzers are punishment — Harf is a learning companion.
- **Never increase failure sound volume.** Failure sounds are always quieter than success sounds.
- **Never layer failure sounds.** One sound, simple, brief. Move on.

---

## 30. Recovery Feedback Audio

### 30.1 Comeback Sound

After a wrong answer, the next correct answer gets a slightly enhanced chime:

```
Sound:    Normal correct chime + 1 extra harmonic (E5)
Duration: 400ms (same as normal)
Volume:   +1dB (barely perceptible)
Psychology: This subtly says "you're back on track."
            The extra harmonic is a micro-reward for recovery.
            It's not announced — it's felt.
```

### 30.2 Streak Restart Sound

When user starts a new streak after breaking one:

```
Sound:    Warm rising tone, C4 → C5, 600ms
Character: "Fresh start" — hopeful, encouraging
Psychology: Starting over is emotionally vulnerable.
            This sound says "welcome back, let's try again."
            It's slightly richer than a daily login sound — 
            acknowledges the return effort.
```

### 30.3 Demotion Recovery Sound

After climbing back from demotion zone:

```
Sound:    Modified rank-up fanfare (shorter, quieter)
Duration: 800ms (vs 1500ms for full rank-up)
Volume:   -3dB vs full rank-up
Psychology: Recovery from demotion is celebrated but not as loudly
            as earning new rank. The shorter duration respects the
            user's time — they already know the feeling.
```

---

## 31. Accessibility Audio Rules

### 31.1 Mute-First Design

Harf is fully functional and satisfying with **zero audio**. All feedback is conveyed through:
- Visual animation (glow, pulse, scale)
- Haptic feedback (vibration patterns)
- Text indicators (+XP toast, combo counter)

```typescript
// Mute state is respected everywhere
if (isMuted) return;  // Early return — no audio processing at all

// Audio is NEVER required for gameplay
// All game actions (swipe, answer, select) work identically with mute on
```

### 31.2 Hearing Accessibility

| Accommodation | Implementation |
|---------------|---------------|
| Visual feedback for all audio | Every sound event has a paired visual animation |
| No audio-dependent gameplay | All mechanics work via visual/touch alone |
| Captions/indicators | +XP shows text + number, not just sound |
| Combo indicator | Visual combo badge, not audio-dependent |
| Streak notification | Visual streak badge + text, not just sound |

### 31.3 Haptic Substitution

For users who are deaf or hard of hearing, haptic feedback substitutes for audio:

| Audio Event | Haptic Pattern | Vibration API |
|-------------|---------------|---------------|
| Correct chime | Short single pulse (50ms) | `navigator.vibrate(50)` |
| Wrong answer | Two short pulses (30ms, 30ms gap) | `navigator.vibrate([30, 30, 30])` |
| Combo increase | Increasing pulse count | `navigator.vibrate([50, 50, 50, ...])` |
| Level up | Long pulse (200ms) | `navigator.vibrate(200)` |
| Battle hit | Sharp burst (100ms) | `navigator.vibrate(100)` |
| Victory | Rising triple pulse | `navigator.vibrate([30, 30, 50, 50, 100])` |

### 31.4 Sound Sensitivity

- No frequency content above 10kHz (safe for sensitive hearing)
- No sudden bursts above -6dB relative to average volume
- All sounds have minimum 5ms attack fade (prevents clicks)
- Ambient volume never exceeds -20dB
- Users can independently control: SFX volume, music volume, mute toggle

---

## 32. Volume Balancing Rules

### 32.1 Reference Levels

| Layer | RMS Level (re: max) | Peak Level | Dynamic Range |
|-------|---------------------|------------|---------------|
| Correct chime | -12dB | -6dB | 6dB |
| Wrong answer | -18dB | -12dB | 6dB |
| XP chime | -12dB | -8dB | 4dB |
| Combo (10+) | -6dB | -3dB | 3dB |
| Battle impact | -9dB | -6dB | 3dB |
| Victory fanfare | -6dB | -3dB | 3dB |
| Button tap | -18dB | -12dB | 6dB |
| Mascot chirp | -15dB | -9dB | 6dB |
| Ambient bed | -24dB | -20dB | 4dB |
| Battle music | -20dB | -15dB | 5dB |

### 32.2 Volume Relationships

```
Ambient bed:          -24dB (baseline)
Button tap:           -18dB (+6dB above ambient)
XP chime:             -12dB (+12dB above ambient)
Correct answer:       -12dB (+12dB above ambient)
Wrong answer:         -18dB (+6dB above ambient — quieter than correct)
Combo 10+:           -6dB  (+18dB — loudest regular sound)
Victory fanfare:     -6dB  (+18dB — equal to combo peak)
Level up:            -6dB  (+18dB — peak celebration)
```

### 32.3 Platform Volume Normalization

Harf respects system audio settings:
- Doesn't override device volume
- Uses system media channel (not alarm, not ringtone)
- Respects "Do Not Disturb" mode (no sound)
- Respects silent switch (iOS) / silent mode (Android) via `isMuted` flag
- Adjusts for headphone vs speaker output (headphone: -3dB overall)

---

## 33. Silent Mode Strategy

### 33.1 Silent Mode Detection

```typescript
// Silent mode is detected via:
// 1. User preference (toggle in settings)
// 2. System silent switch (iOS: AVAudioSession, limited web detection)
// 3. First interaction without audio context resume

// Default: Audio ON (but user can toggle in onboarding)
```

### 33.2 Silent Mode Behavior

When silent mode is ON:
- All SFX: paused/not played
- All music: paused
- Ambient: paused
- Mascot: visual only (no chirp)
- Audio button for word pronunciation: still works (explicit user action)
- All feedback: purely visual + haptic (if available)

### 33.3 First-Time User Audio

On first app launch:
- Audio is ON by default (let user experience the full design)
- Settings screen prominently shows "Suara" toggle
- First swipe session includes audio — if user mutes, preference persists
- No audio onboarding tutorial required (audio is self-explanatory)

---

## 34. Headphone Experience Design

### 34.1 Stereo Field Design

| Sound Type | Panning | Width |
|------------|---------|-------|
| UI sounds (buttons, tabs) | Center | Mono |
| Feedback (correct/wrong) | Center | Mono |
| Ambient bed | L/R diffused | Wide stereo |
| Battle impacts | Center | Mono |
| Victory/level up | L/R spread | Wide stereo |
| XP chime | Center | Mono |
| Confetti sparkle | Random L/R | Variable |
| Mascot chirp | Center | Mono |

### 34.2 Headphone-Specific Adjustments

- Reduce overall volume by 3dB (headphones are more sensitive)
- Subtle reverb on celebratory sounds (creates "space" around the sound)
- Ambient spread is wider on headphones (creates immersion)
- No panning on critical feedback (correct/wrong always center)

### 34.3 Spatial Audio Future

Future enhancement: WebXR Audio API for spatial positioning:
- Card swipe sounds positioned at swipe location
- Battle sounds positioned left (player) and right (enemy)
- Mascot sound positioned at mascot location on screen

---

## 35. Low-End Device Audio Optimization

### 35.1 Device Tier Detection

```typescript
// Reuse getAnimationQuality() from animation helpers
// Audio quality maps to same tiers:

const audioQualityTiers = {
  low: {
    maxVoices: 4,
    ambientEnabled: false,
    reverbEnabled: false,
    stereoEnabled: false,
    musicEnabled: false,
    sparkleLayers: 0,
  },
  mid: {
    maxVoices: 6,
    ambientEnabled: true,
    reverbEnabled: false,
    stereoEnabled: true,
    musicEnabled: true,
    sparkleLayers: 1,
  },
  high: {
    maxVoices: 8,
    ambientEnabled: true,
    reverbEnabled: true,
    stereoEnabled: true,
    musicEnabled: true,
    sparkleLayers: 2,
  },
};
```

### 35.2 Low-End Audio Strategy

| Optimization | Implementation |
|-------------|---------------|
| No ambient bed | Saves AudioContext processing and memory |
| No music | Saves streaming/decoding resources |
| Mono output | Removes stereo processing overhead |
| Skip reverb | Reverb convolution is CPU-intensive |
| Limit voices | Max 4 simultaneous sounds |
| Shortest sounds | Prefer 200ms sounds over 500ms |

### 35.3 AudioContext Pooling

```typescript
// Reuse AudioContext instead of creating new instances
// One AudioContext per session, not per sound

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  init() {
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
  }
  
  play(buffer: AudioBuffer, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    
    source.buffer = buffer;
    gain.gain.value = volume;
    
    source.connect(gain);
    gain.connect(this.masterGain);
    
    source.start();
  }
}
```

---

## 36. Audio Asset Management

### 36.1 Asset Inventory

| Asset | Type | Format | Max Size | Count |
|-------|------|--------|----------|-------|
| UI clicks | SFX | MP3 128kbps | 5KB | 5 |
| Chimes (correct/wrong/XP) | SFX | MP3 128kbps | 15KB | 6 |
| Combo sounds | SFX | MP3 128kbps | 20KB | 4 |
| Battle impacts | SFX | MP3 128kbps | 10KB | 5 |
| Mascot chirps | SFX | MP3 128kbps | 8KB | 7 |
| Streak bells | SFX | MP3 128kbps | 20KB | 4 |
| Rank-up fanfare | SFX | MP3 192kbps | 50KB | 1 |
| Level-up sequence | SFX | MP3 192kbps | 60KB | 1 |
| Victory stinger | SFX | MP3 192kbps | 40KB | 1 |
| Defeat tone | SFX | MP3 128kbps | 30KB | 1 |
| Chest sounds | SFX | MP3 128kbps | 25KB | 3 |
| Notification | SFX | MP3 128kbps | 10KB | 3 |
| Ambient bed | Loop | AAC 96kbps | 50KB | 1 |
| Battle background | Loop | AAC 96kbps | 60KB | 1 |
| **Total** | | | | **~400KB** |

### 36.2 Asset Naming Convention

```
{category}_{event}_{variant}.mp3

sfx_correct_default.mp3
sfx_combo_tier5.mp3
sfx_battle_impact.mp3
sfx_mascot_happy.mp3
ambient_home_bed.mp3
music_battle_layer1.mp3
```

### 36.3 Asset Storage

- All audio assets served from `/public/audio/`
- Preloaded at app initialization (non-blocking)
- Ambient/music files loaded lazily (only when needed)
- All assets loaded via `fetch()` + `AudioContext.decodeAudioData()`

---

## 37. Audio Compression Strategy

### 37.1 Format Selection

| Format | Bitrate | Use Case | Rationale |
|--------|---------|----------|-----------|
| MP3 | 128kbps | SFX (all) | Universal support, small size |
| AAC | 96kbps | Ambient/music loops | Better quality at low bitrate for sustained sounds |
| OPUS | 64kbps | Future voice/TTS | Best compression for speech |

### 37.2 Compression Guidelines

- SFX: 128kbps CBR, 44.1kHz, mono
- Ambient: 96kbps CBR, 44.1kHz, stereo
- Music: 96kbps CBR, 44.1kHz, stereo
- Voice (future): 64kbps VBR, 22.05kHz, mono

### 37.3 File Size Budget

```
Total audio budget: 500KB (compress all assets to fit)

Per-category:
  SFX (30 files):    200KB (avg 6.6KB each)
  Ambient (2 files): 100KB (50KB each)
  Music (1 file):    100KB
  Buffer:            100KB
```

---

## 38. Performance Optimization

### 38.1 Audio Preloading

```typescript
// Preload all essential SFX on app init
const SFX_TO_PRELOAD = [
  'sfx_correct_default', 'sfx_wrong_default', 'sfx_xp_chime',
  'sfx_combo_tier2', 'sfx_tap_default', 'sfx_battle_impact',
  'sfx_mascot_happy',
];

async function preloadAudio(assetNames: string[]) {
  const ctx = getAudioContext();
  
  const buffers = await Promise.all(
    assetNames.map(async (name) => {
      const res = await fetch(`/audio/${name}.mp3`);
      const arrayBuffer = await res.arrayBuffer();
      return ctx.decodeAudioData(arrayBuffer);
    })
  );
  
  const cache = new Map<string, AudioBuffer>();
  assetNames.forEach((name, i) => cache.set(name, buffers[i]));
  return cache;
}
```

### 38.2 Audio Buffer Cache

```typescript
// Cache decoded audio buffers — never decode twice
const audioCache = new Map<string, AudioBuffer>();

function getOrLoadAudio(assetName: string): Promise<AudioBuffer> {
  if (audioCache.has(assetName)) {
    return Promise.resolve(audioCache.get(assetName)!);
  }
  
  return loadAndCacheAudio(assetName);
}
```

### 38.3 Garbage Collection Strategy

- Audio buffers stay cached for the entire session
- Source nodes are garbage collected after `onended`
- AudioContext is suspended (not closed) when app is backgrounded — resume is cheaper than recreate
- AudioContext is closed only on app unload
- Unused ambient/music buffers can be evicted after 5 min of non-use (LRU cache)

### 38.4 Memory Budget

```
Audio memory budget: 10MB

  Essential SFX cache:    2MB (15 files × ~130KB decoded)
  Ambient/music buffers:  4MB (2 files × ~2MB decoded)
  Decode buffer:          2MB
  Headroom:               2MB
```

---

## 39. Current Implementation Status

### 39.1 audioStore (Existing)

```typescript
// File: src/stores/audioStore.ts
// Current state: TTS pipeline ready, SFX stub

// What exists:
- AudioContext-based playback pipeline ✓
- Word pronunciation playback via /api/audio/{wordId} ✓
- Speed control (normal/slow/very_slow) ✓
- Volume control ✓
- Mute toggle ✓
- playSFX stub (type: correct | incorrect | combo | levelup | tap | battle_hit)

// What needs implementation:
- Preloading system (Section 38.1)
- AudioContext pooling (Section 35.3)
- Buffer cache (Section 38.2)
- SFX sprite loading and playback
- Audio layering with priority (Section 22)
- Ambient bed playback
- Progression-based audio evolution (Section 26)
- Device tier detection integration (Section 35.1)

// Implementation priority:
// 1. SFX preloading + buffer cache → enables all sound effects
// 2. playSFX implementation with AudioContext pooling → enables game feedback
// 3. Audio layering with priority → prevents overlap issues
// 4. Ambient bed → fills silence
// 5. Progression evolution → long-term engagement
```

### 39.2 Integration Points

```typescript
// swipeStore: playSFX on correct/incorrect/combo
// battleStore: playSFX on attack/hit/victory/defeat
// profileStore: playSFX on level up/streak milestone
// uiStore: playSFX on navigation/tap notifications
// Home components: mascot chirp on mount/streak/login
// Progress components: playSFX on rank up/badge unlock
// Social components: playSFX on leaderboard change/challenge
```

### 39.3 playSFX Expansion

```typescript
// Expand the playSFX type union:

type SfxType = 
  // Core feedback
  | 'correct' | 'incorrect' 
  | 'xp_gain' 
  | 'combo' | 'combo_high' | 'combo_max'
  
  // Battle
  | 'battle_start' | 'battle_hit' | 'battle_special' 
  | 'battle_victory' | 'battle_defeat'
  
  // UI
  | 'tap' | 'tab_switch' | 'page_enter' | 'page_exit'
  | 'toggle' | 'notification'
  
  // Rewards
  | 'level_up' | 'streak_milestone' | 'badge_unlock'
  | 'rank_up' | 'chest_open'
  
  // Mascot
  | 'mascot_happy' | 'mascot_excited' | 'mascot_proud'
  | 'mascot_sad' | 'mascot_surprised' | 'mascot_sleepy';
```

---

## 40. Ethical Audio Design Rules

### 40.1 Anti-Casino Psychology

Harf explicitly avoids audio patterns used by gambling games:

| Casino Pattern | Harf Alternative |
|---------------|------------------|
| Loud jackpot sounds on wins | Warm, proportional reward sounds |
| Urgent countdown ticking | No countdown audio; visual-only timers |
| Escalating slot machine chimes | Combo escalation has a ceiling (Section 25.3) |
| Near-miss sound effects | Wrong answer sounds are gentle, not "almost" |
| Variable reward with aggressive audio | Rare rewards are subtle, not demanding |
| Audio that speeds up under time pressure | Battle has no time-pressure audio |

### 40.2 Healthy Engagement Audio

- No sounds that create FOMO (fear of missing out)
- Streak sounds are warm, not urgent
- Return-to-app sounds are welcoming, not demanding
- No "streak burning" audio effects
- No "pay-to-win" audio differentiation (paying users don't get better sounds)
- All audio features available to all users

### 40.3 Audio Consent

- Audio ON by default, but user can mute at any time
- Mute preference syncs across devices
- No "audio required" gameplay
- No audio-based prompts to unmute
- Ambient/music can be toggled independently of SFX

### 40.4 Age-Appropriate Audio

- No aggressive bass or sub-bass frequencies (safe for all ages)
- No distorted or harsh timbres
- No vocal samples (avoids language/age barriers)
- All sounds are short enough to not be disruptive in quiet environments

---

## 41. Anti-Addiction Safeguards

### 41.1 Audio Fatigue Prevention

- Session time tracking: after 30 minutes of continuous play, ambient volume decreases by 3dB
- After 45 minutes: SFX volume decreases by 2dB
- After 60 minutes: all audio reduces by 3dB total
- This is a gentle, subconscious signal that "it might be time to take a break"
- User can override in settings (but override resets next session)

### 41.2 Night Mode Audio

During evening hours (21:00-07:00 local time):
- All SFX: -3dB volume reduction
- Ambient: -6dB volume reduction
- No music (ambient only)
- No notification sounds
- No mascot sounds

### 41.3 Session Limit Audio

When a user exceeds daily recommended sessions (configurable):
- Reward sounds do not escalate (no combo audio progression)
- Correct answers play at minimal volume
- No ambiënt/music
- This is a gentle nudge, not a block — user can still play

---

## 42. Sound QA Checklist

### 42.1 Functional Checklist

- [ ] All SFX play correctly on iOS Safari
- [ ] All SFX play correctly on Android Chrome
- [ ] All SFX play correctly on desktop Chrome
- [ ] AudioContext resumes correctly after autoplay policy block
- [ ] Mute toggle works instantly (no residual sounds)
- [ ] Volume slider affects all audio proportionally
- [ ] Sound plays within 50ms of visual trigger
- [ ] No clicks or pops at sound start/end
- [ ] Audio loops seamlessly (ambient/music)
- [ ] Sound stops when tab is hidden

### 42.2 UX Checklist

- [ ] No sound plays during scrolling
- [ ] No sound plays during text input
- [ ] Rapid tapping produces at most 1 sound per 150ms (debounce)
- [ ] Ambient audio is below conscious perception threshold
- [ ] Correct sounds are louder than wrong sounds (+6dB)
- [ ] Combo sounds don't feel overwhelming at max tier
- [ ] Mascot sounds don't interrupt gameplay
- [ ] Notification sounds only play via push (not in-app)
- [ ] All audio has visual feedback pairing

### 42.3 Performance Checklist

- [ ] Audio assets total < 500KB
- [ ] All SFX preloaded before first interaction
- [ ] AudioContext reused, not created per sound
- [ ] Decoded buffers cached (no re-decoding)
- [ ] Source nodes cleaned up after `onended`
- [ ] AudioContext suspended when app backgrounded
- [ ] Low-end devices skip ambient/music
- [ ] Memory stays under 10MB for audio

### 42.4 Accessibility Checklist

- [ ] All audio feedback has visual equivalent
- [ ] No audio-dependent interactions
- [ ] Haptic feedback available as substitution
- [ ] Mute persists across sessions
- [ ] SFX and music have independent volume controls
- [ ] Night mode reduces all audio by 3dB minimum
- [ ] No frequencies above 10kHz

---

## 43. Anti-Pattern Warnings

### 🚫 Casino Jackpot Sounds

**Problem:** Loud, layered, escalating reward sounds train addictive behavior.
**Solution:** Harf rewards are warm and proportional. The loudest sound (legendary) is still musical and warm.

### 🚫 Punishment Sounds

**Problem:** Error buzzers, descending minor chords, and harsh tones create negative reinforcement.
**Solution:** All failure sounds are gentle, warm, and quieter than success sounds. They acknowledge without punishing.

### 🚫 Audio Fatigue Through Repetition

**Problem:** Same sound playing every 3 seconds for 30 minutes causes listener fatigue.
**Solution:** Pitch variation on repeated sounds. Combo tier changes alter the sound. Session-length volume reduction.

### 🚫 Unskippable Celebrations

**Problem:** Long fanfares that user can't skip become annoying on repeat.
**Solution:** All celebration sounds under 2 seconds. User can navigate away at any time (audio stops instantly).

### 🚫 Audio Desync

**Problem:** Sound plays before or after the visual event it's paired with.
**Solution:** All sound triggers are synchronized with animation start. Preloading guarantees zero decode latency.

### 🚫 Ambient at Conscious Volume

**Problem:** Background audio that's loud enough to consciously notice becomes distracting.
**Solution:** Ambient is mastered at -24dB RMS — below conscious perception threshold.

### 🚫 Contextless Audio

**Problem:** Sound playing for no apparent reason confuses and distracts.
**Solution:** Every sound maps to a specific visual/game event. Sounds don't fire without user action.

### 🚫 Over-layering

**Problem:** Too many simultaneous sounds create noise, not richness.
**Solution:** Hard limit of 8 simultaneous voices (4 on low-end). Priority system prevents stacking.

### 🚫 Identical Repeat Sounds

**Problem:** Same chime note played 50 times in a session becomes wallpaper.
**Solution:** Pitch shift ±1-2 semitones randomly on each play. Combo tier progressions change timbre.

### 🚫 Battle Ear Fatigue

**Problem:** Battle mode with rapid attack sounds causes ear strain.
**Solution:** Attack sounds are short (<200ms) with soft attack. Battle backgrounds are sparse. Max 20 sounds/min.

---

## 44. Future Expansion Strategy

### 44.1 Web Audio API Advanced Features

- **Spatial Audio:** Position sound sources in 3D space using PannerNode
- **Dynamic Compression:** Use DynamicsCompressorNode for consistent volume
- **Convolution Reverb:** Real acoustic space simulation for celebrations
- **Granular Synthesis:** Create evolving textures for ambient/music

### 44.2 Voice System Expansion

- TTS integration for Arabic pronunciation (via `/api/audio/{wordId}`)
- Multiple voice options (male/female, various accents)
- Voice speed control (normal/slow/very_slow — already implemented)
- Phrase-level pronunciation with word highlighting

### 44.3 Procedural Audio

Rather than pre-recorded SFX, generate sounds procedurally:

```typescript
// Generate XP chime from oscillators
function generateXpChime(ctx: AudioContext, pitch: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = pitch;
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  return { osc, gain };
}
```

Benefits:
- Zero asset download
- Infinite variation
- Perfect sync with game parameters
- Smallest possible memory footprint

### 44.4 Adaptive Music System

Future music system that adapts to user state:
- Calm during learning, energetic during combos
- Dynamic layer mixing based on game intensity
- Seamless transitions between emotional states
- User skill level affects music complexity (beginner → simpler, expert → richer)

### 44.5 Social Audio Features

- Share audio snippets with friends (battle victory sound as shareable asset)
- Custom notification sounds for friend challenges
- Group battle audio experiences (synchronized fanfare for team victories)

### 44.6 Audio Analytics

Track audio effectiveness:
- Mute rate per session (high mute rate → audio might be fatiguing)
- Audio setting changes (users turning off specific layers)
- Session length correlation with audio preferences
- A/B test different sound variants for retention impact

---

## Appendix A: Quick Reference

### Sound → Event Map

| Sound | Event | Priority | Duration | Volume |
|-------|-------|----------|----------|--------|
| Correct chime | Correct swipe/answer | P2 | 400ms | -12dB |
| Wrong tone | Wrong swipe/answer | P2 | 500ms | -18dB |
| XP sparkle | XP gain | P3 | 200ms | -12dB |
| Combo chime | 2-4 combo | P2 | 350ms | -9dB |
| Combo triad | 5-9 combo | P2 | 500ms | -6dB |
| Combo chord | 10+ combo | P2 | 800ms | -3dB |
| Combo break | Combo reset | P3 | 200ms | -15dB |
| Button click | UI tap | P3 | 50ms | -18dB |
| Tab whoosh | Nav switch | P3 | 100ms | -18dB |
| Page enter | Route change | P3 | 150ms | -20dB |
| Battle start | Battle begin | P1 | 800ms | -12dB |
| Battle hit | Correct attack | P2 | 200ms | -9dB |
| Battle hurt | Wrong answer | P2 | 300ms | -15dB |
| Special attack | 8+ combo | P1 | 600ms | -6dB |
| Victory fanfare | Battle win | P1 | 1200ms | -6dB |
| Defeat tone | Battle loss | P1 | 1200ms | -12dB |
| Level up | Level increase | P1 | 1500ms | -6dB |
| Streak bell | Streak milestone | P1 | 1000ms | -9dB |
| Badge unlock | Achievement earned | P1 | 600ms | -9dB |
| Chest build-up | Chest opening | P1 | 600ms | -12dB |
| Chest reveal | Reward reveal | P1 | 300ms | -9dB |
| Mascot happy | Positive event | P2 | 200ms | -15dB |
| Mascot excited | Big event | P2 | 300ms | -12dB |
| Ambient bed | Always (home/swipe) | P4 | Loop | -24dB |
| Battle music | Battle active | P4 | Loop | -20dB |

### Volume Quick Reference

```
  -3dB:  Peak celebration (legendary reward, 10+ combo)
  -6dB:  Major reward (level up, victory, rank up)
  -9dB:  Strong feedback (combo 5+, badge unlock)
  -12dB: Standard feedback (correct, XP, chest)
  -15dB: Subtle feedback (mascot, streak bell)
  -18dB: Minimal feedback (wrong, UI taps, social)
  -20dB: Near-subliminal (page enter, ambient edge)
  -24dB: Ambient threshold (home/swipe background)
  -30dB: Barely audible (rhythmic pulse layer)
```

### Timing Quick Reference

```
  50ms:   Button tap, micro feedback
  100ms:  UI whoosh, tab switch, click release
  200ms:  XP sparkle, mascot chirp, impact thud
  300ms:  Correct/wrong primary, combo tier, badge unlock
  400ms:  Correct chime full, streak bell base
  500ms:  Wrong tone full, combo triad, chest build
  600ms:  Special attack, chest reveal, mascot excited
  800ms:  Combo max, battle start, chest full
  1000ms: Streak milestone, session complete
  1200ms: Victory fanfare, defeat tone, level up base
  1500ms: Level up full, legendary unlock
```

---

*Harf Sound Design v1.0 — Designed for warm, ethical, emotionally engaging mobile learning audio.*
