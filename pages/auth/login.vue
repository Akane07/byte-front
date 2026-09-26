<template>
  <AuthScreen
    variant="login"
    title="Вход"
    subtitle="Рады видеть вас снова! Войдите, чтобы вернуться к своим проектам."
    @submit="handleLogin"
  >
    <AuthInput v-model="email" placeholder="Ваша почта" type="email" autocomplete="email" />
    <AuthInput v-model="password" placeholder="Пароль" type="password" autocomplete="current-password" />
    <AuthSubmit :loading="loading">Войти</AuthSubmit>

    <template #footer>
      <AuthGoogle />
      <span class="auth-note">Забыли пароль? <NuxtLink to="/auth/recovery">Восстановить</NuxtLink></span>
      <span class="auth-note">Нет аккаунта? <NuxtLink to="/auth/registration">Зарегистрироваться</NuxtLink></span>
    </template>
  </AuthScreen>
</template>

<script setup lang="ts">
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();
const notifications = useNotifications();

const loading = shallowRef(false);
const email = shallowRef("");
const password = shallowRef("");

async function handleLogin() {
  if (!email.value.trim() || !password.value) {
    notifications.setNotification("Введите почту и пароль");
    return;
  }

  loading.value = true;
  // Текст ошибки от сервера («Неверная почта или пароль») показывает интерсептор.
  const ok = await userStore.login({ email: email.value, password: password.value });
  loading.value = false;

  if (ok) navigateTo("/orders");
}
</script>
