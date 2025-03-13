<template>
    <div class="recovery-wrapper">
        <div class="recovery-menu">
            <div class="text-menu">
                <span class="menu-hero">Восстановление</span>
                <span class="menu-context">
                    Чтобы восстановить пароль введите вашу почту
                </span>
            </div>
            <div class="nav-menu">
                <DevAuthInput placeholder="Ваша почта" type="text" />
                <DevNavButton>Войти</DevNavButton>
            </div>
        </div>
        <DevAuthBoard :recovery="true"></DevAuthBoard>
    </div>
</template>

<script setup lang="ts">
import DevAuthInput from '~/components/auth/AuthInput.vue';
import DevNavButton from '~/components/UI/DevNavButton.vue';
import DevAuthBoard from '~/components/auth/AuthBoard.vue';
</script>

<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

.recovery-wrapper {
    display: flex;
    // align-items: center;
    justify-content: end;
    gap: 131px;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.recovery-menu {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 32px;
    min-width: 359px;
    margin-top: 100px;
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

@media (max-width: 1250px) {
    .recovery-menu {
        margin-left: 26px;
    }

    .recovery-wrapper {
        gap: 50px;
    }
}

@media (max-width: 1100px) {
    .recovery-wrapper {
        justify-content: center;
    }
}
</style>