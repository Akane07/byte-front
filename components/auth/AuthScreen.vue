<template>
  <div class="auth" :style="{ '--canvas-width': CANVAS_WIDTH[variant] }">
    <!-- Декорации по макету: лучи сверху, сетка с подсвеченными клетками,
         искры, два тёмных шара и цветное полотно в правом нижнем углу.
         Полотно — картинка, остальное рисуется стилями. -->
    <div class="scene" aria-hidden="true">
      <div class="grid"></div>
      <div class="rays"></div>
      <span v-for="(cell, i) in CELLS" :key="`c${i}`" class="glow-cell" :style="cell"></span>
      <span v-for="(s, i) in SPARKLES" :key="`s${i}`" class="sparkle" :class="{ accent: s.accent }"
        :style="{ left: s.x, top: s.y, '--size': `${s.size}px`, '--delay': `${s.delay}s` }"></span>
      <img class="ball ball--big" src="/images/auth/sphere-dark.webp" alt="" />
      <img class="ball ball--small" src="/images/auth/sphere-dark.webp" alt="" />
      <img :key="variant" class="canvas" :src="`/images/auth/canvas-${variant}.webp`" alt="" />
    </div>

    <header class="header">
      <NuxtLink to="/" class="logo">
        <svg viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15.375 14.8171H23.3779C25.1519 14.8171 26.5908 16.4138 26.5908 18.0301C26.5908 19.8042 25.1519 21.2431 23.3779 21.2431H15.375V14.8171Z" />
            <path d="M15.375 21.2234H24.5211C26.5514 21.2234 28.1875 22.6623 28.1875 24.4364C28.1875 26.2104 26.5514 27.6494 24.5211 27.6494H15.375V21.2234Z" />
            <path d="M18.4106 14.8171H12.8125" />
            <path d="M18.4106 27.6298H12.8125" />
            <path d="M20.5 38.0833C29.9349 38.0833 37.5833 30.4348 37.5833 21C37.5833 11.5651 29.9349 3.91663 20.5 3.91663C11.0651 3.91663 3.41667 11.5651 3.41667 21C3.41667 30.4348 11.0651 38.0833 20.5 38.0833Z" />
          </g>
        </svg>
        <span>FreelanceByte</span>
      </NuxtLink>
    </header>

    <main class="main">
      <!-- Шаги одной страницы (почта → код → пароль) сменяются с анимацией,
           а фон и полотно остаются на месте. -->
      <Transition name="step" mode="out-in">
        <form :key="step ?? title" class="form" novalidate @submit.prevent="emit('submit')">
          <h1 class="title">{{ title }}</h1>
          <p v-if="subtitle || $slots.subtitle" class="subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
          </p>
          <div class="fields">
            <slot />
          </div>
          <div v-if="$slots.footer" class="footer">
            <slot name="footer" />
          </div>
        </form>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
export type AuthVariant = "login" | "register" | "recovery";

defineProps<{
  /** Какое полотно показать справа. */
  variant: AuthVariant;
  title: string;
  subtitle?: string;
  /** Текущий шаг многошаговой формы — при его смене форма анимируется. */
  step?: string;
}>();

const emit = defineEmits<{ submit: [] }>();

// Ширина полотна в долях экрана. Картинки выгружены из макета шириной
// 1440 px один к одному, поэтому ширина = ширина картинки / 1440.
const CANVAS_WIDTH: Record<AuthVariant, string> = {
  register: "97.1vw", // 1398 px
  login: "82.3vw", // 1185 px
  recovery: "82.3vw", // 1185 px
};

// Подсвеченные клетки сетки. Сетка отсчитывается от центра экрана
// (см. .grid), поэтому и клетки заданы от центра — в шагах сетки.
const CELLS = [
  { "--col": 2, "--row": 2, "--delay": "0s" },
  { "--col": 4, "--row": 5, "--delay": "-4s" },
];

// Искры: координаты и размеры сняты с макета (экран 1440 px).
const SPARKLES = [
  { x: "47.4%", y: "12.7%", size: 24, delay: 0 },
  { x: "54.1%", y: "17.9%", size: 26, delay: 1.2 },
  { x: "60.9%", y: "7.3%", size: 22, delay: 2.1 },
  { x: "37.5%", y: "23.5%", size: 20, delay: 0.6 },
  { x: "60.8%", y: "23.5%", size: 14, delay: 2.8 },
  { x: "44.5%", y: "36%", size: 14, delay: 1.7 },
  { x: "64.2%", y: "39.5%", size: 16, delay: 3.4 },
  { x: "79.8%", y: "18.2%", size: 22, delay: 0.9, accent: true },
];
</script>

<style scoped lang="scss">
$grid-step: 48px;
$ease-out: cubic-bezier(0.22, 1, 0.36, 1);

.auth {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  // Сверху фон чуть светлее, книзу уходит в тёмно-синий — цвета сняты с макета.
  background:
    radial-gradient(ellipse 60% 50% at 10% 55%, rgba(34, 38, 48, 0.8) 0%, rgba(34, 38, 48, 0) 70%),
    linear-gradient(180deg, #171b25 0%, #1a1e28 40%, #0c111d 100%);
}

.scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// Сетка видна только в середине верхней части — по краям растворяется.
.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: $grid-step $grid-step;
  background-position: 50% 16px;
  -webkit-mask-image: radial-gradient(ellipse 45% 50% at 55% 25%, #000 0%, transparent 100%);
  mask-image: radial-gradient(ellipse 45% 50% at 55% 25%, #000 0%, transparent 100%);
}

// Столбы света, падающие сверху, медленно «дышат».
.rays {
  position: absolute;
  inset: 0 0 35% 0;
  background:
    radial-gradient(ellipse 9% 75% at 25% 0%, rgba(255, 255, 255, 0.07) 0%, transparent 100%),
    radial-gradient(ellipse 5% 90% at 57% 0%, rgba(255, 255, 255, 0.11) 0%, transparent 100%),
    radial-gradient(ellipse 4% 70% at 69% 0%, rgba(255, 255, 255, 0.09) 0%, transparent 100%),
    radial-gradient(ellipse 5% 60% at 88% 0%, rgba(255, 255, 255, 0.07) 0%, transparent 100%);
  animation:
    fade-in 1.6s ease both,
    breathe 9s 1.6s ease-in-out infinite;
}

// Клетка — ровно в ячейке сетки: сетка начинается от центра экрана
// и сдвинута на 16px вниз.
.glow-cell {
  position: absolute;
  left: calc(50% + var(--col) * #{$grid-step} + 1px);
  top: calc(16px + var(--row) * #{$grid-step} + 1px);
  width: $grid-step - 1px;
  height: $grid-step - 1px;
  background: rgba(118, 104, 214, 0.1);
  animation: cell-pulse 9s var(--delay) ease-in-out infinite;
}

// Искра — две тонкие перекрещенные линии, гаснущие к концам.
.sparkle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  color: rgba(255, 255, 255, 0.85);
  transform: translate(-50%, -50%);
  animation: twinkle 5s var(--delay) ease-in-out infinite;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: linear-gradient(90deg, transparent, currentColor 50%, transparent);
  }

  &::before {
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
  }

  &::after {
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: linear-gradient(180deg, transparent, currentColor 50%, transparent);
  }

  &.accent {
    color: #8b6bff;
  }
}

.ball {
  position: absolute;
  max-width: none;
  transform: translate(-50%, -50%);
  will-change: transform;

  &--big {
    left: 76.5%;
    top: 44%;
    width: 15vw;
    animation:
      fade-in 1.2s 0.2s ease both,
      float-a 11s ease-in-out infinite;
  }

  &--small {
    left: 57%;
    top: 64.5%;
    width: 11.8vw;
    animation:
      fade-in 1.2s 0.4s ease both,
      float-b 13s ease-in-out infinite;
  }
}

.canvas {
  position: absolute;
  right: 0;
  bottom: 0;
  width: var(--canvas-width);
  max-width: none;
  height: auto;
  animation: canvas-in 1.2s $ease-out both;
}

.header {
  position: relative;
  z-index: 2;
  padding: 32px 86px 0;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: $white;

  // Круг занимает 34 из 41 единицы viewBox — при 44px он ~36px, как на макете.
  svg {
    width: 44px;
    height: 44px;
    margin: -4px;
    color: #8355fa;
  }

  // Как на главной: Mont, запасной — Montserrat.
  span {
    font-family: "Mont", "Montserrat", Inter, sans-serif;
    font-weight: 400;
    font-size: 30px;
    line-height: 1;
  }
}

.main {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 48px 32px 96px clamp(48px, 10vw, 160px);
}

.form {
  width: 445px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: 600;
  font-size: 48px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: $white;
}

.subtitle {
  margin-top: 16px;
  font-size: 16px;
  line-height: 28px;
  color: rgba(255, 255, 255, 0.55);
}

.fields {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

// Общие для всех страниц подписи под формой: «Нет аккаунта? Зарегистрироваться».
:slotted(.auth-note) {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);

  a,
  button {
    color: $white;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    &:disabled {
      color: rgba(255, 255, 255, 0.55);
      cursor: default;
      text-decoration: none;
    }
  }
}

// Смена шага: старая форма уходит вверх, новая поднимается снизу.
.step-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s $ease-out;
}

.step-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.step-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes canvas-in {
  from {
    opacity: 0;
    transform: translate(40px, 40px);
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(0.7);
  }
}

@keyframes cell-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@keyframes float-a {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-50%, calc(-50% - 14px));
  }
}

@keyframes float-b {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(calc(-50% + 8px), calc(-50% + 12px));
  }
}

@include laptop {
  .header {
    padding-left: 48px;
    padding-right: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rays,
  .glow-cell,
  .sparkle,
  .ball,
  .canvas {
    animation: none;
  }

  .glow-cell {
    opacity: 1;
  }
}
</style>
