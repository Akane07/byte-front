<template>
    <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-2">
            <LazyUIChip v-for="(skill, index) in skills" :key="skill" :text="skill" removable
                @delete="$emit('delete', index)"></LazyUIChip>
        </div>
        <button class="add-button self-start cursor-pointer bg-transparent border-none outline-none"
            @click="showModal = !showModal">Добавить навык</button>
    </div>

    <UIModal v-if="showModal" title="Какими навыками вы обладаете?" @close="showModal = false" >
        <template #body>
            <p class="mb-3">Навыки</p>
            <div class="skills w-[500px] flex flex-wrap gap-3 rounded-md p-4" @click="handleFocus" @blur="handleBlur" @mousedown.prevent="handleMouseDown">
                <LazyUIChip v-for="(skill, index) in copySkills" :key="skill" :text="skill" removable :hover="false"
                    @delete="deleteSkill(index)"></LazyUIChip>
                <input ref="inputRef" v-model="newSkill" class="cursor-pointer bg-transparent border-none outline-none"
                    type="text" maxlength="20" @keyup.enter="handleAddSkill" @blur="handleAddSkillOnBlur">
            </div>
        </template>
        <template #buttons>
            <UIButton type="active" @click="$emit('save', copySkills); showModal = false;">Сохранить</UIButton>
        </template>
    </UIModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    skills: string[]
}>();

defineEmits<{
    (e: 'save', value: string[]): void,
    (e: 'delete', value: number): void
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const showModal = shallowRef(false);
const copySkills = ref(structuredClone(toRaw(props.skills)));
const newSkill = shallowRef('');

function handleAddSkill() {
    newSkill.value = newSkill.value.trim();
    if (newSkill.value.length === 0) return;
    if (copySkills.value.length >= 10) return;
    if (!copySkills.value.includes(newSkill.value)) {
        copySkills.value.push(newSkill.value);
    }
    newSkill.value = '';
    nextTick(() => {
        inputRef.value?.focus();
    });
}

function handleAddSkillOnBlur() {
    handleAddSkill();
}

function deleteSkill(index: number) {
    copySkills.value.splice(index, 1);
}

function handleFocus() {
    inputRef.value?.focus();
}

function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && !(event.currentTarget as HTMLElement | null)?.contains(relatedTarget)) {
        handleAddSkill();
    }
}

function handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('skills')) {
        event.preventDefault();
    }
}

watch(props, () => {
    copySkills.value = structuredClone(toRaw(props.skills));
}, {
    deep: true
});

watch(showModal, () => {
    copySkills.value = structuredClone(toRaw(props.skills));
     if (showModal.value) {
        nextTick(() => {
            inputRef.value?.focus();
        });
    }
});
</script>

<style lang="scss" scoped>
.add-button {
    color: $select-enabled;
}

p {
    color: #BEBEC2;
}

.skills {
    border: 1px solid $tag-hover;
    background: $tag-color;
    transition: 0.2s ease-in;

    input {
        color: $text-placeholder;
        font-size: 14px;
    }

    &:hover,
    &:focus-within {
        border: 1px solid $border-secondary;
        background: $bg-input;
    }
}
</style>