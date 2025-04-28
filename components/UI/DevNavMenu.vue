<template>
    <div class="nav-wrapper">
        <div class="nav">
            <div class="byte">
                <img src="../../public/logo.svg" alt="logo">
                <span>FreelanceByte</span>
            </div>
            <div v-if="!userStore.isAuth" class="nav-buttons">
                <NuxtLink to="/auth/login">
                    <DevButton :active="false">
                        Войти
                    </DevButton>
                </NuxtLink>
                <NuxtLink to="/auth/registration">
                    <DevNavButton>Регистрация</DevNavButton>
                </NuxtLink>
            </div>
            <div v-else class="nav-buttons">
                <IconsChat class="pointer"></IconsChat>
                <IconsNotifications class="pointer"></IconsNotifications>
                <UIUserAvatar></UIUserAvatar>
                <IconsArrow class="pointer arrow" @click="showMenu = !showMenu" :class="{ active: showMenu }">
                </IconsArrow>

                <div class="menu" v-if="showMenu">
                    <div class="menu-content">
                        <NuxtLink>Мой профиль</NuxtLink>
                        <NuxtLink>Личный кабинет</NuxtLink>
                    </div>
                    <div class="menu-content">
                        <NuxtLink>Мои проекты/вакансии</NuxtLink>
                        <NuxtLink>Мои услуги</NuxtLink>
                        <NuxtLink>Портфолио</NuxtLink>
                    </div>
                    <div class="menu-content">
                        <NuxtLink>Обратная связь</NuxtLink>
                        <NuxtLink>Выход</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import DevNavButton from './DevNavButton.vue';
import DevButton from './DevButton.vue';
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();

const showMenu = shallowRef(false);
</script>

<style lang="scss" scoped>
.nav-wrapper {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 60px;
}

.nav {
    width: 100%;
    max-width: 1440px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
}

.link {
    text-decoration: none;
    color: #9E9E9E;
    cursor: pointer;
}

.link-second {
    text-decoration: none;
    color: #fff;
    cursor: pointer;
}

.byte {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
}

span {
    color: #fff;
    font-weight: 700;
    font-size: 32px;
    text-align: center;
}

.nav-buttons {
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;

    .pointer {
        cursor: pointer;
    }

    .arrow {
        transform: rotate(0deg);
        transition: transform 0.2s ease;

        &.active {
            transform: rotate(-90deg);
        }
    }

    .menu {
        width: 220px;
        border-radius: 20px;
        position: absolute;
        right: -20px;
        top: 54px;
        padding: 24px 12px;
        background: radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(165, 239, 255, 0) 0%, rgba(110, 191, 244, 0) 77.08%, rgba(70, 144, 213, 0) 100%), linear-gradient(0deg, rgba(52, 49, 49, 0.2), rgba(52, 49, 49, 0.2));
        backdrop-filter: blur(80px);
        border: 1px solid #EABFFF;
        color: #C5C5C5;
        font-weight: 600;
        font-size: 14px;
        line-height: 13px;
        display: flex;
        flex-direction: column;
        gap: 40px;

        .menu-content {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
}
</style>