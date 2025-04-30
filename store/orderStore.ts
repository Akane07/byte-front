import { getOrders, type Order } from "~/api/order-api";

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);

    async function getAllOrders() {
        const res = await getOrders();

        if (res.length) {
            orders.value = res;
        }
    }

    return { 
        orders,

        getAllOrders
    };
});