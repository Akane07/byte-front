import { clearToken, getToken, saveToken } from "~/shared/api";
import { login as loginRequest, register as registerRequest, type LoginData, type RegisterData } from "~/shared/api/auth-api";
import {
  changePassword as changePasswordRequest,
  getMe,
  getUserById,
  setAvatar as setAvatarRequest,
  updateMe,
  type User,
  type UserUpdate,
} from "~/shared/api/user-api";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const isAuth = computed(() => user.value !== null);
  /** Проверка сессии при старте уже выполнена. */
  const checked = shallowRef(false);

  let pending: Promise<void> | null = null;

  /**
   * Загружает профиль по сохранённому токену. Безопасно вызывать
   * из нескольких мест одновременно: запрос выполняется один раз.
   */
  function checkAuth(force = false): Promise<void> {
    if (checked.value && !force) return Promise.resolve();
    if (!pending) {
      pending = (async () => {
        if (getToken()) {
          const me = await getMe();
          if (me) {
            user.value = me;
          } else {
            resetSession();
          }
        }
        checked.value = true;
      })().finally(() => {
        pending = null;
      });
    }
    return pending;
  }

  async function startSession(token: string) {
    // Без настоящего токена сессию не начинаем — иначе в localStorage
    // окажется строка "undefined".
    if (typeof token !== "string" || !token) return;
    saveToken(token);
    await checkAuth(true);
  }

  async function login(data: LoginData) {
    const res = await loginRequest(data);
    if (!res) return false;
    await startSession(res.access_token);
    return isAuth.value;
  }

  async function register(data: RegisterData) {
    const res = await registerRequest(data);
    if (!res) return false;
    await startSession(res.access_token);
    return isAuth.value;
  }

  /** Сбросить сессию без навигации — например, когда токен протух. */
  function resetSession() {
    clearToken();
    user.value = null;
  }

  function logout() {
    resetSession();
    disconnectChatSocket();
    navigateTo("/auth/login");
  }

  function getUserId(id: string) {
    return getUserById(id);
  }

  async function editMe(update: UserUpdate) {
    const trimmed = Object.fromEntries(
      Object.entries(update).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ]),
    ) as UserUpdate;

    const res = await updateMe(trimmed);
    if (res) user.value = res;
    return res !== null;
  }

  async function changePassword(password: string, newPassword: string) {
    const res = await changePasswordRequest(password, newPassword);
    if (!res) return false;
    saveToken(res.access_token);
    return true;
  }

  async function setAvatar(file: File) {
    const form = new FormData();
    form.append("avatar", file);
    const res = await setAvatarRequest(form);
    if (res && user.value) user.value.avatar = res.avatarUrl;
    return res !== null;
  }

  return {
    user,
    isAuth,
    checked,

    checkAuth,
    login,
    register,
    logout,
    resetSession,
    getUserId,
    editMe,
    changePassword,
    setAvatar,
  };
});
