import type { DateRange, Deadline } from "~/shared/types";

const DEADLINE_LABELS: Record<Exclude<Deadline, "custom">, string> = {
  contract: "По договоренности",
  "more-month": "Более 1 месяца",
  "less-month": "Менее 1 месяца",
  "more-week": "Более 1 недели",
  "less-week": "Менее 1 недели",
};

export function useOrderDeadlines(deadline?: Deadline, deadlineDate?: DateRange): string {
  if (!deadline) return "";
  if (deadline === "custom") {
    return deadlineDate?.to ? `до ${useUserCreated(deadlineDate.to)}` : "Сроки не указаны";
  }
  return DEADLINE_LABELS[deadline];
}
