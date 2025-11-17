<template>
    <div class="chat" v-if="renderChat">
        <div class="head">
            <div class="info" v-if="user">
                <UIUserAvatar :src="baseURL + user.avatar" @click="navigateTo(`/profile/${user.id}`)"
                    style="cursor: pointer;">
                </UIUserAvatar>
                <div class="name">
                    <p @click="navigateTo(`/profile/${user.id}`)" style="cursor: pointer;">{{ user?.name }}</p>
                    <div class="online">
                        <div v-if="isOnline" class="is_online"></div>
                        <div v-else class="is_offline"></div>
                        <span v-if="isOnline">Online</span>
                        <span v-else>{{ useOrderCreated(user.last_seen) }}</span>
                    </div>
                </div>
            </div>
            <div class="buttons" v-if="user">
                <button class="view" @click="navigateTo(`/mutual/${user.id}`)">
                    <IconsSuggest></IconsSuggest>
                    Активные заказы ({{ ordersBetweenUsers.length }})
                </button>
                <button class="request" @click="navigateTo(`/orders/suggest?id=${user.id}`)">
                    <IconsOrder></IconsOrder>
                    Предложить заказ
                </button>
            </div>
        </div>
        <div class="messages" ref="messagesRef">
            <template v-if="user">
                <div v-for="msg in messages" :key="msg.id" class="message_wrapper"
                    :class="[msg.senderId !== user.id ? 'right' : 'left', msg.status === 'server' ? 'server' : '']">
                    <div v-if="!msg.is_suggest && msg.status !== 'response' && !msg.responseId" class="message">
                        <p>{{ msg.text }}</p>
                        <img v-if="msg.mediaType === 'image' && msg.status !== 'server'" :src="msg.mediaUrl"
                            width="200" />
                        <video v-if="msg.mediaType === 'video' && msg.status !== 'server'" :src="msg.mediaUrl"
                            width="200" controls />
                        <span class="time" v-if="msg.status !== 'server'">{{ useMessageCreated(msg.createdAt)
                        }}</span>
                    </div>
                    <div class="response" v-else-if="msg.status === 'response' && msg.senderId === userStore.user?.id">
                        <!-- Предложение заказа от отправителя -->
                        <div class="header">
                            <IconsSuggest></IconsSuggest>
                            <p>Отклик от {{ userStore.user?.nickname }}</p>
                        </div>
                        <div class="description">
                            <p>{{responsesInChat.find(res => res.id === msg.responseId)?.description}}</p>
                        </div>
                        <div class="deadlines">
                            <p>Срок выполнения: <span>{{useOrderDeadlines(ordersInChat.find(order => order.id
                                === msg.orderId)?.deadlines, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.deadline_date)}}</span></p>
                        </div>
                        <div class="amount">
                            <p>Сумма оплаты: <span>{{useOrderPrice(ordersInChat.find(order => order.id ===
                                msg.orderId)?.price_type, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.price)}}</span></p>
                        </div>
                        <div class="buttons" v-if="msg.status !== 'rejected' && msg.status !== 'accepted'">
                            <button class="delete"
                                @click="handleDeleteResponse(msg.responseId, msg.orderId, msg.id)">Удалить
                                отклик</button>
                        </div>
                    </div>
                    <div class="response" v-else-if="msg.status === 'response'">
                        <!-- Предложение заказа от получателя -->
                        <div class="header">
                            <IconsSuggest></IconsSuggest>
                            <p>Отклик от {{ user.nickname }}</p>
                        </div>
                        <div class="description">
                            <p>{{responsesInChat.find(res => res.id === msg.responseId)?.description}}</p>
                        </div>
                        <div class="deadlines">
                            <p>Срок выполнения: <span>{{useOrderDeadlines(ordersInChat.find(order => order.id
                                === msg.orderId)?.deadlines, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.deadline_date)}}</span></p>
                        </div>
                        <div class="amount">
                            <p>Сумма оплаты: <span>{{useOrderPrice(ordersInChat.find(order => order.id ===
                                msg.orderId)?.price_type, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.price)}}</span></p>
                        </div>
                        <div class="buttons" v-if="msg.status !== 'rejected' && msg.status !== 'accepted'">
                            <button class="view" @click="openModal(msg.orderId, msg.id)">Принять</button>
                            <button class="delete" @click="rejectSuggest(msg.id)">Отклонить</button>
                        </div>
                    </div>
                    <div class="response" v-else-if="(msg.status !== 'response') && msg.responseId">
                        <!-- Предложение заказа от получателя -->
                        <div class="header">
                            <IconsSuggest></IconsSuggest>
                            <p>Отклик от {{ user.nickname }}</p>
                        </div>
                        <div class="description">
                            <p>{{responsesInChat.find(res => res.id === msg.responseId)?.description}}</p>
                        </div>
                        <div class="deadlines">
                            <p>Срок выполнения: <span>{{useOrderDeadlines(ordersInChat.find(order => order.id
                                === msg.orderId)?.deadlines, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.deadline_date)}}</span></p>
                        </div>
                        <div class="amount">
                            <p>Сумма оплаты: <span>{{useOrderPrice(ordersInChat.find(order => order.id ===
                                msg.orderId)?.price_type, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.price)}}</span></p>
                        </div>
                    </div>
                    <div v-else-if="msg.is_suggest && msg.senderId === userStore.user?.id" class="suggest">
                        <!-- Предложение заказа от отправителя -->
                        <div class="header">
                            <IconsSuggest></IconsSuggest>
                            <p>Предложение от {{ userStore.user?.nickname }}</p>
                        </div>
                        <div class="description">
                            <p>{{ordersInChat.find(order => order.id === msg.orderId)?.description}}</p>
                        </div>
                        <div class="deadlines">
                            <p>Срок выполнения: <span>{{useOrderDeadlines(ordersInChat.find(order => order.id
                                === msg.orderId)?.deadlines, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.deadline_date)}}</span></p>
                        </div>
                        <div class="amount">
                            <p>Сумма оплаты: <span>{{useOrderPrice(ordersInChat.find(order => order.id ===
                                msg.orderId)?.price_type, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.price)}}</span></p>
                        </div>
                        <div class="buttons" v-if="msg.status !== 'rejected' && msg.status !== 'accepted'">
                            <button class="delete" @click="deleteSuggest(msg.id)">Отозвать</button>
                        </div>
                    </div>
                    <div v-else class="suggest">
                        <!-- Предложение заказа от получателя -->
                        <div class="header">
                            <IconsSuggest></IconsSuggest>
                            <p>Предложение от {{ user.nickname }}</p>
                        </div>
                        <div class="description">
                            <p>{{ordersInChat.find(order => order.id === msg.orderId)?.description}}</p>
                        </div>
                        <div class="deadlines">
                            <p>Срок выполнения: <span>{{useOrderDeadlines(ordersInChat.find(order => order.id
                                === msg.orderId)?.deadlines, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.deadline_date)}}</span></p>
                        </div>
                        <div class="amount">
                            <p>Сумма оплаты: <span>{{useOrderPrice(ordersInChat.find(order => order.id ===
                                msg.orderId)?.price_type, ordersInChat.find(order => order.id ===
                                    msg.orderId)?.price)}}</span></p>
                        </div>
                        <div class="buttons" v-if="msg.status !== 'rejected' && msg.status !== 'accepted'">
                            <button class="view" @click="openModal(msg.orderId, msg.id)">Просмотреть</button>
                            <button class="delete" @click="rejectSuggest(msg.id)">Отклонить</button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="input">
            <div class="file">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M8.88558 3.36262C11.8283 0.545794 16.5864 0.545794 19.5291 3.36262C22.4903 6.19714 22.4903 10.807 19.5291 13.6415L11.581 21.2495C9.49097 23.2502 6.11532 23.2502 4.02525 21.2495C1.91669 19.2312 1.91669 15.9446 4.02525 13.9263L11.859 6.42771C13.0964 5.24324 15.0896 5.24325 16.327 6.42771C17.5829 7.62989 17.5829 9.59316 16.327 10.7953L8.43612 18.3486C8.13689 18.635 7.66213 18.6247 7.37571 18.3254C7.08929 18.0262 7.09967 17.5515 7.39889 17.265L15.2898 9.71175C15.9286 9.10021 15.9286 8.12285 15.2898 7.5113C14.6324 6.88205 13.5536 6.88205 12.8962 7.5113L5.06248 15.0098C3.57095 16.4376 3.57095 18.7382 5.06248 20.1659C6.57251 21.6114 9.03377 21.6114 10.5438 20.1659L18.4919 12.5579C20.836 10.314 20.836 6.6901 18.4919 4.4462C16.1292 2.1846 12.2855 2.1846 9.9228 4.4462L3.51861 10.5764C3.21939 10.8628 2.74463 10.8524 2.45821 10.5532C2.17179 10.254 2.18216 9.77924 2.48139 9.49281L8.88558 3.36262Z"
                        fill="#494949" />
                </svg>
                <input type="file" accept="image/*, video/*" @change="file = $event.target.files[0]">
            </div>
            <div class="input_wrapper">
                <input type="text" v-model="text" @keyup.enter="sendMessage">
                <IconsSend @click="sendMessage"></IconsSend>
            </div>
        </div>
    </div>
    <div class="chat center" v-else>
        <UIDevLoader />
    </div>


    <UIDevCustomModal v-if="modalAccept && order" @close="modalAccept = false">
        <div class="left_part">
            <div class="title">
                <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
            </div>
            <div class="main_info">
                <p>{{ order?.title }}</p>
                <div class="stats_info">
                    <UIUserAvatar @click="navigateTo(`/profile/${order.user_id}`)"
                        :src="baseURL + userStore.user?.avatar">
                    </UIUserAvatar>
                    <span class="bordered">Опубликовано {{ useOrderCreated(order.created_at) }}</span>
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
            <div class="buttons">
                <button class="view" @click="acceptSuggest(currentMessageId)">Принять</button>
                <button class="delete" @click="rejectSuggest(currentMessageId)">Отклонить</button>
            </div>
        </div>
    </UIDevCustomModal>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { api, baseURL } from '~/shared/api';
import { deleteResponse, getOrdersBetweenUsers, getResponseById, type Order } from '~/shared/api/order-api';
import type { User } from '~/shared/api/user-api';
import { useOrderStore } from '~/store/orderStore';
import { useUserStore } from '~/store/userStore';

const route = useRoute();

const socket = io('http://localhost:3002', {
    transports: ['websocket'],
});

const userStore = useUserStore();
const orderStore = useOrderStore();

const renderChat = shallowRef(false);
const modalAccept = shallowRef(false);
const messagesRef = ref<HTMLDivElement | null>(null);
const messages = ref<any[]>([]);
const user = ref<User | null>(null);
const text = shallowRef('');
const file = ref<File | null>(null);
const ordersInChat = ref<any[]>([]);
const responsesInChat = ref<any[]>([]);

const ordersBetweenUsers = ref<Order[]>([]);
const order = ref<Order | null>(null);
const currentMessageId = shallowRef('');

const isOnline = computed(() => {
    if (!user.value) return;
    return new Date().getTime() - new Date(user.value.last_seen).getTime() < 60000;
})

const sendMessage = async () => {
    if (!user.value) return;
    if (!text.value) return;

    let mediaUrl = null;
    let mediaType = 'none';

    if (file.value) {
        const formData = new FormData();
        formData.append('file', file.value);

        const res = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await res.json();
        mediaUrl = result.url;
        mediaType = result.mimetype.startsWith('video') ? 'video' : 'image';
    }

    socket.emit('sendMessage', {
        senderId: userStore.user?.id,
        receiverId: user.value?.id,
        text: text.value,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString(),
        is_suggest: false
    });

    text.value = '';
    file.value = null;
};

function scrollToBottom() {
    const container = messagesRef.value;
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

async function searchForOrders() {
    ordersInChat.value = messages.value.filter(msg => msg.orderId);
    ordersInChat.value = ordersInChat.value.reduce((acc, msg) => {
        if (!acc.find((m: any) => m.orderId === msg.orderId)) {
            return [...acc, msg];
        }
        return acc;
    }, []);

    ordersInChat.value = await Promise.all(ordersInChat.value.map(async (msg) => {
        if (!msg.orderId) return;
        const order = await orderStore.getOrder(msg.orderId);
        return order;
    }));

    ordersInChat.value = ordersInChat.value.filter(Boolean);
}

async function searchForResponses() {
    responsesInChat.value = messages.value.filter(msg => msg.responseId);
    responsesInChat.value = responsesInChat.value.reduce((acc, msg) => {
        if (!acc.find((m: any) => m.responseId === msg.responseId)) {
            return [...acc, msg];
        }
        return acc;
    }, []);

    responsesInChat.value = await Promise.all(responsesInChat.value.map(async (msg) => {
        if (!msg.orderId) return;

        const res = await getResponseById(msg.orderId, msg.responseId);
        return res;
    }));

    responsesInChat.value = responsesInChat.value.filter(Boolean);
}

async function openModal(orderId: string, messageId: string) {
    order.value = await orderStore.getOrder(orderId);
    currentMessageId.value = messageId;
    modalAccept.value = true;
}

async function acceptSuggest(id: string) {
    modalAccept.value = false;

    const type = (order.value?.user_id === userStore.user?.id) ? 'buyer' : 'seller';

    socket.emit('acceptMessage', {
        senderId: userStore.user?.id,
        receiverId: user.value?.id,
        messageId: id,
        name: userStore.user?.name,
        orderId: order.value?.id,
        type,
    });

    ordersBetweenUsers.value = await getOrdersBetweenUsers(userStore.user?.id as string, user.value?.id as string);
}

async function rejectSuggest(id: string) {
    socket.emit('rejectMessage', {
        senderId: userStore.user?.id,
        receiverId: user.value?.id,
        messageId: id,
        name: userStore.user?.name
    });
}

async function deleteSuggest(id: string) {
    socket.emit('deleteMessage', {
        senderId: userStore.user?.id,
        receiverId: user.value?.id,
        messageId: id
    })
}

async function handleDeleteResponse(id: string, orderId: string, messageId: string) {
    const res = await deleteResponse(id, orderId);

    socket.emit('deleteMessage', {
        senderId: userStore.user?.id,
        receiverId: user.value?.id,
        messageId,
    })
}

watch(messages, () => {
    nextTick(() => {
        scrollToBottom();
    });
}, { deep: true });

onMounted(async () => {
    await userStore.checkAuth();
    user.value = await userStore.getUserId(route.params.id as string);
    const res = await api.get(`/chat?user=${route.params.id as string}`);
    messages.value = res.data;
    await searchForOrders();
    await searchForResponses();
    ordersBetweenUsers.value = await getOrdersBetweenUsers(userStore.user?.id as string, user.value?.id as string);

    socket.emit('joinRoom', route.params.id as string);
    socket.on('receiveMessage', (msg) => {
        messages.value.push(msg);
    });
    socket.on('messageDeleted', (msg: { messageId: string }) => {
        messages.value = messages.value.filter(m => m.id !== msg.messageId);
    });
    socket.on('messageAccepted', async (msg: { messageId: string }) => {
        const index = messages.value.findIndex(m => m.id === msg.messageId) as number;
        messages.value[index].status = 'accepted';
        ordersBetweenUsers.value = await getOrdersBetweenUsers(userStore.user?.id as string, user.value?.id as string);
    });
    socket.on('messageRejected', (msg: { messageId: string }) => {
        const index = messages.value.findIndex(m => m.id === msg.messageId) as number;
        messages.value[index].status = 'rejected';
    });


    setTimeout(() => {
        renderChat.value = true;

        nextTick(() => {
            scrollToBottom();
        });
    }, 300);
})
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .chat_wrapper {
        display: flex;
        width: 100%;
        max-width: 1440px;
        height: 80dvh;
        margin-top: 40px;
        border-radius: 6px;
        background: $bg-brand;
        z-index: 10;

        .chat {
            display: flex;
            flex-direction: column;
            width: 100%;

            .head {
                width: 100%;
                display: flex;
                justify-content: space-between;
                gap: 24px;
                padding: 14.5px 24px;
                border-bottom: 1px solid #333339;

                .info {
                    display: flex;
                    gap: 16px;

                    .name {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;

                        p {
                            color: $text-main;
                            font-weight: 600;
                            font-size: 20px;
                        }

                        .online {
                            display: flex;
                            gap: 4px;
                            align-items: center;

                            span {
                                color: $text-main;
                                font-size: 12px;
                                font-weight: 600;
                            }

                            .is_online {
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background: #68D391;
                            }

                            .is_offline {
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background: $text-red;
                            }
                        }
                    }
                }

                .buttons {
                    display: flex;
                    gap: 12px;

                    .request {
                        cursor: pointer;
                        background: rgba(139, 96, 250, 0.1);
                        border-radius: 6px;
                        padding: 10px 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        border: none;
                        outline: none;
                        color: #8B60FA;
                        font-weight: 600;

                        svg {
                            cursor: pointer;
                        }
                    }

                    .view {
                        cursor: pointer;
                        background: #C6F6D51A;
                        border-radius: 6px;
                        padding: 10px 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        border: none;
                        outline: none;
                        color: #38A169;
                        font-weight: 600;

                        svg {
                            cursor: pointer;
                        }
                    }
                }
            }

            .messages {
                height: 100%;
                width: 100%;
                padding: 24px;
                overflow-y: scroll;
                scrollbar-width: none;
                display: flex;
                flex-direction: column;
                gap: 12px;

                .message_wrapper {
                    width: 100%;
                    display: flex;
                    justify-content: end;

                    .time {
                        color: $text-placeholder;
                        font-size: 10px;
                    }

                    &.left {
                        justify-content: start;

                        .message {
                            background: $tag-secondary-color;
                        }

                        .time {
                            width: 100%;
                            text-align: end;
                        }
                    }

                    &.right {
                        .time {
                            width: 100%;
                            text-align: start;
                            color: $white;
                        }
                    }

                    &.server {
                        justify-content: center;
                        width: 100%;

                        .message {
                            background: transparent;
                            color: $text-placeholder;
                        }
                    }

                    .message {
                        background: #8B60FA;
                        border-radius: 6px;
                        padding: 8px 16px;
                        max-width: 45%;
                        color: $white;
                        font-size: 15px;
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }

                    .suggest,
                    .response {
                        width: 100%;
                        max-width: 440px;
                        padding: 22px 16px;
                        background: #C6F6D51A;
                        border-radius: 6px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        overflow: hidden;

                        .header {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding-bottom: 20px;
                            border-bottom: 1px solid #38A169;

                            p {
                                font-weight: 600;
                                font-size: 16px;
                                color: #38A169;
                            }
                        }

                        .description {
                            width: 100%;
                            padding-bottom: 20px;
                            border-bottom: 1px solid rgb(255, 255, 255, 0.4);
                            overflow: hidden;

                            p {
                                font-size: 14px;
                                color: $white;
                            }
                        }

                        .deadlines {
                            overflow: hidden;
                            padding-bottom: 20px;
                            border-bottom: 1px solid rgb(255, 255, 255, 0.4);

                            p {
                                font-size: 14px;
                                color: $white;

                                span {
                                    font-weight: 600;
                                    font-size: 15px;
                                    color: $text-accent;
                                }
                            }
                        }

                        .amount {
                            overflow: hidden;
                            padding-bottom: 20px;
                            border-bottom: 1px solid rgb(255, 255, 255, 0.4);

                            p {
                                font-size: 14px;
                                color: $white;

                                span {
                                    font-weight: 600;
                                    font-size: 15px;
                                    color: #8B60FA;
                                }
                            }
                        }

                        .buttons {
                            display: flex;
                            gap: 12px;
                            align-items: center;
                            justify-content: center;

                            button {
                                border: none;
                                outline: none;
                                border-radius: 6px;
                                padding: 12px 28px;
                                color: $white;
                                font-weight: 600;
                                cursor: pointer;
                                width: 100%;
                                max-width: 180px;

                                &.delete {
                                    background: $text-red;
                                }

                                &.view {
                                    background: $select-enabled
                                }
                            }
                        }
                    }
                }
            }

            .input {
                width: 100%;
                padding: 12px 24px;
                border-top: 1px solid #333339;
                display: flex;
                align-items: center;
                gap: 12px;

                .file {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    input {
                        opacity: 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                }

                .input_wrapper {
                    display: flex;
                    width: 100%;
                    background: $tag-secondary-color;
                    border-radius: 6px;
                    padding: 10px 20px;

                    input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        outline: none;
                        color: $text-main;
                        font-size: 14px;
                    }
                }
            }

            &.center {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
            }
        }
    }
}

.left_part {
    width: 100%;
    max-width: 600px;
    border-right: 1px solid $border-color;
    height: 100%;
    padding: 32px;
    border-radius: 20px;
    background: $bg-brand;
    box-shadow: 0px 0px 15px 0px $shadow;
    color: $white;

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
            color: $active;
        }
    }

    .buttons {
        display: flex;
        gap: 12px;
        align-items: center;
        justify-content: center;
        margin-top: 24px;

        button {
            border: none;
            outline: none;
            border-radius: 6px;
            padding: 12px 28px;
            color: $white;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            max-width: 180px;

            &.delete {
                background: $text-red;
            }

            &.view {
                background: $select-enabled
            }
        }
    }
}
</style>