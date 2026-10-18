<template>
  <section class="reviews">
    <div class="top">
      <p class="title">Отзывы</p>
      <UISegmented v-if="summary" v-model="role" :options="tabs" />
    </div>

    <template v-if="summary">
      <ReviewsRatingSummary v-if="stats.count" :stats="stats" />
      <p v-if="role === 'performer' && summary.completedAsPerformer" class="completed">
        Выполнено заказов на площадке: {{ summary.completedAsPerformer }}
      </p>
      <p v-if="!stats.count" class="empty">
        {{ role === "performer" ? "Отзывов об исполнителе пока нет" : "Отзывов о заказчике пока нет" }}
      </p>

      <div class="list">
        <ReviewsReviewItem
          v-for="review in reviews"
          :key="review.id"
          :review="review"
          :can-reply="isOwn"
          @replied="review.reply = $event"
        />
      </div>
      <button v-if="page < totalPages" type="button" class="more" :disabled="loading" @click="loadMore">
        Показать ещё
      </button>
    </template>
  </section>
</template>

<script setup lang="ts">
import {
  getReviewSummary,
  getUserReviews,
  type ReviewRole,
  type ReviewSummary,
  type ReviewWithContext,
} from "~/shared/api/review-api";

const props = defineProps<{
  userId: string;
  /** Свой профиль — можно отвечать на отзывы. */
  isOwn?: boolean;
}>();

const summary = ref<ReviewSummary | null>(null);
const role = ref<ReviewRole>("performer");
const reviews = ref<ReviewWithContext[]>([]);
const page = shallowRef(1);
const totalPages = shallowRef(1);
const loading = shallowRef(false);

const stats = computed(() => summary.value![role.value]);
const tabs = computed(() => [
  { value: "performer" as const, label: `Как исполнитель · ${summary.value?.performer.count ?? 0}` },
  { value: "customer" as const, label: `Как заказчик · ${summary.value?.customer.count ?? 0}` },
]);

async function load(target: number) {
  loading.value = true;
  const res = await getUserReviews(props.userId, role.value, target);
  loading.value = false;
  if (!res) return;
  reviews.value = target === 1 ? res.reviews : [...reviews.value, ...res.reviews];
  page.value = res.currentPage;
  totalPages.value = res.totalPages;
}

const loadMore = () => load(page.value + 1);

watch(role, () => load(1));

watch(
  () => props.userId,
  async (id) => {
    summary.value = await getReviewSummary(id);
    // Отзывов как исполнителю нет, а как заказчику есть — сразу показываем их.
    role.value =
      summary.value && !summary.value.performer.count && summary.value.customer.count ? "customer" : "performer";
    await load(1);
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.reviews {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .title {
    font-weight: 500;
    font-size: 22px;
  }
}

.completed,
.empty {
  font-size: 14px;
  color: $text-placeholder;
}

.list {
  display: flex;
  flex-direction: column;
}

.more {
  align-self: center;
  padding: 10px 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: transparent;
  color: $text-main;
  font-weight: 600;
  cursor: pointer;
}
</style>
