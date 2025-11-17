<template>
    <!-- <div class="notifications_wrapper"> -->
    <div class="notification">
        <div class="bg">
            <IconsCloseSquare class="icon" @click="notiStore.hideNotification()"></IconsCloseSquare>
            <p>{{ notiStore.text }}</p>
        </div>
    </div>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { useNotifications } from '~/store/notiStore';

const notiStore = useNotifications();
</script>

<style lang="scss" scoped>
.notifications_wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .notification {
        position: fixed;
        box-shadow: 0px 0px 15px 0px #FFFFFF1A;
        border-radius: 6px;
        top: 80px;
        right: -100%;
        z-index: 100000000000;
        transition: right 0.5s ease-in-out;
        background: radial-gradient(80.38% 222.5% at -13.75% -12.36%, #98F9FF 0%, rgba(255, 255, 255, 0) 100%),
            radial-gradient(80.69% 208.78% at 108.28% 112.58%, #EABFFF 0%, rgba(135, 38, 183, 0) 100%);
        padding: 2px;

        .bg {
            width: 100%;
            height: 100%;
            padding: 16px 24px;
            font-weight: 600;
            color: white;
            border-radius: 6px;
            border-radius: 6px;
            background: $tag-color;

        }

        .icon {
            position: absolute;
            top: -10px;
            left: -10px;
        }

        &.active {
            right: 40px;
        }
    }
}

.notification {
    position: fixed;
    box-shadow: 0px 0px 15px 0px #FFFFFF1A;
    border-radius: 6px;
    top: 80px;
    right: -100%;
    z-index: 100000000000;
    transition: right 0.5s ease-in-out;
    background: radial-gradient(80.38% 222.5% at -13.75% -12.36%, #98F9FF 0%, rgba(255, 255, 255, 0) 100%),
        radial-gradient(80.69% 208.78% at 108.28% 112.58%, #EABFFF 0%, rgba(135, 38, 183, 0) 100%);
    padding: 2px;

    .bg {
        width: 100%;
        height: 100%;
        padding: 16px 24px;
        font-weight: 600;
        color: white;
        border-radius: 6px;
        border-radius: 6px;
        background: $tag-color;
    }

    .icon {
        position: absolute;
        top: -10px;
        left: -10px;
    }

    &.active {
        right: 40px;
    }
}
</style>