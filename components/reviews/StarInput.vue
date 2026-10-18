<template>
  <!-- Выбор оценки: наведение показывает, что будет выбрано; стрелками
       тоже можно — это группа радиокнопок. -->
  <div class="star-input" role="radiogroup" aria-label="Оценка" @mouseleave="hovered = 0">
    <button
      v-for="i in 5"
      :key="i"
      type="button"
      role="radio"
      :aria-checked="model === i"
      :aria-label="LABELS[i - 1]"
      :class="{ on: i <= shown }"
      @mouseenter="hovered = i"
      @click="model = i"
      @keydown.right.prevent="model = Math.min(5, (model || 0) + 1)"
      @keydown.left.prevent="model = Math.max(1, (model || 2) - 1)"
    >
      <svg viewBox="0 0 20 20">
        <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
      </svg>
    </button>
    <span class="label">{{ shown ? LABELS[shown - 1] : "Выберите оценку" }}</span>
  </div>
</template>

<script setup lang="ts">
const LABELS = ["Ужасно", "Плохо", "Нормально", "Хорошо", "Отлично"];

const model = defineModel<number>({ required: true });
const hovered = shallowRef(0);
const shown = computed(() => hovered.value || model.value);
</script>

<style scoped lang="scss">
.star-input {
  display: flex;
  align-items: center;
  gap: 4px;

  button {
    display: flex;
    padding: 2px;
    border: none;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    transition: transform 0.1s ease;

    svg {
      width: 34px;
      height: 34px;
      fill: rgba(255, 255, 255, 0.14);
      transition: fill 0.1s ease;
    }

    &.on svg {
      fill: #f5b942;
    }

    &:active {
      transform: scale(0.92);
    }

    &:focus-visible {
      outline: 2px solid $primary;
    }
  }

  .label {
    margin-left: 10px;
    font-size: 15px;
    font-weight: 600;
    color: $text-secondary;
  }
}
</style>
