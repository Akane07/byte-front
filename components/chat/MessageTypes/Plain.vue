<template>
  <!-- Служебное сообщение — плашка по центру, остальные — пузыри. -->
  <div v-if="isServer" class="server-note">{{ msg.text }}</div>
  <div v-else class="message chat_message">
    <img v-if="msg.mediaType === 'image'" :src="makeURL(msg.mediaUrl)" alt="" />
    <video v-if="msg.mediaType === 'video'" :src="makeURL(msg.mediaUrl)" controls playsinline />
    <p v-if="msg.text">{{ msg.text }}</p>
    <span class="time">{{ parseMessageDate(msg.createdAt) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "~/shared/types";
import { makeURL, parseMessageDate } from "~/shared/utils/helpers";

const { msg } = defineProps<{
  msg: Message;
}>();

const isServer = computed(() => msg.status === "server");
</script>
