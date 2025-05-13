<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="animation">
        <div class="circle outer"></div>
        <div class="circle one">
            <IconsHeart class="heart"></IconsHeart>
        </div>
        <div class="circle two">
            <IconsCard class="card"></IconsCard>
            <IconsCoin class="coin"></IconsCoin>
            <IconsGradientCircle class="gradient_one"></IconsGradientCircle>
            <IconsGradientCircle class="gradient_two"></IconsGradientCircle>
            <IconsGradientCircle class="gradient_three"></IconsGradientCircle>
        </div>
        <div class="circle inner"></div>
        <div class="circle center">
            <IconsLogo></IconsLogo>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.animation {
    width: 678px;
    height: 678px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;

    .circle {
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .outer {
        width: 678px;
        height: 678px;
        border: 1px solid #222228;
    }

    .one {
        width: 510px;
        height: 510px;
        border: 1px solid #222228;

        .heart {
            position: absolute;
            top: 40px;
            left: 20px;
        }
    }

    .two {
        width: 380px;
        height: 380px;
        border: 1px solid #222228;

        .card {
            position: absolute;
            // top: 150px;
            // right: -60px;
            top: 60px;
            right: -35px;
        }

        .coin {
            position: absolute;
            bottom: -20px;
            left: 80px;
        }

        .gradient_one {
            position: absolute;
            top: -13px;
            right: 140px;
        }

        .gradient_two {
            position: absolute;
            bottom: 0px;
            right: 100px;
        }

        .gradient_three {
            position: absolute;
            bottom: 100px;
            left: 0px;
        }
    }

    .inner {
        width: 260px;
        height: 260px;
        border: 1px solid #222228;
    }

    .center {
        width: 130px;
        height: 130px;
        background: #18181C;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>