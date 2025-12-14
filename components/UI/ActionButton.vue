<template>
  <div
    class="button w-9 h-9 flex items-center justify-center rounded-md cursor-pointer"
    @mouseenter="onHover"
    @mouseleave="onLeave"
  >
    <slot name="icon" :color="color"></slot>
  </div>
</template>

<script setup lang="ts">
const color = shallowRef("white"); // $primary: #8355FA;

function onHover() {
  color.value = "#8355FA";
}

function onLeave() {
  color.value = "white";
}
</script>

<style lang="scss" scoped>
.button {
  background: $tag-secondary-color;
}
</style>
