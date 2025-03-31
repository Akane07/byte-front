<template>
    <div class="nav">
        <div class="byte">
            <img src="../../public/logo.svg" alt="logo">
            <span>FreelanceByte</span>
        </div>
        <div class="nav-buttons">
            <NuxtLink to="/auth/login">
                <DevButton :active="false">
                    Войти
                </DevButton>
            </NuxtLink>
            <NuxtLink to="/auth/registration">
                <DevNavButton>Регистрация</DevNavButton>
            </NuxtLink>
        </div>
    </div>
</template>


<script setup>
import DevNavButton from './DevNavButton.vue';
import DevButton from './DevButton.vue';
</script>

<style lang="scss" scoped>
// @import '../assets/styles/vars.scss';
.nav {
    width: 80%;
    right: 10%;
    left: 10%;
    height: 44px;
    position: fixed;
    top: 27px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
}

.link {
    text-decoration: none;
    color: #9E9E9E;
    cursor: pointer;
}

.link-second {
    text-decoration: none;
    color: #fff;
    cursor: pointer;
}

.byte {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
}

span {
    color: #fff;
    font-weight: 700;
    font-size: 32px;
    text-align: center;
}

.nav-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>