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
                </div>
                <div class="messages">
                </div>
                <div class="input">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api, baseURL } from '~/api';
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();

const chats = ref<any[]>([]);

onMounted(async () => {
    await userStore.checkAuth();

    chats.value = await api.get('/chat/all');
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