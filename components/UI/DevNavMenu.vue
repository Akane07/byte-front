<template>
    <div class="nav-wrapper">
        <div class="nav">
            <div class="byte pointer" @click="navigateTo(`/orders`)">
                <img class="pointer" src="../../public/logo.svg" alt="logo">
                <span class="pointer">FreelanceByte</span>
            </div>
            <div v-if="!userStore.isAuth && userStore.checked" class="nav-buttons">
                <NuxtLink to="/auth/login">
                    <DevButton>
                        Войти
                    </DevButton>
                </NuxtLink>
                <NuxtLink to="/auth/registration">
                    <DevNavButton>Регистрация</DevNavButton>
                </NuxtLink>
            </div>
            <div v-else-if="userStore.checked" class="nav-buttons">
                <IconsHome class="pointer" @click="navigateTo('/orders')"></IconsHome>
                <IconsChat class="pointer" @click="navigateTo('/chat')"></IconsChat>
                <UIUserAvatar class="pointer" @click.stop="showMenu = !showMenu"
                    :src="baseURL + userStore.user?.avatar"></UIUserAvatar>
                <IconsArrow class="pointer arrow" @click.stop="showMenu = !showMenu" :class="{ active: showMenu }">
                </IconsArrow>

                <div ref="menuRef" class="menu" v-if="showMenu">
                    <div class="menu_wrapper">
                        <div class="menu-content">
                            <NuxtLink class="pointer link" @click="navigateTo('/profile/my')">Мой профиль</NuxtLink>
                            <NuxtLink class="pointer link" @click="navigateTo('/orders/my')">Мои заказы/отклики
                            </NuxtLink>
                            <NuxtLink class="pointer link" @click="navigateTo('/profile/my/settings')">Настройки
                            </NuxtLink>
                            <div class="bordered"></div>
                        </div>
                        <div class="menu-content">
                            <NuxtLink class="pointer link" @click="navigateTo('/donates')">Донаты</NuxtLink>
                            <NuxtLink class="pointer link">Обратная связь</NuxtLink>
                            <NuxtLink class="pointer link" @click="modal = true">Выход</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

        <UIDevModal v-if="modal" title="Подтверждение" @close="modal = false">
        <template #body>
            <p class="confirm" style="color: white;">Вы уверены, что хотите выйти из своего аккаунта?</p>
        </template>
        <template #buttons>
            <UIDevButton @click.stop="modal = false">Отмена</UIDevButton>
            <UIDevButton active @click.stop="userStore.logout()">Выйти</UIDevButton>
        </template>
    </UIDevModal>
</template>


<script setup lang="ts">
import DevNavButton from './DevNavButton.vue';
import DevButton from './DevButton.vue';
import { useUserStore } from '~/store/userStore';
import { baseURL } from '~/shared/api';

const userStore = useUserStore();

const showMenu = shallowRef(false);
const menuRef = ref<HTMLElement | null>(null);
const modal = shallowRef(false);

useClickOutside(menuRef, () => {
    showMenu.value = false;
})
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
    z-index: 100000;
}

.link {
    text-decoration: none;
    color: $text-secondary;
    cursor: pointer;
}

.link-second {
    text-decoration: none;
    color: $white;
    cursor: pointer;
}

.byte {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
}

span {
    color: $white;
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


    .arrow {
        transform: rotate(0deg);
        transition: transform 0.2s ease;

        &.active {
            transform: rotate(-90deg);
        }
    }

    .menu {
        width: 220px;
        border-radius: 6px;
        position: absolute;
        right: -20px;
        top: 54px;
        padding: 2px;
        z-index: 100000;
        background: $bg-gradient;

        .menu_wrapper {
            width: 100%;
            border-radius: 6px;
            padding: 28px 16px;
            background: $input-auth;
            backdrop-filter: blur(80px);
            display: flex;
            flex-direction: column;
            gap: 40px;
        }

        .menu-content {
            display: flex;
            flex-direction: column;
            gap: 12px;

            .bordered {
                width: 100%;
                height: 1px;
                background: $border-color;
                margin-bottom: -12px;
                margin-top: 12px;
            }

            .link {
                color: $text-header;
                font-weight: 600;
                font-size: 14px;
                line-height: 13px;
                transition: color 0.1s ease-in;

                &:hover {
                    color: $select-enabled;
                }
            }
        }
    }
}

.pointer {
    cursor: pointer;
}
</style>