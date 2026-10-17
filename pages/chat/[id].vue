<template>
  <div
    class="dialog flex flex-col w-full min-w-0"
    v-if="user"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="head">
      <div class="info">
        <NuxtLink to="/chat" class="back" aria-label="К списку чатов">
          <IconsWideArrow />
        </NuxtLink>
        <div class="avatar" :class="{ online: isOnline }">
          <UIUserAvatar
            class="cursor-pointer"
            size="44px"
            :src="makeURL(user.avatar)"
            :name="user.name"
            @click="navigateTo(`/profile/${user.id}`)"
          />
        </div>
        <div class="who">
          <p class="name" @click="navigateTo(`/profile/${user.id}`)">{{ partnerName }}</p>
          <span class="presence" :class="{ online: isOnline, typing: isTyping }">
            <template v-if="isTyping">печатает<i class="dots"><b></b><b></b><b></b></i></template>
            <template v-else>{{ presenceLabel(isOnline, lastSeen) }}</template>
          </span>
        </div>
      </div>
      <div class="actions">
        <button class="action primary" @click="navigateTo(`/orders/suggest?id=${user.id}`)">
          <IconsOrder />
          <span>Предложить заказ</span>
        </button>
      </div>
    </div>

    <ChatDealBar :orders="ordersBetweenUsers" :me-id="me" @submit-work="openSubmitWork" />

    <div class="messages-area">
      <div ref="messagesRef" class="messages" @scroll.passive="onScroll" @click="selectedId = null">
        <div v-if="loadingOlder" class="older-loader"><UILoader /></div>
        <div v-if="!hasMore" class="intro">
          <p>{{ messages.length ? "Начало переписки" : "Сообщений пока нет — напишите первым" }}</p>
          <span>
            Договаривайтесь об условиях и сдавайте работу через карточки заказа в чате — так у сделки
            остаётся история, и её всегда можно проверить.
          </span>
        </div>

        <template v-for="row in rows" :key="row.msg.clientId ?? row.msg.id">
          <div v-if="row.day" class="day"><span>{{ row.day }}</span></div>
          <div v-if="row.msg.id === firstUnreadId" class="unread-divider"><span>Новые сообщения</span></div>
          <div
            class="message_wrapper"
            :data-id="row.msg.id"
            :class="[
              row.msg.senderId === me ? 'right' : 'left',
              {
                server: row.msg.status === 'server',
                grouped: row.grouped,
                highlight: highlightId === row.msg.id,
              },
            ]"
            @click.stop="toggleSelected(row.msg)"
          >
            <ChatMessage
              :msg="row.msg"
              :selected="selectedId === row.msg.id"
              @accept-response="openAcceptModal"
              @open-modal="openAcceptModal"
              @delete-response="handleDeleteResponse"
              @reject-response="chat.rejectMessage"
              @delete-suggest="chat.deleteMessage"
            />
          </div>
        </template>
      </div>

      <button v-if="showJump" type="button" class="jump" aria-label="К последним сообщениям" @click="jumpToBottom">
        <span v-if="newBelow" class="jump-count">{{ newBelow }}</span>
        <svg viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" /></svg>
      </button>
    </div>

    <ChatComposer
      ref="composerRef"
      :partner-id="otherId"
      :partner-name="partnerName"
      :reply-to="replyTarget"
      :editing="editTarget"
      @send="send"
      @save-edit="saveEdit"
      @cancel="replyTarget = editTarget = null"
      @typing="chat.typing(otherId)"
    />

    <div v-if="dragging" class="drop-zone">
      <IconsPaperclip />
      <p>Отпустите файл, чтобы прикрепить его</p>
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

  <LazyChatLightbox v-if="lightbox" :src="lightbox" @close="lightbox = ''" />

  <UIModal v-if="confirm" :title="confirm.title" @close="confirm = null">
    <template #body>
      <p class="confirm-text">{{ confirm.text }}</p>
    </template>
    <template #buttons>
      <UIButton @click.stop="confirm = null">Отмена</UIButton>
      <UIButton type="active" @click.stop="runConfirm">{{ confirm.action }}</UIButton>
    </template>
  </UIModal>

  <UIModal v-if="submitOrder" title="Сдать работу" @close="submitOrder = null">
    <template #body>
      <div class="submit-work">
        <p>
          Заказ «{{ submitOrder.title }}» уйдёт заказчику на проверку. Он примет работу или вернёт её на
          доработку.
        </p>
        <UITextarea
          v-model="submitText"
          placeholder="Что сделано и где посмотреть результат: ссылка, архив, инструкция"
          maxlength="4000"
        />
        <span>Файлы с результатом можно отправить обычным сообщением.</span>
      </div>
    </template>
    <template #buttons>
      <UIButton @click.stop="submitOrder = null">Отмена</UIButton>
      <UIButton type="active" @click.stop="submitWork">Отправить на проверку</UIButton>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { getHistory, uploadChatFile, type UploadedFile } from "~/shared/api/chat-api";
import {
  deleteResponse,
  getOrdersBetweenUsers,
  getResponseById,
  type Order,
  type OrderResponse,
} from "~/shared/api/order-api";
import type { User } from "~/shared/api/user-api";
import { CHAT_ACTIONS } from "~/shared/chat-actions";
import type { Message, ReplySnapshot } from "~/shared/types";
import { copyText, makeURL, messageDayLabel, presenceLabel, scrollToBottom } from "~/shared/utils/helpers";
import { useChatStore } from "~/store/chatStore";
import { useNotifications } from "~/store/notiStore";
import { useOrderStore } from "~/store/orderStore";
import { useUserStore } from "~/store/userStore";

/** Сообщения одного автора ближе этого интервала идут плотной группой. */
const GROUP_WINDOW_MS = 5 * 60_000;
/** Ближе этого к низу ленты — считаем, что пользователь читает последние сообщения. */
const NEAR_BOTTOM_PX = 120;
/** Сколько ждать подтверждения сервера, прежде чем считать сообщение неотправленным. */
const SEND_TIMEOUT_MS = 15_000;

const route = useRoute();
const userStore = useUserStore();
const orderStore = useOrderStore();
const chatStore = useChatStore();
const notifications = useNotifications();
const chat = useChatSocket();

const otherId = computed(() => route.params.id as string);
const me = computed(() => userStore.user?.id);

const messagesRef = ref<HTMLDivElement | null>(null);
const composerRef = ref<{ setFile(file: File | null): void; focus(): void } | null>(null);
const user = ref<User | null>(null);
const messages = ref<Message[]>([]);
const hasMore = shallowRef(false);
const loadingOlder = shallowRef(false);
const ordersInChat = ref<Order[]>([]);
const responsesInChat = ref<OrderResponse[]>([]);
const ordersBetweenUsers = ref<Order[]>([]);

provide("user", user);
provide("ordersInChat", ordersInChat);
provide("responsesInChat", responsesInChat);

const partnerName = computed(() => user.value?.nickname || user.value?.name || "");
const isOnline = computed(() => !!chatStore.online[otherId.value]);
const isTyping = computed(() => !!chatStore.typing[otherId.value]);
const lastSeen = computed(() => chatStore.lastSeen[otherId.value] ?? user.value?.last_seen);

/** Сообщение относится к открытому диалогу. */
function belongsHere(msg: Pick<Message, "senderId" | "receiverId">) {
  return (
    (msg.senderId === me.value && msg.receiverId === otherId.value) ||
    (msg.senderId === otherId.value && msg.receiverId === me.value)
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

/**
 * Одно действие со сделкой присылает несколько событий подряд, и каждое
 * перезапрашивает список. Ответы приходят в любом порядке — берём только
 * ответ на последний запрос, иначе устаревший статус затирал новый.
 */
let ordersRequest = 0;
async function refreshOrdersBetweenUsers() {
  if (!me.value) return;
  const request = ++ordersRequest;
  const orders = (await getOrdersBetweenUsers(me.value, otherId.value)) ?? [];
  if (request === ordersRequest) ordersBetweenUsers.value = orders;
}

// --- Отображение: разделители дней и группы сообщений ---

/** Первое непрочитанное входящее на момент открытия диалога — над ним плашка «Новые сообщения». */
const firstUnreadId = shallowRef<string | null>(null);

const rows = computed(() =>
  messages.value.map((msg, i) => {
    const prev = messages.value[i - 1];
    const day = messageDayLabel(msg.createdAt);
    const newDay = !prev || messageDayLabel(prev.createdAt) !== day;
    const grouped =
      !newDay &&
      msg.id !== firstUnreadId.value &&
      prev.senderId === msg.senderId &&
      prev.status !== "server" &&
      msg.status !== "server" &&
      new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW_MS;
    return { msg, day: newDay ? day : "", grouped };
  }),
);

// --- Прокрутка: подгрузка истории вверх, кнопка «вниз» ---

const showJump = shallowRef(false);
/** Сколько новых сообщений пришло, пока пользователь читал историю выше. */
const newBelow = shallowRef(0);

function isNearBottom() {
  const el = messagesRef.value;
  return !el || el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_PX;
}

/** Пользователь внизу ленты — при изменении её высоты остаёмся внизу. */
let stickToBottom = true;

function onScroll() {
  const el = messagesRef.value;
  if (!el) return;
  if (el.scrollTop < 200) loadOlder();
  const near = isNearBottom();
  stickToBottom = near;
  showJump.value = !near;
  if (near) newBelow.value = 0;
}

/**
 * Лента сжимается, когда над полем появляется файл или ответ, а на телефоне —
 * клавиатура. Без этого последнее сообщение уезжало под поле ввода.
 */
const resizeObserver = import.meta.client
  ? new ResizeObserver(() => {
      if (stickToBottom) scrollToBottom(messagesRef.value);
    })
  : null;

watch(messagesRef, (el, old) => {
  if (old) resizeObserver?.unobserve(old);
  if (el) resizeObserver?.observe(el);
});

function jumpToBottom() {
  messagesRef.value?.scrollTo({ top: messagesRef.value.scrollHeight, behavior: "smooth" });
  newBelow.value = 0;
}

/**
 * Предыдущая страница истории. Позиция прокрутки сохраняется: без этого
 * лента «прыгала» бы на подгруженные сверху сообщения.
 */
async function loadOlder() {
  if (!hasMore.value || loadingOlder.value || !messages.value.length) return false;
  loadingOlder.value = true;
  const dialog = otherId.value;
  const oldest = messages.value.find((m) => !m.pending);
  const page = await getHistory(dialog, oldest?.id);
  loadingOlder.value = false;
  if (!page || dialog !== otherId.value) return false;

  const el = messagesRef.value;
  const prevHeight = el?.scrollHeight ?? 0;
  const prevTop = el?.scrollTop ?? 0;
  messages.value = [...page.messages, ...messages.value];
  hasMore.value = page.hasMore;
  await nextTick();
  if (el) el.scrollTop = prevTop + (el.scrollHeight - prevHeight);
  loadMissingOrders();
  loadMissingResponses();
  return true;
}

// --- Прочтение ---

function markReadIfVisible() {
  if (document.hidden || !user.value) return;
  const hasUnread = messages.value.some((m) => m.senderId === otherId.value && !m.isRead);
  if (!hasUnread && !chatStore.unreadByUser[otherId.value]) return;
  for (const m of messages.value) if (m.senderId === otherId.value) m.isRead = true;
  chatStore.clearUnread(otherId.value);
  chat.markRead(otherId.value);
}

function onVisibility() {
  if (!document.hidden) markReadIfVisible();
}

// --- Отправка: сообщение сразу появляется в ленте и помечается «отправляется…» ---

interface Outgoing {
  text: string;
  file: File | null;
  uploaded?: UploadedFile;
  replyTo: ReplySnapshot | undefined;
  objectUrl?: string;
  timer?: ReturnType<typeof setTimeout>;
}

/** Ещё не подтверждённые сервером сообщения — по clientId. */
const outbox = new Map<string, Outgoing>();
const replyTarget = ref<Message | null>(null);
const editTarget = ref<Message | null>(null);

function snapshot(msg: Message): ReplySnapshot {
  return { id: msg.id, senderId: msg.senderId, text: msg.text || msg.fileName || "", mediaType: msg.mediaType };
}

function localMediaType(file: File): Message["mediaType"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "file";
}

function send({ text, file }: { text: string; file: File | null }) {
  if (!me.value) return;
  const clientId = `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const replyTo = replyTarget.value ? snapshot(replyTarget.value) : undefined;
  replyTarget.value = null;

  const mediaType = file ? localMediaType(file) : "none";
  const objectUrl = file && mediaType !== "file" ? URL.createObjectURL(file) : undefined;
  outbox.set(clientId, { text, file, replyTo, objectUrl });

  messages.value.push({
    id: clientId,
    clientId,
    senderId: me.value,
    receiverId: otherId.value,
    text,
    mediaType,
    mediaUrl: objectUrl,
    fileName: file?.name,
    fileSize: file?.size,
    replyTo,
    createdAt: new Date().toISOString(),
    is_suggest: false,
    isRead: false,
    pending: "sending",
  });
  nextTick(() => scrollToBottom(messagesRef.value));
  deliver(clientId);
}

async function deliver(clientId: string) {
  const item = outbox.get(clientId);
  const local = messages.value.find((m) => m.clientId === clientId);
  if (!item || !local) return;
  local.pending = "sending";

  if (item.file && !item.uploaded) {
    const uploaded = await uploadChatFile(item.file);
    if (!uploaded) return fail(clientId);
    item.uploaded = uploaded;
  }

  // Без связи socket.io копит события и отправит их после переподключения —
  // а пользователь к тому времени уже нажмёт «Повторить», и уйдёт дубль.
  if (!chat.socket.connected) return fail(clientId);

  const media = item.uploaded && {
    mediaUrl: item.uploaded.url,
    mediaType: item.uploaded.mediaType,
    fileName: item.uploaded.mediaType === "file" ? item.uploaded.name : undefined,
    fileSize: item.uploaded.mediaType === "file" ? item.uploaded.size : undefined,
  };
  chat.sendMessage({
    receiverId: local.receiverId,
    text: item.text,
    replyToId: item.replyTo?.id,
    clientId,
    ...media,
  });

  clearTimeout(item.timer);
  item.timer = setTimeout(() => fail(clientId), SEND_TIMEOUT_MS);
}

function fail(clientId: string) {
  const local = messages.value.find((m) => m.clientId === clientId);
  if (local?.pending) local.pending = "failed";
  clearTimeout(outbox.get(clientId)?.timer);
}

/** Сервер подтвердил сообщение — заменяем черновик настоящим. */
function confirmSent(msg: Message) {
  const index = messages.value.findIndex((m) => m.pending && m.clientId === msg.clientId);
  if (index === -1) return false;
  const item = outbox.get(msg.clientId!);
  clearTimeout(item?.timer);
  if (item?.objectUrl) URL.revokeObjectURL(item.objectUrl);
  outbox.delete(msg.clientId!);
  // clientId остаётся: по нему строка ленты сохраняет ключ и не перерисовывается.
  messages.value.splice(index, 1, msg);
  return true;
}

function discard(msg: Message) {
  const item = msg.clientId ? outbox.get(msg.clientId) : undefined;
  clearTimeout(item?.timer);
  if (item?.objectUrl) URL.revokeObjectURL(item.objectUrl);
  if (msg.clientId) outbox.delete(msg.clientId);
  messages.value = messages.value.filter((m) => m !== msg);
}

function saveEdit(text: string) {
  const target = editTarget.value;
  editTarget.value = null;
  if (!target || text === target.text) return;
  chat.editMessage(target.id, text);
}

// --- Действия с сообщениями (см. shared/chat-actions.ts) ---

const selectedId = shallowRef<string | null>(null);
const highlightId = shallowRef<string | null>(null);
const lightbox = shallowRef("");
const confirm = ref<{ title: string; text: string; action: string; run: () => void } | null>(null);

/** На телефоне наведения нет — действия открываются нажатием на сообщение. */
function toggleSelected(msg: Message) {
  if (!window.matchMedia("(hover: none)").matches) return;
  selectedId.value = selectedId.value === msg.id ? null : msg.id;
}

function runConfirm() {
  confirm.value?.run();
  confirm.value = null;
}

/** Прокрутить к сообщению и подсветить. Если оно выше загруженного — догружаем. */
async function jumpTo(messageId: string) {
  for (let i = 0; i < 10 && !findMessage(messageId); i++) {
    if (!(await loadOlder())) break;
  }
  const el = messagesRef.value?.querySelector(`[data-id="${messageId}"]`);
  if (!el) {
    notifications.setNotification("Сообщение не найдено — возможно, его удалили");
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  highlightId.value = messageId;
  setTimeout(() => {
    if (highlightId.value === messageId) highlightId.value = null;
  }, 1600);
}

provide(CHAT_ACTIONS, {
  reply(msg) {
    editTarget.value = null;
    replyTarget.value = msg;
    selectedId.value = null;
  },
  edit(msg) {
    replyTarget.value = null;
    editTarget.value = msg;
    selectedId.value = null;
  },
  async copy(msg) {
    selectedId.value = null;
    notifications.setNotification((await copyText(msg.text)) ? "Текст скопирован" : "Не удалось скопировать");
  },
  remove(msg) {
    selectedId.value = null;
    confirm.value = {
      title: "Удалить сообщение?",
      text: "Сообщение пропадёт у вас и у собеседника.",
      action: "Удалить",
      run: () => chat.deleteMessage(msg.id),
    };
  },
  retry: (msg) => msg.clientId && deliver(msg.clientId),
  discard,
  openImage: (url) => (lightbox.value = url),
  jumpTo,
  acceptDelivery(msg) {
    confirm.value = {
      title: "Принять работу?",
      text: "Подтвердите, что работа выполнена. Заказ будет завершён.",
      action: "Принять",
      run: () => chat.acceptMessage(msg.id),
    };
  },
  rejectDelivery(msg) {
    chat.rejectMessage(msg.id);
    notifications.setNotification("Работа возвращена. Напишите исполнителю, что нужно доработать");
    composerRef.value?.focus();
  },
});

// --- Сдача работы ---

const submitOrder = ref<Order | null>(null);
const submitText = shallowRef("");

function openSubmitWork(order: Order) {
  submitText.value = "";
  submitOrder.value = order;
}

function submitWork() {
  if (submitOrder.value) chat.finishOrder(submitOrder.value.id, submitText.value.trim() || undefined);
  submitOrder.value = null;
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

// --- Перетаскивание файла на диалог ---

const dragging = shallowRef(false);
let dragDepth = 0;

function hasFiles(event: DragEvent) {
  return [...(event.dataTransfer?.types ?? [])].includes("Files");
}

function onDragEnter(event: DragEvent) {
  if (!hasFiles(event)) return;
  dragDepth++;
  dragging.value = true;
}

function onDragLeave() {
  dragDepth = Math.max(0, dragDepth - 1);
  if (!dragDepth) dragging.value = false;
}

function onDrop(event: DragEvent) {
  dragDepth = 0;
  dragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) composerRef.value?.setFile(file);
}

// --- События сокета. Подписки снимаются вместе со страницей. ---

chat.on("receiveMessage", async (msg) => {
  if (!belongsHere(msg)) return;
  if (msg.clientId && confirmSent(msg)) return;
  // Своё сообщение из другой вкладки — уже есть в ленте, если пришло дважды.
  if (findMessage(msg.id)) return;

  const near = isNearBottom();
  messages.value.push(msg);
  if (msg.senderId === me.value || near) {
    nextTick(() => scrollToBottom(messagesRef.value));
  } else {
    newBelow.value++;
  }
  if (msg.senderId === otherId.value) markReadIfVisible();

  await Promise.all([loadMissingOrders(), loadMissingResponses()]);
  if (msg.status === "server" || msg.is_delivery) await refreshOrdersBetweenUsers();
});
chat.on("exception", ({ clientId }) => {
  if (clientId && outbox.has(clientId)) fail(clientId);
});
chat.on("messageDeleted", ({ messageId }) => {
  messages.value = messages.value.filter((m) => m.id !== messageId);
});
chat.on("messageEdited", ({ messageId, text, editedAt }) => {
  const msg = findMessage(messageId);
  if (msg) Object.assign(msg, { text, editedAt });
});
chat.on("messagesRead", ({ readerId, partnerId }) => {
  if (readerId !== otherId.value || partnerId !== me.value) return;
  for (const m of messages.value) if (m.senderId === me.value) m.isRead = true;
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
chat.on("orderUpdated", (order) => {
  const known = ordersInChat.value.findIndex((o) => o.id === order.id);
  if (known !== -1) ordersInChat.value.splice(known, 1, order);
  const mine = orderStore.myOrders.find((o) => o.id === order.id);
  if (mine) Object.assign(mine, order);
  refreshOrdersBetweenUsers();
});

// Страница переиспользуется при переходе между диалогами — грузим заново.
watch(
  otherId,
  async (id) => {
    chatStore.activeDialog = id;
    user.value = null;
    messages.value = [];
    hasMore.value = false;
    firstUnreadId.value = null;
    ordersInChat.value = [];
    responsesInChat.value = [];
    replyTarget.value = editTarget.value = null;
    newBelow.value = 0;
    showJump.value = false;
    stickToBottom = true;
    outbox.forEach((item) => clearTimeout(item.timer));
    outbox.clear();

    const [profile, history] = await Promise.all([userStore.getUserId(id), getHistory(id)]);
    if (id !== otherId.value) return;
    if (!profile) {
      navigateTo("/chat");
      return;
    }

    messages.value = history?.messages ?? [];
    hasMore.value = history?.hasMore ?? false;
    firstUnreadId.value = messages.value.find((m) => m.senderId === id && !m.isRead)?.id ?? null;
    if (profile.last_seen && !chatStore.lastSeen[id]) chatStore.lastSeen[id] = profile.last_seen;
    chatStore.queryPresence([id]);

    await Promise.all([loadMissingOrders(), loadMissingResponses(), refreshOrdersBetweenUsers()]);
    user.value = profile;
    await nextTick();

    // Есть непрочитанные — открываем на первом из них, иначе внизу.
    const divider = messagesRef.value?.querySelector(".unread-divider");
    if (divider) divider.scrollIntoView({ block: "start" });
    else scrollToBottom(messagesRef.value);
    markReadIfVisible();
  },
  { immediate: true },
);

onMounted(() => document.addEventListener("visibilitychange", onVisibility));
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  document.removeEventListener("visibilitychange", onVisibility);
  chatStore.activeDialog = null;
  outbox.forEach((item) => {
    clearTimeout(item.timer);
    if (item.objectUrl) URL.revokeObjectURL(item.objectUrl);
  });
});
</script>

<style lang="scss" scoped>
// Без min-height: 0 колонка растягивается по содержимому и лента не прокручивается.
.dialog {
  position: relative;
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

  // Зелёная точка на аватаре — собеседник в сети.
  .avatar {
    position: relative;
    display: flex;

    &.online::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 12px;
      height: 12px;
      border: 2px solid #222228;
      border-radius: 50%;
      background: #38d17a;
    }
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

  .presence {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.45);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.online {
      color: #7fd9a6;
    }

    &.typing {
      color: #c3adff;
    }
  }

  // Три прыгающие точки после «печатает».
  .dots {
    display: inline-flex;
    gap: 2px;
    margin-left: 3px;

    b {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: currentColor;
      animation: typing-dot 1.2s infinite ease-in-out;

      &:nth-child(2) {
        animation-delay: 0.15s;
      }

      &:nth-child(3) {
        animation-delay: 0.3s;
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

    &.primary {
      border-color: rgba(131, 85, 250, 0.45);
      background: rgba(131, 85, 250, 0.14);
      color: #c3adff;
    }

    @media (hover: hover) {
      &.primary:hover {
        background: rgba(131, 85, 250, 0.24);
        border-color: rgba(131, 85, 250, 0.7);
      }
    }
  }

  @include tablet {
    padding: 12px 16px;
  }

  @include mobile {
    flex-wrap: nowrap;

    .back {
      display: flex;
    }

    .name {
      font-size: 16px;
    }

    // На телефоне — только иконка, текст не помещается рядом с именем.
    .action {
      width: 40px;
      height: 40px;
      padding: 0;
      justify-content: center;

      span {
        display: none;
      }
    }
  }
}

@keyframes typing-dot {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }

  30% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

// --- Лента сообщений ---
.messages-area {
  position: relative;
  flex: 1;
  display: flex;
  min-height: 0;
}

.messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  @include hidden-scrollbar;

  @include mobile {
    padding: 16px 12px;
  }
}

.older-loader {
  display: flex;
  justify-content: center;
  padding: 4px 0 8px;
}

// Начало переписки: подсказка, как вести сделку через чат.
.intro {
  align-self: center;
  max-width: 420px;
  margin: 8px 0 12px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  text-align: center;

  p {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 600;
    color: $text-main;
  }

  span {
    font-size: 13px;
    line-height: 1.5;
    color: $text-placeholder;
  }
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

.unread-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px 0;
  color: #c3adff;
  font-size: 12px;
  font-weight: 600;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(131, 85, 250, 0.35);
  }
}

.message_wrapper {
  display: flex;
  width: 100%;
  border-radius: 12px;
  transition: background 0.3s ease;

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

  // Переход по цитате: сообщение ненадолго подсвечивается.
  &.highlight {
    background: rgba(131, 85, 250, 0.16);
  }
}

// Кнопка «к последним сообщениям» со счётчиком новых.
.jump {
  position: absolute;
  right: 20px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  background: #2f2f36;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  cursor: pointer;

  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: $white;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .jump-count {
    position: absolute;
    top: -6px;
    right: -4px;
    min-width: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: $primary;
    color: $white;
    font-size: 11px;
    font-weight: 700;
    line-height: 20px;
    text-align: center;
  }

  @include mobile {
    right: 12px;
  }
}

// Файл тащат на диалог — подсказка поверх всей колонки.
.drop-zone {
  position: absolute;
  inset: 8px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px dashed rgba(131, 85, 250, 0.7);
  border-radius: 14px;
  background: rgba(34, 34, 40, 0.94);
  color: $text-main;
  font-size: 15px;
  font-weight: 500;
  pointer-events: none;

  :deep(svg) {
    width: 36px;
    height: 36px;
  }
}

.confirm-text {
  max-width: 400px;
  color: $white;
}

.submit-work {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
  color: $white;

  p {
    font-size: 14px;
    line-height: 1.5;
  }

  span {
    font-size: 12px;
    color: $text-placeholder;
  }
}
</style>
