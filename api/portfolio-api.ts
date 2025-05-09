import { api } from ".";

export interface Portfolio {
    id: string;
    user_id: string;
    title: string;
    description: string;
    role: string;
    images: string[];
    skills: string[];
    video?: File;
    created_at: string;
    viewed_by: number;
    liked_by: string[];
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

export async function patchPortfolio(data: FormData, id: string) {
    try {
        const response = await api.patch<Portfolio>(`/portfolio/${id}`, data);

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

export async function getPortfolios(id: string) {
    try {
        const response = await api.get<Portfolio[]>(`/portfolio/user/${id}`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function viewPortfolio(id: string) {
    try {
        const response = await api.post<Portfolio>(`/portfolio/${id}/viewed`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function likePortfolio(id: string, isLike: boolean) {
    try {
        const response = await api.post<Portfolio>(`/portfolio/${id}/like`, {
            liked: isLike
        });

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}