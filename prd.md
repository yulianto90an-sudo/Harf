# PRD — Harf

**Product Requirements Document**  
**Versi:** 1.0  
**Status:** Draft  
**Audience:** Engineering, Design, Product Team  

---

## 1. Product Overview

| Item | Detail |
|------|--------|
| **Nama Produk** | Harf (حرف — berarti "huruf" dalam bahasa Arab) |
| **Kategori** | Mobile-first language learning game |
| **Platform** | Web (PWA-enabled) → Native (future) |
| **Target Market** | Indonesia |
| **Bahasa Aplikasi** | Bahasa Indonesia |
| **Bahasa Target** | Bahasa Arab (Fusha / Modern Standard Arabic) |
| **Inspirasi** | Duolingo, TikTok, Discord mobile, Supercell polish, Linear, idle RPG |
| **Tone** | Playful, modern, rewarding, fast, satisfying |
| **Tech Stack** | Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Supabase, Zustand |

Harf adalah aplikasi web mobile-first yang mengajarkan bahasa Arab kepada pelajar Indonesia melalui mekanisme game modern — swipe gesture, battle RPG, streak system, dan reward loop adiktif.

Bukan aplikasi belajar konvensional. Harf dirancang sebagai game yang kebetulan mengajarkan bahasa Arab.

---

## 2. Vision Statement

> "Membuat belajar bahasa Arab serasa main game — adiktif, memuaskan, dan bikin user ingin balik setiap hari."

Harf tidak akan menjadi aplikasi belajar yang disimpan di folder "produktivitas" dan dilupakan. Harf akan menjadi aplikasi yang user buka setiap hari secara sukarela — karena menyenangkan, bukan karena terpaksa.

---

## 3. Problem Statement

| Problem | Dampak |
|---------|--------|
| Belajar bahasa Arab terasa berat, kaku, dan membosankan | Tingkat putus sekolah tinggi, motivasi rendah |
| Aplikasi belajar Arab yang ada terlalu serius/akademik | Hanya dipakai saat ujian/les |
| Tidak ada gamifikasi yang benar-benar adiktif di pasar Indonesia | User cepat bosan, churn tinggi |
| Akses ke konten Arab interaktif masih terbatas | Metode belajar masih tradisional (buku, video 1 arah) |
| Pelajar Indonesia tidak punya opsi "Duolingo versi Arab" | Gap pasar yang jelas |

**Insight utama:** Target user tidak termotivasi oleh "belajar" — mereka termotivasi oleh **progress, kompetisi, dan reward**. Harf memanfaatkan motivasi intrinsik game untuk mendorong pembelajaran.

---

## 4. Market Opportunity

### Pasar Belajar Bahasa di Indonesia

- Populasi Indonesia: ~280 juta
- Pelajar bahasa Arab: estimasi 30-50 juta (termasuk pesantren, sekolah Islam, umum)
- Penetrasi smartphone: >80%
- Pengguna aktif mobile learning apps di Indonesia: terus tumbuh 15-20% YoY

### Gap Pasar

| Aspek | Duolingo | Aplikasi Arab Existing | Harf |
|-------|----------|----------------------|------|
| Bahasa Arab | ✅ Ada, tapi tidak fokus | ✅ Fokus Arab | ✅ Fokus Arab |
| Mobile-first | ✅ | ❌ Kebanyakan web-only | ✅ |
| Gamifikasi adiktif | ✅ | ❌ Serius/buku digital | ✅ |
| Bahasa Indonesia | ❌ Tidak ada | ✅ | ✅ |
| Battle/PvP | ❌ | ❌ | ✅ |
| Gen Z design | ⚡️ Mulai aging | ❌ | ✅ |

**Opportunity:** Indonesia tidak memiliki "Duolingo untuk bahasa Arab" dengan kualitas polish startup internasional. Harf mengisi celah ini dengan pendekatan mobile-first, gamifikasi dalam, dan desain modern.

---

## 5. Target Audience

### Primary Persona

| Dimensi | Detail |
|---------|--------|
| **Usia** | 14-28 tahun |
| **Pendidikan** | Pelajar SMP/SMA, mahasiswa, umum |
| **Latar Belakang** | Muslim Indonesia, ingin belajar Arab untuk Al-Quran, pemahaman agama, atau minat pribadi |
| **Tech Savviness** | Tinggi — daily user TikTok, Instagram, Discord, Mobile Legends |
| **Motivasi** | Ingin belajar Arab "tapi males belajar serius" |
| **Pain Point** | Merasa belajar Arab itu berat, butuh cara yang FUN |

### Secondary Persona

| Dimensi | Detail |
|---------|--------|
| **Usia** | 28-40 tahun |
| **Profil** | Orang tua/pekerja yang ingin belajar Arab di sela kesibukan |
| **Kebutuhan** | Short session, bisa belajar 5-10 menit |

### Geo Target Awal

Jabodetabek, Jawa Barat, Jawa Timur, Jawa Tengah — daerah dengan penetrasi pesantren/sekolah Islam tinggi.

---

## 6. User Personas

### Persona A: Rizky (16, SMA)

> "Gw pengen ngerti arti ayat Al-Quran, tapi belajar nahwu-shorof tuh berat banget."

- **Daily habits:** Scroll TikTok 2-3 jam, main Mobile Legends, chat Discord
- **Harapan:** Belajar tanpa ngerasa "belajar"
- **Fear of missing:** Ketinggalan streak, ranking turun

### Persona B: Aisyah (22, Mahasiswi)

> "Udah pernah coba Duolingo, tapi bahasa Arab di Duolingo kurang cocok buat orang Indonesia."

- **Daily habits:** Instagram, WhatsApp, YouTube
- **Harapan:** Bisa belajar di sela kuliah, short session
- **Social motivator:** Share progress ke teman, kompetisi

### Persona C: Bambang (35, Karyawan)

> "Pengen ngajarin anak ngaji dengan cara yang lebih seru."

- **Daily habits:** Terbatas waktu, butuh efisiensi
- **Harapan:** 5-10 menit per sesi, progress tracking
- **Motivasi:** Self improvement, contoh buat anak

---

## 7. User Motivation

| Motivasi | Strategi Harf |
|----------|---------------|
| **Progress** | XP bar, level up, rank naik, visual progress selalu terlihat |
| **Kompetisi** | Leaderboard, battle mode, rank system, global vs friends |
| **Completion** | Daily missions, streak, badge collection, achievement |
| **Social** | Share card, invite friends, competing with friends |
| **Curiosity** | Unlock next level, new words, harder challenge |
| **Reward** | XP shower, coin, cosmetic unlock, animation celebration |
| **Fear of losing** | Streak system — user tidak mau kehilangan streak |

**Framework motivasi:** Harf mengkombinasikan **extrinsic motivation** (XP, rank, reward) dengan **intrinsic motivation** (rasa kompeten, progress nyata, mastery bahasa Arab).

---

## 8. Core Value Proposition

| Pertanyaan | Jawaban |
|------------|---------|
| **Apa yang Harf tawarkan?** | Cara belajar bahasa Arab yang serasa main game |
| **Kenapa Harf beda?** | Swipe gesture + battle RPG + streak system yang benar-benar adiktif, bukan quiz biasa |
| **Kenapa Harf untuk Indonesia?** | 100% bahasa Indonesia, konten relevan dengan konteks lokal (Al-Quran, doa sehari-hari) |
| **Kenapa mobile-first?** | Karena target user hidup di mobile, bukan desktop |
| **Kenapa sekarang?** | Belum ada kompetitor yang serius menggarap pasar ini dengan kualitas startup-grade |

**Elevator pitch:** "Harf adalah Duolingo versi Arab untuk Indonesia, tapi dengan battle RPG dan swipe gesture — jadi belajar Arab serasa main game, bukan les."

---

## 9. Product Goals

| Goal | Metrik | Target (3 bulan) |
|------|--------|-------------------|
| **Retention** | D1 retention | >60% |
| **Retention** | D7 retention | >35% |
| **Retention** | D30 retention | >20% |
| **Engagement** | Daily Active Users (DAU) | >5.000 |
| **Engagement** | Session length | >7 menit |
| **Engagement** | Sessions per day | >2 |
| **Streak** | Users with 7+ day streak | >30% active users |
| **Learning** | Words learned per user | >50 kata/bulan |
| **Growth** | Invite rate | >0.2 invites/user |
| **Monetization** | Conversion rate | >3% (pasca MVP) |

---

## 10. Non-Goals

| Non-Goal | Alasan |
|----------|--------|
| Membuat kurikulum Arab akademik setara universitas | Terlalu kompleks untuk MVP, fokus ke basic vocabulary dulu |
| Native app (iOS/Android) di MVP | Web PWA cukup untuk validasi, native nanti |
| Support bahasa asing selain Indonesia | Fokus Indonesia dulu |
| Arabic writing input (keyboard Arab) | Terlalu kompleks secara teknis, fokus ke recognition dulu |
| Real-time multiplayer PvP | Infrastructure berat, AI battle cukup untuk MVP |
| Full Al-Quran content | Butuh resource besar, mulai dari basic vocabulary |
| AI conversation partner | Future feature, terlalu kompleks untuk MVP |

---

## 11. Core Gameplay Loop

### Loop Utama (Daily Session)

```
┌──────────────────────────────────────────────────┐
│  SESSION START                                    │
│  ┌─────────────────────┐                          │
│  │ 1. User buka app     │  (Streak animation!)    │
│  └─────────┬───────────┘                          │
│            ▼                                      │
│  ┌─────────────────────┐                          │
│  │ 2. Swipe Vocab       │  (Core loop: 5-15 cards)│
│  │    - Lihat kata Arab  │                        │
│  │    - Tebak arti       │                        │
│  │    - Swipe kanan/kiri │                        │
│  │    - XP + combo       │                        │
│  └─────────┬───────────┘                          │
│            ▼                                      │
│  ┌─────────────────────┐                          │
│  │ 3. Battle (opsional) │  (RPG battle)           │
│  │    - Lawan AI        │                        │
│  │    - Jawab benar=DMG │                        │
│  │    - Combo=big DMG   │                        │
│  │    - Boss stage      │                        │
│  └─────────┬───────────┘                          │
│            ▼                                      │
│  ┌─────────────────────┐                          │
│  │ 4. Daily Missions  │  (3 tasks)               │
│  │    - Selesai/done   │                        │
│  │    - Claim reward   │                        │
│  └─────────┬───────────┘                          │
│            ▼                                      │
│  ┌─────────────────────┐                          │
│  │ 5. Progress Review  │  (Visual growth)         │
│  │    - XP bar naik    │                        │
│  │    - Streak update  │                        │
│  │    - Rank progress  │                        │
│  └─────────┬───────────┘                          │
│            ▼                                      │
│  ┌─────────────────────┐                          │
│  │ 6. Share/Close      │  (FOMO + social)         │
│  └─────────────────────┘                          │
└──────────────────────────────────────────────────┘
```

### Loop Kedalaman (Advancement)

```
Swipe → dapat XP → Level up → Buka kata baru → Swipe lagi
       → Battle → menang → Rank naik → Buka arena baru
       → Streak nambah → Multiplier meningkat → XP lebih besar
```

---

## 12. User Journey

### Day 1: Onboarding & First Win

1. **Download/Landing →** User melihat halaman menarik dengan ilustrasi mascot
2. **Quick onboarding →** 3 swipe pertama dengan tutorial interaktif
3. **First session →** 10 kartu swipe + 1 battle mudah (dimenangkan)
4. **First XP →** Animasi XP + level up celebration
5. **Streak start →** "Day 1" dengan animasi api kecil
6. **Social trigger →** "Ajak teman untuk bonus XP"

### Day 3: Habit Formation

1. **Streak reminder →** Notifikasi/email "Streakmu dalam bahaya!"
2. **Deeper vocabulary →** Kata baru, review kata lama
3. **Battle difficulty →** AI mulai lebih pintar
4. **Daily mission →** 3 misi sederhana
5. **First rank up →** "Selamat! Kamu sekarang Musafir"

### Day 7: Engagement Deepening

1. **7-day streak →** Animasi besar, reward khusus, share card
2. **Leaderboard unlock →** Bisa lihat peringkat
3. **Friend invite →** Challenge teman
4. **Hard mode battle →** Boss stage
5. **Badge →** "Striker" untuk 7 hari streak

### Day 30: Retention Loop

1. **Streak freeze →** Mulai khawatir kehilangan streak
2. **Rank progress →** Target rank berikutnya
3. **Social pressure →** Teman-teman juga aktif
4. **Content depth →** Vocabulary thematic pack
5. **Cosmetic unlock →** Mascot skin, badge frame

---

## 13. Information Architecture

```
HARF APP
│
├── 🏠 HOME
│   ├── Streak indicator (top)
│   ├── XP bar + Level
│   ├── Quick action: Swipe
│   ├── Quick action: Battle
│   ├── Daily Missions (3 cards)
│   └── Mascot (reactive, top-right)
│
├── 👆 SWIPE
│   ├── Card stack
│   ├── Progress bar (X of Y)
│   ├── Combo counter
│   ├── XP feedback overlay
│   └── Pause menu
│
├── ⚔️ BATTLE
│   ├── Arena screen
│   ├── HP bar (player vs AI)
│   ├── Question card
│   ├── Answer buttons (4)
│   ├── Combo indicator
│   ├── Battle animation
│   └── Result screen
│
├── 📊 PROGRESS
│   ├── XP breakdown
│   ├── Rank display
│   ├── Stats (words learned, streak, battles won)
│   ├── Badge collection
│   └── Learning history
│
├── 👥 SOCIAL
│   ├── Friend leaderboard
│   ├── Global leaderboard
│   ├── Invite friends
│   ├── Friend activity feed
│   └── Share card generator
│
└── ⚙️ PROFILE
    ├── Username / Avatar
    ├── Settings (audio, theme, notification)
    ├── Achievements
    ├── Streak freeze item
    ├── Referral code
    └── Logout
```

**Bottom Navigation (5 tabs):**

| Tab | Icon | Label |
|-----|------|-------|
| Home | 🏠 (icon) | Beranda |
| Swipe | 👆 (gesture icon) | Belajar |
| Battle | ⚔️ (sword icon) | Battle |
| Progress | 📊 (chart icon) | Progress |
| Profile | 👤 (person icon) | Profil |

---

## 14. Feature Breakdown

### Feature Priority Matrix

| Feature | Priority | Effort | Impact |
|---------|----------|--------|--------|
| Swipe Vocabulary | P0 (MVP) | Medium | Sangat Tinggi |
| Battle vs AI | P0 (MVP) | High | Sangat Tinggi |
| Streak System | P0 (MVP) | Low | Sangat Tinggi |
| XP & Level System | P0 (MVP) | Medium | Sangat Tinggi |
| Daily Missions | P0 (MVP) | Medium | Tinggi |
| Rank System | P0 (MVP) | Low | Tinggi |
| Mascot System | P1 (MVP+) | Medium | Tinggi |
| Shareable Cards | P1 (MVP+) | Medium | Tinggi |
| Leaderboard | P1 (MVP+) | Medium | Sedang |
| Friend System | P1 (MVP+) | High | Sedang |
| Badge System | P1 (MVP+) | Medium | Sedang |
| Audio & Listening | P1 (MVP+) | Medium | Tinggi |
| Streak Freeze | P2 (Post-MVP) | Low | Sedang |
| Boss Stage | P2 (Post-MVP) | Medium | Tinggi |
| Cosmetic Shop | P2 (Post-MVP) | High | Sedang |
| AI Conversation | P3 (Future) | Sangat Tinggi | TBD |

---

## 15. Swipe Learning System

### Core Mechanism

| Aspek | Detail |
|-------|--------|
| **Input** | Swipe kanan (tahu artinya) / Swipe kiri (tidak tahu) |
| **Layout** | Full screen card, Arabic text dominan |
| **Feedback** | Animasi swipe follow finger, warna overlay (hijau/merah) |
| **Combo** | Jawaban benar berturut-turut meningkatkan combo |
| **XP** | Base XP + combo bonus + streak multiplier |
| **Edge case** | Tap untuk reveal jawaban jika benar-benar tidak tahu |
| **Edge case** | Undo swipe (5 detik setelah swipe) |

### Card Anatomy

```
┌─────────────────────────────┐
│                             │
│         🔥 COMBO x5         │  (Top-right, muncul saat combo)
│                             │
│                             │
│                             │
│       ┌───────────┐         │
│       │  كِتَاب   │         │  (Arabic text, VERY LARGE)
│       └───────────┘         │
│                             │
│                             │
│   ┌──────┐                  │
│   │ 🔊   │                  │  (Audio button)
│   └──────┘                  │
│                             │
│   ┌──────────────────┐      │
│   │  ✕ Tidak Tahu    │      │  (Swipe left hint)
│   └──────────────────┘      │
│                             │
│                   ┌──────┐  │
│                   │  ✓   │  │  (Swipe right hint)
│                   │ Tahu │  │
│                   └──────┘  │
│                             │
│   Progress: ▓▓▓▓░░░░ 5/10  │  (Bottom progress)
└─────────────────────────────┘
```

### Swipe Mechanics Detail

- **Drag threshold:** 30% of card width untuk trigger swipe
- **Follow finger:** Card mengikuti posisi finger dengan rotation (max 15 derajat)
- **Overlay color:** Hijau (kanan) / Merah (kiri) dengan opacity gradient
- **Snap animation:** Jika threshold terpenuhi, card snap out dengan momentum
- **Next card:** Card baru slide in dari bawah dengan spring animation
- **Haptic visual:** Getaran subtle pada card saat threshold tercapai (CSS animation shake)

### XP Calculation

| Aksi | XP Dasar | Combo Bonus |
|------|----------|-------------|
| Swipe benar (tahu) | 10 XP | +2 per combo |
| Swipe benar (tebak) | 5 XP | +1 per combo |
| Audio listened | +2 XP | - |
| Streak multiplier | - | x2 (7+ hari) / x3 (30+ hari) |

### Edge Cases

- **User swipe terlalu cepat:** Minimal 0.5 detik per card, anti-spam
- **User tidak tahu semua:** Setelah 3 swipe kiri berturut-turut, muncul "Tip: Coba dengarkan audio dulu!"
- **Session timeout:** Jika idle >30 detik, pause card timer
- **Network issue:** Cache next 5 cards secara lokal
- **Mis-swipe:** 5 detik undo window dengan tombol "Ups!" di pojok

---

## 16. Battle Mode

### Konsep

Battle mode adalah PvE turn-based di mana pemain melawan AI dengan menjawab pertanyaan vocabulary. Setiap jawaban benar memberikan damage ke musuh. Combo meningkatkan attack power.

### Battle Flow

```
┌─────────────────────────────────────────────┐
│  BATTLE ARENA                                │
│                                              │
│  ┌─── PLAYER ────────────────────────┐       │
│  │  🛡️ HP: ▓▓▓▓▓▓▓░░░ 70/100        │       │
│  │  ⚔️ COMBO: x3  (+30% ATK)         │       │
│  └────────────────────────────────────┘       │
│                                              │
│         VS                                   │
│                                              │
│  ┌─── ENEMY ─────────────────────────┐       │
│  │  👹 HP: ▓▓▓▓░░░░░░ 40/100        │       │
│  │  (AI Musafir Level 3)            │       │
│  └────────────────────────────────────┘       │
│                                              │
│  ┌──────────────────────────────┐             │
│  │  كِتَاب                      │             │
│  │  "Apa arti kata di atas?"   │             │
│  ├──────────────────────────────┤             │
│  │  [A] Meja   [B] Buku  ✓     │             │
│  │  [C] Kursi  [D] Pulpen      │             │
│  └──────────────────────────────┘             │
│                                              │
│  ⏱️ Waktu: 8 detik                           │
└─────────────────────────────────────────────┘
```

### Battle Mechanics

| Aspek | Detail |
|-------|--------|
| **Format** | 4 pilihan ganda |
| **Time limit** | 10 detik per soal (berkurang di level lebih tinggi) |
| **Base damage** | 10 HP per jawaban benar |
| **Combo damage** | +5 HP per combo stack |
| **Enemy HP** | Variatif: 50 (easy) / 100 (medium) / 150 (hard) |
| **Player HP** | 100 (base) — bisa ditingkatkan dengan rank |
| **Heal** | Jawaban benar 5x berturut-turut = heal +10 HP |
| **Enemy attack** | Setiap jawaban salah = -15 HP player |
| **Special** | Pada HP ≤ 20% enemy, masuk "finish mode" — particle effect |

### Enemy Types

| Enemy | Difficulty | HP | Behavior |
|-------|------------|-----|----------|
| Pemula Bot | Easy | 50 | Soal dasar, waktu 10 detik |
| Musafir Bot | Medium | 80 | Soal campuran, waktu 8 detik |
| Penuntut Bot | Hard | 120 | Vocabulary lebih sulit, waktu 6 detik |
| Boss: Nahwu King | Very Hard | 200 | Mixed questions, wiring cepat, 2 phase |

### Boss Stage

Boss stage adalah battle spesial yang muncul setiap 5 level rank.

**Phase 1 (HP >50%):** Soal normal dengan waktu 7 detik  
**Phase 2 (HP ≤50%):** Soal double — dua pertanyaan berturut-turut, waktu total 12 detik

**Reward Boss:** 500 XP, 100 Coin, Badge eksklusif

### Result Screen

```
╔═══════════════════════════════════╗
║          VICTORY! 🎉              ║
║                                   ║
║   ⚔️ Damage dealt: 80             ║
║   🔥 Max combo: x5               ║
║   ✅ Correct: 8/10                ║
║                                   ║
║   +250 XP     +50 Coin            ║
║                                   ║
║   ┌─────────────────────┐         ║
║   │  🔄 Battle Lagi     │         ║
║   └─────────────────────┘         ║
║   ┌─────────────────────┐         ║
║   │  🏠 Kembali          │         ║
║   └─────────────────────┘         ║
╚═══════════════════════════════════╝
```

---

## 17. Daily Mission System

### Mekanisme

Setiap hari, 3 misi di-reset. User bisa menyelesaikan misi untuk mendapatkan reward tambahan.

### Mission Pool

| Misi | Tipe | Reward |
|------|------|--------|
| Belajar 10 kata | Progression | 50 XP + 10 Coin |
| Belajar 20 kata | Progression | 100 XP + 20 Coin |
| Menang 1 battle | Battle | 75 XP + 15 Coin |
| Menang 3 battle | Battle | 150 XP + 30 Coin |
| Dengarkan audio 5x | Audio | 30 XP + 5 Coin |
| Streak combo 5x | Combo | 50 XP |
| Jawab 10 benar berturut-turut | Accuracy | 100 XP + Badge shard |
| Buka aplikasi 2x sehari | Retention | 20 XP |
| Selesaikan battle tanpa salah | Perfect | 200 XP + 50 Coin |

### Mission Display

```
┌──────────────────────────────┐
│  📋 Misi Harian              │
│                              │
│  ✅ Belajar 10 kata  10/10  │
│    [50 XP + 10 Coin]        │
│                              │
│  🔄 Menang 1 battle  0/1   │
│    [75 XP + 15 Coin]        │
│                              │
│  🔄 Dengarkan audio 5x 3/5 │
│    [30 XP + 5 Coin]         │
│                              │
│  ┌────────────────────┐      │
│  │  🎁 Claim All      │      │
│  └────────────────────┘      │
└──────────────────────────────┘
```

### Edge Cases

- **Mission complete saat offline:** Tetap terhitung, sync saat online
- **User skip satu hari:** Misi lama hilang, diganti misi baru
- **Reward belum di-claim:** Notifikasi "Kamu punya reward yang belum di-claim!"
- **All missions done:** "Keren! Semua misi selesai. Tunggu misi besok ya!"

---

## 18. Streak System

### Core Concept

Streak adalah jantung retention Harf. Setiap hari user membuka aplikasi dan belajar, streak bertambah. Streak memberikan multiplier XP dan status sosial.

### Streak Logic

| Hari ke- | Multiplier XP | Badge |
|----------|---------------|-------|
| 1-6 | 1x | - |
| 7 | 2x | 🔥 Striker (7 hari) |
| 14 | 2x | 🔥 Blaze (14 hari) |
| 30 | 3x | 🔥 Inferno (30 hari) |
| 60 | 3x | 🔥 Legend (60 hari) |
| 100 | 4x | 🔥 Immortal (100 hari) |

### Visual Streak Indicator

```
Hari ke-7 🔥🔥🔥🔥🔥🔥🔥

[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░] 7/14

"Kamu sudah belajar 7 hari berturut-turut!
Jangan sampai putus ya!"

🔥 Streak multiplier: 2x XP
```

### Streak Freeze

- User bisa membeli **Streak Freeze** (1 hari streak aman) dengan 100 Coin
- Maksimal 3 freeze aktif
- Freeze otomatis terpakai jika user melewatkan satu hari
- Streak tidak terputus, tapi tidak bertambah

### Edge Cases

- **Timezone handling:** Streak dihitung berdasarkan waktu lokal user (00:00-23:59)
- **Midnight session:** Jika user belajar jam 23:50 selama 15 menit, streak terhitung untuk hari itu
- **First session of the day:** Streak bertambah saat first swipe/battle pertama hari itu
- **Forgot 1 day:** Freeze terpakai, notifikasi dikirim "Streakmu aman! Tapi jaga terus ya."
- **Forgot >3 days:** Streak terputus, animasi "fire died out", notifikasi sedih dari mascot

---

## 19. XP System

### XP Sources

| Activity | Base XP | Notes |
|----------|---------|-------|
| Swipe correct (know) | 10 | +2 per combo |
| Swipe correct (guess) | 5 | +1 per combo |
| Swipe wrong | 0 | Tidak ada XP |
| Audio listened | 2 | Per kata |
| Battle win | 100 + damage bonus | Damage bonus = 10% of damage dealt |
| Battle lose | 25 | Participation reward |
| Daily mission | Varies | 30-200 per mission |
| Streak milestone | 200-1000 | Per 7, 30, 100 hari |
| First session of day | 50 | Login bonus |
| Invite friend | 100 | Saat friend selesai onboarding |

### XP Bar Progression

| Level | XP Needed | Total XP |
|-------|-----------|----------|
| 1 | 0 | 0 |
| 2 | 100 | 100 |
| 3 | 250 | 350 |
| 4 | 500 | 850 |
| 5 | 800 | 1.650 |
| 10 | 3.000 | ~10.000 |
| 20 | 10.000 | ~50.000 |
| 50 | 50.000 | ~500.000 |

Formula: `XP_needed(level) = 50 * level^1.5 + 50 * level`

### XP Feedback

- **Micro feedback:** Floating +10, +15, +20 XP setiap swipe benar (animasi float up + fade)
- **Combo feedback:** +COMBO x2! muncul dengan particle effect
- **Level up:** Full screen celebration, mascot muncul, particle shower
- **Daily summary:** Total XP earned hari ini di progress screen

---

## 20. Rank System

### Rank Hierarchy

| Rank | XP Required | Icon | Privileges |
|------|-------------|------|------------|
| **Pemula** | 0 | 🌱 | - |
| **Musafir** | 1.000 | 🧭 | Battle unlock |
| **Penuntut Ilmu** | 5.000 | 📖 | Hard battle, Leaderboard |
| **Ahli Nahwu** | 20.000 | 📜 | Friend challenge, Custom badge |
| **Sultan Arabic** | 50.000 | 👑 | Exclusive cosmetic, Beta access |

### Rank Progression UI

```
Rank: Penuntut Ilmu 🎯
XP: 3,450 / 5,000
Progress: ▓▓▓▓▓▓▓▓░░░░░░░ 69%

Next rank: Ahli Nahwu (20,000 XP)
Reward: Battle Hard Mode, Leaderboard

┌────────────────────┐
│  🔥 7,650 XP lagi  │
│  untuk naik rank!  │
└────────────────────┘
```

### Rank Demotion

- **Tidak ada demotion** untuk rank Pemula hingga Penuntut Ilmu
- Ahli Nahwu dan Sultan Arabic: jika tidak aktif >30 hari, turun 1 rank (dengan grace period 7 hari + notifikasi)
- **Tujuan:** Mendorong user rank tinggi untuk tetap aktif

---

## 21. Reward System

### Reward Types

| Type | Contoh | Cara Mendapatkan |
|------|--------|------------------|
| **XP** | Poin pengalaman | Semua aktivitas |
| **Coin** | Mata uang in-app | Battle, misi, streak |
| **Badge** | Prestasi visual | Milestone, event |
| **Cosmetic** | Mascot skin, frame | Rank up, shop |
| **Streak Freeze** | Item proteksi | Beli dengan coin |
| **Power-up** | Double XP (30 menit) | Battle reward langka |
| **Title** | "The Unstoppable" | Streak 100 hari |

### Coin Economy

| Activity | Coin Earned |
|----------|-------------|
| Battle win | 30-100 |
| Daily mission | 5-30 |
| Streak milestone | 50-200 |
| Invite friend | 50 |
| Login bonus | 5 |

| Item | Coin Cost |
|------|-----------|
| Streak Freeze (1) | 100 |
| Double XP (30 min) | 150 |
| Mascot skin (common) | 500 |
| Mascot skin (rare) | 2.000 |
| Badge frame | 300 |

---

## 22. Audio & Listening System

### Audio Content

- **Voice:** Native Arabic speaker (Fusha)
- **Quality:** High-quality recording, no TTS
- **Coverage:** Setiap kata memiliki audio
- **Speed options:** Normal (100%), Lambat (70%), Pelan (50%)

### Audio Interaction

```
┌──────────────────────┐
│                       │
│       كِتَاب          │
│                       │
│   ┌──────────────┐    │
│   │  🔊 Dengarkan │   │  (Tombol besar, thumb-friendly)
│   └──────────────┘    │
│                       │
│   Kecepatan: Normal   │
│   [Lambat] [Normal]   │
│                       │
│   2x dengarkan hari   │
│   ini (+4 bonus XP)   │
└──────────────────────┘
```

### Audio Waveform Visual

Saat audio diputar, tampilkan waveform animasi sederhana untuk memberikan visual feedback bahwa audio sedang berlangsung. Ini juga membantu user tunarungu.

### Edge Cases

- **No audio / mute:** Tombol tetap visible, jika audio tidak bisa diputar, tampilkan visual feedback berupa teks transliterasi
- **Slow connection:** Gunakan audio format terkompresi (AAC/OGG), preload next 3 kata
- **User memutar audio berulang:** Unlimited plays, pencegahan abuse: hanya 3x pertama per kata yang memberi XP

---

## 23. Leaderboard System

### Leaderboard Types

| Type | Scope | Refresh | Visibility |
|------|-------|---------|------------|
| Friends | Teman yang diinvite | Real-time | Unlock at level 5 |
| Global | Semua user | Daily | Unlock at Penuntut Ilmu |
| Weekly | Top XP minggu ini | Weekly | Unlock at level 3 |

### Leaderboard Display

```
🏆 Papan Peringkat — Minggu Ini

#1  Rizky45     🔥  4,520 XP
#2  Aisyah_A    🔥  3,890 XP
#3  HarfMaster  🔥  3,120 XP
#4  Kamu        🔥  2,450 XP  ← User
#5  AbuHanifah  🔥  2,100 XP

"Kamu #4! 1,670 XP lagi untuk #3"
```

### Anti-Cheat

- XP dari swipe dibatasi per hari (anti-grind unlimited)
- Minimal 0.5 detik per card
- Abuse detection: pattern tidak wajar → flag manual review
- Weekly leaderboard di-reset, bukan akumulatif

---

## 24. Social Features

### Friend System

| Feature | Detail |
|---------|--------|
| **Invite** | Share referral link via WhatsApp, Telegram, Twitter |
| **Accept** | Accept friend request |
| **Leaderboard** | Friend-only leaderboard |
| **Activity** | "Temanmu Rizky baru saja naik rank!" |
| **Challenge** | Kirim battle challenge ke teman (future) |

### Friend Activity Feed

```
👋 Rizky belajar 15 kata — 5 menit lalu
⚔️ Aisyah menang battle melawan AI — 15 menit lalu
🔥 Bambang streak 7 hari! — 1 jam lalu
🎉 Siti naik rank ke Penuntut Ilmu! — 3 jam lalu
```

### Privacy

- Username ditampilkan (bukan nama asli)
- User bisa set profile ke private (tidak muncul di global leaderboard)
- Block user

---

## 25. Viral Mechanics

### Growth Loops

```
┌─────────────────────────────────────────────────────┐
│  GROWTH LOOP                                         │
│                                                      │
│  User main → Dapet XP/badge/streak →                │
│  → Share ke sosial media →                           │
│  → Teman lihat, penasaran → download →              │
│  → Teman main → Harf tumbuh                          │
│  → User asli dapet reward referral →                 │
│  → Makin semangat share → (loop)                     │
└─────────────────────────────────────────────────────┘
```

### Viral Triggers

| Momen | Trigger Share | Platform Target |
|-------|---------------|-----------------|
| Rank naik | "Naik rank!" + rank card | IG Story, WA Status |
| Streak 7 hari | "7 hari streak!" + fire animation | TikTok Story |
| Battle win | "Kalahin AI!" + score card | IG, WA |
| Badge rare | "Dapet badge langka!" | All platforms |
| Daily result | "Hari ini belajar 20 kata!" | IG Story, WA Status |
| Level up | "Level 10!" + celebration | TikTok, IG |

---

## 26. Shareable Progress Cards

### Card Format

Setiap shareable card memiliki format:

- **Aspect ratio:** 9:16 (optimized untuk Story/Status)
- **Background:** Gradient (emerald + navy) dengan particle effect
- **Font:** Bold, readable di layar kecil
- **Branding:** Logo Harf + watermark ringan
- **QR code / Link:** Deep link ke app

### Card Types

**Streak Card**
```
┌────────────────────┐
│  🔥                │
│  7 HARI STREAK!    │
│                    │
│  Saya sudah        │
│  belajar 7 hari    │
│  berturut-turut    │
│  di Harf!          │
│                    │
│  Ayo belajar Arab  │
│  bareng!           │
│                    │
│  ┌─────┐           │
│  │ QR  │           │
│  └─────┘           │
│  harf.app/rizky    │
└────────────────────┘
```

**Rank Card**
```
┌────────────────────┐
│  🧭                │
│  MUSAFIR           │
│                    │
│  Rizky sekarang    │
│  Musafir Level 7   │
│                    │
│  XP: 4,520         │
│  Rank: #42 Global  │
│                    │
│  ┌─────┐           │
│  │ QR  │           │
│  └─────┘           │
│  harf.app/rizky    │
└────────────────────┘
```

### Technical Note

- Card di-generate di client-side menggunakan HTML Canvas
- Tidak perlu server-side rendering
- Download sebagai PNG
- Share langsung via Web Share API

---

## 27. Mascot System

### Mascot Design

| Atribut | Detail |
|---------|--------|
| **Nama** | Burhan (nama sementara — bisa di-brainstorm) |
| **Jenis** | Burung kecil lucu (seperti lovebird / pipit) |
| **Warna** | Hijau toska + emas |
| **Ekspresi** | 12+ ekspresi: happy, sad, excited, sleepy, proud, confused, angry (cute), surprised, love, cool, lazy, starstruck |
| **Fungsi** | Reaksi di berbagai momen, engagement, viral potential |

### Mascot Reactions

| Momen | Ekspresi | Animasi |
|-------|----------|---------|
| Streak bertambah | Happy / Proud | Terbang kecil, sparkle |
| Jawaban benar | Happy | Nod setuju + senyum |
| Jawaban salah | Sad / Confused | Miring kepala, "Hmm" |
| Combo tinggi | Excited | Terbang muter-muter |
| Battle menang | Starstruck | Mahkota + confetti |
| Battle kalah | Supportive | "Ayo coba lagi!" |
| Level up | Euphoric | Particle explosion |
| Streak terancam (notif) | Worried | Mata melebar |
| Streak putus | Crying | Air mata + "Aku sedih" |
| Daily login | Sleepy (lalu happy) | Bangun, menguap, lalu semangat |

### Mascot as Viral Asset

- Burhan dirancang agar **meme-able**
- Ekspresi Burhan bisa dijadikan sticker WhatsApp/Telegram
- Potential merchandise

---

## 28. Notification Strategy

### Notification Types

| Type | Trigger | Timing | Frequency |
|------|---------|--------|-----------|
| **Streak reminder** | User belum buka app hari ini | Pukul 19:00-21:00 | 1x/hari |
| **Streak danger** | User streak terancam (hari terakhir freeze) | Pukul 20:00 | 1x |
| **Streak lost** | Streak putus | Setelah 00:01 | 1x (sedih, danging) |
| **Mission reminder** | User punya misi belum selesai | Sore hari | 1x/hari |
| **Battle challenge** | Teman challenge | Real-time | Optional |
| **Rank milestone** | Mendekati rank berikutnya | Saat XP 80% dari target | 1x |
| **Friend activity** | Teman aktif | Daily digest | 1x/hari |
| **Reward unclaimed** | User belum claim reward | Sore hari | 1x/hari |

### Notification Copy Guidelines

- **Tone:** Playful, friendly, menggunakan bahasa casual
- **Personalization:** Panggil nama user
- **Action-oriented:** Langsung link ke app
- **Examples:**
  - "🔥 Rizky! Streakmu mau putus! Ayo belajar 5 menit aja."
  - "📚 Misi hari ini masih ada yang belum selesai, nih!"
  - "🐦 Burhan kangen kamu. Ayo main!"

### Frequency Cap

- Maksimal 3 push notification per hari
- Minimum interval antar notifikasi: 3 jam
- User bisa opt-out per kategori

---

## 29. Retention Strategy

### Retention Pillars

| Pillar | Mekanisme | Metrik |
|--------|-----------|--------|
| **Streak** | Fire visual, multiplier, freeze, badge | D1-D30 retention |
| **Daily Missions** | 3 misi per hari, reward | Mission completion rate |
| **Battle** | AI progression, boss stage | Battle frequency |
| **Social** | Leaderboard, friend activity, share | Invites, friend interactions |
| **Progress** | XP bar, rank, stats visual | Time to first rank up |
| **Variable Reward** | Random bonus XP, rare badge | Session length |

### Daily Session Flow (Optimized for Retention)

1. **Open app** → Animasi streak + mascot welcome (3 detik)
2. **First action** → Satu swipe gratis langsung (zero friction)
3. **Progress update** → XP bar, rank progress
4. **Quick win** → Daily mission yang paling mudah (1 swipe = progress)
5. **Reward** → Animasi reward, dopamine hit
6. **Social nudge** → "Temanmu Rizky sudah belajar 50 kata minggu ini"
7. **Battle tease** → "Coba Battle 1 ronde? Hanya 2 menit!"

### Anti-Churn Tactics

| Churn Signal | Intervention |
|--------------|-------------|
| Tidak login 2 hari | Push notif + Streak Freeze otomatis |
| Tidak login 5 hari | Email: "Ayo kembali! Ada badge baru" + bonus XP |
| Swipe < 5 cards per session | "Coba Battle! Lebih seru!" |
| Kalah 3x battle berturut-turut | Turunkan difficulty AI |
| Tidak swipe 30 detik | Muncul tip / mascot encouragement |
| Session < 2 menit | Streak tetap dihitung meskipun 1 swipe |

### Streak Recovery

Jika user kehilangan streak, berikan **Streak Recovery**:
- 3 hari pertama setelah streak putus: belajar 2x lipat XP
- "Kebangkitan" badge untuk user yang berhasil rebuild streak ke 7 hari

---

## 30. Monetization Strategy

### Phase 1 (MVP, Free Forever)

- Tidak ada monetisasi di MVP
- Fokus 100% ke growth dan retention
- Brand awareness dan user base building

### Phase 2 (Post-MVP)

| Tier | Price (estimasi) | Benefit |
|------|------------------|---------|
| **Free** | - | Semua fitur dasar, akses terbatas ke cosmetic |
| **Harf Pro** | Rp 29.000/bulan | Unlimited streak freeze, double XP, exclusive cosmetic, no ads |
| **Harf Sultan** | Rp 99.000/bulan | All Pro + exclusive mascot skin, early access, gold border profile |

### One-Time Purchase

| Item | Price |
|------|-------|
| Mascot skin limited | Rp 25.000 |
| Badge frame premium | Rp 15.000 |
| XP booster pack | Rp 10.000 |

### Advertising

- **Non-intrusive:** Reward video ads untuk mendapatkan extra reward
- **Tidak ada:** Interstitial ads, banner ads, popup
- **Format:** "Tonton video 30 detik → Double reward"

### Ethical Monetization

- Tidak ada pay-to-win dalam leaderboard
- Tidak ada paywall untuk fitur learning inti
- Semua item kosmetik murni visual
- Transparan: "With Harf Pro, kamu mendukung pengembangan aplikasi"

---

## 31. UI/UX Principles

| Principle | Implementation |
|-----------|----------------|
| **Mobile-first** | Semua desain dimulai dari layar 375x667px, kemudian diperbesar |
| **Thumb-friendly** | Semua interaksi dalam zona jangkauan thumb |
| **Glanceable** | Informasi penting bisa dipahami dalam 2 detik |
| **Zero friction** | Tidak ada unnecessary step. User langsung swipe |
| **Satisfying feedback** | Setiap aksi ada animasi/sound feedback |
| **Progressive disclosure** | Fitur kompleks diperkenalkan bertahap |
| **Error prevention** | Desain mencegah error sebelum terjadi |
| **Consistency** | Pattern yang sama untuk interaksi serupa |
| **Accessibility** | Warna kontras, font readable, audio alternative |
| **Delight** | Micro-interactions yang membuat senyum |

---

## 32. Mobile UX Requirements

### Touch Interaction

| Requirement | Detail |
|-------------|--------|
| **Tap target minimum** | 48x48dp (idealnya 56x56dp) |
| **Swipe sensitivity** | 30% card width threshold |
| **Swipe feedback** | Haptic visual (CSS), follow finger |
| **Touch delay** | Tidak ada 300ms delay |
| **Prevent accidental taps** | Debounce 200ms pada button battle |

### Layout

- **Bottom navigation** — selalu visible
- **Content** di middle zone (jangkauan thumb)
- **Header** compact (streak + XP bar + mascot kecil)
- **Safe area insets** untuk notched devices
- **No horizontal scroll** di page utama

### Viewport

- Minimum: 375px width
- Optimal: 390px (iPhone 14) — 414px (iPhone Plus)
- Desktop: Tetap mobile layout, centered container max-w-lg (480px)
- Landscape: Block, prompt user untuk rotate (atau tetap portrait)

---

## 33. Motion & Animation Guidelines

### Animation Philosophy

"Animasi bukan hiasan. Animasi adalah feedback yang membuat user mengerti apa yang terjadi dan memberikan rasa satisfying."

### Animation Specs

| Element | Type | Duration | Easing | Notes |
|---------|------|----------|--------|-------|
| Card swipe | Spring | 300-500ms | Spring (stiffness: 300, damping: 25) | Follow finger |
| Card dismiss | Spring | 400ms | Spring (snappy) | Snap out + rotate |
| Card enter | Spring | 350ms | Spring (gentle) | Slide up from bottom |
| Button press | Scale | 100ms | Ease-out | Scale 0.95 |
| XP float up | Tween | 800ms | Ease-out | +fade out |
| Level up | Staggered | 1.5s | Custom | Particle + mascot |
| Streak fire | Loop | - | - | Particle loop |
| Battle hit | Spring | 200ms | Ease-out | Screen shake subtle |
| Battle enemy hurt | Tween | 300ms | Ease-out | Flash red + shrink |
| Page transition | Slide | 250ms | Ease-in-out | Left/right slide |
| Modal | Scale + fade | 200ms | Ease-out | Backdrop blur |

### Framer Motion Implementation

```typescript
// Example: Card swipe animation
const cardVariants = {
  initial: { scale: 0.9, y: 50, opacity: 0 },
  active: { scale: 1, y: 0, opacity: 1 },
  swipeRight: { x: 400, rotate: 15, opacity: 0 },
  swipeLeft: { x: -400, rotate: -15, opacity: 0 },
}
```

### Performance Notes

- Animasi harus **60fps** (gunakan `transform` dan `opacity` saja)
- Hindari animasi `height`, `width`, `top`, `left`
- Gunakan `will-change` untuk card yang sedang di-swipe
- Fallback: Jika device low-end, kurangi particle effect
- `prefers-reduced-motion`: Respect system setting, kurangi durasi 50%

---

## 34. Design Language

### Design Principles

| Prinsip | Deskripsi |
|---------|-----------|
| **Bold** | Tipografi besar, warna berani, ruang negatif |
| **Polished** | Setiap pixel diperhatikan, tidak ada "almost aligned" |
| **Playful** | Tidak terlalu serius, rounding tinggi, mascot, ilustrasi |
| **Premium** | Material feel, glassmorphism ringan, gradient halus |
| **Fast** | UI terasa instan, skeleton loading, optimistic updates |
| **Clean** | Tidak clutter, informasi yang benar-benar diperlukan saja |

### Visual Style Reference

| Aspek | Arah |
|-------|------|
| **Corners** | Border-radius besar (16-24px untuk card, 12px untuk button) |
| **Shadow** | Soft shadow, layer-style (bukan material elevation) |
| **Blur** | Backdrop blur untuk modal, sheet, bottom nav |
| **Gradient** | Subtle gradient untuk background, bold gradient untuk accent |
| **Glass** | Light glassmorphism untuk overlay, cards |
| **Icon style** | Outlined, consistent weight (2px stroke) |

---

## 35. Color Palette

```
PRIMARY
  emerald-500: #10B981    (Primary actions, active state)
  emerald-400: #34D399    (Accent, highlights)
  emerald-600: #059669    (Hover states)

NEUTRAL
  dark-navy: #0F172A      (Background default)
  navy-900:  #1E293B      (Card background)
  navy-800:  #334155      (Surface, elevated)
  navy-700:  #475569      (Border, divider)

LIGHT
  cream-50:  #FEFCE8      (Text on dark bg, accent bg)
  cream-100: #FEF9C3      (Subtle highlight)
  cream-200: #FDE68A      (Warm accent)

ACCENT
  gold-400:  #FACC15      (Rank highlight, streak fire)
  gold-500:  #EAB308      (Premium, special items)

FEEDBACK
  success:   #22C55E      (Correct answer, positive)
  error:     #EF4444      (Wrong answer, negative)
  warning:   #F97316      (Streak danger, low HP)
  info:      #3B82F6      (Info, tips)

GRADIENTS (Key)
  hero:      emerald-500 → emerald-700
  streak:    gold-400 → orange-500
  battle:    blue-600 → purple-700
  rank-up:   emerald-400 → gold-400
```

### Dark Mode

- **Default:** Dark mode (menghemat baterai OLED, lebih fokus)
- **Toggle:** User bisa switch ke light mode
- **Base:** dark-navy (#0F172A) sebagai background utama
- **Surface:** navy-900 (#1E293B) untuk card
- **Text:** cream-50 (#FEFCE8) untuk primary text

---

## 36. Typography

### Font Stack

| Type | Font | Weight | Usage |
|------|------|--------|-------|
| **Display** | Plus Jakarta Sans (Bold/ExtraBold) | 700, 800 | Arabic text display, headlines |
| **Body** | Inter | 400, 500, 600 | Body text, labels |
| **Arabic** | Noto Naskh Arabic / Amiri | 400, 700 | Arabic script |

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Arabic XL** | 48px | 700 | 1.1 | Kata Arab di card swipe |
| **H1** | 32px | 800 | 1.2 | Headline, rank name |
| **H2** | 24px | 700 | 1.3 | Section title |
| **H3** | 20px | 600 | 1.4 | Card title |
| **Body** | 16px | 400 | 1.5 | Paragraph |
| **Body Bold** | 16px | 600 | 1.5 | Emphasis |
| **Small** | 14px | 400 | 1.4 | Caption, metadata |
| **Micro** | 12px | 500 | 1.3 | Badge, timestamps |
| **Label** | 13px | 600 | 1.2 | Bottom nav, button |

### Arabic Text Display

- Arabic text menggunakan font yang mendukung full Arabic script
- Ukuran lebih besar dari teks Latin (karena kompleksitas visual)
- Pastikan `font-feature-settings` untuk proper Arabic ligatures

---

## 37. Accessibility

### Requirements

| Area | Requirement | Implementation |
|------|-------------|----------------|
| **Color contrast** | WCAG AA minimum (4.5:1 for text) | Emerald on navy: 6.2:1 ✅ |
| **Touch targets** | Minimum 48x48dp | Semua button dan interactive element |
| **Screen reader** | ARIA labels | Setiap elemen interaktif memiliki label |
| **Motion** | prefers-reduced-motion | Kurangi animasi 50%, nonaktifkan particle |
| **Font scaling** | Responsif hingga 200% | Gunakan rem, bukan px untuk font |
| **Audio alternative** | Teks untuk audio | Setiap audio memiliki teks transliterasi |
| **Focus indicators** | Visible focus ring | Outline 2px gold untuk keyboard nav |
| **Semantic HTML** | Proper heading hierarchy | h1-h6 sesuai struktur |

### Arabic-specific Accessibility

- Arab dibaca kanan-ke-kiri — Harf saat ini masih fokus ke meaning recognition (bukan reading), jadi belum perlu RTL layout
- Transliterasi (Latin) disediakan untuk setiap kata Arab

---

## 38. Technical Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT                            │
│  ┌─────────────────────────────────────────────┐    │
│  │  Next.js App Router                          │    │
│  │  ├── / (Home)                               │    │
│  │  ├── /swipe                                 │    │
│  │  ├── /battle                                │    │
│  │  ├── /progress                              │    │
│  │  ├── /social                                │    │
│  │  └── /profile                               │    │
│  │                                              │    │
│  │  State: Zustand (client)                     │    │
│  │  Animasi: Framer Motion                      │    │
│  │  Styling: Tailwind CSS                       │    │
│  └─────────────────────────────────────────────┘    │
│                    │                                 │
│                    ▼                                 │
│  ┌─────────────────────────────────────────────┐    │
│  │  Supabase Client                             │    │
│  │  ├── Auth (email, Google, magic link)        │    │
│  │  ├── Realtime (leaderboard, activity)        │    │
│  │  └── Database queries                        │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│                    SERVER                            │
│  ┌─────────────────────────────────────────────┐    │
│  │  Supabase                                    │    │
│  │  ├── PostgreSQL (database)                   │    │
│  │  ├── Row Level Security (auth)               │    │
│  │  ├── Storage (audio, images, badges)         │    │
│  │  └── Edge Functions (battle AI logic)        │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │  Next.js API Routes (optional, jika perlu)   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **Web PWA first** | Validasi lebih cepat, distribusi tanpa App Store |
| **Supabase** | Backend-as-a-Service, scalable, built-in auth, realtime |
| **Next.js App Router** | SEO untuk landing page, SSR untuk performance |
| **Zustand** | Lightweight state management, TypeScript native |
| **Framer Motion** | Animation library paling mature untuk React |

---

## 39. Frontend Architecture

### Component Tree (Simplified)

```
<App>
  <BottomNav />
  <HomePage>
    <StreakIndicator />
    <XPBar />
    <MascotReaction />
    <DailyMissions />
    <QuickActions />
  </HomePage>
  <SwipePage>
    <SwipeCard />
    <ProgressBar />
    <ComboIndicator />
    <AudioButton />
  </SwipePage>
  <BattlePage>
    <BattleArena>
      <HpBar />
      <EnemyCharacter />
      <QuestionCard />
      <AnswerOptions />
    </BattleArena>
    <BattleResult />
  </BattlePage>
  <ProgressPage>
    <RankDisplay />
    <StatsGrid />
    <BadgeCollection />
  </ProgressPage>
  <SocialPage>
    <Leaderboard />
    <FriendActivity />
    <InviteSection />
  </SocialPage>
</App>
```

### Reusable Components

| Component | Usage | Props |
|-----------|-------|-------|
| `Button` | Primary, secondary, ghost | variant, size, icon, loading |
| `Card` | Container untuk content | variant, onClick, className |
| `Modal` | Sheet, dialog, confirmation | open, onClose, children |
| `ProgressBar` | XP, HP, streak | value, max, variant, animated |
| `Avatar` | User, mascot | src, size, badge |
| `Badge` | Achievement, status | label, variant, icon |
| `Toast` | Feedback notification | message, type, duration |
| `Skeleton` | Loading state | width, height, variant |
| `Tooltip` | Hint, explanation | content, position |
| `BottomNav` | Navigation | activeTab, onTabChange |

---

## 40. Backend Architecture

### Supabase Services Used

| Service | Kegunaan |
|---------|----------|
| **Auth** | Registrasi, login, magic link, session |
| **Database (PostgreSQL)** | Semua data user, vocabulary, progress |
| **Storage** | Audio files, mascot assets, badge images |
| **Realtime** | Leaderboard updates, friend activity |
| **Edge Functions** | Battle AI logic, daily reset cron |
| **Row Level Security** | Data isolation per user |

### Edge Functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `daily-reset` | Cron (00:00 UTC+7) | Reset daily missions, update streaks |
| `battle-ai` | On-demand | Generate battle questions based on user level |
| `leaderboard-sync` | On-demand + realtime | Compute weekly leaderboard |
| `process-referral` | On invite accept | Grant referral XP bonus |
| `check-streaks` | Cron (hourly) | Send streak notifications |

---

## 41. Database Schema Draft

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank_id INTEGER REFERENCES ranks(id),
  streak_count INTEGER DEFAULT 0,
  streak_freeze INTEGER DEFAULT 0,
  highest_streak INTEGER DEFAULT 0,
  lifetime_xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ranks
CREATE TABLE ranks (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  min_xp INTEGER NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL
);

-- Vocabulary
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arabic TEXT NOT NULL,
  latin_transliteration TEXT,
  meaning_id TEXT NOT NULL,
  meaning_en TEXT,
  audio_url TEXT,
  difficulty INTEGER DEFAULT 1, -- 1-5
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (thematic packs)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0
);

-- User Progress (swipe history)
CREATE TABLE user_word_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
  confidence INTEGER DEFAULT 0, -- 0-5 (how well user knows this word)
  swipe_right_count INTEGER DEFAULT 0,
  swipe_left_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  next_review_at TIMESTAMPTZ, -- for spaced repetition
  UNIQUE(user_id, word_id)
);

-- Daily Missions
CREATE TABLE daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_type TEXT NOT NULL,
  target INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  claimed BOOLEAN DEFAULT FALSE,
  reward_xp INTEGER NOT NULL,
  reward_coins INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, mission_type, date)
);

-- Battles
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  won BOOLEAN,
  xp_earned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 10,
  max_combo INTEGER DEFAULT 0,
  enemy_type TEXT,
  battle_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  rarity TEXT DEFAULT 'common' -- common, rare, epic, legendary
);

-- User Badges
CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Friends
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted, blocked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id) UNIQUE,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Streak Log
CREATE TABLE streak_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INTEGER DEFAULT 0,
  UNIQUE(user_id, activity_date)
);
```

### Indexes

```sql
CREATE INDEX idx_user_word_progress_user ON user_word_progress(user_id);
CREATE INDEX idx_user_word_progress_next_review ON user_word_progress(next_review_at);
CREATE INDEX idx_daily_missions_user_date ON daily_missions(user_id, date);
CREATE INDEX idx_battles_user_date ON battles(user_id, battle_date);
CREATE INDEX idx_streak_log_user_date ON streak_log(user_id, activity_date);
```

---

## 42. API Design Draft

### API Strategy

Harf menggunakan **Supabase Client SDK** langsung dari frontend. Tidak perlu REST API middleware untuk sebagian besar operasi. Edge Functions digunakan untuk logika yang membutuhkan server-side processing.

### Key Queries / Mutations

**Vocabulary**
```typescript
// Get next 10 words for user (spaced repetition based)
const { data: words } = await supabase
  .from('user_word_progress')
  .select('word:word_id(*)')
  .eq('user_id', userId)
  .lt('next_review_at', now)
  .order('last_reviewed_at')
  .limit(10);
```

**Submit Swipe**
```typescript
// Upsert user_word_progress
await supabase
  .from('user_word_progress')
  .upsert({
    user_id: userId,
    word_id: wordId,
    confidence: newConfidence,
    swipe_right_count: increment,
    last_reviewed_at: now,
    next_review_at: calculateNextReview(confidence),
  });

// Update user XP
await supabase.rpc('add_xp', { user_id: userId, xp_amount: earnedXp });
```

**Battle Logic (Edge Function)**
```typescript
// Edge Function: generate-battle
// Input: { userId, difficulty }
// Output: { questions: Array<{ word, options }>, enemy: { name, hp } }
```

**Leaderboard**
```typescript
// Weekly leaderboard
const { data } = await supabase
  .from('users')
  .select('username, avatar_url, xp')
  .order('xp', { ascending: false })
  .limit(50);
```

---

## 43. Folder Structure

```
harf/
├── public/
│   ├── audio/           # Arabic pronunciation audio files
│   ├── images/          # Static images
│   │   ├── mascot/      # Mascot sprites/animations
│   │   ├── badges/      # Badge icons
│   │   └── ranks/       # Rank icons
│   └── manifest.json    # PWA manifest
│
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (providers, fonts)
│   │   ├── page.tsx            # Home
│   │   ├── swipe/
│   │   │   └── page.tsx        # Swipe vocabulary
│   │   ├── battle/
│   │   │   └── page.tsx        # Battle mode
│   │   ├── progress/
│   │   │   └── page.tsx        # Stats, rank, badges
│   │   ├── social/
│   │   │   └── page.tsx        # Leaderboard, friends
│   │   ├── profile/
│   │   │   └── page.tsx        # User profile, settings
│   │   └── auth/
│   │       ├── login/
│   │       └── register/
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Avatar.tsx
│   │   │
│   │   ├── swipe/              # Swipe-specific components
│   │   │   ├── SwipeCard.tsx
│   │   │   ├── SwipeStack.tsx
│   │   │   ├── ComboIndicator.tsx
│   │   │   └── AudioButton.tsx
│   │   │
│   │   ├── battle/             # Battle-specific components
│   │   │   ├── BattleArena.tsx
│   │   │   ├── HpBar.tsx
│   │   │   ├── EnemySprite.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerOptions.tsx
│   │   │   └── BattleResult.tsx
│   │   │
│   │   ├── home/               # Home page components
│   │   │   ├── StreakIndicator.tsx
│   │   │   ├── XPBar.tsx
│   │   │   ├── DailyMission.tsx
│   │   │   ├── MascotReaction.tsx
│   │   │   └── QuickActions.tsx
│   │   │
│   │   ├── progress/           # Progress page components
│   │   │   ├── RankDisplay.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   └── BadgeGrid.tsx
│   │   │
│   │   ├── social/             # Social page components
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── FriendActivity.tsx
│   │   │   └── InviteCard.tsx
│   │   │
│   │   └── shared/             # Shared components
│   │       ├── Mascot.tsx
│   │       ├── ParticleEffect.tsx
│   │       └── ShareCard.tsx
│   │
│   ├── hooks/
│   │   ├── useSwipe.ts         # Swipe gesture logic
│   │   ├── useStreak.ts        # Streak computation
│   │   ├── useBattle.ts        # Battle state machine
│   │   ├── useAudio.ts         # Audio playback
│   │   ├── useXP.ts            # XP calculation
│   │   └── useSupabase.ts      # Supabase query helpers
│   │
│   ├── store/
│   │   ├── userStore.ts        # User state, XP, streak
│   │   ├── swipeStore.ts       # Current swipe session
│   │   ├── battleStore.ts      # Battle state machine
│   │   └── uiStore.ts          # UI state (modals, toasts)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Supabase client
│   │   │   ├── queries.ts      # Reusable query functions
│   │   │   └── mutations.ts    # Reusable mutation functions
│   │   │
│   │   ├── calculations/
│   │   │   ├── xp.ts           # XP formulas
│   │   │   ├── streak.ts       # Streak logic
│   │   │   ├── battle.ts       # Battle damage formula
│   │   │   └── spaced-repetition.ts  # SRS algorithm
│   │   │
│   │   └── utils/
│   │       ├── cn.ts           # Tailwind class merge
│   │       ├── format.ts       # Number formatting
│   │       └── share.ts        # Share card generation
│   │
│   ├── types/
│   │   ├── database.ts         # Supabase types
│   │   ├── game.ts             # Game-specific types
│   │   └── ui.ts               # UI component types
│   │
│   └── styles/
│       └── globals.css         # Tailwind base + custom styles
│
├── supabase/
│   ├── migrations/             # Database migrations
│   ├── functions/              # Edge Functions
│   │   ├── daily-reset/
│   │   ├── battle-ai/
│   │   └── process-referral/
│   └── seed.sql                # Seed data (vocabulary, ranks)
│
├── .env.local                  # Environment variables
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 44. State Management

### Zustand Store Architecture

```typescript
// userStore.ts
interface UserState {
  id: string | null;
  username: string;
  xp: number;
  level: number;
  rank: Rank;
  streakCount: number;
  coins: number;
  // Actions
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setUser: (user: User) => void;
}

// swipeStore.ts
interface SwipeState {
  currentWords: Word[];
  currentIndex: number;
  combo: number;
  sessionXP: number;
  // Actions
  nextCard: () => void;
  swipeResult: (direction: 'left' | 'right') => void;
  resetCombo: () => void;
  loadWords: (words: Word[]) => void;
}

// battleStore.ts
interface BattleState {
  status: 'idle' | 'loading' | 'active' | 'victory' | 'defeat';
  playerHp: number;
  enemyHp: number;
  currentQuestion: Question | null;
  questionIndex: number;
  combo: number;
  correctCount: number;
  // Actions
  startBattle: (enemy: Enemy) => void;
  answerQuestion: (answerIndex: number) => void;
  nextQuestion: () => void;
}
```

### State Flow

```
User Action → Zustand Store → Optimistic UI Update → Supabase Mutation → Sync
```

- **Optimistic updates:** UI berubah segera, tanpa nunggu server
- **Rollback:** Jika mutation gagal, revert ke state sebelumnya
- **Background sync:** Untuk operasi non-kritis (misal: update XP)

---

## 45. Offline Support Strategy

### PWA Implementation

| Aspect | Detail |
|--------|--------|
| **Service Worker** | Cache vocabulary data, audio files |
| **Cache Strategy** | Stale-while-revalidate untuk vocabulary data |
| **Offline mode** | Vocabulary swipe tetap bisa dilakukan offline |
| **Sync** | Queue XP updates, sync saat online kembali |
| **Audio** | Pre-cache audio untuk 10 kata berikutnya |
| **Battle** | Tidak bisa battle offline (butuh AI logic) |

### What Works Offline

| Feature | Offline Support |
|---------|-----------------|
| Swipe vocabulary | ✅ Full support (with cached words) |
| Audio playback | ✅ If pre-cached |
| Streak tracking | ✅ Local, sync later |
| XP calculation | ✅ Local, sync later |
| Battle | ❌ Requires server |
| Leaderboard | ❌ Requires server |
| Missions | ⚡️ Progress tracked locally, sync later |

---

## 46. Security Considerations

| Concern | Mitigation |
|---------|------------|
| **Auth** | Supabase RLS, HTTPS only, HTTP-only cookies |
| **Row Level Security** | User hanya bisa akses data miliknya sendiri |
| **XP manipulation** | Server-side validation untuk XP mutations via RPC |
| **Rate limiting** | Maksimal 100 swipe per jam per user |
| **SQL Injection** | Supabase client menggunakan parameterized queries |
| **XSS** | Next.js auto-escapes output, sanitize user input |
| **Referral abuse** | One referral per email/device, rate limiting |
| **Session management** | Supabase session handling, auto-refresh |
| **Analytics** | No PII in analytics, anonymized user tracking |

---

## 47. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint** | <1.5s | Lighthouse |
| **Time to Interactive** | <3s | Lighthouse |
| **Largest Contentful Paint** | <2.5s | Lighthouse |
| **First Input Delay** | <100ms | Web Vitals |
| **Cumulative Layout Shift** | <0.1 | Lighthouse |
| **API response time** | <200ms (p95) | Supabase metrics |
| **Swipe response** | <50ms frame time | DevTools Performance |
| **Bundle size (initial)** | <150KB gzipped | Webpack/Next analyzer |
| **Audio load time** | <500ms | DevTools Network |

### Optimization Strategies

| Strategy | Implementation |
|----------|----------------|
| **Code splitting** | Next.js App Router automatic + dynamic imports |
| **Image optimization** | Next.js Image component, WebP format |
| **Font subsetting** | Hanya karakter Latin + Arabic yang digunakan |
| **Bundle analysis** | `@next/bundle-analyzer` untuk monitoring |
| **Database query optimization** | Composite indexes, limit queries |
| **Memoization** | React.memo untuk komponen berat (card, animation) |
| **Virtual list** | Untuk leaderboard, gunakan windowing |
| **Preload** | Preload audio + next 3 kata saat swipe |

---

## 48. MVP Scope

### MVP Features (Launch)

| Feature | Priority | Notes |
|---------|----------|-------|
| Auth (email + magic link) | P0 | Minimal viable auth |
| Swipe vocabulary (50 kata) | P0 | Content: basic Arabic words |
| Streak system | P0 | Core retention |
| XP + Level | P0 | Core progression |
| Battle vs AI (basic) | P0 | 1 enemy type |
| Daily missions (3 types) | P0 | Learn, battle, audio |
| Rank system (5 ranks) | P0 | Progression visibility |
| Home dashboard | P0 | Streak, XP, quick actions |
| Bottom navigation | P0 | Core navigation |
| Audio playback | P1 | Basic audio per kata |
| Mascot (basic reactions) | P1 | 5 ekspresi dasar |
| Shareable streak card | P1 | Virality |
| Leaderboard (friends) | P1 | Social engagement |
| Profile page | P1 | Settings, stats |
| Dark mode | P0 | Default theme |
| PWA support | P0 | Installable web app |

### MVP Non-Features (Post-MVP)

- Friend system (manual invite via link only)
- Boss stage
- Streak freeze shop
- Cosmetic items
- Badge collection
- Advanced animation (particle effects minimal)
- Edge Functions (battle AI logic inline first)

---

## 49. Future Roadmap

### Phase 1: MVP (Month 1-2)
- Swipe vocabulary (50 kata dasar)
- Battle AI (1 enemy)
- Streak + XP + Level
- Daily missions (3 types)
- Home dashboard + bottom nav
- Dark mode + PWA

### Phase 2: Engagement (Month 3-4)
- Mascot system (12 ekspresi)
- More vocabulary (200+ kata)
- Boss stage (2 phase)
- More enemy types (3)
- Shareable cards (3 types)
- Badge system (10 badges)
- Leaderboard (friends + global)

### Phase 3: Social (Month 5-6)
- Friend system (search, add, remove)
- Friend activity feed
- Battle challenge (PvP async)
- Referral program
- Notification system (push)
- Streak freeze item shop

### Phase 4: Monetization (Month 7-8)
- Harf Pro subscription
- Cosmetic shop (mascot skins, frames)
- Reward video ads (optional)
- Analytics dashboard

### Phase 5: Scale (Month 9-12)
- 1000+ vocabulary
- Categories/thematic packs
- Native iOS app (Swift)
- Native Android app (Kotlin)
- AI conversation practice
- Full Al-Quran verse integration

---

## 50. Success Metrics

### North Star Metric

> **"Weekly Active Users (WAU) dengan 7+ streak"**

### Key Metrics

| Category | Metric | Target |
|----------|--------|--------|
| **Acquisition** | New users per day | >200 |
| **Acquisition** | Viral coefficient (K) | >0.5 |
| **Activation** | Users completing onboarding | >80% |
| **Activation** | Users who complete first swipe session | >75% |
| **Retention** | D1 | >60% |
| **Retention** | D7 | >35% |
| **Retention** | D30 | >20% |
| **Engagement** | DAU/MAU ratio | >40% |
| **Engagement** | Average session length | >7 min |
| **Engagement** | Sessions per day per user | >2 |
| **Learning** | Words learned per user (30d) | >50 |
| **Streak** | Users with 7+ day streak | >30% of active |
| **Social** | Invites per user | >0.2 |
| **Revenue** | Conversion to Pro (Phase 2+) | >3% |
| **Satisfaction** | App Store rating (future) | >4.5 |

### Tracking Implementation

- **Firebase/PostHog** untuk analytics
- **Custom events** untuk setiap interaksi game
- **Supabase audit log** untuk data history
- **Weekly dashboard** untuk tim

---

## 51. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Churn tinggi setelah week 1** | High | High | Streak system, daily missions, notifications |
| **Konten vocabulary tidak cukup** | Medium | High | Prioritaskan 500 kata untuk launch, pipeline content |
| **Battle AI terlalu mudah/sulit** | Medium | Medium | Dynamic difficulty adjustment |
| **Kualitas audio tidak memadai** | Medium | Medium | Gunakan voice actor native, quality check |
| **Competitor muncul** | Medium | Medium | Speed to market, community building |
| **Organic growth tidak tercapai** | High | Medium | Paid acquisition budget, influencer marketing |
| **Technical debt menghambat fitur baru** | Medium | Medium | Code review, refactoring sprint |
| **Server cost membengkak** | Low | Medium | Supabase pricing predictable, optimize queries |
| **Regulasi data (GDPR/PDI)** | Low | Low | Supabase compliant, data minimization |

---

## 52. Competitor Analysis

### Direct Competitors

| Competitor | Strengths | Weaknesses | Harf Advantage |
|------------|-----------|------------|----------------|
| **Duolingo** | Brand, gamification, polish | Tidak fokus Arab, tidak bahasa Indonesia | Lokal Indonesia, Arab-first |
| **Kosa Kata Arab** | Vocabulary exist | UI kuno, tidak adiktif | Modern UX, game mechanics |
| **Mufradat (app)** | Cocok pesantren | Tidak mobile-friendly, boring | Mobile-first, gamified |
| **Memrise** | Video native speaker | Mahal, tidak spesifik Arab | Free, spesifik Arab-Indonesia |

### Indirect Competitors

| Competitor | Why User Might Choose | Harf Response |
|------------|----------------------|---------------|
| **TikTok** | Hiburan, dopamine | Harf juga kasih dopamine + belajar |
| **Mobile Legends** | Seru, kompetitif | Harf ada battle mode |
| **Quizlet** | Flashcard familiar | Swipe lebih satisfying dari flashcard |

### Competitive Advantage

1. **Indonesia-specific:** Bahasa Indonesia, konteks lokal (Al-Quran, doa sehari-hari)
2. **Mobile-first:** Bukan porting dari web, genuinely mobile
3. **Game depth:** Bukan quiz biasa — ada battle, streak, rank, combo
4. **Gen Z design:** Bukan template sekolah, startup-quality UI
5. **Social:** Shareable cards, friend leaderboard

---

## 53. Landing Page Structure

### harf.app (Landing Page)

```
┌─────────────────────────────────────────────────┐
│  ⋮⋮⋮  HARF          Masuk    Daftar             │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │                                     │          │
│  │  "Belajar Bahasa Arab               │          │
│  │   Serasa Main Game"                 │          │
│  │                                     │          │
│  │  Swipe. Battle. Kuasai.             │          │
│  │                                     │          │
│  │  ┌─────────────────┐               │          │
│  │  │  Mulai Belajar   │  (CTA)        │          │
│  │  └─────────────────┘               │          │
│  │                                     │          │
│  │  📱 Tersedia di Web & PWA           │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │  👆 SWIPE — Geser kanan/kiri       │          │
│  │  untuk belajar kosakata Arab        │          │
│  │  [Swipe animation mockup]           │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │  ⚔️ BATTLE — Lawan AI, naikkan rank │          │
│  │  [Battle screen mockup]             │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │  🔥 STREAK — Belajar tiap hari,     │          │
│  │  dapatkan reward dan badge          │          │
│  │  [Streak card mockup]               │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │  "Akhirnya ada cara seru            │          │
│  │   belajar bahasa Arab!"             │          │
│  │  — Rizky, 16 thn                     │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │  🐦 Temui Burhan, maskot Harf!     │          │
│  │  [Mascot animation]                 │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  ┌─────────────────────────────────────┐          │
│  │  Mulai gratis. Tanpa download.      │          │
│  │                                     │          │
│  │  ┌─────────────────┐               │          │
│  │  │  Mulai Belajar   │               │          │
│  │  └─────────────────┘               │          │
│  └─────────────────────────────────────┘          │
│                                                   │
│  © 2026 Harf. Made in Indonesia.                  │
└─────────────────────────────────────────────────┘
```

### Technical Notes for Landing

- SEO-optimized (Next.js SSR)
- Meta tags: OG image, description, keywords
- Open Graph untuk rich preview saat di-share
- Minimal JS di landing (pure HTML + CSS untuk initial load)
- Track CTA clicks

---

## 54. Future AI Features

### Phase 5+ Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **AI Conversation Partner** | Chat dengan AI dalam bahasa Arab (text + voice) | High |
| **Voice Recognition** | User mengucapkan kata Arab, AI menilai pronunciation | High |
| **Personalized Learning Path** | AI menentukan vocabulary mana yang perlu diulang berdasarkan performa | Medium |
| **AI-generated Questions** | Generate soal battle dinamis berdasarkan vocabulary user | Medium |
| **Arabic OCR** | Foto teks Arab, langsung detect dan translate | Low |
| **Sentiment Analysis** | Deteksi frustrasi user, tawarkan easier mode | Low |
| **AI Mascot Chat** | Ngobrol dengan Burhan (mascot) dalam Bahasa Indonesia tentang bahasa Arab | Medium |

### AI Implementation Considerations

- Gunakan OpenAI API atau open-source model (e.g., Llama)
- Feature flag untuk gradual rollout
- Cost monitoring — AI features bisa mahal
- Privacy: Jangan kirim data pribadi ke third-party AI
- Fallback: Jika AI tidak available, fallback ke rule-based system

---

## Appendix

### A. Vocabulary Priority (MVP — 50 Kata)

| Category | Words |
|----------|-------|
| **Daily Objects** | كتاب, قلم, باب, نافذة, كرسي, مكتب, سرير, هاتف, مفتاح, ساعة |
| **Basic Verbs** | أكل, شرب, نام, قرأ, كتب, ذهب, جاء, جلس, وقف, ركض |
| **Numbers** | واحد, اثنان, ثلاثة, أربعة, خمسة, ستة, سبعة, ثمانية, تسعة, عشرة |
| **Family** | أب, أم, أخ, أخت, جد, جدة, عم, عمة, خال, خالة |
| **Colors** | أحمر, أزرق, أخضر, أصفر, أبيض, أسود, بني, وردي, برتقالي, رمادي |

### B. Battle Difficulty Scaling

| User Level | Enemy | Time Per Question | HP |
|------------|-------|-------------------|-----|
| 1-3 | Pemula Bot | 10s | 50 |
| 4-7 | Musafir Bot | 8s | 80 |
| 8-12 | Penuntut Bot | 7s | 120 |
| 13-20 | Nahwu King (Boss) | 6s / 5s (phase 2) | 200 |

### C. Notification Copy Examples

| Type | Copy |
|------|------|
| Streak reminder | "🔥 {username}! Streakmu #{count} hari. Ayo pertahankan!" |
| Streak danger | "⚠️ Streakmu mau putus! 1 swipe aja cukup." |
| Streak lost | "😢 Streakmu putus di {count} hari. Mulai lagi dari awal, yuk!" |
| Mission reminder | "📋 Misi hari ini: {mission}. Cuma butuh {time} menit!" |
| Friend activity | "👋 {friend} baru belajar {n} kata. Balas dong!" |
| Rank milestone | "🏆 {xp} XP lagi menuju rank {next_rank}! Ayo semangat!" |

### D. Glossary

| Term | Arti |
|------|------|
| **Swipe** | Gestur geser kanan/kiri pada card |
| **Combo** | Jawaban benar berturut-turut |
| **Streak** | Hari belajar berturut-turut |
| **XP** | Experience point |
| **Battle** | Mode tanding melawan AI |
| **Mascot** | Maskot karakter (Burhan) |
| **Freeze** | Item proteksi streak |
| **Rank** | Tingkatan pemain |
| **PWA** | Progressive Web App |
| **Fusha** | Bahasa Arab standar modern |
| **SRS** | Spaced Repetition System |

---

*Dokumen ini adalah living document dan akan terus diperbarui seiring perkembangan produk.*  
*Harf — حرف*
