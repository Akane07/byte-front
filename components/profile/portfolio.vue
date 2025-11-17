<template>
    <div class="work">
        <img :src="baseURL + portfolio.images[0]" alt="photo">
        <div class="hover" @click.stop="navigateTo(`/profile/portfolio/${portfolio.id}`)">
            <div class="buttons" v-if="!other">
                <div class="button" @click.stop="handleDelete">
                    <IconsTrash style="transform: scale(1.3);"></IconsTrash>
                </div>
                <div class="button" @click.stop="navigateTo(`/profile/portfolio/edit/${portfolio.id}`)">
                    <IconsEditPen style="transform: scale(1.3);"></IconsEditPen>
                </div>
            </div>
            <div class="description">
                <p>{{ portfolio.title }}</p>
                <span>{{ portfolio.role }}</span>
            </div>
            <div class="gradient"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseURL } from '~/api';
import { type Portfolio } from "~/api/portfolio-api";
import { usePortfolioStore } from '~/store/portfolioStore';

const props = defineProps<{
    portfolio: Portfolio,
    other?: boolean
}>();

const portfolioStore = usePortfolioStore();

async function handleDelete() {
    await portfolioStore.deletePortfolio(props.portfolio.id);
}
</script>

<style scoped lang="scss">


.work {
    width: 250px;
    min-width: 250px;
    height: 180px;
    background: transparent;
    border-radius: 6px;
    border: 1.5px solid $active;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    scroll-snap-align: start;
    user-select: none;

    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

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
            background: linear-gradient(180deg, rgba(107, 99, 99, 0.08) 2.74%, $black 100%);
        }
    }

    &:hover .hover {
        opacity: 1;
    }
}
</style>