<template>
    <div class="nav-wrapper">
        <div class="nav">
            <div class="byte" @click="navigateTo(`/orders`)">
                <img src="../../public/logo.svg" alt="logo">
                <span>FreelanceByte</span>
            </div>
            <div v-if="!userStore.isAuth && userStore.checked" class="nav-buttons">
                <NuxtLink to="/auth/login">
                    <DevButton :active="false">
                        Войти
                    </DevButton>
                </NuxtLink>
                <NuxtLink to="/auth/registration">
                    <DevNavButton>Регистрация</DevNavButton>
                </NuxtLink>
            </div>
            <div v-else-if="userStore.checked" class="nav-buttons">
                <IconsHome class="pointer" @click="navigateTo('/orders')"></IconsHome>
                <IconsChat class="pointer"></IconsChat>
                <UIUserAvatar class="pointer" @click.stop="showMenu = !showMenu" :src="baseURL + userStore.user?.avatar"></UIUserAvatar>
                <IconsArrow class="pointer arrow" @click.stop="showMenu = !showMenu" :class="{ active: showMenu }">
                </IconsArrow>

                <div ref="menuRef" class="menu" v-if="showMenu">
                        <div class="menu-content">
                            <NuxtLink class="pointer" @click="navigateTo('/profile/my')">Мой профиль</NuxtLink>
                            <NuxtLink class="pointer" @click="navigateTo('/profile/my/settings')">Настройки</NuxtLink>
                            <div class="border"></div>
                        </div>
                        <div class="menu-content">
                            <NuxtLink class="pointer" @click="navigateTo('/orders/my')">Мои заказы</NuxtLink>
                            <!-- <NuxtLink class="pointer">Мои услуги</NuxtLink> -->
                            <NuxtLink class="pointer" @click="navigateTo('/profile/my/portfolio')">Портфолио</NuxtLink>
                            <div class="border"></div>
                        </div>
                        <div class="menu-content">
                            <NuxtLink class="pointer">Обратная связь</NuxtLink>
                            <NuxtLink class="pointer">Выход</NuxtLink>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import DevNavButton from './DevNavButton.vue';
import DevButton from './DevButton.vue';
import { useUserStore } from '~/store/userStore';
import { baseURL } from '~/api';

const userStore = useUserStore();

const showMenu = shallowRef(false);
const menuRef = ref<HTMLElement | null>(null);

useClickOutside(menuRef, () => {
    showMenu.value = false;
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

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
    z-index: 100000;
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
    width: 150px;
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
    position: relative;

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
        border-radius: 16px;
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
        z-index: 100000;

        .menu-content {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .border {
                width: 100%;
                height: 1px;
                background: $border-color;
                margin-bottom: -12px;
                margin-top: 12px;
            }
        }
    }
}
</style>