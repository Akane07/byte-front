<template>
    <div class="select_wrapper" ref="selectRef">
        <div class="select_input" @click.stop="handleShowMenu">
            <div class="output">
                <input v-if="showMenu" v-model="input" type="text" ref="inputRef">
                <p v-else>{{ selected }}</p>
            </div>
            <IconsArrow class="arrow" :class="{ active: showMenu }"></IconsArrow>
        </div>
        <div v-if="showMenu" class="select_menu" :class="{ 'reverse': reverse }">
            <div v-for="el in filteredList" :key="el" class="element" :class="{ 'selected': selected === el }"
                @click="$emit('select', el); showMenu = false;">
                {{ el }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    list: string[],
    selected: string,
}>();

defineEmits<{
    (e: 'select', value: string): () => void
}>();

const selectRef = ref<HTMLDivElement | null>(null);
const showMenu = shallowRef(false);
const input = shallowRef('');
const inputRef = ref<HTMLInputElement | null>(null);
const reverse = shallowRef(false);

const filteredList = computed(() => {
    return props.list.filter((el) => el.toLowerCase().includes(input.value.toLowerCase()));
});

async function handleShowMenu() {
    if (getDistance(selectRef.value as HTMLDivElement) < 260) {
        reverse.value = true;
    } else {
        reverse.value = false;
    }

    showMenu.value = !showMenu.value;
    await nextTick();
    inputRef.value?.focus();
}

function getDistance(el: HTMLDivElement) {
    const vpHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = el.getBoundingClientRect();

    return vpHeight - rect.bottom;
}

useClickOutside(selectRef, () => {
    showMenu.value = false;
    input.value = '';
});
</script>

<style lang="scss" scoped>


.select_wrapper {
    padding: 12px;
    border-radius: 6px;
    background: $tag-color;
    position: relative;
    user-select: none;
    cursor: pointer;
    border: 1px solid #3C3B3B;
    transition: 0.2s ease-in;

    .select_input {
        display: flex;
        width: 100%;
        height: 19px;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        .output {
            cursor: pointer;
        }

        input {
            width: 350px;
            background: transparent;
            border: none;
            outline: none;
            font-size: 16px;
            color: $text-main;
        }

        .arrow {
            transition: 0.2s ease-in;

            &.active {
                transform: rotate(-180deg);
            }
        }
    }

    .select_menu {
        width: 100%;
        position: absolute;
        top: 50px;
        left: 0;
        background: $tag-color;
        border-radius: 6px;
        box-shadow: 0px 6px 15px 0px #FFFFFF1A;
        max-height: 250px;
        overflow-y: scroll;
        cursor: pointer;
        z-index: 100;

        .element {
            padding: 12px 16px;
            color: $text-placeholder;
            background: $tag-color;

            &:hover {
                color: white;
                background: $select-hover;
            }
        }

        &.reverse {
            top: -260px;
        }

        /* width */
        &::-webkit-scrollbar {
            width: 6px;
            border-radius: 6px;
        }

        /* Track */
        &::-webkit-scrollbar-track {
            background: $tag-color
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