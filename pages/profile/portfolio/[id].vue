<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="portfolio" v-if="portfolio">
            <div class="images">
                <video v-if="portfolio.video" :src="baseURL + portfolio.video" controls style="max-width: 100%; height: auto;"></video>
                <img class="image" v-for="image in portfolio.images" :key="image" :src="baseURL + image" alt="">
            </div>
            <div class="info">
                <div class="like_button">
                    <IconsLike></IconsLike>
                </div>
                <div class="main_info">
                    <p>{{ portfolio.title }}</p>
                    <div class="stats">
                        <div class="stat">
                            <IconsEye></IconsEye>
                            <span>16</span>
                        </div>
                        <div class="stat">
                            <IconsSmallLike></IconsSmallLike>
                            <span>16</span>
                        </div>
                    </div>
                    <span>Опубликовано: {{ useOrderCreated(portfolio.created_at) }}</span>
                </div>
                <div class="description">
                    <p>{{ portfolio.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseURL } from '~/api';
import { type Portfolio } from "~/api/portfolio-api";
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const portfolio = ref<Portfolio>();

onMounted(async () => {
    await userStore.checkAuth();
    const id = route.params.id as string;

    portfolio.value = await portfolioStore.getPortfolio(id);
});
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/vars.scss';

.wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
    position: relative;
    margin-bottom: 100px;

    .portfolio {
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 48px;
        width: 100%;
        max-width: 1440px;
        margin-top: 40px;
        background: $main-color;
        border-radius: 20px;
        padding: 64px 42px;

        .images {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 64px;

            .image {
                width: 100%;
                max-width: 800px;
                object-fit: cover;
                border-radius: 6px;
                // max-height: 600px;
            }

            video {
                width: 100%;
                border-radius: 6px;
                max-height: 500px; 
            }
        }

        .info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 32px;
            max-width: 600px;

            .like_button {
                border-radius: 100%;
                width: 64px;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: $active-button-color;
            }

            .main_info {
                display: flex;
                flex-direction: column;
                gap: 16px;

                & > p {
                    font-weight: 600;
                    font-size: 24px;
                }

                span {
                    font-size: 14px;
                    color: $text-color-secondary;
                    text-align: center;
                }

                .stats {
                    display: flex;
                    gap: 16px;
                    justify-content: center;

                    .stat {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                    }
                }
            }

        }
    }
}
</style>