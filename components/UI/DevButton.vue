<template>
    <button :class='active === true ? "dev-button-active" : "dev-button"' :disabled="disabled">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    active: boolean,
    disabled?: boolean
}>()
</script>

<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

button {
    cursor: pointer;
    display: flex;
    gap: 8px;
    align-items: center;
    white-space: nowrap;
}

.dev-button {
    padding: 12px 28px;
    border: 1px solid #fff;
    border-radius: 5px;
    color: #ffffff;
    background: $transparent-button;
}

.dev-button-active {
    padding: 12px 28px;
    border: none;
    border-radius: 5px;
    color: #ffffff;
    background: $active-button-color;
}

button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}
</style>