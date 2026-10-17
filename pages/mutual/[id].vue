<template>
    <UINavMenu></UINavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="content orders_wrapper">
            <div class="orders">
                <div class="orders_header">
                    <div class="title">
                        Мои заказы с пользователем
                    </div>
                </div>
                <div class="orders_list" v-if="activeOrders.length">
                    <OrdersMutualOrders v-for="order in activeOrders" :key="order.id" :order="order"
                        :user_performer="order.performer === userStore.user?.id" @finish-order="finishOrder">
                    </OrdersMutualOrders>
                </div>
                <div class="orders_list" v-else>
                    <p>У вас нет активных заказов с этим пользователем</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getOrdersBetweenUsers, type Order } from '~/shared/api/order-api';
import { useNotifications } from '~/store/notiStore';
import { useUserStore } from '~/store/userStore';

const route = useRoute();
const userStore = useUserStore();
const notifications = useNotifications();
const chat = useChatSocket();

const activeOrders = ref<Order[]>([]);

/**
 * Исполнитель сдаёт работу: заказ уходит заказчику на проверку, в чате
 * появляется карточка «Работа сдана». Заказ остаётся в списке со статусом
 * «На проверке», пока заказчик не примет работу.
 */
function finishOrder(order: Order) {
    chat.finishOrder(order.id);
    notifications.setNotification('Работа отправлена заказчику на проверку');
}

chat.on('orderUpdated', (updated) => {
    if (updated.status === 'completed' || updated.status === 'cancelled') {
        activeOrders.value = activeOrders.value.filter((o) => o.id !== updated.id);
        return;
    }
    const index = activeOrders.value.findIndex((o) => o.id === updated.id);
    if (index !== -1) activeOrders.value.splice(index, 1, updated);
});

onMounted(async () => {
    const me = userStore.user?.id;
    const otherId = route.params.id as string;
    if (!me || !otherId) return;
    activeOrders.value = (await getOrdersBetweenUsers(me, otherId)) ?? [];
});
</script>

<style scoped lang="scss">


.wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
    position: relative;
    margin-bottom: 100px;
}

.orders_wrapper {
    color: $white;
    display: flex;
    width: 100%;
    max-width: 1440px;
    margin-top: 32px;

    .orders {
        width: 100%;
        min-height: 400px;
        height: fit-content;
        background: $bg-brand;
        padding: 46px 20px;
        border-radius: 20px;
        border-left: 1px solid $border-color;

        display: flex;
        flex-direction: column;
        gap: 24px;

        .orders_header {
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
            align-items: center;

            .orders_buttons {
                display: flex;
                gap: 16px;
            }

            .title {
                font-size: 18px;
            }
        }

        .orders_list {
            display: flex;
            flex-direction: column;
            gap: 16px;

            &>p {
                font-size: 24px;
                font-weight: 600;
                text-align: center;
                margin-top: 32px;
            }
        }
    }

    .filters {
        width: 25%;
        height: fit-content;
        background: $bg-brand;
        padding: 46px 20px;
        border-radius: 20px 0 0 20px;
        display: flex;
        flex-direction: column;
        gap: 24px;

        &>p {
            font-weight: 400;
            font-size: 18px;
            text-align: center;
            padding-bottom: 24px;
            border-bottom: 1px solid $border-color;
            color: $text-header;
        }

        .nav_block {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .nav {
                padding: 8px 12px;
                border-radius: 6px;
                background: transparent;
                transition: background 0.2s ease-in;
                cursor: pointer;

                p {
                    cursor: pointer;
                }

                &.active {
                    background: #8B60FA1A;
                }

                &:hover {
                    background: #8B60FA1A;
                }
            }
        }
    }
}

.wrapper {
    @include page-gutters;
}

.orders_wrapper .orders {
    @include mobile {
        padding: 24px 12px;
        border-left: none;

        .orders_header {
            padding: 0 4px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .orders_list > p {
            font-size: 18px;
        }
    }
}
</style>
