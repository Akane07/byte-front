import { api } from ".";

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterResponse {
    access_token: string;
}

export async function register(data: RegisterData) {
    const response = await api.post<RegisterResponse>('/auth/register', data);

    if (response.status !== 200) {
        return response.data; // обработка ошибок - потом сделаю, потому что нужно, чтобы с бека возвращало нужные статусы и месседжи, а на фронте они выводились.
    }

    return response.data;
}

export async function login(data: LoginData) {
    const response = await api.post<RegisterResponse>('/auth/login', data);

    if (response.status !== 200) {
        return response.data;
    }

    return response.data;
}