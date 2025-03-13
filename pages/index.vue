<template>
    <div class="home">
        <DevNavMenu></DevNavMenu>
        <NuxtLink class="login" to="/auth/login"></NuxtLink>
    </div>
</template>

<script setup lang="ts">
import DevNavMenu from '~/components/UI/DevNavMenu.vue';
</script>

<style scoped lang="scss">
@import '../assets/styles/vars.scss';

.home {
    background-color: #000000;
    width: 100%;
    height: 100vh;
}

.login {
    text-decoration: none;
    color: $second-color;
    background-color: #000000;
    width: 100%;
    height: 100vh;
}
</style>
