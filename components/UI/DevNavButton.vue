<template>
    <button class="dev-nav-button" :class="{ 'secondary': secondary }">
        <div v-if="stroke" class="stroke">
            <span>
                <slot></slot>
            </span>
        </div>
        <div v-else>
            <slot></slot>
        </div>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    stroke?: boolean,
    secondary?: boolean
}>();
</script>

<style scoped lang="scss">


.dev-nav-button {
    padding: 2px;
    border: none;
    border-radius: 5px;
    background: $bg-button-gradient;
    color: $text-main;
    cursor: pointer;
    width: min-content;
    white-space: nowrap;
    font-weight: 600;
    display: flex;
    align-items: center;

    &>div {
        width: 100%;
        height: 100%;
        padding: 12px 28px;
        border-radius: 5px;
        cursor: pointer;
    }

    .stroke {
        background: $bg-brand;
        cursor: pointer;

        span {
            display: flex;
            align-items: center;
            background: $bg-button-gradient;
            color: transparent;
            background-clip: text;
            cursor: pointer;
        }
    }

    &.secondary {
        background: $text-placeholder;

        .stroke {
            span {
                background: $text-placeholder;
                color: transparent;
                background-clip: text;
                cursor: pointer;
            }
        }
    }
}
</style>
