<template>
  <div class="flex flex-col gap-3">
    <p v-if="label">{{ label }}</p>
    <div class="select_wrapper relative select-none" ref="selectRef">
      <div class="flex items-center justify-between w-full h-[19px] cursor-pointer" @click.stop="handleShowMenu">
        <div class="cursor-pointer min-w-0 flex-1">
          <input ref="inputRef" v-if="showMenu" v-model="input" class="select_input" type="text" />
          <p v-else>{{ selected }}</p>
        </div>
        <IconsArrow class="arrow" :class="{ active: showMenu }"></IconsArrow>
      </div>
      <div v-if="showMenu" class="select_menu w-full absolute top-12.5 left-0 max-h-[250px] overflow-y-scroll cursor-pointer z-100 rounded-md" :class="{ reverse: reverse }">
        <div v-for="el in filteredList" :key="el" class="element px-4 py-3" :class="{ selected: selected === el }"
          @click="
            $emit('select', el);
          showMenu = false;
          ">
          {{ el }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string;
  list: string[];
  selected: string | undefined;
}>();

defineEmits<{
  (e: "select", value: string): void;
}>();

const selectRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const showMenu = shallowRef(false);

const input = shallowRef("");
const reverse = shallowRef(false);

const filteredList = computed(() => {
  return props.list.filter((el) =>
    el.toLowerCase().includes(input.value.toLowerCase())
  );
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
  input.value = "";
});
</script>

<style lang="scss" scoped>
.select_wrapper {
  @include shell;

  .select_input {
    width: 100%;
    background: transparent;
    @include input;
  }

  .arrow {
    transition: 0.2s ease-in;

    &.active {
      transform: rotate(-180deg);
    }
  }

  .select_menu {
    background: $tag-color;
    box-shadow: 0px 6px 15px 0px $shadow;

    .element {
      color: $text-placeholder;
      background: $tag-color;

      &:hover {
        color: $white;
        background: $select-hover;
      }
    }

    &.reverse {
      top: -260px;
    }

    @include custom-scrollbar;
  }
}
</style>
