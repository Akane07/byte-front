<template>
  <div class="flex flex-col w-full" v-if="renderChat">
    <div class="head flex justify-between gap-6 w-full px-6 py-3.25">
      <template v-if="user">
        <div class="info flex items-center gap-4">
          <UIUserAvatar class="cursor-pointer" :src="makeURL(user.avatar)" @click="navigateTo(`/profile/${user.id}`)">
          </UIUserAvatar>
          <div class="flex flex-col gap-1">
            <p class="cursor-pointer" @click="navigateTo(`/profile/${user.id}`)">
              {{ user?.name }}
            </p>
            <div class="flex gap-1 items-center">
              <template v-if="isOnline">
                <div class="w-2.5 h-2.5 rounded-full bg-[#68d391]"></div>
                <span>Online</span>
              </template>
              <template v-else>
                <div class="w-2.5 h-2.5 rounded-full bg-[#ff6969]"></div>
                <span>{{ useOrderCreated(user.last_seen) }}</span>
              </template>
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="button view" @click="navigateTo(`/mutual/${user.id}`)">
            <IconsSuggest></IconsSuggest>
            Активные заказы ({{ ordersBetweenUsers.length }})
          </button>
          <button class="button request" @click="navigateTo(`/orders/suggest?id=${user.id}`)">
            <IconsOrder></IconsOrder>
            Предложить заказ
          </button>
        </div>
      </template>
    </div>
    <div ref="messagesRef" class="w-full h-full flex flex-col gap-3 p-6 overflow-y-scroll"
      style="scrollbar-width: none">
      <template v-if="user">
        <div v-for="msg in messages" :key="msg.id" class="message_wrapper w-full flex" :class="[
          msg.senderId !== user.id ? 'right' : 'left',
          msg.status === 'server'
            ? 'server w-full justify-center!'
            : 'justify-end',
        ]">
          <ChatMessage :msg="msg" @accept-response="openModal" @delete-response="handleDeleteResponse"
            @reject-response="handleRejectSuggest" @reject-suggest="handleRejectSuggest"
            @delete-suggest="handleDeleteSuggest" @open-modal="openModal"></ChatMessage>
        </div>
      </template>
    </div>
    <div class="input_wrapper flex items-center gap-3 w-full px-6 py-3">
      <div class="relative flex items-center gap-2 cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M8.88558 3.36262C11.8283 0.545794 16.5864 0.545794 19.5291 3.36262C22.4903 6.19714 22.4903 10.807 19.5291 13.6415L11.581 21.2495C9.49097 23.2502 6.11532 23.2502 4.02525 21.2495C1.91669 19.2312 1.91669 15.9446 4.02525 13.9263L11.859 6.42771C13.0964 5.24324 15.0896 5.24325 16.327 6.42771C17.5829 7.62989 17.5829 9.59316 16.327 10.7953L8.43612 18.3486C8.13689 18.635 7.66213 18.6247 7.37571 18.3254C7.08929 18.0262 7.09967 17.5515 7.39889 17.265L15.2898 9.71175C15.9286 9.10021 15.9286 8.12285 15.2898 7.5113C14.6324 6.88205 13.5536 6.88205 12.8962 7.5113L5.06248 15.0098C3.57095 16.4376 3.57095 18.7382 5.06248 20.1659C6.57251 21.6114 9.03377 21.6114 10.5438 20.1659L18.4919 12.5579C20.836 10.314 20.836 6.6901 18.4919 4.4462C16.1292 2.1846 12.2855 2.1846 9.9228 4.4462L3.51861 10.5764C3.21939 10.8628 2.74463 10.8524 2.45821 10.5532C2.17179 10.254 2.18216 9.77924 2.48139 9.49281L8.88558 3.36262Z"
            fill="#494949" />
        </svg>
        <input class="absolute opacity-0 w-full h-full top-0 left-0" type="file" accept="image/*, video/*"
          @change="file = $event.target.files[0]" />
      </div>
      <div class="input flex w-full rounded-md px-5 py-2.5">
        <input class="w-full bg-transparent border-none outline-none" type="text" v-model="text"
          @keyup.enter="sendMessage" />
        <IconsSend @click="sendMessage"></IconsSend>
      </div>
    </div>
  </div>
  <div class="flex flex-col w-full items-center justify-center" v-else>
    <UILoader />
  </div>

  <LazyChatAcceptModal v-if="modalAccept && order" :order="order" @close="modalAccept = false"
    @accept="handleAcceptSuggest(currentMessageId)" @reject="handleRejectSuggest(currentMessageId)">
  </LazyChatAcceptModal>
</template>

<script setup lang="ts">
import { api } from "~/shared/api";
import {
  deleteResponse,
  getOrdersBetweenUsers,
  getResponseById,
  type Order,
} from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import { makeURL, scrollToBottom } from "~/shared/utils/helpers";
import { useOrderStore } from "~/store/orderStore";
import { useUserStore } from "~/store/userStore";

const route = useRoute();
const userStore = useUserStore();
const orderStore = useOrderStore();

const {
  socket,
  messages,
  connect,
  deleteMessageEvent,
  rejectMessageEvent,
  acceptMessageEvent,
  sendMessageEvent,
} = useChatSocket();

const messagesRef = ref<HTMLDivElement | null>(null);
const renderChat = shallowRef(false);
const user = ref<User | null>(null);
const order = ref<Order | null>(null);

provide("user", user);
provide("userStore", userStore);

const isOnline = computed(() => {
  if (!user.value) return;
  return (
    new Date().getTime() - new Date(user.value.last_seen).getTime() < 60000
  );
});

const text = shallowRef("");
const file = ref<File | null>(null);
const sendMessage = async () => {
  if (!user.value) return;
  if (!text.value) return;

  sendMessageEvent(userStore.user!.id, user.value.id, text.value, file);

  text.value = "";
  file.value = null;
};

const modalAccept = shallowRef(false);
const currentMessageId = shallowRef("");
async function openModal(orderId: string, messageId: string) {
  order.value = await orderStore.getOrder(orderId);
  currentMessageId.value = messageId;
  modalAccept.value = true;
}

async function handleAcceptSuggest(id: string) {
  modalAccept.value = false;

  const type = order.value?.user_id === userStore.user?.id ? "buyer" : "seller";

  acceptMessageEvent({
    senderId: userStore.user?.id,
    receiverId: user.value?.id,
    messageId: id,
    name: userStore.user?.name,
    orderId: order.value?.id,
    type,
  });

  await setOrdersBetweenUsers();
}

async function handleRejectSuggest(id: string) {
  rejectMessageEvent({
    senderId: userStore.user?.id,
    receiverId: user.value?.id,
    messageId: id,
    name: userStore.user?.name,
  });

  modalAccept.value = false;
}

async function handleDeleteSuggest(id: string) {
  deleteMessageEvent({
    senderId: userStore.user?.id,
    receiverId: user.value?.id,
    messageId: id,
  });
}

async function handleDeleteResponse(
  id: string,
  orderId: string,
  messageId: string
) {
  await deleteResponse(id, orderId);

  deleteMessageEvent({
    senderId: userStore.user?.id,
    receiverId: user.value?.id,
    messageId,
  });
}

watch(
  messages,
  () => {
    nextTick(async () => {
      scrollToBottom(messagesRef.value);
      await searchForOrders();
      await searchForResponses();
    });
  },
  { deep: true }
);

const ordersInChat = ref<any[]>([]);
const responsesInChat = ref<any[]>([]);
const ordersBetweenUsers = ref<Order[]>([]);

provide("ordersInChat", ordersInChat);
provide("responsesInChat", responsesInChat);

async function searchForOrders() {
  ordersInChat.value = messages.value.filter((msg) => msg.orderId);
  ordersInChat.value = ordersInChat.value.reduce((acc, msg) => {
    if (!acc.find((m: any) => m.orderId === msg.orderId)) {
      return [...acc, msg];
    }
    return acc;
  }, []);

  ordersInChat.value = await Promise.all(
    ordersInChat.value.map(async (msg) => {
      if (!msg.orderId) return;
      const order = await orderStore.getOrder(msg.orderId);
      return order;
    })
  );

  ordersInChat.value = ordersInChat.value.filter(Boolean);
}

async function searchForResponses() {
  responsesInChat.value = messages.value.filter((msg) => msg.responseId);
  responsesInChat.value = responsesInChat.value.reduce((acc, msg) => {
    if (!acc.find((m: any) => m.responseId === msg.responseId)) {
      return [...acc, msg];
    }
    return acc;
  }, []);

  responsesInChat.value = await Promise.all(
    responsesInChat.value.map(async (msg) => {
      if (!msg.orderId) return;

      const res = await getResponseById(msg.orderId, msg.responseId);
      return res;
    })
  );

  responsesInChat.value = responsesInChat.value.filter(Boolean);
}

async function setOrdersBetweenUsers() {
  ordersBetweenUsers.value = await getOrdersBetweenUsers(
    userStore.user?.id as string,
    user.value?.id as string
  );
}

onMounted(async () => {
  await userStore.checkAuth();
  user.value = await userStore.getUserId(route.params.id as string);
  const res = await api.get(`/chat?user=${route.params.id as string}`);
  messages.value = res.data;
  await searchForOrders();
  await searchForResponses();
  await setOrdersBetweenUsers();

  connect(route.params.id as string);

  socket.value?.on("messageAccepted", async (msg: { messageId: string }) => {
    const index = messages.value.findIndex(
      (m) => m.id === msg.messageId
    ) as number;
    messages.value[index].status = "accepted";
    await setOrdersBetweenUsers();
  });

  setTimeout(() => {
    renderChat.value = true;

    nextTick(() => {
      scrollToBottom(messagesRef.value);
    });
  }, 300);
});
</script>

<style lang="scss" scoped>
.head {
  border-bottom: 1px solid $chat-border;

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
