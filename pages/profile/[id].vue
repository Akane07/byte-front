<template>
    <UIDevNavMenu></UIDevNavMenu>
    <UIBackground></UIBackground>

    <ProfileUser></ProfileUser>
</template>

<script setup lang="ts">
import type { User } from '~/shared/api/user-api';
import { useUserStore } from '~/store/userStore';
import type { Portfolio } from '~/shared/api/portfolio-api';
import { usePortfolioStore } from '~/store/portfolioStore';

definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const portfolios = ref<Portfolio[]>([]);
const feedbacks = ref([]);
const user = ref<User | null>(null);

const id = route.params.id as string;
user.value = await userStore.getUserId(id);
portfolios.value = await portfolioStore.getPortfoliosById(id);
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

    .profile {
        color: $white;
        display: flex;
        flex-direction: column;
        gap: 40px;
        width: 100%;
        max-width: 1440px;
        margin-top: 32px;
        background: $bg-brand;
        border-radius: 20px;
        padding: 64px 42px;

        .main_info {
            display: flex;
            gap: 24px;
            border-bottom: 1px solid $border-color;

            .bordered {
                width: 1px;
                height: inherit;
                background: $border-color;
            }

            .left_part {
                display: flex;
                flex-direction: column;
                gap: 16px;
                min-width: 230px;
                padding-bottom: 18px;

                .avatar {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .stats {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    color: $text-secondary;
                    font-size: 14px;

                    .stat {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                    }
                }
            }

            .middle_part {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding-bottom: 18px;
                width: 100%;

                .name {
                    font-weight: 600;
                    color: $active;
                    font-size: 24px;
                }

                .speciality {
                    font-weight: 500;
                    font-size: 22px;
                }

                span {
                    margin-top: 12px;
                    font-size: 14px;
                    color: $text-secondary;
                }
            }

            .right_part {
                width: 100%;
                max-width: 230px;
                display: flex;
                flex-direction: column;
                gap: 32px;
                padding-bottom: 18px;
                padding-top: 12px;

                .user_stats {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;

                    .average {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        font-size: 14px;

                        .star {
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                            gap: 8px;
                        }
                    }

                    .stats {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;

                        .stat {
                            display: flex;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 8px;

                            span {
                                color: $select-enabled;
                                font-weight: 500;
                            }
                        }
                    }
                }
            }
        }

        .portfolio,
        .feedbacks {
            display: flex;
            flex-direction: column;
            gap: 40px;

            .header {
                display: flex;
                justify-content: space-between;

                p {
                    font-weight: 500;
                    font-size: 22px;
                }
            }
        }

        .portfolio {
            .portfolio_blocks {
                display: flex;
                flex-wrap: wrap;
                gap: 24px;
            }
        }
    }
}
</style>