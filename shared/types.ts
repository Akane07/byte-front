export type Deadline =
  | "less-week"
  | "more-week"
  | "less-month"
  | "more-month"
  | "contract"
  | "custom";

export type PriceType = "contract" | "fixed" | "hourly";

export interface PriceRange {
  from: number;
  to: number;
}

/** Цена заказа: число или диапазон (для почасовой ставки). */
export type Price = number | PriceRange;

export interface DateRange {
  from: string;
  to: string;
}

export type MessageStatus = "rejected" | "accepted" | "server" | "response";

export type MediaType = "image" | "video" | "file" | "none";

/** Цитата сообщения, на которое ответили. */
export interface ReplySnapshot {
  id: string;
  senderId: string;
  text: string;
  mediaType: MediaType;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaType: MediaType;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  editedAt?: string;
  is_suggest: boolean;
  /** Исполнитель сдал работу по заказу. */
  is_delivery?: boolean;
  /**
   * Предложение отменить заказ в работе. accepted — заказ отменён
   * (по согласию или без ответа), rejected — отмена не состоялась.
   */
  is_cancel?: boolean;
  isRead: boolean;
  status?: MessageStatus;
  orderId?: string;
  responseId?: string;
  replyTo?: ReplySnapshot;
  /** Временный id сообщения, пока сервер его не подтвердил. */
  clientId?: string;
  /** Только на клиенте: сообщение ещё отправляется или не ушло. */
  pending?: "sending" | "failed";
}

export interface ChatPreview {
  userId: string;
  name: string;
  nickname?: string;
  avatar: string;
  last_seen?: string;
  lastMessage: string;
  lastMessageDate: string;
  /** Последнее сообщение — своё (тогда isRead — прочитал ли его собеседник). */
  lastMessageMine?: boolean;
  isRead?: boolean;
  unreadCount: number;
}

export interface ChatHistoryPage {
  messages: Message[];
  hasMore: boolean;
}

export interface Filter {
  id: number;
  title: string;
  checked: boolean;
}
