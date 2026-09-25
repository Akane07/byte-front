<template>
  <div class="notification" :class="{ active: notiStore.visible }" role="status" aria-live="polite">
    <div class="bg">
      <IconsCloseSquare class="icon" @click="notiStore.hideNotification()" />
      <p>{{ notiStore.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from "~/store/notiStore";

const notiStore = useNotifications();
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  top: 40px;
  right: -100%;
  z-index: 10000;
  padding: 2px;
  border-radius: 6px;
  background: $bg-gradient;
  box-shadow: 0px 0px 15px 0px $shadow;
  transition: right 0.5s ease-in-out;

  &.active {
    right: 40px;
  }

  .bg {
    width: 100%;
    height: 100%;
    padding: 16px 24px;
    font-weight: 600;
    color: $white;
    border-radius: 6px;
    background: $tag-color;
  }

  .icon {
    position: absolute;
    top: -10px;
    left: -10px;
    cursor: pointer;
  }
}
</style>
