import { io, type Socket } from "socket.io-client";
import type { Message } from "~/shared/types";

export const useChatSocket = () => {
  const socket = ref<Socket | null>(null);
  const messages = ref<Message[]>([]);

  const connect = (roomId: string) => {
    if (socket.value?.connected) return;

    socket.value = io("http://localhost:3002", {
      transports: ["websocket"],
    });

    socket.value.emit("joinRoom", roomId);

    socket.value.on("receiveMessage", (msg) => {
      messages.value.push(msg);
    });
    socket.value.on("messageDeleted", (msg: { messageId: string }) => {
      messages.value = messages.value.filter((m) => m.id !== msg.messageId);
    });
    socket.value.on("messageRejected", (msg: { messageId: string }) => {
      const index = messages.value.findIndex(
        (m) => m.id === msg.messageId
      ) as number;
      messages.value[index].status = "rejected";
    });
  };

  const sendMessageEvent = async (
    sender: string,
    reciever: string,
    text: string,
    file: any
  ) => {
    let mediaUrl = null;
    let mediaType = "none";

    if (file.value) {
      const formData = new FormData();
      formData.append("file", file.value);

      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      mediaUrl = result.url;
      mediaType = result.mimetype.startsWith("video") ? "video" : "image";
    }

    socket.value?.emit("sendMessage", {
      senderId: sender,
      receiverId: reciever,
      text: text,
      mediaUrl,
      mediaType,
      createdAt: new Date().toISOString(),
      is_suggest: false,
    });
  };

  const acceptMessageEvent = (payload: any) => {
    socket.value?.emit("acceptMessage", payload);
  };

  const rejectMessageEvent = (payload: any) => {
    socket.value?.emit("rejectMessage", payload);
  };

  const deleteMessageEvent = (payload: any) => {
    socket.value?.emit("deleteMessage", payload);
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  return {
    socket,
    messages,
    connect,
    disconnect,
    sendMessageEvent,
    acceptMessageEvent,
    rejectMessageEvent,
    deleteMessageEvent,
  };
};
