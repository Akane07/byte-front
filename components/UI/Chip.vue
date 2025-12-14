<template>
  <div
    class="chip flex items-center gap-2 px-3.5 py-1.5 rounded-md"
    :class="{ 'non-hoverale': !hover }"
  >
    <slot>
      <span>{{ text }}</span>
    </slot>
    <IconsCross
      v-if="removable"
      style="transform: scale(0.8)"
      class="cursor-pointer"
      @click="$emit('delete')"
    ></IconsCross>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string;
    removable?: boolean;
    hover?: boolean;
  }>(),
  {
    hover: true,
  }
);
</script>

<style lang="scss" scoped>
.chip {
  font-size: 14px;
  background: $tag-color;
  color: $text-placeholder;
  transition: background 0.3s ease;

  &:hover {
    background: $tag-hover;
  }

  &.non-hoverale {
    color: $text-secondary;
    background: $tag-secondary-color;

    &:hover {
      background: $tag-secondary-color;
    }
  }
}
</style>
