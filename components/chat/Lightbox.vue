<template>
  <!-- Картинка из чата на весь экран. Закрывается кликом, крестиком или Esc. -->
  <div class="lightbox" role="dialog" aria-label="Просмотр изображения" @click="$emit('close')">
    <img :src="src" alt="Изображение" @click.stop />
    <div class="tools" @click.stop>
      <a :href="src" target="_blank" rel="noopener noreferrer">Открыть оригинал</a>
      <button type="button" aria-label="Закрыть" @click="$emit('close')">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScroll } from "~/store/scrollStore";

defineProps<{ src: string }>();
const emit = defineEmits<{ (e: "close"): void }>();

const scroll = useScroll();

function onKey(event: KeyboardEvent) {
  if (event.key === "Escape") emit("close");
}

onMounted(() => {
  scroll.lock();
  window.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  scroll.unlock();
  window.removeEventListener("keydown", onKey);
});
</script>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 16px 16px;
  background: rgba(10, 10, 14, 0.92);
  cursor: zoom-out;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
    object-fit: contain;
    cursor: default;
  }
}

.tools {
  position: absolute;
  top: 12px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 16px;

  a {
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;
  }

  button {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: $white;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
  }
}
</style>
