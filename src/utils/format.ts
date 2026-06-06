export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}jt`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(0)}rb`;
  return xp.toLocaleString('id-ID');
}

export function formatStreak(days: number): string {
  if (days === 0) return 'Mulai streak!';
  if (days === 1) return '1 hari';
  return `${days} hari`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPercentage(value: number, max: number): string {
  if (max === 0) return '0%';
  return `${Math.round((value / max) * 100)}%`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
