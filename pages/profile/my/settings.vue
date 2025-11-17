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
                        <p class="page" :class="{ 'active': active === 'socials' }" @click="active = 'socials'">Ссылки
                        </p>
                    </div>
                </div>
                <div v-if="active === 'general'" class="settings_form">
                    <div class="block">
                        <p>Логин</p>
                        <UIDevInput v-model="general.nickname" type="text" placeholder="Отображаемый ник"></UIDevInput>
                    </div>
                    <!-- <div class="block">
                        <p>Телефон</p>
                        <UIDevInput v-model="general.phone" type="text" placeholder="Номер телефона" maxlength="14">
                        </UIDevInput>
                    </div> -->
                    <div class="block">
                        <p>Почта</p>
                        <UIDevInput v-model="general.email" type="text" placeholder="Почта, привязанная к аккануту"
                            disabled></UIDevInput>
                    </div>
                    <div class="block pass">
                        <p>Пароль</p>
                        <UIDevInput v-model="pass.password" type="password" placeholder="Новый пароль"></UIDevInput>
                        <UIDevInput v-model="pass.newPassword" type="password" placeholder="Новый пароль ещё раз">
                        </UIDevInput>
                    </div>
                </div>
                <div v-if="active === 'profile'" class="settings_form">
                    <div class="block">
                        <p>Имя</p>
                        <UIDevInput v-model="profile.name" type="text" placeholder="Ваше имя"></UIDevInput>
                    </div>
                    <div class="block">
                        <p>Аватар</p>
                        <div class="photo_wrapper">
                            <img v-if="userStore.user?.avatar" :src="baseURL + userStore.user.avatar" alt="avatar">
                            <p v-else>Нажмите, чтобы загрузить фото</p>
                            <input style="cursor: pointer;" type="file" accept="image/*"
                                @change="uploadPhoto($event.target.files[0])">
                        </div>
                    </div>
                    <div class="block">
                        <p>Ваша специальность</p>
                        <UIDevInput v-model="profile.speciality" type="text" placeholder="Вы по специальности"
                            maxlength="40">
                        </UIDevInput>
                    </div>
                    <div class="block">
                        <p>Описание профиля</p>
                        <UIDevTextarea v-model="profile.description" maxlength="1000"
                            placeholder="Написание привлекательного описания может повысить шансы найти заказ">
                        </UIDevTextarea>
                    </div>
                    <div class="block">
                        <p>Навыки</p>
                        <ProfileSkills :skills="profile.skills" @save="saveUser" @delete="deleteSkill"></ProfileSkills>
                    </div>
                    <div class="block">
                        <p>Страна</p>
                        <UIDevSelect :list="countries" :selected="profile.country" @select="handleSelect"></UIDevSelect>
                    </div>
                </div>
                <div v-if="active === 'socials'" class="settings_form">
                    <div class="block">
                        <p>Telegram</p>
                        <UIDevInput v-model="profile.telegram" type="text" placeholder="Вставьте полную ссылку на ваш Telegram"></UIDevInput>
                    </div>
                    <div class="block">
                        <p>Behance</p>
                        <UIDevInput v-model="profile.behance" type="text" placeholder="Вставьте полную ссылку на ваш Behance"></UIDevInput>
                    </div>
                    <div class="block">
                        <p>Github/Gitlab</p>
                        <UIDevInput v-model="profile.git" type="text" placeholder="Вставьте полную ссылку на ваш Github/Gitlab"></UIDevInput>
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
import { baseURL } from '~/api';
import { getCountries, setAvatar } from '~/api/user-api';
import { useNotifications } from '~/store/notiStore';
import { useUserStore } from '~/store/userStore';

definePageMeta({
    middleware: ['auth'],
});

const userStore = useUserStore();
const notiStore = useNotifications();

const active = ref('general');
const countries = ref<string[]>([]);

const general = ref<any>({
    nickname: '',
    phone: '',
    email: '',
});

const profile = ref<any>({
    name: '',
    speciality: '',
    skills: [],
    description: '',
    country: '',
    telegram: '',
    behance: '',
    git: '',
});

const pass = ref({
    password: '',
    newPassword: ''
});

const photo = ref<File | null>(null);

function handleSelect(el: string) {
    profile.value.country = el;
}

async function deleteSkill(index: number) {
    profile.value.skills.splice(index, 1);
    await saveUser(profile.value.skills);
}

async function saveUser(skills?: string[]) {
    if (!userStore.user) return;

        const updateData = {
        ...general.value,
        ...profile.value
    };
    delete updateData.email;

    let skillsArray = (typeof skills === "object" && skills.length > 0) ? skills : [];
    skillsArray = (skillsArray.length ? skillsArray : (updateData.skills.length ? updateData.skills : userStore.user.skills))

    await userStore.editMe({
        ...updateData,
        skills: skillsArray,
    });

    if ((pass.value.password === pass.value.newPassword) && pass.value.password) {
        await userStore.newPassword(pass.value.password, pass.value.newPassword)
    }

    general.value = {
        nickname: userStore.user.nickname || '',
        phone: userStore.user.phone || '',
        email: userStore.user.email || '',
    };

    profile.value = {
        name: userStore.user.name || '',
        speciality: userStore.user.speciality || '',
        skills: [...userStore.user.skills],
        description: userStore.user.description || '',
        country: userStore.user.country || null,
        telegram: userStore.user.telegram || '',
        behance: userStore.user.behance || '',
        git: userStore.user.git || ''
    }

    await notiStore.setNotification('Изменения сохранены');
}

async function uploadPhoto(img: File) {
    if (!userStore.user) return;
    photo.value = img;

    if (photo.value) {
        const form = new FormData();
        form.append('avatar', img);
        try {
            const res = await setAvatar(form);

            userStore.user.avatar = res.avatarUrl;
        } catch (error) {
            // photoError.value = true;
        }
    }
}

onMounted(async () => {
    await userStore.checkAuth();
    if (!userStore.user?.id) return;

    general.value = {
        nickname: userStore.user.nickname || '',
        phone: userStore.user.phone || '',
        email: userStore.user.email || '',
    };

    profile.value = {
        name: userStore.user.name || '',
        speciality: userStore.user.speciality || '',
        skills: [...userStore.user.skills],
        description: userStore.user.description || '',
        country: userStore.user.country || null,
        telegram: userStore.user.telegram || '',
        behance: userStore.user.behance || '',
        git: userStore.user.git || ''
    }

    countries.value = await getCountries();
})
</script>

<style lang="scss" scoped>


.wrapper {
    width: 100%;
    min-height: 100dvh;
    background: $input-auth;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    padding: 150px 150px 300px 150px;

    .settings_wrapper {
        max-width: 1400px;
        width: 100%;

        .settings {
            width: 100%;
            max-width: 500px;
            color: $text-main;
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
                        color: $text-link;
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

                    &>p {
                        color: white;
                    }

                    .photo_wrapper {
                        width: 254px;
                        height: 184px;
                        border-radius: 6px;
                        border: 2px solid $select-enabled;
                        background: $tag-color;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        color: $text-placeholder;
                        cursor: pointer;
                        position: relative;

                        img {
                            border-radius: 5px;
                            object-fit: cover;
                            width: 100%;
                            height: 100%;
                        }

                        input {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            opacity: 0;
                        }
                    }

                    &.pass {
                        display: grid;
                        grid-template-columns: calc(50% - 6px) calc(50% - 6px);

                        p {
                            grid-column: 1 / span 2;
                        }
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