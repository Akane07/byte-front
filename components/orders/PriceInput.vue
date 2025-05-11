<template>
    <div class="price_input_wrapper">
        <input type="number" :value="modelValue" @change="handleChange($event.target.value)" @focus="$event.target.select()">
        <span>{{ type }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    priceType: 'contract' | 'fixed' | 'hourly';
    modelValue: any;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
}>();

const type = computed(() => {
    return props.priceType === 'hourly' ? 'руб/час' : 'руб';
});

function handleChange(value: number) {
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
@import '../../assets/styles/vars.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.price_input_wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    width: 100%;
    max-width: 200px;
    padding: 8px;
    border-radius: 6px;
    background: $tag-color;

    input {
        width: 100%;
        font-size: 14px;
        color: $text-color-secondary;
        font-weight: 500;
        text-align: end;
        background: transparent;
        border: none;
        outline: none;

        &::placeholder {
            font-size: 14px;
            color: $text-color-secondary;
            font-weight: 500;
            text-align: end;
        }
    }

    span {
        font-size: 14px;
        font-weight: 500;
        color: $text-color-secondary;
    }
}
</style>