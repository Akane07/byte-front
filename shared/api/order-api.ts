import { api, call } from ".";
import type { DateRange, Deadline, Price, PriceType } from "../types";

export type OrderStatus = "active" | "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: Price;
  price_type: PriceType;
  type: "one-time" | "reusable";
  for_experts: boolean;
  deadlines: Deadline;
  deadline_date?: DateRange;
  skills: string[];
  category?: number;
  response_count: number;
  viewed_by: string[];
  is_active: boolean;
  created_at: string;
  performer?: string;
  status: OrderStatus;
  draft: boolean;
}

/** Данные формы заказа, которые принимает бэкенд. */
export type OrderInput = Pick<
  Order,
  | "title"
  | "description"
  | "price"
  | "price_type"
  | "type"
  | "for_experts"
  | "deadlines"
  | "deadline_date"
  | "skills"
  | "category"
  | "draft"
>;

export interface OrderResponse {
  id: string;
  order_id: string;
  user_id: string;
  description: string;
  created_at: string;
  viewed: boolean;
  messageId?: string;
}

/** Свой отклик с данными заказа — ответ POST /order/responses. */
export interface MyOrderResponse extends OrderResponse {
  title: string;
  price: Price;
  price_type: PriceType;
}

export interface OrderPage {
  orders: Order[];
  currentPage: number;
  totalPages: number;
}

export function getOrders(page: number, categories: number[]) {
  return call(
    api.get<OrderPage>("/order", {
      params: { page, categories },
      // ?categories=1&categories=2 — формат, который ждёт бэкенд
      paramsSerializer: { indexes: null },
    }),
  );
}

export function getOrderById(id: string) {
  return call(api.get<Order>(`/order/${id}`));
}

export function getOrderByUserId(userId: string) {
  return call(api.get<Order[]>(`/order/user/${userId}`));
}

export function getDrafts(userId: string) {
  return call(api.get<Order[]>(`/order/user/${userId}/drafts`));
}

export function postOrder(order: OrderInput) {
  return call(api.post<Order>("/order", order));
}

export function patchOrder(orderId: string, order: Partial<OrderInput>) {
  return call(api.patch<Order>(`/order/${orderId}`, order));
}

export function deleteOrder(id: string) {
  return call(api.delete<{ deleted: boolean }>(`/order/${id}`));
}

export function markOrderViewed(orderId: string) {
  return call(api.post<Order>(`/order/${orderId}/viewed`, undefined, { silent: true }));
}

export function postResponse(orderId: string, description: string) {
  return call(api.post<OrderResponse>(`/order/${orderId}/response`, { description }));
}

export function editResponse(orderId: string, responseId: string, description: string) {
  return call(
    api.patch<OrderResponse>(`/order/${orderId}/response/${responseId}`, {
      description,
    }),
  );
}

/** Свой отклик на заказ; null — если не откликались. */
export function getResponse(orderId: string) {
  return call(api.get<OrderResponse | null>(`/order/${orderId}/response`));
}

export function getResponseById(orderId: string, responseId: string) {
  return call(
    api.get<OrderResponse>(`/order/${orderId}/response/${responseId}`, { silent: true }),
  );
}

export function getResponsesOnOrder(orderId: string) {
  return call(api.get<OrderResponse[]>(`/order/${orderId}/responses`));
}

export function getMyResponses() {
  return call(api.post<MyOrderResponse[]>("/order/responses"));
}

export function deleteResponse(responseId: string, orderId: string) {
  return call(
    api.delete<{ deleted: boolean; messageId?: string }>(
      `/order/${orderId}/response/${responseId}`,
    ),
  );
}

export function getOrdersBetweenUsers(userId: string, otherId: string) {
  return call(api.get<Order[]>(`/chat/between/${userId}/and/${otherId}`));
}
