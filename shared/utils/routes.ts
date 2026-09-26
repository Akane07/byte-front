/**
 * Страницы, доступные без входа: гость может осмотреться — ленту, заказ,
 * чужой профиль и проект портфолио. Действия на них (откликнуться, написать,
 * лайкнуть) просят войти — см. useGuestPrompt.
 */
const PUBLIC_PAGES: RegExp[] = [
  /^\/$/,
  /^\/donates$/,
  /^\/orders$/,
  // /orders/<id>, но не /orders/create, /orders/my, /orders/suggest
  /^\/orders\/(?!create$|my$|suggest$)[^/]+$/,
  // /profile/<id>, но не /profile/my и /profile/new-project
  /^\/profile\/(?!my$|new-project$)[^/]+$/,
  /^\/profile\/portfolio\/[^/]+$/,
];

/** Страница открывается без входа: публичная или одна из /auth/*. */
export function isPublicPath(path: string): boolean {
  const clean = path.length > 1 ? path.replace(/\/$/, "") : path;
  return PUBLIC_PAGES.some((re) => re.test(clean)) || isAuthPath(clean);
}

export function isAuthPath(path: string): boolean {
  return path.startsWith("/auth");
}

/**
 * Куда вернуть пользователя после входа. Берётся из ?redirect= и принимается
 * только внутренний путь — иначе ссылкой вида ?redirect=https://… можно было
 * бы увести человека на чужой сайт.
 */
export function safeRedirect(value: unknown, fallback = "/orders"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return isAuthPath(value) ? fallback : value;
}
