<template>
    <UINavMenu></UINavMenu>
    <UIBackground></UIBackground>

    <div class="wrapper">
        <div class="donations">
            <div class="animation_wrapper">
                <div class="animation_box">
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
                </div>
                <div class="text">
                    <div class="text_block">
                        <p>Поддержи нашу биржу фриланса</p>
                        <span>Если тебе нравится платформа, которую мы делаем — и ты хочешь, чтобы она развивалась
                            дальше, без багов, тормозов и рекламных баннеров размером с экран — можно помочь нам парой
                            монет</span>
                    </div>
                    <div class="text_block">
                        <p>На что идут донаты?</p>
                        <ul>
                            <li>На сервера (мы тоже платим за аренду)</li>
                            <li>На доработки и фичи, которые вы просите</li>
                            <li>На кофе, багфиксы и бессонные ночи</li>
                            <li>На защиту твоих данных и твоих сделок</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="second_text_block">
                <div class="left_part">
                    <div class="text_block">
                        <p>Не можешь помочь деньгами?</p>
                        <span>Тоже ок! Просто поделись ссылкой на нас с друзьями или напиши тёплый отзыв — это тоже
                            очень ценно 💌</span>
                    </div>
                    <div class="text_block">
                        <p>Спасибо, что с нами.</p>
                    </div>
                </div>
                <div class="right_part">
                    <div class="text_block">
                        <p>Как задонатить?</p>
                        <span>Поддержать через карту</span>
                        <span>Перевести в криптовалюте</span>
                    </div>
                    <div class="donation_block">
                        <div class="donation_border">
                            <div class="donation">
                                <IconsRUB></IconsRUB>
                                <div class="detail">
                                    <p>Банковская карта</p>
                                    <span>1234 5678 9101 1121</span>
                                </div>
                                <div class="copy" @click="copyToClipboard('1234 5678 9101 1121', 'card')">
                                    Скопировать
                                </div>
                            </div>
                        </div>
                        <div class="donation_border">
                            <div class="donation">
                                <IconsUSDT></IconsUSDT>
                                <div class="detail">
                                    <p>USDT TRC-20</p>
                                    <span>gfkfsiogsjdfgiospdgjspidofgwkwpoi43fjcwio4355w345j43c5</span>
                                </div>
                                <div class="copy" @click="copyToClipboard('gfkfsiogsjdfgiospdgjspidofgwkwpoi43fjcwio4355w345j43c5', 'crypto')">
                                    Скопировать
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { copyText } from '~/shared/utils/helpers';
import { useNotifications } from '~/store/notiStore';

const notifications = useNotifications();

async function copyToClipboard(text: string, type: 'card' | 'crypto') {
    if (!(await copyText(text))) {
        notifications.setNotification('Не удалось скопировать — выделите текст вручную');
        return;
    }
    notifications.setNotification(type === 'card' ? 'Номер карты скопирован!' : 'Адрес кошелька скопирован!');
}
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .donations {
        display: flex;
        flex-direction: column;
        gap: 64px;
        width: 100%;
        max-width: 1440px;
        z-index: 100;
        margin-top: 100px;
        margin-bottom: 100px;

        .animation_wrapper {
            display: flex;
            gap: 128px;
            width: 100%;
            justify-content: space-between;

            .text {
                width: 100%;
                max-width: 550px;
                display: flex;
                flex-direction: column;
                gap: 32px;

                .text_block {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;

                    p {
                        font-weight: 600;
                        font-size: 48px;
                        color: $white;
                    }

                    span {
                        font-size: 18px;
                        color: $text-secondary;
                    }

                    ul {
                        margin-left: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        list-style-image: url('../assets/images/star.png');
                        font-size: 18px;
                        color: $text-secondary;
                    }
                }
            }
        }

        .second_text_block {
            display: flex;
            gap: 128px;
            justify-content: space-between;

            .left_part {
                display: flex;
                flex-direction: column;
                gap: 32px;
                width: 100%;
                max-width: 550px;

                .text_block {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;

                    p {
                        font-weight: 600;
                        font-size: 48px;
                        color: $white;
                    }

                    span {
                        font-size: 18px;
                        color: $text-secondary;
                    }
                }
            }

            .right_part {
                margin-top: -150px;
                display: flex;
                flex-direction: column;
                gap: 32px;

                .text_block {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    p {
                        font-weight: 600;
                        font-size: 48px;
                        color: $white;
                    }

                    span {
                        font-size: 18px;
                        color: $text-secondary;
                    }
                }

                .donation_block {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;

                    .donation_border {
                        width: 100%;
                        background: linear-gradient(90deg, #BF93D4 0%, #8CCCD0 100%);
                        border-radius: 6px;
                        padding: 2px;

                        .donation {
                            background: #1A1A1A;
                            width: 100%;
                            border-radius: 6px;
                            display: flex;
                            align-items: center;
                            padding-left: 18px;

                            .detail {
                                display: flex;
                                flex-direction: column;
                                gap: 8px;
                                padding: 14px 18px;

                                p {
                                    color: #FFFFFFDE;
                                    font-size: 18px;
                                }

                                span {
                                    color: #FFFFFF99;
                                    font-size: 14px;
                                }
                            }

                            .copy {
                                margin-left: auto;
                                padding: 29px 18px;
                                background: $primary-active;
                                border-radius: 6px;
                                cursor: pointer;
                                color: $white;
                            }
                        }
                    }
                }
            }
        }
    }
}

.animation {
    width: 678px;
    height: 678px;
    position: relative;
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
    }

    .one {
        width: 510px;
        height: 510px;
        border: 1px solid $bg-brand;

        .heart {
            position: absolute;
            top: 40px;
            left: 20px;
        }
    }

    .two {
        width: 380px;
        height: 380px;
        border: 1px solid $bg-brand;

        .card {
            position: absolute;
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
        border: 1px solid $bg-brand;
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

// Круги анимации свёрстаны в абсолютных пикселях (678px), поэтому на узких
// экранах они уменьшаются целиком через scale, а место под них — через .animation_box.
.animation_box {
    width: 678px;
    height: 678px;
    flex-shrink: 0;
}

.wrapper {
    @include page-gutters;
}

.wrapper .donations {
    .donation .detail {
        min-width: 0;

        span {
            overflow-wrap: anywhere;
        }
    }

    @include laptop {
        gap: 48px;

        .animation_wrapper {
            flex-direction: column;
            align-items: center;
            gap: 48px;

            .text {
                max-width: none;
            }
        }

        .second_text_block {
            flex-direction: column;
            gap: 48px;

            .left_part {
                max-width: none;
            }

            .right_part {
                margin-top: 0;
            }
        }
    }

    @include mobile {
        margin-top: 40px;

        .animation_wrapper .text .text_block,
        .second_text_block .left_part .text_block,
        .second_text_block .right_part .text_block {
            p {
                font-size: 30px;
            }

            span,
            ul {
                font-size: 16px;
            }
        }

        .second_text_block .right_part .donation_block .donation_border .donation {
            flex-wrap: wrap;
            padding: 12px 12px 0;

            .detail {
                flex: 1;
                padding: 0 0 12px 12px;
            }

            .copy {
                width: calc(100% + 24px);
                margin: 0 -12px;
                padding: 12px;
                text-align: center;
                border-radius: 0 0 6px 6px;
            }
        }
    }
}

@include tablet {
    .animation_box {
        width: 542px;
        height: 542px;
    }

    .animation {
        transform: scale(0.8);
        transform-origin: top left;
    }
}

@include mobile {
    .animation_box {
        width: 339px;
        height: 339px;
    }

    .animation {
        transform: scale(0.5);
    }
}

@media (max-width: 370px) {
    .animation_box {
        width: 271px;
        height: 271px;
    }

    .animation {
        transform: scale(0.4);
    }
}
</style>
