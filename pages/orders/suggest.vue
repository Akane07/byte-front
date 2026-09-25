<template>
    <UINavMenu></UINavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="content orders_wrapper">
            <div class="orders">
                <div class="orders_header">
                    <div class="title">
                        Мои активные заказы
                    </div>
                </div>
                <div class="orders_list" v-if="activeOrders.length">
                    <OrdersMyOrderCard v-for="order in activeOrders" :key="order.id" :order="order"
                        plain @suggest="suggestOrder"></OrdersMyOrderCard>
                </div>
                <div class="orders_list" v-else>
                    <p>У вас нет активных заказов</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/store/orderStore';

const route = useRoute();
const orderStore = useOrderStore();
const chat = useChatSocket();

/** Кому предлагаем заказ — id исполнителя из ?id=. */
const receiverId = computed(() => route.query.id as string | undefined);

// Предложить можно только опубликованный заказ без исполнителя.
const activeOrders = computed(() =>
    orderStore.myOrders.filter((order) => order.is_active && !order.performer && order.status === 'active'),
);

function suggestOrder(orderId: string) {
    if (!receiverId.value) return;
    chat.suggestOrder(receiverId.value, orderId);
    navigateTo(`/chat/${receiverId.value}`);
}

onMounted(() => {
    if (!receiverId.value) navigateTo('/chat');
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
