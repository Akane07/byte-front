import type { InjectionKey } from "vue";
import type { Message } from "./types";

/**
 * Действия с сообщениями, которые выполняет страница диалога. Передаются
 * через provide/inject: иначе каждое событие пришлось бы пробрасывать
 * через ChatMessage вверх по цепочке emit'ов.
 */
export interface ChatActions {
  reply(msg: Message): void;
  edit(msg: Message): void;
  copy(msg: Message): void;
  remove(msg: Message): void;
  retry(msg: Message): void;
  discard(msg: Message): void;
  openImage(url: string): void;
  jumpTo(messageId: string): void;
  acceptDelivery(msg: Message): void;
  rejectDelivery(msg: Message): void;
  acceptCancel(msg: Message): void;
  rejectCancel(msg: Message): void;
  forceCancel(msg: Message): void;
}

export const CHAT_ACTIONS: InjectionKey<ChatActions> = Symbol("chat-actions");
