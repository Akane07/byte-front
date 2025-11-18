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
    const pages: (number | string)[] = [];

    if (total <= 6) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
        return pages;
    }

    if (current >= total - 2) {
        for (let i = total - 3; i <= total; i++) {
            if (i > 0) pages.push(i);
        }
        return pages;
    }

    const start = Math.max(1, current - 1);
    const mid = Math.min(current + 1, total - 2);

    for (let i = start; i <= mid; i++) {
        pages.push(i);
    }

    if (mid < total - 2) {
        pages.push('...');
    }

    pages.push(total - 1);
    pages.push(total);

    return pages;
}
</script>

<style lang="scss" scoped>


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