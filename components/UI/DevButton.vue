<template>
    <button :class='active === true ? "dev-button-active" : "dev-button"'>
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    active: boolean
}>()
</script>

<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

.dev-button {
    padding: 12px 28px;
    border: 1px solid #fff;
    border-radius: 5px;
    color: #ffffff;
    background: $transparent-button;
    cursor: pointer;
}

.dev-button-active {
    padding: 12px 28px;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    background: $active-button-color;
    cursor: pointer;
}
</style>