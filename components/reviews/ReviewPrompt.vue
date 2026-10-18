<template>
  <!-- Заказ завершён, а отзыва ещё нет — напоминаем там, где шло общение. -->
  <div v-if="items.length" class="prompt">
    <div v-for="item in items" :key="item.order.id" class="row">
      <ReviewsStars :value="5" :size="14" />
      <p>
        Заказ «{{ item.order.title }}» завершён — оцените
        {{ item.role === "performer" ? "исполнителя" : "заказчика" }}.
        <span>Осталось {{ daysLeft(item.deadline) }}</span>
      </p>
      <button type="button" @click="reviewStore.open(item)">Оставить отзыв</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PendingReview } from "~/shared/api/review-api";
import { plural } from "~/shared/utils/helpers";
import { useReviewStore } from "~/store/reviewStore";

defineProps<{ items: PendingReview[] }>();

const reviewStore = useReviewStore();

function daysLeft(deadline: string) {
  const days = Math.max(1, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000));
  return `${days} ${plural(days, "день", "дня", "дней")}`;
}
</script>

<style scoped lang="scss">
.prompt {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 24px;
  border-bottom: 1px solid $chat-border;
  background: rgba(245, 185, 66, 0.06);

  @include mobile {
    padding: 8px 12px;
  }
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;

  p {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    color: $text-main;

    span {
      margin-left: 4px;
      color: $text-placeholder;
    }
  }

  button {
    flex-shrink: 0;
    height: 32px;
    padding: 0 14px;
    border: none;
    border-radius: 8px;
    background: #f5b942;
    color: #1d1d22;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  @include small {
    > :first-child {
      display: none;
    }
  }
}
</style>
