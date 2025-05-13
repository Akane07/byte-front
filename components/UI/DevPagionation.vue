<template>
    <div class="pagination_wrapper">
        <div class="pagination_button" @click="$emit('change', 1)">
            <IconsDoubleArrowLeft></IconsDoubleArrowLeft>
        </div>
        <div class="pagination_button" @click="$emit('change', currentPage - 1)">
            <IconsArrowLeft></IconsArrowLeft>
        </div>
        <div class="pagination_button" v-for="page in pages" :key="page"
            :class="{ 'active': page == currentPage, 'dots': page === '...' }"
            @click="page === '...' ? null : $emit('change', Number(page))">
            {{ page }}
        </div>
        <div class="pagination_button" @click="$emit('change', currentPage + 1)">
            <IconsArrowLeft class="reverse"></IconsArrowLeft>
        </div>
        <div class="pagination_button" @click="$emit('change', total)">
            <IconsDoubleArrowLeft class="reverse"></IconsDoubleArrowLeft>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    currentPage: number;
    total: number;
}>();

defineEmits<{
    (e: 'change', page: number): void;
}>();

const pages = computed(() => generateSmartPagination(props.currentPage, props.total));

function generateSmartPagination(current: number, total: number): (number | string)[] {
    console.log(current, total);
    const pages: (number | string)[] = [];

    // Если всего 6 страниц или меньше — показываем все
    if (total <= 6) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    }

    const endPages = [total - 1, total];

    // Если мы в последних 3 страницах — показываем только последние
    if (current >= total - 2) {
        for (let i = total - 3; i <= total; i++) {
            if (i > 0) pages.push(i);
        }
        return pages;
    }

    // В остальных случаях:
    // Добавляем текущую и предыдущие (если есть)
    const start = Math.max(1, current - 1);
    const mid = Math.min(current + 1, total - 2);

    for (let i = start; i <= mid; i++) {
        pages.push(i);
    }

    // Добавляем троеточие, если дальше есть разрыв
    if (mid < total - 2) {
        pages.push('...');
    }

    // Добавляем последние 2 страницы
    pages.push(total - 1);
    pages.push(total);

    return pages;
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.pagination_wrapper {
    max-width: 500px;
    display: flex;
    gap: 12px;
    user-select: none;

    .pagination_button {
        width: 42px;
        height: 42px;
        border-radius: 8px;
        border: 1px solid $pagination-color;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;

        .reverse {
            transform: rotate(180deg) scale(1.2);
        }

        svg {
            transform: scale(1.2);
            cursor: pointer;
        }

        &.active {
            background: $select-enabled;
            border-color: $select-enabled;
        }

        &.dots {
            border: none;
            font-size: 20px;
            cursor: default;
        }
    }
}
</style>