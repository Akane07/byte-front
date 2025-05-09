import { setToken } from "~/api";
import { changePassword, getUser, getUserById, postUser, type User } from "~/api/user-api";

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);
    const isAuth = ref<boolean>(false);
    const checked = ref(false);

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
        checked.value = true;
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

    async function editMe(updateData: Partial<User>) {
        const res = await postUser(updateData);

        user.value = res;
    }

    async function newPassword(password: string, newPassword: string): Promise<boolean> {
        const res = await changePassword(password, newPassword);

        if (res.access_token) {
            localStorage.setItem('byte-accessToken', res.access_token);
            setToken(res.access_token);
            return true;
        }

        return false;
    }

    return { 
        user,
        isAuth,
        checked,
        
        fetchUser,
        checkAuth,
        getUserId,
        logout,
        editMe,
        newPassword,
    };
});