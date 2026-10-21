/**
 * Окно «Подтвердите почту». Открывается само, когда бэкенд отвечает кодом
 * EMAIL_NOT_VERIFIED — на запрос к API (plugins/api.ts) или событием сокета
 * (useChatSocket.ts), поэтому кнопкам ничего обрабатывать не нужно.
 */
export const useVerifyStore = defineStore("verify", () => {
  /** Причина из ответа бэкенда — «Подтвердите почту, чтобы…». Пусто — окно закрыто. */
  const reason = shallowRef("");
  /** Страница, где открыто окно: уход с неё окно закрывает. */
  const openedOn = shallowRef("");
  const router = useRouter();

  function open(text: string) {
    reason.value = text;
    openedOn.value = router.currentRoute.value.path;
  }

  function close() {
    reason.value = "";
  }

  return { reason, openedOn, open, close };
});
