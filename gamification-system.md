# Gamification System — Harf

> **Document Owner:** Game Economy & Retention Design
> **Version:** 1.0
> **Status:** Production Reference
> **Last Updated:** 2026-05-31

---

# 1. Gamification Philosophy

Harf's gamification is built on one core belief:

> Learning Arabic should feel like playing a great mobile game — not studying.

Every system is designed to answer one question: *"Does this make the player want to come back tomorrow?"*

**Three pillars:**
- **Mastery** — visible skill progression (vocabulary, grammar, listening, pronunciation)
- **Status** — social recognition (leagues, ranks, achievements, profile prestige)
- **Addiction** — healthy daily loops (streaks, combos, rewards, surprise mechanics)

**Hard constraints (non-negotiable):**
- Learning outcomes always > engagement metrics
- No gambling mechanics (loot boxes, random rewards tied to spend)
- No punishing failure states that feel unfair
- Always offer a recovery path

---

# 2. Core Retention Principles

| Principle | Application |
|---|---|
| **Habit loop** | Trigger (notification) → Action (1 session) → Reward (XP/combo) → Investment (streak grows) |
| **Variable rewards** | Chests, surprise badges, random bonus XP |
| **Endowed progress** | Show "3/5 daily missions" to compel completion |
| **Loss aversion** | Streak freezing, demotion danger zone |
| **Sunk cost** | Profile identity, rank history, badge collection |
| **Social proof** | Friend leaderboard, "82% of players" insights |
| **Scarcity** | Limited league spots, seasonal badges |
| **Curiosity gap** | Hidden achievements, locked rank preview |

**Retention targets:**
- D1: ≥60% (immediate satisfaction from first swipe session)
- D7: ≥40% (streak attachment + league placement)
- D30: ≥25% (identity formed, social circle established)

---

# 3. Psychological Design Goals

| Goal | System | Mechanism |
|---|---|---|
| **Competence** | Leveling + Skill Bars | Visible progress, "I'm getting better" |
| **Autonomy** | Battle/Swipe choice | Mode selection, enemy difficulty |
| **Relatedness** | Friend Activity + Leaderboard | Social comparison, rivalry |
| **Status** | Rank + League + Badges | Prestige symbols, profile showcase |
| **Purpose** | Daily Missions + Streaks | "My daily goal", "I'm committed" |
| **Curiosity** | Chests + Hidden Achievements | "What's inside?", "How do I unlock?" |
| **Fear (healthy)** | Demotion Zone + Streak Danger | "I don't want to lose my rank" |

---

# 4. Player Motivation Types

| Type | % of players | Drives | Retention lever |
|---|---|---|---|
| **Achiever** | 35% | Rank, badges, completion | Leagues, achievements, collections |
| **Social** | 25% | Recognition, comparison | Leaderboard, friend activity, share cards |
| **Explorer** | 20% | Content, variety | Hidden achievements, seasonal events, new words |
| **Competitor** | 15% | Winning, dominance | Battle mode, PvP rank, demotion risk |
| **Casual** | 5% | Low effort, dopamine | Streak rewards, daily bonus, combo feel |

Each system must serve ≥2 player types to justify its complexity.

---

# 5. Reward Loop Architecture

```
                    ┌─────────────────┐
                    │  Engagement      │
                    │  (swipe/battle)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Immediate       │
                    │  Reward          │
                    │  (XP/combo/feel) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Progress        │
                    │  (level/rank/    │
                    │   league/streak) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Identity        │
                    │  (badge/profile/ │
                    │   social status) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Return Intent   │
                    │  (streak/chest/  │
                    │   demotion risk) │
                    └─────────────────┘
```

**Reward timing hierarchy:**
- **Micro (3–10s):** Combo count increase, swipe feedback, damage numbers
- **Meso (30s–5min):** XP tally, session summary, mission progress
- **Macro (hours–days):** Level up, streak milestones, league promotion, chest unlock

---

# 6. XP System

## Core Formulas

```
XP_PER_SWIPE_CORRECT = 10
XP_PER_SWIPE_INCORRECT = 2
XP_BATTLE_WIN_BASE = 50
XP_BATTLE_LOSE = 10
XP_DAILY_MISSION_COMPLETE = 25
XP_COMBO_BONUS_BASE = 5
```

## Combo Multiplier

```
comboBonus = baseBonus × tierMultiplier

Tiers:
  2–4   → ×1.0  (+5 XP)
  5–7   → ×2.0  (+10 XP)
  8–10  → ×3.0  (+15 XP)
  11+   → ×4.0  (+20 XP)
```

## Streak Multiplier (Weekly XP)

```
weeklyMultiplier = 1.0 + (currentStreak × 0.02)
Cap: ×2.0 at 50-day streak
```

## Battle Damage → XP Conversion

```
damagePerCorrect = 15 (base) + (combo × 1) 
xpFromDamage = damageDealt × 0.3 (bonus XP from damage)
```

## Anti-Exploit Rules

- Max 500 XP/hour from swipe sessions
- Battle XP capped at 200/battle
- Daily XP soft cap: 2000 (beyond this, ×0.5 multiplier)
- Streak multiplier does not apply to daily missions
- Duplicate word sessions yield ×0.25 XP (diminishing returns)

## Pacing Reference

| Player Level | XP to Next | Cumulative | Hours to reach |
|---|---|---|---|
| 1 | 100 | 100 | 5 min |
| 5 | 400 | 900 | 45 min |
| 10 | 1,500 | 4,800 | 4 hours |
| 20 | 8,000 | 40,000 | 35 hours |
| 50 | 50,000 | 600,000 | 500 hours |

---

# 7. Leveling System

## Formula

```
xpToLevel = LEVEL_BASE_XP × (level ^ LEVEL_XP_MULTIPLIER)
Where:
  LEVEL_BASE_XP = 100
  LEVEL_XP_MULTIPLIER = 1.5
```

## Progression Table

| Level | XP Needed | Total XP | Estimated Playtime | Reward |
|---|---|---|---|---|
| 1 | 100 | 100 | 5 min | Avatar unlock |
| 5 | 400 | 900 | 45 min | Battle unlock |
| 10 | 1,500 | 4,800 | 4 hrs | Profile banner |
| 15 | 3,500 | 15,000 | 12 hrs | New mascot expression |
| 20 | 8,000 | 40,000 | 35 hrs | Custom streak icon |
| 30 | 25,000 | 150,000 | 130 hrs | Legendary badge |
| 50 | 100,000 | 1,200,000 | 1000 hrs | Sultan rank unlock |

## Level-Up Reward Pacing

Every level-up grants:
- Base: +50 XP (rollover)
- Milestone levels (5, 10, 15…): +100 XP + cosmetic
- Every 10 levels: Rare chest

---

# 8. Rank System

## Ranks

| Rank | XP Range | Icon | Prestige Level | Demotion Protection |
|---|---|---|---|---|
| Pemula | 0–499 | 🌱 | — | None |
| Musafir | 500–1,499 | 🚶 | Low | None |
| Penuntut Ilmu | 1,500–2,999 | 📚 | Medium | 1 free demotion/week |
| Perak | 3,000–5,999 | ⭐ | High | 2 free demotions/week |
| Sultan Arabic | 6,000+ | 👑 | Elite | Permanent (no demotion) |

## Promotion Logic

```
promotionXP = nextRank.minXP - currentRank.minXP
progress = (playerXP - currentRank.minXP) / promotionXP
```

## Design Rationale

- Early ranks (Pemula, Musafir) are quick to pass through (2–3 sessions each)
- Mid ranks require consistent weekly play
- Sultan is aspirational — takes 3+ months of daily play
- No demotion from Sultan creates a "retired elite" status that rewards long-term commitment

---

# 9. League System

## Six Leagues

| League | Weekly XP Threshold | Players per League | Promotions | Demotions |
|---|---|---|---|---|
| Bronze 🥉 | 0–499 | 50 | Top 10 | None |
| Silver 🥈 | 500–1,499 | 40 | Top 8 | Bottom 5 |
| Gold 🥇 | 1,500–2,999 | 30 | Top 6 | Bottom 4 |
| Emerald 💎 | 3,000–4,999 | 20 | Top 4 | Bottom 3 |
| Diamond 💠 | 5,000–7,999 | 15 | Top 3 | Bottom 2 |
| Sultan 👑 | 8,000+ | 10 | Top 1 | Bottom 1 |

## Weekly Reset

- Every Monday 00:00 UTC
- XP resets to 0 for all players
- League placement based on previous week's finish
- Reward distribution at reset time

## Promotion/Demotion Rules

```
Promotion: Finish in top X of your current league
Demotion: Finish in bottom Y of your current league
Safety: Middle positions stay

Edge cases:
  - New players start in Bronze
  - Inactive players demote 1 league/week (max 2 demotions)
  - Sultan last place → Diamond (no direct drop to lower)
  - Returning players (7+ days inactive) get 1 free league protection
```

## Reward Pacing (Weekly)

| League | XP Bonus | Coins | Cosmetic |
|---|---|---|---|
| Bronze | +50 | — | — |
| Silver | +100 | — | Badge |
| Gold | +200 | 50 | Badge + Border |
| Emerald | +350 | 100 | Badge + Profile glow |
| Diamond | +500 | 200 | Badge + Animated border |
| Sultan | +1000 | 500 | Badge + Exclusive mascot |

---

# 10. Combo System

## Escalation Tiers

| Combo | State | Visual | Audio | XP Bonus |
|---|---|---|---|---|
| 1 | Normal | Default | — | — |
| 2–4 | Warm | Subtle glow | Short chime | +5 XP |
| 5–7 | Hot | Gold glow, pulse | Rising tone | +10 XP |
| 8–10 | Blazing | 🔥 icon, screen shake | Build-up | +15 XP |
| 11+ | Legendary | Full screen aura | Climax | +20 XP |

## Reset Rules

- Wrong answer: Combo → 0
- Session end: Combo preserved for next session (within 2 hours)
- App close mid-card: Combo preserved (grace period)
- Battle mode: Combo resets per battle
- Daily reset: Combo resets at midnight

## Psychology Design

- First 3 combos are deliberately easy to build confidence
- 5–7 range is where dopamine spikes — visual + audio escalation
- Losing a combo at 8+ should feel painful (loss aversion drives caution)
- Comeback: Getting back to previous combo height gives bonus XP (1st time only)

---

# 11. Streak System

## Core Rules

```
streakDays = consecutive days with ≥1 learning session
session threshold = 1 card swipeed OR 1 battle completed
grace period = session completed within 2 hours of midnight counts for either day
```

## Streak Freeze

```
freezeAllocation = floor(streakDays / 7) — 1 per week
maxFreezes = 7 (2 weeks of perfect attendance)
freezeConsumption: Auto-consumed on first missed day
freezeRefill: 1 per week on Sunday
```

## Milestone Rewards

| Streak | Reward | Psychological Hook |
|---|---|---|
| 3 days | +50 XP bonus | "I've started something" |
| 7 days | Badge: 🔥 Seminggu Penuh | Pride |
| 14 days | 1 Streak Freeze | Investment protection |
| 30 days | Badge: 🌟 Sebulan | Identity: "I'm a learner" |
| 50 days | Custom streak icon | Long-term attachment |
| 100 days | Legendary badge + XP x2 week | Elite status |
| 365 days | Personal message from team | Emotional peak |

## Danger States

```
DANGER_DAYS = 0 (first missed day)
DANGER state: streak counter turns red, notification sent
Freeze consumed automatically
If no freeze: streak → 0

Recovery:
  - First day after break: x1.5 XP for 1 session
  - 3-day block after 7+ streak: comeback bonus chest
  - 7-day block: "Welcome back" bonus (500 XP + free freeze)
```

## Comeback Mechanics

| Break Length | Bonus |
|---|---|
| 1–2 days | Normal play (no penalty beyond streak reset) |
| 3–6 days | 100 XP comeback bonus, 1 free freeze |
| 7–13 days | 300 XP + 2 free freezes + "Welcome Back" chest |
| 14–29 days | 500 XP + 3 free freezes + rare badge chance |
| 30+ days | 1000 XP + full freeze refill + guaranteed rare badge |

---

# 12. Daily Mission System

## Mission Pool (15 rotating objectives)

| Mission | Target | Reward | Type |
|---|---|---|---|
| "Learn 10 words" | 10 correct swipes | 50 XP | Core |
| "Win 3 battles" | 3 battle victories | 75 XP | Core |
| "Maintain 5 combo" | Reach 5 combo in 1 session | 30 XP | Skill |
| "Complete 2 lessons" | 2 full swipe sessions | 40 XP | Core |
| "Listen to 5 words" | 5 audio plays | 25 XP | Exploration |
| "Play 1 battle" | 1 battle (any result) | 20 XP | Participation |
| "No wrong answers" | Perfect session (10+ cards) | 80 XP | Challenge |
| "Streak saver" | Complete any session | 15 XP | Easy win |
| "Battle hard mode" | Win battle on medium+ | 100 XP | Challenge |
| "Social share" | Share progress card | 15 XP | Social |
| "3 categories" | Learn words from 3 categories | 45 XP | Exploration |
| "Score 500 XP" | Earn 500 XP in a day | 60 XP | Grind |
| "Beat a friend" | Outscore a friend on leaderboard | 40 XP | Social |
| "Combo king" | Reach 8+ combo | 55 XP | Skill |
| "Speed learner" | Answer 5 in under 30s | 50 XP | Speed |

## Rotation Logic

- 3 missions active per day (always)
- 1 easy, 1 medium, 1 challenging
- Missed missions do not stack (daily reset)
- One "reroll" per day (swap 1 mission)
- Streak milestone days (+7): bonus mission slot

## Difficulty Balancing

```
Easy (1): Complete-able in 2–5 minutes
  Weight: 30% chance in pool

Medium (2–3): Requires 10–15 minutes or moderate skill
  Weight: 50% chance

Hard (4–5): Requires focused play or specific skill
  Weight: 20% chance
```

---

# 13. Achievement System

## Badge Categories

| Category | Count | Examples |
|---|---|---|
| Progression | 10 | First swipe, Level 10, Level 50 |
| Streak | 5 | 7 days, 30 days, 100 days, 365 days |
| Battle | 6 | First win, 10 wins, 100 wins, No-damage victory |
| Combo | 4 | Combo 5, 10, 20, 50 |
| Vocabulary | 6 | 50 words, 200 words, 1000 words, All categories |
| Social | 3 | Share 5 times, Top 10 league, Friend invite |
| Hidden | 8 | Secret conditions (see below) |
| Seasonal | 4+ | Ramadan special, Summer challenge, etc. |
| **Total** | **46+** | |

## Rare/Legendary Badges

| Badge | Rarity | Condition | Share-worthy? |
|---|---|---|---|
| Sultan Arabic | Legendary | Reach Sultan league | ★★★★★ |
| Centurion | Legendary | 100-day streak | ★★★★★ |
| Vocabulary Master | Epic | 1000 words | ★★★★ |
| Combo God | Epic | 50 combo | ★★★★ |
| Undefeated | Rare | Win 10 battles in a row | ★★★ |
| Night Owl | Hidden | Play between 2–4 AM | ★★★ |
| Early Bird | Hidden | Play before 6 AM for 7 days | ★★★ |
| Polyglot Potential | Hidden | Study 3 categories in 1 day | ★★ |

## Hidden Achievement Discovery

Hidden achievements create curiosity loops:
- Progress shows as "???" with percentage (e.g., "Secret 67% complete")
- When discovered, full badge reveals with unlock animation
- No hints — community discovery drives discussion
- Season-specific hidden achievements rotate

---

# 14. Reward Chest System

## Chest Types

| Chest | Unlock Time | Contents | Drop Rate |
|---|---|---|---|
| Wooden | 30 min | 10–30 XP, +1 freeze (rare) | Per swipe session clear (1/3) |
| Silver | 2 hours | 50–100 XP, freeze, badge shard | Per 5 sessions |
| Gold | 6 hours | 150–300 XP, rare badge, 1–3 freeze | Per league promotion |
| Royal | 12 hours | 500–1000 XP, guaranteed rare+ badge | Weekly reward |
| Legendary | 24 hours | 2000+ XP, guaranteed legendary badge | Season pass, events |

## Unlock Mechanics

```
Player earns chest → decides to unlock
  Option A: Wait (free)
  Option B: Instant unlock via watching ad (1x/day)
  Option C: "Speed up" — answer 5 questions correctly (1x/day)
  
Chest queue: Max 4 chests at a time
Opening animation: Scale bounce → glow → reveal (800ms)
Reveal order: XP first → freeze → badge (anticipation build)
```

## Anticipation Psychology

- Chest timer creates "return at 2:30 PM" hooks
- Near-completion chests trigger notification
- Badge shard system: 10 shards = 1 rare badge of choice
- Long timer chests give best rewards — delayed gratification training
- "Chest full" notification creates urgency to open/clear

---

# 15. Battle Reward Logic

## Win Rewards

```
baseXP = 50
comboBonus = min(combo × 5, 50)
timeBonus = 20 if answered all in <30 seconds
streakMultiplier = 1.0 + (currentStreak × 0.01) — max ×1.5
difficultyMultiplier: easy ×1.0, medium ×1.5, hard ×2.0

totalXP = (baseXP + comboBonus + timeBonus) × streakMultiplier × difficultyMultiplier
```

## Lose Rewards

```
baseXP = 10
participationBonus = questionsAnswered × 2
totalXP = max(15, baseXP + participationBonus)
```

## Balance Notes

- Winning must always feel significantly better than losing (~3–5× more XP)
- But losing shouldn't feel wasted — always earn at least 15 XP
- Streak multiplier on losses is capped at ×1.0 (no streak benefit for losing)
- First battle of the day: ×1.5 XP bonus (daily hook)

---

# 16. Swipe Session Reward Logic

## Per-Card Rewards

```
correct: 10 XP + (combo × 1) bonus XP
incorrect: 2 XP (participation)
sessionComplete: +20 XP bonus
perfectSession (no errors): +50 XP bonus
```

## Session Pacing

```
Session length: 10 cards = ~2–3 minutes
Optimal daily sessions: 3–5 (30 minutes total)
First session of day: ×1.5 XP
Session cooldown: None (play freely)
```

## End-of-Session Summary

```
Display:
  "You learned X new words!"
  "Best combo: X"
  "Total XP: +X"
  "Daily progress: X/2000 XP"

Animation: Scale-in card with staggered number animations (800ms)
```

---

# 17. Comeback Reward System

## Tiers

| Inactive Duration | Reward |
|---|---|
| 2–3 days | 100 XP + 1 freeze |
| 4–6 days | 200 XP + 2 freezes + "Welcome back" mission |
| 7–13 days | 500 XP + 3 freezes + rare badge chance |
| 14–29 days | 1000 XP + 5 freezes + guaranteed rare badge |
| 30+ days | 2000 XP + 7 freezes + "Phoenix" badge (limited) |

## Special "Phoenix" Mechanic

For returns after 30+ days:
- "Phoenix Rising" badge (account-bound, shown in profile)
- 3 days of ×2 XP on all activities
- Free league protection (no demotion for 1 week)
- Unlocked all daily mission slots for 3 days

## Design Notes

- Comeback rewards scale with previous engagement level
- A player who had a 50-day streak returns → bigger welcome than a casual
- No comeback reward if returning within 24 hours (prevents gaming)
- Comeback chest contains variable rewards based on previous playtime
- "Comeback chain": If player returns and plays 7 consecutive days, bonus chest at day 7

---

# 18. Social Motivation System

## Friend Activity Feed

- See friends' recent achievements
- Friend streak comparison
- "Amirah just won a battle!" notifications
- Weekly friend leaderboard (separate from global)

## Share Card Generation

```
Card types:
  - Streak card: "X days! 🔥"
  - XP card: "Earned X XP this week"
  - Rank card: "Reached Perak!"
  - Achievement card: Badge unlock celebration
  - Battle card: "Victory! X combo!"

Format: 1080×1920 (Story-optimized)
Visual: Gradient background + animated elements + user identity
```

## Social Comparison Pressure

- "You're 320 XP behind Faris" (direct comparison)
- "Only 2 people in your league are online now" (scarcity)
- "You learned more words than 82% of players!" (positive reinforcement)
- "Rank #3 — 1 more battle might save your spot" (urgency)

---

# 19. Competition Psychology

## Leaderboard Design Principles

- Display top 10 + user position always visible
- Show 3 people above and 3 below (proximity competition)
- Weekly reset creates repeated "fresh start" motivation
- League tiers prevent new players from feeling hopeless

## Rival System

- Automatic: The player directly above and below on leaderboard
- "Rival" label with special icon on leaderboard
- Rival activity shown in feed ("Your rival Amirah just earned 150 XP!")
- Beat rival notification: "You passed Amirah! 🎉"
- Rival resets weekly

---

# 20. FOMO & Retention Mechanics

| Mechanic | FOMO Trigger | Retention Impact |
|---|---|---|
| Streak counter | "I'll lose my X-day streak" | Daily login |
| League demotion danger | "I'll drop to Bronze" | Min 3 sessions/week |
| Chest timer | "My Gold chest is ready" | Return at specific time |
| Daily missions reset | "I'll miss the 50 XP" | Daily completion |
| Seasonal badge timer | "Limited time only" | Extended engagement |
| Friend leaderboard | "I'm falling behind" | Competitive grinding |
| Rival alert | "They're gaining on me" | Overtake behavior |

## Ethical Limits

- No notifications after 9 PM local time
- Max 3 push notifications per day
- "Take a break" reminder after 60 minutes of continuous play
- Streak freeze prevents unhealthy obsession over 1 missed day

---

# 21. Reward Timing Strategy

## Micro Timing (< 1 min)

| Action | Delay | Reward |
|---|---|---|
| Correct swipe | 0ms | Instant combo update |
| Correct swipe | 100ms | XP +1 animation |
| Answer battle question | 0ms | Damage number |
| Battle victory | 300ms | Victory banner |

## Meso Timing (1–30 min)

| Action | Delay | Reward |
|---|---|---|
| Session complete | 500ms | Summary card |
| Daily mission complete | 200ms | Mission badge + XP |
| Level up | 300ms | Level-up modal |
| Chest ready | 0ms | Notification |

## Macro Timing (hours–days)

| Action | Delay | Reward |
|---|---|---|
| Streak milestone | Notification at milestone | Badge + bonus |
| League reset | Monday 00:00 UTC | Weekly reward |
| Seasonal event | Event launch | Limited badge |
| Comeback bonus | First login after break | Chest + XP |

---

# 22. Dopamine Feedback Design

## Micro-Dopamine (per action)

```
Visual: Instant color shift (green = correct, red = incorrect)
Audio: Short chime (ascending pitch with combo)
Haptic: Short vibration on correct (mobile)
Score: +10 with bounce animation
Timing: < 100ms feedback loop (critical for flow)
```

## Meso-Dopamine (per session)

```
Progress bar fill animation (smooth, 400ms)
Combo counter scale bounce (spring physics)
XP tally with number animation (counter-up, 600ms)
Session summary with stat cards (staggered reveal, 800ms)
```

## Macro-Dopamine (per milestone)

```
Level-up screen (full screen, 1.5s celebration)
Badge unlock (card flip + glow, 1s)
League promotion (confetti + banner, 2s)
Streak milestone (fire animation scale escalation)
```

---

# 23. Progress Visualization Strategy

## Always-Visible Progress

- Home screen: XP bar (always on hero card)
- Header: Level + XP (persistent)
- Session: Progress dots (every card)
- Profile: Stat cards (aggregate view)
- League: Position + XP gap (social context)

## Celebration Screens

| Event | Duration | Elements |
|---|---|---|
| Level up | 1.5s | Scale-up number, burst particles, badge |
| Badge unlock | 1s | Card flip, glow reveal, sparkle trail |
| League promotion | 2s | Full confetti, rank emblem, XP bonus |
| Streak milestone | 1.5s | Fire escalation, streak number, flair |
| Battle victory | 1.2s | Victory text, enemy KO, XP counter |

---

# 24. Difficulty Scaling

## Swipe Mode

```
First session: 10 easiest words (common greetings)
After 50 words: Medium difficulty introduced
After 200 words: Hard difficulty words appear
After 500 words: Mix of all levels with previous review words
Review ratio: 70% new / 30% review
```

## Battle Mode

```
First 3 battles: Easy enemies only (60 HP)
After 5 wins: Medium enemies unlocked (80–100 HP)
After 20 wins: Hard enemies unlocked (130 HP)
Boss battles: Every 10 wins (150+ HP, special mechanics)
```

## Adaptive Difficulty

```
If player accuracy > 90% over 20 cards → increase difficulty
If player accuracy < 50% over 10 cards → decrease difficulty
Difficulty changes are smooth (not instant) — 5-card grace period
Never show difficulty decreased explicitly (avoid demoralization)
```

---

# 25. Learning vs Reward Balance

## Rule of Thirds

```
33% of session time: Learning (new words, grammar exposure)
33% of session time: Practice (recall, swiping, battles)
33% of session time: Reward (animations, summary, XP, open chests)
~1% buffer/transition
```

## Why This Matters

- Too much reward = feels like game with no substance (churn after novelty wears)
- Too much learning = feels like studying (churn from boredom/frustration)
- The balance must be invisible to the player — they should feel like they played a game, not that they followed a ratio

## Implementation

- New word introduction: Always pair with a swipeable card (learn by doing)
- Reward screens are never skippable under 500ms (dopamine needs time to land)
- Learning screens never exceed 3 new words without a practice loop
- After 5 new words → automatic practice round (no new content)

---

# 26. Punishment Avoidance Strategy

## What NOT to do

- ✗ Remove XP for wrong answers (never subtract)
- ✗ Streak reset after 1 missed day without freeze (too punishing)
- ✗ Demote more than 1 league per week (prevents spiral)
- ✗ Lock content behind paywalls for struggling players
- ✗ Show "you're worse than average" comparisons

## What TO do instead

- ✓ Wrong answer = 2 XP instead of 10 XP (participation reward)
- ✓ Streak freeze system (grace for occasional miss)
- ✓ Demotion protection (2 free passes per week)
- ✓ "You can do it!" mascot encouragement on mistakes
- ✓ Review mode for struggling words (no XP penalty)

---

# 27. Session Length Design

## Optimal Session

```
Micro-session: 2–3 minutes (10 cards)
  → Ideal for commute, break, waiting

Standard session: 5–8 minutes (25 cards + 1 battle)
  → Ideal daily engagement

Extended session: 15–20 minutes (50 cards + 3 battles)
  → For motivated learners / grinding
```

## Session Flow

```
1. Open app → Daily mission reminder (5s)
2. First card appears → immediate interaction (instant)
3. Cards 1–10 → flow state (2 min)
4. Quick summary → encouragement (10s)
5. Optional: Battle (2–3 min)
6. Daily completion → reward screen (15s)
Total: 3–8 min
```

## Long Session Protections

- After 30 min: "You've done great today!" nudge (not block)
- After 60 min: "Take a break?" suggestion
- XP multiplier decreases after 30 cards in 1 session
- No hard limit — player autonomy respected

---

# 28. Casual vs Hardcore Balance

| Dimension | Casual (60% of players) | Hardcore (40% of players) |
|---|---|---|
| Daily time | 3–8 min | 15–30 min |
| Sessions/day | 1–2 | 3–6 |
| Primary mode | Swipe | Swipe + Battle |
| Social engagement | Moderate | High |
| League aspiration | Silver–Gold | Emerald–Sultan |
| XP/day target | 100–300 | 500–2000 |
| Streak value | High (pride) | Very high (identity) |
| Spend likelihood | Low | Medium |

## System Tuning

- Daily missions are completable in 5 min for casuals
- Leaderboard rewards both volume (XP) and efficiency (accuracy)
- Battle mode rewards skill, not just time spent
- Streak system works identically for both segments (fair)
- Hardcore players get more cosmetics (badges, borders) — casuals get adequate XP

---

# 29. Weekly Reset System

## What Resets

- Weekly XP counter (affects league placement)
- Daily missions refresh
- Chest queue resets (max chests refresh)
- Freeze allocation refills (1 per week)
- Rival assignment recalculates

## What Does NOT Reset

- Total XP (permanent progression)
- Level (permanent)
- Rank/Pangkat (very slow-moving, months)
- Badges (permanent collection)
- Streak (lives until broken)
- Profile customization (persistent)

## Reset Experience

```
Monday 00:00 UTC:
  1. Player opens app
  2. "Weekly Recap" screen (stats from last week)
  3. Reward distribution (league-based)
  4. New league assignment animation
  5. Fresh leaderboard with new rivals
```

---

# 30. Seasonal Event System

## Event Cadence

| Season | Duration | Theme | Special Mechanic |
|---|---|---|---|
| Ramadan | 30 days | Spiritual | Double XP on Quranic vocab |
| Summer Challenge | 14 days | Explorer | New word categories, beach theme |
| Arabic Language Day | 7 days | Culture | History facts + vocab |
| New Year | 7 days | Reflection | Year-in-review stats |
| Anniversary | 14 days | Celebration | Limited badge + bonus |

## Seasonal Rewards

- Exclusive badges (never return)
- Limited-time mascot expressions
- Themed profile borders
- Double XP events (1–2 days)
- Special battle enemies (seasonal themes)

## Design Rules

- Seasons never lock basic functionality (FOMO on cosmetics only)
- Seasonal content is ≥50% achievable in casual play
- No seasonal content requires payment
- Old seasonal badges are visible but unobtainable (prestige)

---

# 31. Prestige System

## How it Works

```
At max level (50):
  Option to "Prestige" — reset to Level 1
  Keep: badges, cosmetics, streaks, profile
  Lose: level, XP
  Gain: Permanent ×1.1 XP multiplier (stacks)
  Prestige icon shown on profile
  Max prestige: 10 (×2.0 XP at Prestige 10)
```

## Psychology

- Prestige is for hardcore players only (not pushed to casuals)
- Prestige = visible status symbol (glowing badge)
- Each prestige also unlocks exclusive cosmetics
- Prestige 1 is a "I really love this app" badge
- Prestige 10 is extremely rare and respected

---

# 32. Cosmetic Reward System

## Cosmetic Types

| Type | How to Get | Rarity |
|---|---|---|
| Avatar initials | Default unlock | Common |
| Profile borders | League rewards, events | Common–Epic |
| Badge display slots | Level milestones | Common |
| Mascot expressions | Achievements, events | Rare |
| Streak icons | Streak milestones | Rare–Epic |
| Profile themes | Prestige, legendaries | Epic–Legendary |
| Animated borders | Sultan league, Prestige 5+ | Legendary |
| Custom mascot skins | Seasonal events | Legendary |

## Cosmetic Philosophy

- Cosmetics are 100% earnable through gameplay (no direct purchase of rare cosmetics)
- Cosmetics are the primary status symbol for hardcore players
- Common cosmetics are distributed freely to maintain engagement
- Legendary cosmetics require real commitment (100-day streak, Prestige)
- Cosmetics should create "I want that" desire — drive play, not spend

---

# 33. Rare Reward Psychology

## Scarcity Mechanics

```
Badge rarity distribution:
  Common: 60% (freely given)
  Rare: 25% (requires effort)
  Epic: 10% (requires dedication)
  Legendary: 5% (extremely rare / exclusive)
```

## "Shiny" Effect

- Epic and Legendary badges have animated glow
- Badges displayed on profile have rarity border color
- Unlocking a rare+ badge triggers a full-screen celebration
- Other players can see your rare badges (social prestige)
- Legendary badges make a sound when viewed in profile

---

# 34. Surprise Reward Mechanics

## Random Bonus XP

```
After any session (5% chance):
  "Bonus XP!" with sparkle animation
  Amount: 10–50 XP (random)

After any correct answer (1% chance):
  "Lucky swipe! +100 XP!"
```

## "Just Because" Rewards

- First app launch of the day always gives 5 XP (even before playing)
- After 10 consecutive correct answers in battle: "Flawless!" bonus
- Random daily "gift" appears on home screen (small chest)
- Friend activity: "You inspired Amirah to study!" +10 XP

## Psychology Notes

- Surprise rewards are small but unpredictable — keeps dopamine system active
- Variable ratio reinforcement schedule (most addictive, but ethical at low values)
- Never surprise charge or surprise negative outcome
- Surprise is always positive, never negative (rewards only, no penalties)

---

# 35. Motivation Recovery System

## When Player is Struggling

```
Low accuracy (<40% over 10 cards):
  → "Let's review some old words" (easier mode)
  → Mascot: "No worries! Look at this one again."
  → XP boosted: +50% for review cards

Lost streak (after 7+ day streak):
  → "You built a 14-day streak before! You can do it again."
  → 1 free freeze
  → "Streak Restore" button: Watch ad → restore 3-day streak

Back-to-back battle losses (3+):
  → Easy enemy unlocked temporarily
  → Mascot: "That was tough. Try this easier opponent."
  → +20 XP participation bonus
```

## Prevention > Recovery

- Before a losing streak becomes demoralizing, the system proactively eases difficulty
- Streak freeze is given before the streak breaks (prevention)
- "Losing" in battle gives enough XP to feel worthwhile
- No "losing streak" stat displayed anywhere (avoid shame)

---

# 36. Burnout Prevention System

## Active Detection

```
Session > 30 min → "Great focus! But rest is part of learning."
Daily sessions > 5 → XP multiplier reduced after 5th session
Weekly play > 5 hours → "You're on fire! Take a break tomorrow."
Accuracy < 30% → Trigger recovery mode

These are suggestions, not blocks — player can always continue
```

## Passive Prevention

- Streak freeze caps at 7 (you can't hoard forever — use or lose)
- No 2× XP events that run longer than 48 hours
- Mission difficulty balanced so casual completion doesn't require grinding
- Leaderboard reset: everyone starts fresh weekly (no permanent ladder anxiety)

---

# 37. Failure Recovery Design

## Types of Failure

| Failure | Recovery Path | Emotional Goal |
|---|---|---|
| Wrong answer | "Almost! Next one." + 2 XP | No shame, try again |
| Battle loss | XP + "Good effort! Want to try again?" | Resilience |
| Streak break | Freeze → "Saved! One more day creates a new chain" | Relief, then motivation |
| League demotion | "You'll bounce back! Here's 100 XP" | Hope |
| Long absence | Welcome chest + XP boost | Excitement to return |

## Design Principle

Every failure has a recovery path that costs the player nothing but time. There is never a "pay to recover" mechanic. Recovery is always:
1. Empathy (mascot message)
2. Path forward (actionable next step)
3. Small reward (participation XP)

---

# 38. Beginner Protection System

## First Session Experience

```
  Tutorial cards: 5 (guided, unskippable tap)
  First 10 cards: Only easy words (common greetings)
  First battle: Special "training" enemy (10 HP, no attack)
  First 3 days: ×2 XP (accelerated start)
  First week: Free streak freeze per day
  First demotion: Protected (no penalty)
  Level 1–3: Only easy missions
  Cannot lose league rank for first 2 weeks
```

## Why

- First impressions are critical for D1 retention
- Early success creates motivation to continue
- Too much challenge early = churn
- Protected period builds initial streak habit
- After 2 weeks, player has enough identity investment to handle mild挫折

---

# 39. Advanced Player Retention

## For Level 30+ / 60+ day Streak Players

```
  - Exclusive "Veteran" border on profile
  - Access to hidden achievement clues
  - Preview upcoming features ("Coming next season...")
  - Beta access for new modes
  - Personal leaderboard (compete with similar-level players)
  - "Legend" chat badge (social recognition)
  - Ability to create custom study lists
```

## Engagement Goal

- Senior players become community leaders
- Their profiles are aspirational for new players
- They provide organic social proof ("Look what's possible")
- They generate word-of-mouth marketing

---

# 40. Whale Psychology Considerations

## Design Boundaries

```
  - Max spend: $29.99/month (subscription)
  - No infinite spending mechanics
  - No competitive advantage from spending (cosmetics only)
  - Spend accelerates but does not unlock exclusive content
  - Battle is skill-based, not stat-based (no P2W)
```

## Ethical "Whale" Engagement

- Premium cosmetics that are visible and high-status
- Early access to seasonal content
- "Supporter" badge on profile
- No gameplay advantages — leveling field remains fair
- Subscription only accelerates cosmetic collection, not learning

---

# 41. Ethical Gamification Rules

## Hard Rules

1. **No gambling mechanics:** No loot boxes, no random pay-to-unlock, no blind purchases
2. **No sunk cost traps:** Players can always return after any break with a recovery path
3. **No false scarcity:** Timed content returns or has alternative acquisition paths
4. **No shame cycles:** Never compare players negatively. "You're better than X%" is OK
5. **No pay-to-win:** Battle outcomes are skill-based, not spend-based
6. **No addiction exploitation:** Streak freeze prevents unhealthy gameplay over 1 missed day
7. **No dark patterns**:
   - ✗ Confusing cancellation flows
   - ✗ Hidden subscription terms
   - ✗ "Are you sure?" loops on logout
   - ✗ Fake urgency timers
8. **Transparency:** All probabilities (if any) are displayed. All formulas are eventually public.

---

# 42. Anti-Addiction Safeguards

## Built-in Protections

```
  Session timer: Displayed after 30 minutes
  Daily cap: XP soft cap at 2000 (×0.5 after)
  Streak freeze: Prevents obsession over 1 day
  Notification limit: Max 3/day, none after 9 PM
  "Time well spent": Weekly summary of playtime
  Parental controls: Session limit option in settings
  Age gate: Under 13 has restricted social features
```

## Design Philosophy

Gamification should make learning *more* appealing, not make the app harder to leave. If a player wants to stop, the app should respect that decision and welcome them back warmly.

---

# 43. Monetization Boundaries

## What Can Be Monetized

```
  ✓ Premium cosmetics (borders, themes, mascot skins)
  ✓ Streak freeze refills (max 3 purchases/week)
  ✓ XP boost (×1.5 for 24 hours, max 2/week)
  ✓ Season pass (cosmetic-focused, $4.99/month)
  ✓ Ad removal ($2.99/month)
```

## What Will NEVER Be Monetized

```
  ✗ XP directly purchased
  ✗ Battle advantages
  ✗ Skip learning content
  ✗ Remove streak freeze cap entirely
  ✗ Exclusive gameplay modes
  ✗ Rare badges (must be earned)
  ✗ League placement
```

## Subscription Design

```
  "Harf Premium" — $4.99/month:
    - Ad-free experience
    - 5 premium profile themes
    - 2x streak freeze refill speed
    - "Premium" badge on profile
    - Early access to new features
    - Extended statistics (6-month trends)
```

---

# 44. Retention Analytics Recommendations

## Key Metrics to Track

```
  D1/D7/D30 retention (by cohort)
  Average session length
  Sessions per day
  Streak break rate
  Freeze usage rate
  Mission completion rate
  League promotion/demotion rate
  Comeback conversion rate (how many return after break)
  Badge unlock rate per badge
  Battle win/loss ratio
  XP per session (efficiency metric)
  Time to first battle (new users)
  Feature adoption curve
```

## Health Indicators

| Metric | Healthy | Warning | Critical |
|---|---|---|---|
| D1 retention | >60% | <50% | <40% |
| D7 retention | >40% | <30% | <20% |
| Avg session | 5–10 min | <3 min | <1 min |
| Streak freeze usage | 30–50% | >70% | >90% |
| Battle win rate | 45–55% | <40% or >60% | — |
| Mission completion | >70% | <50% | <30% |

---

# 45. A/B Testing Opportunities

## Priority Tests

| Test | Variants | Metric | Duration |
|---|---|---|---|
| Streak freeze cap | 5 vs 7 vs 10 | D7 retention, churn | 2 weeks |
| Daily mission count | 3 vs 4 vs 5 | Mission completion, session length | 2 weeks |
| Chest unlock time | 30min/2hr/6hr vs 1hr/3hr/8hr | Return rate, session frequency | 3 weeks |
| League size | 30 vs 50 vs 100 | Competition feeling, retention | 4 weeks |
| Comeback bonus size | Current vs ×1.5 vs ×2 | Return rate after 7+ days | 3 weeks |
| Combo reset penalty | 0 vs reset vs half | Session length, satisfaction | 2 weeks |
| XP daily cap | 1500 vs 2000 vs no cap | Session count, burnout | 4 weeks |
| First session length | 5 vs 10 vs 15 cards | D1 retention | 1 week |

## Testing Guidelines

- Never test on new users and veterans in the same cohort (segment by tenure)
- Statistical significance: 95% confidence, minimum 10k users per variant
- Run tests for minimum 2 weeks to capture weekly cycle effects
- Monitor for unintended effects on adjacent metrics (e.g., don't boost D1 at cost of D7)

---

# 46. Future Expansion Strategy

## Phase 2 — Social Depth

```
  - Friend system (add/search/remove)
  - Study groups (3–5 players, shared weekly goal)
  - Battle challenges (invite friend to 1v1)
  - Guilds/Clans (shared XP goals, guild leaderboard)
```

## Phase 3 — Content Depth

```
  - Grammar lessons (structured curriculum)
  - Writing practice (Arabic script drawing)
  - Listening comprehension (full sentences)
  - Cultural notes (context for vocabulary)
```

## Phase 4 — Competitive Depth

```
  - Live PvP (real-time battle)
  - Tournament mode (bracket system)
  - Regional leaderboards (country/city)
  - Spectator mode (watch top players)
```

## Phase 5 — Personalization Depth

```
  - Custom avatar creation
  - Profile music (Arabic instrumentals)
  - Study statistics exports
  - Personalized learning path (AI-driven)
```

---

*End of document — Harf Gamification System v1.0*

> "Players should feel that they learned Arabic because of a great game, not that they played a game instead of studying."
