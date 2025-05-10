<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="content orders_wrapper">
            <div class="filters">
                <p>Заказы</p>
                <div class="nav_block">
                    <div class="nav" :class="{ 'active': active === 'orders' }" @click="active = 'orders'">
                        <p>Мои заказы</p>
                    </div>
                    <div class="nav" :class="{ 'active': active === 'responses' }" @click="active = 'responses'">
                        <p>Мои отклики</p>
                    </div>
                    <div class="nav" :class="{ 'active': active === 'drafts' }" @click="active = 'drafts'">
                        <p>Черновики</p>
                    </div>
                </div>
            </div>
            <div v-if="active === 'orders'" class="orders">
                <div class="orders_header">
                    <div class="title">
                        Мои заказы
                    </div>
                    <div class="orders_buttons">
                        <UIDevNavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UIDevNavButton>
                    </div>
                </div>
                <div class="orders_list" v-if="orderStore.myOrders.length">
                    <OrdersMyOrderCard v-for="order in orderStore.myOrders" :key="order.id" :order="order" @update-orders="updateOrders"></OrdersMyOrderCard>
                </div>
                <div class="orders_list" v-else>
                    <p>У вас нет активных заказов</p>
                </div>
            </div>
            <div v-if="active === 'responses'" class="orders">
                <div class="orders_header">
                    <div class="title">
                        Мои отклики
                    </div>
                    <div class="orders_buttons">
                        <UIDevNavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UIDevNavButton>
                    </div>
                </div>
                <div class="orders_list" v-if="orderStore.myResponses.length">
                    <OrdersMyResponseCard v-for="response in orderStore.myResponses" :key="response.id"
                        :response="response" @update-responses="updateResponses"></OrdersMyResponseCard>
                </div>
                <div class="orders_list" v-else>
                    <p>У вас нет откликов на заказы</p>
                </div>
            </div>
            <div v-if="active === 'drafts'" class="orders">
                <div class="orders_header">
                    <div class="title">
                        Черновики
                    </div>
                    <div class="orders_buttons">
                        <UIDevNavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UIDevNavButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();
const orderStore = useOrderStore();

const active = shallowRef<'orders' | 'responses' | 'drafts'>('orders');

async function updateResponses() {
    await orderStore.getResponses();
}

async function updateOrders() {
    orderStore.myOrders = await orderStore.getUserOrders(userStore.user!.id);
}

onMounted(async () => {
    await userStore.checkAuth();
    if (!userStore.user?.id) return;
    orderStore.myOrders = await orderStore.getUserOrders(userStore.user?.id);
    await orderStore.getResponses();
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
        min-height: 400px;
        height: fit-content;
        background: $main-color;
        padding: 46px 20px;
        border-radius: 0 20px 20px 20px;
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
                margin-top: 40px;
            }
        }
    }

    .filters {
        width: 25%;
        height: fit-content;
        background: $main-color;
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
            color: $text-color-header;
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
</style>