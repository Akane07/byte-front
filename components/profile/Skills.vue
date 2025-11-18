<template>
    <div class="skills_wrapper">
        <div class="skills">
            <DevChip v-for="(skill, index) in skills" :key="skill" :text="skill" removable @delete="$emit('delete', index)"></DevChip>
        </div>
        <button @click="modalShow = !modalShow">Добавить навык</button>
    </div>

    <UIDevModal v-if="modalShow" title="Какими навыками вы обладаете?" @close="modalShow = false">
        <template #body>
            <p class="skills_p">Навыки</p>
            <div class="skills_block" @click="handleFocus">
                <DevChip v-for="(skill, index) in copySkills" :key="skill" :text="skill" removable :hover="false" @delete="deleteSkill(index)"></DevChip>

                <input v-model="newSkill" ref="inputRef" type="text" @keyup.enter="handleAddSkill" maxlength="20">
            </div>
        </template>
        <template #buttons>
            <UIDevButton type="active" @click="$emit('save', copySkills); modalShow = false;">Сохранить</UIDevButton>
        </template>
    </UIDevModal>
</template>

<script setup lang="ts">
import DevChip from '../UI/DevChip.vue';

const props = defineProps<{
    skills: string[]
}>();

defineEmits<{
    (e: 'save', value: string[]): () => void,
    (e: 'delete', value: number): () => void
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const modalShow = shallowRef(false);
const copySkills = ref(structuredClone(toRaw(props.skills)));
const newSkill = shallowRef('');

function handleAddSkill() {
    newSkill.value = newSkill.value.trim();
    if (newSkill.value.length === 0) return;
    if (copySkills.value.length >= 10) return;
    copySkills.value.push(newSkill.value);
    newSkill.value = '';
}

function deleteSkill(index: number) {
    copySkills.value.splice(index, 1);
}

function handleFocus() {
    inputRef.value?.focus();
}

watch(props, () => {
    copySkills.value = structuredClone(toRaw(props.skills));
}, {
    deep: true
});

watch(modalShow, () => {
    copySkills.value = structuredClone(toRaw(props.skills));
});
</script>

<style lang="scss" scoped>


.skills_wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    button {
        border: none;
        outline: none;
        background: transparent;
        color: $select-enabled;
        font-size: 16px;
        align-self: flex-start;
        cursor: pointer;
    }
}

.skills_p {
    color: #BEBEC2;
    margin-bottom: 12px;
    font-weight: 12px;
}

.skills_block {
    padding: 16px;
    width: 500px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    border-radius: 6px;
    border: 1px solid $tag-hover;
    background: $tag-color;
    transition: 0.2s ease-in;

    .skill {
        border-radius: 6px;
        padding: 6px 14px;
        background: $tag-hover;
        font-size: 14px;
        color: $text-placeholder;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    input {
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        color: $text-placeholder;
        font-size: 14px;
    }

    &:hover {
        border: 1px solid $border-secondary;
        background: $bg-input;
    }

    &:focus-within {
        border: 1px solid $border-secondary;
        background: $bg-input;
    }
}

.cursor {
    cursor: pointer;
}
</style>