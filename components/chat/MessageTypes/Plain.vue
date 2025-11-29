<template>
  <div class="message" :class="[!isServer && 'chat_message']">
    <p>{{ msg.text }}</p>
    <img
      v-if="msg.mediaType === 'image' && !isServer"
      :src="msg.mediaUrl"
      width="200"
    />
    <video
      v-if="msg.mediaType === 'video' && !isServer"
      :src="msg.mediaUrl"
      width="200"
      controls
    />
    <span class="time" v-if="!isServer">{{
      parseMessageDate(msg.createdAt)
    }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "~/shared/types";
import { parseMessageDate } from "~/shared/utils/helpers";

const { msg } = defineProps<{
  msg: Message;
}>();

const isServer = computed (() => {
  return msg.status === 'server';
});
</script>
