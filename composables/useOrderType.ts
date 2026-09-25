export function useOrderType(type?: "one-time" | "reusable"): string {
  return type === "reusable" ? "долгосрочный" : "одноразовый";
}
