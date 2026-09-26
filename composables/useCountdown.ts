/**
 * Обратный отсчёт в секундах — например, до повторной отправки кода.
 * Бэкенд отправляет письмо не чаще раза в минуту; таймер показывает это заранее.
 */
export function useCountdown() {
  const left = shallowRef(0);
  let timer: ReturnType<typeof setInterval> | undefined;

  function start(seconds: number) {
    clearInterval(timer);
    left.value = seconds;
    timer = setInterval(() => {
      left.value -= 1;
      if (left.value <= 0) clearInterval(timer);
    }, 1000);
  }

  /** «0:45» */
  const label = computed(() => `${Math.floor(left.value / 60)}:${String(left.value % 60).padStart(2, "0")}`);

  onBeforeUnmount(() => clearInterval(timer));

  return { left, label, start };
}
