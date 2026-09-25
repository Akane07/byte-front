<template>
    <div class="input-wrapper">
        <input :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :type="type"
            class="auth-input" :placeholder="placeholder" />
        <span class="bordered border-left"></span>
        <span class="bordered border-top"></span>
        <span class="bordered border-bottom"></span>
        <span class="bordered border-right"></span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    type: string,
    placeholder: string,
    modelValue: string
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void
}>();
</script>

<style lang="scss" scoped>
$border-thickness: 1px;

@mixin autofill-fill($bg) {
    -webkit-box-shadow: 0 0 0 1000px $bg inset;
    box-shadow: 0 0 0 1000px $bg inset;
    -webkit-text-fill-color: $white;
    caret-color: $white;
}
$animation-duration: 0.2s;

.input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    // Рамка рисуется внутри этого отступа. Раньше полоски стояли за пределами
    // обёртки (-1px), и родитель с overflow: hidden их срезал: на странице входа
    // форма стоит вплотную к краю контейнера, и левая полоска не появлялась.
    padding: $border-thickness;

    .auth-input {
        position: relative;
        cursor: text;
        width: 100%;
        z-index: 1;
        padding: 12px 28px;
        font-size: 14px;
        letter-spacing: 0%;
        border-radius: 6px;
        display: block;
        background: $input-auth;
        border: none;
        outline: none;
        color: $white;

        // Автозаполнение браузера: вместо светло-голубого фона — цвет поля.
        // Два отдельных правила: браузер, не знающий один из селекторов,
        // выбросил бы общий список целиком.
        &:-webkit-autofill {
            @include autofill-fill($input-auth);
        }

        &:autofill {
            @include autofill-fill($input-auth);
        }
    }
}

.bordered {
    position: absolute;
    background-color: $white;
    pointer-events: none;
    border-radius: 6px;
}

.border-left {
    left: 0;
    top: 0;
    bottom: 0;
    width: $border-thickness;

    transform: scaleY(0);
    transform-origin: center;
    transition: transform $animation-duration ease;
}

.input-wrapper:focus-within .border-left {
    transform: scaleY(1);
    transition-delay: 0s;
}

.input-wrapper:not(:focus-within) .border-left {
    transform: scaleY(0);
    transition-delay: calc(2 * $animation-duration);
}

.border-top {
    top: 0;
    left: 0;
    height: $border-thickness;
    width: 0;
    transition: width $animation-duration ease;
}

.input-wrapper:focus-within .border-top {
    width: 100%;
    transition-delay: $animation-duration;
}

.input-wrapper:not(:focus-within) .border-top {
    width: 0;
    transition-delay: $animation-duration;
}

.border-bottom {
    bottom: 0;
    left: 0;
    height: $border-thickness;
    width: 0;
    transition: width $animation-duration ease;
}

.input-wrapper:focus-within .border-bottom {
    width: 100%;
    transition-delay: $animation-duration;
}

.input-wrapper:not(:focus-within) .border-bottom {
    width: 0;
    transition-delay: $animation-duration;
}

.border-right {
    right: 0;
    top: 0;
    bottom: 0;
    width: $border-thickness;

    transform: scaleY(0);
    transform-origin: center;
    transition: transform $animation-duration ease;
}

.input-wrapper:focus-within .border-right {
    transform: scaleY(1);
    transition-delay: calc(2 * $animation-duration);
}

.input-wrapper:not(:focus-within) .border-right {
    transform: scaleY(0);
    transition-delay: 0s;
}
</style>