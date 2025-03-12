<template>
    <div class="registration-wrapper">
      <div class="registration-menu">
        <div class="text-menu">
          <span class="menu-hero">Регистрация</span>
          <span class="menu-context typed-wrapper">
            <span class="typed-text">{{ typedText }}</span>
            <span v-if="showCursor" class="cursor">|</span>
          </span>
        </div>
        <div class="nav-menu">
            <DevAuthInput 
            :placeholder="'Полное Имя'"
            :input-type="'text'"
            />
            <DevAuthInput 
            :placeholder="'Ваша почта'"
            :input-type="'text'"
            />
            <DevAuthInput 
            :placeholder="'Пароль'"
            :input-type="'password'"
            />
            <DevAuthInput 
            :placeholder="'Подтвердите Пароль'"
            :input-type="'password'"
            />
            <DevNavButton>Зарегистрироваться</DevNavButton>
        </div>
        <div class="log-and-recovery">
            <div class="google">
                <div class="google-icon">
                    <img src="../../assets/icons/Google.svg" alt="">
                </div>
                <div class="text-google">
                    <span class="log">Войти с помощью</span>
                    <span class="google-text">Google</span>
                </div>
            </div>
        </div>
      </div>
      <DevAuthBoard :recovery="false"></DevAuthBoard>
    </div>
  </template>
  
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DevAuthInput from '~/components/dev/DevAuthInput.vue'
import DevNavButton from '~/components/dev/DevNavButton.vue'
import DevAuthBoard from '~/components/dev/DevAuthBoard.vue'
  
const typedText = ref('')
const textToType = 'Присоединяйтесь к нам'
const typingSpeed = 100
const showCursor = ref(true)
  
let typingInterval: number | undefined
let cursorInterval: number | undefined
  
onMounted(() => {
let index = 0
  
typingInterval = window.setInterval(() => {
    typedText.value += textToType[index]
    index++
    if (index >= textToType.length) {
    window.clearInterval(typingInterval)
    typingInterval = undefined
    }
}, typingSpeed)
  
cursorInterval = window.setInterval(() => {
    showCursor.value = !showCursor.value
}, 500)
})
  
onUnmounted(() => {
if (typingInterval) window.clearInterval(typingInterval)
if (cursorInterval) window.clearInterval(cursorInterval)
})
</script>
  
<style scoped lang="scss">
@import '../../assets/styles/vars.scss';
  
.registration-wrapper {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 131px;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}
  
.registration-menu {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 32px;
    min-width: 359px;
}
  
.text-menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
  
.menu-hero {
    font-weight: 600;
    font-size: 48px;
    color: #fff;
}
.nav-menu {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
} 
.menu-context {
    color: $text-color-nav;
    display: inline-block;
}
  
.typed-wrapper {
    display: inline-flex;
    align-items: baseline;
}
  
.typed-text {
    color: $text-color-nav;
    font-size: 18px;
}
  
.cursor {
    margin-left: 2px; 
    color: #fff;
    font-size: 18px;
}

.log-and-recovery{
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.google{
    background: $input-auth;
    display: flex;
    padding: 14.5px 13px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    border-radius: 5px;
}
.google:hover{
    opacity: 0.9;
}
.google-icon{
    border-right: 1px solid #3D3D49;
    padding-right: 9px;
    cursor: pointer;
}
.google-icon img {
    cursor: pointer;
}
.text-google{
    display: flex;
    flex-direction: column;
    gap: 1px;
    cursor: pointer;
}
.google-text{
    color: #fff;
    font-family: Poppins;
    font-weight: 400;
    font-size: 14px;
    line-height: 11px;
    letter-spacing: 0%;
    cursor: pointer;
}
.log{
    font-weight: 400;
    font-size: 10px;
    line-height: 20px;
    color: $text-color-nav;
    font-family: Poppins;
    cursor: pointer;
}

@media (max-width: 1250px) {
    .registration-menu{
        margin-left: 26px;
    }
    .registration-wrapper{
        gap: 50px;
    }
}
@media (max-width: 1100px) {
    .registration-wrapper{
        justify-content: center;
    }
}
</style>
  