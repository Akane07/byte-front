<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3 sm:gap-8">
    <p
      v-for="tab in tabs"
      :key="tab.value"
      class="tab"
      :class="{ active: active === tab.value }"
      @click="active = tab.value"
    >
      {{ tab.name }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { value: string; name: string }[];
}>();

const active = defineModel<string>("active");
</script>

<style lang="scss" scoped>
.tab {
  color: $text-link;
  font-weight: 600;
  transition: color 0.2s ease-in;
  cursor: pointer;

  &:hover {
    color: $select-enabled;
  }

  &.active {
    color: $select-enabled;
    border-bottom: 1px solid $select-enabled;
  }
}
</style>
