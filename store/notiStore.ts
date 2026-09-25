const VISIBLE_MS = 5000;

/**
 * Всплывающее уведомление. Раньше стор искал элемент через
 * document.querySelector и переключал классы таймерами; второе
 * уведомление, пришедшее во время показа первого, терялось.
 * Теперь состояние реактивное, а новое уведомление заменяет текущее.
 */
export const useNotifications = defineStore("notifications", () => {
  const text = shallowRef("");
  const visible = shallowRef(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function setNotification(value: string) {
    clearTimeout(timer);
    text.value = value;
    visible.value = true;
    timer = setTimeout(hideNotification, VISIBLE_MS);
  }

  function hideNotification() {
    clearTimeout(timer);
    visible.value = false;
  }

  return { text, visible, setNotification, hideNotification };
});
