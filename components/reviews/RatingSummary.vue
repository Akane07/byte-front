<template>
  <!-- Средняя оценка и распределение по звёздам — как на маркетплейсах:
       по полоскам видно, «ровный» ли рейтинг или в нём есть провалы. -->
  <div class="summary">
    <div class="score">
      <b>{{ stats.count ? stats.average.toFixed(1).replace(".", ",") : "—" }}</b>
      <ReviewsStars :value="stats.average" :size="18" />
      <span>{{ stats.count }} {{ plural(stats.count, "отзыв", "отзыва", "отзывов") }}</span>
    </div>
    <div class="bars">
      <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="bar">
        <span class="star">{{ star }}</span>
        <div class="track">
          <div class="fill" :style="{ width: `${percent(star)}%` }"></div>
        </div>
        <span class="count">{{ stats.distribution[star] ?? 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RatingStats } from "~/shared/api/review-api";
import { plural } from "~/shared/utils/helpers";

const props = defineProps<{ stats: RatingStats }>();

function percent(star: number) {
  return props.stats.count ? ((props.stats.distribution[star] ?? 0) / props.stats.count) * 100 : 0;
}
</script>

<style scoped lang="scss">
.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px 40px;
}

.score {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  b {
    font-size: 40px;
    font-weight: 700;
    line-height: 1;
    color: $text-main;
  }

  span {
    font-size: 13px;
    color: $text-placeholder;
  }
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 220px;
  max-width: 360px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: $text-secondary;

  .star {
    width: 10px;
    text-align: right;
  }

  .track {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .fill {
    height: 100%;
    border-radius: 3px;
    background: #f5b942;
  }

  .count {
    width: 24px;
    color: $text-placeholder;
  }
}
</style>
