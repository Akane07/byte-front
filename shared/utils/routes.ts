/** Страницы, доступные без входа. Все остальные требуют авторизации. */
export const PUBLIC_PAGES = ["/", "/donates"];

/** Страница открывается без входа: публичная или одна из /auth/*. */
export function isPublicPath(path: string): boolean {
  return PUBLIC_PAGES.includes(path) || isAuthPath(path);
}

export function isAuthPath(path: string): boolean {
  return path.startsWith("/auth");
}
