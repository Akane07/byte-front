<template>
  <div
    class="select_wrapper flex gap-2 items-center cursor-pointer select-none"
    :class="{ selected: modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="select flex items-center justify-center cursor-pointer">
      <div class="checked cursor-pointer"></div>
    </div>
    <span class="cursor-pointer">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): () => void;
}>();
</script>

<style lang="scss" scoped>
.select_wrapper {
  .select {
    background: $border-color;
    border-radius: 6px;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;

    .checked {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: $select-enabled;
      display: none;
    }
  }

  span {
    color: $text-secondary;
    font-size: 16px;
  }

  &.selected {
    .select {
      .checked {
        display: block;
      }
    }

    span {
      color: $white;
    }
  }
}
</style>
