<template>
  <!-- Метка статуса. Раньше статусы («Активен», «Выполнен»…) были кнопками:
       реагировали на наведение и «дёргались» при нажатии, но ничего не делали. -->
  <span class="status" :class="tone">
    <span class="dot" aria-hidden="true"></span>
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** active — фиолетовый, success — зелёный, progress — голубой, muted — серый. */
    tone?: "active" | "success" | "progress" | "muted";
  }>(),
  { tone: "muted" },
);
</script>

<style scoped lang="scss">
.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 155px;
  padding: 11px 20px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: default;
  user-select: none;

  --bg: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.12);
  --text: #b5b5bd;
  --dot: #8a8a94;

  &.active {
    --bg: rgba(131, 85, 250, 0.14);
    --border: rgba(131, 85, 250, 0.4);
    --text: #c3adff;
    --dot: #8355fa;
  }

  &.success {
    --bg: rgba(56, 161, 105, 0.14);
    --border: rgba(56, 161, 105, 0.4);
    --text: #7fd9a6;
    --dot: #38a169;
  }

  &.progress {
    --bg: rgba(90, 160, 255, 0.12);
    --border: rgba(90, 160, 255, 0.38);
    --text: #9cc6ff;
    --dot: #5aa0ff;
  }
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dot);
  flex-shrink: 0;
}
</style>
