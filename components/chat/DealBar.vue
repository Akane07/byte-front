<template>
  <!-- Сделки с собеседником прямо в диалоге: статус и следующее действие.
       Раньше для этого нужно было уходить на отдельную страницу. -->
  <div v-if="orders.length" class="deals">
    <div v-for="order in visible" :key="order.id" class="deal">
      <span class="dot" :class="order.status"></span>
      <div class="deal-info">
        <NuxtLink :to="`/orders/${order.id}`" class="deal-title">{{ order.title }}</NuxtLink>
        <span>{{ roleLabel(order) }} · {{ statusLabel(order) }}</span>
      </div>
      <span class="price">{{ useOrderPrice(order.price_type, order.price) }}</span>
      <button
        v-if="order.performer === meId && order.status === 'pending'"
        type="button"
        class="deal-action"
        @click="$emit('submitWork', order)"
      >
        Сдать работу
      </button>
    </div>
    <button v-if="orders.length > LIMIT" type="button" class="more" @click="expanded = !expanded">
      {{ expanded ? "Свернуть" : `Ещё ${orders.length - LIMIT}` }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";

const LIMIT = 2;

const props = defineProps<{
  orders: Order[];
  meId?: string;
}>();

defineEmits<{
  (e: "submitWork", order: Order): void;
}>();

const expanded = shallowRef(false);
const visible = computed(() => (expanded.value ? props.orders : props.orders.slice(0, LIMIT)));

function roleLabel(order: Order) {
  return order.performer === props.meId ? "Вы исполнитель" : "Вы заказчик";
}

function statusLabel(order: Order) {
  const mineToCheck = order.status === "review" && order.user_id === props.meId;
  if (mineToCheck) return "ждёт вашей проверки";
  return order.status === "review" ? "на проверке" : "в работе";
}
</script>

<style scoped lang="scss">
.deals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 24px;
  border-bottom: 1px solid $chat-border;
  background: rgba(131, 85, 250, 0.04);

  @include mobile {
    padding: 8px 12px;
  }
}

.deal {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #63b3ed;

  &.review {
    background: #f3c46b;
  }
}

.deal-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
}

.deal-title {
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  color: $text-main;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      color: #c3adff;
    }
  }
}

.price {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #c3adff;

  @include small {
    display: none;
  }
}

.deal-action {
  flex-shrink: 0;
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background: $bg-button-success;
  color: $white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      filter: brightness(1.1);
    }
  }
}

.more {
  align-self: flex-start;
  padding: 0 0 0 20px;
  border: none;
  background: none;
  color: #c3adff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
</style>
