<template>
  <div class="wrapper">
    <div class="login-wrapper">
      <form class="login-menu" @submit.prevent="handleLogin">
        <div class="text-menu">
          <span class="menu-hero">Вход</span>
          <span class="menu-context typed-wrapper">
            <span class="typed-text">Добро пожаловать</span>
          </span>
        </div>
        <div class="nav-menu">
          <AuthInput v-model="loginData.email" placeholder="Ваша почта" type="email" />
          <AuthInput v-model="loginData.password" placeholder="Пароль" type="password" />
          <UINavButton type="submit" :disabled="loading">Войти</UINavButton>
        </div>
        <div class="log-and-recovery">
          <div class="google" @click="googleUnavailable">
            <div class="google-icon">
              <img src="~/assets/icons/Google.svg" alt="Google" />
            </div>
            <div class="text-google">
              <span class="log">Войти с помощью</span>
              <span class="google-text">Google</span>
            </div>
          </div>
          <span class="recovery-text"
            >Забыли пароль?
            <NuxtLink to="/auth/recovery" class="recovery">Восстановить</NuxtLink></span
          >
        </div>
      </form>
      <AuthBoard :recovery="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();
const notifications = useNotifications();

const loading = shallowRef(false);
const loginData = ref({
  email: "",
  password: "",
});

async function handleLogin() {
  if (!loginData.value.email.trim() || !loginData.value.password) {
    notifications.setNotification("Введите почту и пароль");
    return;
  }

  loading.value = true;
  // Текст ошибки от сервера («Неверная почта или пароль») показывает интерсептор.
  const ok = await userStore.login(loginData.value);
  loading.value = false;

  if (ok) navigateTo("/orders");
}

function googleUnavailable() {
  notifications.setNotification("Вход через Google пока недоступен");
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  position: relative;
  margin-bottom: 100px;
  overflow: hidden;

  .login-wrapper {
    display: flex;
    align-items: center;
    gap: 131px;
    height: 100vh;
    width: 100%;
    max-width: 1440px;
    overflow: hidden;

    .login-menu {
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 32px;
      min-width: 359px;
    }

    .text-menu {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}

.menu-hero {
  font-weight: 600;
  font-size: 48px;
  color: $white;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.menu-context {
  color: $text-secondary;
  display: inline-block;
}

.typed-text {
  color: $text-secondary;
  font-size: 18px;
}

.log-and-recovery {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.google {
  background: $input-auth;
  display: flex;
  padding: 12px 14px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 6px;
  align-self: start;
}

.google:hover {
  opacity: 0.9;
}

.google-icon {
  border-right: 1px solid #3d3d49;
  padding-right: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.google-icon img {
  cursor: pointer;
}

.text-google {
  display: flex;
  flex-direction: column;
  gap: 1px;
  cursor: pointer;
}

.google-text {
  color: $white;
  font-size: 14px;
  letter-spacing: 0%;
  cursor: pointer;
}

.log {
  font-size: 10px;
  color: $text-secondary;
  cursor: pointer;
}

.recovery-text {
  color: $text-secondary;
  font-size: 14px;
}

.recovery {
  color: $white;
  cursor: pointer;
}

@media (max-width: 1250px) {
  .login-menu {
    margin-left: 26px;
  }

  .login-wrapper {
    gap: 50px;
  }
}

@media (max-width: 1100px) {
  .login-wrapper {
    justify-content: center;
  }
}
</style>
