import { useUserStore } from "~/store/userStore";

/** Страницы, доступные без входа. Все остальные требуют авторизации. */
const PUBLIC_PAGES = ["/donates"];

/**
 * Глобальный middleware: раньше его подключали на каждой странице вручную,
 * и на шести страницах (включая чат) про него забыли.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  await userStore.checkAuth();

  const isAuthPage = to.path.startsWith("/auth");

  if (isAuthPage) {
    return userStore.isAuth ? navigateTo("/orders") : undefined;
  }

  if (!userStore.isAuth && !PUBLIC_PAGES.includes(to.path)) {
    return navigateTo("/auth/login");
  }
});
