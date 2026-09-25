import {
  deletePortfolio as deletePortfolioRequest,
  getMyPortfolio as getMyPortfolioRequest,
  getPortfolioById,
  getPortfolios,
  patchPortfolio,
  postPortfolio,
  type Portfolio,
} from "~/shared/api/portfolio-api";

export const usePortfolioStore = defineStore("portfolio", () => {
  const portfolio = ref<Portfolio[]>([]);

  async function getMyPortfolio() {
    portfolio.value = (await getMyPortfolioRequest()) ?? [];
  }

  async function getPortfoliosById(userId: string) {
    return (await getPortfolios(userId)) ?? [];
  }

  function getPortfolio(id: string) {
    return getPortfolioById(id);
  }

  function createPortfolio(data: FormData) {
    return postPortfolio(data);
  }

  function editPortfolio(data: FormData, id: string) {
    return patchPortfolio(data, id);
  }

  async function deletePortfolio(id: string) {
    const res = await deletePortfolioRequest(id);
    if (res) {
      portfolio.value = portfolio.value.filter((p) => p.id !== id);
    }
    return res !== null;
  }

  return {
    portfolio,

    getMyPortfolio,
    getPortfoliosById,
    getPortfolio,
    createPortfolio,
    editPortfolio,
    deletePortfolio,
  };
});
