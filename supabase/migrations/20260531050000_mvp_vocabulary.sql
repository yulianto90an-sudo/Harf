-- Harf MVP Vocabulary Dataset
-- Migration: 20260531_mvp_vocabulary

-- ============================================================
-- New Categories
-- ============================================================
INSERT INTO categories (name, slug, icon, color) VALUES
  ('Salam', 'greetings', '👋', '#10B981'),
  ('Sopan Santun', 'politeness', '🙏', '#3B82F6'),
  ('Keluarga', 'family', '👨‍👩‍👧‍👦', '#F97316'),
  ('Sekolah', 'school', '🎒', '#A855F7'),
  ('Makanan', 'food', '🍽️', '#EF4444'),
  ('Perasaan', 'emotions', '😊', '#FACC15'),
  ('Aktivitas', 'activities', '🏃', '#06B6D4'),
  ('Benda', 'objects', '📦', '#8B5CF6'),
  ('Alam', 'nature', '🌿', '#10B981'),
  ('Ibadah', 'worship', '🕌', '#34D399'),
  ('Tubuh', 'body', '🧍', '#F472B6'),
  ('Kata Tanya', 'question-words', '❓', '#FBBF24'),
  ('Arah', 'directions', '🧭', '#60A5FA'),
  ('Bepergian', 'travel', '✈️', '#F97316'),
  ('Kata Kerja', 'verbs', '⚡', '#A78BFA')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Lessons
-- ============================================================
INSERT INTO lessons (id, title, description, difficulty, order_index, xp_reward, word_count) VALUES
  ('lesson-01', 'Salam — Halo!', 'Belajar salam dan sapaan dasar dalam bahasa Arab.', 1, 1, 50, 7),
  ('lesson-02', 'Sopan Santun — Terima Kasih!', 'Kata-kata sopan santun yang dipakai sehari-hari.', 1, 2, 50, 7),
  ('lesson-03', 'Keluargaku — Ayah & Ibu', 'Panggilan keluarga yang hangat dan akrab.', 1, 3, 55, 7),
  ('lesson-04', 'Angka 1–5 — Satu, Dua, Tiga…', 'Mulai menghitung dalam bahasa Arab.', 1, 4, 40, 5),
  ('lesson-05', 'Angka 6–10 — Lanjut Menghitung!', 'Lanjutan angka dasar bahasa Arab.', 1, 5, 40, 5),
  ('lesson-06', 'Warna-warni — Merah, Biru, Hijau…', 'Mengenal warna-warna indah dalam bahasa Arab.', 1, 6, 55, 8),
  ('lesson-07', 'Di Sekolah — Belajar & Mengajar', 'Kosakata seputar sekolah dan belajar.', 1, 7, 60, 10),
  ('lesson-08', 'Makanan & Minuman — Enak!', 'Kosakata makanan dan minuman favorit.', 1, 8, 65, 10),
  ('lesson-09', 'Rasa & Perasaan — Sedih & Senang', 'Mengungkapkan perasaan dalam bahasa Arab.', 1, 9, 55, 8),
  ('lesson-10', 'Hari & Waktu — Hari ini, Kemarin, Besok', 'Kosakata waktu dan hari.', 1, 10, 65, 10),
  ('lesson-11', 'Aktivitas Harian — Bangun, Makan, Tidur', 'Kegiatan sehari-hari dari pagi sampai malam.', 1, 11, 65, 10),
  ('lesson-12', 'Benda di Rumah — Pintu, Jendela, Kursi', 'Benda-benda yang ada di sekitar rumah.', 1, 12, 60, 10),
  ('lesson-13', 'Alam Sekitar — Langit, Bumi, Laut', 'Keindahan alam dalam bahasa Arab.', 1, 13, 55, 8),
  ('lesson-14', 'Ibadah — Sholat & Doa', 'Kosakata ibadah sehari-hari.', 1, 14, 55, 8),
  ('lesson-15', 'Tubuhku — Kepala, Mata, Mulut', 'Anggota tubuh dalam bahasa Arab.', 1, 15, 60, 10),
  ('lesson-16', 'Kata Tanya — Apa, Siapa, Kenapa?', 'Kata tanya penting untuk bertanya.', 1, 16, 50, 8),
  ('lesson-17', 'Arah & Tempat — Kiri, Kanan, Depan', 'Menunjukkan arah dan posisi.', 1, 17, 50, 8),
  ('lesson-18', 'Bepergian — Jalan-jalan Yuk!', 'Kosakata untuk traveling.', 1, 18, 55, 8),
  ('lesson-19', 'Kata Kerja — Lakukan!', 'Kata kerja dasar yang sering dipakai.', 1, 19, 65, 10),
  ('lesson-20', 'Review Master — Uji Kemampuanmu!', 'Review semua kosakata penting.', 1, 20, 100, 0);

-- ============================================================
-- Vocabulary Words
-- ============================================================

-- Helper: get category id
DO $$ DECLARE
  cat_greetings UUID; cat_politeness UUID; cat_family UUID; cat_numbers UUID;
  cat_school UUID; cat_food UUID; cat_emotions UUID; cat_colors UUID;
  cat_time UUID; cat_activities UUID; cat_objects UUID; cat_nature UUID;
  cat_worship UUID; cat_body UUID; cat_question UUID; cat_directions UUID;
  cat_travel UUID; cat_verbs UUID;
  l01 UUID; l02 UUID; l03 UUID; l04 UUID; l05 UUID; l06 UUID;
  l07 UUID; l08 UUID; l09 UUID; l10 UUID; l11 UUID; l12 UUID;
  l13 UUID; l14 UUID; l15 UUID; l16 UUID; l17 UUID; l18 UUID; l19 UUID; l20 UUID;
BEGIN
  SELECT id INTO cat_greetings FROM categories WHERE slug = 'greetings';
  SELECT id INTO cat_politeness FROM categories WHERE slug = 'politeness';
  SELECT id INTO cat_family FROM categories WHERE slug = 'family';
  SELECT id INTO cat_numbers FROM categories WHERE slug = 'numbers';
  SELECT id INTO cat_school FROM categories WHERE slug = 'school';
  SELECT id INTO cat_food FROM categories WHERE slug = 'food';
  SELECT id INTO cat_emotions FROM categories WHERE slug = 'emotions';
  SELECT id INTO cat_colors FROM categories WHERE slug = 'colors';
  SELECT id INTO cat_time FROM categories WHERE slug = 'time';
  SELECT id INTO cat_activities FROM categories WHERE slug = 'activities';
  SELECT id INTO cat_objects FROM categories WHERE slug = 'objects';
  SELECT id INTO cat_nature FROM categories WHERE slug = 'nature';
  SELECT id INTO cat_worship FROM categories WHERE slug = 'worship';
  SELECT id INTO cat_body FROM categories WHERE slug = 'body';
  SELECT id INTO cat_question FROM categories WHERE slug = 'question-words';
  SELECT id INTO cat_directions FROM categories WHERE slug = 'directions';
  SELECT id INTO cat_travel FROM categories WHERE slug = 'travel';
  SELECT id INTO cat_verbs FROM categories WHERE slug = 'verbs';

  SELECT id INTO l01 FROM lessons WHERE id = 'lesson-01';
  SELECT id INTO l02 FROM lessons WHERE id = 'lesson-02';
  SELECT id INTO l03 FROM lessons WHERE id = 'lesson-03';
  SELECT id INTO l04 FROM lessons WHERE id = 'lesson-04';
  SELECT id INTO l05 FROM lessons WHERE id = 'lesson-05';
  SELECT id INTO l06 FROM lessons WHERE id = 'lesson-06';
  SELECT id INTO l07 FROM lessons WHERE id = 'lesson-07';
  SELECT id INTO l08 FROM lessons WHERE id = 'lesson-08';
  SELECT id INTO l09 FROM lessons WHERE id = 'lesson-09';
  SELECT id INTO l10 FROM lessons WHERE id = 'lesson-10';
  SELECT id INTO l11 FROM lessons WHERE id = 'lesson-11';
  SELECT id INTO l12 FROM lessons WHERE id = 'lesson-12';
  SELECT id INTO l13 FROM lessons WHERE id = 'lesson-13';
  SELECT id INTO l14 FROM lessons WHERE id = 'lesson-14';
  SELECT id INTO l15 FROM lessons WHERE id = 'lesson-15';
  SELECT id INTO l16 FROM lessons WHERE id = 'lesson-16';
  SELECT id INTO l17 FROM lessons WHERE id = 'lesson-17';
  SELECT id INTO l18 FROM lessons WHERE id = 'lesson-18';
  SELECT id INTO l19 FROM lessons WHERE id = 'lesson-19';
  SELECT id INTO l20 FROM lessons WHERE id = 'lesson-20';

  -- Lesson 1: Salam
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-001', 'السَّلَامُ عَلَيْكُمْ', 'assalamualaikum', 'semoga keselamatan untukmu', 'peace be upon you', cat_greetings, 1, 'expression', 'السَّلَامُ عَلَيْكُمْ يَا صَدِيقِي', 'Assalamualaikum wahai temanku.'),
    ('w-002', 'وَعَلَيْكُمُ السَّلَامُ', 'waalaikumussalam', 'dan semoga keselamatan untukmu juga', 'and peace be upon you too', cat_greetings, 1, 'expression', 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ', 'Waalaikumussalam dan rahmat Allah.'),
    ('w-003', 'مَرْحَبًا', 'marhaban', 'selamat datang / halo', 'welcome / hello', cat_greetings, 1, 'expression', 'مَرْحَبًا بِكَ فِي الْفَصْلِ', 'Selamat datang di kelas.'),
    ('w-004', 'كَيْفَ حَالُكَ', 'kaifa haluka', 'apa kabarmu (lk)', 'how are you (m)', cat_greetings, 1, 'expression', 'كَيْفَ حَالُكَ الْيَوْمَ', 'Apa kabarmu hari ini?'),
    ('w-005', 'كَيْفَ حَالُكِ', 'kaifa haluki', 'apa kabarmu (pr)', 'how are you (f)', cat_greetings, 1, 'expression', 'كَيْفَ حَالُكِ يَا أُخْتِي', 'Apa kabarmu wahai saudariku?'),
    ('w-006', 'بِخَيْرٍ', 'bikhairin', 'baik (dalam keadaan baik)', 'fine (in good condition)', cat_greetings, 1, 'expression', 'أَنَا بِخَيْرٍ وَالْحَمْدُ لِلَّهِ', 'Saya baik, alhamdulillah.'),
    ('w-007', 'أَهْلًا وَسَهْلًا', 'ahlan wa sahlan', 'selamat datang', 'welcome', cat_greetings, 1, 'expression', 'أَهْلًا وَسَهْلًا بِكَ يَا ضَيْفَنَا', 'Selamat datang wahai tamu kami.');

  -- Lesson 2: Sopan Santun
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-008', 'شُكْرًا', 'syukran', 'terima kasih', 'thank you', cat_politeness, 1, 'expression', 'شُكْرًا جَزِيلًا عَلَى مُسَاعَدَتِكَ', 'Terima kasih banyak atas bantuanmu.'),
    ('w-009', 'عَفْوًا', 'afwan', 'sama-sama / maaf', 'you''re welcome / sorry', cat_politeness, 1, 'expression', 'عَفْوًا، هَذَا وَاجِبِي', 'Sama-sama, ini tugasku.'),
    ('w-010', 'نَعَمْ', 'naam', 'iya', 'yes', cat_politeness, 1, 'expression', 'نَعَمْ، أَنَا فَهِمْتُ الدَّرْسَ', 'Iya, saya paham pelajarannya.'),
    ('w-011', 'لَا', 'la', 'tidak', 'no', cat_politeness, 1, 'expression', 'لَا، لَسْتُ مَرِيضًا', 'Tidak, saya tidak sakit.'),
    ('w-012', 'مَعَ السَّلَامَةِ', 'maassalamah', 'selamat tinggal', 'goodbye', cat_politeness, 1, 'expression', 'مَعَ السَّلَامَةِ إِلَى اللِّقَاءِ', 'Selamat tinggal, sampai jumpa.'),
    ('w-013', 'أَسْفُ', 'asif', 'maaf', 'sorry', cat_politeness, 1, 'expression', 'أَسْفُ عَلَى التَّأْخِيرِ', 'Maaf atas keterlambatannya.'),
    ('w-014', 'الْحَمْدُ لِلَّهِ', 'alhamdulillah', 'segala puji bagi Allah', 'praise be to Allah', cat_politeness, 1, 'expression', 'الْحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ', 'Alhamdulillah atas segala keadaan.');

  -- Lesson 3: Keluargaku
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-015', 'أَبِي', 'abi', 'ayahku', 'my father', cat_family, 1, 'noun', 'أَبِي رَجُلٌ صَالِحٌ', 'Ayahku adalah laki-laki yang shalih.'),
    ('w-016', 'أُمِّي', 'ummi', 'ibuku', 'my mother', cat_family, 1, 'noun', 'أُمِّي تُحِبُّ الطَّبْخَ جِدًّا', 'Ibuku sangat suka memasak.'),
    ('w-017', 'أَخِي', 'akhi', 'saudara laki-lakiku', 'my brother', cat_family, 1, 'noun', 'أَخِي يَدْرُسُ فِي الْجَامِعَةِ', 'Saudaraku kuliah di universitas.'),
    ('w-018', 'أُخْتِي', 'ukhti', 'saudara perempuanku', 'my sister', cat_family, 1, 'noun', 'أُخْتِي تُجِيدُ الْقِرَاءَةَ', 'Saudariku pandai membaca.'),
    ('w-019', 'جَدِّي', 'jaddi', 'kakekku', 'my grandfather', cat_family, 1, 'noun', 'جَدِّي كَرِيمٌ وَطَيِّبٌ', 'Kakekku dermawan dan baik hati.'),
    ('w-020', 'جَدَّتِي', 'jaddati', 'nenekku', 'my grandmother', cat_family, 1, 'noun', 'جَدَّتِي تُحِبُّ الْحَفِيدَاتِ', 'Nenekku sayang kepada cucu-cucu.'),
    ('w-021', 'صَدِيقِي', 'sadiqi', 'temanku', 'my friend', cat_family, 1, 'noun', 'صَدِيقِي وَفِيٌّ وَأَمِينٌ', 'Temanku setia dan dapat dipercaya.');

  -- Lesson 4: Angka 1-5
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type) VALUES
    ('w-022', 'وَاحِد', 'wahid', 'satu', 'one', cat_numbers, 1, 'noun'),
    ('w-023', 'اِثْنَانِ', 'itsnani', 'dua', 'two', cat_numbers, 1, 'noun'),
    ('w-024', 'ثَلَاثَةٌ', 'tsalatsatun', 'tiga', 'three', cat_numbers, 1, 'noun'),
    ('w-025', 'أَرْبَعَةٌ', 'arbaatun', 'empat', 'four', cat_numbers, 1, 'noun'),
    ('w-026', 'خَمْسَةٌ', 'khamsatun', 'lima', 'five', cat_numbers, 1, 'noun');

  -- Lesson 5: Angka 6-10
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type) VALUES
    ('w-027', 'سِتَّةٌ', 'sittatun', 'enam', 'six', cat_numbers, 1, 'noun'),
    ('w-028', 'سَبْعَةٌ', 'sab''atun', 'tujuh', 'seven', cat_numbers, 1, 'noun'),
    ('w-029', 'ثَمَانِيَةٌ', 'tsamaniyatun', 'delapan', 'eight', cat_numbers, 2, 'noun'),
    ('w-030', 'تِسْعَةٌ', 'tis''atun', 'sembilan', 'nine', cat_numbers, 2, 'noun'),
    ('w-031', 'عَشَرَةٌ', 'asyaratun', 'sepuluh', 'ten', cat_numbers, 1, 'noun');

  -- Lesson 6: Warna
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-032', 'أَحْمَر', 'ahmar', 'merah', 'red', cat_colors, 1, 'adjective', 'الْوَرْدَةُ حَمْرَاءُ جَمِيلَةٌ', 'Bunga mawar merah itu cantik.'),
    ('w-033', 'أَزْرَق', 'azraq', 'biru', 'blue', cat_colors, 1, 'adjective', 'السَّمَاءُ زَرْقَاءُ الْيَوْمَ', 'Langit biru hari ini.'),
    ('w-034', 'أَخْضَر', 'akhdhar', 'hijau', 'green', cat_colors, 1, 'adjective', 'الْعُشْبُ أَخْضَرُ فِي الرَّبِيعِ', 'Rumput hijau di musim semi.'),
    ('w-035', 'أَصْفَر', 'ashfar', 'kuning', 'yellow', cat_colors, 1, 'adjective', 'الْمَوْزَةُ صَفْرَاءُ لَذِيذَةٌ', 'Pisang kuning itu enak.'),
    ('w-036', 'أَبْيَض', 'abyadh', 'putih', 'white', cat_colors, 1, 'adjective', 'الثَّلْجُ أَبْيَضُ نَظِيفٌ', 'Salju putih bersih.'),
    ('w-037', 'أَسْوَد', 'aswad', 'hitam', 'black', cat_colors, 1, 'adjective', 'اللَّيْلُ أَسْوَدُ جَمِيلٌ', 'Malam hitam itu indah.'),
    ('w-038', 'بُنِّي', 'bunniy', 'coklat', 'brown', cat_colors, 1, 'adjective', 'لَوْنُ الشَّاي بُنِّيٌّ جَمِيلٌ', 'Warna teh coklat itu cantik.'),
    ('w-039', 'بُرْتُقَالِي', 'burtuqaliy', 'oranye', 'orange', cat_colors, 2, 'adjective', 'الْبُرْتُقَالَةُ بُرْتُقَالِيَّةٌ حُلْوَةٌ', 'Jeruk itu oranye dan manis.');

  -- Lesson 7: Di Sekolah
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-040', 'مَدْرَسَة', 'madrasah', 'sekolah', 'school', cat_school, 1, 'noun', 'أَذْهَبُ إِلَى الْمَدْرَسَةِ كُلَّ يَوْمٍ', 'Aku pergi ke sekolah setiap hari.'),
    ('w-041', 'فَصْل', 'fashl', 'kelas', 'classroom', cat_school, 1, 'noun', 'فَصْلُنَا نَظِيفٌ وَجَمِيلٌ', 'Kelas kami bersih dan indah.'),
    ('w-042', 'كِتَاب', 'kitab', 'buku', 'book', cat_school, 1, 'noun', 'هَذَا كِتَابِي الْجَدِيدُ', 'Ini buku baruku.'),
    ('w-043', 'قَلَم', 'qalam', 'pulpen / pena', 'pen', cat_school, 1, 'noun', 'قَلَمِي أَزْرَقُ جَمِيلٌ', 'Penaku biru dan indah.'),
    ('w-044', 'مُعَلِّم', 'mualim', 'guru (lk)', 'teacher (m)', cat_school, 1, 'noun', 'الْمُعَلِّمُ كَرِيمٌ وَصَبُورٌ', 'Gurunya dermawan dan sabar.'),
    ('w-045', 'مُعَلِّمَة', 'mualimah', 'guru (pr)', 'teacher (f)', cat_school, 1, 'noun', 'الْمُعَلِّمَةُ لَطِيفَةٌ جِدًّا', 'Gurunya sangat ramah.'),
    ('w-046', 'تِلْمِيذ', 'tilmiidz', 'murid (lk)', 'student (m)', cat_school, 2, 'noun', 'التِّلْمِيذُ مُجْتَهِدٌ فِي الدَّرْسِ', 'Murid itu rajin dalam pelajaran.'),
    ('w-047', 'دَرْس', 'dars', 'pelajaran', 'lesson', cat_school, 1, 'noun', 'الدَّرْسُ الْيَوْمَ سَهْلٌ وَمُمْتِعٌ', 'Pelajaran hari ini mudah dan menyenangkan.'),
    ('w-048', 'مَكْتَب', 'maktab', 'meja', 'desk', cat_school, 1, 'noun', 'الْكِتَابُ عَلَى الْمَكْتَبِ', 'Buku itu di atas meja.'),
    ('w-049', 'كُرْسِيٌّ', 'kursiyyun', 'kursi', 'chair', cat_school, 1, 'noun', 'أَجْلِسُ عَلَى الْكُرْسِيِّ', 'Aku duduk di kursi.');

  -- Lesson 8: Makanan & Minuman
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-050', 'طَعَام', 'thaam', 'makanan', 'food', cat_food, 1, 'noun', 'الطَّعَامُ لَذِيذٌ جِدًّا', 'Makanannya sangat enak.'),
    ('w-051', 'مَاء', 'maa', 'air', 'water', cat_food, 1, 'noun', 'أَشْرَبُ الْمَاءَ كُلَّ يَوْمٍ', 'Aku minum air setiap hari.'),
    ('w-052', 'خُبْز', 'khubz', 'roti', 'bread', cat_food, 1, 'noun', 'آكُلُ الْخُبْزَ فِي الْإِفْطَارِ', 'Aku makan roti saat sarapan.'),
    ('w-053', 'لَبَن', 'laban', 'susu', 'milk', cat_food, 1, 'noun', 'اللَّبَنُ صَحِّيٌّ لِلْجِسْمِ', 'Susu itu sehat untuk tubuh.'),
    ('w-054', 'تُفَّاح', 'tuffah', 'apel', 'apple', cat_food, 1, 'noun', 'التُّفَّاحُ أَحْمَرُ وَحُلْوٌ', 'Apel itu merah dan manis.'),
    ('w-055', 'مَوْز', 'mauz', 'pisang', 'banana', cat_food, 1, 'noun', 'الْمَوْزُ أَصْفَرُ وَمُفِيدٌ', 'Pisang itu kuning dan bermanfaat.'),
    ('w-056', 'لَحْم', 'lahm', 'daging', 'meat', cat_food, 1, 'noun', 'اللَّحْمُ طَازَجٌ وَلَذِيذٌ', 'Dagingnya segar dan enak.'),
    ('w-057', 'بَيْض', 'baydh', 'telur', 'egg', cat_food, 1, 'noun', 'الْبَيْضُ مُفِيدٌ لِلصِّحَّةِ', 'Telur itu baik untuk kesehatan.'),
    ('w-058', 'أُرْز', 'urz', 'nasi', 'rice', cat_food, 1, 'noun', 'الْأُرْزُ طَعَامُنَا الْيَوْمِيُّ', 'Nasi adalah makanan sehari-hari kami.'),
    ('w-059', 'شَاي', 'syay', 'teh', 'tea', cat_food, 1, 'noun', 'الشَّايُ حَارٌّ وَلَذِيذٌ', 'Tehnya panas dan enak.');

  -- Lesson 9: Rasa & Perasaan
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-060', 'سَعِيد', 'saiid', 'senang / bahagia', 'happy', cat_emotions, 1, 'adjective', 'أَنَا سَعِيدٌ بِلِقَائِكَ', 'Aku senang bertemu denganmu.'),
    ('w-061', 'حَزِين', 'haziin', 'sedih', 'sad', cat_emotions, 1, 'adjective', 'لَا تَكُنْ حَزِينًا، كُلُّ شَيْءٍ يَمُرُّ', 'Jangan sedih, semua akan berlalu.'),
    ('w-062', 'جَائِع', 'jaai', 'lapar', 'hungry', cat_emotions, 1, 'adjective', 'أَنَا جَائِعٌ، أُرِيدُ الطَّعَامَ', 'Aku lapar, aku mau makanan.'),
    ('w-063', 'عَطْشَان', 'athsyaan', 'haus', 'thirsty', cat_emotions, 1, 'adjective', 'أَنَا عَطْشَانُ، أُرِيدُ الْمَاءَ', 'Aku haus, aku mau air.'),
    ('w-064', 'تَعْبَان', 'tabaan', 'lelah / capek', 'tired', cat_emotions, 1, 'adjective', 'أَنَا تَعْبَانٌ بَعْدَ الْيَوْمِ الطَّوِيلِ', 'Aku lelah setelah hari yang panjang.'),
    ('w-065', 'مَرِيض', 'mariidh', 'sakit', 'sick', cat_emotions, 1, 'adjective', 'هُوَ مَرِيضٌ، لَا يَسْتَطِيعُ الْمَجِيءَ', 'Dia sakit, tidak bisa datang.'),
    ('w-066', 'جَمِيل', 'jamiil', 'cantik / indah', 'beautiful', cat_emotions, 1, 'adjective', 'هَذَا الْيَوْمُ جَمِيلٌ جِدًّا', 'Hari ini sangat indah.'),
    ('w-067', 'كَبِير', 'kabiir', 'besar', 'big', cat_emotions, 1, 'adjective', 'الْبَيْتُ كَبِيرٌ وَجَمِيلٌ', 'Rumah itu besar dan indah.');

  -- Lesson 10: Hari & Waktu
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-068', 'يَوْم', 'yaum', 'hari', 'day', cat_time, 1, 'noun', 'الْيَوْمُ جَمِيلٌ وَمُشْمِسٌ', 'Hari ini indah dan cerah.'),
    ('w-069', 'لَيْل', 'layl', 'malam', 'night', cat_time, 1, 'noun', 'اللَّيْلُ هَادِئٌ جَمِيلٌ', 'Malam itu tenang dan indah.'),
    ('w-070', 'صَبَاح', 'shabah', 'pagi', 'morning', cat_time, 1, 'noun', 'صَبَاحُ الْخَيْرِ يَا أَبِي', 'Selamat pagi, Ayah.'),
    ('w-071', 'مَسَاء', 'masaa', 'sore / malam', 'evening', cat_time, 1, 'noun', 'مَسَاءُ الْخَيْرِ جَمِيعًا', 'Selamat malam semuanya.'),
    ('w-072', 'الْيَوْم', 'al-yaum', 'hari ini', 'today', cat_time, 1, 'noun', 'الْيَوْمَ يَوْمُ الْجُمُعَةِ', 'Hari ini hari Jumat.'),
    ('w-073', 'غَدًا', 'ghadan', 'besok', 'tomorrow', cat_time, 1, 'noun', 'غَدًا يَوْمُ الِامْتِحَانِ', 'Besok hari ujian.'),
    ('w-074', 'أَمْس', 'ams', 'kemarin', 'yesterday', cat_time, 1, 'noun', 'أَمْسُ كَانَ يَوْمًا جَمِيلًا', 'Kemarin adalah hari yang indah.'),
    ('w-075', 'سَاعَة', 'saaah', 'jam', 'clock/hour', cat_time, 1, 'noun', 'السَّاعَةُ الْآنَ الثَّالِثَةُ', 'Sekarang jam tiga.'),
    ('w-076', 'أُسْبُوع', 'usbuu', 'minggu', 'week', cat_time, 2, 'noun', 'فِي الْأُسْبُوعِ سَبْعَةُ أَيَّامٍ', 'Dalam seminggu ada tujuh hari.'),
    ('w-077', 'شَهْر', 'syahr', 'bulan', 'month', cat_time, 2, 'noun', 'شَهْرُ رَمَضَانَ شَهْرٌ مُبَارَكٌ', 'Bulan Ramadhan adalah bulan yang diberkahi.');

  -- Lesson 11: Aktivitas Harian
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-078', 'أَكَلَ', 'akala', 'makan', 'eat', cat_activities, 1, 'verb', 'أَكَلْتُ الْخُبْزَ فِي الصَّبَاحِ', 'Aku makan roti di pagi hari.'),
    ('w-079', 'شَرِبَ', 'syariba', 'minum', 'drink', cat_activities, 1, 'verb', 'شَرِبْتُ الْمَاءَ بَعْدَ الرِّيَاضَةِ', 'Aku minum air setelah olahraga.'),
    ('w-080', 'نَامَ', 'naama', 'tidur', 'sleep', cat_activities, 1, 'verb', 'نِمْتُ مُبَكِّرًا الْبَارِحَةَ', 'Aku tidur awal tadi malam.'),
    ('w-081', 'قَرَأَ', 'qaraa', 'membaca', 'read', cat_activities, 1, 'verb', 'أَقْرَأُ الْكِتَابَ كُلَّ يَوْمٍ', 'Aku membaca buku setiap hari.'),
    ('w-082', 'كَتَبَ', 'kataba', 'menulis', 'write', cat_activities, 1, 'verb', 'كَتَبْتُ الدَّرْسَ فِي الدَّفْتَرِ', 'Aku menulis pelajaran di buku tulis.'),
    ('w-083', 'ذَهَبَ', 'dzahaba', 'pergi', 'go', cat_activities, 1, 'verb', 'ذَهَبْتُ إِلَى الْمَدْرَسَةِ صَبَاحًا', 'Aku pergi ke sekolah di pagi hari.'),
    ('w-084', 'جَلَسَ', 'jalasa', 'duduk', 'sit', cat_activities, 1, 'verb', 'جَلَسْنَا فِي الْفَصْلِ نَنْتَظِرُ الدَّرْسَ', 'Kami duduk di kelas menunggu pelajaran.'),
    ('w-085', 'وَقَفَ', 'waqafa', 'berdiri', 'stand', cat_activities, 1, 'verb', 'وَقَفَ الطَّلَّابُ احْتِرَامًا لِلْمُعَلِّمِ', 'Murid-murid berdiri menghormati guru.'),
    ('w-086', 'لَعِبَ', 'laiba', 'bermain', 'play', cat_activities, 1, 'verb', 'يَلْعَبُ الْأَطْفَالُ فِي الْحَدِيقَةِ', 'Anak-anak bermain di taman.'),
    ('w-087', 'رَكَضَ', 'rakadha', 'berlari', 'run', cat_activities, 1, 'verb', 'رَكَضَ الْوَلَدُ سَرِيعًا إِلَى الْمَدْرَسَةِ', 'Anak laki-laki itu berlari cepat ke sekolah.');

  -- Lesson 12: Benda di Rumah
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-088', 'بَاب', 'bab', 'pintu', 'door', cat_objects, 1, 'noun', 'افْتَحِ الْبَابَ مِنْ فَضْلِكَ', 'Tolong buka pintunya.'),
    ('w-089', 'نَافِذَة', 'nafidzah', 'jendela', 'window', cat_objects, 2, 'noun', 'النَّافِذَةُ مَفْتُوحَةٌ لِلْهَوَاءِ', 'Jendelanya terbuka untuk udara.'),
    ('w-090', 'سَرِير', 'sariir', 'tempat tidur', 'bed', cat_objects, 2, 'noun', 'سَرِيرِي مُرِيحٌ وَنَظِيفٌ', 'Tempat tidurku nyaman dan bersih.'),
    ('w-091', 'مِفْتَاح', 'miftah', 'kunci', 'key', cat_objects, 2, 'noun', 'أَيْنَ مِفْتَاحُ السَّيَّارَةِ', 'Di mana kunci mobilnya?'),
    ('w-092', 'هَاتِف', 'hatif', 'telepon / HP', 'phone', cat_objects, 1, 'noun', 'هَاتِفِي جَدِيدٌ وَسَرِيعٌ', 'HP-ku baru dan cepat.'),
    ('w-093', 'مَصْبَاح', 'mishbah', 'lampu', 'lamp', cat_objects, 2, 'noun', 'الْمَصْبَاحُ مُضِيءٌ جِدًّا', 'Lampunya sangat terang.'),
    ('w-094', 'ثَوْب', 'tsaub', 'baju', 'clothes', cat_objects, 2, 'noun', 'الثَّوْبُ جَدِيدٌ وَنَظِيفٌ', 'Bajunya baru dan bersih.'),
    ('w-095', 'بَيْت', 'bayt', 'rumah', 'house', cat_objects, 1, 'noun', 'بَيْتِي قَرِيبٌ مِنَ الْمَسْجِدِ', 'Rumahku dekat dengan masjid.'),
    ('w-096', 'مَطْبَخ', 'mathbakh', 'dapur', 'kitchen', cat_objects, 2, 'noun', 'الْمَطْبَخُ نَظِيفٌ وَمُرَتَّبٌ', 'Dapur bersih dan rapi.'),
    ('w-097', 'مِرْآة', 'mirah', 'cermin', 'mirror', cat_objects, 2, 'noun', 'الْمِرْآةُ عَلَى الْجِدَارِ', 'Cermin itu di dinding.');

  -- Lesson 13: Alam Sekitar
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-098', 'سَمَاء', 'samaa', 'langit', 'sky', cat_nature, 1, 'noun', 'السَّمَاءُ جَمِيلَةٌ الْيَوْمَ', 'Langit indah hari ini.'),
    ('w-099', 'أَرْض', 'ardh', 'bumi / tanah', 'earth', cat_nature, 1, 'noun', 'الْأَرْضُ خَضْرَاءُ وَاسِعَةٌ', 'Bumi itu hijau dan luas.'),
    ('w-100', 'بَحْر', 'bahr', 'laut', 'sea', cat_nature, 1, 'noun', 'الْبَحْرُ أَزْرَقُ وَجَمِيلٌ', 'Laut itu biru dan indah.'),
    ('w-101', 'جَبَل', 'jabal', 'gunung', 'mountain', cat_nature, 1, 'noun', 'الْجَبَلُ عَالٍ وَشَاهِقٌ', 'Gunung itu tinggi menjulang.'),
    ('w-102', 'نَهْر', 'nahr', 'sungai', 'river', cat_nature, 2, 'noun', 'النَّهْرُ يَجْرِي بَيْنَ الْجِبَالِ', 'Sungai mengalir di antara gunung-gunung.'),
    ('w-103', 'شَمْس', 'syams', 'matahari', 'sun', cat_nature, 1, 'noun', 'الشَّمْسُ مُشْرِقَةٌ فِي السَّمَاءِ', 'Matahari bersinar di langit.'),
    ('w-104', 'قَمَر', 'qamar', 'bulan', 'moon', cat_nature, 1, 'noun', 'الْقَمَرُ مُضِيءٌ فِي اللَّيْلِ', 'Bulan bersinar di malam hari.'),
    ('w-105', 'نَجْمَة', 'najmah', 'bintang', 'star', cat_nature, 1, 'noun', 'النُّجُومُ تَتَلَأْلَأُ فِي السَّمَاءِ', 'Bintang-bintang berkelap-kelip di langit.');

  -- Lesson 14: Ibadah
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-106', 'مَسْجِد', 'masjid', 'masjid', 'mosque', cat_worship, 1, 'noun', 'أَذْهَبُ إِلَى الْمَسْجِدِ لِلصَّلَاةِ', 'Aku pergi ke masjid untuk sholat.'),
    ('w-107', 'صَلَاة', 'shalah', 'sholat', 'prayer', cat_worship, 1, 'noun', 'الصَّلَاةُ عَمُودُ الدِّينِ', 'Sholat adalah tiang agama.'),
    ('w-108', 'صَوْم', 'shaum', 'puasa', 'fasting', cat_worship, 1, 'noun', 'نَصُومُ فِي شَهْرِ رَمَضَانَ', 'Kita berpuasa di bulan Ramadhan.'),
    ('w-109', 'دُعَاء', 'duaa', 'doa', 'supplication', cat_worship, 1, 'noun', 'الدُّعَاءُ يَرْفَعُ الْبَلَاءَ', 'Doa mengangkat musibah.'),
    ('w-110', 'قُرْآن', 'quran', 'Al-Quran', 'Quran', cat_worship, 1, 'noun', 'أَقْرَأُ الْقُرْآنَ كُلَّ يَوْمٍ', 'Aku membaca Al-Quran setiap hari.'),
    ('w-111', 'زَكَاة', 'zakah', 'zakat', 'zakat', cat_worship, 2, 'noun', 'الزَّكَاةُ تُطَهِّرُ الْمَالَ', 'Zakat membersihkan harta.'),
    ('w-112', 'حَجّ', 'hajj', 'haji', 'pilgrimage', cat_worship, 2, 'noun', 'الْحَجُّ إِلَى مَكَّةَ فَرِيضَةٌ', 'Haji ke Mekkah adalah kewajiban.'),
    ('w-113', 'بِسْمِ اللَّهِ', 'bismillah', 'dengan nama Allah', 'in the name of Allah', cat_worship, 1, 'expression', 'نَبْدَأُ بِسْمِ اللَّهِ فِي كُلِّ عَمَلٍ', 'Kita mulai dengan bismillah dalam setiap pekerjaan.');

  -- Lesson 15: Tubuhku
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-114', 'رَأْس', 'ras', 'kepala', 'head', cat_body, 1, 'noun', 'رَأْسِي يُؤْلِمُنِي الْيَوْمَ', 'Kepalaku sakit hari ini.'),
    ('w-115', 'عَيْن', 'ain', 'mata', 'eye', cat_body, 1, 'noun', 'لِي عَيْنَانِ أَرَى بِهِمَا', 'Aku punya dua mata untuk melihat.'),
    ('w-116', 'فَم', 'fam', 'mulut', 'mouth', cat_body, 1, 'noun', 'الْفَمُ يَتَكَلَّمُ وَيَأْكُلُ', 'Mulut berbicara dan makan.'),
    ('w-117', 'أَنْف', 'anf', 'hidung', 'nose', cat_body, 1, 'noun', 'الْأَنْفُ يَشُمُّ الرَّوَائِحَ', 'Hidung mencium bau-bauan.'),
    ('w-118', 'أُذُن', 'udzun', 'telinga', 'ear', cat_body, 1, 'noun', 'لِي أُذُنَانِ أَسْمَعُ بِهِمَا', 'Aku punya dua telinga untuk mendengar.'),
    ('w-119', 'يَد', 'yad', 'tangan', 'hand', cat_body, 1, 'noun', 'يَدَايَ تَكْتُبَانِ الدَّرْسَ', 'Tanganku menulis pelajaran.'),
    ('w-120', 'رِجْل', 'rijl', 'kaki', 'leg', cat_body, 1, 'noun', 'رِجْلَايَ تَمْشِيَانِ إِلَى الْمَدْرَسَةِ', 'Kakiku berjalan ke sekolah.'),
    ('w-121', 'قَلْب', 'qalb', 'hati', 'heart', cat_body, 1, 'noun', 'قَلْبِي يُحِبُّ الْخَيْرَ لِلنَّاسِ', 'Hatiku menyukai kebaikan untuk orang lain.'),
    ('w-122', 'وَجْه', 'wajh', 'wajah', 'face', cat_body, 1, 'noun', 'وَجْهُهَا جَمِيلٌ وَمُشْرِقٌ', 'Wajahnya cantik dan berseri.'),
    ('w-123', 'شَعْر', 'syar', 'rambut', 'hair', cat_body, 1, 'noun', 'شَعْرُهَا طَوِيلٌ وَأَسْوَدُ', 'Rambutnya panjang dan hitam.');

  -- Lesson 16: Kata Tanya
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-124', 'مَا', 'ma', 'apa', 'what', cat_question, 1, 'expression', 'مَا اسْمُكَ يَا صَدِيقِي', 'Apa namamu, temanku?'),
    ('w-125', 'مَنْ', 'man', 'siapa', 'who', cat_question, 1, 'expression', 'مَنْ هَذَا الطَّالِبُ الْمُجْتَهِدُ', 'Siapa murid yang rajin ini?'),
    ('w-126', 'أَيْنَ', 'aina', 'di mana', 'where', cat_question, 1, 'expression', 'أَيْنَ بَيْتُكَ', 'Di mana rumahmu?'),
    ('w-127', 'كَمْ', 'kam', 'berapa', 'how many', cat_question, 1, 'expression', 'كَمْ عُمْرَكَ', 'Berapa usiamu?'),
    ('w-128', 'مَتَى', 'mata', 'kapan', 'when', cat_question, 1, 'expression', 'مَتَى يَبْدَأُ الدَّرْسُ', 'Kapan pelajaran dimulai?'),
    ('w-129', 'لِمَاذَا', 'limadza', 'kenapa', 'why', cat_question, 1, 'expression', 'لِمَاذَا تَبْكِي يَا صَغِيرُ', 'Kenapa menangis, nak?'),
    ('w-130', 'كَيْفَ', 'kaifa', 'bagaimana', 'how', cat_question, 1, 'expression', 'كَيْفَ حَالُ أُمِّكَ الْيَوْمَ', 'Bagaimana keadaan ibumu hari ini?'),
    ('w-131', 'هَلْ', 'hal', 'apakah', 'is/are (yes/no)', cat_question, 1, 'expression', 'هَلْ أَنْتَ فَاهِمٌ الدَّرْسَ', 'Apakah kamu paham pelajarannya?');

  -- Lesson 17: Arah & Tempat
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-132', 'يَمِين', 'yamin', 'kanan', 'right', cat_directions, 1, 'noun', 'الْمَدْرَسَةُ عَلَى الْيَمِينِ', 'Sekolah di sebelah kanan.'),
    ('w-133', 'يَسَار', 'yasar', 'kiri', 'left', cat_directions, 1, 'noun', 'الْمَسْجِدُ عَلَى الْيَسَارِ', 'Masjid di sebelah kiri.'),
    ('w-134', 'فَوْق', 'fauq', 'atas / di atas', 'above', cat_directions, 1, 'noun', 'الطَّائِرُ فَوْقَ الشَّجَرَةِ', 'Burung itu di atas pohon.'),
    ('w-135', 'تَحْت', 'taht', 'bawah / di bawah', 'below', cat_directions, 1, 'noun', 'الْقِطُّ تَحْتَ الطَّاوِلَةِ', 'Kucing itu di bawah meja.'),
    ('w-136', 'أَمَام', 'amam', 'depan / di depan', 'in front', cat_directions, 1, 'noun', 'الْمُعَلِّمُ أَمَامَ الْفَصْلِ', 'Guru di depan kelas.'),
    ('w-137', 'وَرَاء', 'waraa', 'belakang / di belakang', 'behind', cat_directions, 1, 'noun', 'الْحَدِيقَةُ وَرَاءَ الْبَيْتِ', 'Taman di belakang rumah.'),
    ('w-138', 'دَاخِل', 'dakhil', 'dalam / di dalam', 'inside', cat_directions, 1, 'noun', 'الطُّلَّابُ دَاخِلَ الْفَصْلِ', 'Murid-murid di dalam kelas.'),
    ('w-139', 'خَارِج', 'kharj', 'luar / di luar', 'outside', cat_directions, 1, 'noun', 'الْأَطْفَالُ يَلْعَبُونَ خَارِجَ الْبَيْتِ', 'Anak-anak bermain di luar rumah.');

  -- Lesson 18: Bepergian
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-140', 'سَيَّارَة', 'sayyarah', 'mobil', 'car', cat_travel, 1, 'noun', 'السَّيَّارَةُ سَرِيعَةٌ وَجَدِيدَةٌ', 'Mobil itu cepat dan baru.'),
    ('w-141', 'طَائِرَة', 'thaairah', 'pesawat', 'airplane', cat_travel, 2, 'noun', 'الطَّائِرَةُ تَطِيرُ فِي السَّمَاءِ', 'Pesawat terbang di langit.'),
    ('w-142', 'مَطَار', 'mathar', 'bandara', 'airport', cat_travel, 2, 'noun', 'نَذْهَبُ إِلَى الْمَطَارِ غَدًا', 'Kami pergi ke bandara besok.'),
    ('w-143', 'فُنْدُق', 'funduq', 'hotel', 'hotel', cat_travel, 2, 'noun', 'الْفُنْدُقُ جَمِيلٌ وَمُرِيحٌ', 'Hotel itu indah dan nyaman.'),
    ('w-144', 'طَرِيق', 'thariq', 'jalan', 'road', cat_travel, 1, 'noun', 'هَذَا الطَّرِيقُ طَوِيلٌ جِدًّا', 'Jalan ini sangat panjang.'),
    ('w-145', 'مَدِينَة', 'madinah', 'kota', 'city', cat_travel, 1, 'noun', 'الْمَدِينَةُ مَزْدَحِمَةٌ بِالنَّاسِ', 'Kota itu ramai dengan orang-orang.'),
    ('w-146', 'سُوق', 'suq', 'pasar', 'market', cat_travel, 1, 'noun', 'ذَهَبْتُ إِلَى السُّوقِ لِشِرَاءِ الْفَوَاكِهِ', 'Aku pergi ke pasar membeli buah-buahan.'),
    ('w-147', 'مُسْتَشْفَى', 'mustasyfa', 'rumah sakit', 'hospital', cat_travel, 2, 'noun', 'الْمُسْتَشْفَى قَرِيبٌ مِنْ بَيْتِنَا', 'Rumah sakit itu dekat dari rumah kami.');

  -- Lesson 19: Kata Kerja Penting
  INSERT INTO vocabulary_words (id, arabic_text, transliteration, meaning_id, meaning_en, category_id, difficulty, word_type, example_sentence, example_meaning) VALUES
    ('w-148', 'فَتَحَ', 'fataha', 'membuka', 'open', cat_verbs, 2, 'verb', 'فَتَحْتُ الْبَابَ لِلدُّخُولِ', 'Aku membuka pintu untuk masuk.'),
    ('w-149', 'أَغْلَقَ', 'aghlaqa', 'menutup', 'close', cat_verbs, 2, 'verb', 'أَغْلَقْتُ النَّافِذَةَ لِأَنَّ الْجَوَّ بَارِدٌ', 'Aku menutup jendela karena udaranya dingin.'),
    ('w-150', 'دَخَلَ', 'dakhala', 'masuk', 'enter', cat_verbs, 1, 'verb', 'دَخَلَ الطُّلَّابُ الْفَصْلَ', 'Murid-murid masuk ke kelas.'),
    ('w-151', 'خَرَجَ', 'kharaja', 'keluar', 'exit', cat_verbs, 1, 'verb', 'خَرَجْنَا مِنَ الْبَيْتِ صَبَاحًا', 'Kami keluar dari rumah di pagi hari.'),
    ('w-152', 'أَخَذَ', 'akhadza', 'mengambil', 'take', cat_verbs, 2, 'verb', 'أَخَذْتُ الْكِتَابَ مِنَ الْمَكْتَبَةِ', 'Aku mengambil buku dari perpustakaan.'),
    ('w-153', 'أَعْطَى', 'atha', 'memberi', 'give', cat_verbs, 2, 'verb', 'أَعْطَانِي الْمُعَلِّمُ الْجَائِزَةَ', 'Guru memberiku hadiah.'),
    ('w-154', 'سَمِعَ', 'samia', 'mendengar', 'hear', cat_verbs, 1, 'verb', 'سَمِعْتُ الْأَذَانَ مِنَ الْمَسْجِدِ', 'Aku mendengar adzan dari masjid.'),
    ('w-155', 'رَأَى', 'raa', 'melihat', 'see', cat_verbs, 1, 'verb', 'رَأَيْتُ الْقَمَرَ فِي السَّمَاءِ', 'Aku melihat bulan di langit.'),
    ('w-156', 'تَكَلَّمَ', 'takallama', 'berbicara', 'speak', cat_verbs, 2, 'verb', 'تَكَلَّمَ الْوَلَدُ بِاللُّغَةِ الْعَرَبِيَّةِ', 'Anak itu berbicara dalam bahasa Arab.'),
    ('w-157', 'فَهِمَ', 'fahima', 'memahami', 'understand', cat_verbs, 1, 'verb', 'فَهِمْتُ الدَّرْسَ الْيَوْمَ جَيِّدًا', 'Aku paham pelajaran hari ini dengan baik.');

  -- ============================================================
  -- Lesson-Word Mappings
  -- ============================================================
  INSERT INTO lesson_words (lesson_id, word_id, order_index) VALUES
    -- Lesson 1
    (l01, 'w-001', 1), (l01, 'w-002', 2), (l01, 'w-003', 3), (l01, 'w-004', 4),
    (l01, 'w-005', 5), (l01, 'w-006', 6), (l01, 'w-007', 7),
    -- Lesson 2
    (l02, 'w-008', 1), (l02, 'w-009', 2), (l02, 'w-010', 3), (l02, 'w-011', 4),
    (l02, 'w-012', 5), (l02, 'w-013', 6), (l02, 'w-014', 7),
    -- Lesson 3
    (l03, 'w-015', 1), (l03, 'w-016', 2), (l03, 'w-017', 3), (l03, 'w-018', 4),
    (l03, 'w-019', 5), (l03, 'w-020', 6), (l03, 'w-021', 7),
    -- Lesson 4
    (l04, 'w-022', 1), (l04, 'w-023', 2), (l04, 'w-024', 3),
    (l04, 'w-025', 4), (l04, 'w-026', 5),
    -- Lesson 5
    (l05, 'w-027', 1), (l05, 'w-028', 2), (l05, 'w-029', 3),
    (l05, 'w-030', 4), (l05, 'w-031', 5),
    -- Lesson 6
    (l06, 'w-032', 1), (l06, 'w-033', 2), (l06, 'w-034', 3),
    (l06, 'w-035', 4), (l06, 'w-036', 5), (l06, 'w-037', 6),
    (l06, 'w-038', 7), (l06, 'w-039', 8),
    -- Lesson 7
    (l07, 'w-040', 1), (l07, 'w-041', 2), (l07, 'w-042', 3),
    (l07, 'w-043', 4), (l07, 'w-044', 5), (l07, 'w-045', 6),
    (l07, 'w-046', 7), (l07, 'w-047', 8), (l07, 'w-048', 9), (l07, 'w-049', 10),
    -- Lesson 8
    (l08, 'w-050', 1), (l08, 'w-051', 2), (l08, 'w-052', 3), (l08, 'w-053', 4),
    (l08, 'w-054', 5), (l08, 'w-055', 6), (l08, 'w-056', 7), (l08, 'w-057', 8),
    (l08, 'w-058', 9), (l08, 'w-059', 10),
    -- Lesson 9
    (l09, 'w-060', 1), (l09, 'w-061', 2), (l09, 'w-062', 3), (l09, 'w-063', 4),
    (l09, 'w-064', 5), (l09, 'w-065', 6), (l09, 'w-066', 7), (l09, 'w-067', 8),
    -- Lesson 10
    (l10, 'w-068', 1), (l10, 'w-069', 2), (l10, 'w-070', 3), (l10, 'w-071', 4),
    (l10, 'w-072', 5), (l10, 'w-073', 6), (l10, 'w-074', 7), (l10, 'w-075', 8),
    (l10, 'w-076', 9), (l10, 'w-077', 10),
    -- Lesson 11
    (l11, 'w-078', 1), (l11, 'w-079', 2), (l11, 'w-080', 3), (l11, 'w-081', 4),
    (l11, 'w-082', 5), (l11, 'w-083', 6), (l11, 'w-084', 7), (l11, 'w-085', 8),
    (l11, 'w-086', 9), (l11, 'w-087', 10),
    -- Lesson 12
    (l12, 'w-088', 1), (l12, 'w-089', 2), (l12, 'w-090', 3), (l12, 'w-091', 4),
    (l12, 'w-092', 5), (l12, 'w-093', 6), (l12, 'w-094', 7), (l12, 'w-095', 8),
    (l12, 'w-096', 9), (l12, 'w-097', 10),
    -- Lesson 13
    (l13, 'w-098', 1), (l13, 'w-099', 2), (l13, 'w-100', 3), (l13, 'w-101', 4),
    (l13, 'w-102', 5), (l13, 'w-103', 6), (l13, 'w-104', 7), (l13, 'w-105', 8),
    -- Lesson 14
    (l14, 'w-106', 1), (l14, 'w-107', 2), (l14, 'w-108', 3), (l14, 'w-109', 4),
    (l14, 'w-110', 5), (l14, 'w-111', 6), (l14, 'w-112', 7), (l14, 'w-113', 8),
    -- Lesson 15
    (l15, 'w-114', 1), (l15, 'w-115', 2), (l15, 'w-116', 3), (l15, 'w-117', 4),
    (l15, 'w-118', 5), (l15, 'w-119', 6), (l15, 'w-120', 7), (l15, 'w-121', 8),
    (l15, 'w-122', 9), (l15, 'w-123', 10),
    -- Lesson 16
    (l16, 'w-124', 1), (l16, 'w-125', 2), (l16, 'w-126', 3), (l16, 'w-127', 4),
    (l16, 'w-128', 5), (l16, 'w-129', 6), (l16, 'w-130', 7), (l16, 'w-131', 8),
    -- Lesson 17
    (l17, 'w-132', 1), (l17, 'w-133', 2), (l17, 'w-134', 3), (l17, 'w-135', 4),
    (l17, 'w-136', 5), (l17, 'w-137', 6), (l17, 'w-138', 7), (l17, 'w-139', 8),
    -- Lesson 18
    (l18, 'w-140', 1), (l18, 'w-141', 2), (l18, 'w-142', 3), (l18, 'w-143', 4),
    (l18, 'w-144', 5), (l18, 'w-145', 6), (l18, 'w-146', 7), (l18, 'w-147', 8),
    -- Lesson 19
    (l19, 'w-148', 1), (l19, 'w-149', 2), (l19, 'w-150', 3), (l19, 'w-151', 4),
    (l19, 'w-152', 5), (l19, 'w-153', 6), (l19, 'w-154', 7), (l19, 'w-155', 8),
    (l19, 'w-156', 9), (l19, 'w-157', 10);

END $$;
