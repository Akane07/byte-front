<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="chat_wrapper">
            <div class="menu">
                <div class="head">
                    <p>Чаты</p>
                    <span>{{ chats.length }}</span>
                </div>
                <div class="search">
                    <div class="input">
                        <IconsSearch></IconsSearch>
                        <input type="text" placeholder="Поиск" v-model="searchString">
                    </div>
                </div>
                <div class="users">
                    <div class="user" v-for="chat in searchedChats" :key="chat.name"
                        @click="navigateTo(`/chat/${chat.userId}`)" :class="{ active: $route.params.id === chat.userId }">
                        <img :src="baseURL + chat.avatar" alt="avatar">
                        <div class="info">
                            <p>{{ chat.name }}</p>
                            <span>{{ useSliceDescription(chat.lastMessage, 20) }}</span>
                        </div>
                        <span>{{ useTimeAgo(chat.lastMessageDate) }}</span>
                    </div>
                </div>
            </div>
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api, baseURL } from '~/shared/api';
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();

const chats = ref<any[]>([]);
const searchString = shallowRef('');

const searchedChats = computed(() => {
    return chats.value.filter((chat) => chat.name.toLowerCase().includes(searchString.value.toLowerCase()));
})

onMounted(async () => {
    await userStore.checkAuth();

    chats.value = (await api.get('/chat/all')).data;
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
                    color: $text-main;
                }

                &>span {
                    padding: 2px 8px;
                    border-radius: 24px;
                    background: #EDF2F7;
                    color: $black;
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
                    background: $tag-secondary-color:

                    input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        outline: none;
                        color: $text-main;
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
                    padding: 16px;
                    cursor: pointer;

                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 6px;
                        cursor: pointer;
                    }

                    .info {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        width: 100%;
                        cursor: pointer;

                        p {
                            font-weight: 600;
                            font-size: 14px;
                            color: $text-main;
                            cursor: pointer;
                        }

                        &>span {
                            font-size: 12px;
                            color: $text-placeholder;
                            cursor: pointer;
                        }
                    }

                    &>span {
                        color: rgb(255, 255, 255, 0.3);
                        font-size: 12px;
                        font-weight: 600;
                        height: 100%;
                        padding-top: 8px;
                        cursor: pointer;
                    }

                    &.active {
                        border-radius: 6px;
                        background: rgba(131, 85, 250, 0.06);
                        cursor: pointer;
                    }
                }
            }
        }

        .chat {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
    }
}
</style>