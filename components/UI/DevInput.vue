<template>
    <div class="input">
        <input :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :disabled="disabled">
    </div>
</template>

<script setup lang="ts">
defineProps<{
    placeholder: string;
    modelValue: any;
    type: 'text' | 'password';
    disabled?: boolean;
}>();
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.input {
    width: 100%;
    border-radius: 6px;
    background: $tag-color;
    cursor: pointer;

    input {
        padding: 12px 16px;
        background: transparent;
        border: none;
        outline: none;
        color: $text-color-main;
        font-size: 16px;
        width: 100%;

        &::placeholder {
            color: $text-placeholder;
        }

        &:disabled {
            opacity: 0.8;
            cursor: not-allowed;
        }
    }
}
</style>