<template>
  <div
    class="nav flex items-center justify-center w-full h-20 px-15 py-0"
    :class="[absolute ? 'fixed z-1000 top-0' : '']"
  >
    <div class="w-full max-w-360 h-11 flex items-center justify-between z-1000">
      <div
        class="flex items-center justify-center gap-2 cursor-pointer"
        @click="navigateTo(`/orders`)"
      >
        <img src="../../public/logo.svg" alt="logo" class="w-10" />
        <span class="byte text-center">FreelanceByte</span>
      </div>
      <div
        v-if="!userStore.isAuth && userStore.checked"
        class="w-37.5 flex items-center gap-3 relative select-none"
      >
        <NuxtLink to="/auth/login">
          <DevButton> Войти </DevButton>
        </NuxtLink>
        <NuxtLink to="/auth/registration">
          <DevNavButton>Регистрация</DevNavButton>
        </NuxtLink>
      </div>
      <div
        v-else-if="userStore.checked"
        class="w-37.5 flex items-center gap-3 relative select-none"
      >
        <IconsHome
          class="cursor-pointer"
          @click="navigateTo('/orders')"
        ></IconsHome>
        <IconsChat
          class="cursor-pointer"
          @click="navigateTo('/chat')"
        ></IconsChat>
        <UIUserAvatar
          class="cursor-pointer"
          @click.stop="showMenu = !showMenu"
          :src="makeURL(userStore.user?.avatar)"
        >
        </UIUserAvatar>
        <IconsArrow
          class="cursor-pointer arrow"
          @click.stop="showMenu = !showMenu"
          :class="{ active: showMenu }"
        >
        </IconsArrow>

        <div
          ref="menuRef"
          class="menu w-60 absolute -right-5 top-13.5 p-0.5 rounded-md z-100000"
          v-if="showMenu"
        >
          <div
            class="menu_wrapper w-full flex flex-col gap-3 rounded-md px-5 py-4"
          >
            <div class="flex flex-col gap-3">
              <NuxtLink
                class="cursor-pointer link"
                @click="navigateTo('/profile/my')"
              >
                <IconsUser
                  class="cursor-pointer w-5"
                  @click="navigateTo('/orders')"
                ></IconsUser
                >Мой профиль
              </NuxtLink>
              <NuxtLink
                class="cursor-pointer link"
                @click="navigateTo('/profile/my/settings')"
              >
                <IconsSettings
                  class="cursor-pointer w-5"
                  @click="navigateTo('/orders')"
                ></IconsSettings
                >Личный кабинет
              </NuxtLink>
              <div class="bordered w-full h-px"></div>
            </div>
            <div class="flex flex-col gap-3">
              <NuxtLink
                class="cursor-pointer link"
                @click="navigateTo('/orders/my')"
              >
                <IconsOrders
                  class="cursor-pointer w-5"
                  @click="navigateTo('/orders')"
                ></IconsOrders>
                Мои заказы/отклики
              </NuxtLink>
              <NuxtLink
                class="cursor-pointer link"
                @click="navigateTo('/donates')"
              >
                <IconsBlocks
                  class="cursor-pointer w-5"
                  @click="navigateTo('/orders')"
                ></IconsBlocks
                >Донаты</NuxtLink
              >
              <div class="bordered w-full h-px"></div>
            </div>
            <div class="flex flex-col gap-3">
              <NuxtLink class="cursor-pointer link">
                <IconsMessages
                  class="cursor-pointer w-5"
                  @click="navigateTo('/orders')"
                ></IconsMessages
                >Обратная связь</NuxtLink
              >
              <NuxtLink class="cursor-pointer link" @click="modal = true">
                <IconsLogin
                  class="cursor-pointer w-5"
                  @click="navigateTo('/orders')"
                ></IconsLogin
                >Выход</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <UIDevModal v-if="modal" title="Подтверждение" @close="modal = false">
    <template #body>
      <p class="confirm" style="color: white">
        Вы уверены, что хотите выйти из своего аккаунта?
      </p>
    </template>
    <template #buttons>
      <UIDevButton @click.stop="modal = false">Отмена</UIDevButton>
      <UIDevButton type="active" @click.stop="userStore.logout()"
        >Выйти</UIDevButton
      >
    </template>
  </UIDevModal>
</template>

<script setup lang="ts">
import DevNavButton from "./DevNavButton.vue";
import DevButton from "./DevButton.vue";
import { useUserStore } from "~/store/userStore";
import { makeURL } from "~/shared/utils/helpers";

defineProps<{
  absolute?: boolean;
}>();

const userStore = useUserStore();

const showMenu = shallowRef(false);
const menuRef = ref<HTMLElement | null>(null);
const modal = shallowRef(false);

useClickOutside(menuRef, () => {
  showMenu.value = false;
});
</script>

<style lang="scss" scoped>
.nav {
  background: #2b2a2a;
  box-shadow: 0px 0px 9.7px 1px #1f1f1f5c;
}

.byte {
  color: $white;
  font-weight: 700;
  font-size: 26px;
}

.arrow {
  transform: rotate(0deg);
  transition: transform 0.2s ease;

  &.active {
    transform: rotate(-90deg);
  }
}

.menu {
  background: $tag-secondary-color;

  .menu_wrapper {
    background: $tag-secondary-color;
  }

  .bordered {
    background: #434348;
  }

  .link {
    color: $text-header;
    font-weight: 400;
    line-height: 16px;
    font-size: 14px;
    transition: color 0.1s ease-in;
    display: flex;
    align-items: center;
    gap: 8px;

    :deep(svg) {
      path {
        transition: stroke 0.1s ease-in;
        stroke: $text-header;
      }
    }

    &:hover {
      color: $select-enabled;

      :deep(svg) {
        path {
          stroke: $select-enabled;
        }
      }
    }
  }
}
</style>
