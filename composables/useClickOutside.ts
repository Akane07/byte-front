export const useClickOutside = <T extends HTMLElement>(
    refEl: Ref<T | null>,
    cb: (event: Event) => void
  ) => {
    const handler = (e: Event) => {
      let el = e.target;
      const nodes = [];
      nodes.push(el);
  
      while (el) {
        nodes.unshift((el as HTMLElement).parentNode);
        el = (el as HTMLElement).parentNode;
      }
  
      const hasElement = nodes.reduce((res, element) => {
        return res || element === refEl.value;
      }, false);
  
      if (!hasElement) {
        cb(e);
      }
    };
  
    onMounted(() => {
      document.addEventListener("click", handler);
    });
  
    onUnmounted(() => {
      document.removeEventListener("click", handler);
    });
  
    watch(refEl, () => {
      if (!refEl.value) return;
  
      document.removeEventListener("click", handler);
      document.addEventListener("click", handler);
    });
  };
  