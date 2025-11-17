<template>
    <div class="modal_wrapper" @click="$emit('close')">
        <div class="modal" @click.stop="">
            <div class="header">
                <p v-if="title">{{ title }}</p>
                <IconsCross class="cross" @click="$emit('close')"></IconsCross>
            </div>
            <div class="body">
                <slot name="body"></slot>
            </div>
            <div class="buttons">
                <slot name="buttons"></slot>
            </div>
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
        background: $tag-color
        border-radius: 6px;
        padding: 22px;
        box-shadow: 0px 6px 15px 0px rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 22px;

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            p {
                color: white;
                font-weight: 600;
            }

            .cross {
                align-self: flex-end;
                margin-left: 140px;
                cursor: pointer;
            }
        }

        .buttons {
            margin-top: 12px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
    }
}
</style>