import { getOrderById, getOrderByUserId, getOrders, getResponse, getResponses, markOrderViewed, postResponse, type Order } from "~/api/order-api";

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const myOrders = ref<Order[]>([]);

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
        const res = await getResponses(id);

        return res;
    }

    async function getUserOrders(id: string) {
        const res = await getOrderByUserId(id);

        return res;
    }

    return { 
        orders,
        myOrders,

        getAllOrders,
        getOrder,
        viewOrder,
        postOrderResponse,
        getOrderResponse,
        getOrderResponses,
        getUserOrders,
    };
});