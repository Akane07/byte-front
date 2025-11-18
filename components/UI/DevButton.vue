<template>
  <button
    class="flex gap-2 cursor-pointer items-center justify-center whitespace-nowrap py-3 px-6"
    :class="type"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "active" | "secondary" | "cancel";
    disabled?: boolean;
  }>(),
  {
    type: "secondary",
  }
);
</script>

<style scoped lang="scss">
button {
  outline: none;
  border-radius: 6px;
  color: $white;
  opacity: 1;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.9;
  }
}

.secondary {
  border: 1px solid $white;
  background: transparent;
}

.active {
  border: none;
  background: $active;
}

.cancel {
  border: none;
  background: transparent;
  color: $text-red;

  &:hover {
    background: $bg-button-delete;
  }
}

button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
