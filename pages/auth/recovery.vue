<template>
  <div class="recovery-wrapper">
    <form class="recovery-menu" @submit.prevent="handleRecovery">
      <div class="text-menu">
        <span class="menu-hero">Восстановление</span>
        <span class="menu-context">Чтобы восстановить пароль, введите вашу почту</span>
      </div>
      <div class="nav-menu">
        <AuthInput v-model="email" placeholder="Ваша почта" type="email" />
        <UINavButton type="submit">Восстановить</UINavButton>
        <NuxtLink to="/auth/login" class="menu-context">Вернуться ко входу</NuxtLink>
      </div>
    </form>
    <AuthBoard :recovery="true" />
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from "~/store/notiStore";

const notifications = useNotifications();
const email = shallowRef("");

// На бэкенде пока нет эндпоинта восстановления пароля (есть только шаблон
// письма в MailService.sendRestoreEmail). Раньше кнопка «Войти» здесь
// молча ничего не делала — теперь пользователь хотя бы видит, почему.
function handleRecovery() {
  notifications.setNotification(
    "Восстановление пароля пока недоступно. Обратитесь в поддержку",
  );
}
</script>

<style scoped lang="scss">


.recovery-wrapper {
    display: flex;
    // align-items: center;
    justify-content: end;
    gap: 131px;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.recovery-menu {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 32px;
    min-width: 359px;
    margin-top: 100px;
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

@media (max-width: 1250px) {
    .recovery-menu {
        margin-left: 26px;
    }

    .recovery-wrapper {
        gap: 50px;
    }
}

@media (max-width: 1100px) {
    .recovery-wrapper {
        justify-content: center;
    }
}
</style>