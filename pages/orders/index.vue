<template>
    <UIDevNavMenu absolute></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="w-full flex flex-col justify-center items-center z-100 relative mb-25">
        <div class="w-full max-w-360 flex justify-end relative mt-8">
            <div class="filters w-[25%] flex flex-col gap-6 px-5 py-11.5 sticky top-20 self-start">
                <p class="pt-2 pb-5 title">Категории заказа</p>
                <div class="flex flex-col gap-5 h-full">
                    <UIDevCheckbox v-for="filter in filters" v-model="filter.checked">{{ filter.title }}</UIDevCheckbox>
                </div>
                <div class="flex flex-col items-center justify-self-end mt-3">
                    <UIDevButton class="w-[250px]" type="success" @click="savefilters">Сохранить</UIDevButton>
                </div>
            </div>
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
                <div class="flex justify-center mt-8 justify-self-end" v-if="orderStore.total > 10">
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
import { useCategory } from '~/store/categoryStore';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

definePageMeta({
    middleware: ['auth'],
});

const userStore = useUserStore();
const orderStore = useOrderStore();
const category = useCategory();

const hoverOrder = ref<Order | null>(null);
const filters = ref<{
    id: number,
    title: string,
    checked: boolean
}[]>([]);

async function savefilters() {
    localStorage.setItem("byte-filters", JSON.stringify(filters.value.filter(filter => filter.checked)));
    orderStore.page = 1;
    await orderStore.getAllOrders(filters.value);
}

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

await category.getAllCategories();

for (const filter of category.categories) {
    filters.value.push({
        id: filter.id,
        title: filter.title,
        checked: false
    });
}

// await orderStore.getAllOrders(filters.value);

onMounted(async () => {
    await userStore.checkAuth();

    let lsFilters = localStorage.getItem("byte-filters");

    if (lsFilters) {
        lsFilters = JSON.parse(lsFilters);
        if (!lsFilters) return;

        for (const filter of filters.value) {
            for (const lsFilter of lsFilters) {
                if (filter.id === lsFilter.id) {
                    filter.checked = true;
                }
            }
        }
    }

    await orderStore.getAllOrders(filters.value);
})
</script>

<style scoped lang="scss">
.filters {
    p {
        font-weight: 500;
        border-bottom: 1px solid $border-color;
    }
}

.orders {
    border-left: 1px solid $border-color;
    height: fit-content;
}

.title {
    font-size: 20px;
    color: $text-header;
}
</style>