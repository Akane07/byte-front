<template>
    <div class="modal_wrapper flex items-center justify-center w-full h-full fixed top-0 left-0 p-4"
        @click="$emit('close')">
        <div class="modal flex flex-col gap-5.5 rounded-md px-4 sm:px-6 py-4" @click.stop>
            <div class="header flex items-start justify-between gap-6 sm:gap-40">
                <p v-if="title">{{ title }}</p>
                <IconsCross class="cursor-pointer shrink-0 ml-auto" @click="$emit('close')"></IconsCross>
            </div>
            <div>
                <slot name="body"></slot>
            </div>
            <div class="buttons flex flex-wrap justify-end gap-4 mt-3">
                <slot name="buttons"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useScroll } from "~/store/scrollStore";

defineProps<{
  title?: string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const scroll = useScroll();
onMounted(scroll.lock);
onBeforeUnmount(scroll.unlock);
</script>

<style lang="scss" scoped>
.modal_wrapper {
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000000000;

    .modal {
        background: $tag-color;
        box-shadow: 0px 0px 10px 1px $shadow;
        max-width: min(600px, 100%);
        max-height: 100%;
        overflow-y: auto;

        @include small {
            .buttons > :deep(*) {
                flex: 1;
            }
        }


        .header {
            p {
                color: $white;
                font-weight: 600;
            }
        }
    }
}
</style>