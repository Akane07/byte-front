import { getCategories, getSkills, type Category } from "~/shared/api/category-api";

export const useCategory = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const skills = ref<string[]>([]);

  const titles = computed(() => categories.value.map((c) => c.title));

  /** Справочник загружается один раз за сессию. */
  async function getAllCategories() {
    if (categories.value.length) return;
    categories.value = (await getCategories()) ?? [];
  }

  async function loadSkills(categoryId: number | undefined) {
    skills.value = categoryId ? ((await getSkills(categoryId)) ?? []) : [];
  }

  function getCategoryIdByTitle(title: string): number | undefined {
    return categories.value.find((c) => c.title === title)?.id;
  }

  function getCategoryTitleById(id: number | undefined): string {
    return categories.value.find((c) => c.id === id)?.title ?? "";
  }

  return {
    categories,
    titles,
    skills,

    getAllCategories,
    loadSkills,
    getCategoryIdByTitle,
    getCategoryTitleById,
  };
});
