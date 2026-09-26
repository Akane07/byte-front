import { isAuthPath, isPublicPath } from "~/shared/utils/routes";
import { useUserStore } from "~/store/userStore";

/**
 * Глобальный middleware: раньше его подключали на каждой странице вручную,
 * и на шести страницах (включая чат) про него забыли.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  await userStore.checkAuth();

  if (isAuthPath(to.path)) {
    return userStore.isAuth ? navigateTo("/orders") : undefined;
  }

  if (!userStore.isAuth && !isPublicPath(to.path)) {
    return navigateTo("/auth/login");
  }
});
