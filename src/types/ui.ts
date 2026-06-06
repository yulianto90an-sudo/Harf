export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastPosition = 'top' | 'bottom';

export interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: ToastPosition;
}

export interface ModalConfig {
  id: string;
  content: React.ReactNode;
  variant?: 'center' | 'bottom-sheet';
  showClose?: boolean;
  onClose?: () => void;
}

export type ThemeMode = 'dark' | 'light';

export type TabId = 'home' | 'battle' | 'progress' | 'social' | 'profile';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  path: string;
}
