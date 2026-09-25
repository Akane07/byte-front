import axios from "axios";
import { api, apiErrorMessage, setApiOrigin } from "~/shared/api";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

/**
 * Настраивает общий axios-клиент: адрес API из runtimeConfig
 * и единая обработка ошибок для всех запросов.
 */
export default defineNuxtPlugin(() => {
  setApiOrigin(useRuntimeConfig().public.apiOrigin);

  api.interceptors.response.use(undefined, (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    // Токен истёк или невалиден — сбрасываем сессию и ведём на вход.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useUserStore().resetSession();
      if (!useRoute().path.startsWith("/auth")) {
        navigateTo("/auth/login");
      }
      return Promise.reject(error);
    }

    if (!error.config?.silent) {
      useNotifications().setNotification(apiErrorMessage(error));
    }
    return Promise.reject(error);
  });
});
