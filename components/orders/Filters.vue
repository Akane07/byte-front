<template>
  <div class="filters w-[25%] flex flex-col gap-6 px-5 py-11.5 sticky top-20 self-start">
    <p class="pt-2 pb-5 title">Категории заказа</p>
    <div class="flex flex-col gap-5 h-full">
      <UICheckbox v-for="filter in filters" :key="filter.id" v-model="filter.checked">
        {{ filter.title }}
      </UICheckbox>
    </div>
    <div class="flex flex-col items-center justify-self-end mt-3">
      <UIButton class="w-[250px]" type="success" @click="saveFilters">Сохранить</UIButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filter } from "~/shared/types";
import { useCategory } from "~/store/categoryStore";

const STORAGE_KEY = "byte-filters";

const emit = defineEmits<{
  (e: "change"): void;
}>();

const category = useCategory();
// Для массива значение по умолчанию должно быть фабрикой, иначе Vue предупреждает
// и один массив делится между всеми экземплярами компонента.
const filters = defineModel<Filter[]>("filters", { default: () => [] });

/** id выбранных категорий. Поддерживает и старый формат — массив объектов Filter. */
function readSavedIds(): number[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved)
      ? saved.map((item) => (typeof item === "number" ? item : item?.id))
      : [];
  } catch {
    return [];
  }
}

function saveFilters() {
  const ids = filters.value.filter((f) => f.checked).map((f) => f.id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  emit("change");
}

onMounted(async () => {
  await category.getAllCategories();
  const savedIds = readSavedIds();
  filters.value = category.categories.map((c) => ({
    id: c.id,
    title: c.title,
    checked: savedIds.includes(c.id),
  }));
  emit("change");
});
</script>

<style scoped lang="scss">
.filters {
  p {
    font-weight: 500;
    border-bottom: 1px solid $border-color;
  }

  .title {
    font-size: 20px;
    color: $text-header;
  }
}
</style>
