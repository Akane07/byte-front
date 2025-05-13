import { api } from ".";

export interface Order {
    id: string;
    user_id: string;
    title: string;
    description: string;
    price: number | {
        from: number;
        to: number;
    };
    price_type: 'contract' | 'fixed' | 'hourly';
    type: 'one-time' | 'reusable';
    for_experts: boolean;
    deadlines: 'less-week' | 'more-week' | 'less-month' | 'more-month' | 'contract' | 'custom';
    deadline_date?: {
        from: string;
        to: string;
    };
    skills: string[];
    category: number;
    response_count: number;
    viewed_by: string[];
    is_active: boolean;
    created_at: string;
    performer?: string;
    draft: boolean;
}

export interface OrderResponse {
    id: string;
    order_id: string;
    user_id: string;
    description: string;
    created_at: string;
    title: string;
    price: number;
    viewed: boolean;
    price_type: "contract" | "fixed";
}


export async function getOrders(page: number = 1, filters: any) {
    try {
        const response = await api.get<{ orders: Order[], currentPage: number, totalPages: number }>(`/order?page=${page}&${filters}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function getDrafts(user_id: string) {
    try {
        const response = await api.get<Order[]>(`/order/user/${user_id}/drafts`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function postOrder(order: Partial<Order>) {
    try {
        const response = await api.post<Order>('/order', order);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function patchOrder(order_id: string, order: Partial<Order>) {
    try {
        const response = await api.patch<Order>(`/order/${order_id}`, order);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function getOrderById(id: string) {
    try {
        const response = await api.get<Order>(`/order/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function deleteOrder(id: string) {
    try {
        const response = await api.delete(`/order/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function postResponse(id: string, description: string) {
    const response = await api.post<OrderResponse>(`/order/${id}/response`, {
        description,
    });

    return response.data;
}

export async function editResponse(id: string, response_id: string, description: string) {
    const response = await api.patch<OrderResponse>(`/order/${id}/response/${response_id}`, {
        description,
    });

    return response.data;
}

export async function getResponse(id: string) {
    const response = await api.get<OrderResponse>(`/order/${id}/response`);

    return response.data;
}

export async function getResponsesOnOrder(id: string) {
    const response = await api.get<OrderResponse[]>(`/order/${id}/responses`);

    return response.data;
}

export async function markOrderViewed(orderId: string) {
    await api.post<Order[]>(`/order/${orderId}/viewed`);
}


export async function getOrderByUserId(id: string) {
    try {
        const response = await api.get<Order[]>(`/order/user/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function getMyResponses() {
    try {
        const response = await api.post<Order[]>('/order/responses');

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function deleteResponse(id: string, order_id: string) {
    try {
        const response = await api.delete(`/order/${order_id}/response/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}