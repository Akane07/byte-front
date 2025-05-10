<template>
    <UIDevNavMenu></UIDevNavMenu>

    <div class="wrapper">
        <div ref="wrapperRef" class="step_wrapper">
            <div class="step_block">
                <div class="left_part">
                    <span class="step">1/5 Название</span>
                    <h2>Для начала придумайте отличное название</h2>
                    <p>Хорошее название поможет вам привлечь нужных кандидатов. Это первое, что они увидят, поэтому
                        важно
                        сформулировать его чётко и понятно для исполнителей.</p>
                </div>
                <div class="right_part">
                    <div class="block">
                        <p>Напишите название для своего заказа</p>
                        <UIDevInput v-model="newOrder.title" type="text"
                            placeholder="Например, Front-end разработчик или Web-designer"></UIDevInput>
                    </div>
                    <div class="description">
                        <p>Примеры названий</p>
                        <ul>
                            <li>Создайте адаптивный сайт на WordPress с функцией бронирования/оплаты</li>
                            <li>Опыт работы с AR необходим для виртуальных демонстраций продукта (ARCore)</li>
                            <li>Разработчику необходимо обновить пользовательский интерфейс приложения Android для новых
                                спецификаций ОС/устройства</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="step_block">
                <div class="left_part">
                    <span class="step">2/5 Навыки</span>
                    <h2>Для начала придумайте отличное название</h2>
                    <p>Хорошее название поможет вам привлечь нужных кандидатов. Это первое, что они увидят, поэтому
                        важно
                        сформулировать его чётко и понятно для исполнителей.</p>
                </div>
                <div class="right_part">
                    <div class="block">
                        <p>Напишите название для своего заказа</p>
                        <UIDevInput v-model="newOrder.title" type="text"
                            placeholder="Например, Front-end разработчик или Web-designer"></UIDevInput>
                    </div>
                    <div class="description">
                        <p>Примеры названий</p>
                        <ul>
                            <li>Создайте адаптивный сайт на WordPress с функцией бронирования/оплаты</li>
                            <li>Опыт работы с AR необходим для виртуальных демонстраций продукта (ARCore)</li>
                            <li>Разработчику необходимо обновить пользовательский интерфейс приложения Android для новых
                                спецификаций ОС/устройства</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="step_block">
                <div class="left_part">
                    <span class="step">{{ step }}/5 {{ stepTitle }}</span>
                    <h2>Для начала придумайте отличное название</h2>
                    <p>Хорошее название поможет вам привлечь нужных кандидатов. Это первое, что они увидят, поэтому
                        важно
                        сформулировать его чётко и понятно для исполнителей.</p>
                </div>
                <div class="right_part">
                    <div class="block">
                        <p>Напишите название для своего заказа</p>
                        <UIDevInput v-model="newOrder.title" type="text"
                            placeholder="Например, Front-end разработчик или Web-designer"></UIDevInput>
                    </div>
                    <div class="description">
                        <p>Примеры названий</p>
                        <ul>
                            <li>Создайте адаптивный сайт на WordPress с функцией бронирования/оплаты</li>
                            <li>Опыт работы с AR необходим для виртуальных демонстраций продукта (ARCore)</li>
                            <li>Разработчику необходимо обновить пользовательский интерфейс приложения Android для новых
                                спецификаций ОС/устройства</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="step_block">
                <div class="left_part">
                    <span class="step">{{ step }}/5 {{ stepTitle }}</span>
                    <h2>Для начала придумайте отличное название</h2>
                    <p>Хорошее название поможет вам привлечь нужных кандидатов. Это первое, что они увидят, поэтому
                        важно
                        сформулировать его чётко и понятно для исполнителей.</p>
                </div>
                <div class="right_part">
                    <div class="block">
                        <p>Напишите название для своего заказа</p>
                        <UIDevInput v-model="newOrder.title" type="text"
                            placeholder="Например, Front-end разработчик или Web-designer"></UIDevInput>
                    </div>
                    <div class="description">
                        <p>Примеры названий</p>
                        <ul>
                            <li>Создайте адаптивный сайт на WordPress с функцией бронирования/оплаты</li>
                            <li>Опыт работы с AR необходим для виртуальных демонстраций продукта (ARCore)</li>
                            <li>Разработчику необходимо обновить пользовательский интерфейс приложения Android для новых
                                спецификаций ОС/устройства</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="step_block">
                <div class="left_part">
                    <span class="step">{{ step }}/5 {{ stepTitle }}</span>
                    <h2>Для начала придумайте отличное название</h2>
                    <p>Хорошее название поможет вам привлечь нужных кандидатов. Это первое, что они увидят, поэтому
                        важно
                        сформулировать его чётко и понятно для исполнителей.</p>
                </div>
                <div class="right_part">
                    <div class="block">
                        <p>Напишите название для своего заказа</p>
                        <UIDevInput v-model="newOrder.title" type="text"
                            placeholder="Например, Front-end разработчик или Web-designer"></UIDevInput>
                    </div>
                    <div class="description">
                        <p>Примеры названий</p>
                        <ul>
                            <li>Создайте адаптивный сайт на WordPress с функцией бронирования/оплаты</li>
                            <li>Опыт работы с AR необходим для виртуальных демонстраций продукта (ARCore)</li>
                            <li>Разработчику необходимо обновить пользовательский интерфейс приложения Android для новых
                                спецификаций ОС/устройства</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="step_block"></div>
        </div>
        <div class="footer">
            <div class="progress">
                <div class="line" :style="{ width: `${step * 20}%` }"></div>
            </div>
            <div class="actions">
                <UIDevButton class="next" :active="false" @click="prevStep">Назад</UIDevButton>
                <div class="right">
                    <button class="draft">Сохранить как черновик</button>
                    <UIDevButton class="next" :active="true" @click="nextStep">Далее</UIDevButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Order } from '~/api/order-api';

const router = useRouter();

const wrapperRef = ref<HTMLDivElement | null>(null);
const step = shallowRef(1);
const newOrder = ref<Partial<Order>>({
    title: '',
    description: '',
    price: 0,
    price_type: 'fixed',// 'contract' | 'fixed'; // договорная или фиксированная цена
    type: 'one-time',// 'one-time' | 'reusable';
    for_experts: false,
    deadlines: 'contract', //'contract' | 'more-than-month' | 'less-than-month' | string;
    skills: [],
    category: '',
    draft: true,
});

const stepTitle = computed(() => {
    switch (step.value) {
        case 1:
            return 'Название';
        case 2:
            return 'Навыки';
        case 3:
            return 'Сроки';
        case 4:
            return 'Оплата';
        case 5:
            return 'Описание';
    }
})

function prevStep() {
    if (step.value > 1) {
        step.value--;
        scrollTo();
    } else {
        router.back();
    }
}

function nextStep() {
    switch (step.value) {
        case 1:
            if (newOrder.value.title) {
                step.value = 2;
                scrollTo();
                return;
            }
            return;
        case 2:
            if (newOrder.value.category) {
                step.value = 3;
                scrollTo();
                return;
            }
            return;
        case 3:
            if (newOrder.value.deadlines && newOrder.value.type) {
                step.value = 4;
                scrollTo();
                return;
            }
            return;
        case 4:
            if (newOrder.value.price_type && newOrder.value.price) {
                step.value = 5;
                scrollTo();
                return;
            }
            return;
        case 5:
            return;
    }
}

function scrollTo() {
    wrapperRef.value!.scrollLeft = (wrapperRef.value!.firstChild!.clientWidth + 270) * (step.value - 1)
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.wrapper {
    width: 100%;
    min-height: 100dvh;
    background: $input-auth;
    position: absolute;
    top: 0;
    left: 0;
    padding: 100px 150px 300px 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 100px;
    overflow-x: hidden;

    .step_wrapper {
        width: 100%;
        max-width: 1620px;
        overflow-x: hidden;
        display: flex;
        gap: 180px;
        scroll-behavior: smooth;

        .step_block {
            width: 100%;
            max-width: 1440px;
            display: flex;
            align-items: start;
            gap: 64px;
            justify-content: space-between;
            font-weight: 500;
            flex: 0 0 auto;
            margin-left: 90px;

            .left_part {
                display: flex;
                flex-direction: column;
                gap: 24px;
                max-width: 600px;

                .step {
                    font-size: 16px;
                    color: $text-color-secondary;
                }

                h2 {
                    font-size: 32px;
                    color: $text-color-main;
                }

                p {
                    font-size: 14px;
                    color: $text-color-secondary;
                }
            }

            .right_part {
                display: flex;
                flex-direction: column;
                gap: 24px;
                max-width: 600px;
                margin-top: 43px;

                .block {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    color: white;
                }

                .description {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;

                    p {
                        color: white;
                    }

                    ul {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        list-style-type: disc;
                        padding-left: 20px;
                        color: $text-color-secondary;
                    }
                }
            }

            &:last-child {
                padding-right: 90px;
            }
        }
    }

    .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 30px 100px;
        width: 100%;

        .progress {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: #313139;

            .line {
                width: 20%;
                height: 1px;
                background: #FFFFFF;
                transition: width 0.5s ease-in-out;
            }
        }

        .actions {
            display: flex;
            justify-content: space-between;
            gap: 64px;

            .right {
                display: flex;
                gap: 32px;
                align-items: center;

                .draft {
                    border: none;
                    outline: none;
                    background: transparent;
                    color: $active-button-color;
                    padding: 12px 28px;
                    cursor: pointer;
                }
            }

            .next {
                width: 220px;
            }
        }
    }
}
</style>