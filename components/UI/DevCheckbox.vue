<template>
  <div
    class="select_wrapper flex gap-2 items-center cursor-pointer select-none"
    :class="{ selected: modelValue }"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div class="select flex items-center justify-center cursor-pointer w-6 h-6 min-w-6 min-h-6 rounded-md">
      <div class="checked cursor-pointer rounded-sm w-4 h-4"></div>
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

    .checked {
      background: $select-enabled;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;

      &:hover {
        opacity: 0.2;
      }
    }
  }

  span {
    color: $text-secondary;
    font-size: 16px;
  }

  &.selected {
    .select {
      .checked {
        opacity: 1;
      }
    }

    span {
      color: $white;
    }
  }
}
</style>
