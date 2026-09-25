<template>
  <template v-if="ordersInChat && user && userStore">
    <div class="chat_message suggest">
      <div class="header">
        <IconsSuggest></IconsSuggest>
        <p v-if="from === 'sender'">
          Предложение от {{ userStore.user?.nickname || userStore.user?.name }}
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
import type { Order } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import type { Message } from "~/shared/types";
import { useUserStore } from "~/store/userStore";

const { msg } = defineProps<{
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

const notSelected = computed(() => {
  return msg.status !== "rejected" && msg.status !== "accepted";
});
</script>
