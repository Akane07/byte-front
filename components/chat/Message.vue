<template>
  <LazyChatMessageTypesPlain
    v-if="!msg.is_suggest && !msg.responseId"
    :msg="msg"
  ></LazyChatMessageTypesPlain>
  <LazyChatMessageTypesSuggest
    v-else-if="msg.is_suggest"
    :msg="msg"
    :from="msg.senderId === userStore.user?.id ? 'sender' : 'receiver'"
    @delete-suggest="$emit('deleteSuggest', msg.id)"
    @reject-suggest="$emit('rejectResponse', msg.id)"
    @open-modal="$emit('openModal', msg.orderId ?? '', msg.id)"
  >
    <div class="deadlines">
      <p>
        Срок выполнения:
        <span>{{
          useOrderDeadlines(
            currentOrder?.deadlines,
            currentOrder?.deadline_date
          )
        }}</span>
      </p>
    </div>
    <div class="amount">
      <p>
        Сумма оплаты:
        <span>{{
          useOrderPrice(currentOrder?.price_type, currentOrder?.price)
        }}</span>
      </p>
    </div>
  </LazyChatMessageTypesSuggest>
  <LazyChatMessageTypesResponse
    v-else
    :msg="msg"
    :from="responseFrom"
    @accept-response="$emit('acceptResponse', msg.orderId ?? '', msg.id)"
    @delete-response="
      $emit('deleteResponse', msg.responseId ?? '', msg.orderId ?? '', msg.id)
    "
    @reject-response="$emit('rejectResponse', msg.id)"
  >
    <div class="deadlines">
      <p>
        Срок выполнения:
        <span>{{
          useOrderDeadlines(
            currentOrder?.deadlines,
            currentOrder?.deadline_date
          )
        }}</span>
      </p>
    </div>
    <div class="amount">
      <p>
        Сумма оплаты:
        <span>{{
          useOrderPrice(currentOrder?.price_type, currentOrder?.price)
        }}</span>
      </p>
    </div>
  </LazyChatMessageTypesResponse>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";
import type { Message } from "~/shared/types";
import { useUserStore } from "~/store/userStore";

const props = defineProps<{
  msg: Message;
}>();

defineEmits<{
  (
    e: "deleteResponse",
    responseId: string,
    orderId: string,
    msgId: string
  ): void;
  (e: "rejectResponse", id: string): void;
  (e: "acceptResponse", orderId: string, msgId: string): void;
  (e: "deleteSuggest", id: string): void;
  (e: "openModal", orderId: string, suggestId: string): void;
}>();

const userStore = useUserStore();
const ordersInChat = inject<Ref<Order[]>>("ordersInChat", ref([]));

const currentOrder = computed(() => {
  return ordersInChat.value.find((order) => order.id === props.msg.orderId);
});

provide("currentOrder", currentOrder);

// Отклик — сообщение с responseId. Статус после ответа меняется на
// accepted/rejected, поэтому определять тип по status === "response" нельзя:
// раньше из-за этого принятый отклик пропадал из переписки.
const responseFrom = computed(() =>
  props.msg.senderId === userStore.user?.id ? "sender" : "receiver",
);
</script>

<style lang="scss">
.chat_message {
  color: $text-placeholder !important;

  &.message {
    background: $primary;
    border-radius: 6px;
    padding: 8px 16px;
    max-width: 45%;
    color: $white !important;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &.suggest,
  &.response {
    width: 100%;
    max-width: 440px;
    padding: 22px 16px;
    background: #c6f6d51a;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;

    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 20px;
      border-bottom: 1px solid $bg-button-success;

      p {
        font-weight: 600;
        font-size: 16px;
        color: $bg-button-success;
      }
    }

    .description {
      width: 100%;
      padding-bottom: 20px;
      border-bottom: 1px solid rgb(255, 255, 255, 0.4);
      overflow: hidden;

      p {
        font-size: 14px;
        color: $white;
      }
    }

    .deadlines {
      overflow: hidden;
      padding-bottom: 20px;
      border-bottom: 1px solid rgb(255, 255, 255, 0.4);

      p {
        font-size: 14px;
        color: $white;

        span {
          font-weight: 600;
          font-size: 15px;
          color: $text-accent;
        }
      }
    }

    .amount {
      overflow: hidden;
      padding-bottom: 20px;
      border-bottom: 1px solid rgb(255, 255, 255, 0.4);

      p {
        font-size: 14px;
        color: $white;

        span {
          font-weight: 600;
          font-size: 15px;
          color: $primary;
        }
      }
    }

    .buttons {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;

      button {
        border: none;
        outline: none;
        border-radius: 6px;
        padding: 12px 28px;
        color: $white;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        max-width: 180px;

        &.delete {
          background: $text-red;
        }

        &.view {
          background: $select-enabled;
        }
      }
    }
  }
}
</style>
