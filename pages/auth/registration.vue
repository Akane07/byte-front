<template>
  <div class="registration-wrapper">
    <form v-if="!awaitingCode" class="registration-menu" @submit.prevent="handleRegister">
      <div class="text-menu">
        <span class="menu-hero">Регистрация</span>
        <span class="menu-context typed-wrapper">
          <span class="typed-text">Присоединяйтесь к нам</span>
        </span>
      </div>
      <div class="nav-menu">
        <AuthInput v-model="registerData.name" placeholder="Полное имя" type="text" />
        <AuthInput v-model="registerData.email" placeholder="Ваша почта" type="email" />
        <AuthInput v-model="registerData.password" placeholder="Пароль" type="password" />
        <AuthInput v-model="confirmPassword" placeholder="Подтвердите пароль" type="password" />
        <UINavButton type="submit" :disabled="loading">Зарегистрироваться</UINavButton>
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
      </div>
    </form>

    <form v-else class="registration-menu" @submit.prevent="handleVerify">
      <div class="text-menu">
        <span class="menu-hero">Почта</span>
        <span class="menu-context">
          Мы отправили код подтверждения на {{ registerData.email }}
        </span>
      </div>
      <div class="nav-menu">
        <AuthInput v-model="code" placeholder="Код из письма" type="text" />
        <UINavButton type="submit" :disabled="loading">Подтвердить</UINavButton>
        <NuxtLink to="/orders" class="menu-context">Подтвердить позже</NuxtLink>
      </div>
    </form>

    <AuthBoard :recovery="false" />
  </div>
</template>

<script setup lang="ts">
import { verifyEmail } from "~/shared/api/auth-api";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();
const notifications = useNotifications();

const loading = shallowRef(false);
const awaitingCode = shallowRef(false);
const code = shallowRef("");
const confirmPassword = shallowRef("");
const registerData = reactive({
  name: "",
  email: "",
  password: "",
});

async function handleRegister() {
  if (!registerData.name.trim() || !registerData.email.trim()) {
    notifications.setNotification("Заполните имя и почту");
    return;
  }
  // Раньше поле подтверждения пароля ни с чем не сравнивалось.
  if (registerData.password !== confirmPassword.value) {
    notifications.setNotification("Пароли не совпадают");
    return;
  }

  loading.value = true;
  const ok = await userStore.register(registerData);
  loading.value = false;

  if (ok) awaitingCode.value = true;
}

async function handleVerify() {
  if (!code.value.trim()) return;

  loading.value = true;
  const res = await verifyEmail(registerData.email, code.value.trim());
  loading.value = false;

  if (res) {
    await userStore.checkAuth(true);
    notifications.setNotification("Почта подтверждена");
    navigateTo("/orders");
  }
}

function googleUnavailable() {
  notifications.setNotification("Вход через Google пока недоступен");
}
</script>

<style scoped lang="scss">


.registration-wrapper {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 131px;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.registration-menu {
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

.typed-wrapper {
    display: inline-flex;
    align-items: baseline;
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
    padding: 14px 13px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    border-radius: 6px;
}

.google:hover {
    opacity: 0.9;
}

.google-icon {
    border-right: 1px solid #3D3D49;
    padding-right: 9px;
    cursor: pointer;
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

@media (max-width: 1250px) {
    .registration-menu {
        margin-left: 26px;
    }

    .registration-wrapper {
        gap: 50px;
    }
}

@media (max-width: 1100px) {
    .registration-wrapper {
        justify-content: center;
    }
}
</style>