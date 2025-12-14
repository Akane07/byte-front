<template>
  <div class="home w-full h-screen relative">
    <UINavMenu></UINavMenu>
    <div class="absolute w-full h-full flex justify-center px-15 top-0">
      <UIBackground></UIBackground>
      <div class="content flex flex-col items-center gap-7.5 text-center mt-[260px]">
        <h1 class="z-1 w-full max-w-[1100px]">Виртуальный мир реальных возможностей</h1>
        <p class="z-3">Работай с проверенными заказчиками, получай честную оплату и развивай свои навыки каждый день.</p>
        <UINavButton @click="$router.push('/orders')" style="z-index: 100">Перейти</UINavButton>
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

    h1 {
      font-weight: 600;
      font-size: clamp(40px, 8vw, 64px);
      line-height: clamp(40px, 8vw, 80px);
    }

    p {
      font-size: 18px;
      line-height: 28px;
      color: $text-secondary;
    }
  }
}
</style>
