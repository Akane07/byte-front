import { api } from ".";

export interface Portfolio {
    id: string;
    user_id: string;
    title: string;
    description: string;
    role: string;
    images: string[];
    video?: File;
    created_at: Date;
}

export async function getMyPortfolio() {
    try {
        const response = await api.get<Portfolio[]>('/portfolio');

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function postPortfolio(data: FormData) {
    try {
        const response = await api.post<Portfolio>('/portfolio', data);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function deletePortfolio(id: string) {
    try {
        const response = await api.delete<Portfolio>(`/portfolio/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function getPortfolioById(id: string) {
    try {
        const response = await api.get<Portfolio>(`/portfolio/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}