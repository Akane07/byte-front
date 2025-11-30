<template>
    <UIDevNavMenu absolute></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="w-full flex flex-col justify-center items-center z-100 relative mb-25">
        <div class="w-full max-w-360 flex justify-end relative mt-8">
            <OrdersFilters v-model:filters="filters" @change="getOrders"></OrdersFilters>
            <div class="orders w-[75%] flex flex-col gap-6 px-5 py-11.5 mt-12">
                <div class="flex justify-between items-center">
                    <div class="title">
                        <p>Все предложения</p>
                    </div>
                    <UIDevButton class="w-[250px]" type="active" @click="navigateTo('/orders/create')">
                        Разместить заказ
                    </UIDevButton>
                </div>
                <div class="flex flex-col gap-4">
                    <OrdersOrderCard v-for="order in orderStore.orders" :key="order.id" :order="order"
                        @showOrder="showOrder"></OrdersOrderCard>
                </div>
                <div class="flex justify-center mt-8 justify-self-end" v-if="orderStore.total > 1">
                    <UIDevPagination :total="orderStore.total" :currentPage="orderStore.page" @change="getOrders">
                    </UIDevPagination>
                </div>
            </div>
        </div>
    </div>

    <OrdersOrderHover :order="hoverOrder" @close-order="handleCloseOrder"></OrdersOrderHover>
</template>

<script setup lang="ts">
import { type Order } from '~/shared/api/order-api';
import type { Filter } from '~/shared/types';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

definePageMeta({
    middleware: ['auth'],
});

const userStore = useUserStore();
const orderStore = useOrderStore();

const hoverOrder = ref<Order | null>(null);
const filters = ref<Filter[]>([]);

function showOrder(order: Order) {
    hoverOrder.value = order;
}

function handleCloseOrder() {
    hoverOrder.value = null;
}

async function getOrders(page: number) {
    if (page > orderStore.total) return;
    orderStore.page = page;
    await orderStore.getAllOrders(filters.value);

    window.scroll({ top: 0 });
}

onMounted(async () => {
    await userStore.checkAuth();
});
</script>

<style scoped lang="scss">
.orders {
    border-left: 1px solid $border-color;
    height: fit-content;
}

.title {
    font-size: 20px;
    color: $text-header;
}
</style>