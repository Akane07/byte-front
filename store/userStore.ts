import { setToken } from "~/api";
import { getUser, getUserById, type User } from "~/api/user-api";

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const isAuth = ref<boolean>(false);

    async function fetchUser() {
        const data = await getUser();

        if (data.statusCode === 401) {
            isAuth.value = false;
            return;
        }

        user.value = data;
    }

    async function checkAuth() {
        const token = localStorage.getItem('byte-accessToken');
        if (token && !isAuth.value) {
            setToken(token);
            isAuth.value = true;
            await fetchUser();
        }
    }

    function logout() {
        user.value = null;
        isAuth.value = false;
        localStorage.removeItem('byte-accessToken');
    }

    async function getUserId(id: string) {
        const res = await getUserById(id);

        return res;
    }

    return { 
        user,
        isAuth,
        
        fetchUser,
        checkAuth,
        getUserId,
        logout
    };
});