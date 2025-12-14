<template>
  <div
    class="order_hover_wrapper"
    :class="{ active: order }"
    @click="$emit('closeOrder')"
  >
    <div class="order_hover" :class="{ active: order }" @click.stop="">
      <div class="bordered"></div>
      <IconsWideArrow
        class="arrow"
        @click="$emit('closeOrder')"
      ></IconsWideArrow>

      <div class="left_part" v-if="order">
        <div class="main_info">
          <p>{{ order?.title }}</p>
          <div class="stats_info">
            <UIUserAvatar
              @click="navigateTo(`/profile/${order.user_id}`)"
              :src="makeURL(userStore.user?.avatar)"
            ></UIUserAvatar>
            <span class="bordered"
              >Опубликовано {{ useOrderCreated(order.created_at) }}</span
            >
            <span>Предложений: {{ order.response_count }}</span>
          </div>
        </div>
        <div class="description">
          <p>{{ useSliceDescription(order.description, 1000) }}</p>
        </div>
        <div class="type">
          <p>Тип проекта: {{ useOrderType(order.type) }}</p>
        </div>
        <div class="preferences">
          <div class="block">
            <IconsCalendar
              style="min-width: 30px; min-height: 30px"
            ></IconsCalendar>
            <div class="text">
              <p>
                {{ useOrderDeadlines(order.deadlines, order.deadline_date) }}
              </p>
              <span>Продолжительность проекта</span>
            </div>
          </div>
          <div class="block" v-if="order.for_experts">
            <IconsExpert
              style="min-width: 30px; min-height: 30px"
            ></IconsExpert>
            <div class="text">
              <p>Для экспертов</p>
              <span
                >Я готов платить более высокую ставку опытным фрилансерам.</span
              >
            </div>
          </div>
        </div>
        <div class="skills">
          <p>Навыки и экспертный опыт</p>
          <div class="tags">
            <span v-for="skill in order.skills" :key="skill">{{ skill }}</span>
          </div>
        </div>
        <p>{{ useUserCreated(order.created_at) }}</p>
      </div>
      <div class="right_part" v-if="order">
        <div class="price">
          <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
          <UIButton type="active" @click="handleOrderRedirect"
            >Откликнуться</UIButton
          >
        </div>
        <div class="about_client" v-if="user">
          <p>О клиенте</p>
          <div class="block">
            <p>Активные проекты</p>
            <span>{{ useUserProjects(user.orders_count) }}</span>
          </div>
          <div class="block">
            <p>В сети</p>
            <span>{{ useOrderCreated(user.last_seen) }}</span>
          </div>
          <div class="block">
            <p>Страна</p>
            <span>{{ user.country || "не указана" }}</span>
          </div>
          <div class="block">
            <span>Участник с {{ useUserCreated(user.created_at) }}</span>
          </div>
        </div>
        <div class="link">
          <p>Ссылка на заказ</p>
          <div class="link_block">
            <span>{{ `${frontURL}/orders/${props.order?.id}` }}</span>
            <div class="hidder"></div>
          </div>
          <span v-if="!showCopiedText" class="copy" @click="copyLink"
            >Скопировать ссылку</span
          >
          <span v-if="showCopiedText" class="copy">Ссылка скопирована!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { frontURL } from "~/shared/api";
import type { Order } from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import { makeURL } from "~/shared/utils/helpers";
import { useOrderStore } from "~/store/orderStore";
import { useScroll } from "~/store/scrollStore";
import { useUserStore } from "~/store/userStore";

const props = defineProps<{
  order: Order | null;
}>();

defineEmits<{
  (e: "closeOrder"): void;
}>();

const userStore = useUserStore();
const orderStore = useOrderStore();
const scroll = useScroll();

const user = ref<User | null>(null);
const showCopiedText = ref(false);

function copyLink() {
  navigator.clipboard.writeText(`${frontURL}/orders/${props.order?.id}`);
  showCopiedText.value = true;

  setTimeout(() => {
    showCopiedText.value = false;
  }, 3000);
}

function handleOrderRedirect() {
  navigateTo(`/orders/${props.order?.id}`);
}

watch(props, async () => {
  if (!props.order?.id) {
    scroll.showScroll = true;
  } else {
    scroll.showScroll = false;
  }

  if (
    !props.order?.user_id ||
    !userStore.user ||
    props.order.viewed_by.includes(userStore.user?.id)
  )
    return;
  user.value = await userStore.getUserId(props.order?.user_id);
  await orderStore.viewOrder(props.order.id);
  props.order.viewed_by.push(userStore.user?.id || "");
});
</script>

<style lang="scss" scoped>
.order_hover_wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 10000000000;
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  visibility: hidden;

  .order_hover {
    position: absolute;
    right: -755px;
    height: 100dvh;
    width: 100%;
    max-width: 750px;
    box-shadow: -7px 7px 12.9px 0px rgba(0, 0, 0, 0.25);
    background: radial-gradient(
        90.16% 143.01% at 15.32% 21.04%,
        rgba(165, 239, 255, 0) 0%,
        rgba(110, 191, 244, 0) 77.08%,
        rgba(70, 144, 213, 0) 100%
      ),
      linear-gradient(0deg, rgba(52, 49, 49, 0.2), rgba(52, 49, 49, 0.2));
    backdrop-filter: blur(25px);
    transition: right 0.4s ease-in-out;
    padding: 40px 16px 40px 40px;
    display: flex;

    & > .bordered {
      width: 1px;
      background: $white;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: radial-gradient(
          80.38% 222.5% at -13.75% -12.36%,
          #98f9ff 0%,
          rgba(255, 255, 255, 0) 100%
        ),
        radial-gradient(
          80.69% 208.78% at 108.28% 112.58%,
          #eabfff 0%,
          rgba(135, 38, 183, 0) 100%
        );
    }

    .arrow {
      position: absolute;
      top: 20px;
      left: 30px;
      cursor: pointer;
    }

    &.active {
      right: 0;
    }

    .left_part {
      width: 100%;
      color: $text-main;

      .main_info {
        margin-top: 32px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        border-bottom: 1px solid $border-color;
        padding-bottom: 16px;

        p {
          color: $white;
          font-weight: 600;
          font-size: 18px;
        }

        .stats_info {
          display: flex;
          align-items: center;
          font-size: 12px;
          gap: 12px;
          color: $text-secondary;

          .bordered {
            border-right: 1px solid $border-color;
            padding-right: 12px;
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

      .preferences {
        display: flex;
        gap: 16px;

        .block {
          display: flex;
          align-items: center;
          gap: 12px;

          .text {
            display: flex;
            flex-direction: column;
            gap: 4px;

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
        }
      }

      .skills {
        display: flex;
        flex-direction: column;
        gap: 16px;

        p {
          font-weight: 500;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          span {
            background: $tag-color;
            color: $text-secondary;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 14px;
          }
        }
      }

      & > p {
        padding-top: 12px;
        font-size: 12px;
        color: $text-secondary;
      }
    }

    .right_part {
      min-width: 200px;
      width: 200px;
      border-left: 1px solid $border-color;
      display: flex;
      flex-direction: column;
      gap: 48px;
      padding: 32px 0 32px 16px;

      .price {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        p {
          font-weight: 600;
          font-size: 16px;
          color: $primary;
        }
      }

      .about_client {
        display: flex;
        flex-direction: column;
        gap: 16px;

        & > p {
          color: $white;
          font-weight: 600;
          font-size: 15px;
        }

        .block {
          display: flex;
          flex-direction: column;
          gap: 4px;

          p {
            font-weight: 600;
            color: $text-secondary;
            font-size: 13px;
          }

          span {
            font-weight: 500;
            color: $text-secondary;
            font-size: 11px;
          }
        }
      }

      .link {
        display: flex;
        flex-direction: column;
        gap: 16px;

        p {
          color: $white;
          font-weight: 600;
          font-size: 15px;
        }

        .link_block {
          background: $tag-color;
          border-radius: 6px;
          padding: 12px;
          font-size: 10px;
          color: $text-secondary;
          overflow: hidden;
          position: relative;

          .hidder {
            position: absolute;
            width: 12px;
            height: 12px;
            background: $tag-color;
            right: -1px;
            top: 12px;
          }
        }

        & > span {
          color: $primary;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }

  &.active {
    visibility: visible;
    background: rgba(0, 0, 0, 0.42);
  }
}
</style>
