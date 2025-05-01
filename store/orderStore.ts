import { getOrders, markOrderViewed, type Order } from "~/api/order-api";

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);

    async function getAllOrders() {
        const res = await getOrders();

        if (res.length) {
            orders.value = res;
        }
    }

    async function viewOrder(id: string) {
        const res = await markOrderViewed(id);
    }

    return { 
        orders,

        getAllOrders,
        viewOrder
    };
});