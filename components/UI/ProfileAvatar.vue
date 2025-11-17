<template>
    <div class="img_wrapper w-44 h-44 rounded-md p-0.5 relative">
        <img v-if="src?.includes('/uploads/avatars/')" :src="src" alt="avatar">
        <img v-else src="https://placehold.co/170x170" alt="avatar">
        <UIDevLoader class="image-loader" />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    src?: string
}>();
</script>

<style scoped lang="scss">
.img_wrapper {
    background: linear-gradient(180deg, #FD9697 0%, #8455F9 100%);

    img {
        border-radius: 6px;
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    .image-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
    }
}
</style>