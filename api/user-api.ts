import { api } from ".";

export interface User {
    id: string;
    email: string;
    name: string;
    nickname: string;
    phone: string;
    description: string;
    avatar: string;
    is_verified: boolean;
    country: string | null;
    last_seen: string;
    created_at: string;
    rating: number;
    orders_count: number;
    reviews_count: number;
    speciality: string;
    skills: string[];
}

export async function getUser() {
    try {
        const response = await api.get<User>('/user/me');

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function postUser(updateData: Partial<User>) {
    try {
        const response = await api.post<User>('/user/me', updateData);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function getUserById(id: string) {
    const response = await api.get<User>(`/user/${id}`);

    if (response.status !== 200) {
        return response.data;
    }

    return response.data;
}

export async function changePassword(password: string, newPassword: string) {
    const response = await api.post<{ access_token: string }>('/user/change-password', {
        password,
        newPassword
    });

    if (response.status !== 200) {
        return response.data;
    }

    return response.data;
}

export async function getCountries() {
    const response = await api.get<string[]>('/user/countries');

    if (response.status !== 200) {
        return response.data;
    }

    return response.data;
}

export async function setAvatar(data: FormData): Promise<{ avatarUrl: string }> {
    const res = await api.post("/user/set_avatar", data);

    return res.data;
}