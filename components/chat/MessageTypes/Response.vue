<template>
  <template v-if="ordersInChat && responsesInChat && user && userStore">
    <div class="chat_message response">
      <div class="header">
        <IconsSuggest></IconsSuggest>
        <p>
          {{
            from === "sender"
              ? `Отклик от ${userStore.user?.nickname || userStore.user?.name}`
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
import type { Order, OrderResponse } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import type { Message } from "~/shared/types";
import { useUserStore } from "~/store/userStore";

const { msg } = defineProps<{
  msg: Message;
  from: "sender" | "receiver";
}>();

defineEmits<{
  (e: "deleteResponse"): void;
  (e: "acceptResponse"): void;
  (e: "rejectResponse"): void;
}>();

const ordersInChat = inject<Ref<Order[]>>("ordersInChat");
const responsesInChat = inject<Ref<OrderResponse[]>>("responsesInChat", ref([]));
const user = inject<Ref<User | null>>("user", ref(null));
const userStore = useUserStore();

const notSelected = computed(() => {
  return msg.status !== "rejected" && msg.status !== "accepted";
});
</script>
