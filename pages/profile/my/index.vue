<template>
  <UIDevNavMenu></UIDevNavMenu>
  <UIBackground></UIBackground>

  <ProfileUser></ProfileUser>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>
