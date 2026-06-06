import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ToastConfig, ModalConfig, ThemeMode, TabId } from '@/types/ui';

interface UIState {
  theme: ThemeMode;
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  activeTab: TabId;
  isMascotMinimized: boolean;

  currentToast: ToastConfig | null;
  toastQueue: ToastConfig[];
  currentModal: ModalConfig | null;
}

interface UIActions {
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: TabId) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setAnimationsEnabled: (enabled: boolean) => void;

  showToast: (config: Omit<ToastConfig, 'id'>) => void;
  dismissToast: () => void;

  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      activeTab: 'home',
      isMascotMinimized: false,

      currentToast: null,
      toastQueue: [],
      currentModal: null,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setActiveTab: (activeTab) => set({ activeTab }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),

      showToast: (config) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const toast: ToastConfig = { ...config, id };

        const { currentToast } = get();
        if (currentToast) {
          set((state) => ({ toastQueue: [...state.toastQueue, toast] }));
        } else {
          set({ currentToast: toast });
        }

        const duration = config.duration ?? 3000;
        setTimeout(() => {
          get().dismissToast();
        }, duration);
      },

      dismissToast: () => {
        const { toastQueue } = get();
        if (toastQueue.length > 0) {
          const [next, ...rest] = toastQueue;
          set({ currentToast: next, toastQueue: rest });
        } else {
          set({ currentToast: null });
        }
      },

      openModal: (currentModal) => set({ currentModal }),

      closeModal: () => set({ currentModal: null }),
    }),
    {
      name: 'harf-ui',
      partialize: (state) => ({
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        musicEnabled: state.musicEnabled,
        animationsEnabled: state.animationsEnabled,
        isMascotMinimized: state.isMascotMinimized,
      }),
    },
  ),
);
