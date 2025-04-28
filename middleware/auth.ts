import { useUserStore } from "~/store/userStore";

let beenUsed = false;

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server) return;
    const userStore = useUserStore();

    if (!beenUsed) {
        beenUsed = true;
        try {            
            await userStore.checkAuth();
        } catch (error) {
            return navigateTo("/");
        }
    }

    if ((to.path).includes("/auth")) {
        if (userStore.isAuth) {
            return navigateTo("/orders");
        }
    }
});