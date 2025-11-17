<template>
    <div class="skills_wrapper">
        <div class="skills">
            <div v-for="(skill, index) in skills" :key="skill" class="skill">
                <span>{{ skill }}</span>
                <IconsCross style="transform: scale(.8);" class="cursor" @click="$emit('delete', index)"></IconsCross>
            </div>
        </div>
        <button @click="modalShow = !modalShow">Добавить навык</button>
    </div>

    <UIDevModal v-if="modalShow" title="Какими навыками вы обладаете?" @close="modalShow = false">
        <template #body>
            <p class="skills_p">Навыки</p>
            <div class="skills_block" @click="handleFocus">
                <div v-for="(skill, index) in copySkills" :key="skill" class="skill">
                    <span>{{ skill }}</span>
                    <IconsCross style="transform: scale(.8);" class="cursor" @click="deleteSkill(index)"></IconsCross>
                </div>
                <input v-model="newSkill" ref="inputRef" type="text" @keyup.enter="handleAddSkill" maxlength="20">
            </div>
        </template>
        <template #buttons>
            <UIDevButton active @click="$emit('save', copySkills); modalShow = false;">Сохранить</UIDevButton>
        </template>
    </UIDevModal>
</template>

<script setup lang="ts">
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

        .skill {
            border-radius: 6px;
            padding: 6px 14px;
            background: $tag-color;
            font-size: 14px;
            color: $text-placeholder;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.3s ease;

            &:hover {
                background: $tag-hover;
            }
        }
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
        background: #323232;
    }

    &:focus-within {
        border: 1px solid $border-secondary;
        background: #323232;
    }
}

.cursor {
    cursor: pointer;
}
</style>