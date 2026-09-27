<template>
  <div
    class="select_wrapper flex gap-2 items-center cursor-pointer select-none"
    :class="{ selected: modelValue }"
    role="checkbox"
    :aria-checked="modelValue"
    tabindex="0"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
  >
    <div class="select flex items-center justify-center w-6 h-6 min-w-6 min-h-6 rounded-md">
      <div class="checked rounded-sm w-4.5 h-4.5"></div>
    </div>
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function toggle() {
  emit("update:modelValue", !props.modelValue);
}
</script>

<style lang="scss" scoped>
.select_wrapper {
  outline: none;

  .select {
    background: $border-color;
    transition: background 0.2s ease;

    // Отметка «впрыгивает»: масштаб + прозрачность, с лёгкой пружинкой.
    // Раньше анимировалась только прозрачность, а :hover на iPhone
    // «залипал» после нажатия — отметка сначала тускло мигала,
    // и выглядело это как задержка.
    .checked {
      background: $select-enabled;
      opacity: 0;
      transform: scale(0.3);
      transition:
        opacity 0.18s ease,
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  span {
    color: $text-secondary;
    font-size: 16px;
    transition: color 0.2s ease;
  }

  &.selected {
    .select .checked {
      opacity: 1;
      transform: scale(1);
    }

    span {
      color: $white;
    }
  }

  // Подсказка при наведении — только там, где есть мышь.
  @media (hover: hover) {
    &:not(.selected):hover .select .checked {
      opacity: 0.25;
      transform: scale(0.6);
    }

    &:hover span {
      color: $white;
    }
  }

  &:focus-visible .select {
    box-shadow: 0 0 0 2px rgba(131, 85, 250, 0.6);
  }
}
</style>
