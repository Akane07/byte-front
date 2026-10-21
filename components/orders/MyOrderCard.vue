<template>
  <div class="order_card">
    <div class="order_info">
      <div class="text_info">
        <OrdersPlaceBadges :format="order.work_format" :city="order.city" :urgent="order.urgent" />
        <!-- На странице заказа автор видит подборку исполнителей. -->
        <p v-if="plain">{{ order.title }}</p>
        <NuxtLink v-else :to="`/orders/${order.id}`" class="title">{{ order.title }}</NuxtLink>
        <span>{{ useSliceDescription(order.description) }}</span>
      </div>
      <div class="tags">
        <span v-for="skill in order.skills" :key="skill">{{ skill }}</span>
      </div>
      <div class="stats_info">
        <UIUserAvatar
          style="cursor: pointer"
          @click="navigateTo(`/profile/${order.user_id}`)"
          :src="makeURL(userStore.user?.avatar)"
          :name="userStore.user?.name"
        ></UIUserAvatar>
        <span class="bordered"
          >Опубликовано {{ useOrderCreated(order.created_at) }}</span
        >
        <span class="bordered">Предложений: {{ order.response_count }}</span>
        <button
          class="bordered edit"
          @click="navigateTo(`/orders/${order.id}/edit`)"
          v-if="!plain"
        >
          Редактировать
        </button>
        <button
          class="bordered delete"
          @click.stop="cancelModal = true"
          v-if="!plain && canCancel"
        >
          Отменить заказ
        </button>
        <!-- Заказ, у которого был исполнитель, остаётся в истории второй стороны. -->
        <button
          class="bordered delete"
          @click.stop="modal = true"
          v-if="!plain && !order.performer"
        >
          Удалить заказ
        </button>
      </div>
    </div>
    <div class="order_actions">
      <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
      <UIButton
        v-if="plain"
        type="active"
        @click="$emit('suggest', order.id)"
        >Предложить</UIButton
      >
      <UIStatusBadge v-else-if="order.status === 'cancelled'">Отменён</UIStatusBadge>
      <UIStatusBadge v-else-if="!order.is_active">В архиве</UIStatusBadge>
      <UIStatusBadge v-else-if="order.status === 'completed'" tone="success">Выполнен</UIStatusBadge>
      <UIStatusBadge v-else-if="order.status === 'review'" tone="progress">На проверке</UIStatusBadge>
      <UIStatusBadge v-else-if="order.performer" tone="progress">Есть исполнитель</UIStatusBadge>
      <UIStatusBadge v-else tone="active">Активен</UIStatusBadge>
    </div>
  </div>

  <UIModal v-if="modal" title="Подтверждение" @close="modal = false">
    <template #body>
      <p class="confirm">
        Вы уверены, что хотите удалить свой заказ? Отменить это действие будет
        невозможно.
      </p>
    </template>
    <template #buttons>
      <UIButton @click.stop="modal = false"
        >Отмена</UIButton
      >
      <UIButton type="active" @click.stop="handleDelete"
        >Удалить</UIButton
      >
    </template>
  </UIModal>

  <UIModal v-if="cancelModal" title="Отменить заказ?" @close="cancelModal = false">
    <template #body>
      <p class="confirm">
        Заказ уйдёт из ленты, откликнуться на него будет нельзя. Вернуть
        отменённый заказ нельзя — только создать новый.
      </p>
    </template>
    <template #buttons>
      <UIButton @click.stop="cancelModal = false">Назад</UIButton>
      <UIButton type="active" @click.stop="handleCancel">Отменить заказ</UIButton>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { cancelOrder, deleteOrder, type Order } from "~/shared/api/order-api";
import { makeURL } from "~/shared/utils/helpers";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

const props = defineProps<{
  order: Order;
  plain?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateOrders"): void;
  (e: "suggest", id: string): void;
}>();

const userStore = useUserStore();
const notifications = useNotifications();

const modal = shallowRef(false);
const cancelModal = shallowRef(false);

/** Сам автор отменяет заказ без исполнителя; с исполнителем — через чат. */
const canCancel = computed(() => props.order.status === "active" && !props.order.draft);

async function handleDelete() {
  const res = await deleteOrder(props.order.id);
  modal.value = false;

  if (res) {
    emit("updateOrders");
    notifications.setNotification("Заказ успешно удален");
  }
}

async function handleCancel() {
  const res = await cancelOrder(props.order.id);
  cancelModal.value = false;

  if (res) {
    emit("updateOrders");
    notifications.setNotification("Заказ отменён");
  }
}
</script>

<style lang="scss" scoped>
.order_card {
  width: 100%;
  padding: 16px 40px 16px 16px;
  border-radius: 8px;
  background: $bg-secondary;
  box-shadow: 1px 1px 0px 0px #00000029;
  display: flex;
  gap: 20px;
  cursor: pointer;

  .order_actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    border-left: 1px solid $border-color;
    padding-left: 40px;
    cursor: pointer;
    min-width: 200px;

    p {
      font-weight: 600;
      color: $primary;
      transition: color 0.3s ease-in-out;
      text-align: center;
    }
  }

  .order_info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    cursor: pointer;

    .text_info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid $border-color;
      cursor: pointer;

      p,
      .title {
        color: $select-enabled;
        font-weight: 600;
        font-size: 18px;
        transition: color 0.3s ease-in-out;
        cursor: pointer;
      }

      span {
        color: $text-main;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
      }
    }

    .stats_info {
      display: flex;
      gap: 12px;
      align-items: center;
      color: $text-placeholder;
      font-size: 12px;
      cursor: pointer;

      span {
        cursor: pointer;
        padding-right: 12px;
        // не height: 100% — при переносе ряда процент считался от высоты всего
        // ряда, и вторая строка («Удалить заказ») вылезала за карточку
        align-self: stretch;
        display: flex;
        align-items: center;

        &.bordered {
          border-right: 1px solid $border-color;
          padding-right: 12px;
        }
      }

      button {
        background: transparent;
        border: none;
        outline: none;
        border-right: 1px solid $border-color;
        padding: 6px 16px 6px 0;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;

        &.edit {
          color: $text-accent;
        }

        &.delete {
          color: $text-red;
          border: none;
        }
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0;

      span {
        background: $tag-secondary-color;
        color: $text-secondary;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 14px;
      }
    }
  }

  &:hover {
    .order_info {
      .text_info {
        p,
        .title {
          color: $white;
        }

        .title:hover {
          text-decoration: underline;
        }
      }
    }

    .order_actions {
      p {
        color: $white;
      }
    }
  }

  &.viewed {
    .order_info {
      .text_info {
        p {
          color: $white;
        }
      }
    }

    .order_actions {
      p {
        color: $white;
      }
    }
  }

  // Адаптив — последним, чтобы перекрыть десктопные правила выше.
  @include order-card-adaptive;
}

.confirm {
  max-width: 400px;
}
</style>
