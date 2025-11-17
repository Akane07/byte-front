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
                        <UIUserAvatar @click="navigateTo(`/profile/${order.user_id}`)"
                            :src="baseURL + userStore.user?.avatar"></UIUserAvatar>
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
                        <IconsCalendar style="min-width: 40px; min-height: 40px;"></IconsCalendar>
                        <div class="text">
                            <p>{{ useOrderDeadlines(order.deadlines, order.deadline_date) }}</p>
                            <span>Продолжительность проекта</span>
                        </div>
                    </div>
                    <div class="block" v-if="order.for_experts">
                        <IconsExpert style="min-width: 40px; min-height: 40px;"></IconsExpert>
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
            <div class="right_part" v-if="!response.id">
                <p>Ваше предложение</p>
                <UIDevTextarea v-model="newResponse.description" maxlength="2000"></UIDevTextarea>
                <UIDevButton style="align-self: flex-start;" :active="true" :disabled="!newResponse.description"
                    @click="handlePostResponse">Откликнуться</UIDevButton>
            </div>
            <div class="right_part" v-if="response.id && !edit && userStore.user">
                <p>Ваше предложение</p>
                <div class="block">
                    <UIUserAvatar :src="baseURL + userStore.user?.avatar"
                        @click="navigateTo(`/profile/${userStore.user.id}`)"></UIUserAvatar>
                    <span>Отклик от {{ useUserCreated(response.created_at) }}</span>
                </div>
                <div class="block">
                    <p>{{ response.description }}</p>
                </div>
                <div class="actions">
                    <button class="edit" @click="edit = true">Редактировать</button>
                    <button class="delete" @click="modal = true">Удалить</button>
                </div>
            </div>
            <div class="right_part" v-if="response.id && edit && userStore.user">
                <p>Ваше предложение</p>
                <div class="block">
                    <UIUserAvatar :src="baseURL + userStore.user?.avatar"
                        @click="navigateTo(`/profile/${userStore.user.id}`)"></UIUserAvatar>
                    <span>Отклик от {{ useUserCreated(response.created_at) }}</span>
                </div>
                <div class="block">
                    <UIDevTextarea v-model="response.description" style="width: 100%;" maxlength="2000"></UIDevTextarea>
                </div>
                <div class="actions">
                    <UIDevButton style="align-self: flex-start;" :active="true" @click="handleEditResponse">Подтвердить
                    </UIDevButton>
                    <button class="delete" @click="edit = false">Отменить</button>
                </div>
            </div>
        </div>
    </div>

    <UIDevModal v-if="modal" title="Подтверждение" @close="modal = false">
        <template #body>
            <p class="confirm">Вы уверены, что хотите удалить свой отклик? Отменить это действие будет невозможно.</p>
        </template>
        <template #buttons>
            <UIDevButton :active="false" @click.stop="modal = false">Отмена</UIDevButton>
            <UIDevButton :active="true" @click.stop="handleDelete">Удалить</UIDevButton>
        </template>
    </UIDevModal>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { baseURL } from '~/api';
import { deleteResponse, editResponse, type Order } from '~/api/order-api';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

definePageMeta({
    middleware: ['auth'],
});

const socket = io('http://localhost:3002', {
    transports: ['websocket'],
});

const route = useRoute();
const orderStore = useOrderStore();
const userStore = useUserStore();

const order = ref<Order | null>(null);

const edit = shallowRef(false);
const modal = shallowRef(false);
const newResponse = ref({
    description: ''
});
const response = ref({
    created_at: '',
    description: '',
    id: '',
    messageId: '',
});

async function handlePostResponse() {
    if (!route.params.id || !order.value?.user_id) return;

    const res = await orderStore.postOrderResponse(route.params.id as string, newResponse.value.description);

    response.value.created_at = res.created_at;
    response.value.description = res.description;
    response.value.id = res.id;
    newResponse.value.description = '';

    socket.emit('postResponse', {
        senderId: userStore.user!.id,
        receiverId: order.value.user_id,
        orderId: order.value.id,
        responseId: res.id,
    });

    const hasRes = await orderStore.getOrderResponse(route.params.id as string);

    if (hasRes) {
        response.value.created_at = hasRes.created_at;
        response.value.description = hasRes.description;
        response.value.id = hasRes.id;
        response.value.messageId = hasRes.messageId || '';
    }
}

async function handleEditResponse() {
    if (!order.value) return;

    const res = await editResponse(order.value.id, response.value.id, response.value.description);

    response.value.created_at = res.created_at;
    response.value.description = res.description;
    response.value.id = res.id;
    edit.value = false;
}

async function handleDelete() {
    if (!order.value) return;
    const res = await deleteResponse(response.value.id, order.value.id);

    console.log({
        senderId: userStore.user?.id,
        receiverId: order.value?.user_id,
        messageId: response.value?.messageId,
    });

    socket.emit('deleteMessage', {
        senderId: userStore.user?.id,
        receiverId: order.value?.user_id,
        messageId: response.value?.messageId,
    })

    if (res) {
        response.value.created_at = '';
        response.value.description = '';
        response.value.id = '';
        modal.value = false;
        order.value = await orderStore.getOrder(route.params.id as string);
    }
}

onMounted(async () => {
    await userStore.checkAuth();
    if (!userStore.user?.id) return;

    order.value = await orderStore.getOrder(route.params.id as string);

    const hasRes = await orderStore.getOrderResponse(route.params.id as string);

    if (hasRes.description) {
        response.value = hasRes;
    }

    if (route.query.edit) {
        edit.value = true;
    }

    if (order.value?.user_id !== userStore.user?.id && !order.value?.viewed_by.includes(userStore.user?.id || '')) {
        await orderStore.viewOrder(route.params.id as string);
    }

    if (order.value?.user_id === userStore.user?.id) return;
    socket.emit('joinRoom', order.value?.user_id as string);
})
</script>

<style lang="scss" scoped>


.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30px;

    .order_response {
        margin-top: 40px;
        width: 100%;
        max-width: 1300px;
        color: $text-main;
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
                    color: $text-secondary;

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
                        display: flex;
                        flex-direction: column;
                        gap: 4px;

                        p {
                            font-weight: 600;
                            font-size: 12px;
                            white-space: nowrap;
                        }

                        span {
                            font-weight: 500;
                            font-size: 12px;
                            color: $text-secondary;
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
                    gap: 8px;

                    span {
                        background: $tag-color;
                        color: $text-secondary;
                        padding: 6px 14px;
                        border-radius: 6px;
                        font-size: 14px;
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
                    color: $active;
                }
            }

            &>p {
                padding-top: 12px;
                font-size: 12px;
                color: $text-secondary;
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

            .block {
                display: flex;
                align-items: center;
                gap: 12px;
                padding-bottom: 16px;
                border-bottom: 1px solid $border-color;

                span {
                    font-size: 12px;
                    color: $text-secondary;
                }

                p {
                    font-weight: 500;
                    font-size: 14px;
                    color: $text-main;
                    padding-bottom: 8px;
                }
            }

            .actions {
                display: flex;
                gap: 24px;

                .edit {
                    background: #DD6B20;
                    border-radius: 6px;
                    padding: 12px 28px;
                    color: white;
                    border: none;
                    outline: none;
                    cursor: pointer;
                }

                .delete {
                    width: 160px;
                    background: $text-red;
                    border-radius: 6px;
                    padding: 12px 28px;
                    color: white;
                    border: none;
                    outline: none;
                    cursor: pointer;
                }
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

.confirm {
    max-width: 400px;
    color: white;
}
</style>