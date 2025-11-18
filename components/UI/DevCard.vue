<template>
  <div class="card flex flex-col gap-10 w-full rounded-2xl p-10">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  color: $white;
  max-width: 1440px;
  margin-top: 40px;
  background: $bg-brand;
}
</style>
