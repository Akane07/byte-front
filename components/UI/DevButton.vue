<template>
  <button
    class="flex gap-2 cursor-pointer items-center justify-center whitespace-nowrap py-3 px-6"
    :class="[type, variant]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: "active" | "secondary" | "cancel" | "success";
    variant?: "solid" | "outline";
    disabled?: boolean;
  }>(),
  {
    type: "secondary",
    variant: "solid",
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

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.outline {
  background: transparent;

  &.secondary {
    border: none;
    background: transparent;
    color: $secondary;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $secondary;
    }

    &:active {
      color: $secondary;
      border: 1px solid $secondary;
    }
  }

  &.active {
    border: none;
    background: transparent;
    color: $primary;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $primary;
    }

    &:active {
      color: $primary-hover;
      border: 1px solid $primary-hover;
    }
  }

  &.cancel {
    border: none;
    background: transparent;
    color: $delete;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $delete;
    }

    &:active {
      color: $delete-hover;
      border: 1px solid $delete-hover;
    }
  }
}

.solid {
  &.secondary {
    border: 1px solid $secondary;
    background: transparent;

    &:hover {
      border: 1px solid $secondary;
      background: $secondary-hover;
    }

    &:active {
      background: transparent;
      border: 1px solid $secondary;
      color: $secondary;
    }
  }

  &.active {
    border: 1px solid $primary;
    background: $primary;

    &:hover {
      border: 1px solid $primary-hover;
      background: $primary-hover;
    }

    &:active {
      background: transparent;
      border: 1px solid $primary-active;
      color: $primary-active;
    }
  }

  &.cancel {
    border: none;
    background: $delete;

    &:hover {
      background: $delete-hover;
    }

    &:active {
      background: transparent;
      border: 1px solid $delete;
      color: $delete;
    }
  }
}

.success {
  background: $bg-button-success;
}
</style>
