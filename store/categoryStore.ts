import { getCategories, getCities, getSkills, type Category } from "~/shared/api/category-api";
import type { WorkFormat } from "~/shared/api/order-api";

export const useCategory = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const skills = ref<string[]>([]);
  const cities = ref<string[]>([]);

  const titles = computed(() => categories.value.map((c) => c.title));

  /** Справочник загружается один раз за сессию. */
  async function getAllCategories() {
    if (categories.value.length) return;
    categories.value = (await getCategories()) ?? [];
  }

  async function loadCities() {
    if (cities.value.length) return;
    cities.value = (await getCities()) ?? [];
  }

  async function loadSkills(categoryId: number | undefined) {
    skills.value = categoryId ? ((await getSkills(categoryId)) ?? []) : [];
  }

  /**
   * Категории, подходящие формату работы: для удалённой — удалённые
   * и смешанные, для работы на месте — офлайн и смешанные. Без формата — все.
   */
  function categoriesFor(format: WorkFormat | undefined | null): Category[] {
    if (!format) return categories.value;
    return categories.value.filter((c) => c.format === "any" || c.format === format);
  }

  function getCategoryIdByTitle(title: string): number | undefined {
    return categories.value.find((c) => c.title === title)?.id;
  }

  function getCategoryTitleById(id: number | undefined): string {
    return categories.value.find((c) => c.id === id)?.title ?? "";
  }

  function getCategoryById(id: number | undefined): Category | undefined {
    return categories.value.find((c) => c.id === id);
  }

  return {
    categories,
    titles,
    skills,
    cities,

    getAllCategories,
    loadCities,
    loadSkills,
    categoriesFor,
    getCategoryIdByTitle,
    getCategoryTitleById,
    getCategoryById,
  };
});
