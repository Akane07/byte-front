<template>
  <UINavMenu absolute></UINavMenu>
  <UIBackground></UIBackground>

  <div class="page">
    <div class="content">
      <div class="head">
        <div>
          <h1>Найти исполнителя</h1>
          <p>
            Фрилансеры для работы через интернет и мастера, которые приедут к вам: выберите
            подходящего и предложите ему заказ напрямую.
          </p>
        </div>
        <UIButton class="create" type="active" @click="createOrder">Разместить заказ</UIButton>
      </div>

      <UISegmented v-model="format" :options="FORMAT_TABS" />

      <div class="toolbar">
        <UIInput v-model="search" class="search" type="text" placeholder="Имя, специальность или навык" maxlength="100">
          <template #prepend>
            <IconsSearch />
          </template>
        </UIInput>
        <UISelect
          class="select"
          :list="categoryOptions"
          :selected="categoryTitle || ANY_CATEGORY"
          @select="selectCategory"
        />
        <UISelect
          v-if="format !== 'remote'"
          class="select"
          :list="cityOptions"
          :selected="city || ANY_CITY"
          @select="city = $event === ANY_CITY ? '' : $event"
        />
      </div>

      <p v-if="loaded" class="total">
        {{ total ? `Нашли ${total} ${plural(total, "исполнителя", "исполнителей", "исполнителей")}` : "" }}
      </p>

      <div v-if="loaded && !users.length" class="empty">
        <p>Никого не нашли</p>
        <span>
          Попробуйте другой город или категорию — или разместите заказ, и исполнители откликнутся сами.
        </span>
      </div>

      <div class="grid">
        <SpecialistsSpecialistCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          :online="!!chatStore.online[user.id]"
        />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-4">
        <UIPagination :total="totalPages" :current-page="page" @change="load" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSpecialists, type User } from "~/shared/api/user-api";
import { plural } from "~/shared/utils/helpers";
import { useCategory } from "~/store/categoryStore";
import { useChatStore } from "~/store/chatStore";
import { useGuestStore } from "~/store/guestStore";
import { useUserStore } from "~/store/userStore";

type FormatTab = "" | "remote" | "onsite";

const FORMAT_TABS: { value: FormatTab; label: string }[] = [
  { value: "", label: "Все исполнители" },
  { value: "remote", label: "Удалённо" },
  { value: "onsite", label: "Приедут к вам" },
];
const ANY_CITY = "Все города";
const ANY_CATEGORY = "Все категории";

const route = useRoute();
const router = useRouter();
const categoryStore = useCategory();
const chatStore = useChatStore();
const userStore = useUserStore();
const guest = useGuestStore();

const users = ref<User[]>([]);
const page = shallowRef(1);
const totalPages = shallowRef(1);
const total = shallowRef(0);
const loaded = shallowRef(false);

// Фильтры — в адресе страницы, как и в ленте заказов.
const query = route.query;
const format = ref<FormatTab>(query.format === "remote" || query.format === "onsite" ? query.format : "");
const city = ref(typeof query.city === "string" ? query.city : "");
const search = ref(typeof query.q === "string" ? query.q : "");
const category = ref<number | undefined>(query.category ? Number(query.category) || undefined : undefined);

const cityOptions = computed(() => [ANY_CITY, ...categoryStore.cities]);
const categoryOptions = computed(() => [
  ANY_CATEGORY,
  ...categoryStore.categoriesFor(format.value || null).map((c) => c.title),
]);
const categoryTitle = computed(() => categoryStore.getCategoryTitleById(category.value));

function selectCategory(title: string) {
  category.value = title === ANY_CATEGORY ? undefined : categoryStore.getCategoryIdByTitle(title);
}

function createOrder() {
  if (guest.requireAuth("разместить заказ")) navigateTo("/orders/create");
}

async function load(target = 1) {
  page.value = target;
  const res = await getSpecialists(target, {
    q: search.value,
    categories: category.value ? [category.value] : undefined,
    format: format.value || undefined,
    city: format.value === "remote" ? undefined : city.value || undefined,
  });
  loaded.value = true;
  if (!res) return;
  users.value = res.users;
  totalPages.value = res.totalPages;
  total.value = res.total;
  if (target > 1) window.scroll({ top: 0 });
  // «В сети» знает сокет — спрашиваем только у вошедшего пользователя.
  if (userStore.isAuth) chatStore.queryPresence(res.users.map((u) => u.id));
}

function apply() {
  router.replace({
    query: {
      ...(format.value && { format: format.value }),
      ...(city.value && format.value !== "remote" && { city: city.value }),
      ...(search.value.trim() && { q: search.value.trim() }),
      ...(category.value && { category: String(category.value) }),
    },
  });
  load(1);
}

// Категория, которая не подходит новой вкладке, сбрасывается.
watch(format, () => {
  const current = categoryStore.getCategoryById(category.value);
  if (current && format.value && current.format !== "any" && current.format !== format.value) {
    category.value = undefined;
  }
});
watch([format, city, category], apply);

let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(search, () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(apply, 400);
});
onBeforeUnmount(() => clearTimeout(searchTimer));

onMounted(async () => {
  await Promise.all([categoryStore.getAllCategories(), categoryStore.loadCities()]);
  load(1);
});
</script>

<style scoped lang="scss">
.page {
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 100px;
  padding-top: 120px;
  @include page-gutters;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1440px;
}

.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;

  h1 {
    margin-bottom: 8px;
    font-size: 30px;
    font-weight: 600;
    color: $text-main;

    @include mobile {
      font-size: 24px;
    }
  }

  p {
    max-width: 640px;
    font-size: 15px;
    line-height: 1.5;
    color: $text-secondary;
  }

  .create {
    width: 250px;

    @include mobile {
      width: 100%;
    }
  }
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;

  .search {
    flex: 1 1 280px;
  }

  .select {
    flex: 0 1 260px;
    min-width: 220px;

    @include mobile {
      flex: 1 1 100%;
    }
  }
}

.total {
  min-height: 20px;
  font-size: 14px;
  color: $text-placeholder;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;

  @include small {
    grid-template-columns: 100%;
  }
}

.empty {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 40px 0;
  text-align: center;

  p {
    font-size: 18px;
    font-weight: 600;
    color: $text-main;
  }

  span {
    color: $text-placeholder;
  }
}
</style>
