import { useUserStore } from "~/store/userStore";

let beenUsed = false;

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const userStore = useUserStore();

    if (!beenUsed) {
        beenUsed = true;
        try {                 
            await userStore.checkAuth();
            console.log(userStore);
            
        } catch (error) {
            return navigateTo("/");
        }
    }

    if (!userStore.isAuth && !(to.path).includes("/auth")) {
        return navigateTo("/auth/login");
    }

    if ((to.path).includes("/auth")) {
        if (userStore.isAuth) {
            return navigateTo("/orders");
        }
    }
});