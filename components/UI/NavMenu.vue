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
        <div
          class="flex items-center gap-3 relative select-none"
          @mouseenter="show"
          @mouseleave="hide"
        >
          <UIUserAvatar
            class="cursor-pointer"
            :src="makeURL(userStore.user?.avatar)"
          >
          </UIUserAvatar>
          <IconsArrow
            class="cursor-pointer arrow"
            :class="{ active: showMenu }"
          >
          </IconsArrow>
        </div>

        <div
          v-show="showMenu"
          ref="menuRef"
          class="menu w-60 absolute -right-5 top-13.5 p-0.5 rounded-md z-100000"
          :class="[activeClass]"
          @mouseenter="show"
          @mouseleave="hide"
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

  <UIModal v-if="modal" title="Подтверждение" @close="modal = false">
    <template #body>
      <p class="confirm" style="color: white">
        Вы уверены, что хотите выйти из своего аккаунта?
      </p>
    </template>
    <template #buttons>
      <UIButton @click.stop="modal = false">Отмена</UIButton>
      <UIButton type="active" @click.stop="userStore.logout()"
        >Выйти</UIButton
      >
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import DevNavButton from "./NavButton.vue";
import DevButton from "./Button.vue";
import { useUserStore } from "~/store/userStore";
import { makeURL } from "~/shared/utils/helpers";

defineProps<{
  absolute?: boolean;
}>();

const userStore = useUserStore();

const modal = shallowRef(false);
const menuRef = ref<HTMLElement | null>(null);
const showMenu = shallowRef(false);
const activeClass = shallowRef<"show" | "hide" | null>(null);
const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
const classTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

useClickOutside(menuRef, () => {
  showMenu.value = false;
});

function show() {
  timeout.value && clearTimeout(timeout.value);
  classTimeout.value && clearTimeout(classTimeout.value);
  activeClass.value = "show";
  showMenu.value = true;
}

function hide() {
  console.log("hide");

  classTimeout.value = setTimeout(() => {
    activeClass.value = "hide";
  }, 300);
  timeout.value = setTimeout(() => {
    showMenu.value = false;
    activeClass.value = null;
  }, 600);
}

/* Принудительное закрытие при переходе со страницы */
function handleVisibilityChange() {
  if (document.hidden && showMenu.value) {
    timeout.value && clearTimeout(timeout.value);
    classTimeout.value && clearTimeout(classTimeout.value);

    showMenu.value = false;
    activeClass.value = null;
  }
}

onMounted(() => {
  document.addEventListener("visibilitychange", handleVisibilityChange);
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
  opacity: 0;
  transition: opacity 0.3s ease-in;

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

  &.show {
    opacity: 1;
  }
}
</style>
