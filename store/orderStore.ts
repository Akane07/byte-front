import { getMyResponses, getOrderById, getOrderByUserId, getOrders, getResponse, getResponsesOnOrder, markOrderViewed, postResponse, type Order, type OrderResponse } from "~/api/order-api";

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const myOrders = ref<Order[]>([]);
    const myResponses = ref<OrderResponse[]>([]);

    async function getAllOrders() {
        const res = await getOrders();

        if (res.length) {
            orders.value = res;
        }
    }

    async function getOrder(id: string) {
        const res = await getOrderById(id);

        if (res.id) {
            return res;
        }
    }

    async function viewOrder(id: string) {
        await markOrderViewed(id);
    }

    async function postOrderResponse(id: string, description: string) {
        const res = await postResponse(id, description);

        return res;
    }

    async function getOrderResponse(id: string) {
        const res = await getResponse(id);

        return res;
    }

    async function getOrderResponses(id: string) {
        const res = await getResponsesOnOrder(id);

        return res;
    }

    async function getUserOrders(id: string) {
        const res = await getOrderByUserId(id);

        return res;
    }

    async function getResponses() {
        const res = await getMyResponses();

        myResponses.value = res;
    }

    return { 
        orders,
        myOrders,
        myResponses,

        getAllOrders,
        getOrder,
        viewOrder,
        postOrderResponse,
        getOrderResponse,
        getOrderResponses,
        getUserOrders,
        getResponses,
    };
});