<template>
  <button
    class="flex gap-2 cursor-pointer items-center justify-center whitespace-nowrap py-3 px-6"
    :class="active ? 'active' : 'dev'"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean;
  disabled?: boolean;
}>();
</script>

<style scoped lang="scss">
button {
  border-radius: 6px;
  color: $white;
  opacity: 1;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.9;
  }
}

.dev {
  border: 1px solid $white;
  background: transparent;
}

.active {
  border: none;
  background: $active;
}

button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}
</style>
