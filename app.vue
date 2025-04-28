<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import "~/assets/styles/main.css";
import { setToken } from "./api";
import { useUserStore } from "./store/userStore";

const userStore = useUserStore();

onMounted(() => {
  userStore.checkAuth();
  setToken();
})
</script>
