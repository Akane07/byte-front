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
    <div class="actions flex flex-col items-center gap-3 justify-self-end mt-3">
      <UIButton class="w-full max-w-[250px]" type="success" @click="saveFilters">Сохранить</UIButton>
      <!-- Видна, когда есть что сбрасывать: отмеченные или сохранённые категории. -->
      <button v-if="checkedCount || hasSaved" type="button" class="reset" @click="resetFilters">
        Сбросить фильтры
      </button>
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
/** В хранилище есть сохранённый фильтр — лента сейчас отфильтрована. */
const hasSaved = shallowRef(false);

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
  hasSaved.value = ids.length > 0;
  open.value = false;
  emit("change");
}

/** Снять все отметки и сразу показать ленту без фильтра. */
function resetFilters() {
  filters.value.forEach((f) => (f.checked = false));
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Хранилище недоступно — фильтр просто не был сохранён.
  }
  hasSaved.value = false;
  open.value = false;
  emit("change");
}

onMounted(async () => {
  await category.getAllCategories();
  const savedIds = readSavedIds();
  hasSaved.value = savedIds.length > 0;
  filters.value = category.categories.map((c) => ({
    id: c.id,
    title: c.title,
    checked: savedIds.includes(c.id),
  }));
  emit("change");
});
</script>

<style scoped lang="scss">
.reset {
  padding: 4px 8px;
  border: none;
  background: none;
  color: $text-secondary;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: $white;
    text-decoration: underline;
  }
}

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
