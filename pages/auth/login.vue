<template>
    <div class="login-wrapper">
        <div class="login-menu">
            <div class="text-menu">
                <span class="menu-hero">Вход</span>
                <span class="menu-context typed-wrapper">
                    <span class="typed-text">Добро пожаловать</span>
                </span>
            </div>
            <div class="nav-menu">
                <DevAuthInput placeholder="Ваша почта" type="text" />
                <DevAuthInput placeholder="Пароль" type="password" />
                <DevNavButton>Войти</DevNavButton>
            </div>
            <div class="log-and-recovery">
                <div class="google">
                    <div class="google-icon">
                        <img src="../../assets/icons/Google.svg" alt="">
                    </div>
                    <div class="text-google">
                        <span class="log">Войти с помощью</span>
                        <span class="google-text">Google</span>
                    </div>
                </div>
                <span class="recovery-text">Забыли пароль? <NuxtLink to="/auth/recovery" class="recovery">Восстановить
                    </NuxtLink></span>
            </div>
        </div>
        <DevAuthBoard :recovery="false"></DevAuthBoard>
    </div>
</template>

<script setup lang="ts">
import DevAuthInput from '~/components/auth/AuthInput.vue';
import DevNavButton from '~/components/UI/DevNavButton.vue';
import DevAuthBoard from '~/components/auth/AuthBoard.vue';

definePageMeta({
    middleware: ['auth'],
});
</script>

<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

.login-wrapper {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 131px;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

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

.menu-hero {
    font-weight: 600;
    font-size: 48px;
    color: #fff;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
}

.menu-context {
    color: $text-color-secondary;
    display: inline-block;
}

.typed-text {
    color: $text-color-secondary;
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
    border-radius: 5px;
    align-self: start;
}

.google:hover {
    opacity: 0.9;
}

.google-icon {
    border-right: 1px solid #3D3D49;
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
    color: #fff;
    font-size: 14px;
    letter-spacing: 0%;
    cursor: pointer;
}

.log {
    font-size: 10px;
    color: $text-color-secondary;
    cursor: pointer;
}

.recovery-text {
    color: $text-color-secondary;
    font-size: 14px;
}

.recovery {
    color: #fff;
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