<template>
  <div class="home w-full h-screen relative">
    <UIDevNavMenu></UIDevNavMenu>
    <div class="absolute w-full h-full flex justify-center px-15 top-0">
      <UIBackground></UIBackground>
      <div class="content flex flex-col items-center gap-7.5 text-center">
        <h1>Виртуальный мир реальных возможностей</h1>
        <p>Работай с проверенными заказчиками, получай честную оплату и развивай свои навыки каждый день.</p>
        <UIDevNavButton @click="$router.push('/orders')" style="z-index: 100">Перейти</UIDevNavButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped lang="scss">
.home {
  background-color: $black;

  .content {
    color: $white;
    margin-top: 260px;

    h1 {
      font-weight: 600;
      font-size: clamp(40px, 8vw, 64px);
      line-height: clamp(40px, 8vw, 80px);
      max-width: 1100px;
      width: 100%;
      z-index: 1;
    }

    p {
      font-size: 18px;
      line-height: 28px;
      color: $text-secondary;
      z-index: 3;
    }
  }
}
</style>
