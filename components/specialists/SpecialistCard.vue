<template>
  <article class="specialist" @click="navigateTo(`/profile/${user.id}`)">
    <div class="head">
      <div class="avatar" :class="{ online }">
        <UIUserAvatar :src="makeURL(user.avatar)" :name="user.name" size="56px" />
      </div>
      <div class="who">
        <p class="name">{{ user.nickname || user.name }}</p>
        <span class="speciality">{{ user.speciality || "Исполнитель" }}</span>
        <span class="meta">
          <template v-if="user.reviews_count">
            ★ {{ user.rating }} · {{ user.reviews_count }} {{ plural(user.reviews_count, "отзыв", "отзыва", "отзывов") }}
          </template>
          <template v-else>Пока без отзывов</template>
        </span>
      </div>
      <span v-if="user.price_from" class="price">от {{ user.price_from.toLocaleString("ru-RU") }} ₽</span>
    </div>

    <div class="place">
      <span class="format" :class="user.work_format">{{ usePerformerFormat(user.work_format) }}</span>
      <span v-if="user.city">{{ user.city }}</span>
    </div>

    <p v-if="user.description" class="description">{{ useSliceDescription(user.description, 140) }}</p>

    <div v-if="tags.length" class="tags">
      <span v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>

    <div class="actions" @click.stop>
      <button type="button" class="primary" @click="suggest">Предложить заказ</button>
      <button type="button" @click="write">Написать</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { User } from "~/shared/api/user-api";
import { makeURL, plural } from "~/shared/utils/helpers";
import { useCategory } from "~/store/categoryStore";
import { useGuestStore } from "~/store/guestStore";

const props = defineProps<{
  user: User;
  online?: boolean;
}>();

const categoryStore = useCategory();
const guest = useGuestStore();

/** Сначала категории услуг, потом навыки — не больше пяти меток. */
const tags = computed(() =>
  [
    ...(props.user.categories ?? []).map((id) => categoryStore.getCategoryTitleById(id)),
    ...props.user.skills,
  ]
    .filter(Boolean)
    .slice(0, 5),
);

function suggest() {
  if (guest.requireAuth("предложить заказ")) navigateTo(`/orders/suggest?id=${props.user.id}`);
}

function write() {
  if (guest.requireAuth("написать исполнителю")) navigateTo(`/chat/${props.user.id}`);
}
</script>

<style scoped lang="scss">
.specialist {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  background: $bg-secondary;
  cursor: pointer;
  transition: border-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      border-color: rgba(131, 85, 250, 0.5);
    }
  }
}

.head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.avatar {
  position: relative;
  display: flex;

  &.online::after {
    content: "";
    position: absolute;
    right: 1px;
    bottom: 1px;
    width: 13px;
    height: 13px;
    border: 2px solid $bg-secondary;
    border-radius: 50%;
    background: #38d17a;
  }
}

.who {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;

  .name {
    overflow: hidden;
    font-size: 17px;
    font-weight: 600;
    color: $text-main;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .speciality {
    font-size: 14px;
    color: $text-secondary;
  }

  .meta {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
  }
}

.price {
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 700;
  color: #c3adff;
}

.place {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-secondary;

  .format {
    padding: 3px 10px;
    border-radius: 10px;
    background: rgba(99, 179, 237, 0.12);
    color: #90cdf4;
    font-weight: 600;
    font-size: 12px;

    &.onsite {
      background: rgba(56, 161, 105, 0.14);
      color: #7fd9a6;
    }

    &.both {
      background: rgba(131, 85, 250, 0.16);
      color: #c3adff;
    }
  }
}

.description {
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    padding: 5px 10px;
    border-radius: 6px;
    background: $tag-secondary-color;
    color: $text-secondary;
    font-size: 12px;
  }
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: auto;

  button {
    flex: 1;
    height: 38px;
    padding: 0 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: transparent;
    color: $text-main;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;

    &.primary {
      border-color: transparent;
      background: $primary;
      color: $white;
    }

    @media (hover: hover) {
      &:hover:not(.primary) {
        background: rgba(255, 255, 255, 0.05);
      }

      &.primary:hover {
        background: $primary-hover;
      }
    }
  }
}
</style>
