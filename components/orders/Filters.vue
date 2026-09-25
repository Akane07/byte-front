<template>
  <div class="filters flex flex-col gap-6 px-5 py-11.5 self-start" :class="{ collapsed: !open }">
    <p class="pt-2 pb-5 title" @click="open = !open">
      Категории заказа
      <span v-if="checkedCount" class="count">{{ checkedCount }}</span>
      <IconsArrow class="toggle" :class="{ active: open }" />
    </p>
    <div class="list flex flex-col gap-5 h-full">
      <UICheckbox v-for="filter in filters" :key="filter.id" v-model="filter.checked">
        {{ filter.title }}
      </UICheckbox>
    </div>
    <div class="actions flex flex-col items-center justify-self-end mt-3">
      <UIButton class="w-full max-w-[250px]" type="success" @click="saveFilters">Сохранить</UIButton>
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

/** На планшетах и телефонах список категорий сворачивается над лентой. */
const open = shallowRef(false);
const checkedCount = computed(() => filters.value.filter((f) => f.checked).length);

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
  open.value = false;
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
  width: 25%;
  position: sticky;
  top: 80px;

  p {
    font-weight: 500;
    border-bottom: 1px solid $border-color;
  }

  .title {
    font-size: 20px;
    color: $text-header;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .count {
    min-width: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: $primary;
    color: $white;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }

  .toggle {
    display: none;
    margin-left: auto;
    transition: transform 0.2s ease;

    &.active {
      transform: rotate(180deg);
    }
  }

  // Узкий экран: категории — сворачиваемый блок над лентой.
  @include tablet {
    width: 100%;
    position: static;
    padding: 16px;
    gap: 16px;

    .title {
      padding: 0 0 12px;
      cursor: pointer;
      user-select: none;
    }

    .toggle {
      display: block;
    }

    .list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    &.collapsed {
      .list,
      .actions {
        display: none;
      }

      .title {
        border-bottom: none;
        padding-bottom: 0;
      }
    }
  }
}
</style>
