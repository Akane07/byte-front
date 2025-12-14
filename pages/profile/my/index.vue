<template>
  <UINavMenu></UINavMenu>
  <UIBackground></UIBackground>

  <ProfileUser></ProfileUser>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>
