<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="portfolio" v-if="portfolio && user && userStore.user">
            <div class="images">
                <video v-if="portfolio.video" :src="makeURL(portfolio.video)" controls
                    style="max-width: 100%; height: auto;"></video>
                <img class="image" v-for="image in portfolio.images" :key="image" :src="makeURL(image)" alt="">
            </div>
            <div class="info">
                <div v-if="!portfolio.liked_by.includes(userStore.user.id)" class="like_button" @click="ratePortfolio">
                    <IconsLike></IconsLike>
                </div>
                <div v-if="portfolio.liked_by.includes(userStore.user.id)" class="like_button liked"
                    @click="ratePortfolio">
                    <div class="like_wrapper">
                        <IconsLike></IconsLike>
                    </div>
                </div>
                <div class="main_info">
                    <p>{{ portfolio.title }}</p>
                    <div class="stats">
                        <div class="stat">
                            <IconsEye></IconsEye>
                            <span>{{ portfolio.viewed_by }}</span>
                        </div>
                        <div class="stat">
                            <IconsSmallLike></IconsSmallLike>
                            <span>{{ portfolio.liked_by.length }}</span>
                        </div>
                    </div>
                    <span>Опубликовано: {{ useUserCreated(portfolio.created_at) }}</span>
                </div>
                <div class="description">
                    <p>{{ portfolio.description }}</p>
                </div>
            </div>
            <div class="footer">
                <div class="user">
                    <UIUserAvatar size="56px" :src="makeURL(user?.avatar)"></UIUserAvatar>
                    <div class="name">
                        <p>{{ user?.nickname || 'Без имени' }}</p>
                        <UIDevButton v-if="user?.id === userStore.user?.id" active
                            @click.stop="navigateTo(`/profile/portfolio/edit/${portfolio.id}`)">
                            <IconsPencil></IconsPencil>
                            Редактировать проект
                        </UIDevButton>
                        <UIDevButton v-if="user?.id !== userStore.user?.id" active
                            @click="navigateTo(`/profile/${user?.id}`)">
                            Перейти в профиль
                        </UIDevButton>
                    </div>
                </div>
                <div class="portfolio_wrapper" v-if="portfolios">
                    <div class="other_portfolio">
                        <ProfilePortfolio v-for="portfolio in portfolios" :portfolio="portfolio" :key="portfolio.id"
                            :other="true">
                        </ProfilePortfolio>
                    </div>
                </div>
                <div class="bottom_info">
                    <div class="block">
                        <p>Роль</p>
                        <div class="value">
                            {{ portfolio.role }}
                        </div>
                    </div>
                    <div class="block" v-if="portfolio.skills?.length">
                        <p>Навыки</p>
                        <div class="value_skill">
                            <div v-for="skill in portfolio.skills" :key="skill" class="value skill">
                                {{ skill }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseURL } from '~/shared/api';
import { likePortfolio, viewPortfolio, type Portfolio } from "~/shared/api/portfolio-api";
import type { User } from '~/shared/api/user-api';
import { makeURL } from '~/shared/utils/helpers';
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const portfolio = ref<Portfolio>();
const portfolios = ref<Portfolio[]>();
const user = ref<User | null>(null);

async function ratePortfolio() {
    if (!userStore.user) return;

    const isLike = portfolio.value?.liked_by.includes(userStore.user.id);

    portfolio.value = await likePortfolio(route.params.id as string, !isLike);
}

onMounted(async () => {
    await userStore.checkAuth();
    if (!userStore.user) return;

    const id = route.params.id as string;
    portfolio.value = await portfolioStore.getPortfolio(id);

    if (!portfolio.value) return;

    if (portfolio.value.user_id === userStore.user.id) {
        user.value = userStore.user;
        await portfolioStore.getMyPortfolio();
        portfolios.value = portfolioStore.portfolio;
        const index = portfolios.value.findIndex((p) => p.id === id) as number;
        portfolios.value?.splice(index, 1);
    } else {
        user.value = await userStore.getUserId(portfolio.value.user_id);
        portfolios.value = await portfolioStore.getPortfoliosById(portfolio.value.user_id);
        const index = portfolios.value?.findIndex((p) => p.id === id) as number;
        portfolios.value?.splice(index, 1);
    }

    await viewPortfolio(id);
});
</script>

<style lang="scss" scoped>


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
        color: $white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 48px;
        width: 100%;
        max-width: 1440px;
        margin-top: 32px;
        background: $bg-brand;
        border-radius: 20px;
        padding: 64px 0 0 0;

        .images {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 64px;
            padding: 0 42px;

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
            max-width: 900px;
            padding: 0 42px;

            .like_button {
                border-radius: 100%;
                width: 64px;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: $active;
                cursor: pointer;
                padding: 2px;

                svg {
                    cursor: pointer;
                }

                &.liked {
                    background: $bg-button-gradient;

                    .like_wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: $input-auth;
                        border-radius: 100%;
                    }
                }
            }

            .main_info {
                display: flex;
                flex-direction: column;
                gap: 16px;

                &>p {
                    font-weight: 600;
                    font-size: 24px;
                    text-align: center;
                }

                span {
                    font-size: 14px;
                    color: $text-secondary;
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

        .footer {
            width: 100%;
            background: $tag-color;
            border-radius: 6px;
            margin-bottom: 100px;
            display: flex;
            flex-direction: column;
            gap: 32px;

            .user {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 40px 48px 0 48px;

                .name {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    p {
                        color: $white;
                        font-weight: 600;
                        font-size: 14px;
                    }
                }
            }

            .portfolio_wrapper {
                position: relative;
                margin: 0 40px 0 48px;

                .other_portfolio {
                    display: flex;
                    gap: 24px;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    scroll-behavior: smooth;
                    padding-bottom: 12px;

                    @include custom-scrollbar; 
                }
            }

            .bottom_info {
                display: flex;
                align-items: start;
                justify-content: space-between;
                gap: 64px;
                padding: 0 48px 40px 48px;

                .block {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: calc(50% - 32px);

                    p {
                        font-weight: 500;
                        font-size: 14px;
                    }

                    .value_skill {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 12px;
                    }

                    .value {
                        width: 100%;
                        color: $text-secondary;
                        font-size: 12px;
                        padding: 12px 28px;
                        border-radius: 6px;
                        background: $input-auth;

                        &.skill {
                            width: fit-content;
                        }
                    }
                }
            }
        }
    }
}
</style>