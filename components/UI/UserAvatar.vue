<template>
    <img v-if="src?.includes('/uploads/avatars/')" :src="src" alt="avatar" :style="{ width: size, height: size }">
    <img v-else src="https://placehold.co/40x40" alt="avatar" :style="{ width: size, height: size }">
</template>

<script setup lang="ts">
defineProps<{
    src?: string;
    size?: string;
}>();
</script>

<style scoped lang="scss">
img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>