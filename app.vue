<template>
  <div>
    <NuxtPage />
  </div>
  <Notifications />
</template>

<script setup lang="ts">
import { useOrderStore } from "~/store/orderStore";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();
const orderStore = useOrderStore();

// Свои заказы нужны на нескольких страницах (предложить заказ, мои заказы),
// поэтому загружаются один раз после входа.
watch(
  () => userStore.user?.id,
  (id) => {
    if (id) orderStore.loadMyOrders(id);
  },
  { immediate: true },
);
</script>
