/**
 * Блокирует прокрутку страницы, пока открыта модалка или боковая панель.
 * Счётчик вместо флага: при двух открытых модалках закрытие одной
 * больше не разблокирует прокрутку под второй.
 */
export const useScroll = defineStore("scroll", () => {
  const locks = shallowRef(0);

  watch(locks, (count) => {
    document.body.style.overflow = count > 0 ? "hidden" : "";
  });

  function lock() {
    locks.value++;
  }

  function unlock() {
    locks.value = Math.max(0, locks.value - 1);
  }

  return { lock, unlock };
});
