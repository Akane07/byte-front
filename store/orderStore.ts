import {
  getDrafts,
  getMyResponses,
  getOrderById,
  getOrderByUserId,
  getOrders,
  markOrderViewed,
  patchOrder,
  postOrder,
  type MyOrderResponse,
  type Order,
  type OrderInput,
} from "~/shared/api/order-api";
import type { Filter } from "~/shared/types";

export const useOrderStore = defineStore("order", () => {
  const orders = ref<Order[]>([]);
  const page = shallowRef(1);
  const total = shallowRef(1);

  // Бэкенд уже отдаёт списки от новых к старым — переворачивать не нужно.
  const myOrders = ref<Order[]>([]);
  const myResponses = ref<MyOrderResponse[]>([]);
  const myDrafts = ref<Order[]>([]);

  async function getAllOrders(filters: Filter[] = []) {
    const categories = filters.filter((f) => f.checked).map((f) => f.id);
    const res = await getOrders(page.value, categories);
    if (!res) return;

    orders.value = res.orders;
    page.value = res.currentPage;
    total.value = res.totalPages;
  }

  function getOrder(id: string) {
    return getOrderById(id);
  }

  async function viewOrder(id: string) {
    await markOrderViewed(id);
  }

  async function loadMyOrders(userId: string) {
    myOrders.value = (await getOrderByUserId(userId)) ?? [];
  }

  async function getMyDrafts(userId: string) {
    myDrafts.value = (await getDrafts(userId)) ?? [];
  }

  async function getResponses() {
    myResponses.value = (await getMyResponses()) ?? [];
  }

  function createOrder(order: OrderInput) {
    return postOrder(order);
  }

  function editOrder(order: Partial<OrderInput>, orderId: string) {
    return patchOrder(orderId, order);
  }

  return {
    orders,
    page,
    total,

    myOrders,
    myResponses,
    myDrafts,

    getAllOrders,
    getOrder,
    viewOrder,
    loadMyOrders,
    getMyDrafts,
    getResponses,
    createOrder,
    editOrder,
  };
});
