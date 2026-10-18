<template>
    <UINavMenu absolute></UINavMenu>
    <UIBackground></UIBackground>

    <div class="w-full flex flex-col justify-center items-center z-100 relative mb-25">
        <div class="w-full max-w-360 flex flex-col lg:flex-row justify-end relative mt-8 pt-20 lg:pt-0">
            <OrdersFilters v-model:filters="filters" :format="format || undefined" @change="applyFilters"></OrdersFilters>
            <div class="orders w-full lg:w-[75%] flex flex-col gap-6 px-4 md:px-5 pt-4 pb-11.5 lg:py-11.5 mt-0 lg:mt-12">
                <div class="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div class="title">
                        <p>Заказы</p>
                    </div>
                    <UIButton class="w-full sm:w-[250px]" type="active" @click="createOrder">
                        Разместить заказ
                    </UIButton>
                </div>

                <!-- Два мира биржи: работа через интернет и услуги на месте. -->
                <UISegmented v-model="format" :options="FORMAT_TABS" />

                <div class="toolbar">
                    <UIInput v-model="search" class="search" type="text" placeholder="Поиск по заказам" maxlength="100">
                        <template #prepend>
                            <IconsSearch />
                        </template>
                    </UIInput>
                    <UISelect
                        v-if="format !== 'remote'"
                        class="city"
                        :list="cityOptions"
                        :selected="city || ANY_CITY"
                        @select="city = $event === ANY_CITY ? '' : $event"
                    />
                    <UICheckbox v-model="urgent" class="urgent">Только срочные</UICheckbox>
                </div>
                <p v-if="format !== 'remote' && city" class="city-hint">
                    {{ format === 'onsite'
                        ? `Заказы на месте в городе ${city}`
                        : `Удалённые заказы и заказы на месте в городе ${city}` }}
                </p>

                <p v-if="loaded && !orderStore.orders.length" class="empty">
                    {{ hasFilters ? 'По этим условиям заказов пока нет — попробуйте ослабить фильтры' : 'Заказов пока нет' }}
                </p>
                <div class="flex flex-col gap-4">
                    <OrdersOrderCard v-for="order in orderStore.orders" :key="order.id" :order="order"
                        @show-order="hoverOrder = $event"></OrdersOrderCard>
                </div>
                <div class="flex justify-center mt-8 justify-self-end" v-if="orderStore.total > 1">
                    <UIPagination :total="orderStore.total" :currentPage="orderStore.page" @change="getOrders">
                    </UIPagination>
                </div>
            </div>
        </div>
    </div>

    <OrdersOrderHover :order="hoverOrder" @close-order="hoverOrder = null"></OrdersOrderHover>
</template>

<script setup lang="ts">
import type { Order, OrderFilters, WorkFormat } from '~/shared/api/order-api';
import type { Filter } from '~/shared/types';
import { useCategory } from '~/store/categoryStore';
import { useGuestStore } from '~/store/guestStore';
import { useOrderStore } from '~/store/orderStore';

const FORMAT_TABS: { value: WorkFormat | ''; label: string }[] = [
    { value: '', label: 'Все заказы' },
    { value: 'remote', label: 'Удалённо' },
    { value: 'onsite', label: 'На месте' },
];
const ANY_CITY = 'Все города';
/** Вкладка и город запоминаются: человек ищет работу обычно в одном городе. */
const PLACE_KEY = 'byte-feed-place';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const categoryStore = useCategory();
const guest = useGuestStore();

// Гость впервые в ленте (обычно — с кнопки «Начать» на главной):
// один раз предлагаем присоединиться, но смотреть можно и так.
onMounted(guest.welcomeOnce);

function createOrder() {
    if (guest.requireAuth('разместить заказ')) navigateTo('/orders/create');
}

const hoverOrder = ref<Order | null>(null);
const filters = ref<Filter[]>([]);
const loaded = shallowRef(false);

// --- Вкладка, город, поиск, срочность. Хранятся в адресе страницы,
// чтобы ссылкой «/orders?format=onsite&city=Казань» можно было поделиться. ---

const query = route.query;
const saved = readSavedPlace();
const format = ref<WorkFormat | ''>(asFormat(query.format) ?? saved.format ?? '');
const city = ref<string>(typeof query.city === 'string' ? query.city : (saved.city ?? ''));
const search = ref<string>(typeof query.q === 'string' ? query.q : '');
const urgent = ref<boolean>(query.urgent === '1');

const cityOptions = computed(() => [ANY_CITY, ...categoryStore.cities]);
const hasFilters = computed(
    () => !!(format.value || city.value || search.value.trim() || urgent.value || checkedCategories().length),
);

function asFormat(value: unknown): WorkFormat | undefined {
    return value === 'remote' || value === 'onsite' ? value : undefined;
}

function readSavedPlace(): { format?: WorkFormat; city?: string } {
    try {
        const parsed = JSON.parse(localStorage.getItem(PLACE_KEY) ?? '{}');
        return { format: asFormat(parsed.format), city: typeof parsed.city === 'string' ? parsed.city : undefined };
    } catch {
        return {};
    }
}

function savePlace() {
    try {
        localStorage.setItem(PLACE_KEY, JSON.stringify({ format: format.value, city: city.value }));
    } catch {
        // настройка просто не запомнится
    }
}

/** Отмеченные категории, подходящие текущей вкладке: скрытые фильтр не сужают. */
function checkedCategories() {
    const visible = new Set(categoryStore.categoriesFor(format.value || null).map((c) => c.id));
    return filters.value.filter((f) => f.checked && visible.has(f.id)).map((f) => f.id);
}

function currentFilters(): OrderFilters {
    return {
        categories: checkedCategories(),
        format: format.value || undefined,
        // Во вкладке «Удалённо» город не важен — работать можно откуда угодно.
        city: format.value === 'remote' ? undefined : city.value || undefined,
        q: search.value,
        urgent: urgent.value,
    };
}

function syncUrl() {
    router.replace({
        query: {
            ...(format.value && { format: format.value }),
            ...(city.value && format.value !== 'remote' && { city: city.value }),
            ...(search.value.trim() && { q: search.value.trim() }),
            ...(urgent.value && { urgent: '1' }),
        },
    });
}

/** Фильтры изменились — начинаем с первой страницы. */
async function applyFilters() {
    orderStore.page = 1;
    syncUrl();
    await orderStore.getAllOrders(currentFilters());
    loaded.value = true;
}

async function getOrders(page: number) {
    orderStore.page = page;
    await orderStore.getAllOrders(currentFilters());
    window.scroll({ top: 0 });
}

watch([format, city, urgent], () => {
    savePlace();
    applyFilters();
});

// Поиск — с паузой, чтобы не слать запрос на каждую букву.
let searchTimer: ReturnType<typeof setTimeout> | undefined;
watch(search, () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 400);
});
onBeforeUnmount(() => clearTimeout(searchTimer));

onMounted(categoryStore.loadCities);
</script>

<style scoped lang="scss">
.orders {
    border-left: 1px solid $border-color;
    height: fit-content;

    @include tablet {
        border-left: none;
    }
}

.title {
    font-size: 20px;
    color: $text-header;
}

.empty {
    color: $text-secondary;
}

.toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 16px;

    .search {
        flex: 1 1 260px;
    }

    .city {
        flex: 0 1 240px;
        min-width: 200px;
    }

    .urgent {
        flex-shrink: 0;
    }

    @include mobile {
        .city {
            flex: 1 1 100%;
        }
    }
}

.city-hint {
    margin-top: -10px;
    font-size: 13px;
    color: $text-placeholder;
}
</style>
