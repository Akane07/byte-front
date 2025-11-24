<template>
  <div class="bg w-full h-full fixed top-0 left-0">
    <!-- <div class="flex flex-row justify-evenly w-full h-full fixed top-0 left-0">
      <div v-for="i in 16" :key="i" class="line h-full"></div>
    </div> -->
    <!-- <div class="circles">
      <div class="absolute circle"></div>
      <IconsCircle class="absolute circle"></IconsCircle>
      <IconsCircle class="absolute circle"></IconsCircle>
      <IconsCircle class="absolute circle"></IconsCircle>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.bg {
  background: radial-gradient(
    81.79% 49.97% at 50% 50.03%,
    #2e2b2b 0%,
    #212121 100%
  );
}

.line {
  width: 1px;
  background: linear-gradient(180deg, #404047 0%, rgba(64, 64, 71, 0) 65.45%);
}

.circles {
  .circle:nth-child(1) {
    background: radial-gradient(
      50% 50% at 50% 50%,
      $bg-brand 0%,
      rgba(34, 34, 40, 0) 100%
    );
    border-radius: 50%;
    width: 500px;
    height: 500px;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
  }

  .circle:nth-child(2) {
    top: 60px;
    left: 45%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .circle:nth-child(3) {
    width: 150px;
    height: 150px;
    top: 400px;
    right: 15%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .circle:nth-child(4) {
    width: 200px;
    height: 200px;
    top: 400px;
    left: 15%;
    transform: translateX(-50%);
    z-index: 2;
  }
}
</style>
