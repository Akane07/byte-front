<template>
    <div class="icons-grid">
        <div class="river-left">
            <div class="icon-cont"></div>
            <div class="icon-cont">
                <img src="../../assets/icons/clock.svg" alt="" v-if="recovery">
                <img src="../../assets/icons/money_brick.svg" alt="" v-else>
            </div>
            <div class="icon-cont"></div>
            <div class="icon-cont"></div>
            <div class="icon-cont"></div>
        </div>
        <div class="river-center">
            <div class="icon-cont"></div>
            <div class="icon-cont"></div>
            <div class="icon-cont">
                <img src="../../assets/icons/keyboard_right.svg" alt="" v-if="recovery">
                <img src="../../assets/icons/desk_plant.png" alt="" v-else>
            </div>
            <div class="icon-cont"></div>
            <div class="icon-cont"></div>
        </div>
        <div class="river-right">
            <div class="icon-cont"></div>
            <div class="icon-cont">
                <img src="../../assets/icons/hz.svg" alt="" v-if="recovery">
                <img src="../../assets/icons/rocket.svg" alt="" v-else>
            </div>
            <div class="icon-cont"></div>
            <div class="icon-cont"></div>
            <div class="icon-cont"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    recovery?: boolean
}>();
</script>

<style scoped lang="scss">
.icons-grid {
    height: 100vh;
    width: 50%;
    display: flex;
    justify-content: center;
    gap: 30px;
}

.river-left {
    width: 210px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 30px;
    top: -65px;
}

.river-center {
    width: 210px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 30px;
    top: -175px;
}

.river-right {
    width: 210px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 30px;
    top: -65px;
}

.icon-cont {
    width: 100%;
    min-height: 239px;
    background: $input-auth;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

}

@media (max-width: 1500px) {
    .icons-grid {
        // width: 40%;
        margin-right: 26px;
    }
}

@media (max-width: 1250px) {
    .icons-grid {
        width: 60%;
        margin-right: 26px;
    }
}

@media (max-width: 1350px) {
    .icons-grid {
        // width: 30%;
        margin-right: 26px;
    }
}

@media (max-width: 1100px) {
    .icons-grid {
        display: none;
    }
}
</style>