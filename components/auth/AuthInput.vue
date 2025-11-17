<template>
    <div class="input-wrapper">
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :type="type"
            class="auth-input" :placeholder="placeholder" />
        <span class="border border-left"></span>
        <span class="border border-top"></span>
        <span class="border border-bottom"></span>
        <span class="border border-right"></span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    type: string,
    placeholder: string,
    modelValue: string
}>();

defineEmits<{
    (e: 'update:modelValue', value: boolean): () => void
}>();
</script>

<style lang="scss" scoped>
$border-thickness: 1px;
$animation-duration: 0.2s;

.input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;

    .auth-input {
        position: relative;
        cursor: text;
        width: 100%;
        z-index: 1;
        padding: 12px 28px;
        font-size: 14px;
        letter-spacing: 0%;
        border-radius: 6px;
        background: $input-auth;
        border: none;
        outline: none;
        color: $white;
    }
}

.border {
    position: absolute;
    background-color: $white;
    pointer-events: none;
}

.border-left {
    left: -$border-thickness;
    top: -$border-thickness;
    bottom: -$border-thickness;
    width: $border-thickness;

    transform: scaleY(0);
    transform-origin: center;
    transition: transform $animation-duration ease;
}

.input-wrapper:focus-within .border-left {
    transform: scaleY(1);
    transition-delay: 0s;
}

.input-wrapper:not(:focus-within) .border-left {
    transform: scaleY(0);
    transition-delay: calc(2 * $animation-duration);
}

.border-top {
    top: -$border-thickness;
    left: -$border-thickness;
    right: -$border-thickness;
    height: $border-thickness;
    width: 0;
    transition: width $animation-duration ease;
}

.input-wrapper:focus-within .border-top {
    width: calc(100% + 2 * #{$border-thickness});
    transition-delay: $animation-duration;
}

.input-wrapper:not(:focus-within) .border-top {
    width: 0;
    transition-delay: $animation-duration;
}

.border-bottom {
    bottom: -$border-thickness;
    left: -$border-thickness;
    right: -$border-thickness;
    height: $border-thickness;
    width: 0;
    transition: width $animation-duration ease;
}

.input-wrapper:focus-within .border-bottom {
    width: calc(100% + 2 * #{$border-thickness});
    transition-delay: $animation-duration;
}

.input-wrapper:not(:focus-within) .border-bottom {
    width: 0;
    transition-delay: $animation-duration;
}

.border-right {
    right: -$border-thickness;
    top: -$border-thickness;
    bottom: -$border-thickness;
    width: $border-thickness;

    transform: scaleY(0);
    transform-origin: center;
    transition: transform $animation-duration ease;
}

.input-wrapper:focus-within .border-right {
    transform: scaleY(1);
    transition-delay: calc(2 * $animation-duration);
}

.input-wrapper:not(:focus-within) .border-right {
    transform: scaleY(0);
    transition-delay: 0s;
}
</style>