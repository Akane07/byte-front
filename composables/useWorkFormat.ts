import type { WorkFormat } from "~/shared/api/order-api";
import type { PerformerFormat } from "~/shared/api/user-api";

/**
 * Подпись к срокам заказа. Для работы на месте важна дата визита,
 * а «продолжительность проекта» звучит странно для сборки шкафа.
 */
export function useDeadlineCaption(format: WorkFormat | undefined): string {
  return format === "onsite" ? "Когда нужно выполнить" : "Продолжительность проекта";
}

/** «Удалённо», «На месте», «Удалённо и на месте» — для профиля исполнителя. */
export function usePerformerFormat(format: PerformerFormat | undefined): string {
  if (format === "onsite") return "На месте";
  if (format === "both") return "Удалённо и на месте";
  return "Удалённо";
}
