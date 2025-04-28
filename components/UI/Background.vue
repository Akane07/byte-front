<template>
    <div>
        <div class="background">
            <div v-for="i in 16" :key="i" class="line"></div>
        </div>
        <div class="circles">
            <div class="circle"></div>
            <IconsCircle class="circle"></IconsCircle>
            <IconsCircle class="circle"></IconsCircle>
            <IconsCircle class="circle"></IconsCircle>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.background {
    position: fixed;
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
</style>