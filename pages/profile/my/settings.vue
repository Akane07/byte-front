<template>
    <UIDevNavMenu></UIDevNavMenu>
    <div class="wrapper">
        <div class="settings_wrapper">
            <div class="settings">
                <div class="header">
                    <h2>Настройки</h2>
                    <div class="pages">
                        <p class="page" :class="{ 'active': active === 'general' }" @click="active = 'general'">Общие
                        </p>
                        <p class="page" :class="{ 'active': active === 'profile' }" @click="active = 'profile'">Профиль
                        </p>
                    </div>
                </div>
                <div class="settings_form">
                    <div class="block">
                        <p>Логин</p>
                        <UIDevInput v-model="general.nickname" type="text" placeholder="Отображаемый ник"></UIDevInput>
                    </div>
                    <div class="block">
                        <p>Телефон</p>
                        <UIDevInput v-model="general.phone" type="text" placeholder="Номер телефона"></UIDevInput>
                    </div>
                    <div class="block">
                        <p>Почта</p>
                        <UIDevInput v-model="general.email" type="text" placeholder="Почта, привязанная к аккануту" disabled></UIDevInput>
                    </div>
                </div>
                <div class="buttons">
                    <UIDevButton :active="true" @click="saveUser" style="width: 200px;">Сохранить</UIDevButton>
                    <button class="delete">Удалить акканут</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/store/userStore';

const userStore = useUserStore();

const active = ref('general');

const general = ref<any>({
    nickname: '',
    phone: '',
    email: '',
});

const profile = ref({
    name: '',
    speciality: [],
});

async function saveUser() {
    const updateData = {
        ...general.value,
        ...profile.value
    };
    delete updateData.email;

    await userStore.editMe(updateData);
}

onMounted(async () => {
    await userStore.checkAuth();
    if (!userStore.user?.id) return;

    general.value = {
        nickname: userStore.user.nickname,
        phone: userStore.user.phone,
        email: userStore.user.email
    };
})
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/vars.scss';

.wrapper {
    width: 100%;
    height: 100dvh;
    background: $input-auth;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    padding: 150px;

    .settings_wrapper {
        max-width: 1400px;
        width: 100%;

        .settings {
            width: 100%;
            max-width: 400px;
            color: $text-color-main;
            display: flex;
            flex-direction: column;
            gap: 48px;

            .header {
                display: flex;
                flex-direction: column;
                gap: 24px;

                h2 {
                    font-weight: 500;
                    font-size: 32px;
                }

                .pages {
                    display: flex;
                    gap: 32px;

                    .page {
                        color: $text-link-color;
                        font-weight: 600;
                        transition: color 0.2s ease-in;
                        cursor: pointer;

                        &:hover {
                            color: $select-enabled;
                        }

                        &.active {
                            color: $select-enabled;
                            border-bottom: 1px solid $select-enabled;
                        }
                    }
                }
            }

            .settings_form {
                display: flex;
                flex-direction: column;
                gap: 24px;

                .block {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    p {
                        color: white;
                    }
                }
            }

            .buttons {
                display: flex;
                align-content: center;
                gap: 32px;

                .delete {
                    border: none;
                    outline: none;
                    background: transparent;
                    color: $text-red;
                    padding: 0 32px;
                    cursor: pointer;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>