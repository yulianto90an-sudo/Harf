import type { DifficultyTier } from '@/data/vocabulary';

export type NodeType = 'lesson' | 'review' | 'boss';
export type LessonStatus = 'locked' | 'available' | 'completed';

export interface UnlockRequirements {
  previous_node_id?: string;
  required_world_completed?: string;
  min_xp?: number;
  boss_defeated?: string;
}

export interface ChapterNode {
  id: string;
  type: NodeType;
  title: string;
  subtitle: string;
  lesson_id?: string;
  xp_reward: number;
  word_count: number;
  max_stars: number;
  unlock_requirements: UnlockRequirements;
}

export interface BossReward {
  chest?: string;
  xp_bonus: number;
}

export interface WorldBoss {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  xp_reward: number;
  enemy_id: string;
  pool_tier: DifficultyTier;
  boss_reward: BossReward;
}

export interface WorldUnlockReward {
  title: string;
  xp: number;
  description: string;
}

export interface World {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  gradient: string;
  accent: string;
  description: string;
  goal: string;
  vocabulary_target: number;
  chapters: ChapterNode[];
  boss: WorldBoss;
  unlock_reward: WorldUnlockReward;
  new_mechanics?: string[];
}

export interface NodeProgress {
  nodeId: string;
  status: LessonStatus;
  xpEarned: number;
  stars: number;
  completedAt: number | null;
  attempts: number;
}

export interface WorldProgress {
  worldId: string;
  completed: boolean;
  rewardClaimed: boolean;
}

export interface CompletionResult {
  nodeId: string;
  xpEarned: number;
  stars: number;
  unlockedNodeId: string | null;
  unlockedNodeTitle: string | null;
  worldCompleted: boolean;
  worldReward: WorldUnlockReward | null;
  isBoss: boolean;
  bossReward: BossReward | null;
}

export const WORLDS: World[] = [
  {
    id: 'world-1',
    title: 'First Words',
    subtitle: 'Kata Pertamaku',
    order: 1,
    gradient: 'from-emerald-500/20 to-teal-600/20',
    accent: '#10B981',
    description: 'Bangun kepercayaan dirimu dengan kosakata Arab pertama!',
    goal: 'Mengenal 40+ kata dasar bahasa Arab.',
    vocabulary_target: 42,
    chapters: [
      {
        id: 'w1-c1', type: 'lesson',
        title: 'Salam', subtitle: 'Assalamualaikum!',
        lesson_id: 'lesson-01',
        xp_reward: 50, word_count: 7,
        max_stars: 3,
        unlock_requirements: {},
      },
      {
        id: 'w1-c2', type: 'lesson',
        title: 'Sopan Santun', subtitle: 'Syukran!',
        lesson_id: 'lesson-02',
        xp_reward: 50, word_count: 7,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-c1' },
      },
      {
        id: 'w1-c3', type: 'lesson',
        title: 'Keluargaku', subtitle: 'Ayah & Ibu',
        lesson_id: 'lesson-03',
        xp_reward: 55, word_count: 7,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-c2' },
      },
      {
        id: 'w1-c4', type: 'lesson',
        title: 'Angka 1–5', subtitle: 'Satu, Dua, Tiga…',
        lesson_id: 'lesson-04',
        xp_reward: 40, word_count: 5,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-c3' },
      },
      {
        id: 'w1-c5', type: 'lesson',
        title: 'Angka 6–10', subtitle: 'Lanjut Hitung!',
        lesson_id: 'lesson-05',
        xp_reward: 40, word_count: 5,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-c4' },
      },
      {
        id: 'w1-c6', type: 'lesson',
        title: 'Warna-warni', subtitle: 'Merah, Biru, Hijau…',
        lesson_id: 'lesson-06',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-c5' },
      },
      {
        id: 'w1-review', type: 'review',
        title: 'Mini Review', subtitle: 'Ulang Kembali!',
        xp_reward: 70, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-c6' },
      },
      {
        id: 'w1-boss', type: 'boss',
        title: 'Daily Greetings', subtitle: 'Salam Sehari-hari',
        xp_reward: 150, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-review' },
      },
    ],
    boss: {
      id: 'boss-daily-greetings',
      title: 'Daily Greetings',
      subtitle: 'Uji Kemampuan Salam!',
      color: '#10B981',
      xp_reward: 150,
      enemy_id: 'e1', pool_tier: 'easy',
      boss_reward: { chest: 'Beginner Chest', xp_bonus: 100 },
    },
    unlock_reward: {
      title: 'Beginner Badge',
      xp: 100,
      description: 'First Streak Celebration!',
    },
  },
  {
    id: 'world-2',
    title: 'Family & Daily Life',
    subtitle: 'Keluarga & Sehari-hari',
    order: 2,
    gradient: 'from-blue-500/20 to-indigo-600/20',
    accent: '#3B82F6',
    description: 'Kenali keluarga dan aktivitas sehari-hari dalam bahasa Arab.',
    goal: 'Bicara tentang hubungan dekat dan kegiatan harian.',
    vocabulary_target: 60,
    chapters: [
      {
        id: 'w2-c1', type: 'lesson',
        title: 'Di Sekolah', subtitle: 'Belajar & Mengajar',
        lesson_id: 'lesson-07',
        xp_reward: 60, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w1-boss' },
      },
      {
        id: 'w2-c2', type: 'lesson',
        title: 'Makanan & Minuman', subtitle: 'Enak!',
        lesson_id: 'lesson-08',
        xp_reward: 65, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-c1' },
      },
      {
        id: 'w2-c3', type: 'lesson',
        title: 'Rasa & Perasaan', subtitle: 'Sedih & Senang',
        lesson_id: 'lesson-09',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-c2' },
      },
      {
        id: 'w2-c4', type: 'lesson',
        title: 'Hari & Waktu', subtitle: 'Hari ini, Kemarin, Besok',
        lesson_id: 'lesson-10',
        xp_reward: 65, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-c3' },
      },
      {
        id: 'w2-c5', type: 'lesson',
        title: 'Aktivitas Harian', subtitle: 'Bangun, Makan, Tidur',
        lesson_id: 'lesson-11',
        xp_reward: 65, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-c4' },
      },
      {
        id: 'w2-c6', type: 'lesson',
        title: 'Benda di Rumah', subtitle: 'Pintu, Jendela, Kursi',
        lesson_id: 'lesson-12',
        xp_reward: 60, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-c5' },
      },
      {
        id: 'w2-review', type: 'review',
        title: 'Listening Review', subtitle: 'Dengar & Ulang!',
        xp_reward: 80, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-c6' },
      },
      {
        id: 'w2-boss', type: 'boss',
        title: 'Daily Life Rush', subtitle: 'Rutinitas Harian',
        xp_reward: 180, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-review' },
      },
    ],
    boss: {
      id: 'boss-daily-life',
      title: 'Daily Life Rush',
      subtitle: 'Hadapi Tantangan Sehari-hari!',
      color: '#3B82F6',
      xp_reward: 180,
      enemy_id: 'e2', pool_tier: 'easy',
      boss_reward: { chest: 'Daily Chest', xp_bonus: 150 },
    },
    unlock_reward: {
      title: 'Musafir Rank',
      xp: 150,
      description: 'New Mascot Animation + Rare Chest',
    },
    new_mechanics: ['Listening Mode', 'Combo Multiplier', 'Speed Challenge'],
  },
  {
    id: 'world-3',
    title: 'Survival Arabic',
    subtitle: 'Arabku Sehari-hari',
    order: 3,
    gradient: 'from-orange-500/20 to-amber-600/20',
    accent: '#F97316',
    description: 'Bahasa Arab praktis untuk situasi nyata!',
    goal: 'Mampu menggunakan Arab dalam situasi sederhana.',
    vocabulary_target: 80,
    chapters: [
      {
        id: 'w3-c1', type: 'lesson',
        title: 'Alam Sekitar', subtitle: 'Langit, Bumi, Laut',
        lesson_id: 'lesson-13',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w2-boss' },
      },
      {
        id: 'w3-c2', type: 'lesson',
        title: 'Ibadah', subtitle: 'Sholat & Doa',
        lesson_id: 'lesson-14',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-c1' },
      },
      {
        id: 'w3-c3', type: 'lesson',
        title: 'Tubuhku', subtitle: 'Kepala, Mata, Mulut',
        lesson_id: 'lesson-15',
        xp_reward: 60, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-c2' },
      },
      {
        id: 'w3-c4', type: 'lesson',
        title: 'Kata Tanya', subtitle: 'Apa, Siapa, Kenapa?',
        lesson_id: 'lesson-16',
        xp_reward: 50, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-c3' },
      },
      {
        id: 'w3-c5', type: 'lesson',
        title: 'Arah & Tempat', subtitle: 'Kiri, Kanan, Depan',
        lesson_id: 'lesson-17',
        xp_reward: 50, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-c4' },
      },
      {
        id: 'w3-c6', type: 'lesson',
        title: 'Bepergian', subtitle: 'Jalan-jalan Yuk!',
        lesson_id: 'lesson-18',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-c5' },
      },
      {
        id: 'w3-review', type: 'review',
        title: 'Quick Response', subtitle: 'Reaksi Cepat!',
        xp_reward: 85, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-c6' },
      },
      {
        id: 'w3-boss', type: 'boss',
        title: 'Airport Rush', subtitle: 'Di Bandara',
        xp_reward: 200, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-review' },
      },
    ],
    boss: {
      id: 'boss-airport',
      title: 'Airport Rush',
      subtitle: 'Bertahan di Bandara!',
      color: '#F97316',
      xp_reward: 200,
      enemy_id: 'e3', pool_tier: 'medium',
      boss_reward: { chest: 'Travel Chest', xp_bonus: 200 },
    },
    unlock_reward: {
      title: 'Battle Arena Unlock',
      xp: 200,
      description: 'Gold League Access + Custom Avatar Frame',
    },
    new_mechanics: ['Timed Battles', 'Combo Streak Protection', 'Reaction Speed Training'],
  },
  {
    id: 'world-4',
    title: 'Building Sentences',
    subtitle: 'Membangun Kalimat',
    order: 4,
    gradient: 'from-purple-500/20 to-violet-600/20',
    accent: '#8B5CF6',
    description: 'Mulai merangkai kata menjadi kalimat.',
    goal: 'Memahami struktur kalimat sederhana.',
    vocabulary_target: 40,
    chapters: [
      {
        id: 'w4-c1', type: 'lesson',
        title: 'Kata Kerja', subtitle: 'Lakukan!',
        lesson_id: 'lesson-19',
        xp_reward: 65, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w3-boss' },
      },
      {
        id: 'w4-c2', type: 'lesson',
        title: 'Perkenalan Diri', subtitle: 'Siapa Namamu?',
        lesson_id: 'lesson-21',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w4-c1' },
      },
      {
        id: 'w4-c3', type: 'lesson',
        title: 'Kata Tanya Dasar', subtitle: 'Apa, Siapa, Kenapa?',
        lesson_id: 'lesson-22',
        xp_reward: 50, word_count: 7,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w4-c2' },
      },
      {
        id: 'w4-c4', type: 'lesson',
        title: 'Kata Sifat', subtitle: 'Besar, Kecil, Indah',
        lesson_id: 'lesson-29',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w4-c3' },
      },
      {
        id: 'w4-review', type: 'review',
        title: 'Sentence Builder', subtitle: 'Rangkai Kalimat!',
        xp_reward: 80, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w4-c4' },
      },
      {
        id: 'w4-boss', type: 'boss',
        title: 'Sentence Combo Trial', subtitle: 'Rangkai Kata!',
        xp_reward: 220, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w4-review' },
      },
    ],
    boss: {
      id: 'boss-sentence-combo',
      title: 'Sentence Combo Trial',
      subtitle: 'Rangkai Kata!',
      color: '#8B5CF6',
      xp_reward: 220,
      enemy_id: 'e4', pool_tier: 'medium',
      boss_reward: { xp_bonus: 250 },
    },
    unlock_reward: {
      title: 'Penuntut Ilmu Rank',
      xp: 250,
      description: 'Animated Badge + Legendary Streak Flame',
    },
    new_mechanics: ['Sentence Swipe Cards', 'Grammar Hints', 'Mini Dialogue Battles'],
  },
  {
    id: 'world-5',
    title: 'Daily Conversation',
    subtitle: 'Percakapan Harian',
    order: 5,
    gradient: 'from-pink-500/20 to-rose-600/20',
    accent: '#EC4899',
    description: 'Percakapan sehari-hari dengan percaya diri.',
    goal: 'Memahami pola percakapan dasar.',
    vocabulary_target: 80,
    chapters: [
      {
        id: 'w5-c1', type: 'lesson',
        title: 'Pakaian', subtitle: 'Baju & Aksesoris',
        lesson_id: 'lesson-25',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w4-boss' },
      },
      {
        id: 'w5-c2', type: 'lesson',
        title: 'Cuaca & Alam', subtitle: 'Panas, Hujan, Dingin',
        lesson_id: 'lesson-26',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c1' },
      },
      {
        id: 'w5-c3', type: 'lesson',
        title: 'Keluarga Besar', subtitle: 'Kakek, Nenek, Paman',
        lesson_id: 'lesson-27',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c2' },
      },
      {
        id: 'w5-c4', type: 'lesson',
        title: 'Profesi', subtitle: 'Dokter, Guru, Polisi',
        lesson_id: 'lesson-28',
        xp_reward: 60, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c3' },
      },
      {
        id: 'w5-c5', type: 'lesson',
        title: 'Binatang', subtitle: 'Kucing, Anjing, Singa',
        lesson_id: 'lesson-23',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c4' },
      },
      {
        id: 'w5-c6', type: 'lesson',
        title: 'Buah-buahan', subtitle: 'Apel, Pisang, Jeruk',
        lesson_id: 'lesson-24',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c5' },
      },
      {
        id: 'w5-c7', type: 'lesson',
        title: 'Sayuran & Minuman', subtitle: 'Sehat & Segar!',
        lesson_id: 'lesson-30',
        xp_reward: 55, word_count: 8,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c6' },
      },
      {
        id: 'w5-review', type: 'review',
        title: 'Daily Chat Review', subtitle: 'Ulang Percakapan!',
        xp_reward: 85, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-c7' },
      },
      {
        id: 'w5-boss', type: 'boss',
        title: 'Conversation Arena', subtitle: 'Adu Percakapan!',
        xp_reward: 250, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-review' },
      },
    ],
    boss: {
      id: 'boss-conversation',
      title: 'Conversation Arena',
      subtitle: 'Adu Percakapan!',
      color: '#EC4899',
      xp_reward: 250,
      enemy_id: 'e4', pool_tier: 'hard',
      boss_reward: { chest: 'Conversation Chest', xp_bonus: 300 },
    },
    unlock_reward: {
      title: 'Emerald League',
      xp: 300,
      description: 'Social Sharing Unlock + Animated Nameplate',
    },
    new_mechanics: ['Dialogue Mode', 'Pronunciation Challenge', 'Streak Combo Battles'],
  },
  {
    id: 'world-6',
    title: 'Worship & Quranic',
    subtitle: 'Ibadah & Quran',
    order: 6,
    gradient: 'from-emerald-600/20 to-green-700/20',
    accent: '#059669',
    description: 'Kosakata ibadah dan akrab dengan Quran.',
    goal: 'Mengenal kosakata Arab Islami sehari-hari.',
    vocabulary_target: 120,
    chapters: [
      {
        id: 'w6-c1', type: 'lesson',
        title: 'Ucapan Sopan Dasar', subtitle: 'MasyaAllah!',
        lesson_id: 'lesson-31',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w5-boss' },
      },
      {
        id: 'w6-c2', type: 'lesson',
        title: 'Adab di Rumah', subtitle: 'Ahlan bi Ahli!',
        lesson_id: 'lesson-32',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c1' },
      },
      {
        id: 'w6-c3', type: 'lesson',
        title: 'Sopan Santun di Sekolah', subtitle: 'Adab Belajar',
        lesson_id: 'lesson-33',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c2' },
      },
      {
        id: 'w6-c4', type: 'lesson',
        title: 'Adab Makan', subtitle: 'Bismillah!',
        lesson_id: 'lesson-34',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c3' },
      },
      {
        id: 'w6-c5', type: 'lesson',
        title: 'Adab Berteman', subtitle: 'Teman Baik',
        lesson_id: 'lesson-35',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c4' },
      },
      {
        id: 'w6-c6', type: 'lesson',
        title: 'Adab di Masjid', subtitle: 'Rumah Allah',
        lesson_id: 'lesson-36',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c5' },
      },
      {
        id: 'w6-c7', type: 'lesson',
        title: 'Sopan Santun Sehari-hari', subtitle: 'Akhlak Mulia',
        lesson_id: 'lesson-37',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c6' },
      },
      {
        id: 'w6-c8', type: 'lesson',
        title: 'Ucapan Positif', subtitle: 'Kata-kata Baik',
        lesson_id: 'lesson-38',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c7' },
      },
      {
        id: 'w6-c9', type: 'lesson',
        title: 'Review & Mixed Adab', subtitle: 'Ulang Kembali',
        lesson_id: 'lesson-39',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c8' },
      },
      {
        id: 'w6-c10', type: 'lesson',
        title: 'Adab Champion', subtitle: 'Uji Adabmu!',
        lesson_id: 'lesson-40',
        xp_reward: 100, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c9' },
      },
      {
        id: 'w6-review', type: 'review',
        title: 'Adab Review', subtitle: 'Ulang Sopan Santun!',
        xp_reward: 90, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-c10' },
      },
    ],
    boss: {
      id: 'boss-noor',
      title: 'Noor Trial',
      subtitle: 'Cahaya Ilmu!',
      color: '#059669',
      xp_reward: 300,
      enemy_id: 'e4', pool_tier: 'hard',
      boss_reward: { xp_bonus: 350 },
    },
    unlock_reward: {
      title: 'Ahli Nahwu Rank',
      xp: 350,
      description: 'Noor Theme + Rare Prestige Badge',
    },
    new_mechanics: ['Quranic Listening', "Du'a Recognition"],
  },
  {
    id: 'world-7',
    title: 'Intermediate Mastery',
    subtitle: 'Mahir Bahasa Arab',
    order: 7,
    gradient: 'from-yellow-500/20 to-amber-600/20',
    accent: '#F59E0B',
    description: 'Tingkatkan kemampuan membaca dan mendengar.',
    goal: 'Percaya diri membaca dan mendengar Arab.',
    vocabulary_target: 157,
    chapters: [
      {
        id: 'w7-c1', type: 'lesson',
        title: 'Review Master', subtitle: 'Uji Kemampuanmu!',
        lesson_id: 'lesson-20',
        xp_reward: 100, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w6-boss' },
      },
      {
        id: 'w7-c2', type: 'lesson',
        title: 'Transportation', subtitle: 'Naik Apa?',
        lesson_id: 'lesson-41',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c1' },
      },
      {
        id: 'w7-c3', type: 'lesson',
        title: 'Shopping', subtitle: 'Belanja Yuk!',
        lesson_id: 'lesson-42',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c2' },
      },
      {
        id: 'w7-c4', type: 'lesson',
        title: 'Weather', subtitle: 'Cuaca Hari Ini',
        lesson_id: 'lesson-43',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c3' },
      },
      {
        id: 'w7-c5', type: 'lesson',
        title: 'Technology', subtitle: 'Digital Daily',
        lesson_id: 'lesson-44',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c4' },
      },
      {
        id: 'w7-c6', type: 'lesson',
        title: 'Health', subtitle: 'Sehat Selalu',
        lesson_id: 'lesson-45',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c5' },
      },
      {
        id: 'w7-c7', type: 'lesson',
        title: 'Public Places', subtitle: 'Di Mana?',
        lesson_id: 'lesson-46',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c6' },
      },
      {
        id: 'w7-c8', type: 'lesson',
        title: 'Daily Activities', subtitle: 'Aktivitas Harian',
        lesson_id: 'lesson-47',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c7' },
      },
      {
        id: 'w7-c9', type: 'lesson',
        title: 'Motivation', subtitle: 'Tetap Semangat!',
        lesson_id: 'lesson-48',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c8' },
      },
      {
        id: 'w7-c10', type: 'lesson',
        title: 'Simple Conversation', subtitle: 'Ngobrol Yuk!',
        lesson_id: 'lesson-49',
        xp_reward: 55, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c9' },
      },
      {
        id: 'w7-c11', type: 'lesson',
        title: 'Daily Life Master', subtitle: 'Uji Kemampuan!',
        lesson_id: 'lesson-50',
        xp_reward: 100, word_count: 10,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c10' },
      },
      {
        id: 'w7-review', type: 'review',
        title: 'Final Review', subtitle: 'Uji Semua!',
        xp_reward: 100, word_count: 0,
        max_stars: 3,
        unlock_requirements: { previous_node_id: 'w7-c11' },
      },
    ],
    boss: {
      id: 'boss-sultan',
      title: 'Sultan Arena',
      subtitle: 'Pertarungan Terakhir!',
      color: '#F59E0B',
      xp_reward: 500,
      enemy_id: 'e4', pool_tier: 'hard',
      boss_reward: { chest: 'Sultan Chest', xp_bonus: 500 },
    },
    unlock_reward: {
      title: 'Sultan Rank',
      xp: 500,
      description: 'Prestige Aura + Legendary Profile Effects',
    },
    new_mechanics: ['Elite Battles', 'Streak Multipliers', 'Ranked Competition'],
  },
];

export function getWorldById(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

export function getNodeById(nodeId: string): { world: World; node: ChapterNode } | undefined {
  for (const world of WORLDS) {
    const node = world.chapters.find((c) => c.id === nodeId);
    if (node) return { world, node };
  }
  return undefined;
}

export function getNodesUpTo(nodeId: string): ChapterNode[] {
  const nodes: ChapterNode[] = [];
  for (const world of WORLDS) {
    for (const chapter of world.chapters) {
      nodes.push(chapter);
      if (chapter.id === nodeId) return nodes;
    }
  }
  return nodes;
}

export function getAllNodes(): ChapterNode[] {
  return WORLDS.flatMap((w) => w.chapters);
}

export function getNextNode(currentNodeId: string): ChapterNode | null {
  const all = getAllNodes();
  const idx = all.findIndex((n) => n.id === currentNodeId);
  if (idx === -1 || idx >= all.length - 1) return null;
  return all[idx + 1];
}

export function getNodeStars(score: number, maxScore: number): number {
  if (maxScore <= 0) return 3;
  const ratio = score / maxScore;
  if (ratio >= 0.95) return 3;
  if (ratio >= 0.75) return 2;
  return 1;
}

export function findNodeByLessonId(lessonId: string): ChapterNode | undefined {
  for (const world of WORLDS) {
    const node = world.chapters.find((c) => c.lesson_id === lessonId);
    if (node) return node;
  }
  return undefined;
}

export function findWorldByLessonId(lessonId: string): World | undefined {
  for (const world of WORLDS) {
    const found = world.chapters.find((c) => c.lesson_id === lessonId);
    if (found) return world;
  }
  return undefined;
}
