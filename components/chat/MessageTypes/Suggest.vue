<template>
  <template v-if="ordersInChat && user && userStore">
    <div class="chat_message suggest">
      <div class="header">
        <IconsSuggest></IconsSuggest>
        <p v-if="from === 'sender'">
          Предложение от {{ userStore.user?.nickname || user.name }}
        </p>
        <p v-else>Предложение от {{ user.nickname || user.name }}</p>
      </div>
      <div class="description">
        <p>
          {{ currentOrder?.description }}
        </p>
      </div>
      <slot></slot>
      <div class="buttons" v-if="notSelected">
        <button
          v-if="from === 'sender'"
          class="delete"
          @click="$emit('deleteSuggest')"
        >
          Отозвать
        </button>
        <template v-else>
          <button class="view" @click="$emit('openModal')">Просмотреть</button>
          <button class="delete" @click="$emit('rejectSuggest')">
            Отклонить
          </button>
        </template>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Message } from "~/shared/types";

const { msg } = defineProps<{
  msg: Message;
  from: "sender" | "receiver";
}>();

defineEmits<{
  (e: "deleteSuggest"): void;
  (e: "rejectSuggest"): void;
  (e: "openModal"): void;
}>();

const ordersInChat = inject<any[]>("ordersInChat");
const user = inject<any>("user");
const userStore = inject<any>("userStore");
const currentOrder = inject<any>("currentOrder");

const notSelected = computed(() => {
  return msg.status !== "rejected" && msg.status !== "accepted";
});
</script>
