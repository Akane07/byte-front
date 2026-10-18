<template>
  <article class="review">
    <div class="head">
      <NuxtLink v-if="review.author" :to="`/profile/${review.author.id}`" class="author">
        <UIUserAvatar :src="makeURL(review.author.avatar)" :name="review.author.name" size="40px" />
        <div>
          <b>{{ review.author.nickname || review.author.name }}</b>
          <span>{{ useUserCreated(review.published_at ?? review.created_at) }}</span>
        </div>
      </NuxtLink>
      <ReviewsStars :value="review.rating" />
    </div>
    <NuxtLink :to="`/orders/${review.order.id}`" class="order">Заказ «{{ review.order.title }}»</NuxtLink>
    <p v-if="review.text" class="text">{{ review.text }}</p>

    <div v-if="review.reply" class="reply">
      <b>Ответ</b>
      <p>{{ review.reply.text }}</p>
    </div>
    <template v-else-if="canReply">
      <button v-if="!replying" type="button" class="reply-button" @click="replying = true">Ответить</button>
      <div v-else class="reply-form">
        <UITextarea v-model="replyText" maxlength="1000" placeholder="Ваш ответ увидят все, кто читает отзывы" />
        <div class="reply-actions">
          <UIButton @click="replying = false">Отмена</UIButton>
          <UIButton type="active" :disabled="!replyText.trim() || sending" @click="sendReply">Ответить</UIButton>
        </div>
      </div>
    </template>
  </article>
</template>

<script setup lang="ts">
import { replyToReview, type ReviewWithContext } from "~/shared/api/review-api";
import { makeURL } from "~/shared/utils/helpers";

const props = defineProps<{
  review: ReviewWithContext;
  /** Отзыв о текущем пользователе — можно ответить один раз. */
  canReply?: boolean;
}>();

const emit = defineEmits<{
  (e: "replied", reply: NonNullable<ReviewWithContext["reply"]>): void;
}>();

const replying = shallowRef(false);
const replyText = shallowRef("");
const sending = shallowRef(false);

async function sendReply() {
  sending.value = true;
  const res = await replyToReview(props.review.id, replyText.value.trim());
  sending.value = false;
  if (res?.reply) {
    // Пропс не меняем: список отзывов принадлежит родителю, он и обновит отзыв.
    emit("replied", res.reply);
    replying.value = false;
  }
}
</script>

<style scoped lang="scss">
.review {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  border-top: 1px solid $border-color;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  b {
    font-weight: 600;
    color: $text-main;
  }

  span {
    font-size: 12px;
    color: $text-placeholder;
  }
}

.order {
  font-size: 13px;
  color: #c3adff;
}

.text {
  font-size: 15px;
  line-height: 1.55;
  color: $text-main;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.reply {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 16px;
  padding: 10px 14px;
  border-left: 3px solid $primary;
  border-radius: 6px;
  background: rgba(131, 85, 250, 0.08);
  font-size: 14px;

  b {
    font-size: 12px;
    color: #c3adff;
  }

  p {
    line-height: 1.5;
    color: $text-secondary;
    white-space: pre-wrap;
  }
}

.reply-button {
  align-self: flex-start;
  padding: 0;
  border: none;
  background: none;
  color: #c3adff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
