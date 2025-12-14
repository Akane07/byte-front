<template>
    <UINavMenu></UINavMenu>
    <UIBackground></UIBackground>

    <div class="animation">
        <div class="circle outer">
            <div class="rotation_wrapper">
                <IconsHeart class="heart"></IconsHeart>
            </div>
        </div>
        <div class="circle one">
            <div class="rotation_wrapper">
                <IconsCard class="card"></IconsCard>
                <IconsGradientCircle class="gradient_one"></IconsGradientCircle>
            </div>
        </div>
        <div class="circle two">
            <div class="rotation_wrapper">
                <IconsCoin class="coin"></IconsCoin>
                <IconsGradientCircle class="gradient_two"></IconsGradientCircle>
            </div>
        </div>
        <div class="circle inner">
            <div class="rotation_wrapper">
                <IconsGradientCircle class="gradient_three"></IconsGradientCircle>
            </div>
        </div>
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
        border: 1px solid $bg-brand;

        .rotation_wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: rotation 2s linear infinite;
        }

        .heart {
            position: absolute;
            top: 40px;
            left: 50px;

            animation: rotation 0.2s linear infinite reverse;
        }
    }

    .one {
        width: 510px;
        height: 510px;
        border: 1px solid $bg-brand;

        .rotation_wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: rotation 2s linear infinite reverse;
        }

        .card {
            position: absolute;
            top: 60px;
            right: -5px;
            animation: rotation 0.2s linear infinite;
        }

        .gradient_one {
            position: absolute;
            bottom: 4px;
            right: 140px;
        }
    }

    .two {
        width: 380px;
        height: 380px;
        border: 1px solid $bg-brand;

        .rotation_wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: rotation 1s linear infinite;
        }

        .coin {
            position: absolute;
            bottom: -20px;
            left: 80px;
            animation: rotation 0.2s linear infinite reverse;
        }

        .gradient_two {
            position: absolute;
            top: 0px;
            right: 100px;
        }
    }

    .inner {
        width: 260px;
        height: 260px;
        border: 1px solid $bg-brand;

        .rotation_wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: rotation 0.5s linear infinite;
        }

        .gradient_three {
            position: absolute;
            bottom: 100px;
            left: -16px;
        }
    }

    .center {
        width: 130px;
        height: 130px;
        background: $input-auth;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>


