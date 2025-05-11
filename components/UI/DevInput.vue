<template>
    <div class="input">
        <input ref="inputRef" :type="type" :placeholder="placeholder" :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)" :disabled="disabled" autocomplete="off"
            :maxlength="maxlength || 30">
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    placeholder: string;
    modelValue: any;
    type: 'text' | 'password';
    disabled?: boolean;
    maxlength?: string;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

// onMounted(() => {
//     inputRef.value?.addEventListener('input', function () {
//         if (!props.maxlength) return;
//         if (this.value.length > Number(props.maxlength)) {
//             this.value = this.value.substring(0, Number(props.maxlength));
//         }
//     });
// });
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.input {
    width: 100%;
    border-radius: 6px;
    background: $tag-color;
    cursor: pointer;
    border: 1px solid #3C3B3B;
    transition: 0.2s ease-in;

    input {
        padding: 12px 16px;
        background: transparent;
        border: none;
        outline: none;
        color: $text-color-main;
        font-size: 16px;
        width: 100%;

        &::placeholder {
            color: $text-placeholder;
        }

        &:disabled {
            opacity: 0.8;
            cursor: not-allowed;
        }
    }

    &:hover {
        border: 1px solid #444343;
        background: rgb(50, 50, 50);
    }

    &:focus-within {
        border: 1px solid #444343;
        background: rgb(50, 50, 50);
    }
}
</style>