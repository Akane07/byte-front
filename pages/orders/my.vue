<template>
    <UINavMenu></UINavMenu>
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
                    <div class="nav" :class="{ 'active': active === 'reviews' }" @click="active = 'reviews'">
                        <p>
                            Оценить
                            <span v-if="reviewStore.pending.length" class="badge">{{ reviewStore.pending.length }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div v-if="active === 'orders'" class="orders">
                <div class="orders_header">
                    <div class="title">
                        Мои заказы
                    </div>
                    <div class="orders_buttons">
                        <UINavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UINavButton>
                    </div>
                </div>
                <div class="orders_list" v-if="orderStore.myOrders.length">
                    <OrdersMyOrderCard v-for="order in orderStore.myOrders" :key="order.id" :order="order"
                        @update-orders="updateOrders"></OrdersMyOrderCard>
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
                        <UINavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UINavButton>
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
                        <UINavButton :stroke="true" @click="navigateTo('/orders/create')">
                            <IconsPlus style="transform: scale(1.3); margin-right: 8px;"></IconsPlus>
                            Создать заказ
                        </UINavButton>
                    </div>
                </div>
                <div class="orders_list" v-if="orderStore.myDrafts.length">
                    <OrdersMyDraftCard v-for="order in orderStore.myDrafts" :key="order.id" :order="order"
                        @update-orders="updateOrders"></OrdersMyDraftCard>
                </div>
                <div class="orders_list" v-else>
                    <p>У вас нет черновиков</p>
                </div>
            </div>
            <!-- Завершённые заказы, по которым ещё можно оставить отзыв. -->
            <div v-if="active === 'reviews'" class="orders">
                <div class="orders_header">
                    <div class="title">Оцените сотрудничество</div>
                </div>
                <div class="orders_list" v-if="reviewStore.pending.length">
                    <div v-for="item in reviewStore.pending" :key="item.order.id" class="pending">
                        <UIUserAvatar :src="makeURL(item.partner?.avatar)" :name="item.partner?.name" size="48px" />
                        <div class="pending_info">
                            <b>{{ item.order.title }}</b>
                            <span>
                                {{ item.role === 'performer' ? 'Исполнитель' : 'Заказчик' }}:
                                {{ item.partner?.nickname || item.partner?.name }} ·
                                отзыв можно оставить до {{ useUserCreated(item.deadline) }}
                            </span>
                        </div>
                        <UIButton type="active" @click="reviewStore.open(item)">Оставить отзыв</UIButton>
                    </div>
                </div>
                <div class="orders_list" v-else>
                    <p>Все завершённые заказы оценены</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { makeURL } from '~/shared/utils/helpers';
import { useOrderStore } from '~/store/orderStore';
import { useReviewStore } from '~/store/reviewStore';
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();
const orderStore = useOrderStore();
const reviewStore = useReviewStore();
const route = useRoute();

// ?tab=reviews — ссылка прямо на вкладку «Оценить».
const active = shallowRef<'orders' | 'responses' | 'drafts' | 'reviews'>(
    route.query.tab === 'reviews' ? 'reviews' : 'orders',
);

// Переход из меню на эту же страницу не пересоздаёт её — следим за адресом.
watch(() => route.query.tab, (tab) => {
    if (tab === 'reviews') active.value = 'reviews';
});

async function updateResponses() {
    await orderStore.getResponses();
}

async function updateOrders() {
    const id = userStore.user?.id;
    if (!id) return;
    await Promise.all([orderStore.loadMyOrders(id), orderStore.getMyDrafts(id)]);
}

onMounted(async () => {
    await Promise.all([updateOrders(), updateResponses(), reviewStore.loadPending()]);
});
</script>

<style scoped lang="scss">
.badge {
    display: inline-block;
    min-width: 20px;
    margin-left: 6px;
    padding: 0 6px;
    border-radius: 10px;
    background: #f5b942;
    color: #1d1d22;
    font-size: 12px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
}

.pending {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 8px;
    background: $bg-secondary;
}

.pending_info {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    min-width: 200px;

    b {
        font-size: 17px;
        font-weight: 600;
    }

    span {
        font-size: 13px;
        color: $text-placeholder;
    }
}


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

// Узкий экран: разделы — строкой вкладок над списком.
.orders_wrapper {
    @include tablet {
        flex-direction: column;

        .filters {
            width: 100%;
            padding: 16px;
            gap: 12px;
            border-radius: 20px 20px 0 0;

            & > p {
                display: none;
            }

            .nav_block {
                flex-direction: row;
                overflow-x: auto;
                @include hidden-scrollbar;

                .nav {
                    white-space: nowrap;
                }
            }
        }

        .orders {
            border-radius: 0 0 20px 20px;
            border-left: none;
        }
    }
}
</style>
