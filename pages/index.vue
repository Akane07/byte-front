<template>
  <div class="landing">
    <UINavMenu landing />

    <section class="hero">
      <div class="hero__content">
        <IconsSparkle class="sparkle reveal" />
        <h1 class="reveal">Виртуальный мир реальных возможностей</h1>
        <p class="reveal">Работай с проверенными заказчиками, получай честную оплату и развивай свои навыки каждый день.</p>
        <UINavButton texture class="cta reveal" @click="start">Начать сейчас</UINavButton>
      </div>

      <div class="hero__visual" aria-hidden="true">
        <!-- Пастельный фон колонки: та же сфера, сильно размытая, и цветовые пятна
             с макета. Отражение — «пол» под сферой. На телефоне вместо колонки —
             ореол вокруг сферы на тёмном фоне. -->
        <div class="backdrop">
          <div class="glow"></div>
          <img class="reflection" src="/images/landing/sphere.webp" alt="" />
        </div>
        <!-- Три обёртки, потому что у каждой свой transform: позиция,
             появление и медленное покачивание. -->
        <div class="sphere-pos">
          <div class="sphere-in">
            <img class="sphere" src="/images/landing/sphere.webp" alt="" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/** В ленту заказов — и гостю тоже: смотреть заказы можно без входа. */
function start() {
  navigateTo("/orders");
}
</script>

<style scoped lang="scss">
$header-height: 80px;
$grid-step: 112px;
$grid-line: rgba(255, 255, 255, 0.03);
$ease-out: cubic-bezier(0.22, 1, 0.36, 1);

.landing {
  min-height: 100vh;
  min-height: 100dvh;
  background: #141517;
}

.hero {
  position: relative;
  min-height: calc(100vh - #{$header-height});
  min-height: calc(100dvh - #{$header-height});
  overflow: hidden;
  // Сетка и мягкий свет из левого верхнего угла — как на макете.
  background-color: #141517;
  background-image:
    linear-gradient($grid-line 1px, transparent 1px),
    linear-gradient(90deg, $grid-line 1px, transparent 1px),
    radial-gradient(ellipse 70% 80% at 0% 0%, #1f2122 0%, rgba(31, 33, 34, 0) 70%);
  background-size:
    $grid-step $grid-step,
    $grid-step $grid-step,
    100% 100%;

  // Свечение сверху: будто свет падает из-под шапки на заголовок.
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 58%;
    height: 420px;
    z-index: 1;
    pointer-events: none;
    background:
      radial-gradient(ellipse 60% 55% at 30% 0%, rgba(157, 112, 255, 0.2) 0%, rgba(157, 112, 255, 0) 70%),
      radial-gradient(ellipse 35% 35% at 18% 0%, rgba(237, 191, 225, 0.14) 0%, rgba(237, 191, 225, 0) 70%);
    animation: fade-in 1.6s ease both;
  }
}

.hero__content {
  position: relative;
  z-index: 2;
  width: 58%;
  padding: 21px 48px 80px 96px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .sparkle {
    margin-left: 2px;
  }

  h1 {
    max-width: 520px;
    margin-top: 35px;
    font-weight: 300;
    font-size: 55px;
    line-height: 72px;
    letter-spacing: -0.02em;
    // Текст светлеет сверху вниз: от белого к #d6d9d8.
    color: $white;
    background: linear-gradient(180deg, #ffffff 0%, #d6d9d8 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    max-width: 560px;
    margin-top: 28px;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    color: #d6d6d6;
  }

  .cta {
    width: 381px;
    max-width: 100%;
    height: 56px;
    margin-top: 68px;
    font-size: 18px;
    --texture-position: 28% 64%;
    --texture-position-hover: 38% 58%;
  }

  // Появление снизу по очереди: звёздочка, заголовок, текст, кнопка.
  // Задержка — через переменную: сокращённое animation в .reveal
  // перебило бы animation-delay у h1 и p по специфичности.
  .reveal {
    animation: reveal-up 0.9s $ease-out var(--delay, 0s) both;
  }

  .sparkle {
    --delay: 0.05s;
  }

  h1 {
    --delay: 0.15s;
  }

  p {
    --delay: 0.3s;
  }

  .cta {
    --delay: 0.45s;
  }
}

.hero__visual {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 41.8%;

  .backdrop {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: #d2bfe6;
    animation: fade-in 1.2s ease both;
  }

  .glow {
    position: absolute;
    inset: -80px;
    background:
      radial-gradient(circle at 90% 6%, #fbe3fb 0%, rgba(251, 227, 251, 0) 38%),
      radial-gradient(circle at 70% 20%, #f6c3f5 0%, rgba(246, 195, 245, 0) 45%),
      radial-gradient(circle at 12% 96%, #3e6d7c 0%, rgba(62, 109, 124, 0) 40%),
      radial-gradient(circle at 5% 5%, #50587e 0%, rgba(80, 88, 126, 0) 35%),
      url("/images/landing/sphere.webp") 50% 45% / 160% auto no-repeat;
    filter: blur(48px) saturate(1.15) brightness(1.3);
  }

  // Отражение сферы на «полу»: перевёрнутая копия, гаснущая книзу.
  .reflection {
    position: absolute;
    left: 50%;
    bottom: -58%;
    width: 110%;
    max-width: none;
    transform: translateX(-56%) scaleY(-1);
    opacity: 0.35;
    filter: blur(6px);
    -webkit-mask-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 45%);
    mask-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 45%);
  }

  // Сфера выходит за левый край колонки на тёмную часть — как на макете.
  .sphere-pos {
    position: absolute;
    top: 50%;
    right: 6%;
    width: min(107%, calc((100vh - #{$header-height}) * 0.9), 1000px);
    width: min(107%, calc((100dvh - #{$header-height}) * 0.9), 1000px);
    transform: translateY(-52%);
  }

  .sphere-in {
    animation: sphere-in 1.4s 0.2s $ease-out both;
  }

  .sphere {
    display: block;
    width: 100%;
    max-width: none;
    height: auto;
    filter: drop-shadow(0 30px 60px rgba(40, 20, 80, 0.35));
    // После появления сфера медленно покачивается.
    animation: float 8s 1.6s ease-in-out infinite;
    will-change: transform;
  }
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes sphere-in {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

// Ноутбук: поля и заголовок поменьше.
@include laptop {
  .hero__content {
    padding-left: 48px;

    h1 {
      font-size: 48px;
      line-height: 62px;
    }
  }

  .hero__visual {
    width: 42%;
  }
}

// Планшет и телефон: текст сверху, сфера под ним. Вместо пастельной колонки —
// ореол вокруг сферы прямо на тёмном фоне, а блок со сферой занимает весь
// оставшийся экран, чтобы внизу не оставалось пустого чёрного места.
@include tablet {
  .hero {
    display: flex;
    flex-direction: column;

    &::before {
      width: 100%;
      height: 320px;
    }
  }

  .hero__content {
    width: 100%;
    padding: 21px 48px 24px;

    h1 {
      max-width: 600px;
    }
  }

  .hero__visual {
    position: relative;
    width: 100%;
    flex: 1 0 auto;
    min-height: min(100vw, 520px);

    .backdrop {
      background: transparent;
    }

    .glow {
      inset: auto;
      top: 50%;
      left: 50%;
      width: min(130vw, 680px);
      height: min(130vw, 680px);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(176, 132, 255, 0.5) 0%,
        rgba(246, 195, 245, 0.22) 38%,
        rgba(20, 21, 23, 0) 68%
      );
      filter: blur(24px);
    }

    .reflection {
      width: min(72vw, 440px);
      bottom: auto;
      top: calc(50% + min(36vw, 220px) - 4px);
      transform: translateX(-50%) scaleY(-1);
      opacity: 0.22;
      -webkit-mask-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 30%);
      mask-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 30%);
    }

    .sphere-pos {
      right: auto;
      left: 50%;
      width: min(72vw, 440px);
      transform: translate(-50%, -50%);
    }
  }
}

@include mobile {
  .hero__content {
    padding: 16px 16px 16px;

    h1 {
      margin-top: 24px;
      font-size: 38px;
      line-height: 48px;
    }

    p {
      margin-top: 20px;
      font-size: 17px;
      line-height: 26px;
    }

    .cta {
      width: 100%;
      margin-top: 40px;
    }
  }
}

// Кто отключил анимацию в системе — видит страницу сразу, без движения.
@media (prefers-reduced-motion: reduce) {
  .hero::before,
  .hero__content .reveal,
  .hero__visual .backdrop,
  .hero__visual .sphere-in,
  .hero__visual .sphere {
    animation: none;
  }
}
</style>
