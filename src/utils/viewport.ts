export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 375;
  return window.innerWidth;
}

export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 812;
  return window.innerHeight;
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < 768;
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}
