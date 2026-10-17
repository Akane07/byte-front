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
          <span v-if="chatStore.totalUnread" class="count" title="Непрочитанные">{{ chatStore.totalUnread }}</span>
          <button
            type="button"
            class="bell"
            :class="{ on: chatStore.browserNotify }"
            :title="chatStore.browserNotify ? 'Уведомления включены' : 'Включить уведомления о сообщениях'"
            :aria-pressed="chatStore.browserNotify"
            @click="chatStore.toggleBrowserNotify()"
          >
            <IconsNotifications />
          </button>
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
            :class="{ active: $route.params.id === chat.userId, unread: chat.unreadCount > 0 }"
          >
            <div class="avatar" :class="{ online: chatStore.online[chat.userId] }">
              <UIUserAvatar :src="makeURL(chat.avatar)" :name="chat.name" size="48px" />
            </div>
            <div class="info">
              <div class="top">
                <p class="name">{{ chat.nickname || chat.name }}</p>
                <span class="time">{{ useTimeAgo(chat.lastMessageDate) }}</span>
              </div>
              <div class="bottom">
                <span v-if="chatStore.typing[chat.userId]" class="last typing">печатает…</span>
                <span v-else class="last">
                  <template v-if="chat.lastMessageMine">
                    <svg class="ticks" :class="{ read: chat.isRead }" viewBox="0 0 20 16" aria-hidden="true">
                      <path d="M1.5 8.5l3.5 3.5 7-8" />
                      <path v-if="chat.isRead" d="M8.5 12l7-8" />
                    </svg>
                    <b>Вы:</b>
                  </template>
                  {{ chat.lastMessage }}
                </span>
                <span v-if="chat.unreadCount" class="badge">{{ chat.unreadCount > 99 ? "99+" : chat.unreadCount }}</span>
              </div>
            </div>
          </NuxtLink>
          <p v-if="chatStore.chatsLoaded && !chatStore.chats.length" class="empty">
            Диалогов пока нет. Написать исполнителю можно из его профиля.
          </p>
          <p v-else-if="chatStore.chatsLoaded && !searchedChats.length" class="empty">Никого не нашли</p>
        </div>
      </div>
      <NuxtPage></NuxtPage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { makeURL } from "~/shared/utils/helpers";
import { useChatStore } from "~/store/chatStore";

const chatStore = useChatStore();

const searchString = shallowRef("");

const searchedChats = computed(() => {
  const query = searchString.value.trim().toLowerCase();
  return chatStore.chats.filter((c) => (c.nickname || c.name).toLowerCase().includes(query));
});

// Список живёт в сторе и обновляется по событиям сокета на месте —
// раньше на каждое новое сообщение он целиком перезапрашивался с сервера.
onMounted(chatStore.loadChats);
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

      .bell {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        margin-left: auto;
        border: none;
        border-radius: 50%;
        background: transparent;
        opacity: 0.45;
        cursor: pointer;
        transition:
          opacity 0.15s ease,
          background 0.15s ease;

        :deep(svg) {
          width: 20px;
          height: 20px;
        }

        &.on {
          opacity: 1;
          background: rgba(131, 85, 250, 0.16);
        }

        @media (hover: hover) {
          &:hover {
            opacity: 1;
          }
        }
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

        .avatar {
          position: relative;
          display: flex;

          &.online::after {
            content: "";
            position: absolute;
            right: 1px;
            bottom: 1px;
            width: 12px;
            height: 12px;
            border: 2px solid #222228;
            border-radius: 50%;
            background: #38d17a;
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .bottom {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge {
          flex-shrink: 0;
          min-width: 20px;
          margin-left: auto;
          padding: 0 6px;
          border-radius: 10px;
          background: $primary;
          color: $white;
          font-size: 11px;
          font-weight: 700;
          line-height: 20px;
          text-align: center;
        }

        .last {
          flex: 1;
          min-width: 0;

          b {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
          }

          &.typing {
            color: #c3adff;
          }
        }

        .ticks {
          display: inline-block;
          width: 15px;
          height: 12px;
          margin-right: 2px;
          vertical-align: -1px;
          fill: none;
          stroke: rgba(255, 255, 255, 0.5);
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;

          &.read {
            stroke: #7fd9a6;
          }
        }

        // Есть непрочитанные — текст ярче.
        &.unread {
          .last {
            color: rgba(255, 255, 255, 0.85);
          }

          .time {
            color: #c3adff;
          }
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
