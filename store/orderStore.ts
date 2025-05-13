import { getDrafts, getMyResponses, getOrderById, getOrderByUserId, getOrders, getResponse, getResponsesOnOrder, markOrderViewed, patchOrder, postOrder, postResponse, type Order, type OrderResponse } from "~/api/order-api";
import { useCategory } from './categoryStore';

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const page = ref(1);
    const total = ref(1);

    const myOrders = ref<Order[]>([]);
    const myResponses = ref<OrderResponse[]>([]);
    const myDrafts = ref<Order[]>([]);

    async function getAllOrders(filters?: { title: string; id: number; checked: boolean }[]) {
        let filtersString = '';
        if (filters) {
            filtersString = filters.filter(filter => filter.checked).map(filter => `categories=${filter.id}`).join('&');
        }
            
        const res = await getOrders(page.value, filtersString);        

        if (res.currentPage) {
            orders.value = res.orders;
            page.value = res.currentPage;
            total.value = res.totalPages;
        }
    }

    async function getOrder(id: string): Promise<Order | null> {
        const res = await getOrderById(id);

        if (res.id) {
            return res;
        }
        return null;
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

    async function getMyDrafts(user_id: string) {
        const drafts = await getDrafts(user_id);

        if (drafts.length) {
            myDrafts.value = drafts;
        } else {
            myDrafts.value = [];
        }
    }

    async function getResponses() {
        const res = await getMyResponses();

        myResponses.value = res;
    }

    async function createOrder(order: Partial<Order>) {

        if (order.draft) {
            const res = await postOrder(order);

            return res;
        }

        const categoryStore = useCategory();

        order.category = categoryStore.getCategoryIdByTitle(order.category as unknown as string) as number;

        const res = await postOrder(order);

        return res;
    }

    async function editOrder(order: Partial<Order>, order_id: string) {
        const categoryStore = useCategory();

        order.category = categoryStore.getCategoryIdByTitle(order.category as unknown as string) as number;

        const res = await patchOrder(order_id, order);

        return res;
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
        postOrderResponse,
        getOrderResponse,
        getOrderResponses,
        getUserOrders,
        getMyDrafts,
        getResponses,
        createOrder,
        editOrder,
    };
});