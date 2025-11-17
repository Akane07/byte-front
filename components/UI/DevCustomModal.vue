<template>
    <div class="modal_wrapper flex items-center justify-center w-full h-full fixed top-0 left-0" @click="$emit('close')">
        <div @click.stop="">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useScroll } from '../../store/scrollStore';

defineProps<{
    title?: string;
}>();

defineEmits<{
    (e: 'close'): () => void
}>();

const scroll = useScroll();

scroll.showScroll = false;

onUnmounted(() => {
    scroll.showScroll = true;
});

onMounted(() => {
    scroll.showScroll = false;
})
</script>

<style lang="scss" scoped>
.modal_wrapper {
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000000000;
}
</style>