<template>
  <!-- Фон внутренних страниц: мягкие цветные свечения, полупрозрачные шары,
       едва заметная сетка и несколько искр — в духе главной и страниц входа,
       но тише: поверх идут карточки с контентом. Слой за контентом
       (z-index: -1) и не перехватывает нажатия. -->
  <div class="bg" aria-hidden="true">
    <div class="glow glow--violet"></div>
    <div class="glow glow--pink"></div>
    <div class="grid"></div>
    <img class="ball ball--a" src="/images/auth/sphere-dark.webp" alt="" />
    <img class="ball ball--b" src="/images/auth/sphere-dark.webp" alt="" />
    <img class="ball ball--c" src="/images/auth/sphere-dark.webp" alt="" />
    <span
      v-for="(s, i) in SPARKLES"
      :key="i"
      class="sparkle"
      :class="{ accent: s.accent, 'hide-mobile': s.hideMobile }"
      :style="{ left: s.x, top: s.y, '--size': `${s.size}px`, '--delay': `${s.delay}s` }"
    ></span>
  </div>
</template>

<script setup lang="ts">
// Искры — у правого края и в полосе под шапкой: слева на многих страницах
// колонка фильтров или меню, и искра поверх текста выглядит как артефакт.
const SPARKLES = [
  { x: "97.5%", y: "22%", size: 18, delay: 0 },
  { x: "93%", y: "12%", size: 22, delay: 1.4, accent: true },
  { x: "98%", y: "62%", size: 14, delay: 2.6, hideMobile: true },
  { x: "96%", y: "86%", size: 16, delay: 3.3, hideMobile: true },
  { x: "58%", y: "10.5%", size: 12, delay: 0.8, hideMobile: true },
];
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // За контентом: страницам не нужно поднимать свои блоки z-index'ом.
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: radial-gradient(81.79% 49.97% at 50% 50.03%, #2e2b2b 0%, #212121 100%);
}

// Свечения — радиальные градиенты без filter: blur, так дешевле для браузера.
.glow {
  position: absolute;
  border-radius: 50%;
  will-change: transform;

  &--violet {
    top: -30vh;
    left: -20vw;
    width: 80vw;
    height: 80vh;
    background: radial-gradient(closest-side, rgba(131, 85, 250, 0.22), rgba(131, 85, 250, 0));
    animation: drift-a 26s ease-in-out infinite;
  }

  &--pink {
    right: -25vw;
    bottom: -35vh;
    width: 85vw;
    height: 85vh;
    background: radial-gradient(closest-side, rgba(236, 110, 173, 0.13), rgba(236, 110, 173, 0));
    animation: drift-b 32s ease-in-out infinite;
  }
}

// Сетка — только сверху по центру, к краям растворяется.
.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  background-position: 50% 0;
  -webkit-mask-image: radial-gradient(ellipse 55% 60% at 50% 0%, #000 0%, transparent 100%);
  mask-image: radial-gradient(ellipse 55% 60% at 50% 0%, #000 0%, transparent 100%);
}

// Шары частично уходят за края экрана, чтобы не спорить с контентом.
.ball {
  position: absolute;
  max-width: none;
  height: auto;
  opacity: 0.9;
  will-change: transform;
  // Тёмный шар на тёмно-сером фоне почти не виден — ореол отделяет его от фона.
  filter: drop-shadow(0 0 36px rgba(131, 85, 250, 0.28));

  &--a {
    top: 12vh;
    right: -5vw;
    width: clamp(160px, 17vw, 300px);
    animation: float-a 14s ease-in-out infinite;
  }

  // Нижний левый — в самом углу: выше он попадал за колонку фильтров ленты.
  &--b {
    bottom: -7vh;
    left: -5vw;
    width: clamp(140px, 14vw, 250px);
    opacity: 0.8;
    filter: drop-shadow(0 0 36px rgba(236, 110, 173, 0.2));
    animation: float-b 17s ease-in-out infinite;
  }

  &--c {
    top: 52vh;
    right: 12vw;
    width: clamp(60px, 5vw, 96px);
    opacity: 0.75;
    animation: float-a 11s -4s ease-in-out infinite;
  }
}

// Искра — две тонкие перекрещенные линии, как на страницах входа.
.sparkle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  color: rgba(255, 255, 255, 0.45);
  animation: twinkle 6s var(--delay) ease-in-out infinite;

  &::before,
  &::after {
    content: "";
    position: absolute;
  }

  &::before {
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent, currentColor 50%, transparent);
  }

  &::after {
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: linear-gradient(180deg, transparent, currentColor 50%, transparent);
  }

  &.accent {
    color: rgba(139, 107, 255, 0.7);
  }
}

@keyframes drift-a {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(6vw, 4vh);
  }
}

@keyframes drift-b {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-5vw, -5vh);
  }
}

@keyframes float-a {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

@keyframes float-b {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, 14px);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.25;
  }
}

// Телефон: меньше декора — один крупный шар и пара искр.
@include mobile {
  .ball--a {
    top: 8vh;
    right: -18vw;
    width: 150px;
  }

  .ball--b {
    left: -14vw;
    width: 120px;
  }

  .ball--c,
  .hide-mobile {
    display: none;
  }

  .grid {
    background-size: 48px 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .ball,
  .sparkle {
    animation: none;
  }
}
</style>
