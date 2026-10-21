<template>
  <Transition name="verify">
    <div v-if="verify.reason" class="backdrop" @click.self="verify.close()">
      <form
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-title"
        @submit.prevent="submit"
      >
        <button type="button" class="close" aria-label="Закрыть" @click="verify.close()">
          <IconsCross />
        </button>

        <img class="logo" src="/logo.svg" alt="" />
        <h2 id="verify-title">Подтвердите почту</h2>
        <p>{{ verify.reason }}</p>
        <p class="hint">
          Введите код из письма<template v-if="email">, которое пришло на <b>{{ email }}</b></template>.
        </p>

        <AuthCodeInput v-model="code" class="code-input" @complete="submit" />
        <button class="btn primary" type="submit" :disabled="loading">Подтвердить</button>

        <p class="resend">
          Код отправляли при регистрации. Не нашли письмо?&nbsp;—
          <button type="button" :disabled="sending || countdown.left.value > 0" @click="resend">
            {{ countdown.left.value > 0 ? `Отправить снова через ${countdown.label.value}` : "Отправить снова" }}
          </button>
        </p>
        <button type="button" class="later" @click="verify.close()">Не сейчас</button>
      </form>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { resendVerification, verifyEmail } from "~/shared/api/auth-api";
import { useNotifications } from "~/store/notiStore";
import { useScroll } from "~/store/scrollStore";
import { useUserStore } from "~/store/userStore";
import { useVerifyStore } from "~/store/verifyStore";

/** Бэкенд отправляет письмо с кодом не чаще раза в минуту. */
const RESEND_SECONDS = 60;

const verify = useVerifyStore();
const userStore = useUserStore();
const notifications = useNotifications();
const scroll = useScroll();
const route = useRoute();
const countdown = useCountdown();

const email = computed(() => userStore.user?.email);
const code = shallowRef("");
const loading = shallowRef(false);
const sending = shallowRef(false);

async function submit() {
  if (loading.value || !email.value) return;
  if (code.value.length !== 6) {
    notifications.setNotification("Введите все 6 цифр кода");
    return;
  }
  loading.value = true;
  const res = await verifyEmail(email.value, code.value);
  // Токен из ответа не сохраняем: в нём тот же id пользователя, а статус
  // почты сервер при каждом запросе берёт из базы. Достаточно обновить профиль.
  if (res) await userStore.checkAuth(true);
  loading.value = false;
  if (!res) {
    code.value = "";
    return;
  }
  verify.close();
  notifications.setNotification("Почта подтверждена. Повторите действие");
}

// Таймер — только после успешной отправки. Ошибку (в том числе 429 с числом
// секунд — пауза общая с восстановлением пароля) уже показал plugins/api.ts.
async function resend() {
  sending.value = true;
  const res = await resendVerification();
  sending.value = false;
  if (!res) return;
  countdown.start(RESEND_SECONDS);
  notifications.setNotification("Новый код отправлен");
}

watch(
  () => verify.reason,
  (reason, previous) => {
    if (reason && !previous) {
      code.value = "";
      scroll.lock();
    }
    if (!reason && previous) scroll.unlock();
  },
);

// Esc — на документе, а не на окне: кнопка, ставшая disabled на время
// запроса, теряет фокус, и нажатие до окна уже не доходит.
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && verify.reason) verify.close();
}
onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));

// Переход на другую страницу закрывает окно.
watch(
  () => route.path,
  (path) => {
    if (verify.reason && path !== verify.openedOn) verify.close();
  },
);
</script>

<style scoped lang="scss">
// Оформление — как у окна гостя (GuestPrompt.vue).
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(8, 8, 12, 0.6);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 440px;
  max-height: 100%;
  overflow-y: auto;
  padding: 40px 32px 28px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(131, 85, 250, 0.22) 0%, rgba(131, 85, 250, 0) 70%),
    #1c1c21;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  text-align: center;

  @include small {
    padding: 36px 20px 24px;
  }
}

.close {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}

.logo {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
}

h2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  color: $white;
}

p {
  margin-top: 12px;
  font-size: 15px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.65);

  b {
    font-weight: 500;
    color: $white;
    overflow-wrap: anywhere;
  }
}

.code-input {
  gap: 10px;
  margin-top: 24px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 47px;
  margin-top: 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &.primary {
    background: $primary;
    color: $white;

    &:hover {
      background: $primary-hover;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
}

.resend {
  font-size: 14px;
  line-height: 22px;

  button {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: $white;
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;

    &:disabled {
      color: rgba(255, 255, 255, 0.45);
      text-decoration: none;
      cursor: default;
    }
  }
}

.later {
  align-self: center;
  margin-top: 16px;
  padding: 4px;
  border: none;
  background: none;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;

  &:hover {
    color: $white;
  }
}

// Появление: фон проявляется, окно поднимается чуть снизу.
.verify-enter-active,
.verify-leave-active {
  transition: opacity 0.25s ease;

  .dialog {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.verify-enter-from,
.verify-leave-to {
  opacity: 0;

  .dialog {
    transform: translateY(16px) scale(0.98);

    @media (prefers-reduced-motion: reduce) {
      transform: none;
    }
  }
}
</style>
