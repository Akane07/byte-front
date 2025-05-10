<template>
  <div>
    <NuxtPage />
  </div>
  <Notifications></Notifications>
</template>

<script setup lang="ts">
import "~/assets/styles/main.css";
import { setToken } from "./api";
import { useUserStore } from "./store/userStore";
import { useOrderStore } from '~/store/orderStore';

const userStore = useUserStore();
const orderStore = useOrderStore();

onMounted(async () => {
  await userStore.checkAuth();
  setToken();
  if (!userStore.user?.id) return;
  orderStore.myOrders = await orderStore.getUserOrders(userStore.user?.id);
})
</script>