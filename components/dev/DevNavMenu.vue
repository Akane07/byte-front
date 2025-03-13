<template>
<div class="nav">
    <div class="byte">
        <img src="../../public/logo.svg" alt="">
        <span>FreelanceByte</span>
    </div>
    <div class="nav-buttons">
        <NuxtLink to="/auth/login">
            <DevButton :active="false">
                Войти
            </DevButton>
        </NuxtLink>
        <NuxtLink to="/auth/registration">
            <DevNavButton >Регистрация</DevNavButton>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&family=Rubik+Mono+One&display=swap');
.nav{
    width: 80%;
    right: 10%;
    left: 10%;
    height: 44px;
    position: fixed;
    top: 27px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.link{
    text-decoration: none;
    color: #9E9E9E;
    cursor: pointer;
}
.link-second{
    text-decoration: none;
    color: #fff;
    cursor: pointer;
}
.byte{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
}
span{
    color: #fff;
    font-family: 'Montserrat';
    font-weight: 700;
    font-size: 32px;
    line-height: 34px;
    letter-spacing: 0%;
    text-align: center;
}
.nav-buttons{
    display: flex;
    align-items: center;
    gap: 10px;
}
</style>