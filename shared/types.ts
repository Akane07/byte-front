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

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  mediaType: "image" | "video" | "none";
  mediaUrl?: string;
  createdAt: string;
  is_suggest: boolean;
  isRead: boolean;
  status?: MessageStatus;
  orderId?: string;
  responseId?: string;
}

export interface ChatPreview {
  userId: string;
  name: string;
  nickname?: string;
  avatar: string;
  lastMessage: string;
  lastMessageDate: string;
  isRead?: boolean;
}

export interface Filter {
  id: number;
  title: string;
  checked: boolean;
}
