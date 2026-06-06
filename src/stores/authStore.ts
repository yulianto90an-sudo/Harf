import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setSession: (session) =>
        set({
          session,
          isAuthenticated: !!session,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (_email: string, _password: string) => {
        set({ isLoading: true });
        try {
          const { createClient } = await import('@/services/supabase/client');
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: _email,
            password: _password,
          });
          if (error) throw error;
          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isLoading: false,
            isGuest: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (_email: string, _password: string, _name: string) => {
        set({ isLoading: true });
        try {
          const { createClient } = await import('@/services/supabase/client');
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email: _email,
            password: _password,
            options: { data: { display_name: _name } },
          });
          if (error) throw error;
          set({
            user: data.user ?? null,
            session: data.session,
            isAuthenticated: !!data.session,
            isLoading: false,
            isGuest: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          const { createClient } = await import('@/services/supabase/client');
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch {
          /* proceed with local logout even if supabase fails */
        }
        set({ ...initialState, isLoading: false });
      },

      continueAsGuest: () =>
        set({
          isGuest: true,
          isLoading: false,
          user: null,
          session: null,
        }),
    }),
    {
      name: 'harf-auth',
      partialize: (state) => ({
        session: state.session,
        isGuest: state.isGuest,
      }),
    },
  ),
);
