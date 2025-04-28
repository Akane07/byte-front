<template>
    <div class="select_wrapper" :class="{ 'selected': modelValue }" @click="$emit('update:modelValue', !modelValue)">
        <div class="select">
            <div class="checked"></div>
        </div>
        <span>
            <slot></slot>
        </span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean
}>();

defineEmits<{
    (e: 'update:modelValue', value: boolean): () => void
}>();
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.select_wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    user-select: none;

    .select {
        background: $select-disabled;
        border-radius: 5px;
        width: 24px;
        height: 24px;
        min-width: 24px;
        min-height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        .checked {
            width: 18px;
            height: 18px;
            border-radius: 2px;
            background: $select-enabled;
            display: none;
            cursor: pointer;
        }
    }

    span {
        cursor: pointer;
        color: $text-color-secondary;
        font-size: 16px;
    }

    &.selected {
        .select {
            .checked {
                display: block;
            }
        }

        span {
            color: white;
        }
    }
}
</style>