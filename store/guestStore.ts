import { useUserStore } from "~/store/userStore";

const WELCOME_KEY = "byte-welcome-seen";

type PromptKind = "welcome" | "action";

/**
 * Приглашение гостя войти. Одно окно на два случая:
 * - welcome — один раз, когда гость впервые попал в ленту заказов;
 * - action — гость нажал то, что без аккаунта не работает (откликнуться,
 *   разместить заказ, написать, лайкнуть).
 */
export const useGuestStore = defineStore("guest", () => {
  const kind = shallowRef<PromptKind | null>(null);
  /** Что именно гость пытался сделать — показывается в тексте окна. */
  const reason = shallowRef("");
  /** Страница, где открыто окно: уход с неё окно закрывает. */
  const openedOn = shallowRef("");
  const router = useRouter();

  function open(next: PromptKind) {
    kind.value = next;
    openedOn.value = router.currentRoute.value.path;
  }

  /**
   * true — пользователь вошёл, действие можно выполнять. Иначе показывает
   * окно «нужен аккаунт» и возвращает false.
   *
   *   if (!guest.requireAuth("откликнуться на заказ")) return;
   */
  function requireAuth(action: string): boolean {
    if (useUserStore().isAuth) return true;
    reason.value = action;
    open("action");
    return false;
  }

  /** Приветствие — только гостю и только один раз на браузер. */
  function welcomeOnce() {
    if (useUserStore().isAuth || kind.value) return;
    try {
      if (localStorage.getItem(WELCOME_KEY)) return;
      localStorage.setItem(WELCOME_KEY, "1");
    } catch {
      // Хранилище недоступно (приватный режим) — покажем, просто не запомним.
    }
    open("welcome");
  }

  function close() {
    kind.value = null;
  }

  return { kind, reason, openedOn, requireAuth, welcomeOnce, close };
});
