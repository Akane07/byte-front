<template>
  <UIModal v-if="item" :title="title" @close="close">
    <template #body>
      <div class="review-form">
        <div class="partner">
          <UIUserAvatar :src="makeURL(item.partner?.avatar)" :name="item.partner?.name" size="44px" />
          <div>
            <b>{{ partnerName }}</b>
            <span>Заказ «{{ item.order.title }}»</span>
          </div>
        </div>

        <ReviewsStarInput v-model="rating" />

        <UITextarea
          v-model="text"
          maxlength="2000"
          :placeholder="placeholder"
        />
        <p v-if="needsText" class="warn">При оценке 1–2 расскажите, что пошло не так — это поможет другим.</p>
        <p class="hint">
          Отзыв увидят все, когда {{ partnerName }} тоже оценит сотрудничество, или через 14 дней. До этого
          его не видит никто — так оценки остаются честными.
        </p>
      </div>
    </template>
    <template #buttons>
      <UIButton @click.stop="close">Позже</UIButton>
      <UIButton type="active" :disabled="!canSend || sending" @click.stop="send">Оставить отзыв</UIButton>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { makeURL } from "~/shared/utils/helpers";
import { useReviewStore } from "~/store/reviewStore";

/** Те же правила, что на сервере (review.service.ts). */
const LOW_RATING = 2;
const MIN_LOW_RATING_TEXT = 10;

const reviewStore = useReviewStore();

const rating = shallowRef(0);
const text = shallowRef("");
const sending = shallowRef(false);

const item = computed(() => reviewStore.target);
const partnerName = computed(() => item.value?.partner?.nickname || item.value?.partner?.name || "Собеседник");
const title = computed(() =>
  item.value?.role === "performer" ? "Оцените исполнителя" : "Оцените заказчика",
);
const placeholder = computed(() =>
  item.value?.role === "performer"
    ? "Как прошла работа: качество, сроки, общение"
    : "Каково было работать с заказчиком: ТЗ, ответы, оплата",
);
const needsText = computed(
  () => rating.value > 0 && rating.value <= LOW_RATING && text.value.trim().length < MIN_LOW_RATING_TEXT,
);
const canSend = computed(() => rating.value > 0 && !needsText.value);

// Новое окно — с чистой формой.
watch(item, () => {
  rating.value = 0;
  text.value = "";
});

function close() {
  reviewStore.target = null;
}

async function send() {
  sending.value = true;
  await reviewStore.submit(rating.value, text.value.trim());
  sending.value = false;
}
</script>

<style scoped lang="scss">
.review-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 480px;
  max-width: 100%;
  color: $text-main;
}

.partner {
  display: flex;
  align-items: center;
  gap: 12px;

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  b {
    font-weight: 600;
  }

  span {
    overflow: hidden;
    font-size: 13px;
    color: $text-placeholder;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.warn {
  margin-top: -8px;
  font-size: 13px;
  color: #f3c46b;
}

.hint {
  font-size: 12px;
  line-height: 1.5;
  color: $text-placeholder;
}
</style>
