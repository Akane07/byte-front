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
                <UIUserAvatar style="cursor: pointer;" @click="navigateTo(`/profile/${order.user_id}`)"
                    :src="order.user_id === userStore.user?.id ? makeURL(userStore.user?.avatar) : undefined"></UIUserAvatar>
                <span class="bordered">Опубликовано {{ useOrderCreated(order.created_at) }}</span>
                <button class="bordered edit" @click="navigateTo(`/orders/${order.id}`)" v-if="user_performer">Просмотреть заказ</button>
            </div>
        </div>
        <div class="order_actions">
            <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
            <UIButton type="success" style="min-width: 155px" v-if="!user_performer" @click="navigateTo(`/chat/${order.performer}`)">Перейти в чат</UIButton>
            <UIButton type="success" style="min-width: 155px" v-if="user_performer" @click="$emit('finishOrder', order)">Завершить заказ</UIButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type Order } from '~/shared/api/order-api';
import { makeURL } from '~/shared/utils/helpers';
import { useUserStore } from '~/store/userStore';

defineProps<{
    order: Order,
    user_performer?: boolean
}>();

defineEmits<{
    (e: 'finishOrder', order: Order): void
}>();

const userStore = useUserStore();

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
            color: $bg-button-success;
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
                color: $white;
                font-weight: 600;
                font-size: 18px;
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
                    color: $primary-active;
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

    // Адаптив — последним, чтобы перекрыть десктопные правила выше.
    @include order-card-adaptive;
}

.confirm {
    max-width: 400px;
}
</style>