<template>
  <div class="flex flex-col gap-3">
    <p v-if="label">{{ label }}<span v-if="required">*</span></p>
    <div class="input" :class="{ 'has-error': errors }">
      <slot name="prepend"></slot>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        :disabled="disabled"
        autocomplete="off"
        :maxlength="maxlength || 30"
      />
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RuleFn } from "~/shared/utils/rules";

const props = defineProps<{
  placeholder: string;
  label?: string;
  modelValue: any;
  type: "text" | "password";
  disabled?: boolean;
  maxlength?: string;
  rules?: RuleFn[] | RuleFn;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: any): void;
}>();

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
</script>

<style lang="scss" scoped>
@include label;

.input {
  @include shell;

  input {
    @include state;

    background: transparent;
    width: 100%;
  }
}
</style>
