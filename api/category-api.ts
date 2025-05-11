import { api } from ".";

export async function getCategories() {
    try {
        const response = await api.get('/category');

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export async function getSkills(id: number) {
    try {
        const response = await api.get(`/category/${id}/skills`);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
}