<template>
  <button class="dev-button" :class="{ secondary: secondary, texture: texture }">
    <div v-if="stroke" class="stroke">
      <span>
        <slot></slot>
      </span>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  stroke?: boolean;
  secondary?: boolean;
  /** Фон — текстура из разводов сферы (кнопки главной страницы). */
  texture?: boolean;
}>();
</script>

<style scoped lang="scss">
.dev-button {
  padding: 2px;
  border: none;
  border-radius: 6px;
  background: $bg-button-gradient;
  color: $text-main;
  cursor: pointer;
  width: min-content;
  white-space: nowrap;
  font-weight: 600;
  display: flex;
  align-items: center;

  & > div {
    width: 100%;
    height: 100%;
    padding: 12px 28px;
    border-radius: 6px;
    cursor: pointer;
  }

  .stroke {
    background: $bg-brand;
    cursor: pointer;

    span {
      display: flex;
      align-items: center;
      background: $bg-button-gradient;
      color: transparent;
      background-clip: text;
      cursor: pointer;
    }
  }

  &.secondary {
    background: $text-placeholder;

    .stroke {
      span {
        background: $text-placeholder;
        color: transparent;
        background-clip: text;
        cursor: pointer;
      }
    }
  }
}

// Текстура — фрагмент той же картинки, что и сфера на главной: отдельный файл
// не нужен. Какой участок виден, задаёт --texture-position.
.dev-button.texture {
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background-color: #6a4fd6;
  background-image: url("/images/landing/sphere.webp");
  background-size: 260% auto;
  background-position: var(--texture-position, 35% 42%);
  box-shadow: 0 4px 24px rgba(131, 85, 250, 0.25);
  color: $white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  transition:
    background-position 0.6s ease,
    box-shadow 0.3s ease;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-position: var(--texture-position-hover, 45% 50%);
    box-shadow: 0 6px 28px rgba(131, 85, 250, 0.4);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}
</style>
