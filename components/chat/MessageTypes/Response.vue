<template>
  <template v-if="ordersInChat && responsesInChat && user && userStore">
    <div class="chat_message card response">
      <div class="card-head">
        <div class="card-icon"><IconsSuggest /></div>
        <div class="card-title">
          <p>Отклик на заказ</p>
          <span>от {{ authorName }}</span>
        </div>
        <span class="card-status" :class="msg.status">{{ statusLabel }}</span>
      </div>
      <p v-if="currentOrder" class="order-title">{{ currentOrder.title }}</p>
      <p class="card-text">
        {{ responsesInChat.find((res) => res.id === msg.responseId)?.description }}
      </p>
      <slot></slot>
      <div class="buttons" v-if="notSelected && from === 'sender'">
        <button class="delete" @click="$emit('deleteResponse')">Удалить отклик</button>
      </div>
      <div class="buttons" v-else-if="notSelected && from === 'receiver'">
        <button class="view" @click="$emit('acceptResponse')">Принять</button>
        <button class="delete" @click="$emit('rejectResponse')">Отклонить</button>
      </div>
      <span class="time">{{ parseMessageDate(msg.createdAt) }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Order, OrderResponse } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import type { Message } from "~/shared/types";
import { parseMessageDate } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";

const { msg, from } = defineProps<{
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
const currentOrder = inject<Ref<Order | undefined>>("currentOrder", ref(undefined));
const userStore = useUserStore();

const notSelected = computed(() => msg.status !== "rejected" && msg.status !== "accepted");

const authorName = computed(() =>
  from === "sender"
    ? userStore.user?.nickname || userStore.user?.name
    : user.value?.nickname || user.value?.name,
);

const statusLabel = computed(() =>
  msg.status === "accepted" ? "Принят" : msg.status === "rejected" ? "Отклонён" : "Ожидает ответа",
);
</script>
