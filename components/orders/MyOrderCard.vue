<template>
  <div class="order_card">
    <div class="order_info">
      <div class="text_info">
        <p>{{ order.title }}</p>
        <span>{{ useSliceDescription(order.description) }}</span>
      </div>
      <div class="tags">
        <span v-for="skill in order.skills" :key="skill">{{ skill }}</span>
      </div>
      <div class="stats_info">
        <UIUserAvatar
          style="cursor: pointer"
          @click="navigateTo(`/profile/${order.user_id}`)"
          :src="baseURL + userStore.user?.avatar"
        ></UIUserAvatar>
        <span class="bordered"
          >Опубликовано {{ useOrderCreated(order.created_at) }}</span
        >
        <span class="bordered">Предложений {{ order.response_count }}</span>
        <button
          class="bordered edit"
          @click="navigateTo(`/orders/${order.id}/edit`)"
          v-if="!plain"
        >
          Редактировать
        </button>
        <button
          class="bordered delete"
          @click.stop="modal = true"
          v-if="!plain"
        >
          Удалить заказ
        </button>
      </div>
    </div>
    <div class="order_actions">
      <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
      <UIDevButton
        v-if="plain"
        active
        @click="$emit('suggest', order.id)"
        >Предложить</UIDevButton
      >
      <UIDevButton
        v-else-if="!order.is_active"
       
        style="min-width: 155px"
        >В архиве</UIDevButton
      >
      <UIDevButton
        v-else-if="order.is_active && !order.performer"
        active
        style="min-width: 155px"
        >Активен</UIDevButton
      >
      <UIDevButton
        v-else-if="order.is_active && order.performer"
        active
        style="min-width: 155px"
        >Есть исполнитель</UIDevButton
      >
    </div>
  </div>

  <UIDevModal v-if="modal" title="Подтверждение" @close="modal = false">
    <template #body>
      <p class="confirm">
        Вы уверены, что хотите удалить свой заказ? Отменить это действие будет
        невозможно.
      </p>
    </template>
    <template #buttons>
      <UIDevButton @click.stop="modal = false"
        >Отмена</UIDevButton
      >
      <UIDevButton active @click.stop="handleDelete"
        >Удалить</UIDevButton
      >
    </template>
  </UIDevModal>
</template>

<script setup lang="ts">
import { baseURL } from "~/api";
import { deleteOrder, type Order } from "~/api/order-api";
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

async function handleDelete() {
  const res = await deleteOrder(props.order.id);

  if (res) {
    emit("updateOrders");
    notifications.setNotification("Заказ успешно удален");
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
      color: $active;
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

      p {
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
        height: 100%;
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
          color: #dd6b20;
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
        p {
          color: white;
        }
      }
    }

    .order_actions {
      p {
        color: white;
      }
    }
  }

  &.viewed {
    .order_info {
      .text_info {
        p {
          color: white;
        }
      }
    }

    .order_actions {
      p {
        color: white;
      }
    }
  }
}

.confirm {
  max-width: 400px;
}
</style>
