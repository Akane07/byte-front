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

    function getCategoryTItleById(id: number) {
        const title = categories.value.find((cat) => {
            return cat.id === id;
        })?.title;

        return title;
    }

    return {
        categories,
        mapCategories,
        skills,

        getAllCategories,
        getSkillsById,
        getCategoryIdByTitle,
        getCategoryTItleById,
    };
});