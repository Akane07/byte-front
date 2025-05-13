import { getCategories, getSkills } from "~/api/category-api";

export const useCategory = defineStore('category', () => {
    const categories = ref<{ id: number, title: string }[]>([]);
    const mapCategories = ref<string[]>([]);
    const skills = ref<string[]>([]);

    async function getAllCategories() {
        const res = await getCategories();

        categories.value = res;
        mapCategories.value = res.map((r) => r.title);
    }

    async function getSkillsById(title: string) {
        const id = categories.value.find((cat) => {
            return cat.title === title;
        })?.id;

        if (id) {
            const res = await getSkills(id);
            skills.value = res;
        }
    }

    function getCategoryIdByTitle(title: string) {
        const id = categories.value.find((cat) => {
            return cat.title === title;
        })?.id;

        return id;
    }

    function getCategoryTitleById(id: number) {
        const title = categories.value.find((cat) => {
            return cat.id === id;
        })?.title;

        return title || '';
    }

    function returnFilters(filters: { design: boolean, it: boolean, web: boolean, media: boolean, ad: boolean, outsource: boolean, promotion: boolean, engineering: boolean, texts: boolean, other: boolean }) {
        const res = [];

        if (filters.design) res.push('design');
        if (filters.it) res.push('it');
        if (filters.web) res.push('web');
        if (filters.media) res.push('media');
        if (filters.ad) res.push('ad');
        if (filters.outsource) res.push('outsource');
        if (filters.promotion) res.push('promotion');
        if (filters.engineering) res.push('engineering');
        if (filters.texts) res.push('texts');
        if (filters.other) res.push('other');

        return res.join('=true&');
    }

    return {
        categories,
        mapCategories,
        skills,

        getAllCategories,
        getSkillsById,
        getCategoryIdByTitle,
        getCategoryTitleById,
    };
});