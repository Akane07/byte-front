<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="order_response" v-if="order">
            <div class="left_part">
                <div class="title">
                    <span>Отклик на заказ</span>
                    <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
                </div>
                <div class="main_info">
                    <p>{{ order?.title }}</p>
                    <div class="stats_info">
                        <UIUserAvatar @click="navigateTo(`/profile/${order.user_id}`)"></UIUserAvatar>
                        <span class="border">Опубликовано {{ useOrderCreated(order.created_at) }}</span>
                        <span>Предложений {{ order.response_count }}</span>
                    </div>
                </div>
                <div class="description">
                    <p>{{ order.description }}</p>
                </div>
                <div class="type">
                    <p>Тип проекта: {{ useOrderType(order.type) }}</p>
                </div>
                <div class="preferences">
                    <div class="block">
                        <IconsCalendar style="width: 40px; height: 40px;"></IconsCalendar>
                        <div class="text">
                            <p>{{ useOrderDeadlines(order.deadlines) }}</p>
                            <span>Продолжительность проекта</span>
                        </div>
                    </div>
                    <div class="block" v-if="order.for_experts">
                        <IconsExpert style="width: 40px; height: 40px;"></IconsExpert>
                        <div class="text">
                            <p>Для экспертов</p>
                            <span>Я готов платить более высокую ставку опытным фрилансерам.</span>
                        </div>
                    </div>
                </div>
                <div class="skills">
                    <p>Навыки и экспертный опыт</p>
                    <div class="tags">
                        <span v-for="skill in order.skills" :key="skill">{{ skill }}</span>
                    </div>
                </div>
                <p>{{ useUserCreated(order.created_at) }}</p>
            </div>
            <div class="right_part">
                <p>Ваше предложение</p>
                <UIDevTextarea v-model="response.description"></UIDevTextarea>
                <UIDevButton style="align-self: flex-start;" :active="true" :disabled="!response.description"
                    @click="handlePostResponse">Откликнуться</UIDevButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '~/api/order-api';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

const route = useRoute();
const orderStore = useOrderStore();
const userStore = useUserStore();

const order = ref<Order | null>(null);

const response = ref({
    description: ''
});

async function handlePostResponse() {
    if (!route.params.id) return;

    const res = await orderStore.postOrderResponse(route.params.id as string, response.value.description);
}

onMounted(async () => {
    await userStore.checkAuth();

    order.value = await orderStore.getOrder(route.params.id as string);

    const hasRes = await orderStore.getOrderResponse(route.params.id as string);

    if (hasRes.description) {
        response.value = hasRes;
    }
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30px;

    .order_response {
        margin-top: 40px;
        width: 100%;
        max-width: 1300px;
        color: $text-color-main;
        background: $input-auth;
        padding: 40px 40px 0 40px;
        border-radius: 20px;
        z-index: 100;
        display: flex;
        margin-bottom: 40px;

        .left_part {
            width: 50%;
            border-right: 1px solid $border-color;
            height: 100%;
            padding-bottom: 40px;

            .main_info {
                margin-top: 32px;
                display: flex;
                flex-direction: column;
                gap: 24px;
                border-bottom: 1px solid $border-color;
                padding-bottom: 16px;

                p {
                    color: white;
                    font-weight: 600;
                    font-size: 18px;
                }

                .stats_info {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    gap: 12px;
                    color: $text-color-secondary;

                    .border {
                        border-right: 1px solid $border-color;
                        padding-right: 12px;
                    }
                }
            }

            .description,
            .type,
            .preferences,
            .skills {
                font-size: 14px;
                padding: 24px 12px 24px 0;
                border-bottom: 1px solid $border-color;
            }

            .preferences {
                display: flex;
                gap: 16px;

                .block {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    .text {
                        p {
                            font-weight: 600;
                            font-size: 13px;
                        }

                        span {
                            font-weight: 500;
                            font-size: 12px;
                            color: $text-color-secondary;
                        }
                    }
                }
            }

            .skills {
                display: flex;
                flex-direction: column;
                gap: 16px;

                p {
                    font-weight: 500;
                }

                .tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;

                    span {
                        background: $tag-color;
                        color: $text-color-secondary;
                        padding: 6px 12px;
                        border-radius: 6px;
                    }
                }
            }

            .title {
                display: flex;
                flex-direction: column;
                gap: 16px;

                span {
                    font-weight: 500;
                    font-size: 22px;
                }

                p {
                    font-weight: 600;
                    font-size: 18px;
                    color: $active-button-color;
                }
            }

            &>p {
                padding-top: 12px;
                font-size: 12px;
                color: $text-color-secondary;
                margin-bottom: 60px;
            }
        }

        .right_part {
            display: flex;
            flex-direction: column;
            gap: 24px;
            margin-left: 40px;
            margin-bottom: 40px;
            width: 50%;

            p {
                font-weight: 500;
                font-size: 22px;
            }
        }

        @media screen and (max-width: 1200px) {
            flex-direction: column;

            .left_part,
            .right_part {
                width: 100%;
            }

            .left_part {
                border-right: none;
                padding-bottom: 0px;
            }

            .right_part {
                margin-left: 0px;
            }
        }
    }
}
</style>