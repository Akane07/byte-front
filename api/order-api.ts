import { api } from ".";

export interface Order {
    id: string;
    user_id: string;
    title: string;
    description: string;
    price: number;
    price_type: 'contract' | 'fixed'; // договорная или фиксированная цена
    type: 'one-time' | 'reusable';
    for_experts: boolean;
    deadlines: 'contract' | 'more-than-month' | 'less-than-month' | string;
    skills: string[];
    category: string;
    response_count: number;
    viewed_by: string[];
    is_active: boolean;
    created_at: string;
}

export interface Response {
    order_id: string;
    user_id: string;
    description: string;
    created_at: string;
}


export async function getOrders() {
    try {
        const response = await api.get<Order[]>('/order');

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

export async function postResponse(id: string, description: string) {
    const response = await api.post<Response>(`/order/${id}/response`, {
        description,
    });

    return response.data;
}

export async function getResponse(id: string) {
    const response = await api.get<Response>(`/order/${id}/response`);

    return response.data;
}

export async function getResponses(id: string) {
    const response = await api.get<Response[]>(`/order/${id}/responses`);

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