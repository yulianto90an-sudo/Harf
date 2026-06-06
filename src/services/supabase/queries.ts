import { createBrowserClient } from '@supabase/ssr';
import type { Database, Json } from '@/types/database';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

function getClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return supabaseClient;
}

export function isSupabaseAvailable(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

type AsyncResult<T> = { data: T; error: null } | { data: null; error: string };

function ok<T>(data: T): AsyncResult<T> {
  return { data, error: null };
}

function fail(error: string): AsyncResult<never> {
  return { data: null, error };
}

// Profile
export async function getProfile(userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('profiles')
    .select('*, rank:rank_id(*)')
    .eq('user_id', userId)
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const client = getClient();
  const { data, error } = await client
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Vocabulary Words
export async function getDueWords(userId: string, limit = 15) {
  const client = getClient();
  const { data, error } = await client.rpc('get_due_words', {
    p_user_id: userId,
    p_limit: limit,
  });
  if (error) return fail(error.message);
  return ok((data ?? []) as unknown as Array<{
    word_id: string;
    arabic_text: string;
    transliteration: string;
    meaning_id: string;
    audio_url: string | null;
    confidence: number;
    is_new: boolean;
  }>);
}

export async function getVocabularyByCategory(categoryId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('vocabulary_words')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('difficulty');
  if (error) return fail(error.message);
  return ok(data);
}

export async function getAllCategories() {
  const client = getClient();
  const { data, error } = await client
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order_index');
  if (error) return fail(error.message);
  return ok(data);
}

// Word Progress
export async function upsertWordProgress(
  userId: string,
  wordId: string,
  confidence: number,
  action: 'swipe_right' | 'swipe_left' | 'reveal',
) {
  const client = getClient();
  const { data: existing } = await client
    .from('user_word_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('word_id', wordId)
    .single();

  if (existing) {
    const { data, error } = await client
      .from('user_word_progress')
      .update({
        confidence,
        swipe_right_count: action === 'swipe_right' ? (existing.swipe_right_count ?? 0) + 1 : existing.swipe_right_count,
        swipe_left_count: action === 'swipe_left' ? (existing.swipe_left_count ?? 0) + 1 : existing.swipe_left_count,
        last_reviewed_at: new Date().toISOString(),
        is_learned: confidence >= 2,
        is_mastered: confidence >= 4,
      })
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .select()
      .single();
    if (error) return fail(error.message);
    return ok(data);
  }

  const { data, error } = await client
    .from('user_word_progress')
    .insert({
      user_id: userId,
      word_id: wordId,
      confidence,
      swipe_right_count: action === 'swipe_right' ? 1 : 0,
      swipe_left_count: action === 'swipe_left' ? 1 : 0,
      is_learned: confidence >= 2,
      is_mastered: confidence >= 4,
    })
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Swipe Sessions
export async function createSwipeSession(userId: string, deviceInfo?: Json) {
  const client = getClient();
  const { data, error } = await client
    .from('swipe_sessions')
    .insert({ user_id: userId, device_info: deviceInfo ?? {} })
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function completeSwipeSession(
  sessionId: string,
  sessionData: {
    total_cards: number;
    correct_count: number;
    incorrect_count: number;
    reveal_count: number;
    max_combo: number;
    total_xp_earned: number;
    words_new: number;
    words_reviewed: number;
    duration_seconds: number;
  },
) {
  const client = getClient();
  const { data, error } = await client
    .from('swipe_sessions')
    .update({ ...sessionData, ended_at: new Date().toISOString(), is_completed: true })
    .eq('id', sessionId)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function logSwipeCardResult(
  sessionId: string,
  userId: string,
  wordId: string,
  action: 'swipe_right' | 'swipe_left' | 'reveal',
  confidenceBefore: number | null,
  confidenceAfter: number | null,
  combo: number,
  xpEarned: number,
  responseTimeMs: number | null,
) {
  const client = getClient();
  const { error } = await client
    .from('swipe_session_words')
    .insert({
      session_id: sessionId,
      user_id: userId,
      word_id: wordId,
      action,
      confidence_before: confidenceBefore,
      confidence_after: confidenceAfter,
      combo_at_time: combo,
      xp_earned: xpEarned,
      response_time_ms: responseTimeMs,
    });
  if (error) return fail(error.message);
  return ok(true);
}

// Battles
export async function createBattle(
  userId: string,
  enemyType: string,
  enemyLevel: number,
  isBoss: boolean,
) {
  const client = getClient();
  const { data, error } = await client
    .from('battles')
    .insert({
      user_id: userId,
      enemy_type: enemyType,
      enemy_level: enemyLevel,
      result: 'defeat',
      total_questions: 0,
      is_boss: isBoss,
    })
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function completeBattle(
  battleId: string,
  result: 'victory' | 'defeat' | 'draw',
  stats: {
    player_hp_remaining: number;
    enemy_hp_remaining: number;
    total_questions: number;
    correct_count: number;
    wrong_count: number;
    max_combo: number;
    total_damage_dealt: number;
    total_damage_taken: number;
    xp_earned: number;
    coins_earned: number;
    duration_seconds: number;
  },
) {
  const client = getClient();
  const { data, error } = await client
    .from('battles')
    .update({ ...stats, result })
    .eq('id', battleId)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Daily Missions
export async function getDailyMissions(userId: string) {
  const client = getClient();
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await client
    .from('daily_missions')
    .select('*')
    .eq('user_id', userId)
    .eq('mission_date', today);
  if (error) return fail(error.message);
  return ok(data);
}

export async function claimMissionReward(missionId: string, userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('daily_missions')
    .update({ is_claimed: true })
    .eq('id', missionId)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Gems
export async function getGemsBalance(userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('profiles')
    .select('gems')
    .eq('user_id', userId)
    .single();
  if (error) return fail(error.message);
  return ok(data?.gems ?? 0);
}

export async function deductGems(userId: string, amount: number) {
  const client = getClient();
  const { data: profile } = await client
    .from('profiles')
    .select('gems')
    .eq('user_id', userId)
    .single();
  if (!profile) return fail('Profile not found');
  const currentGems = profile.gems ?? 0;
  if (currentGems < amount) return fail('Insufficient gems');
  const { data, error } = await client
    .from('profiles')
    .update({ gems: currentGems - amount })
    .eq('user_id', userId)
    .select('gems')
    .single();
  if (error) return fail(error.message);
  return ok(data?.gems ?? 0);
}

export async function creditGems(userId: string, amount: number) {
  const client = getClient();
  const { data: profile } = await client
    .from('profiles')
    .select('gems')
    .eq('user_id', userId)
    .single();
  if (!profile) return fail('Profile not found');
  const currentGems = profile.gems ?? 0;
  const { data, error } = await client
    .from('profiles')
    .update({ gems: currentGems + amount })
    .eq('user_id', userId)
    .select('gems')
    .single();
  if (error) return fail(error.message);
  return ok(data?.gems ?? 0);
}

export async function createTopUpRequest(
  userId: string,
  pkg: 'starter' | 'popular' | 'whale',
  amount: number,
  priceRp: number,
  proofUrl: string,
) {
  const client = getClient();
  const { data, error } = await client
    .from('top_up_requests')
    .insert({
      user_id: userId,
      package: pkg,
      amount,
      price_rp: priceRp,
      proof_url: proofUrl,
    })
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

export async function getMyTopUpRequests(userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('top_up_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return fail(error.message);
  return ok(data);
}

export async function getAllTopUpRequests() {
  const client = getClient();
  const { data, error } = await client
    .from('top_up_requests')
    .select('*, user:user_id(username, avatar_url)')
    .order('created_at', { ascending: false });
  if (error) return fail(error.message);
  return ok(data);
}

export async function rejectTopUpRequest(requestId: string, adminNotes?: string) {
  const client = getClient();
  const { data, error } = await client
    .from('top_up_requests')
    .update({ status: 'rejected', admin_notes: adminNotes ?? null, reviewed_at: new Date().toISOString() })
    .eq('id', requestId)
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// Streak
export async function recordDailyActivity(
  userId: string,
  xpEarned = 0,
  swipeCount = 0,
  battleCount = 0,
  audioCount = 0,
) {
  const client = getClient();
  const { data, error } = await client.rpc('record_daily_activity', {
    p_user_id: userId,
    p_xp_earned: xpEarned,
    p_swipe_count: swipeCount,
    p_battle_count: battleCount,
    p_audio_count: audioCount,
  });
  if (error) return fail(error.message);
  const result = data as unknown as Array<{ streak_count: number; is_new_streak: boolean; streak_milestone: number }>;
  return ok(result[0] ?? { streak_count: 0, is_new_streak: false, streak_milestone: 0 });
}

// Leaderboard
export async function getWeeklyLeaderboard(limit = 50) {
  const client = getClient();
  const { data, error } = await client
    .from('leaderboard_weekly')
    .select('*')
    .order('rank_position', { ascending: true })
    .limit(limit);
  if (error) return fail(error.message);
  return ok(data);
}

export async function getFriendLeaderboard(userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('leaderboard_friends')
    .select('*')
    .eq('viewer_id', userId)
    .order('xp', { ascending: false })
    .limit(50);
  if (error) return fail(error.message);
  return ok(data);
}

// Badges
export async function getUserBadges(userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('user_badges')
    .select('*, badge:badge_id(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false, nullsFirst: false });
  if (error) return fail(error.message);
  return ok(data);
}

// Notifications
export async function getNotifications(userId: string, limit = 20) {
  const client = getClient();
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return fail(error.message);
  return ok(data);
}

export async function markNotificationRead(notificationId: string) {
  const client = getClient();
  const { error } = await client
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  if (error) return fail(error.message);
  return ok(true);
}

// Audio Log
export async function logAudioPlay(userId: string, wordId: string, speed: string) {
  const client = getClient();
  const { error } = await client
    .from('audio_play_log')
    .insert({ user_id: userId, word_id: wordId, speed });
  if (error) return fail(error.message);
  return ok(true);
}

// Friends
export async function getFriends(userId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('friends')
    .select('*, friend:friend_id(*)')
    .eq('user_id', userId)
    .eq('status', 'accepted');
  if (error) return fail(error.message);
  return ok(data);
}

export async function addFriend(userId: string, friendId: string) {
  const client = getClient();
  const { data, error } = await client
    .from('friends')
    .insert({ user_id: userId, friend_id: friendId, status: 'pending' })
    .select()
    .single();
  if (error) return fail(error.message);
  return ok(data);
}

// XP
export async function earnXp(
  userId: string,
  amount: number,
  source: string,
  description?: string,
) {
  const client = getClient();
  const { data, error } = await client.rpc('earn_xp', {
    p_user_id: userId,
    p_amount: amount,
    p_source: source,
    ...(description ? { p_description: description } : {}),
  });
  if (error) return fail(error.message);
  const result = data as unknown as Array<{ new_xp: number; new_level: number; leveled_up: boolean; rank_updated: boolean }>;
  return ok(result[0] ?? { new_xp: 0, new_level: 1, leveled_up: false, rank_updated: false });
}
