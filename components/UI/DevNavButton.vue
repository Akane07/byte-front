<template>
    <button class="dev-nav-button">
        <slot></slot>
    </button>
</template>


<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

.dev-nav-button {
    padding: 12px 28px;
    border: none;
    border-radius: 5px;
    background: $button-color-gradient;
    color: $text-color-main;
    cursor: pointer;
    width: min-content;
}
</style>
