export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    CALLBACK: '/auth/callback',
    FORGOT_PASSWORD: '/forgot-password',
    ONBOARDING: '/onboarding',
  },
  SWIPE: '/swipe',
  BATTLE: {
    SELECT: '/battle',
    ARENA: (id: string) => `/battle/${id}`,
  },
  PROGRESS: '/progress',
  PROFILE: {
    INDEX: '/profile',
    SETTINGS: '/profile/settings',
  },
  SOCIAL: '/social',
} as const;
