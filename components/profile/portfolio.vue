<template>
    <div class="work">
        <img src="https://placehold.co/250x180" alt="">
        <div class="hover">
            <div class="buttons">
                <div class="button">
                    <IconsTrash style="transform: scale(1.3);"></IconsTrash>
                </div>
                <div class="button">
                    <IconsEditPen style="transform: scale(1.3);"></IconsEditPen>
                </div>
            </div>
            <div class="description">
                <p>Название проекта</p>
                <span>Тема проекта</span>
            </div>
            <div class="gradient"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../../assets/styles/vars.scss';

.work {
    width: 250px;
    height: 180px;
    background: transparent;
    border-radius: 6px;
    border: 1.5px solid $active-button-color;
    overflow: hidden;
    position: relative;
    cursor: pointer;

    .hover {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.2s ease-in;

        .buttons {
            display: flex;
            gap: 8px;
            position: absolute;
            right: 14px;
            top: 10px;

            .button {
                background: white;
                border-radius: 6px;
                border: 2px solid rgba(70, 144, 212, 0.376);
                width: 40px;
                height: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .description {
            position: absolute;
            bottom: 10px;
            left: 16px;
            p {
                font-weight: 500;
                font-size: 14px;
            }

            span {
                font-weight: 500;
                font-size: 12px;
            }
        }

        .gradient {
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, rgba(107, 99, 99, 0.08) 2.74%, #000000 100%);
        }
    }

    &:hover .hover {
        opacity: 1;
    }
}
</style>