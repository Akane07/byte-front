import { setToken } from "~/api";
import { getUser, type User } from "~/api/user-api";

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const isAuth = ref<boolean>(false);

    async function fetchUser() {
        const data = await getUser();
        user.value = data;
    }

    async function checkAuth() {
        const token = localStorage.getItem('byte-accessToken');
        if (token) {
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

    return { 
        user,
        isAuth,
        
        fetchUser,
        checkAuth,
        logout
    };
});