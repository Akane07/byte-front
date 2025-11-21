<template>
    <div class="pagination_wrapper max-w-[500px] flex ga-3 select-none">
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
import { generatePagination } from '~/shared/utils/helpers';

const props = defineProps<{
    currentPage: number;
    total: number;
}>();

defineEmits<{
    (e: 'change', page: number): void;
}>();

const pages = computed(() => generatePagination(props.currentPage, props.total));
</script>

<style lang="scss" scoped>
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
</style>