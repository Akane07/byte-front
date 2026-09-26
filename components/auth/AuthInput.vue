<template>
  <div class="input-wrapper">
    <input
      v-model="model"
      :type="isPassword && !visible ? 'password' : isPassword ? 'text' : type"
      class="auth-input"
      :class="{ 'with-toggle': isPassword }"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
    />
    <!-- Показать / скрыть пароль. Перечёркнутый глаз — пароль скрыт, как на макете. -->
    <button
      v-if="isPassword"
      type="button"
      class="toggle"
      :aria-label="visible ? 'Скрыть пароль' : 'Показать пароль'"
      @click="visible = !visible"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15.58 12a3.58 3.58 0 1 1-7.16 0 3.58 3.58 0 0 1 7.16 0Z" />
          <path d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19C18.82 5.8 15.53 3.72 12 3.72S5.18 5.8 2.89 9.4c-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z" />
          <path v-if="!visible" d="M3 21 21 3" />
        </g>
      </svg>
    </button>
    <span class="bordered border-left"></span>
    <span class="bordered border-top"></span>
    <span class="bordered border-bottom"></span>
    <span class="bordered border-right"></span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string;
  placeholder: string;
  autocomplete?: string;
}>();

const model = defineModel<string>({ required: true });

const isPassword = computed(() => props.type === "password");
const visible = shallowRef(false);
</script>

<style lang="scss" scoped>
$border-thickness: 1px;
$bg: #2e2e2e;

@mixin autofill-fill($bg) {
  -webkit-box-shadow: 0 0 0 1000px $bg inset;
  box-shadow: 0 0 0 1000px $bg inset;
  -webkit-text-fill-color: $white;
  caret-color: $white;
}
$animation-duration: 0.2s;

.input-wrapper {
  position: relative;
  display: block;
  width: 100%;
  // Рамка рисуется внутри этого отступа. Раньше полоски стояли за пределами
  // обёртки (-1px), и родитель с overflow: hidden их срезал.
  padding: $border-thickness;

  .auth-input {
    position: relative;
    cursor: text;
    width: 100%;
    height: 45px;
    z-index: 1;
    padding: 0 12px;
    font-size: 14px;
    border-radius: 6px;
    display: block;
    background: $bg;
    border: none;
    outline: none;
    color: $white;

    &::placeholder {
      color: #929292;
    }

    &.with-toggle {
      padding-right: 48px;
    }

    // Автозаполнение браузера: вместо светло-голубого фона — цвет поля.
    // Два отдельных правила: браузер, не знающий один из селекторов,
    // выбросил бы общий список целиком.
    &:-webkit-autofill {
      @include autofill-fill($bg);
    }

    &:autofill {
      @include autofill-fill($bg);
    }
  }
}

.toggle {
  position: absolute;
  z-index: 2;
  top: 50%;
  right: 14px;
  width: 24px;
  height: 24px;
  padding: 0;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8a8a8a;
  cursor: pointer;
  transition: color 0.15s ease;

  svg {
    width: 100%;
    height: 100%;
  }

  &:hover,
  &:focus-visible {
    color: $white;
  }
}

.bordered {
  position: absolute;
  z-index: 1;
  background-color: $white;
  pointer-events: none;
  border-radius: 6px;
}

.border-left {
  left: 0;
  top: 0;
  bottom: 0;
  width: $border-thickness;

  transform: scaleY(0);
  transform-origin: center;
  transition: transform $animation-duration ease;
}

.input-wrapper:focus-within .border-left {
  transform: scaleY(1);
  transition-delay: 0s;
}

.input-wrapper:not(:focus-within) .border-left {
  transform: scaleY(0);
  transition-delay: calc(2 * $animation-duration);
}

.border-top {
  top: 0;
  left: 0;
  height: $border-thickness;
  width: 0;
  transition: width $animation-duration ease;
}

.input-wrapper:focus-within .border-top {
  width: 100%;
  transition-delay: $animation-duration;
}

.input-wrapper:not(:focus-within) .border-top {
  width: 0;
  transition-delay: $animation-duration;
}

.border-bottom {
  bottom: 0;
  left: 0;
  height: $border-thickness;
  width: 0;
  transition: width $animation-duration ease;
}

.input-wrapper:focus-within .border-bottom {
  width: 100%;
  transition-delay: $animation-duration;
}

.input-wrapper:not(:focus-within) .border-bottom {
  width: 0;
  transition-delay: $animation-duration;
}

.border-right {
  right: 0;
  top: 0;
  bottom: 0;
  width: $border-thickness;

  transform: scaleY(0);
  transform-origin: center;
  transition: transform $animation-duration ease;
}

.input-wrapper:focus-within .border-right {
  transform: scaleY(1);
  transition-delay: calc(2 * $animation-duration);
}

.input-wrapper:not(:focus-within) .border-right {
  transform: scaleY(0);
  transition-delay: 0s;
}
</style>
