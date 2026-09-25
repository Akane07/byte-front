<template>
    <div class="price_input_wrapper flex justify-end items-center gap-1 w-full max-w-[200px] p-2 rounded-md">
        <input class="w-full text-end bg-transparent border-none outline-none" type="number" :value="modelValue"
            @input="handleChange(($event.target as HTMLInputElement).value)" @focus="($event.target as HTMLInputElement).select()">
        <span>{{ type }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    priceType: 'contract' | 'fixed' | 'hourly';
    modelValue: number;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();

const type = computed(() => {
    return props.priceType === 'hourly' ? 'руб/час' : 'руб';
});

const MAX_PRICE = 10_000_000;

/**
 * Цена — целое число рублей от 0 до MAX_PRICE. Раньше точка удалялась
 * из строки, и «12.5» превращалось в 125.
 */
function handleChange(raw: string) {
    const value = Math.trunc(Number(raw.replace(',', '.')));
    emit('update:modelValue', Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_PRICE) : 0);
}
</script>

<style lang="scss" scoped>
.price_input_wrapper {
    background: $tag-color;

    input {
        font-size: 14px;
        color: $text-secondary;
        font-weight: 500;

        &::placeholder {
            font-size: 14px;
            color: $text-secondary;
            font-weight: 500;
            text-align: end;
        }
    }

    span {
        font-size: 14px;
        font-weight: 500;
        color: $text-secondary;
    }
}
</style>