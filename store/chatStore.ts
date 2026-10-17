import { getChats, getUnread } from "~/shared/api/chat-api";
import { getUserById } from "~/shared/api/user-api";
import type { ChatPreview, Message } from "~/shared/types";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

/** Сколько показывать «печатает…» после последнего сигнала собеседника. */
const TYPING_MS = 4000;
const NOTIFY_KEY = "byte-chat-notify";

/** Текст последнего сообщения для списка диалогов — как его формирует бэкенд. */
function previewText(msg: Message): string {
  if (msg.is_delivery) return "Работа сдана";
  if (msg.is_suggest) return "Предложение заказа";
  if (msg.responseId) return "Отклик на заказ";
  if (msg.mediaType === "video") return "Видео";
  if (!msg.text && msg.mediaType === "file") return `Файл: ${msg.fileName ?? ""}`;
  if (!msg.text && msg.mediaType === "image") return "Изображение";
  return msg.text;
}

/**
 * Общее состояние чата для всего приложения: список диалогов, счётчики
 * непрочитанных (значок в шапке, заголовок вкладки), кто в сети и кто
 * печатает. Подписки на сокет живут, пока пользователь в аккаунте, —
 * поэтому новое сообщение видно на любой странице, а не только в чате.
 */
export const useChatStore = defineStore("chat", () => {
  const userStore = useUserStore();
  const notifications = useNotifications();
  // Берём сразу: в обработчиках событий сокета контекста Nuxt уже нет,
  // и useRoute / useRuntimeConfig там не работают.
  const router = useRouter();
  const socket = useChatSocket();

  const chats = ref<ChatPreview[]>([]);
  const chatsLoaded = shallowRef(false);
  const unreadByUser = ref<Record<string, number>>({});
  const online = ref<Record<string, boolean>>({});
  const lastSeen = ref<Record<string, string>>({});
  const typing = ref<Record<string, boolean>>({});
  /** Собеседник открытого диалога. */
  const activeDialog = shallowRef<string | null>(null);
  /** Незаконченные сообщения по диалогам — переживают переход между чатами. */
  const drafts = ref<Record<string, string>>({});
  const browserNotify = shallowRef(false);

  const totalUnread = computed(() =>
    Object.values(unreadByUser.value).reduce((sum, n) => sum + n, 0),
  );

  const typingTimers = new Map<string, ReturnType<typeof setTimeout>>();
  let offs: (() => void)[] = [];
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;

  // --- Загрузка ---

  async function loadChats() {
    const res = await getChats();
    if (!res) return;
    chats.value = res;
    chatsLoaded.value = true;
    for (const chat of res) {
      if (chat.last_seen) lastSeen.value[chat.userId] = chat.last_seen;
    }
    await queryPresence(res.map((c) => c.userId));
  }

  async function loadUnread() {
    const res = await getUnread();
    if (res) unreadByUser.value = res.byUser;
  }

  async function queryPresence(userIds: string[]) {
    const ids = [...new Set(userIds)];
    if (!ids.length) return;
    const onlineIds = new Set(await socket.getPresence(ids));
    for (const id of ids) online.value[id] = onlineIds.has(id);
  }

  /** Удаление и правка могут поменять последнее сообщение — перечитываем список. */
  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (chatsLoaded.value) loadChats();
      loadUnread();
    }, 300);
  }

  // --- События сокета ---

  async function onReceive(msg: Message) {
    const me = userStore.user?.id;
    if (!me) return;
    const mine = msg.senderId === me;
    const partnerId = mine ? msg.receiverId : msg.senderId;

    stopTyping(partnerId);

    const chat = chats.value.find((c) => c.userId === partnerId);
    if (chat) {
      chat.lastMessage = previewText(msg);
      chat.lastMessageDate = msg.createdAt;
      chat.lastMessageMine = mine && msg.status !== "server";
      chat.isRead = msg.isRead;
      // Поднимаем диалог наверх списка.
      chats.value = [chat, ...chats.value.filter((c) => c !== chat)];
    } else if (chatsLoaded.value) {
      // Новый собеседник — данных о нём в списке нет, берём с сервера.
      await loadChats();
    }

    if (mine) return;

    const reading = activeDialog.value === partnerId && !document.hidden;
    if (reading) return;

    unreadByUser.value[partnerId] = (unreadByUser.value[partnerId] ?? 0) + 1;
    const row = chats.value.find((c) => c.userId === partnerId);
    if (row) row.unreadCount = unreadByUser.value[partnerId];

    notify(msg, partnerId);
  }

  function onRead({ readerId, partnerId }: { readerId: string; partnerId: string }) {
    if (readerId === userStore.user?.id) {
      // Я прочитал (возможно, в другой вкладке).
      delete unreadByUser.value[partnerId];
      const row = chats.value.find((c) => c.userId === partnerId);
      if (row) row.unreadCount = 0;
    } else {
      // Собеседник прочитал мои сообщения.
      const row = chats.value.find((c) => c.userId === readerId);
      if (row?.lastMessageMine) row.isRead = true;
    }
  }

  function onPresence(p: { userId: string; online: boolean; lastSeen?: string }) {
    online.value[p.userId] = p.online;
    if (p.lastSeen) lastSeen.value[p.userId] = p.lastSeen;
    if (!p.online) stopTyping(p.userId);
  }

  function onTyping({ userId }: { userId: string }) {
    typing.value[userId] = true;
    clearTimeout(typingTimers.get(userId));
    typingTimers.set(
      userId,
      setTimeout(() => stopTyping(userId), TYPING_MS),
    );
  }

  function stopTyping(userId: string) {
    clearTimeout(typingTimers.get(userId));
    typingTimers.delete(userId);
    delete typing.value[userId];
  }

  // --- Уведомления ---

  /** Имена собеседников, которых нет в загруженном списке диалогов. */
  const names = new Map<string, string>();

  async function nameOf(userId: string) {
    const chat = chats.value.find((c) => c.userId === userId);
    if (chat) return chat.nickname || chat.name;
    if (!names.has(userId)) {
      const user = await getUserById(userId);
      names.set(userId, user ? user.nickname || user.name : "Собеседник");
    }
    return names.get(userId)!;
  }

  /**
   * Вкладка в фоне — системное уведомление (если разрешено). Открыта
   * другая страница сайта — всплывашка. В самом чате новое сообщение и так
   * видно в списке диалогов, всплывашка там только мешает.
   */
  async function notify(msg: Message, partnerId: string) {
    const name = await nameOf(partnerId);
    const text = previewText(msg);

    if (document.hidden) {
      if (browserNotify.value && "Notification" in window && Notification.permission === "granted") {
        const n = new Notification(`Сообщение от ${name}`, {
          body: text,
          icon: "/logo.svg",
          tag: `chat-${partnerId}`,
        });
        n.onclick = () => {
          window.focus();
          router.push(`/chat/${partnerId}`);
          n.close();
        };
      }
      return;
    }

    if (!router.currentRoute.value.path.startsWith("/chat")) {
      notifications.setNotification(`${name}: ${text}`);
    }
  }

  function readNotifySetting() {
    try {
      browserNotify.value =
        localStorage.getItem(NOTIFY_KEY) === "1" &&
        "Notification" in window &&
        Notification.permission === "granted";
    } catch {
      browserNotify.value = false;
    }
  }

  /** Включить или выключить системные уведомления. Разрешение спрашивает браузер. */
  async function toggleBrowserNotify() {
    if (!("Notification" in window)) {
      notifications.setNotification("Браузер не поддерживает уведомления");
      return;
    }
    if (browserNotify.value) {
      browserNotify.value = false;
    } else {
      const permission =
        Notification.permission === "default"
          ? await Notification.requestPermission()
          : Notification.permission;
      browserNotify.value = permission === "granted";
      if (permission === "denied") {
        notifications.setNotification("Уведомления запрещены в настройках браузера для этого сайта");
      }
    }
    try {
      localStorage.setItem(NOTIFY_KEY, browserNotify.value ? "1" : "0");
    } catch {
      // настройка просто не запомнится
    }
  }

  // --- Жизненный цикл ---

  /** Вызывается после входа: подписки на сокет и начальные счётчики. */
  function start() {
    connectChatSocket();
    if (offs.length) return;
    const chat = socket;
    readNotifySetting();
    offs = [
      chat.on("receiveMessage", onReceive),
      chat.on("messagesRead", onRead),
      chat.on("presence", onPresence),
      chat.on("typing", onTyping),
      chat.on("messageDeleted", scheduleRefresh),
      chat.on("messageEdited", scheduleRefresh),
    ];
    // После обрыва связи могли прийти сообщения — сверяемся с сервером.
    const onConnect = () => {
      loadUnread();
      if (chatsLoaded.value) loadChats();
      else queryPresence(Object.keys(online.value));
    };
    chat.socket.on("connect", onConnect);
    offs.push(() => chat.socket.off("connect", onConnect));
    loadUnread();
  }

  /** При выходе из аккаунта — чтобы следующий пользователь не увидел чужое. */
  function stop() {
    offs.forEach((off) => off());
    offs = [];
    typingTimers.forEach((t) => clearTimeout(t));
    typingTimers.clear();
    names.clear();
    chats.value = [];
    chatsLoaded.value = false;
    unreadByUser.value = {};
    online.value = {};
    lastSeen.value = {};
    typing.value = {};
    drafts.value = {};
    activeDialog.value = null;
  }

  /** Локально отметить диалог прочитанным — не дожидаясь ответа сервера. */
  function clearUnread(userId: string) {
    delete unreadByUser.value[userId];
    const row = chats.value.find((c) => c.userId === userId);
    if (row) row.unreadCount = 0;
  }

  return {
    chats,
    chatsLoaded,
    unreadByUser,
    totalUnread,
    online,
    lastSeen,
    typing,
    activeDialog,
    drafts,
    browserNotify,

    loadChats,
    queryPresence,
    clearUnread,
    toggleBrowserNotify,
    start,
    stop,
  };
});
