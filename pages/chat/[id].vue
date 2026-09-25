<template>
  <div class="dialog flex flex-col w-full min-w-0" v-if="user">
    <div class="head flex flex-wrap justify-between gap-3 md:gap-6 w-full px-4 md:px-6 py-3.25">
      <div class="info flex items-center gap-3 md:gap-4 min-w-0">
        <NuxtLink to="/chat" class="back" aria-label="К списку чатов">
          <IconsWideArrow />
        </NuxtLink>
        <UIUserAvatar class="cursor-pointer" :src="makeURL(user.avatar)" @click="navigateTo(`/profile/${user.id}`)" />
        <div class="flex flex-col gap-1">
          <p class="cursor-pointer" @click="navigateTo(`/profile/${user.id}`)">
            {{ user.nickname || user.name }}
          </p>
          <div class="flex gap-1 items-center">
            <template v-if="isOnline">
              <div class="w-2.5 h-2.5 rounded-full bg-[#68d391]"></div>
              <span>Online</span>
            </template>
            <template v-else>
              <div class="w-2.5 h-2.5 rounded-full bg-[#ff6969]"></div>
              <span>{{ user.last_seen ? useOrderCreated(user.last_seen) : "Не в сети" }}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="actions flex gap-3">
        <button class="button view" @click="navigateTo(`/mutual/${user.id}`)">
          <IconsSuggest></IconsSuggest>
          Активные заказы ({{ ordersBetweenUsers.length }})
        </button>
        <button class="button request" @click="navigateTo(`/orders/suggest?id=${user.id}`)">
          <IconsOrder></IconsOrder>
          Предложить заказ
        </button>
      </div>
    </div>
    <div ref="messagesRef" class="messages w-full h-full flex flex-col gap-3 p-4 md:p-6 overflow-y-auto">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message_wrapper w-full flex"
        :class="[
          msg.senderId !== user.id ? 'right' : 'left',
          msg.status === 'server' ? 'server w-full justify-center!' : 'justify-end',
        ]"
      >
        <ChatMessage
          :msg="msg"
          @accept-response="openAcceptModal"
          @open-modal="openAcceptModal"
          @delete-response="handleDeleteResponse"
          @reject-response="chat.rejectMessage"
          @delete-suggest="chat.deleteMessage"
        />
      </div>
    </div>
    <div class="input_wrapper flex items-center gap-3 w-full px-4 md:px-6 py-3">
      <label class="relative flex items-center gap-2 cursor-pointer" :title="file?.name ?? 'Прикрепить файл'">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.88558 3.36262C11.8283 0.545794 16.5864 0.545794 19.5291 3.36262C22.4903 6.19714 22.4903 10.807 19.5291 13.6415L11.581 21.2495C9.49097 23.2502 6.11532 23.2502 4.02525 21.2495C1.91669 19.2312 1.91669 15.9446 4.02525 13.9263L11.859 6.42771C13.0964 5.24324 15.0896 5.24325 16.327 6.42771C17.5829 7.62989 17.5829 9.59316 16.327 10.7953L8.43612 18.3486C8.13689 18.635 7.66213 18.6247 7.37571 18.3254C7.08929 18.0262 7.09967 17.5515 7.39889 17.265L15.2898 9.71175C15.9286 9.10021 15.9286 8.12285 15.2898 7.5113C14.6324 6.88205 13.5536 6.88205 12.8962 7.5113L5.06248 15.0098C3.57095 16.4376 3.57095 18.7382 5.06248 20.1659C6.57251 21.6114 9.03377 21.6114 10.5438 20.1659L18.4919 12.5579C20.836 10.314 20.836 6.6901 18.4919 4.4462C16.1292 2.1846 12.2855 2.1846 9.9228 4.4462L3.51861 10.5764C3.21939 10.8628 2.74463 10.8524 2.45821 10.5532C2.17179 10.254 2.18216 9.77924 2.48139 9.49281L8.88558 3.36262Z"
            :fill="file ? '#8355FA' : '#494949'"
          />
        </svg>
        <input
          class="absolute opacity-0 w-full h-full top-0 left-0"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          @change="pickFile"
        />
      </label>
      <form class="input flex w-full rounded-md px-5 py-2.5" @submit.prevent="sendMessage">
        <input
          v-model="text"
          class="w-full bg-transparent border-none outline-none"
          type="text"
          maxlength="2000"
          :placeholder="file ? `Файл: ${file.name}` : 'Сообщение'"
        />
        <button type="submit" class="bg-transparent border-none cursor-pointer" :disabled="sending">
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
import { makeURL, scrollToBottom } from "~/shared/utils/helpers";
import { useNotifications } from "~/store/notiStore";
import { useOrderStore } from "~/store/orderStore";
import { useUserStore } from "~/store/userStore";

const ONLINE_WINDOW_MS = 60_000;

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

// --- Отправка ---

const text = shallowRef("");
const file = ref<File | null>(null);
const sending = shallowRef(false);

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
.messages {
  @include hidden-scrollbar;
}

.head {
  border-bottom: 1px solid $chat-border;

  .back {
    display: none;
    padding: 8px 4px;
  }

  .info {
    p {
      color: $text-main;
      font-weight: 600;
      font-size: 20px;
    }

    span {
      color: $text-main;
      font-size: 12px;
      font-weight: 600;
    }
  }

  .button {
    cursor: pointer;
    border-radius: 6px;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    outline: none;
    font-weight: 600;
    white-space: nowrap;
  }

  // Узкий экран: кнопки заказов — отдельной строкой на всю ширину.
  @include tablet {
    .actions {
      width: 100%;

      .button {
        flex: 1;
        min-width: 0;
        white-space: normal;
      }
    }
  }

  @include mobile {
    .back {
      display: flex;
    }
    .info p {
      font-size: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .actions {
      .button {
        padding: 8px;
        font-size: 13px;
      }
    }
  }

  .request {
    background: rgba(139, 96, 250, 0.1);
    color: $primary;
  }

  .view {
    background: rgba(198, 246, 213, 0.102);
    color: $bg-button-success;
  }
}

.message_wrapper {
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
    .message {
      background: transparent !important;
      color: $text-placeholder;
    }
  }
}

.input_wrapper {
  border-top: 1px solid $chat-border;

  .input {
    background: $tag-secondary-color;

    input {
      color: $text-main;
      font-size: 14px;
    }
  }
}
</style>
