export function getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const style = getComputedStyle(document.documentElement);

  const getEnv = (key: string): number => {
    const value = style.getPropertyValue(key);
    if (!value) return 0;
    const parsed = parseInt(value.replace('px', ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    top: getEnv('safe-area-inset-top'),
    bottom: getEnv('safe-area-inset-bottom'),
    left: getEnv('safe-area-inset-left'),
    right: getEnv('safe-area-inset-right'),
  };
}

export function hasNotch(): boolean {
  if (typeof window === 'undefined') return false;
  const insets = getSafeAreaInsets();
  return insets.top > 20 || insets.bottom > 0;
}
