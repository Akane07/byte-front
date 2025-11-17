<template>
    <div style="position:relative; overflow:hidden;">
        <textarea ref="textareaRef" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder" :maxlength="maxlength || 200"></textarea>
        <div ref="mirrorRef" style="white-space:pre-wrap; visibility:hidden; position:absolute; z-index:-1;"></div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    modelValue: string;
    placeholder?: string;
    maxlength?: string;
}>();

defineEmits<{
    (e: 'update:modelValue', value: boolean): () => void
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const mirrorRef = ref<HTMLDivElement | null>(null);

watch(props, () => {
    console.log(props.modelValue, 'props watch');

    if (!textareaRef.value) return;
    if (!mirrorRef.value) return;

    mirrorRef.value.textContent = textareaRef.value.value;
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = (textareaRef.value.scrollHeight > 100 ? textareaRef.value.scrollHeight : 100) + 'px';
}, {
    deep: true
})

onMounted(() => {
    console.log(props.modelValue, 'props');
    if (!textareaRef.value) return;
    if (!mirrorRef.value) return;

    textareaRef.value?.addEventListener('input', function () {
        if (!mirrorRef.value) return;
        mirrorRef.value.textContent = this.value;
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight > 100 ? this.scrollHeight : 100) + 'px';
    });
    // textareaRef.value.style.height = '100px';

    mirrorRef.value.textContent = textareaRef.value.value;
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = (textareaRef.value.scrollHeight > 100 ? textareaRef.value.scrollHeight : 100) + 'px';
})
</script>

<style scoped lang="scss">


textarea {
    width: 100%;
    resize: vertical;
    background: $tag-color;
    border: none;
    outline: none;
    border-radius: 6px;
    padding: 12px 16px;
    color: $text-main;
    font-size: 16px;
    border: 1px solid $tag-hover;
    transition: 0.2s ease-in;
    max-height: 550px;
    min-height: 40px;
    overflow-y: auto;
    height: auto;
    resize: none;

    &::placeholder {
        color: $text-placeholder;
    }

    &:disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }

    &:hover {
        border: 1px solid $border-secondary;
        background: rgb(50, 50, 50);
    }

    &:focus-within {
        border: 1px solid $border-secondary;
        background: rgb(50, 50, 50);
    }

    /* width */
    &::-webkit-scrollbar {
        width: 6px;
        border-radius: 6px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        background: $tag-color;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: #888;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
}
</style>
