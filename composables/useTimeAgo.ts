/** Короткая давность для списка чатов: «5м», «3ч», «2д». */
export function useTimeAgo(date: string | undefined): string {
  if (!date) return "";

  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "сейчас";
  if (minutes < 60) return `${minutes}м`;
  if (hours < 24) return `${hours}ч`;
  if (days < 30) return `${days}д`;
  if (months < 12) return `${months}мес`;
  return `${Math.floor(days / 365)}г`;
}
