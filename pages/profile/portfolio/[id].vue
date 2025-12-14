<template>
    <UINavMenu></UINavMenu>
    <UIBackground></UIBackground>

    <div class="w-full flex flex-col justify-center items-center z-100 relative mb-25">
        <div class="portfolio flex flex-col items-center gap-12 w-full max-w-[1440px] mt-8 pt-16 rounded-[20px]"
            v-if="portfolio && user && userStore.user">
            <div class="flex flex-col items-center gap-16 px-[42px]">
                <video v-if="portfolio.video" :src="makeURL(portfolio.video)" controls
                    style="max-width: 100%; height: auto" class="w-full h-auto max-h-[500px] rounded-md"></video>
                <img class="w-full max-w-[800px] object-cover rounded-md" v-for="image in portfolio.images" :key="image"
                    :src="makeURL(image)" />
            </div>
            <div class="flex flex-col items-center gap-8 max-w-[900px] py-[42px]">
                <div v-if="!portfolio.liked_by.includes(userStore.user.id)" class="like_button" @click="ratePortfolio">
                    <IconsLike></IconsLike>
                </div>
                <div v-if="portfolio.liked_by.includes(userStore.user.id)" class="like_button liked"
                    @click="ratePortfolio">
                    <div class="like_wrapper w-full h-full flex items-center justify-center rounded-[100%]">
                        <IconsLike></IconsLike>
                    </div>
                </div>
                <div class="main_info flex flex-col gap-4">
                    <p class="flex font-semibold text-2xl text-center">
                        {{ portfolio.title }}
                    </p>
                    <div class="flex justify-center gap-4">
                        <div class="flex items-center gap-2">
                            <IconsEye></IconsEye>
                            <span>{{ portfolio.viewed_by }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <IconsSmallLike></IconsSmallLike>
                            <span>{{ portfolio.liked_by.length }}</span>
                        </div>
                    </div>
                    <span>Опубликовано: {{ useUserCreated(portfolio.created_at) }}</span>
                </div>
                <div>
                    <p>{{ portfolio.description }}</p>
                </div>
            </div>
            <div class="footer w-full flex flex-col gap-8 mb-25 rounded-md py-10 px-12">
                <div class="flex items-center gap-4">
                    <UIUserAvatar size="56px" :src="makeURL(user?.avatar)"></UIUserAvatar>
                    <div class="flex flex-col gap-3">
                        <p class="text-white font-semibold text-[14px]">{{ user?.nickname || "Без имени" }}</p>
                        <UIButton v-if="user?.id === userStore.user?.id" active @click.stop="
                            navigateTo(`/profile/portfolio/edit/${portfolio.id}`)
                            ">
                            <IconsPencil></IconsPencil>
                            Редактировать проект
                        </UIButton>
                        <UIButton v-if="user?.id !== userStore.user?.id" active
                            @click="navigateTo(`/profile/${user?.id}`)">
                            Перейти в профиль
                        </UIButton>
                    </div>
                </div>
                <div class="relative" v-if="portfolios">
                    <div class="other_portfolio flex gap-6 overflow-x-auto pb-3">
                        <ProfilePortfolioBlock v-for="portfolio in portfolios" :portfolio="portfolio"
                            :key="portfolio.id" other>
                        </ProfilePortfolioBlock>
                    </div>
                </div>
                <div class="flex justify-between items-start gap-16 pb-10">
                    <div class="blocks flex flex-col gap-3"> 
                        <p>Роль</p>
                        <div class="value">
                            {{ portfolio.role }}
                        </div>
                    </div>
                    <div class="blocks flex flex-col gap-3" v-if="portfolio.skills?.length">
                        <p>Навыки</p>
                        <div class="flex flex-wrap gap-3">
                            <div v-for="skill in portfolio.skills" :key="skill" class="value w-fit!">
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
import {
    likePortfolio,
    viewPortfolio,
    type Portfolio,
} from "~/shared/api/portfolio-api";
import type { User } from "~/shared/api/user-api";
import { makeURL } from "~/shared/utils/helpers";
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

definePageMeta({
    middleware: ["auth"],
});

const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const portfolio = ref<Portfolio>();
const portfolios = ref<Portfolio[]>([]);
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
    } else {
        user.value = await userStore.getUserId(portfolio.value.user_id);
        portfolios.value = await portfolioStore.getPortfoliosById(
            portfolio.value.user_id
        );
    }
    const index = portfolios.value.findIndex((p) => p.id === id) as number;
    portfolios.value.splice(index, 1);

    await viewPortfolio(id);
});
</script>

<style lang="scss" scoped>
.portfolio {
    color: $white;
    background: $bg-brand;

    .like_button {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: $primary;
        cursor: pointer;
        padding: 2px;
        border-radius: 100%;

        svg {
            cursor: pointer;
        }

        &.liked {
            background: $bg-button-gradient;

            .like_wrapper {
                background: $input-auth;
            }
        }
    }

    span {
        color: $text-secondary;
        text-align: center;
        font-size: 14px;
    }

    .footer {
        background: $tag-color;

        .other_portfolio {
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;

            @include custom-scrollbar;
        }

        .blocks {
            width: calc(50% - 32px);

            p {
                font-weight: 500;
                font-size: 14px;
            }

            .value {
                width: 100%;
                color: $text-secondary;
                font-size: 12px;
                padding: 12px 28px;
                border-radius: 6px;
                background: $input-auth;
            }
        }
    }
}
</style>
