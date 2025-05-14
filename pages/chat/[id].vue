<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="chat_wrapper">
            <div class="menu">
                <div class="head">
                    <p>Сообщения</p>
                    <span>12</span>
                </div>
                <div class="search">
                    <div class="input">
                        <IconsSearch></IconsSearch>
                        <input type="text" placeholder="Поиск">
                    </div>
                </div>
                <div class="users">
                    <div class="user active" v-if="user">
                        <img v-if="user.avatar" :src="baseURL + user.avatar" alt="avatar">
                        <img v-else src="https://placehold.co/50x50" alt="avatar">
                        <div class="info">
                            <p>{{ user?.name }}</p>
                            <span>Last message</span>
                        </div>
                        <!-- <span>1ч</span> -->
                    </div>
                    <div class="user" v-for="user in 5" :key="user">
                        <img src="https://placehold.co/50x50" alt="avatar">
                        <div class="info">
                            <p>Username</p>
                            <span>Last message</span>
                        </div>
                        <span>1ч</span>
                    </div>
                </div>
            </div>
            <div class="chat">
                <div class="head">
                    <div class="info" v-if="user">
                        <UIUserAvatar :src="baseURL + user.avatar"></UIUserAvatar>
                        <div class="name">
                            <p>{{ user?.name }}</p>
                            <div class="online">
                                <div v-if="isOnline" class="is_online"></div>
                                <div v-else class="is_offline"></div>
                                <span v-if="isOnline">Online</span>
                                <span v-else>{{ useOrderCreated(user.last_seen) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="messages">
                    <div v-for="msg in messages" :key="msg._id" class="message_wrapper"  :class="msg.senderId !== user.id ? 'right' : 'left'">
                        <div class="message">
                            <p>{{ msg.text }}</p>
                            <img v-if="msg.mediaType === 'image'" :src="msg.mediaUrl" width="200" />
                            <video v-if="msg.mediaType === 'video'" :src="msg.mediaUrl" width="200" controls />
                        </div>
                    </div>
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
        </div>
    </div>
</template>

<script setup lang="ts">
import { io } from 'socket.io-client';
import { api, baseURL } from '~/api';
import type { User } from '~/api/user-api';
import { useUserStore } from '~/store/userStore';

const route = useRoute();

const socket = io('http://localhost:3002', {
    transports: ['websocket'],
});

const userStore = useUserStore();

const user = ref<User | null>(null);
const text = ref('');
const file = ref<File | null>(null);
const messages = ref<any[]>([]);

const isOnline = computed(() => {
    if (!user.value) return;
    return new Date().getTime() - new Date(user.value.last_seen).getTime() < 60000;
})

const sendMessage = async () => {
    let mediaUrl = null;
    let mediaType = null;

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
    });

    socket.emit('sendMessage', {
        receiverId: userStore.user?.id,
        senderId: user.value?.id,
        text: text.value,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString(),
    });

    text.value = '';
    file.value = null;
};

onMounted(async () => {
    console.log(route.params.id, 'route.params.id');

    await userStore.checkAuth();

    user.value = await userStore.getUserId(route.params.id as string);

    const res = await api.get(`/chat?user=${route.params.id as string}`);
    messages.value = res.data;

    socket.emit('joinRoom', route.params.id as string);

    socket.on('receiveMessage', (msg) => {
        messages.value.push(msg);
    });
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
        background: #222228;
        z-index: 10;

        .menu {
            display: flex;
            flex-direction: column;
            border-right: 1px solid #333339;
            width: 100%;
            max-width: 350px;

            .head {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 24px;
                border-bottom: 1px solid #333339;

                &>p {
                    font-weight: 600;
                    font-size: 20px;
                    color: #F1ECFF;
                }

                &>span {
                    padding: 2px 8px;
                    border-radius: 24px;
                    background: #EDF2F7;
                    color: #000000;
                    font-size: 12px;
                    font-weight: 600;
                }
            }

            .search {
                padding: 12px 24px;
                width: 100%;

                .input {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 20px;
                    border-radius: 12px;
                    background: #494949;

                    input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        outline: none;
                        color: #F1ECFF;
                        font-size: 14px;

                        &::placeholder {
                            color: #929292;
                            ;
                        }
                    }
                }
            }

            .users {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
                padding: 0 16px;
                overflow-y: scroll;
                scrollbar-width: none;

                .user {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 0;
                    cursor: pointer;

                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 6px;
                    }

                    .info {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        width: 100%;

                        p {
                            font-weight: 600;
                            font-size: 14px;
                            color: #F1ECFF;
                        }

                        &>span {
                            font-size: 12px;
                            color: #9E9E9F;
                        }
                    }

                    &>span {
                        color: rgb(255, 255, 255, 0.3);
                        font-size: 12px;
                        font-weight: 600;
                        height: 100%;
                        padding-top: 8px;
                    }

                    &.active {
                        border-radius: 6px;
                        background: rgba(131, 85, 250, 0.06);
                    }
                }
            }
        }

        .chat {
            display: flex;
            flex-direction: column;
            width: 100%;

            .head {
                width: 100%;
                display: flex;
                gap: 8px;
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
                            color: #F1ECFF;
                            font-weight: 600;
                            font-size: 20px;
                        }

                        .online {
                            display: flex;
                            gap: 4px;
                            align-items: center;

                            span {
                                color: #F1ECFF;
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
                                background: #FF6969;
                            }
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

                    &.left {
                        justify-content: start;

                        .message {
                            background: #494949;
                        }
                    }

                    .message {
                        background: #8B60FA;
                        border-radius: 6px;
                        padding: 8px 16px;
                        max-width: 45%;
                        color: #FFFFFF;
                        font-size: 15px;
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
                    background: #494949;
                    border-radius: 6px;
                    padding: 10px 20px;

                    input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        outline: none;
                        color: #F1ECFF;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>