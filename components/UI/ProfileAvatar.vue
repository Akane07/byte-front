<template>
    <div class="img_wrapper">
        <!-- {{ src }} -->
        <img v-if="src?.includes('/uploads/avatars/')" :src="src" alt="avatar">
        <img v-else src="https://placehold.co/170x170" alt="avatar">
    </div>
</template>

<script setup lang="ts">
defineProps<{
    src?: string
}>();
</script>

<style scoped lang="scss">
.img_wrapper {
    width: 176px;
    height: 176px;
    border-radius: 6px;
    padding: 3px;
    background: linear-gradient(180deg, #FD9697 0%, #8455F9 100%);

    img {
        border-radius: 6px;
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
}
</style>