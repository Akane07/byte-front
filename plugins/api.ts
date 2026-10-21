import axios from "axios";
import { api, apiErrorMessage, EMAIL_NOT_VERIFIED, setApiOrigin } from "~/shared/api";
import { isPublicPath } from "~/shared/utils/routes";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";
import { useVerifyStore } from "~/store/verifyStore";

/**
 * Настраивает общий axios-клиент: адрес API из runtimeConfig
 * и единая обработка ошибок для всех запросов.
 */
export default defineNuxtPlugin(() => {
  setApiOrigin(useRuntimeConfig().public.apiOrigin);
  // Роутер берём здесь, при запуске плагина: внутри перехватчика
  // useRoute() может вернуть устаревший маршрут.
  const router = useRouter();

  api.interceptors.response.use(undefined, (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    // Токен истёк или невалиден — сбрасываем сессию. На вход ведём только
    // с закрытых страниц: гость на главной или в донатах там и остаётся.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useUserStore().resetSession();
      if (!isPublicPath(router.currentRoute.value.path)) {
        navigateTo({
          path: "/auth/login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
      return Promise.reject(error);
    }

    // Вместо уведомления — общее окно с вводом кода. Действие пользователь
    // после подтверждения повторит сам.
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      const code = (error.response.data as { code?: unknown } | null)?.code;
      if (code === EMAIL_NOT_VERIFIED) {
        useVerifyStore().open(apiErrorMessage(error));
        return Promise.reject(error);
      }
    }

    if (!error.config?.silent) {
      useNotifications().setNotification(apiErrorMessage(error));
    }
    return Promise.reject(error);
  });
});
