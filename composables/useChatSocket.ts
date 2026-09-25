import { io, type Socket } from "socket.io-client";
import { api, call, getToken } from "~/shared/api";
import type { Message } from "~/shared/types";
import { useNotifications } from "~/store/notiStore";

interface ServerEvents {
  receiveMessage: (message: Message) => void;
  messageDeleted: (payload: { messageId: string }) => void;
  messageAccepted: (payload: { messageId: string }) => void;
  messageRejected: (payload: { messageId: string }) => void;
  exception: (payload: { message: string | string[] }) => void;
}

interface ClientEvents {
  sendMessage: (payload: {
    receiverId: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: Message["mediaType"];
    is_suggest?: boolean;
    orderId?: string;
  }) => void;
  deleteMessage: (payload: { messageId: string }) => void;
  acceptMessage: (payload: { messageId: string }) => void;
  rejectMessage: (payload: { messageId: string }) => void;
  postResponse: (payload: { orderId: string; responseId: string }) => void;
  finishOrder: (payload: { orderId: string }) => void;
}

type ChatSocket = Socket<ServerEvents, ClientEvents>;

/**
 * Одно соединение на всё приложение. Раньше каждая страница открывала
 * своё и не закрывала его, и при переходах соединения копились.
 */
let socket: ChatSocket | null = null;

function getSocket(origin: string): ChatSocket {
  if (!socket) {
    socket = io(origin, {
      transports: ["websocket"],
      // Функция, а не значение: токен читается заново при каждом переподключении.
      auth: (cb) => cb({ token: getToken() }),
    });
    socket.on("exception", ({ message }) => {
      useNotifications().setNotification(Array.isArray(message) ? message.join(". ") : message);
    });
  } else if (socket.disconnected) {
    socket.connect();
  }
  return socket;
}

/** Закрыть соединение — при выходе из аккаунта. */
export function disconnectChatSocket() {
  socket?.disconnect();
  socket = null;
}

export function useChatSocket() {
  const s = getSocket(useRuntimeConfig().public.apiOrigin);

  /** Подписка на событие, которая снимается вместе с компонентом. */
  function on<E extends keyof ServerEvents>(event: E, handler: ServerEvents[E]) {
    s.on(event, handler as never);
    onBeforeUnmount(() => {
      s.off(event, handler as never);
    });
  }

  async function sendMessage(receiverId: string, text: string, file?: File | null) {
    let media: { mediaUrl: string; mediaType: Message["mediaType"] } | undefined;

    if (file) {
      const form = new FormData();
      form.append("file", file);
      const uploaded = await call(api.post<{ url: string; mimetype: string }>("/upload", form));
      if (!uploaded) return false;
      media = {
        mediaUrl: uploaded.url,
        mediaType: uploaded.mimetype.startsWith("video") ? "video" : "image",
      };
    }

    s.emit("sendMessage", { receiverId, text, ...media });
    return true;
  }

  return {
    on,
    sendMessage,
    suggestOrder: (receiverId: string, orderId: string) =>
      s.emit("sendMessage", {
        receiverId,
        orderId,
        is_suggest: true,
        text: "Предложение заказа",
      }),
    acceptMessage: (messageId: string) => s.emit("acceptMessage", { messageId }),
    rejectMessage: (messageId: string) => s.emit("rejectMessage", { messageId }),
    deleteMessage: (messageId: string) => s.emit("deleteMessage", { messageId }),
    postResponse: (orderId: string, responseId: string) =>
      s.emit("postResponse", { orderId, responseId }),
    finishOrder: (orderId: string) => s.emit("finishOrder", { orderId }),
  };
}
