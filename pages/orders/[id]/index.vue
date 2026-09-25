<template>
    <UINavMenu></UINavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="order_response" v-if="order">
            <div class="left_part">
                <div class="title">
                    <span>{{ isOwner ? 'Ваш заказ' : 'Отклик на заказ' }}</span>
                    <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
                </div>
                <div class="main_info">
                    <p>{{ order.title }}</p>
                    <div class="stats_info">
                        <UIUserAvatar class="cursor-pointer" @click="navigateTo(`/profile/${order.user_id}`)"
                            :src="makeURL(owner?.avatar)"></UIUserAvatar>
                        <span class="bordered">Опубликовано {{ useOrderCreated(order.created_at) }}</span>
                        <span>Предложений: {{ order.response_count }}</span>
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

            <!-- Владелец не может откликнуться на свой заказ — раньше форма
                 показывалась, а сервер отвечал ошибкой. -->
            <div class="right_part" v-if="isOwner">
                <p>Это ваш заказ</p>
                <UIButton style="align-self: flex-start;" type="active"
                    @click="navigateTo(`/orders/${order.id}/edit`)">Редактировать заказ</UIButton>
            </div>
            <div class="right_part" v-else-if="!response">
                <p>Ваше предложение</p>
                <UITextarea v-model="newResponse" maxlength="2000"></UITextarea>
                <UIButton style="align-self: flex-start;" type="active" :disabled="!newResponse.trim() || busy"
                    @click="handlePostResponse">Откликнуться</UIButton>
            </div>
            <div class="right_part" v-else-if="userStore.user">
                <p>Ваше предложение</p>
                <div class="block">
                    <UIUserAvatar :src="makeURL(userStore.user.avatar)"
                        @click="navigateTo(`/profile/${userStore.user.id}`)"></UIUserAvatar>
                    <span>Отклик от {{ useUserCreated(response.created_at) }}</span>
                </div>
                <template v-if="!edit">
                    <div class="block">
                        <p>{{ response.description }}</p>
                    </div>
                    <div class="actions">
                        <button class="edit" @click="startEdit">Редактировать</button>
                        <button class="delete" @click="modal = true">Удалить</button>
                    </div>
                </template>
                <template v-else>
                    <div class="block">
                        <UITextarea v-model="editedText" style="width: 100%;" maxlength="2000"></UITextarea>
                    </div>
                    <div class="actions">
                        <UIButton style="align-self: flex-start;" type="active" :disabled="!editedText.trim() || busy"
                            @click="handleEditResponse">Подтвердить</UIButton>
                        <button class="delete" @click="edit = false">Отменить</button>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <UIModal v-if="modal" title="Подтверждение" @close="modal = false">
        <template #body>
            <p class="confirm">Вы уверены, что хотите удалить свой отклик? Отменить это действие будет невозможно.</p>
        </template>
        <template #buttons>
            <UIButton @click.stop="modal = false">Отмена</UIButton>
            <UIButton type="active" @click.stop="handleDelete">Удалить</UIButton>
        </template>
    </UIModal>
</template>

<script setup lang="ts">
import {
    deleteResponse,
    editResponse,
    getResponse,
    postResponse,
    type Order,
    type OrderResponse,
} from '~/shared/api/order-api';
import type { User } from '~/shared/api/user-api';
import { makeURL } from '~/shared/utils/helpers';
import { useNotifications } from '~/store/notiStore';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

const route = useRoute();
const orderStore = useOrderStore();
const userStore = useUserStore();
const notifications = useNotifications();
const chat = useChatSocket();

const orderId = computed(() => route.params.id as string);

const order = ref<Order | null>(null);
const owner = ref<User | null>(null);
const response = ref<OrderResponse | null>(null);
const newResponse = shallowRef('');
const editedText = shallowRef('');
const edit = shallowRef(false);
const modal = shallowRef(false);
const busy = shallowRef(false);

const isOwner = computed(() => !!order.value && order.value.user_id === userStore.user?.id);

async function handlePostResponse() {
    if (!order.value) return;
    busy.value = true;
    const res = await postResponse(order.value.id, newResponse.value.trim());
    busy.value = false;
    if (!res) return;

    response.value = res;
    newResponse.value = '';
    order.value.response_count++;
    // Отклик уходит заказчику в чат отдельным сообщением.
    chat.postResponse(order.value.id, res.id);
    notifications.setNotification('Отклик отправлен заказчику');
}

function startEdit() {
    editedText.value = response.value?.description ?? '';
    edit.value = true;
}

async function handleEditResponse() {
    if (!order.value || !response.value) return;
    busy.value = true;
    const res = await editResponse(order.value.id, response.value.id, editedText.value.trim());
    busy.value = false;
    if (!res) return;

    response.value = res;
    edit.value = false;
}

async function handleDelete() {
    if (!order.value || !response.value) return;
    const res = await deleteResponse(response.value.id, order.value.id);
    modal.value = false;
    if (!res) return;

    // Убираем и сообщение с откликом из чата с заказчиком.
    if (res.messageId) chat.deleteMessage(res.messageId);
    response.value = null;
    order.value.response_count = Math.max(0, order.value.response_count - 1);
    notifications.setNotification('Отклик удалён');
}

onMounted(async () => {
    order.value = await orderStore.getOrder(orderId.value);
    if (!order.value) return;

    const me = userStore.user?.id;
    const [ownerProfile, myResponse] = await Promise.all([
        userStore.getUserId(order.value.user_id),
        isOwner.value ? Promise.resolve(null) : getResponse(order.value.id),
    ]);
    owner.value = ownerProfile;
    response.value = myResponse;

    if (route.query.edit && response.value) startEdit();

    if (me && !isOwner.value && !order.value.viewed_by.includes(me)) {
        await orderStore.viewOrder(order.value.id);
    }
});
</script>

<style lang="scss" scoped>


.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 30px;

    .order_response {
        margin-top: 32px;
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
                    color: $white;
                    font-weight: 600;
                    font-size: 18px;
                }

                .stats_info {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    gap: 12px;
                    color: $text-secondary;

                    .bordered {
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
                    color: $primary;
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
                    background: $text-accent;
                    border-radius: 6px;
                    padding: 12px 28px;
                    color: $white;
                    border: none;
                    outline: none;
                    cursor: pointer;
                }

                .delete {
                    width: 160px;
                    background: $text-red;
                    border-radius: 6px;
                    padding: 12px 28px;
                    color: $white;
                    border: none;
                    outline: none;
                    cursor: pointer;
                }
            }
        }

        .description {
            overflow-wrap: anywhere;
        }

        .stats_info,
        .preferences,
        .right_part .actions {
            flex-wrap: wrap;
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
    color: $white;
}

@include mobile {
    .wrapper {
        padding: 0 16px;

        .order_response {
            margin-top: 16px;
            padding: 24px 16px 0;

            .left_part .preferences .block .text p {
                white-space: normal;
            }

            .left_part .title span,
            .right_part > p {
                font-size: 18px;
            }

            .right_part .actions {
                gap: 12px;

                .edit,
                .delete {
                    flex: 1;
                    width: auto;
                }
            }
        }
    }
}
</style>
