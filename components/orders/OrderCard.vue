<template>
    <div class="order_card" @click="$emit('showOrder', order)">
        <div class="order_info">
            <div class="text_info">
                <p>{{ order.title }}</p>
                <span>{{ order.description }}</span>
            </div>
            <div class="stats_info">
                <UIUserAvatar style="cursor: pointer;"></UIUserAvatar>
                <span class="border">Опубликовано {{ useOrderCreated(order.created_at) }}</span>
                <span>Предложений {{ order.response_count }}</span>
            </div>
        </div>
        <div class="order_actions">
            <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
            <UIDevButton :active="true" @click.stop="">Откликнуться</UIDevButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '~/api/order-api';

const props = defineProps<{
    order: Order
}>();

defineEmits<{
    (e: 'showOrder', order: Order): void
}>();
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.order_card {
    width: 100%;
    padding: 16px 40px 16px 16px;
    border-radius: 20px;
    background: $second-color;
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

        p {
            font-weight: 600;
            color: $active-button-color;
            transition: color 0.3s ease-in-out;
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
                color: $text-color-main;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
            }
        }

        .stats_info {
            display: flex;
            gap: 12px;
            align-items: center;
            color: $secondary-button-color;
            font-size: 14px;
            cursor: pointer;

            span {
                cursor: pointer;

                &.border {
                    border-right: 1px solid $border-color;
                    padding-right: 12px;
                }
            }
        }
    }

    &:hover {

        .order_info {
            .text_info {
                p {
                    color: white;
                }

                span {}
            }

            .stats_info {
                span.border {}
            }
        }

        .order_actions {

            p {
                color: white;
            }
        }

    }
}
</style>