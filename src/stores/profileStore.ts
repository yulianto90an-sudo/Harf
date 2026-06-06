import { create } from 'zustand';
import { getProfile } from '@/services/supabase/queries';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  xpToNextLevel: number;
  level: number;
  rank: string;
  currentStreak: number;
  longestStreak: number;
  totalWordsLearned: number;
  totalSessions: number;
  battleWins: number;
  battleLosses: number;
  weeklyXP: number;
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isConnected: boolean;
}

interface ProfileActions {
  setProfile: (profile: UserProfile) => void;
  loadProfile: (userId: string) => Promise<void>;
}

type ProfileStore = ProfileState & ProfileActions;

const mockProfile: UserProfile = {
  id: '1',
  username: 'masyul',
  displayName: 'Masyul',
  avatarUrl: null,
  xp: 2840,
  xpToNextLevel: 5000,
  level: 12,
  rank: 'Perak',
  currentStreak: 7,
  longestStreak: 14,
  totalWordsLearned: 143,
  totalSessions: 89,
  battleWins: 34,
  battleLosses: 18,
  weeklyXP: 520,
};

export const useProfileStore = create<ProfileStore>()((set) => ({
  profile: mockProfile,
  isLoading: false,
  isConnected: false,

  setProfile: (profile) => set({ profile }),

  loadProfile: async (userId: string) => {
    set({ isLoading: true });
    const result = await getProfile(userId);
    if (result.data) {
      const p = result.data;
      set({
        profile: {
          id: p.user_id,
          username: '',
          displayName: '',
          avatarUrl: null,
          xp: Number(p.xp ?? 0),
          xpToNextLevel: 5000,
          level: p.level ?? 1,
          rank: '',
          currentStreak: p.current_streak ?? 0,
          longestStreak: p.highest_streak ?? 0,
          totalWordsLearned: p.total_words_learned ?? 0,
          totalSessions: 0,
          battleWins: p.total_battles_won ?? 0,
          battleLosses: (p.total_battles_played ?? 0) - (p.total_battles_won ?? 0),
          weeklyXP: 0,
        },
        isConnected: true,
        isLoading: false,
      });
    } else {
      set({ profile: mockProfile, isConnected: false, isLoading: false });
    }
  },
}));
