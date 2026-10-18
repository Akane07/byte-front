<template>
  <div>
    <NuxtPage />
  </div>
  <Notifications />
  <GuestPrompt />
  <!-- Окно отзыва открывается из чата, «Моих заказов» и профиля. -->
  <ReviewsReviewModal />
</template>

<script setup lang="ts">
import { useChatStore } from "~/store/chatStore";
import { useOrderStore } from "~/store/orderStore";
import { useReviewStore } from "~/store/reviewStore";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();
const orderStore = useOrderStore();
const chatStore = useChatStore();
const reviewStore = useReviewStore();

// Свои заказы нужны на нескольких страницах (предложить заказ, мои заказы),
// поэтому загружаются один раз после входа. Чат — тоже: непрочитанные
// и новые сообщения должны быть видны на любой странице.
watch(
  () => userStore.user?.id,
  (id, previous) => {
    if (previous && previous !== id) {
      chatStore.stop();
      disconnectChatSocket();
      reviewStore.pending = [];
    }
    if (id) {
      orderStore.loadMyOrders(id);
      chatStore.start();
      reviewStore.loadPending();
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
