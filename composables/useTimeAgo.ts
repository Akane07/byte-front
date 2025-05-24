export function useTimeAgo(date: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();

  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return '1м';
  if (minutes < 60) return `${minutes}м`;
  if (hours < 24) return `${hours}ч`;
  if (days < 30) return `${days}д`;
  if (months < 12) return `${months}мес`;
  return `${years}г`;
}
