<template>
  <!-- Звёзды с дробным заполнением: 4.7 — четыре полных и почти полная пятая.
       Два слоя: серые звёзды и поверх золотые, обрезанные по ширине. -->
  <span class="stars" :style="{ '--size': `${size}px` }" role="img" :aria-label="`Оценка ${value} из 5`">
    <span class="layer empty">
      <svg v-for="i in 5" :key="i" viewBox="0 0 20 20"><path :d="STAR" /></svg>
    </span>
    <span class="layer full" :style="{ width: `${(Math.min(Math.max(value, 0), 5) / 5) * 100}%` }">
      <svg v-for="i in 5" :key="i" viewBox="0 0 20 20"><path :d="STAR" /></svg>
    </span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ value: number; size?: number }>(), { size: 16 });

const STAR = "M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z";
</script>

<style scoped lang="scss">
.stars {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  vertical-align: middle;
}

.layer {
  display: inline-flex;
  gap: calc(var(--size) * 0.12);
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    width: var(--size);
    height: var(--size);
  }

  &.empty svg {
    fill: rgba(255, 255, 255, 0.14);
  }

  &.full {
    position: absolute;
    inset: 0 auto 0 0;
    overflow: hidden;

    svg {
      fill: #f5b942;
    }
  }
}
</style>
