<template>
  <UINavMenu></UINavMenu>
  <UIBackground></UIBackground>

  <div class="flex flex-col items-center w-full pt-8">
    <div class="chat_wrapper flex w-full mt-10 rounded-md z-10">
      <div class="menu flex flex-col w-full">
        <div class="head flex items-center justify-center gap-2 p-6 w-full">
          <p>Чаты</p>
          <span class="px-2 py-0.5 rounded-3xl">{{ chats.length }}</span>
        </div>
        <div class="px-6 py-3 w-full">
          <UIInput v-model="searchString" type="text" placeholder="Поиск">
            <template #prepend>
              <IconsSearch></IconsSearch>
            </template>
          </UIInput>
        </div>
        <div class="users flex flex-col gap-2 w-full px-4 overflow-y-scroll">
          <NuxtLink
            v-for="chat in searchedChats"
            :key="chat.userId"
            :to="`/chat/${chat.userId}`"
            class="user flex items-center gap-4 p-4 cursor-pointer"
            :class="{ active: $route.params.id === chat.userId }"
          >
            <UIUserAvatar :src="makeURL(chat.avatar)" size="48px" class="rounded-md" />
            <div class="info flex flex-col gap-1 w-full">
              <p>{{ chat.nickname || chat.name }}</p>
              <span>{{ useSliceDescription(chat.lastMessage, 20) }}</span>
            </div>
            <span>{{ useTimeAgo(chat.lastMessageDate) }}</span>
          </NuxtLink>
          <p v-if="loaded && !chats.length" class="empty px-4">
            Диалогов пока нет. Написать исполнителю можно из его профиля.
          </p>
        </div>
      </div>
      <NuxtPage></NuxtPage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, call } from "~/shared/api";
import type { ChatPreview } from "~/shared/types";
import { makeURL } from "~/shared/utils/helpers";

const chat = useChatSocket();

const chats = ref<ChatPreview[]>([]);
const searchString = shallowRef("");
const loaded = shallowRef(false);

const searchedChats = computed(() => {
  const query = searchString.value.trim().toLowerCase();
  return chats.value.filter((c) => (c.nickname || c.name).toLowerCase().includes(query));
});

async function loadChats() {
  chats.value = (await call(api.get<ChatPreview[]>("/chat/all"))) ?? [];
  loaded.value = true;
}

// Новое сообщение — обновляем последний текст и порядок диалогов.
chat.on("receiveMessage", loadChats);
chat.on("messageDeleted", loadChats);

onMounted(loadChats);
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

.empty {
  color: $text-placeholder;
  font-size: 14px;
}
</style>
