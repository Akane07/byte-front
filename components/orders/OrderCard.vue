<template>
    <div class="order_card">
        <div class="order_info">
            <div class="text_info">
                <p>Дизайн/ верстка сайта (адаптация универсального решения)</p>
                <span>Разрабатываем сайт города. Есть универсальное решение https://gos.redsign.ru/
                    (https://redsign.ru/templates/corporate/redsign.government/) , которое нам полностью подходит по
                    структуре и функционалу. Но смотрится слишком просто. Требуется сделать его более стильным,
                    статусным, современным.</span>
            </div>
            <div class="stats_info">
                <UIUserAvatar></UIUserAvatar>
                <span class="border">Опубликовано 2 часа назад</span>
                <span>Предложений 32</span>
            </div>
        </div>
        <div class="order_actions">
            <p>Договорная</p>
            <UIDevButton :active="true">Откликнуться</UIDevButton>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';

.order_card {
    width: 100%;
    padding: 16px 40px 16px 16px;
    border-radius: 20px;
    background: $second-color;
    box-shadow: 1px 1px 0px 0px #00000029;
    display: flex;
    gap: 20px;

    .order_actions {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 16px;
        border-left: 1px solid $border-color;
        padding-left: 40px;

        p {
            font-weight: 600;
            color: $active-button-color;
        }
    }

    .order_info {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .text_info {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid $border-color;

            p {
                color: $select-enabled;
                font-weight: 600;
                font-size: 18px;
            }

            span {
                color: $text-color-main;
                font-weight: 500;
                font-size: 14px;
            }
        }

        .stats_info {
            display: flex;
            gap: 12px;
            align-items: center;
            color: $secondary-button-color;
            font-size: 14px;

            span.border {
                border-right: 1px solid $border-color;
                padding-right: 12px;
            }
        }
    }
}
</style>