<template>
  <AuthScreen variant="recovery" :step="step" v-bind="TEXT[step]" @submit="onSubmit">
    <template v-if="step === 'email'">
      <AuthInput v-model="email" placeholder="Ваша почта" type="email" autocomplete="email" />
      <AuthSubmit :loading="loading">Далее</AuthSubmit>
    </template>
    <template v-else-if="step === 'code'">
      <AuthCodeInput v-model="code" @complete="checkCode" />
      <AuthSubmit :loading="loading">Восстановить</AuthSubmit>
    </template>
    <template v-else>
      <AuthInput v-model="password" placeholder="Новый пароль" type="password" autocomplete="new-password" />
      <AuthInput v-model="confirmPassword" placeholder="Повторите пароль" type="password" autocomplete="new-password" />
      <AuthSubmit :loading="loading">Сохранить и войти</AuthSubmit>
    </template>

    <template #footer>
      <span v-if="step === 'email'" class="auth-note">
        Вспомнили пароль? <NuxtLink to="/auth/login">Войти</NuxtLink>
      </span>
      <template v-else-if="step === 'code'">
        <span class="auth-note">
          Не получили код?
          <button type="button" :disabled="countdown.left.value > 0" @click="resend">
            {{ countdown.left.value > 0 ? `Отправить ещё раз через ${countdown.label.value}` : "Отправить код ещё раз" }}
          </button>
        </span>
        <span class="auth-note"><button type="button" @click="changeEmail">Изменить почту</button></span>
      </template>
    </template>
  </AuthScreen>
</template>

<script setup lang="ts">
import { checkRecoveryCode, requestRecovery, resetPassword } from "~/shared/api/auth-api";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

type Step = "email" | "code" | "password";

const RESEND_SECONDS = 60;

const TEXT: Record<Step, { title: string; subtitle: string }> = {
  email: { title: "Восстановление", subtitle: "Чтобы восстановить пароль, введите вашу почту" },
  code: { title: "Восстановление", subtitle: "На вашу почту пришёл код восстановления, введите его" },
  password: {
    title: "Новый пароль",
    subtitle: "Не менее 8 символов, хотя бы одна латинская буква и одна цифра",
  },
};

const userStore = useUserStore();
const notifications = useNotifications();
const countdown = useCountdown();

const step = shallowRef<Step>("email");
const loading = shallowRef(false);
const email = shallowRef("");
const code = shallowRef("");
const password = shallowRef("");
const confirmPassword = shallowRef("");

function onSubmit() {
  if (step.value === "email") sendCode();
  else if (step.value === "code") checkCode();
  else savePassword();
}

async function sendCode() {
  if (!email.value.trim()) {
    notifications.setNotification("Введите почту");
    return;
  }

  loading.value = true;
  // Бэкенд отвечает одинаково, есть такая почта или нет, — поэтому здесь
  // всегда переходим к вводу кода.
  const res = await requestRecovery(email.value.trim());
  loading.value = false;

  if (res) {
    code.value = "";
    step.value = "code";
    countdown.start(RESEND_SECONDS);
  }
}

async function checkCode() {
  if (loading.value) return;
  if (code.value.length !== 6) {
    notifications.setNotification("Введите все 6 цифр кода");
    return;
  }

  loading.value = true;
  const res = await checkRecoveryCode(email.value.trim(), code.value);
  loading.value = false;

  if (res) step.value = "password";
  else code.value = "";
}

async function savePassword() {
  if (!password.value) {
    notifications.setNotification("Введите новый пароль");
    return;
  }
  if (password.value !== confirmPassword.value) {
    notifications.setNotification("Пароли не совпадают");
    return;
  }

  loading.value = true;
  const res = await resetPassword(email.value.trim(), code.value, password.value);
  if (res) {
    await userStore.startSession(res.access_token);
    notifications.setNotification("Пароль изменён");
    navigateTo("/orders");
  }
  loading.value = false;
}

async function resend() {
  const res = await requestRecovery(email.value.trim());
  if (res) {
    notifications.setNotification("Если почта зарегистрирована, мы отправили новый код");
    countdown.start(RESEND_SECONDS);
  }
}

function changeEmail() {
  code.value = "";
  step.value = "email";
}
</script>
