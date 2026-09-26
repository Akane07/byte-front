<template>
    <div class="img_wrapper w-44 h-44 rounded-md p-0.5 relative">
        <template v-if="showImage">
            <img :src="src" alt="avatar" @error="failed = true">
            <UILoader class="loader absolute top-[50%] left-[50%] z-0" />
        </template>
        <!-- Нет аватара — инициалы или силуэт вместо картинки «170x170» с placehold.co. -->
        <div v-else class="fallback" role="img" :aria-label="name || 'avatar'">
            <template v-if="initials">{{ initials }}</template>
            <IconsUser v-else class="icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { avatarInitials } from "~/shared/utils/helpers";

const props = defineProps<{
    src?: string;
    /** Имя — для инициалов, если аватара нет. */
    name?: string;
}>();

const failed = shallowRef(false);
watch(() => props.src, () => (failed.value = false));

const showImage = computed(() => !failed.value && !!props.src?.includes('/uploads/avatars/'));
const initials = computed(() => avatarInitials(props.name));
</script>

<style scoped lang="scss">
.img_wrapper {
    background: linear-gradient(180deg, #FD9697 0%, #8455F9 100%);

    img,
    .fallback {
        border-radius: 6px;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 1;
    }

    img {
        object-fit: cover;
    }

    .fallback {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #34343c 0%, #25252b 100%);
        color: $text-main;
        font-size: 56px;
        font-weight: 600;
        letter-spacing: 0.02em;
        user-select: none;

        .icon {
            width: 45%;
            height: 45%;
        }
    }

    .loader {
        transform: translate(-50%, -50%);
    }
}
</style>
