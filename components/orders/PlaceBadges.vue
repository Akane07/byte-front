<template>
  <!-- Где выполняется заказ и срочность — видно сразу, ещё до описания. -->
  <div class="place-badges">
    <span v-if="urgent" class="badge urgent">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8l1-5.5z" /></svg>
      Срочно
    </span>
    <span v-if="format === 'onsite'" class="badge onsite">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 00-9 0c0 3.8 4.5 8 4.5 8z" />
        <circle cx="8" cy="6.5" r="1.6" />
      </svg>
      {{ city ? `На месте · ${city}` : "На месте" }}
    </span>
    <span v-else class="badge remote">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M1.5 8h13M8 1.5c1.8 1.8 2.6 4 2.6 6.5S9.8 12.7 8 14.5M8 1.5C6.2 3.3 5.4 5.5 5.4 8s.8 4.7 2.6 6.5" />
      </svg>
      Удалённо
    </span>
  </div>
</template>

<script setup lang="ts">
import type { WorkFormat } from "~/shared/api/order-api";

defineProps<{
  format?: WorkFormat;
  city?: string;
  urgent?: boolean;
}>();
</script>

<style scoped lang="scss">
.place-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: 13px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &.remote {
    background: rgba(99, 179, 237, 0.12);
    color: #90cdf4;
  }

  &.onsite {
    background: rgba(56, 161, 105, 0.14);
    color: #7fd9a6;
  }

  &.urgent {
    background: rgba(245, 120, 70, 0.16);
    color: #ffab85;

    svg {
      fill: currentColor;
      stroke: none;
    }
  }
}
</style>
