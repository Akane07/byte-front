<template>
  <UIDevCustomModal @close="$emit('close')">
    <div class="accept_modal w-full max-w-[600px] h-full p-8 rounded-[20px]">
      <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
      <div class="main_info flex flex-col gap-6 pb-4 mt-4">
        <p>{{ order?.title }}</p>
        <div class="stats_info flex items-center gap-3">
          <UIUserAvatar
            @click="navigateTo(`/profile/${order.user_id}`)"
            :src="makeURL(userStore.user?.avatar)"
          >
          </UIUserAvatar>
          <span class="bordered pr-3"
            >Опубликовано {{ useOrderCreated(order.created_at) }}</span
          >
          <span>Предложений: {{ order.response_count }}</span>
        </div>
      </div>
      <div class="description">
        <p>{{ order.description }}</p>
      </div>
      <div class="type">
        <p>Тип проекта: {{ useOrderType(order.type) }}</p>
      </div>
      <div class="preferences flex gap-4">
        <div class="flex items-center gap-3">
          <IconsCalendar
            style="min-width: 40px; min-height: 40px"
          ></IconsCalendar>
          <div class="text flex flex-col gap-1">
            <p>{{ useOrderDeadlines(order.deadlines, order.deadline_date) }}</p>
            <span>Продолжительность проекта</span>
          </div>
        </div>
        <div class="flex items-center gap-3" v-if="order.for_experts">
          <IconsExpert style="min-width: 40px; min-height: 40px"></IconsExpert>
          <div class="text flex flex-col gap-1">
            <p>Для экспертов</p>
            <span
              >Я готов платить более высокую ставку опытным фрилансерам.</span
            >
          </div>
        </div>
      </div>
      <div class="skills flex flex-col gap-4">
        <p>Навыки и экспертный опыт</p>
        <div class="flex flex-wrap gap-2">
          <LazyUIDevChip v-for="skill in order.skills" :key="skill">{{
            skill
          }}</LazyUIDevChip>
        </div>
      </div>
      <div class="flex gap-3 items-center justify-center mt-6">
        <button class="view" @click="$emit('accept')">Принять</button>
        <button class="delete" @click="$emit('reject')">Отклонить</button>
      </div>
    </div>
  </UIDevCustomModal>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";
import { makeURL } from "~/shared/utils/helpers";

defineProps<{
  order: Order;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "accept"): void;
  (e: "reject"): void;
}>();

const userStore = inject("userStore");
</script>

<style lang="scss" scoped>
.accept_modal {
  border-right: 1px solid $border-color;
  background: $bg-brand;
  box-shadow: 0px 0px 15px 0px $shadow;
  color: $white;

  & > p {
    font-weight: 600;
    font-size: 18px;
    color: $active;
  }

  .main_info {
    border-bottom: 1px solid $border-color;

    p {
      color: $white;
      font-weight: 600;
      font-size: 18px;
    }

    .stats_info {
      font-size: 12px;
      color: $text-secondary;

      .bordered {
        border-right: 1px solid $border-color;
      }
    }
  }

  .description,
  .type,
  .preferences,
  .skills {
    font-size: 14px;
    padding: 24px 12px 24px 0;
    border-bottom: 1px solid $border-color;
  }

  .text {
    p {
      font-weight: 600;
      font-size: 12px;
      white-space: nowrap;
    }

    span {
      font-weight: 500;
      font-size: 12px;
      color: $text-secondary;
    }
  }

  .skills {
    p {
      font-weight: 500;
    }
  }
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
</style>
