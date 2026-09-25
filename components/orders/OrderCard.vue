<template>
  <div
    class="order_card w-full flex gap-5 cursor-pointer rounded-lg"
    @click="$emit('showOrder', order)"
  >
    <div
      class="order flex flex-col gap-4 w-full py-4 px-8"
      :class="{ viewed: viewed }"
    >
      <p>{{ order.title }}</p>
      <span class="mb-1">{{
        useSliceDescription(order.description, 175)
      }}</span>
      <div class="flex flex-wrap gap-2">
        <LazyUIChip
          v-for="skill in order.skills.slice(0, 5)"
          :key="skill"
          :text="skill"
          :hover="false"
        ></LazyUIChip>
        <LazyUIChip v-if="order.skills.length > 5" :hover="false"
          >+{{ order.skills.length - 5 }}</LazyUIChip
        >
      </div>
      <div class="flex items-end gap-4 text-white opacity-60 text-[14px]">
        <span v-if="order.category" class="border-r-[#9E9E9F] border-r pr-4 mr-4">{{ categoryStore.getCategoryTitleById(order.category) }}</span>
        <span>Опубликовано {{ useOrderCreated(order.created_at) }}</span>
      </div>
    </div>
    <div class="info-block flex flex-col justify-between py-4 px-5">
      <div class="price flex flex-col gap-2">
        <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
        <div class="flex gap-1 items-center">
          <IconsClock />
          <span>{{
            useOrderDeadlines(order.deadlines, order.deadline_date)
          }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-[14px] flex flex-col justify-end">Предложений: {{ order.response_count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from "~/shared/api/order-api";
import { useCategory } from "~/store/categoryStore";
import { useUserStore } from "~/store/userStore";

const props = defineProps<{
  order: Order;
}>();

defineEmits<{
  (e: "showOrder", order: Order): void;
}>();

const userStore = useUserStore();
const categoryStore = useCategory();

const viewed = computed(() => {
  return props.order.viewed_by.includes(userStore.user?.id || "");
});
</script>

<style lang="scss" scoped>
.order_card {
  background: $bg-secondary;
  box-shadow: 1px 1px 0px 0px #00000029;

  .order {
    p {
      font-weight: 600;
      font-size: 20px;
      color: $primary;
      transition: color 0.3s ease-in-out;
    }

    & > span {
      color: $white;
      height: 40px;
    }

    &:hover {
      p {
        color: $white;
      }
    }

    &.viewed {
      p {
        color: $white;
      }
    }
  }

  .info-block {
    border-left: 1px solid $border-color;
    color: $white;
    width: 280px;

    .info {
      font-size: 12px;
      line-height: 12px;
    }

    .price {
      p {
        font-weight: 600;
        font-size: 20px;
        color: $primary;
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
