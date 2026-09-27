<template>
  <div class="dialog flex flex-col w-full min-w-0" v-if="user">
    <div class="head">
      <div class="info">
        <NuxtLink to="/chat" class="back" aria-label="К списку чатов">
          <IconsWideArrow />
        </NuxtLink>
        <UIUserAvatar
          class="cursor-pointer"
          size="44px"
          :src="makeURL(user.avatar)"
          :name="user.name"
          @click="navigateTo(`/profile/${user.id}`)"
        />
        <div class="who">
          <p class="name" @click="navigateTo(`/profile/${user.id}`)">{{ user.nickname || user.name }}</p>
          <span class="presence" :class="{ online: isOnline }">
            <i></i>
            {{
              isOnline
                ? "В сети"
                : user.last_seen
                  ? `Последний раз в сети ${useOrderCreated(user.last_seen)}`
                  : "Не в сети"
            }}
          </span>
        </div>
      </div>
      <div class="actions">
        <button class="action" @click="navigateTo(`/mutual/${user.id}`)">
          <IconsSuggest />
          <span>Активные заказы</span>
          <b>{{ ordersBetweenUsers.length }}</b>
        </button>
        <button class="action primary" @click="navigateTo(`/orders/suggest?id=${user.id}`)">
          <IconsOrder />
          <span>Предложить заказ</span>
        </button>
      </div>
    </div>

    <div ref="messagesRef" class="messages">
      <p v-if="!messages.length" class="no-messages">Сообщений пока нет — напишите первым</p>
      <template v-for="row in rows" :key="row.msg.id">
        <div v-if="row.day" class="day"><span>{{ row.day }}</span></div>
        <div
          class="message_wrapper"
          :class="[
            row.msg.senderId !== user.id ? 'right' : 'left',
            { server: row.msg.status === 'server', grouped: row.grouped },
          ]"
        >
          <ChatMessage
            :msg="row.msg"
            @accept-response="openAcceptModal"
            @open-modal="openAcceptModal"
            @delete-response="handleDeleteResponse"
            @reject-response="chat.rejectMessage"
            @delete-suggest="chat.deleteMessage"
          />
        </div>
      </template>
    </div>

    <div class="composer">
      <div v-if="file" class="file-chip">
        <IconsPaperclip />
        <span>{{ file.name }}</span>
        <button type="button" aria-label="Убрать файл" @click="file = null">×</button>
      </div>
      <form class="row" @submit.prevent="sendMessage">
        <label class="attach" :class="{ active: file }" title="Прикрепить фото или видео">
          <IconsPaperclip />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            @change="pickFile"
          />
        </label>
        <input v-model="text" class="field" type="text" maxlength="2000" placeholder="Сообщение" />
        <button type="submit" class="send" :disabled="!canSend" aria-label="Отправить">
          <IconsSend />
        </button>
      </form>
    </div>
  </div>
  <div class="dialog flex flex-col w-full min-w-0 items-center justify-center" v-else>
    <UILoader />
  </div>

  <LazyChatAcceptModal
    v-if="acceptTarget && acceptOrder"
    :order="acceptOrder"
    @close="acceptTarget = null"
    @accept="acceptOffer"
    @reject="rejectOffer"
  />
</template>

<script setup lang="ts">
import { api, call } from "~/shared/api";
import {
  deleteResponse,
  getOrdersBetweenUsers,
  getResponseById,
  type Order,
  type OrderResponse,
} from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import type { Message } from "~/shared/types";
import { makeURL, messageDayLabel, scrollToBottom } from "~/shared/utils/helpers";
import { useNotifications } from "~/store/notiStore";
import { useOrderStore } from "~/store/orderStore";
import { useUserStore } from "~/store/userStore";

const ONLINE_WINDOW_MS = 60_000;
/** Сообщения одного автора ближе этого интервала идут плотной группой. */
const GROUP_WINDOW_MS = 5 * 60_000;

const route = useRoute();
const userStore = useUserStore();
const orderStore = useOrderStore();
const notifications = useNotifications();
const chat = useChatSocket();

const otherId = computed(() => route.params.id as string);

const messagesRef = ref<HTMLDivElement | null>(null);
const user = ref<User | null>(null);
const messages = ref<Message[]>([]);
const ordersInChat = ref<Order[]>([]);
const responsesInChat = ref<OrderResponse[]>([]);
const ordersBetweenUsers = ref<Order[]>([]);

provide("user", user);
provide("ordersInChat", ordersInChat);
provide("responsesInChat", responsesInChat);

const isOnline = computed(
  () =>
    !!user.value?.last_seen &&
    Date.now() - new Date(user.value.last_seen).getTime() < ONLINE_WINDOW_MS,
);

/** Сообщение относится к открытому диалогу. */
function belongsHere(msg: Pick<Message, "senderId" | "receiverId">) {
  const me = userStore.user?.id;
  return (
    (msg.senderId === me && msg.receiverId === otherId.value) ||
    (msg.senderId === otherId.value && msg.receiverId === me)
  );
}

function findMessage(id: string) {
  return messages.value.find((m) => m.id === id);
}

// --- Заказы и отклики, упомянутые в переписке. Догружаем только новые. ---

async function loadMissingOrders() {
  const known = new Set(ordersInChat.value.map((o) => o.id));
  const ids = [...new Set(messages.value.map((m) => m.orderId))].filter(
    (id): id is string => !!id && !known.has(id),
  );
  const loaded = await Promise.all(ids.map((id) => orderStore.getOrder(id)));
  ordersInChat.value.push(...loaded.filter((o): o is Order => o !== null));
}

async function loadMissingResponses() {
  const known = new Set(responsesInChat.value.map((r) => r.id));
  const pending = messages.value.filter((m) => m.responseId && m.orderId && !known.has(m.responseId));
  const loaded = await Promise.all(pending.map((m) => getResponseById(m.orderId!, m.responseId!)));
  responsesInChat.value.push(...loaded.filter((r): r is OrderResponse => r !== null));
}

async function refreshOrdersBetweenUsers() {
  const me = userStore.user?.id;
  if (!me) return;
  ordersBetweenUsers.value = (await getOrdersBetweenUsers(me, otherId.value)) ?? [];
}

// --- Отображение: разделители дней и группы сообщений ---

const rows = computed(() =>
  messages.value.map((msg, i) => {
    const prev = messages.value[i - 1];
    const day = messageDayLabel(msg.createdAt);
    const newDay = !prev || messageDayLabel(prev.createdAt) !== day;
    const grouped =
      !newDay &&
      prev.senderId === msg.senderId &&
      prev.status !== "server" &&
      msg.status !== "server" &&
      new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW_MS;
    return { msg, day: newDay ? day : "", grouped };
  }),
);

// --- Отправка ---

const text = shallowRef("");
const file = ref<File | null>(null);
const sending = shallowRef(false);
const canSend = computed(() => !sending.value && (!!text.value.trim() || !!file.value));

function pickFile(event: Event) {
  const input = event.target as HTMLInputElement;
  file.value = input.files?.[0] ?? null;
  input.value = "";
}

async function sendMessage() {
  // Раньше без текста отправить нельзя было даже файл.
  if (!text.value.trim() && !file.value) return;

  sending.value = true;
  const sent = await chat.sendMessage(otherId.value, text.value.trim(), file.value);
  sending.value = false;

  if (sent) {
    text.value = "";
    file.value = null;
  }
}

// --- Принятие предложений и откликов ---

const acceptTarget = ref<{ orderId: string; messageId: string } | null>(null);
const acceptOrder = computed(() =>
  ordersInChat.value.find((o) => o.id === acceptTarget.value?.orderId),
);

function openAcceptModal(orderId: string, messageId: string) {
  if (!ordersInChat.value.some((o) => o.id === orderId)) {
    notifications.setNotification("Заказ не найден — возможно, его удалили");
    return;
  }
  acceptTarget.value = { orderId, messageId };
}

function acceptOffer() {
  if (acceptTarget.value) chat.acceptMessage(acceptTarget.value.messageId);
  acceptTarget.value = null;
}

function rejectOffer() {
  if (acceptTarget.value) chat.rejectMessage(acceptTarget.value.messageId);
  acceptTarget.value = null;
}

async function handleDeleteResponse(responseId: string, orderId: string, messageId: string) {
  const res = await deleteResponse(responseId, orderId);
  if (res) chat.deleteMessage(res.messageId ?? messageId);
}

// --- События сокета. Подписки снимаются вместе со страницей. ---

chat.on("receiveMessage", async (msg) => {
  if (!belongsHere(msg)) return;
  messages.value.push(msg);
  await Promise.all([loadMissingOrders(), loadMissingResponses()]);
  if (msg.status === "server") await refreshOrdersBetweenUsers();
});
chat.on("messageDeleted", ({ messageId }) => {
  messages.value = messages.value.filter((m) => m.id !== messageId);
});
chat.on("messageAccepted", async ({ messageId }) => {
  const msg = findMessage(messageId);
  if (msg) msg.status = "accepted";
  await refreshOrdersBetweenUsers();
});
chat.on("messageRejected", ({ messageId }) => {
  const msg = findMessage(messageId);
  if (msg) msg.status = "rejected";
});

watch(
  () => messages.value.length,
  () => nextTick(() => scrollToBottom(messagesRef.value)),
);

// Страница переиспользуется при переходе между диалогами — грузим заново.
watch(
  otherId,
  async (id) => {
    user.value = null;
    messages.value = [];
    ordersInChat.value = [];
    responsesInChat.value = [];

    const [profile, history] = await Promise.all([
      userStore.getUserId(id),
      call(api.get<Message[]>("/chat", { params: { user: id } })),
    ]);
    if (!profile) {
      navigateTo("/chat");
      return;
    }

    messages.value = history ?? [];
    await Promise.all([loadMissingOrders(), loadMissingResponses(), refreshOrdersBetweenUsers()]);
    user.value = profile;
    await nextTick();
    scrollToBottom(messagesRef.value);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
// Без min-height: 0 колонка растягивается по содержимому и лента не прокручивается.
.dialog {
  min-height: 0;
}

// --- Шапка диалога ---
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding: 14px 24px;
  border-bottom: 1px solid $chat-border;

  .info {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .back {
    display: none;
    padding: 8px 4px;
  }

  .who {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .name {
    font-weight: 600;
    font-size: 18px;
    color: $text-main;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // Точка присутствия: зелёная — в сети, серая — нет. Раньше «не в сети»
  // было красным, как ошибка.
  .presence {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    i {
      flex-shrink: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6b6b75;
    }

    &.online {
      color: #7fd9a6;

      i {
        background: #38d17a;
        box-shadow: 0 0 0 3px rgba(56, 209, 122, 0.18);
      }
    }
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    color: $text-main;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;

    :deep(svg) {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    b {
      min-width: 20px;
      padding: 0 6px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      font-size: 12px;
      line-height: 20px;
      text-align: center;
    }

    &.primary {
      border-color: rgba(131, 85, 250, 0.45);
      background: rgba(131, 85, 250, 0.14);
      color: #c3adff;
    }

    @media (hover: hover) {
      &:hover {
        background: rgba(255, 255, 255, 0.07);
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.primary:hover {
        background: rgba(131, 85, 250, 0.24);
        border-color: rgba(131, 85, 250, 0.7);
      }
    }
  }

  @include tablet {
    padding: 12px 16px;

    .actions {
      width: 100%;
    }

    .action {
      flex: 1;
      justify-content: center;
    }
  }

  @include mobile {
    .back {
      display: flex;
    }

    .name {
      font-size: 16px;
    }

    .action {
      height: 36px;
      padding: 0 10px;
      font-size: 13px;
    }
  }
}

// --- Лента сообщений ---
.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 24px;
  overflow-y: auto;
  @include hidden-scrollbar;

  @include mobile {
    padding: 16px 12px;
  }
}

.no-messages {
  margin: auto;
  color: $text-placeholder;
  font-size: 14px;
}

// Разделитель дня: «Сегодня», «Вчера», «25 сентября».
.day {
  display: flex;
  justify-content: center;
  margin: 8px 0 2px;

  span {
    padding: 4px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.55);
    font-size: 12px;
    font-weight: 500;
  }
}

.message_wrapper {
  display: flex;
  width: 100%;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
  }

  // Подряд идущие сообщения одного автора — плотнее.
  &.grouped {
    margin-top: -6px;
  }

  &.server {
    justify-content: center;
  }
}

// --- Поле ввода ---
.composer {
  padding: 12px 24px 16px;
  border-top: 1px solid $chat-border;

  @include mobile {
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .attach {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: #8a8a94;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    :deep(svg) {
      width: 22px;
      height: 22px;
    }

    // У иконки скрепки цвет зашит в SVG — перекрашиваем в цвет кнопки.
    :deep(path) {
      fill: currentColor;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    &.active {
      color: $primary;
    }

    @media (hover: hover) {
      &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: $white;
      }
    }
  }

  .field {
    flex: 1;
    min-width: 0;
    height: 44px;
    padding: 0 18px;
    border: 1px solid transparent;
    border-radius: 22px;
    background: $tag-secondary-color;
    color: $text-main;
    font-size: 15px;
    outline: none;
    transition: border-color 0.15s ease;

    &::placeholder {
      color: #8a8a94;
    }

    &:focus {
      border-color: rgba(131, 85, 250, 0.5);
    }
  }

  .send {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: $primary;
    cursor: pointer;
    transition:
      background 0.15s ease,
      opacity 0.15s ease,
      transform 0.1s ease;

    // Самолётик фиолетовый — на фиолетовой кнопке делаем его белым.
    :deep(svg) {
      width: 20px;
      height: 20px;
    }

    :deep(path) {
      fill: $white;
    }

    &:active:not(:disabled) {
      transform: scale(0.94);
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background: $primary-hover;
      }
    }
  }

  // Выбранный файл — плашка над полем, с крестиком.
  .file-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: 100%;
    margin: 0 0 10px 54px;
    padding: 6px 8px 6px 12px;
    border-radius: 10px;
    background: rgba(131, 85, 250, 0.14);
    color: #c3adff;
    font-size: 13px;

    @include mobile {
      margin-left: 0;
    }

    :deep(svg) {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: $white;
      font-size: 16px;
      line-height: 1;
      cursor: pointer;
    }
  }
}
</style>
