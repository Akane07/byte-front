<template>
  <!-- Типы сообщений подключены обычным образом, не Lazy: ленивые догружались
       после прокрутки вниз, и диалог открывался не на последних сообщениях. -->
  <ChatMessageTypesPlain
    v-if="!msg.is_suggest && !msg.responseId"
    :msg="msg"
  ></ChatMessageTypesPlain>
  <ChatMessageTypesSuggest
    v-else-if="msg.is_suggest"
    :msg="msg"
    :from="msg.senderId === userStore.user?.id ? 'sender' : 'receiver'"
    @delete-suggest="$emit('deleteSuggest', msg.id)"
    @reject-suggest="$emit('rejectResponse', msg.id)"
    @open-modal="$emit('openModal', msg.orderId ?? '', msg.id)"
  >
    <div class="facts">
      <div class="fact">
        <span>Срок</span>
        <b>{{ useOrderDeadlines(currentOrder?.deadlines, currentOrder?.deadline_date) || "—" }}</b>
      </div>
      <div class="fact">
        <span>Оплата</span>
        <b class="price">{{ useOrderPrice(currentOrder?.price_type, currentOrder?.price) || "—" }}</b>
      </div>
    </div>
  </ChatMessageTypesSuggest>
  <ChatMessageTypesResponse
    v-else
    :msg="msg"
    :from="responseFrom"
    @accept-response="$emit('acceptResponse', msg.orderId ?? '', msg.id)"
    @delete-response="
      $emit('deleteResponse', msg.responseId ?? '', msg.orderId ?? '', msg.id)
    "
    @reject-response="$emit('rejectResponse', msg.id)"
  >
    <div class="facts">
      <div class="fact">
        <span>Срок</span>
        <b>{{ useOrderDeadlines(currentOrder?.deadlines, currentOrder?.deadline_date) || "—" }}</b>
      </div>
      <div class="fact">
        <span>Оплата</span>
        <b class="price">{{ useOrderPrice(currentOrder?.price_type, currentOrder?.price) || "—" }}</b>
      </div>
    </div>
  </ChatMessageTypesResponse>
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
// Общие стили сообщений чата (без scoped: их используют Plain, Response, Suggest).

// --- Обычное сообщение: пузырь с «хвостиком» со стороны автора ---
.chat_message.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: min(520px, 60%);
  padding: 9px 14px 7px;
  border-radius: 18px 18px 18px 6px;
  background: #2f2f36;
  color: $text-main;
  font-size: 15px;
  line-height: 1.4;
  overflow-wrap: anywhere;

  @include tablet {
    max-width: 75%;
  }

  @include mobile {
    max-width: 85%;
  }

  p {
    white-space: pre-wrap;
  }

  img,
  video {
    display: block;
    max-width: 100%;
    width: 280px;
    height: auto;
    margin: 3px -8px 0;
    border-radius: 12px;
  }

  .time {
    align-self: flex-end;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
  }
}

// Свои сообщения — справа, фиолетовые, «хвостик» справа.
.message_wrapper.right .chat_message.message {
  border-radius: 18px 18px 6px 18px;
  background: linear-gradient(135deg, #8b5dff 0%, #7447f2 100%);
  color: $white;

  .time {
    color: rgba(255, 255, 255, 0.7);
  }
}

// Служебное сообщение («Предложение было принято…») — плашка по центру.
.server-note {
  max-width: 90%;
  padding: 6px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  text-align: center;
}

// --- Отклик и предложение: карточка ---
.chat_message.card {
  width: 100%;
  max-width: 420px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: #26262c;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: $text-main;

  .card-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(56, 161, 105, 0.16);
  }

  &.suggest .card-icon {
    background: rgba(131, 85, 250, 0.18);
  }

  .card-title {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;

    p {
      font-size: 15px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // Статус: ждёт ответа / принят / отклонён.
  .card-status {
    flex-shrink: 0;
    padding: 4px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    background: rgba(245, 180, 70, 0.14);
    color: #f3c46b;

    &.accepted {
      background: rgba(56, 161, 105, 0.16);
      color: #7fd9a6;
    }

    &.rejected {
      background: rgba(255, 255, 255, 0.07);
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .order-title {
    font-size: 15px;
    font-weight: 600;
    color: #c3adff;
    overflow-wrap: anywhere;
  }

  .card-text {
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.8);
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .facts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .fact {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);

    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.45);
    }

    b {
      font-size: 14px;
      font-weight: 600;
      color: $text-main;
    }

    .price {
      color: #c3adff;
    }
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    button {
      flex: 1;
      min-width: 120px;
      height: 40px;
      padding: 0 16px;
      border: 1px solid transparent;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition:
        background 0.15s ease,
        border-color 0.15s ease;

      &.view {
        background: $primary;
        color: $white;
      }

      &.delete {
        border-color: rgba(255, 105, 105, 0.35);
        background: transparent;
        color: #ff8a8a;
      }

      @media (hover: hover) {
        &.view:hover {
          background: $primary-hover;
        }

        &.delete:hover {
          background: rgba(255, 105, 105, 0.1);
        }
      }
    }
  }

  .time {
    align-self: flex-end;
    margin-top: -6px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>
