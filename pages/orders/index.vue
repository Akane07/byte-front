<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="content orders_wrapper">
            <div class="filters">
                <p>Найти проект</p>
                <div class="filters_block">
                    <UIDevCheckbox v-for="filter in filters" v-model="filter.checked">{{ filter.title }}</UIDevCheckbox>
                </div>
                <div class="buttons">
                    <UIDevNavButton class="save_button" @click="savefilters">Сохранить</UIDevNavButton>
                </div>
            </div>
            <div class="orders">
                <div class="orders_header">
                    <div class="lol">
                        <p>Все предложения</p>
                    </div>
                    <div class="orders_buttons">
                        <UIDevNavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UIDevNavButton>
                    </div>
                </div>
                <div class="orders_list">
                    <OrdersOrderCard v-for="order in orderStore.orders" :key="order.id" :order="order"
                        @showOrder="showOrder"></OrdersOrderCard>
                </div>
                <div class="pagionation">
                    <UIDevPagionation :total="orderStore.total" :currentPage="orderStore.page" @change="getOrders">
                    </UIDevPagionation>
                </div>
            </div>
        </div>
    </div>

    <OrdersOrderHover :order="hoverOrder" @close-order="handleCloseOrder"></OrdersOrderHover>
</template>

<script setup lang="ts">
import { type Order } from '~/api/order-api';
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

onMounted(async () => {
    await userStore.checkAuth();
    await category.getAllCategories();

    for (const filter of category.categories) {
        filters.value.push({
            id: filter.id,
            title: filter.title,
            checked: false
        });
    }

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

    .filters {
        width: 25%;
        height: fit-content;
        background: $main-color;
        padding: 46px 20px;
        border-radius: 20px 0 0 20px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        min-height: 800px;

        p {
            font-weight: 400;
            font-size: 18px;
            text-align: center;
            padding-bottom: 24px;
            border-bottom: 1px solid $border-color;
            color: $text-color-header;
        }

        .filters_block {
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            height: 100%;
            min-height: 600px;
        }

        .buttons {
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-self: end;

            .save_button {
                width: 100%;
                max-width: 200px;
            }
        }

    }

    .orders {
        width: 75%;
        height: fit-content;
        background: $main-color;
        padding: 46px 20px;
        border-radius: 0 20px 20px 20px;
        border-left: 1px solid $border-color;
        min-height: 800px;

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
            height: 100%;
            min-height: 600px;
        }

        .pagionation {
            display: flex;
            justify-content: center;
            margin-top: 32px;
            justify-self: end;
        }
    }
}
</style>