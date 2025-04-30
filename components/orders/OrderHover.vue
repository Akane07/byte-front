<template>
    <div class="order_hover_wrapper" :class="{ 'active': order }" @click="$emit('closeOrder')">
        <div class="order_hover" :class="{ 'active': order }" @click.stop="">
            <div class="border"></div>
            <IconsWideArrow class="arrow" @click="$emit('closeOrder')"></IconsWideArrow>

            <div class="left_part">

            </div>
            <div class="right_part">

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '~/api/order-api';

const props = defineProps<{
    order: Order | null
}>();

defineEmits<{
    (e: "closeOrder"): void
}>();

watch(props, () => {

});
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.order_hover_wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.0);
    z-index: 10000;
    overflow: hidden;
    transition: all 0.4s ease-in-out;
    visibility: hidden;

    .order_hover {
        position: absolute;
        right: -635px;
        width: 100%;
        height: 100dvh;
        max-width: 630px;
        box-shadow: -7px 7px 12.9px 0px rgba(0, 0, 0, 0.25);
        background: radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(165, 239, 255, 0) 0%, rgba(110, 191, 244, 0) 77.08%, rgba(70, 144, 213, 0) 100%),
            linear-gradient(0deg, rgba(52, 49, 49, 0.2), rgba(52, 49, 49, 0.2));
        backdrop-filter: blur(25px);
        transition: right 0.4s ease-in-out;

        padding: 40px 16px 40px 40px;

        .border {
            width: 1px;
            background: white;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: radial-gradient(80.38% 222.5% at -13.75% -12.36%, #98F9FF 0%, rgba(255, 255, 255, 0) 100%),
                radial-gradient(80.69% 208.78% at 108.28% 112.58%, #EABFFF 0%, rgba(135, 38, 183, 0) 100%);
        }

        .arrow {
            position: absolute;
            top: 20px;
            left: 30px;
            cursor: pointer;
        }

        &.active {
            right: 0;
        }
    }

    &.active {
        visibility: visible;
        background: rgba(0, 0, 0, 0.42);
    }
}
</style>