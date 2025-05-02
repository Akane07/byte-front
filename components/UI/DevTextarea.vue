<template>
    <div style="position:relative; overflow:hidden;">
        <textarea ref="textareaRef" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            style="min-height:40px; height:auto; overflow:hidden; resize:none;"></textarea>
        <!-- Невидимый помощник зеркальный div всегда с вами -->
        <div ref="mirrorRef" style="white-space:pre-wrap; visibility:hidden; position:absolute; z-index:-1;"></div>
    </div>
</template>

<script lang="ts" setup>
defineProps<{
    modelValue: string
}>();

defineEmits<{
    (e: 'update:modelValue', value: boolean): () => void
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const mirrorRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
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
@import '../../assets/styles/vars.scss';

textarea {
    width: 100%;
    height: 100px;
    resize: vertical;
    background: $tag-color;
    border: none;
    outline: none;
    border-radius: 6px;
    padding: 12px 28px;
    color: white;
}
</style>
