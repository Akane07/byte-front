<template>
  <div class="composer">
    <!-- Ответ или правка — полоса над полем, Esc отменяет. -->
    <div v-if="editing || replyTo" class="context">
      <svg v-if="editing" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5l3 3L7 16H4v-3l8.5-8.5z" /></svg>
      <svg v-else viewBox="0 0 20 20" aria-hidden="true"><path d="M8 5L3 10l5 5M3.5 10H12a5 5 0 015 5v1" /></svg>
      <div class="context-text">
        <b>{{ editing ? "Редактирование" : replyTo?.senderId === partnerId ? partnerName : "Вы" }}</b>
        <span>{{ contextPreview }}</span>
      </div>
      <button type="button" aria-label="Отменить" @click="$emit('cancel')">×</button>
    </div>

    <div v-if="file" class="file-chip">
      <img v-if="preview" :src="preview" alt="" />
      <span v-else class="file-icon">{{ fileExt }}</span>
      <div class="file-info">
        <b>{{ file.name }}</b>
        <span>{{ formatFileSize(file.size) }}</span>
      </div>
      <button type="button" aria-label="Убрать файл" @click="setFile(null)">×</button>
    </div>

    <form class="row" @submit.prevent="submit">
      <label v-if="!editing" class="attach" :class="{ active: file }" title="Прикрепить файл">
        <IconsPaperclip />
        <input type="file" :accept="ACCEPT" @change="pickFile" />
      </label>
      <textarea
        ref="fieldRef"
        v-model="text"
        class="field"
        rows="1"
        :maxlength="MAX_LENGTH"
        :placeholder="editing ? 'Новый текст сообщения' : 'Сообщение'"
        @keydown="onKeydown"
        @paste="onPaste"
        @input="onInput"
      ></textarea>
      <button type="submit" class="send" :disabled="!canSend" :aria-label="editing ? 'Сохранить' : 'Отправить'">
        <svg v-if="editing" viewBox="0 0 20 20" class="check"><path d="M4 10.5l4 4 8-9" /></svg>
        <IconsSend v-else />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "~/shared/types";
import { formatFileSize } from "~/shared/utils/helpers";
import { useChatStore } from "~/store/chatStore";
import { useNotifications } from "~/store/notiStore";

const MAX_LENGTH = 4000;
const MAX_FILE_MB = 50;
/** Не чаще раза в TYPING_THROTTLE_MS сообщаем собеседнику «печатает…». */
const TYPING_THROTTLE_MS = 2500;
/** То же, что принимает бэкенд (common/uploads.ts). */
const ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.rar",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  // Браузер не всегда знает MIME архивов — разрешаем выбрать их по расширению.
  ".zip",
  ".rar",
  ".7z",
].join(",");
const ACCEPT_TYPES = new Set(ACCEPT.split(",").filter((t) => !t.startsWith(".")));

const props = defineProps<{
  partnerId: string;
  partnerName: string;
  replyTo: Message | null;
  editing: Message | null;
}>();

const emit = defineEmits<{
  (e: "send", payload: { text: string; file: File | null }): void;
  (e: "saveEdit", text: string): void;
  (e: "cancel"): void;
  (e: "typing"): void;
}>();

const chatStore = useChatStore();
const notifications = useNotifications();

const fieldRef = ref<HTMLTextAreaElement | null>(null);
const file = shallowRef<File | null>(null);
const preview = shallowRef("");

// Черновик хранится в сторе по собеседнику: ушёл в другой диалог и вернулся —
// недописанное сообщение на месте.
const text = computed({
  get: () => chatStore.drafts[props.partnerId] ?? "",
  set: (value: string) => {
    chatStore.drafts[props.partnerId] = value;
  },
});

const canSend = computed(() =>
  props.editing ? !!text.value.trim() || props.editing.mediaType !== "none" : !!text.value.trim() || !!file.value,
);

const contextPreview = computed(() => {
  const msg = props.editing ?? props.replyTo;
  if (!msg) return "";
  return msg.text || msg.fileName || (msg.mediaType === "video" ? "Видео" : "Изображение");
});

const fileExt = computed(() => file.value?.name.split(".").pop()?.slice(0, 4).toUpperCase() ?? "FILE");

// --- Файл ---

function isAllowed(f: File) {
  if (ACCEPT_TYPES.has(f.type)) return true;
  return /\.(zip|rar|7z)$/i.test(f.name);
}

/** Выбрать файл: из кнопки, вставки из буфера или перетаскиванием на диалог. */
function setFile(next: File | null) {
  if (next && !isAllowed(next)) {
    notifications.setNotification("Такой тип файла нельзя отправить. Подойдут картинки, видео, PDF, документы и архивы");
    return;
  }
  if (next && next.size > MAX_FILE_MB * 1024 * 1024) {
    notifications.setNotification(`Файл больше ${MAX_FILE_MB} МБ`);
    return;
  }
  if (preview.value) URL.revokeObjectURL(preview.value);
  file.value = next;
  preview.value = next?.type.startsWith("image/") ? URL.createObjectURL(next) : "";
  if (next) focus();
}

function pickFile(event: Event) {
  const input = event.target as HTMLInputElement;
  setFile(input.files?.[0] ?? null);
  input.value = "";
}

function onPaste(event: ClipboardEvent) {
  const pasted = [...(event.clipboardData?.files ?? [])][0];
  if (pasted && !props.editing) {
    event.preventDefault();
    setFile(pasted);
  }
}

// --- Текст ---

/** Поле растёт вместе с текстом до шести строк, дальше — прокрутка. */
function resize() {
  const el = fieldRef.value;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
}

let lastTyping = 0;
function onInput() {
  if (props.editing) return;
  const now = Date.now();
  if (now - lastTyping > TYPING_THROTTLE_MS) {
    lastTyping = now;
    emit("typing");
  }
}

/**
 * Enter — отправить, Shift+Enter — новая строка. На телефоне Enter всегда
 * переносит строку: отправляют там кнопкой, а случайно отправить
 * недописанное легко. isComposing — ввод через IME (японский, китайский).
 */
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && (props.editing || props.replyTo)) {
    event.preventDefault();
    emit("cancel");
    return;
  }
  const touch = window.matchMedia("(hover: none)").matches;
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing && !touch) {
    event.preventDefault();
    submit();
  }
}

function submit() {
  if (!canSend.value) return;
  const value = text.value.trim();
  if (props.editing) {
    emit("saveEdit", value);
  } else {
    emit("send", { text: value, file: file.value });
    setFile(null);
  }
  text.value = "";
  lastTyping = 0;
  nextTick(resize);
}

function focus() {
  nextTick(() => fieldRef.value?.focus());
}

watch(text, () => nextTick(resize));
watch(
  () => props.editing,
  (msg) => {
    if (msg) text.value = msg.text;
    focus();
  },
);
watch(() => props.replyTo, focus);
watch(
  () => props.partnerId,
  () => {
    setFile(null);
    nextTick(resize);
  },
);

onMounted(resize);
onBeforeUnmount(() => {
  if (preview.value) URL.revokeObjectURL(preview.value);
});

defineExpose({ setFile, focus });
</script>

<style lang="scss" scoped>
.composer {
  padding: 12px 24px 16px;
  border-top: 1px solid $chat-border;

  @include mobile {
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  }
}

.row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.attach {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #8a8a94;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  :deep(svg) {
    width: 22px;
    height: 22px;
  }

  // У иконки скрепки цвет зашит в SVG — перекрашиваем в цвет кнопки.
  :deep(path) {
    fill: currentColor;
  }

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  &.active {
    color: $primary;
  }

  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: $white;
    }
  }
}

.field {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  max-height: 150px;
  padding: 11px 18px;
  border: 1px solid transparent;
  border-radius: 22px;
  background: $tag-secondary-color;
  color: $text-main;
  // 16px — меньше Safari на iPhone увеличивает страницу при фокусе.
  font-size: 16px;
  font-family: inherit;
  line-height: 1.35;
  resize: none;
  outline: none;
  overflow-y: auto;
  transition: border-color 0.15s ease;
  @include hidden-scrollbar;

  &::placeholder {
    color: #8a8a94;
  }

  &:focus {
    border-color: rgba(131, 85, 250, 0.5);
  }

  @media (hover: hover) {
    font-size: 15px;
  }
}

.send {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: $primary;
  cursor: pointer;
  transition:
    background 0.15s ease,
    opacity 0.15s ease,
    transform 0.1s ease;

  // Самолётик фиолетовый — на фиолетовой кнопке делаем его белым.
  :deep(svg) {
    width: 20px;
    height: 20px;
  }

  :deep(path) {
    fill: $white;
  }

  .check path {
    fill: none;
    stroke: $white;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: $primary-hover;
    }
  }
}

// Полоса «Ответ…» / «Редактирование» над полем.
.context {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px 54px;
  padding: 6px 8px 6px 12px;
  border-left: 3px solid $primary;
  border-radius: 6px;
  background: rgba(131, 85, 250, 0.08);

  @include mobile {
    margin-left: 0;
  }

  > svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    fill: none;
    stroke: #c3adff;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.context-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
  font-size: 13px;

  b {
    color: #c3adff;
    font-weight: 600;
  }

  span {
    color: rgba(255, 255, 255, 0.6);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// Выбранный файл — плашка над полем, с крестиком.
.file-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  max-width: calc(100% - 54px);
  margin: 0 0 10px 54px;
  padding: 6px 8px 6px 6px;
  border-radius: 12px;
  background: rgba(131, 85, 250, 0.14);
  color: #c3adff;
  font-size: 13px;

  @include mobile {
    max-width: 100%;
    margin-left: 0;
  }

  img,
  .file-icon {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 8px;
  }

  img {
    object-fit: cover;
  }

  .file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(131, 85, 250, 0.35);
    color: $white;
    font-size: 10px;
    font-weight: 700;
  }
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  b {
    color: $text-main;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
  }
}

.context button,
.file-chip button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: $white;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}
</style>
