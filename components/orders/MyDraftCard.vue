<template>
    <div class="order_card" @click="handleOrderRedirect">
        <div class="order_info">
            <div class="text_info">
                <p>{{ order.title }}</p>
                <span>{{ useSliceDescription(order.description) }}</span>
            </div>
            <div class="tags">
                <span v-for="skill in order.skills" :key="skill">{{ skill }}</span>
            </div>
            <div class="stats_info">
                <UIUserAvatar style="cursor: pointer;" @click="navigateTo(`/profile/${order.user_id}`)"
                    :src="makeURL(userStore.user?.avatar)"></UIUserAvatar>
                    <span class="bordered">От {{ useUserCreated(order.created_at) }}</span>
                <button class="bordered delete" @click.stop="modal = true">Удалить черновик</button>
            </div>
        </div>
        <div class="order_actions">
            <p>{{ useOrderPrice(order.price_type, order.price) }}</p>
            <UIButton style="min-width: 155px; color: $text-secondary; border-color: $text-secondary;">Черновик</UIButton>
        </div>
    </div>

    <UIModal v-if="modal" title="Подтверждение" @close="modal = false">
        <template #body>
            <p class="confirm">Вы уверены, что хотите удалить свой черновик? Отменить это действие будет невозможно.</p>
        </template>
        <template #buttons>
            <UIButton @click.stop="modal = false">Отмена</UIButton>
            <UIButton type="active" @click.stop="handleDelete">Удалить</UIButton>
        </template>
    </UIModal>
</template>

<script setup lang="ts">
import { deleteOrder, type Order } from '~/shared/api/order-api';
import { makeURL } from '~/shared/utils/helpers';
import { useNotifications } from '~/store/notiStore';
import { useUserStore } from '~/store/userStore';

const props = defineProps<{
    order: Order
}>();

const emit = defineEmits<{
    (e: 'updateOrders'): void
}>();

const notifications = useNotifications();
const userStore = useUserStore();

const modal = shallowRef(false);

function handleOrderRedirect() {
    navigateTo(`/orders/${props.order.id}/edit`)
}

async function handleDelete() {
    const res = await deleteOrder(props.order.id);
    modal.value = false;
    
    if (res) {
        emit('updateOrders')
        notifications.setNotification('Черновик успешно удален');
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
            color: $text-secondary;
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
                color: $text-secondary;
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
            gap: 12px;
            align-items: center;
            color: $text-placeholder;
            font-size: 12px;
            cursor: pointer;

            span {
                cursor: pointer;
                padding-right: 12px;
                height: 100%;
                display: flex;
                align-items: center;

                &.bordered {
                    border-right: 1px solid $border-color;
                    padding-right: 12px;
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
                    color: $text-accent;
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
                    color: $white;
                }
            }
        }

        .order_actions {
            p {
                color: $white;
            }
        }
    }
}

.confirm {
    max-width: 400px;
}
</style>