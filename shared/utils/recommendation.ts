import type { Order, Recommendation } from "../api/order-api";
import { plural } from "./helpers";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * «Почему в подборке?»: два самых весомых положительных вклада в score —
 * фактами с числами, плюс «нет заказов в работе», если исполнитель свободен.
 */
export function recommendationReasons(rec: Recommendation, order: Order, now = new Date()): string[] {
  const { contributions, completed, inProgress, factors, quotaSlot } = rec.ranking;
  const top = (["Q", "R", "E", "A"] as const)
    .filter((f) => contributions[f] > 0)
    .sort((a, b) => contributions[b] - contributions[a])
    .slice(0, 2);

  const texts = {
    Q: () =>
      rec.reviews_count
        ? `рейтинг ${rec.rating.toFixed(1).replace(".", ",")} по ${rec.reviews_count} ${plural(rec.reviews_count, "отзыву", "отзывам", "отзывам")}`
        : "пока без отзывов — учтена средняя оценка платформы",
    R: () => matchText(rec, order),
    E: () => {
      const done = `${completed} ${plural(completed, "завершённый заказ", "завершённых заказа", "завершённых заказов")}`;
      // аванс начисляется всем с заполненным профилем, но заметен он только у новичков
      return rec.isNewcomer && factors.Eadv > factors.E ? `${done} и аванс опыта за заполненный профиль` : done;
    },
    A: () => seenText(rec.last_seen, now),
  };

  return [
    ...(quotaSlot ? ["Место для новых исполнителей с заполненным профилем"] : []),
    ...top.map((f) => texts[f]()),
    ...(inProgress === 0 ? ["нет заказов в работе"] : []),
  ];
}

function matchText(rec: Recommendation, order: Order) {
  const cat = order.category !== undefined && !!rec.categories?.includes(order.category);
  const total = order.skills.length;
  const own = new Set(rec.skills);
  const matched = order.skills.filter((s) => own.has(s)).length;
  const skills = `${matched} из ${total} ${plural(total, "навыка", "навыков", "навыков")} заказа`;
  if (!total || !matched) return cat ? "категория заказа" : skills;
  return cat ? `категория и ${skills}` : skills;
}

function seenText(lastSeen: string | undefined, now: Date) {
  if (!lastSeen) return "давно не был на сайте";
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.max(0, Math.round((day(now) - day(new Date(lastSeen))) / DAY_MS));
  if (days === 0) return "был на сайте сегодня";
  if (days === 1) return "был на сайте вчера";
  return `был на сайте ${days} ${plural(days, "день", "дня", "дней")} назад`;
}
