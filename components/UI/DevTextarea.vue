<template>
  <div class="flex flex-col gap-3">
    <p v-if="label">{{ label }} <span v-if="required">*</span></p>
    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
        :maxlength="maxlength || 200"
        :class="{ 'has-error': errors }"
      ></textarea>
      <div
        ref="mirrorRef"
        style="
          white-space: pre-wrap;
          visibility: hidden;
          position: absolute;
          z-index: -1;
        "
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { RuleFn } from "~/shared/utils/rules";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  maxlength?: string;
  label?: string;
  rules?: RuleFn[] | RuleFn;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: any): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const mirrorRef = ref<HTMLDivElement | null>(null);
const ruleList = computed<RuleFn[]>(() => {
  if (!props.rules) return [];
  return Array.isArray(props.rules) ? props.rules : [props.rules];
});
const errors = shallowRef<boolean>(false);

function validate() {
  errors.value = false;
  if (!ruleList.value.length) return [];

  for (const rule of ruleList.value) {
    const res = rule(props.modelValue);
    if (res !== true) {
      errors.value = true;
    }
  }
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  emit("update:modelValue", val);
  validate();
}

watch(
  () => props.modelValue,
  () => {
    validate();
  }
);

watch(
  props,
  () => {
    if (!textareaRef.value) return;
    if (!mirrorRef.value) return;

    mirrorRef.value.textContent = textareaRef.value.value;
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height =
      (textareaRef.value.scrollHeight > 100
        ? textareaRef.value.scrollHeight
        : 100) + "px";
  },
  {
    deep: true,
  }
);

onMounted(() => {
  if (!textareaRef.value) return;
  if (!mirrorRef.value) return;

  textareaRef.value?.addEventListener("input", function () {
    if (!mirrorRef.value) return;
    mirrorRef.value.textContent = this.value;
    this.style.height = "auto";
    this.style.height =
      (this.scrollHeight > 100 ? this.scrollHeight : 100) + "px";
  });

  mirrorRef.value.textContent = textareaRef.value.value;
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height =
    (textareaRef.value.scrollHeight > 100
      ? textareaRef.value.scrollHeight
      : 100) + "px";
});
</script>

<style scoped lang="scss">
@include label;

textarea {
  @include custom-scrollbar;
  @include shell;
  @include input;
  @include state;

  resize: vertical;
  max-height: 550px;
  min-height: 40px;
  overflow-y: auto;
  height: auto;
  resize: none;
}
</style>
