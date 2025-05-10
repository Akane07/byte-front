<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="content orders_wrapper">
            <div class="filters">
                <p>Найти проект</p>
                <div class="filters_block">
                    <UIDevCheckbox v-model="filters.design">Графический дизайн</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.it">IT-технологии и Разработка</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.web">Веб-разработка и дизайн</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.media">Медиа и Моушен дизайн</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.ad">Маркетинг и Реклама</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.outsource">Аутсорсинг и Консалтинг</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.promotion">Интернет продвижение</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.engineering">Инженерия</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.texts">Тексты и переводы</UIDevCheckbox>
                    <UIDevCheckbox v-model="filters.other">Другое</UIDevCheckbox>
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
                        <!-- <UIDevNavButton :stroke="true" :secondary="true" @click="navigateTo('/orders/my')">
                            <IconsOrders style="transform: scale(1.3); margin-right: 8px;"></IconsOrders>
                            Мои заказы
                        </UIDevNavButton> -->
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
                    <UIDevPagionation></UIDevPagionation>
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
const filters = ref({
    design: false,
    it: false,
    web: false,
    media: false,
    ad: false,
    outsource: false,
    promotion: false,
    engineering: false,
    texts: false,
    other: false,
});

function savefilters() {
    localStorage.setItem("byte-filters", JSON.stringify(filters.value));
}

function showOrder(order: Order) {
    hoverOrder.value = order;
}

function handleCloseOrder() {
    hoverOrder.value = null;
}

onMounted(async () => {
    await userStore.checkAuth();

    const lsFilters = localStorage.getItem("byte-filters");
    lsFilters && (filters.value = JSON.parse(lsFilters));

    await orderStore.getAllOrders();
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
        }

        .buttons {
            margin-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;

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
            // overflow-y: scroll;
            // max-height: 600px;
        }

        .pagionation {
            display: flex;
            justify-content: center;
            margin-top: 32px;
        }
    }
}
</style>