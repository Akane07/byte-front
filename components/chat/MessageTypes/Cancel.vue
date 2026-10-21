<template>
  <div class="chat_message card cancel">
    <div class="card-head">
      <div class="card-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7l10 10M17 7L7 17" />
        </svg>
      </div>
      <div class="card-title">
        <p>Отмена заказа</p>
        <span>{{ mine ? "Вы предложили" : `от ${partnerName}` }}</span>
      </div>
      <span class="card-status" :class="msg.status">{{ statusLabel }}</span>
    </div>
    <NuxtLink v-if="order" :to="`/orders/${order.id}`" class="order-title">{{ order.title }}</NuxtLink>
    <div v-if="msg.text" class="card-text">
      <ChatMessageText :text="msg.text" />
    </div>
    <template v-if="pending">
      <div v-if="!mine" class="buttons">
        <button class="view" @click="actions.acceptCancel(msg)">Согласиться</button>
        <button class="delete" @click="actions.rejectCancel(msg)">Отклонить</button>
      </div>
      <template v-else>
        <p class="hint">
          {{
            overdue
              ? `Ответа нет больше ${days} — можно отменить заказ без согласия второй стороны.`
              : `Если ответа не будет ${days}, вы сможете отменить заказ сами.`
          }}
        </p>
        <div class="buttons">
          <button v-if="overdue" class="view force" @click="actions.forceCancel(msg)">Отменить без согласия</button>
          <button class="delete" @click="actions.remove(msg)">Отозвать</button>
        </div>
      </template>
    </template>
    <span class="time">{{ parseMessageDate(msg.createdAt) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import { CHAT_ACTIONS } from "~/shared/chat-actions";
import type { Message } from "~/shared/types";
import { parseMessageDate, plural } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";

/**
 * Сколько дней ждать ответа, прежде чем автор предложения может отменить
 * заказ сам. Как CANCEL_REPLY_DAYS на бэкенде — он и проверяет срок.
 */
const CANCEL_REPLY_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const { msg } = defineProps<{ msg: Message }>();

const userStore = useUserStore();
const actions = inject(CHAT_ACTIONS)!;
const partner = inject<Ref<User | null>>("user", ref(null));
const order = inject<Ref<Order | undefined>>("currentOrder", ref(undefined));

const mine = computed(() => msg.senderId === userStore.user?.id);
const pending = computed(() => msg.status !== "accepted" && msg.status !== "rejected");
const partnerName = computed(() => partner.value?.nickname || partner.value?.name || "собеседника");
const days = `${CANCEL_REPLY_DAYS} ${plural(CANCEL_REPLY_DAYS, "день", "дня", "дней")}`;
const overdue = computed(() => Date.now() - new Date(msg.createdAt).getTime() >= CANCEL_REPLY_DAYS * DAY_MS);

// Отклонено — либо второй стороной, либо потому, что работу успели принять.
const statusLabel = computed(() => {
  if (msg.status === "accepted") return "Заказ отменён";
  if (msg.status === "rejected") return order.value?.status === "completed" ? "Заказ выполнен" : "Отклонено";
  return "Ждёт ответа";
});
</script>

<style scoped lang="scss">
// .chat_message — чтобы перебить общие стили карточек из Message.vue.
.chat_message.cancel {
  .card-icon {
    background: rgba(255, 105, 105, 0.14);

    svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: #ff8a8a;
      stroke-width: 2.2;
      stroke-linecap: round;
    }
  }

  // Состоявшаяся отмена — не успех сделки: красным, а не зелёным.
  .card-status.accepted {
    background: rgba(255, 105, 105, 0.12);
    color: #ff8a8a;
  }

  .order-title {
    text-decoration: none;

    @media (hover: hover) {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  // Длинная подпись — отдельной строкой во всю ширину, «Отозвать» — под ней.
  .buttons .force {
    flex-basis: 100%;
  }

  .hint {
    font-size: 13px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
