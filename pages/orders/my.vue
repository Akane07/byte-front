<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="content orders_wrapper">
            <div class="orders">
                <div class="orders_header">
                    <div class="lol">
                    </div>
                    <div class="orders_buttons">
                        <UIDevNavButton :stroke="true" :secondary="true" @click="navigateTo('/orders')">
                            <IconsOrders style="transform: scale(1.3); margin-right: 8px;"></IconsOrders>
                            Все заказы
                        </UIDevNavButton>
                        <UIDevNavButton :stroke="true">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UIDevNavButton>
                    </div>
                </div>
                <div class="orders_list" v-if="orderStore.myOrders.length">
                    <OrdersOrderCard v-for="order in orderStore.myOrders" :key="order.id" :order="order" @showOrder="showOrder"></OrdersOrderCard>
                </div>
                <div class="orders_list" v-else>
                    <p>У вас нет активных заказов</p>
                </div>
            </div>
        </div>
    </div>

    <OrdersOrderHover :order="hoverOrder" @close-order="handleCloseOrder"></OrdersOrderHover>
</template>

<script setup lang="ts">
import { type Order } from '~/api/order-api';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();
const orderStore = useOrderStore();

const hoverOrder = ref<Order | null>(null);

function showOrder(order: Order) {
    hoverOrder.value = order;
}

function handleCloseOrder() {
    hoverOrder.value = null;
}

onMounted(async () => {
    await userStore.checkAuth();
    if (!userStore.user?.id) return;
    orderStore.myOrders = await orderStore.getUserOrders(userStore.user?.id);
})
</script>

<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

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
    color: white;
    display: flex;
    width: 100%;
    max-width: 1440px;
    margin-top: 40px;

    .orders {
        width: 100%;
        height: fit-content;
        background: $main-color;
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

            .orders_buttons {
                display: flex;
                gap: 16px;
            }
        }

        .orders_list {
            display: flex;
            flex-direction: column;
            gap: 16px;

            & > p {
                font-size: 24px;
                font-weight: 600;
                text-align: center;
                margin-top: 40px;
            }
        }
    }
}
</style>