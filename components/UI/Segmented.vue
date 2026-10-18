<template>
  <!-- Переключатель из нескольких вариантов: «Все / Удалённо / На месте». -->
  <div class="segmented" role="tablist">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="model === option.value"
      :class="{ active: model === option.value }"
      @click="model = option.value"
    >
      {{ option.label }}
      <span v-if="option.hint" class="hint">{{ option.hint }}</span>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
defineProps<{
  options: { value: T; label: string; hint?: string }[];
}>();

const model = defineModel<T>({ required: true });
</script>

<style scoped lang="scss">
.segmented {
  display: inline-flex;
  // В колонке flex-родителя не растягиваемся на всю ширину.
  align-self: flex-start;
  gap: 4px;
  max-width: 100%;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  overflow-x: auto;
  @include hidden-scrollbar;

  button {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    min-height: 38px;
    padding: 6px 16px;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    @media (hover: hover) {
      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.05);
        color: $white;
      }
    }

    &.active {
      background: $primary;
      color: $white;
    }
  }

  .hint {
    font-size: 11px;
    font-weight: 500;
    opacity: 0.7;
  }
}
</style>
