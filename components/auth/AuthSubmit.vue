<template>
  <button type="submit" class="submit" :disabled="loading" :aria-busy="loading">
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ loading?: boolean }>();
</script>

<style scoped lang="scss">
.submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 47px;
  border: none;
  border-radius: 6px;
  background: $primary;
  color: $white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: $primary-hover;
  }

  &:active {
    background: $primary-active;
  }

  &:disabled {
    background: $primary;
    opacity: 0.75;
    cursor: default;
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: $white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
