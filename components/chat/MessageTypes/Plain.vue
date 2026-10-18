<template>
  <!-- Служебное сообщение — плашка по центру, остальные — пузыри. -->
  <div v-if="isServer" class="server-note">{{ msg.text }}</div>
  <div v-else class="plain-row" :class="{ mine, failed: msg.pending === 'failed' }">
    <div class="message chat_message">
      <button
        v-if="msg.replyTo"
        type="button"
        class="quote"
        :class="{ mine: msg.replyTo.senderId === me }"
        @click.stop="actions.jumpTo(msg.replyTo.id)"
      >
        <b>{{ msg.replyTo.senderId === me ? "Вы" : partnerName }}</b>
        <span>{{ quoteText(msg.replyTo) }}</span>
      </button>

      <img
        v-if="msg.mediaType === 'image'"
        :src="makeURL(msg.mediaUrl)"
        alt="Изображение"
        class="media"
        loading="lazy"
        @click.stop="actions.openImage(makeURL(msg.mediaUrl))"
      />
      <video v-if="msg.mediaType === 'video'" class="media" :src="makeURL(msg.mediaUrl)" controls playsinline />
      <a
        v-if="msg.mediaType === 'file'"
        class="file"
        :href="msg.pending ? undefined : downloadUrl(msg.mediaUrl ?? '', msg.fileName)"
        :download="msg.fileName"
        @click.stop
      >
        <span class="file-icon">{{ extension }}</span>
        <span class="file-info">
          <b>{{ msg.fileName || "Файл" }}</b>
          <span>{{ formatFileSize(msg.fileSize) }}<template v-if="!msg.pending"> · Скачать</template></span>
        </span>
      </a>

      <ChatMessageText v-if="msg.text" :text="msg.text" />

      <span class="meta">
        <span v-if="msg.editedAt" class="edited">изменено</span>
        <span class="time">{{ parseMessageDate(msg.createdAt) }}</span>
        <span v-if="mine" class="state" :title="stateTitle">
          <!-- Часы — отправляется, одна галочка — доставлено, две — прочитано. -->
          <svg v-if="msg.pending === 'sending'" viewBox="0 0 16 16" class="clock">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4.8V8l2 1.4" />
          </svg>
          <svg v-else-if="msg.pending === 'failed'" viewBox="0 0 16 16" class="error">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 4.5v4.2M8 11h.01" />
          </svg>
          <svg v-else viewBox="0 0 20 16" class="ticks" :class="{ read: msg.isRead }">
            <path d="M1.5 8.5l3.5 3.5 7-8" />
            <path v-if="msg.isRead" d="M8.5 12l7-8" />
          </svg>
        </span>
      </span>
    </div>

    <div v-if="msg.pending === 'failed'" class="failed-actions">
      <span>Не отправлено</span>
      <button type="button" @click.stop="actions.retry(msg)">Повторить</button>
      <button type="button" @click.stop="actions.discard(msg)">Удалить</button>
    </div>

    <!-- Действия: на компьютере — при наведении, на телефоне — по нажатию на сообщение. -->
    <div v-else-if="!msg.pending" class="actions" :class="{ open: selected }">
      <button type="button" title="Ответить" aria-label="Ответить" @click.stop="actions.reply(msg)">
        <svg viewBox="0 0 20 20"><path d="M8 5L3 10l5 5M3.5 10H12a5 5 0 015 5v1" /></svg>
      </button>
      <button v-if="msg.text" type="button" title="Копировать" aria-label="Копировать" @click.stop="actions.copy(msg)">
        <svg viewBox="0 0 20 20"><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M13 4.5V4a1 1 0 00-1-1H5a2 2 0 00-2 2v7a1 1 0 001 1h.5" /></svg>
      </button>
      <template v-if="mine">
        <button type="button" title="Изменить" aria-label="Изменить" @click.stop="actions.edit(msg)">
          <svg viewBox="0 0 20 20"><path d="M12.5 4.5l3 3L7 16H4v-3l8.5-8.5zM11 6l3 3" /></svg>
        </button>
        <button type="button" class="danger" title="Удалить" aria-label="Удалить" @click.stop="actions.remove(msg)">
          <svg viewBox="0 0 20 20"><path d="M4 6h12M8 6V4h4v2M6 6l.8 10h6.4L14 6" /></svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { downloadUrl } from "~/shared/api/chat-api";
import type { Message, ReplySnapshot } from "~/shared/types";
import { formatFileSize, makeURL, parseMessageDate } from "~/shared/utils/helpers";
import { useUserStore } from "~/store/userStore";
import { CHAT_ACTIONS } from "~/shared/chat-actions";

const { msg, selected = false } = defineProps<{
  msg: Message;
  /** Сообщение выбрано нажатием (на телефоне) — показать действия. */
  selected?: boolean;
}>();

const userStore = useUserStore();
const actions = inject(CHAT_ACTIONS)!;
const partner = inject<Ref<{ name: string; nickname?: string } | null>>("user", ref(null));

const me = computed(() => userStore.user?.id);
const mine = computed(() => msg.senderId === me.value);
const isServer = computed(() => msg.status === "server");
const partnerName = computed(() => partner.value?.nickname || partner.value?.name || "Собеседник");

const extension = computed(() => {
  const ext = msg.fileName?.split(".").pop();
  return ext && ext !== msg.fileName ? ext.slice(0, 4).toUpperCase() : "FILE";
});

const stateTitle = computed(() => {
  if (msg.pending === "sending") return "Отправляется";
  if (msg.pending === "failed") return "Не отправлено";
  return msg.isRead ? "Прочитано" : "Доставлено";
});

function quoteText(reply: ReplySnapshot) {
  if (reply.text) return reply.text;
  return { image: "Изображение", video: "Видео", file: "Файл", none: "Сообщение" }[reply.mediaType];
}
</script>

<style scoped lang="scss">
.plain-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: min(560px, 70%);

  @include tablet {
    max-width: 80%;
  }

  @include mobile {
    max-width: 88%;
  }

  &.mine {
    flex-direction: row-reverse;
  }

  // Ширину ограничивает строка, пузырь занимает её целиком.
  .chat_message.message {
    max-width: 100%;
    min-width: 0;
  }

  &.failed .chat_message.message {
    opacity: 0.6;
  }

  &.failed {
    flex-direction: column;
    align-items: flex-end;
  }
}

.quote {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin: 1px -4px 3px;
  padding: 5px 10px;
  border: none;
  border-left: 3px solid $primary-hover;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.07);
  color: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  b {
    font-weight: 600;
    color: #c3adff;
  }

  span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    opacity: 0.8;
  }
}

.message_wrapper.right .quote {
  border-left-color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.15);

  b {
    color: $white;
  }
}

.media {
  cursor: zoom-in;
}

video.media {
  cursor: default;
}

.file {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
  margin: 2px -4px 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.18);
  color: inherit;
  text-decoration: none;

  @media (hover: hover) {
    &[href]:hover {
      background: rgba(0, 0, 0, 0.28);
    }
  }
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(131, 85, 250, 0.35);
  color: $white;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.message_wrapper.right .file-icon {
  background: rgba(255, 255, 255, 0.22);
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  b {
    font-size: 14px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    font-size: 12px;
    opacity: 0.7;
  }
}

.meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: -1px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);

  .edited {
    font-style: italic;
  }
}

.message_wrapper.right .meta {
  color: rgba(255, 255, 255, 0.7);
}

.state {
  display: inline-flex;

  svg {
    width: 16px;
    height: 13px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .ticks.read {
    color: #a7f3d0;
  }

  .error {
    color: #ffb4b4;
  }
}

.failed-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #ff8a8a;

  button {
    padding: 0;
    border: none;
    background: none;
    color: #c3adff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
}

.actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    @media (hover: hover) {
      &:hover {
        background: rgba(255, 255, 255, 0.12);
        color: $white;
      }

      &.danger:hover {
        color: #ff8a8a;
      }
    }
  }

  &.open {
    opacity: 1;
    pointer-events: auto;
  }
}

@media (hover: hover) {
  .plain-row:hover .actions {
    opacity: 1;
    pointer-events: auto;
  }
}

// На телефоне кнопки не помещаются сбоку — показываем их под пузырём.
@include touch {
  .plain-row {
    flex-wrap: wrap;
  }

  .actions:not(.open) {
    display: none;
  }
}
</style>
