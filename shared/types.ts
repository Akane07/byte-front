export type Deadline =
  | "less-week"
  | "more-week"
  | "less-month"
  | "more-month"
  | "contract"
  | "custom";

export interface Message {
  id: string;
  text: string;
  mediaType: string;
  mediaUrl: string;
  createdAt: string;
  is_suggest: boolean;
  status: string;
  senderId: string;
  orderId: string;
  responseId: string;
}

export interface Filter {
  id: number;
  title: string;
  checked: boolean;
}
