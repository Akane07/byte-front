<template>
  <UINavMenu></UINavMenu>
  <UIBackground></UIBackground>

  <div class="chat_page flex flex-col items-center w-full pt-8 px-4 md:px-8">
    <div
      class="chat_wrapper flex w-full mt-10 rounded-md z-10"
      :class="{ 'has-dialog': !!$route.params.id }"
    >
      <div class="menu flex flex-col w-full">
        <div class="head flex items-center gap-2 w-full">
          <p>Чаты</p>
          <span v-if="chats.length" class="count">{{ chats.length }}</span>
        </div>
        <div class="search w-full">
          <UIInput v-model="searchString" type="text" placeholder="Поиск">
            <template #prepend>
              <IconsSearch></IconsSearch>
            </template>
          </UIInput>
        </div>
        <div class="users flex flex-col gap-1 w-full">
          <NuxtLink
            v-for="chat in searchedChats"
            :key="chat.userId"
            :to="`/chat/${chat.userId}`"
            class="user"
            :class="{ active: $route.params.id === chat.userId }"
          >
            <UIUserAvatar :src="makeURL(chat.avatar)" :name="chat.name" size="48px" />
            <div class="info">
              <div class="top">
                <p class="name">{{ chat.nickname || chat.name }}</p>
                <span class="time">{{ useTimeAgo(chat.lastMessageDate) }}</span>
              </div>
              <span class="last">{{ chat.lastMessage }}</span>
            </div>
          </NuxtLink>
          <p v-if="loaded && !chats.length" class="empty">
            Диалогов пока нет. Написать исполнителю можно из его профиля.
          </p>
          <p v-else-if="loaded && !searchedChats.length" class="empty">Никого не нашли</p>
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
  height: 80vh;
  height: 80dvh;
  background: rgba(34, 34, 40, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;

  .menu {
    border-right: 1px solid $chat-border;
    max-width: 340px;
    min-width: 340px;

    @include tablet {
      max-width: 280px;
      min-width: 280px;
    }

    .head {
      padding: 22px 24px 14px;

      & > p {
        font-weight: 600;
        font-size: 22px;
        color: $text-main;
      }

      .count {
        min-width: 22px;
        padding: 0 7px;
        border-radius: 11px;
        background: rgba(131, 85, 250, 0.2);
        color: #c3adff;
        font-size: 12px;
        font-weight: 600;
        line-height: 22px;
        text-align: center;
      }
    }

    .search {
      padding: 0 16px 12px;
      border-bottom: 1px solid $chat-border;
    }

    .users {
      flex: 1;
      padding: 8px;
      overflow-y: auto;
      @include hidden-scrollbar;

      .user {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        transition: background 0.15s ease;

        @media (hover: hover) {
          &:hover {
            background: rgba(255, 255, 255, 0.04);
          }
        }

        // Открытый диалог — подсветка и полоска слева.
        &.active {
          background: rgba(131, 85, 250, 0.12);

          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 14px;
            bottom: 14px;
            width: 3px;
            border-radius: 2px;
            background: $primary;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .top {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .name,
        .last {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .name {
          flex: 1;
          font-weight: 600;
          font-size: 15px;
          color: $text-main;
        }

        .time {
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.35);
          font-size: 12px;
        }

        .last {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}

// Телефон: либо список диалогов, либо открытый диалог — на весь экран.
@include mobile {
  .chat_page {
    padding: 0;
  }

  .chat_wrapper {
    margin-top: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
    height: calc(100vh - 80px);
    height: calc(100dvh - 80px);

    .menu {
      max-width: none;
      min-width: 0;
      border-right: none;

      .head {
        padding: 16px 16px 12px;
      }
    }

    &.has-dialog .menu {
      display: none;
    }

    // Без открытого диалога на телефоне — только список, без заглушки.
    &:not(.has-dialog) :deep(.dialog-placeholder) {
      display: none;
    }
  }
}

.empty {
  padding: 16px 12px;
  color: $text-placeholder;
  font-size: 14px;
}
</style>
