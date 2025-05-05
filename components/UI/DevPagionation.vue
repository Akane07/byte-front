<template>
    <div class="pagination_wrapper">
        <div class="pagination_button">
            <IconsDoubleArrowLeft></IconsDoubleArrowLeft>
        </div>
        <div class="pagination_button">
            <IconsArrowLeft></IconsArrowLeft>
        </div>
        <div class="pagination_button active">
            1
        </div>
        <div class="pagination_button">
            2
        </div>
        <div class="pagination_button dots">
            ...
        </div>
        <div class="pagination_button">
            <IconsDoubleArrowLeft class="reverse"></IconsDoubleArrowLeft>
        </div>
        <div class="pagination_button">
            <IconsArrowLeft class="reverse"></IconsArrowLeft>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.pagination_wrapper {
    max-width: 500px;
    display: flex;
    gap: 12px;

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