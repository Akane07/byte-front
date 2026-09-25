/** Вызывает cb при клике вне элемента. Слушатель снимается при размонтировании. */
export function useClickOutside<T extends HTMLElement>(
  target: Ref<T | null>,
  cb: (event: MouseEvent) => void,
) {
  const handler = (event: MouseEvent) => {
    const el = target.value;
    if (el && !el.contains(event.target as Node)) {
      cb(event);
    }
  };

  onMounted(() => document.addEventListener("click", handler));
  onBeforeUnmount(() => document.removeEventListener("click", handler));
}
