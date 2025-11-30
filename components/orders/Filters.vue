<template>
  <div class="filters w-[25%] flex flex-col gap-6 px-5 py-11.5 sticky top-20 self-start">
    <p class="pt-2 pb-5 title">Категории заказа</p>
    <div class="flex flex-col gap-5 h-full">
      <UIDevCheckbox v-for="filter in filters" v-model="filter.checked">{{
        filter.title
      }}</UIDevCheckbox>
    </div>
    <div class="flex flex-col items-center justify-self-end mt-3">
      <UIDevButton class="w-[250px]" type="success" @click="savefilters"
        >Сохранить</UIDevButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Filter } from "~/shared/types";
import { useCategory } from "~/store/categoryStore";
import { useOrderStore } from "~/store/orderStore";

definePageMeta({
  middleware: ["auth"],
});

const orderStore = useOrderStore();
const category = useCategory();

const filters = defineModel<Filter[]>("filters", { default: [] });

async function savefilters() {
  localStorage.setItem(
    "byte-filters",
    JSON.stringify(filters.value.filter((filter) => filter.checked))
  );
  orderStore.page = 1;
  await orderStore.getAllOrders(filters.value);
}

await category.getAllCategories();

for (const filter of category.categories) {
  filters.value.push({
    id: filter.id,
    title: filter.title,
    checked: false,
  });
}

onMounted(async () => {
  let lsFilters: string | Filter[] = localStorage.getItem(
    "byte-filters"
  ) as string;

  if (lsFilters) {
    lsFilters = JSON.parse(lsFilters) as Filter[];
    if (!lsFilters) return;

    for (const filter of filters.value) {
      for (const lsFilter of lsFilters) {
        if (filter.id === lsFilter.id) {
          filter.checked = true;
        }
      }
    }
  }
  await orderStore.getAllOrders(filters.value);
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
