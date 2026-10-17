<template>
  <!-- Ссылки — тегом <a>, остальное — текстом. Без v-html: текст пишет
       пользователь, и разметка в нём выполнилась бы у собеседника. -->
  <p class="message-text">
    <template v-for="(part, i) in parts" :key="i">
      <a v-if="part.href" :href="part.href" target="_blank" rel="noopener noreferrer nofollow" @click.stop>{{
        part.text
      }}</a>
      <template v-else>{{ part.text }}</template>
    </template>
  </p>
</template>

<script setup lang="ts">
import { splitLinks } from "~/shared/utils/helpers";

const props = defineProps<{ text: string }>();

const parts = computed(() => splitLinks(props.text));
</script>

<style scoped lang="scss">
.message-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: rgba(255, 255, 255, 0.5);

    @media (hover: hover) {
      &:hover {
        text-decoration-color: currentColor;
      }
    }
  }
}
</style>
