<template>
    <UINavMenu absolute></UINavMenu>
    <UIBackground></UIBackground>

    <div class="w-full flex flex-col justify-center items-center z-100 relative mb-25">
        <div class="w-full max-w-360 flex flex-col lg:flex-row justify-end relative mt-8 pt-20 lg:pt-0">
            <OrdersFilters v-model:filters="filters" @change="applyFilters"></OrdersFilters>
            <div class="orders w-full lg:w-[75%] flex flex-col gap-6 px-4 md:px-5 pt-4 pb-11.5 lg:py-11.5 mt-0 lg:mt-12">
                <div class="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div class="title">
                        <p>Все предложения</p>
                    </div>
                    <UIButton class="w-full sm:w-[250px]" type="active" @click="navigateTo('/orders/create')">
                        Разместить заказ
                    </UIButton>
                </div>
                <p v-if="loaded && !orderStore.orders.length" class="empty">
                    Заказов по выбранным категориям пока нет
                </p>
                <div class="flex flex-col gap-4">
                    <OrdersOrderCard v-for="order in orderStore.orders" :key="order.id" :order="order"
                        @show-order="hoverOrder = $event"></OrdersOrderCard>
                </div>
                <div class="flex justify-center mt-8 justify-self-end" v-if="orderStore.total > 1">
                    <UIPagination :total="orderStore.total" :currentPage="orderStore.page" @change="getOrders">
                    </UIPagination>
                </div>
            </div>
        </div>
    </div>

    <OrdersOrderHover :order="hoverOrder" @close-order="hoverOrder = null"></OrdersOrderHover>
</template>

<script setup lang="ts">
import type { Order } from '~/shared/api/order-api';
import type { Filter } from '~/shared/types';
import { useOrderStore } from '~/store/orderStore';

const orderStore = useOrderStore();

const hoverOrder = ref<Order | null>(null);
const filters = ref<Filter[]>([]);
const loaded = shallowRef(false);

/** Фильтры изменились — начинаем с первой страницы. */
async function applyFilters() {
    orderStore.page = 1;
    await orderStore.getAllOrders(filters.value);
    loaded.value = true;
}

async function getOrders(page: number) {
    orderStore.page = page;
    await orderStore.getAllOrders(filters.value);
    window.scroll({ top: 0 });
}
</script>

<style scoped lang="scss">
.orders {
    border-left: 1px solid $border-color;
    height: fit-content;

    @include tablet {
        border-left: none;
    }
}

.title {
    font-size: 20px;
    color: $text-header;
}

.empty {
    color: $text-secondary;
}
</style>
