import { deletePortfolio as delPortfolio, getMyPortfolio as getMyPortfolios, getPortfolioById, getPortfolios, patchPortfolio, postPortfolio, type Portfolio } from "~/api/portfolio-api";

export const usePortfolioStore = defineStore('portfolio', () => {
    const portfolio = ref<Portfolio[]>([]);

    async function getMyPortfolio() {
        const res = await getMyPortfolios();

        portfolio.value = res;
    }

    async function getPortfoliosById(user_id: string) {
        const res = await getPortfolios(user_id);

        return res;
    }

    async function createPortfolio(data: FormData) {
        const res = await postPortfolio(data);

        return res;
    }

    async function editPortfolio(data: FormData, id: string) {
        const res = await patchPortfolio(data, id);

        return res;
    }

    async function deletePortfolio(id: string) {
        const res = await delPortfolio(id);

        await getMyPortfolio();

        return res;
    }

    async function getPortfolio(id: string) {
        const res = await getPortfolioById(id);

        return res;
    }

    return {
        portfolio,

        getMyPortfolio,
        createPortfolio,
        editPortfolio,
        deletePortfolio,
        getPortfolio,
        getPortfoliosById,
    };
});