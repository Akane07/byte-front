<template>
  <UIDevNavMenu></UIDevNavMenu>
  <UIBackground></UIBackground>

  <div class="flex flex-col items-center w-full pt-8">
    <div class="chat_wrapper flex w-full mt-10 rounded-md z-10">
      <div class="menu flex flex-col w-full">
        <div class="head flex items-center justify-center gap-2 p-6 w-full">
          <p>Чаты</p>
          <span class="px-2 py-0.5 rounded-3xl">{{ chats.length }}</span>
        </div>
        <div class="px-6 py-3 w-full">
          <div class="input flex items-center gap-2.5 px-5 py-2.5 rounded-xl">
            <IconsSearch></IconsSearch>
            <input type="text" placeholder="Поиск" v-model="searchString" />
          </div>
        </div>
        <div class="users flex flex-col gap-2 w-full px-4 overflow-y-scroll">
          <div
            class="user flex items-center gap-4 p-4 cursor-pointer"
            v-for="chat in searchedChats"
            :key="chat.name"
            @click="navigateTo(`/chat/${chat.userId}`)"
            :class="{ active: $route.params.id === chat.userId }"
          >
            <img :src="makeURL(chat.avatar)" alt="avatar" class="rounded-md w-12 h-12" />
            <div class="info flex flex-col gap-1 w-full">
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
import { api } from "~/shared/api";
import { makeURL } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";

const userStore = useUserStore();

const chats = ref<any[]>([]);
const searchString = shallowRef("");

const searchedChats = computed(() => {
  return chats.value.filter((chat) =>
    chat.name.toLowerCase().includes(searchString.value.toLowerCase())
  );
});

onMounted(async () => {
  await userStore.checkAuth();

  chats.value = (await api.get("/chat/all")).data;
});
</script>

<style lang="scss" scoped>
.chat_wrapper {
  max-width: 1440px;
  height: 80dvh;
  background: $bg-brand;

  .menu {
    border-right: 1px solid $chat-border;
    max-width: 350px;
    min-width: 350px;

    .head {
      border-bottom: 1px solid $chat-border;

      & > p {
        font-weight: 600;
        font-size: 20px;
        color: $text-main;
      }

      & > span {
        background: #edf2f7;
        color: $black;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .input {
      background: $tag-secondary-color;

      input {
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        color: $text-main;
        font-size: 14px;

        &::placeholder {
          color: #929292;
        }
      }
    }

    .users {
      scrollbar-width: none;

      .user {
        .info {
          p {
            font-weight: 600;
            font-size: 14px;
            color: $text-main;
          }

          & > span {
            font-size: 12px;
            color: $text-placeholder;
          }
        }

        & > span {
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
}
</style>
