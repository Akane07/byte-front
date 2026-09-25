import { plural } from "~/shared/utils/helpers";

/** «5 минут назад», «2 дня назад» и т. п. */
export function useOrderCreated(date: string | undefined): string {
  if (!date) return "";

  const diffMinutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "только что";
  if (diffMinutes < 60) {
    return `${diffMinutes} ${plural(diffMinutes, "минуту", "минуты", "минут")} назад`;
  }
  if (diffHours < 24) {
    return `${diffHours} ${plural(diffHours, "час", "часа", "часов")} назад`;
  }
  if (diffDays < 30) {
    return `${diffDays} ${plural(diffDays, "день", "дня", "дней")} назад`;
  }
  return "больше месяца назад";
}
