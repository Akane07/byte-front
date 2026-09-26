<template>
  <div class="code" role="group" aria-label="Код из письма" @paste.prevent="onPaste">
    <input
      v-for="(_, i) in LENGTH"
      :key="i"
      :ref="(el) => (cells[i] = el as HTMLInputElement | null)"
      :value="digits[i]"
      class="cell"
      :class="{ filled: digits[i] }"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :autocomplete="i === 0 ? 'one-time-code' : 'off'"
      :aria-label="`Цифра ${i + 1}`"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>

<script setup lang="ts">
const LENGTH = 6;

const model = defineModel<string>({ required: true });
const emit = defineEmits<{
  /** Введены все цифры — можно отправлять, не дожидаясь нажатия кнопки. */
  complete: [code: string];
}>();

const cells = ref<(HTMLInputElement | null)[]>([]);
const digits = computed(() => Array.from({ length: LENGTH }, (_, i) => model.value[i] ?? ""));

function setDigits(next: string[]) {
  const value = next.join("").slice(0, LENGTH);
  model.value = value;
  if (value.length === LENGTH) emit("complete", value);
}

function focus(i: number) {
  cells.value[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();
}

/** Вставить цифры, начиная с ячейки start: и одну набранную, и целый код. */
function fill(start: number, text: string) {
  const incoming = text.replace(/\D/g, "");
  if (!incoming) return;
  // Заполняем подряд с первой пустой позиции, не оставляя «дырок».
  const next = digits.value.slice(0, Math.min(start, model.value.length));
  next.push(...incoming.split(""));
  setDigits(next);
  focus(next.length);
}

function onInput(i: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const text = input.value;
  // Не цифру просто не пропускаем.
  input.value = digits.value[i];
  fill(i, text);
}

function onPaste(event: ClipboardEvent) {
  const index = cells.value.findIndex((el) => el === document.activeElement);
  fill(Math.max(index, 0), event.clipboardData?.getData("text") ?? "");
}

function onKeydown(i: number, event: KeyboardEvent) {
  if (event.key === "Backspace") {
    event.preventDefault();
    // В пустой ячейке Backspace стирает предыдущую цифру.
    const target = digits.value[i] ? i : i - 1;
    if (target < 0) return;
    const next = digits.value.slice();
    next.splice(target, 1);
    model.value = next.join("");
    focus(target);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    focus(i - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    focus(i + 1);
  }
}

onMounted(() => focus(model.value.length));

// Страница очистила код (например, сервер ответил «Неверный код») —
// курсор в первую ячейку, чтобы сразу набрать заново.
watch(model, (value) => {
  if (!value) focus(0);
});
</script>

<style scoped lang="scss">
.code {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 26px;
}

.cell {
  width: 100%;
  aspect-ratio: 40 / 49;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  background: transparent;
  color: $white;
  font-size: 22px;
  text-align: center;
  caret-color: $white;
  outline: none;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &.filled {
    border-color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    border-color: $white;
    background: rgba(255, 255, 255, 0.04);
  }
}
</style>
