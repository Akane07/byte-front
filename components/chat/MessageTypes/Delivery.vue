<template>
  <div class="chat_message card delivery">
    <div class="card-head">
      <div class="card-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.2 4.2L19 7" />
        </svg>
      </div>
      <div class="card-title">
        <p>Работа сдана</p>
        <span>{{ mine ? "Вы отправили на проверку" : `от ${partnerName}` }}</span>
      </div>
      <span class="card-status" :class="msg.status">{{ statusLabel }}</span>
    </div>
    <NuxtLink v-if="order" :to="`/orders/${order.id}`" class="order-title">{{ order.title }}</NuxtLink>
    <div v-if="msg.text" class="card-text">
      <ChatMessageText :text="msg.text" />
    </div>
    <slot></slot>
    <div v-if="pending && !mine" class="buttons">
      <button class="view" @click="actions.acceptDelivery(msg)">Принять работу</button>
      <button class="delete" @click="actions.rejectDelivery(msg)">На доработку</button>
    </div>
    <p v-else-if="pending" class="hint">Заказчик проверит результат и примет работу или вернёт её на доработку.</p>
    <span class="time">{{ parseMessageDate(msg.createdAt) }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import { CHAT_ACTIONS } from "~/shared/chat-actions";
import type { Message } from "~/shared/types";
import { parseMessageDate } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";

const { msg } = defineProps<{ msg: Message }>();

const userStore = useUserStore();
const actions = inject(CHAT_ACTIONS)!;
const partner = inject<Ref<User | null>>("user", ref(null));
const order = inject<Ref<Order | undefined>>("currentOrder", ref(undefined));

const mine = computed(() => msg.senderId === userStore.user?.id);
const pending = computed(() => msg.status !== "accepted" && msg.status !== "rejected");
const partnerName = computed(() => partner.value?.nickname || partner.value?.name || "Исполнитель");

// Карточку закрывает и отмена заказа — тогда это не «на доработке».
const statusLabel = computed(() => {
  if (msg.status === "accepted") return "Принята";
  if (msg.status === "rejected") return order.value?.status === "cancelled" ? "Заказ отменён" : "На доработке";
  return "На проверке";
});
</script>

<style scoped lang="scss">
.delivery {
  .card-icon {
    background: rgba(56, 161, 105, 0.18);

    svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: #7fd9a6;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  // «На доработке» — не провал, а следующий шаг: жёлтым, а не серым.
  .card-status.rejected {
    background: rgba(245, 180, 70, 0.14);
    color: #f3c46b;
  }

  .card-status:not(.accepted):not(.rejected) {
    background: rgba(99, 179, 237, 0.14);
    color: #90cdf4;
  }

  .order-title {
    text-decoration: none;

    @media (hover: hover) {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .hint {
    font-size: 13px;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
