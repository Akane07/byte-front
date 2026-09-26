<template>
  <AuthScreen variant="register" :step="step" v-bind="TEXT[step]" @submit="onSubmit">
    <template v-if="step === 'form'">
      <AuthInput v-model="email" placeholder="Ваша почта" type="email" autocomplete="email" />
      <AuthInput v-model="password" placeholder="Пароль" type="password" autocomplete="new-password" />
      <AuthInput v-model="confirmPassword" placeholder="Повторите пароль" type="password" autocomplete="new-password" />
      <AuthSubmit :loading="loading">Зарегистрироваться</AuthSubmit>
    </template>
    <!-- Аккаунт уже создан и вход выполнен: подтвердить почту можно и позже. -->
    <template v-else>
      <AuthCodeInput v-model="code" @complete="handleVerify" />
      <AuthSubmit :loading="loading">Подтвердить</AuthSubmit>
    </template>

    <template #subtitle>
      <template v-if="step === 'code'">На почту {{ email }} пришёл код подтверждения, введите его</template>
    </template>

    <template #footer>
      <template v-if="step === 'form'">
        <AuthGoogle />
        <span class="auth-note">Уже есть аккаунт? <NuxtLink :to="{ path: '/auth/login', query: route.query }">Войти</NuxtLink></span>
      </template>
      <template v-else>
        <span class="auth-note">
          Не получили код?
          <button type="button" :disabled="countdown.left.value > 0" @click="resend">
            {{ countdown.left.value > 0 ? `Отправить ещё раз через ${countdown.label.value}` : "Отправить код ещё раз" }}
          </button>
        </span>
        <span class="auth-note"><NuxtLink :to="nextPage">Подтвердить позже</NuxtLink></span>
      </template>
    </template>
  </AuthScreen>
</template>

<script setup lang="ts">
import { resendVerification, verifyEmail } from "~/shared/api/auth-api";
import { safeRedirect } from "~/shared/utils/routes";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

type Step = "form" | "code";

const RESEND_SECONDS = 60;

const TEXT: Record<Step, { title: string; subtitle?: string }> = {
  form: {
    title: "Регистрация",
    subtitle: "Откройте доступ к проектам, проверенным заказчикам и инструментам для продуктивной работы.",
  },
  // Подзаголовок с адресом почты — в слоте #subtitle.
  code: { title: "Подтверждение" },
};

const route = useRoute();
/** Куда после регистрации: туда, откуда гостя попросили войти, иначе в ленту. */
const nextPage = computed(() => safeRedirect(route.query.redirect));
const userStore = useUserStore();
const notifications = useNotifications();
const countdown = useCountdown();

const step = shallowRef<Step>("form");
const loading = shallowRef(false);
const email = shallowRef("");
const password = shallowRef("");
const confirmPassword = shallowRef("");
const code = shallowRef("");

function onSubmit() {
  if (step.value === "form") handleRegister();
  else handleVerify();
}

async function handleRegister() {
  if (!email.value.trim() || !password.value) {
    notifications.setNotification("Введите почту и пароль");
    return;
  }
  if (password.value !== confirmPassword.value) {
    notifications.setNotification("Пароли не совпадают");
    return;
  }

  loading.value = true;
  const ok = await userStore.register({ email: email.value, password: password.value });
  loading.value = false;

  if (ok) {
    step.value = "code";
    countdown.start(RESEND_SECONDS);
  }
}

async function handleVerify() {
  if (loading.value) return;
  if (code.value.length !== 6) {
    notifications.setNotification("Введите все 6 цифр кода");
    return;
  }

  loading.value = true;
  const res = await verifyEmail(email.value.trim(), code.value);
  loading.value = false;

  if (res) {
    await userStore.checkAuth(true);
    notifications.setNotification("Почта подтверждена");
    navigateTo(nextPage.value);
  } else {
    code.value = "";
  }
}

async function resend() {
  const res = await resendVerification();
  if (res) {
    notifications.setNotification("Новый код отправлен");
    countdown.start(RESEND_SECONDS);
  }
}
</script>
