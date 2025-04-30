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
  

export async function getOrders() {
    try {
        const response = await api.get<Order[]>('/order');

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}