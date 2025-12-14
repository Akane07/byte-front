<template>
    <div class="registration-wrapper">
        <div class="registration-menu">
            <div class="text-menu">
                <span class="menu-hero">Регистрация</span>
                <span class="menu-context typed-wrapper">
                    <span class="typed-text">Присоединяйтесь к нам</span>
                </span>
            </div>
            <div class="nav-menu">
                <DevAuthInput v-model="registerData.name" placeholder="Полное Имя" type="text" />
                <DevAuthInput v-model="registerData.email" placeholder="Ваша почта" type="text" />
                <DevAuthInput v-model="registerData.password" placeholder="Пароль" type="password" />
                <DevAuthInput v-model="registerData.confirmPassword" placeholder="Подтвердите Пароль" type="password" />
                <DevNavButton @click="handleRegister">Зарегистрироваться</DevNavButton>
            </div>
            <div class="log-and-recovery">
                <div class="google">
                    <div class="google-icon">
                        <img src="../../assets/icons/Google.svg" alt="google">
                    </div>
                    <div class="text-google">
                        <span class="log">Войти с помощью</span>
                        <span class="google-text">Google</span>
                    </div>
                </div>
            </div>
        </div>
        <DevAuthBoard :recovery="false"></DevAuthBoard>
    </div>
</template>

<script setup lang="ts">
import DevAuthInput from '~/components/auth/AuthInput.vue';
import DevNavButton from '~/components/UI/NavButton.vue';
import DevAuthBoard from '~/components/auth/AuthBoard.vue';
import { register } from '~/shared/api/auth-api';
import { setToken } from '~/shared/api';

definePageMeta({
    middleware: ['auth'],
});

const registerData = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
});

async function handleRegister() {
    const res = await register(registerData);

    if (res.access_token) {
        localStorage.setItem('byte-accessToken', res.access_token);
        setToken(res.access_token);
    }
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