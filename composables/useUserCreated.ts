/** Дата вида «5 сентября 2025 г.». */
export function useUserCreated(date: string | Date | undefined | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
