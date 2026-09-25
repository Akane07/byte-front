import type { Price, PriceType } from "~/shared/types";

const formatNumber = (n: number) => n.toLocaleString("ru-RU");

/** «15 000 руб.», «500 – 1 000 руб/час», «Договорная». */
export function useOrderPrice(priceType?: PriceType, price?: Price): string {
  if (!priceType || priceType === "contract" || price === undefined) {
    return "Договорная";
  }

  const unit = priceType === "hourly" ? "руб/час" : "руб.";
  if (typeof price === "number") {
    return `${formatNumber(price)} ${unit}`;
  }
  return price.from === price.to
    ? `${formatNumber(price.from)} ${unit}`
    : `${formatNumber(price.from)} – ${formatNumber(price.to)} ${unit}`;
}
