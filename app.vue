<template>
  <div>
    <NuxtPage />
  </div>
  <Notifications />
  <GuestPrompt />
</template>

<script setup lang="ts">
import { useChatStore } from "~/store/chatStore";
import { useOrderStore } from "~/store/orderStore";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();
const orderStore = useOrderStore();
const chatStore = useChatStore();

// Свои заказы нужны на нескольких страницах (предложить заказ, мои заказы),
// поэтому загружаются один раз после входа. Чат — тоже: непрочитанные
// и новые сообщения должны быть видны на любой странице.
watch(
  () => userStore.user?.id,
  (id, previous) => {
    if (previous && previous !== id) {
      chatStore.stop();
      disconnectChatSocket();
    }
    if (id) {
      orderStore.loadMyOrders(id);
      chatStore.start();
    }
  },
  { immediate: true },
);

// Непрочитанные — в заголовке вкладки: «(3) Freelance Byte».
// Геттер, а не объект: так заголовок пересчитывается при изменении счётчика.
useHead(() => {
  const unread = chatStore.totalUnread;
  return {
    titleTemplate: (title?: string) => {
      const base = title || "Freelance Byte";
      return unread ? `(${unread}) ${base}` : base;
    },
  };
});
</script>
