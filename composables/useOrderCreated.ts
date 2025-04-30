export function useOrderCreated(created_at: string): string {
    const createdAt = new Date(created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30); // приближённо
  
    if (diffMinutes < 1) {
      return 'только что';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${getPlural(diffMinutes, 'минута', 'минуты', 'минут')} назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ${getPlural(diffHours, 'час', 'часа', 'часов')} назад`;
    } else if (diffDays < 30) {
      return `${diffDays} ${getPlural(diffDays, 'день', 'дня', 'дней')} назад`;
    } else {
      return 'больше месяца назад';
    }
  }
  
  function getPlural(n: number, one: string, few: string, many: string): string {
    const mod10 = n % 10;
    const mod100 = n % 100;
  
    if (mod10 === 1 && mod100 !== 11) {
      return one;
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return few;
    } else {
      return many;
    }
  }