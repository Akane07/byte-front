<template>
  <template v-if="ordersInChat && user && userStore">
    <div class="chat_message card suggest">
      <div class="card-head">
        <div class="card-icon"><IconsOrder /></div>
        <div class="card-title">
          <p>Предложение заказа</p>
          <span>от {{ authorName }}</span>
        </div>
        <span class="card-status" :class="msg.status">{{ statusLabel }}</span>
      </div>
      <p v-if="currentOrder" class="order-title">{{ currentOrder.title }}</p>
      <p v-if="currentOrder?.description" class="card-text">{{ currentOrder.description }}</p>
      <slot></slot>
      <div class="buttons" v-if="notSelected">
        <button v-if="from === 'sender'" class="delete" @click="$emit('deleteSuggest')">Отозвать</button>
        <template v-else>
          <button class="view" @click="$emit('openModal')">Просмотреть</button>
          <button class="delete" @click="$emit('rejectSuggest')">Отклонить</button>
        </template>
      </div>
      <span class="time">{{ parseMessageDate(msg.createdAt) }}</span>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import type { Message } from "~/shared/types";
import { parseMessageDate } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";

const { msg, from } = defineProps<{
  msg: Message;
  from: "sender" | "receiver";
}>();

defineEmits<{
  (e: "deleteSuggest"): void;
  (e: "rejectSuggest"): void;
  (e: "openModal"): void;
}>();

const ordersInChat = inject<Ref<Order[]>>("ordersInChat");
const user = inject<Ref<User | null>>("user", ref(null));
const userStore = useUserStore();
const currentOrder = inject<Ref<Order | undefined>>("currentOrder");

const notSelected = computed(() => msg.status !== "rejected" && msg.status !== "accepted");

const authorName = computed(() =>
  from === "sender"
    ? userStore.user?.nickname || userStore.user?.name
    : user.value?.nickname || user.value?.name,
);

const statusLabel = computed(() =>
  msg.status === "accepted" ? "Принято" : msg.status === "rejected" ? "Отклонено" : "Ожидает ответа",
);
</script>
