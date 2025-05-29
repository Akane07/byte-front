<template>
    <div class="modal_wrapper" @click="$emit('close')">
        <div class="modal" @click.stop="">
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000000000;

    .modal {
    }
}
</style>