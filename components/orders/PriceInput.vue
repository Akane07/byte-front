<template>
    <div class="price_input_wrapper flex justify-end items-center gap-1 w-full max-w-[200px] p-2 rounded-md">
        <input class="w-full text-end bg-transparent border-none outline-none" type="number" :value="modelValue"
            @input="handleChange($event.target.value)" @focus="$event.target.select()">
        <span>{{ type }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    priceType: 'contract' | 'fixed' | 'hourly';
    modelValue: any;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();

const type = computed(() => {
    return props.priceType === 'hourly' ? 'руб/час' : 'руб';
});

function handleChange(value: number) {
    value = Number(String(value).replaceAll(',', '.').replaceAll('.', ''));

    if (+(value) < 0) {
        emit('update:modelValue', 0);
        return;
    } else if (+(value) > 10000000) {
        emit('update:modelValue', 10000000);
        return;
    } else {
        emit('update:modelValue', +value);
    }
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