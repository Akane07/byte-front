import { io, type Socket } from "socket.io-client";
import { getToken } from "~/shared/api";
import type { Order } from "~/shared/api/order-api";
import type { Message } from "~/shared/types";
import { useNotifications } from "~/store/notiStore";

interface ServerEvents {
  receiveMessage: (message: Message) => void;
  messageDeleted: (payload: { messageId: string }) => void;
  messageEdited: (payload: { messageId: string; text: string; editedAt: string }) => void;
  messageAccepted: (payload: { messageId: string }) => void;
  messageRejected: (payload: { messageId: string }) => void;
  /** readerId прочитал переписку с partnerId. */
  messagesRead: (payload: { readerId: string; partnerId: string }) => void;
  typing: (payload: { userId: string }) => void;
  presence: (payload: { userId: string; online: boolean; lastSeen?: string }) => void;
  orderUpdated: (order: Order) => void;
  exception: (payload: { message: string | string[]; clientId?: string }) => void;
}

/** Данные нового сообщения. Отправителя сервер берёт из токена. */
export interface OutgoingMessage {
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: Message["mediaType"];
  fileName?: string;
  fileSize?: number;
  is_suggest?: boolean;
  orderId?: string;
  replyToId?: string;
  clientId?: string;
}

interface ClientEvents {
  sendMessage: (payload: OutgoingMessage) => void;
  editMessage: (payload: { messageId: string; text: string }) => void;
  deleteMessage: (payload: { messageId: string }) => void;
  acceptMessage: (payload: { messageId: string }) => void;
  rejectMessage: (payload: { messageId: string }) => void;
  markRead: (payload: { userId: string }) => void;
  typing: (payload: { userId: string }) => void;
  getPresence: (
    payload: { userIds: string[] },
    ack: (res: { online: string[] }) => void,
  ) => void;
  postResponse: (payload: { orderId: string; responseId: string }) => void;
  finishOrder: (payload: { orderId: string; text?: string }) => void;
}

type ChatSocket = Socket<ServerEvents, ClientEvents>;

/**
 * Одно соединение на всё приложение. Раньше каждая страница открывала
 * своё и не закрывала его, и при переходах соединения копились.
 *
 * Объект сокета живёт всё время работы вкладки: при выходе из аккаунта
 * соединение закрывается, при входе открывается заново. Так подписки
 * стора чата (непрочитанные, «в сети») не теряются при смене аккаунта.
 */
let socket: ChatSocket | null = null;

function getSocket(origin: string): ChatSocket {
  if (!socket) {
    socket = io(origin, {
      transports: ["websocket"],
      // Гость смотрит заказы без входа — соединяться ему не с чем:
      // сервер закрывает сокет без токена. Подключаемся явно, см. connectChatSocket.
      autoConnect: false,
      // Функция, а не значение: токен читается заново при каждом переподключении.
      auth: (cb) => cb({ token: getToken() }),
    });
    socket.on("exception", ({ message }) => {
      useNotifications().setNotification(Array.isArray(message) ? message.join(". ") : message);
    });
  }
  if (socket.disconnected && getToken()) {
    socket.connect();
  }
  return socket;
}

/** Открыть соединение после входа. Сам сокет к этому моменту уже создан. */
export function connectChatSocket() {
  if (socket?.disconnected && getToken()) socket.connect();
}

/** Закрыть соединение — при выходе из аккаунта. */
export function disconnectChatSocket() {
  socket?.disconnect();
}

export function useChatSocket() {
  const s = getSocket(useRuntimeConfig().public.apiOrigin);

  /**
   * Подписка на событие. В компоненте снимается вместе с ним; вне
   * компонента (в сторе) живёт, пока не вызвать возвращённую функцию.
   */
  function on<E extends keyof ServerEvents>(event: E, handler: ServerEvents[E]) {
    s.on(event, handler as never);
    const off = () => {
      s.off(event, handler as never);
    };
    if (getCurrentInstance()) onBeforeUnmount(off);
    return off;
  }

  /** Кто из пользователей сейчас в сети. Без соединения — пустой список. */
  async function getPresence(userIds: string[]): Promise<string[]> {
    if (!userIds.length || !s.connected) return [];
    try {
      const res = await s.timeout(5000).emitWithAck("getPresence", { userIds });
      return res.online;
    } catch {
      return [];
    }
  }

  return {
    socket: s,
    on,
    getPresence,
    sendMessage: (payload: OutgoingMessage) => s.emit("sendMessage", payload),
    suggestOrder: (receiverId: string, orderId: string) =>
      s.emit("sendMessage", {
        receiverId,
        orderId,
        is_suggest: true,
        text: "Предложение заказа",
      }),
    editMessage: (messageId: string, text: string) => s.emit("editMessage", { messageId, text }),
    acceptMessage: (messageId: string) => s.emit("acceptMessage", { messageId }),
    rejectMessage: (messageId: string) => s.emit("rejectMessage", { messageId }),
    deleteMessage: (messageId: string) => s.emit("deleteMessage", { messageId }),
    markRead: (userId: string) => s.emit("markRead", { userId }),
    typing: (userId: string) => s.emit("typing", { userId }),
    postResponse: (orderId: string, responseId: string) =>
      s.emit("postResponse", { orderId, responseId }),
    finishOrder: (orderId: string, text?: string) => s.emit("finishOrder", { orderId, text }),
  };
}
