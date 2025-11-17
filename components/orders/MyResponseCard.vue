<template>
    <div class="order_card" @click="handleOrderRedirect" :class="{ 'viewed': !response.viewed }">
        <div class="order_info">
            <div class="text_info">
                <p>{{ response.title }}</p>
                <span>{{ useSliceDescription(response.description) }}</span>
            </div>
            <div class="stats_info">
                <!-- <UIUserAvatar style="cursor: pointer;" @click="navigateTo(`/profile/${order.user_id}`)" :src="baseURL + userStore.user?.avatar"></UIUserAvatar> -->
                <span class="border">Отклик от {{ useUserCreated(response.created_at) }}</span>
                <button class="border edit" @click="navigateTo(`/orders/${response.order_id}?edit=true`)">Редактировать</button>
                <button class="border delete" @click.stop="modal = true">Удалить отклик</button>
            </div>
        </div>
        <div class="order_actions">
            <p>{{ useOrderPrice(response.price_type, response.price) }}</p>
            <UIDevButton v-if="response.viewed" :active="true" @click.stop="">Просмотрено</UIDevButton>
            <UIDevButton v-if="!response.viewed" :active="false" @click.stop="">Не просмотрено</UIDevButton>
        </div>
    </div>

    <UIDevModal v-if="modal" title="Подтверждение" @close="modal = false">
        <template #body>
            <p class="confirm">Вы уверены, что хотите удалить свой отклик? Отменить это действие будет невозможно.</p>
        </template>
        <template #buttons>
            <UIDevButton :active="false" @click.stop="modal = false">Отмена</UIDevButton>
            <UIDevButton :active="true" @click.stop="handleDelete">Удалить</UIDevButton>
        </template>
    </UIDevModal>
</template>

<script setup lang="ts">
import { deleteResponse, type OrderResponse } from '~/api/order-api';
import { useNotifications } from '~/store/notiStore';

const props = defineProps<{
    response: OrderResponse
}>();

const emit = defineEmits<{
    (e: 'updateResponses') : void
}>();

const notifications = useNotifications();

const modal = shallowRef(false);

function handleOrderRedirect() {
    navigateTo(`/orders/${props.response.order_id}`);
}

async function handleDelete() {
    const res = await deleteResponse(props.response.id, props.response.order_id);

    if (res) {
        emit('updateResponses')
        notifications.setNotification('Отклик успешно удален');
    }
}
</script>

<style lang="scss" scoped>


.order_card {
    width: 100%;
    padding: 16px 40px 16px 16px;
    border-radius: 8px;
    background: $bg-secondary;
    box-shadow: 1px 1px 0px 0px #00000029;;
    display: flex;
    gap: 20px;
    cursor: pointer;

    .order_actions {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 16px;
        border-left: 1px solid $border-color;
        padding-left: 40px;
        cursor: pointer;
        min-width: 200px;

        p {
            font-weight: 600;
            color: $active;
            transition: color 0.3s ease-in-out;
            text-align: center;
        }
    }

    .order_info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        cursor: pointer;

        .text_info {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid $border-color;
            cursor: pointer;

            p {
                color: $select-enabled;
                font-weight: 600;
                font-size: 18px;
                transition: color 0.3s ease-in-out;
                cursor: pointer;
            }

            span {
                color: $text-main;
                font-weight: 500;
                font-size: 14px;
                cursor: pointer;
            }
        }

        .stats_info {
            display: flex;
            gap: 16px;
            align-items: center;
            color: $text-placeholder;
            font-size: 12px;
            cursor: pointer;

            span {
                cursor: pointer;
                height: 100%;
                display: flex;
                align-items: center;

                &.border {
                    border-right: 1px solid $border-color;
                    padding-right: 32px;
                }
            }

            button {
                background: transparent;
                border: none;
                outline: none;
                border-right: 1px solid $border-color;
                padding: 6px 16px 6px 0;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;

                &.edit {
                    color: #DD6B20;
                }

                &.delete {
                    color: $text-red;
                    border: none;
                }
            }
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 8px 0;

            span {
                background: $tag-secondary-color;
                color: $text-secondary;
                padding: 6px 14px;
                border-radius: 6px;
                font-size: 14px;
            }
        }
    }

    &:hover {
        .order_info {
            .text_info {
                p {
                    color: white;
                }

                span {}
            }

            .stats_info {
                span.border {}
            }
        }

        .order_actions {
            p {
                color: white;
            }
        }
    }

    &.viewed {
        .order_info {
            .text_info {
                p {
                    color: white;
                }

                span {}
            }

            .stats_info {
                span.border {}
            }
        }

        .order_actions {

            p {
                color: white;
            }
        }
    }
}

.confirm {
    max-width: 400px;
}
</style>