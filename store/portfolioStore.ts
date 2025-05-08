import { deletePortfolio as delPortfolio, getMyPortfolio as getMyPortfolios, getPortfolioById, postPortfolio, type Portfolio } from "~/api/portfolio-api";

export const usePortfolioStore = defineStore('portfolio', () => {
    const portfolio = ref<Portfolio[]>([]);

    async function getMyPortfolio() {
        const res = await getMyPortfolios();

        portfolio.value = res;        
    }

    async function createPortfolio(data: FormData) {
        const res = await postPortfolio(data);

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
        deletePortfolio,
        getPortfolio,
    };
});