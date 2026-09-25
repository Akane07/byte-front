<template>
  <div
    class="nav flex items-center justify-center w-full h-20 px-15 py-0"
    :class="[absolute ? 'fixed z-1000 top-0' : '']"
  >
    <div class="w-full max-w-360 h-11 flex items-center justify-between z-1000">
      <NuxtLink to="/orders" class="flex items-center justify-center gap-2 cursor-pointer">
        <img src="/logo.svg" alt="logo" class="w-10" />
        <span class="byte text-center">FreelanceByte</span>
      </NuxtLink>
      <div
        v-if="!userStore.isAuth && userStore.checked"
        class="w-37.5 flex items-center gap-3 relative select-none"
      >
        <NuxtLink to="/auth/login">
          <UIButton>Войти</UIButton>
        </NuxtLink>
        <NuxtLink to="/auth/registration">
          <UINavButton>Регистрация</UINavButton>
        </NuxtLink>
      </div>
      <div
        v-else-if="userStore.checked"
        class="w-37.5 flex items-center gap-3 relative select-none"
      >
        <NuxtLink to="/orders" aria-label="Заказы">
          <IconsHome class="cursor-pointer" />
        </NuxtLink>
        <NuxtLink to="/chat" aria-label="Чаты">
          <IconsChat class="cursor-pointer" />
        </NuxtLink>
        <div
          class="flex items-center gap-3 relative select-none"
          @mouseenter="show"
          @mouseleave="hide"
        >
          <UIUserAvatar class="cursor-pointer" :src="makeURL(userStore.user?.avatar)" />
          <IconsArrow class="cursor-pointer arrow" :class="{ active: showMenu }" />
        </div>

        <div
          v-show="showMenu"
          ref="menuRef"
          class="menu w-60 absolute -right-5 top-13.5 p-0.5 rounded-md z-100000"
          :class="[activeClass]"
          @mouseenter="show"
          @mouseleave="hide"
        >
          <div class="menu_wrapper w-full flex flex-col gap-3 rounded-md px-5 py-4">
            <div class="flex flex-col gap-3">
              <NuxtLink class="cursor-pointer link" to="/profile/my">
                <IconsUser class="w-5" />Мой профиль
              </NuxtLink>
              <NuxtLink class="cursor-pointer link" to="/profile/my/settings">
                <IconsSettings class="w-5" />Личный кабинет
              </NuxtLink>
              <div class="bordered w-full h-px"></div>
            </div>
            <div class="flex flex-col gap-3">
              <NuxtLink class="cursor-pointer link" to="/orders/my">
                <IconsOrders class="w-5" />Мои заказы/отклики
              </NuxtLink>
              <NuxtLink class="cursor-pointer link" to="/donates">
                <IconsBlocks class="w-5" />Донаты
              </NuxtLink>
              <div class="bordered w-full h-px"></div>
            </div>
            <div class="flex flex-col gap-3">
              <button type="button" class="cursor-pointer link" @click="modal = true">
                <IconsLogin class="w-5" />Выход
              </button>
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
      <UIButton type="active" @click.stop="userStore.logout()">Выйти</UIButton>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { makeURL } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";

defineProps<{
  absolute?: boolean;
}>();

const userStore = useUserStore();

const modal = shallowRef(false);
const menuRef = ref<HTMLElement | null>(null);
const showMenu = shallowRef(false);
const activeClass = shallowRef<"show" | "hide" | null>(null);
let hideTimer: ReturnType<typeof setTimeout> | undefined;
let classTimer: ReturnType<typeof setTimeout> | undefined;

function clearTimers() {
  clearTimeout(hideTimer);
  clearTimeout(classTimer);
}

function show() {
  clearTimers();
  activeClass.value = "show";
  showMenu.value = true;
}

function hide() {
  classTimer = setTimeout(() => {
    activeClass.value = "hide";
  }, 300);
  hideTimer = setTimeout(() => {
    showMenu.value = false;
    activeClass.value = null;
  }, 600);
}

/** Закрыть меню, если вкладку свернули, пока оно было открыто. */
function handleVisibilityChange() {
  if (document.hidden && showMenu.value) {
    clearTimers();
    showMenu.value = false;
    activeClass.value = null;
  }
}

onMounted(() => document.addEventListener("visibilitychange", handleVisibilityChange));
onBeforeUnmount(() => {
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  clearTimers();
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
    background: none;
    border: none;
    padding: 0;
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
