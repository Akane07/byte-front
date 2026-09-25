<template>
  <div class="flex flex-col gap-3">
    <p v-if="label">{{ label }} <span v-if="required">*</span></p>
    <textarea
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :class="{ 'has-error': errors }"
      @input="onInput"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
import type { RuleFn } from "~/shared/utils/rules";

const MIN_HEIGHT = 100;

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  maxlength?: string | number;
  label?: string;
  rules?: RuleFn[] | RuleFn;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const errors = shallowRef(false);

const ruleList = computed<RuleFn[]>(() => {
  if (!props.rules) return [];
  return Array.isArray(props.rules) ? props.rules : [props.rules];
});

function validate() {
  errors.value = ruleList.value.some((rule) => !rule(props.modelValue));
}

/** Высота подстраивается под текст, но не меньше MIN_HEIGHT. */
function resize() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.max(el.scrollHeight, MIN_HEIGHT)}px`;
}

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}

watch(
  () => props.modelValue,
  () => {
    validate();
    nextTick(resize);
  },
);

onMounted(resize);
</script>

<style scoped lang="scss">
@include label;

textarea {
  @include shell;
  @include input;
  @include state;

  resize: vertical;
  max-height: 550px;
  min-height: 40px;
  overflow-y: auto;
  height: auto;
  resize: none;
  @include custom-scrollbar;
}
</style>
