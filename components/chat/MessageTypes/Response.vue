<template>
  <template v-if="ordersInChat && responsesInChat && user && userStore">
    <div class="chat_message response">
      <div class="header">
        <IconsSuggest></IconsSuggest>
        <p>
          {{
            from === "sender"
              ? `Отклик от ${userStore.user?.nickname || user.name}`
              : `Отклик от ${user.nickname || user.name}`
          }}
        </p>
      </div>
      <div class="description">
        <p>
          {{
            responsesInChat.find((res) => res.id === msg.responseId)
              ?.description
          }}
        </p>
      </div>
      <slot></slot>
      <div class="buttons" v-if="notSelected && from === 'sender'">
        <button class="delete" @click="$emit('deleteResponse')">
          Удалить отклик
        </button>
      </div>
      <div class="buttons" v-else-if="notSelected && from === 'receiver'">
        <button class="view" @click="$emit('acceptResponse')">Принять</button>
        <button class="delete" @click="$emit('rejectResponse')">
          Отклонить
        </button>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Message } from "~/shared/types";

const { msg } = defineProps<{
  msg: Message;
  from: "sender" | "receiver" | null;
}>();

defineEmits<{
  (e: "deleteResponse"): void;
  (e: "acceptResponse"): void;
  (e: "rejectResponse"): void;
}>();

const ordersInChat = inject<any>("ordersInChat");
const responsesInChat = inject<any[]>("responsesInChat");
const user = inject<any>("user");
const userStore = inject<any>("userStore");

const notSelected = computed(() => {
  return msg.status !== "rejected" && msg.status !== "accepted";
});
</script>
