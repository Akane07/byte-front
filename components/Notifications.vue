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
        box-shadow: 0px 0px 15px 0px $shadow;
        border-radius: 6px;
        top: 40px;
        right: -100%;
        z-index: 100000000000;
        transition: right 0.5s ease-in-out;
        background: $bg-gradient;
        padding: 2px;

        .bg {
            width: 100%;
            height: 100%;
            padding: 16px 24px;
            font-weight: 600;
            color: $white;
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
    box-shadow: 0px 0px 15px 0px $shadow;
    border-radius: 6px;
    top: 40px;
    right: -100%;
    z-index: 100000000000;
    transition: right 0.5s ease-in-out;
    background: $bg-gradient;
    padding: 2px;

    .bg {
        width: 100%;
        height: 100%;
        padding: 16px 24px;
        font-weight: 600;
        color: $white;
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