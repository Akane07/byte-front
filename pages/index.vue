<template>
    <div class="home">
        <UIDevNavMenu></UIDevNavMenu>
        <div class="wrapper">
            <UIBackground></UIBackground>
            <div class="content">
                <h1>Хотите фармить миллионы? Или найти того, кто их заберёт?</h1>
                <p>Вам на Freelance Byte...</p>
                <UIDevNavButton @click="$router.push('/orders')" style="z-index: 100;">Перейти</UIDevNavButton>

                <!-- <div class="canvas">
                    <canvas id="canvas3d" width="1000" height="1000"></canvas>
                    <div class="hide-block"></div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Application } from '@splinetool/runtime';

definePageMeta({
    middleware: ['auth'],
});

onMounted(async () => {
    // const canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
    // const app = new Application(canvas);
    // app.load('https://prod.spline.design/ijwoY6i07SdqDJvF/scene.splinecode');
})
</script>

<style scoped lang="scss">
@import '../assets/styles/vars.scss';

.home {
    background-color: #000000;
    width: 100%;
    height: 100vh;
    position: relative;

    .wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        padding: 0 60px;
        top: 0;

        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            color: #fff;
            text-align: center;
            margin-top: 260px;

            h1 {
                font-weight: 600;
                font-size: clamp(40px, 8vw, 64px);
                line-height: clamp(40px, 8vw, 80px);
                max-width: 1100px;
                width: 100%;
                z-index: 1;
            }

            p {
                font-size: 18px;
                line-height: 28px;
                color: #9E9E9E;
                z-index: 3;
            }
        }

        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;

            .line {
                width: 1px;
                height: 100%;
                background: linear-gradient(180deg, #404047 0%, rgba(64, 64, 71, 0) 65.45%);
            }
        }

        .circles {
            .circle:nth-child(1) {
                background: radial-gradient(50% 50% at 50% 50%, #222228 0%, rgba(34, 34, 40, 0) 100%);
                border-radius: 50%;
                width: 500px;
                height: 500px;
                position: absolute;
                top: 0px;
                left: 50%;
                transform: translateX(-50%);
            }

            .circle:nth-child(2) {
                position: absolute;
                top: 60px;
                left: 45%;
                transform: translateX(-50%);
                z-index: 2;
            }

            .circle:nth-child(3) {
                width: 150px;
                height: 150px;
                position: absolute;
                top: 400px;
                right: 15%;
                transform: translateX(-50%);
                z-index: 2;
            }

            .circle:nth-child(4) {
                width: 200px;
                height: 200px;
                position: absolute;
                top: 400px;
                left: 15%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
    }

    .canvas {
        position: relative;
        .hide-block {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100px;
            background: black;
        }
    }
}
</style>
