<template>
    <img v-if="showImage" :src="src" alt="avatar" :style="{ width: size, height: size }" @error="failed = true">
    <!-- Нет аватара — инициалы или силуэт. Раньше здесь грузилась картинка
         с placehold.co с надписью «40x40». -->
    <span v-else class="fallback" :style="{ width: size, height: size, fontSize: fontSize }" role="img"
        :aria-label="name || 'avatar'">
        <template v-if="initials">{{ initials }}</template>
        <IconsUser v-else class="icon" />
    </span>
</template>

<script setup lang="ts">
import { avatarInitials } from "~/shared/utils/helpers";

const props = defineProps<{
    src?: string;
    size?: string;
    /** Имя — для инициалов, если аватара нет. */
    name?: string;
}>();

// Файл аватара может не открыться (удалён с диска) — тогда тоже заглушка.
const failed = shallowRef(false);
watch(() => props.src, () => (failed.value = false));

const showImage = computed(() => !failed.value && !!props.src?.includes('/uploads/avatars/'));
const initials = computed(() => avatarInitials(props.name));
/** Размер букв — 40% от размера аватара. */
const fontSize = computed(() => `calc(${props.size ?? '40px'} * 0.4)`);
</script>

<style scoped lang="scss">
img,
.fallback {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
}

img {
    object-fit: cover;
}

.fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3b3b44 0%, #2a2a31 100%);
    color: $text-main;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.02em;
    user-select: none;

    .icon {
        width: 55%;
        height: 55%;
    }
}
</style>
