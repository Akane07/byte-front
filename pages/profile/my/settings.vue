<template>
  <UIDevNavMenu></UIDevNavMenu>
  <div
    class="wrapper w-full min-h-dvh absolute top-0 left-0 flex justify-center pt-[150px] pb-[300px] px-[150px]"
  >
    <div class="w-full max-w-[1400px]">
      <div class="settings w-full max-w-[500px] flex flex-col gap-12">
        <div class="flex flex-col gap-6">
          <h2 class="font-medium text-[32px]">Настройки</h2>
          <UIDevTabs
            v-model:active="active"
            :tabs="[
              { name: 'Общие', value: 'general' },
              { name: 'Профиль', value: 'profile' },
              { name: 'Ссылки', value: 'socials' },
            ]"
          />
        </div>
        <div class="flex flex-col gap-6">
          <template v-if="active === 'general'">
            <UIDevInput
              v-model="general.nickname"
              label="Логин"
              type="text"
              placeholder="Отображаемый ник"
              :rules="rules.notEmpty"
            ></UIDevInput>
            <UIDevInput
              v-model="general.email"
              label="Почта"
              type="text"
              placeholder="Почта, привязанная к аккануту"
              disabled
            ></UIDevInput>
            <div class="block pass">
              <p>Пароль</p>
              <UIDevInput
                v-model="pass.password"
                type="password"
                placeholder="Новый пароль"
                :rules="rules.notEmpty"
              ></UIDevInput>
              <UIDevInput
                v-model="pass.newPassword"
                type="password"
                placeholder="Новый пароль ещё раз"
                :rules="rules.notEmpty"
              >
              </UIDevInput>
            </div>
          </template>
          <template v-if="active === 'profile'">
            <UIDevInput
              v-model="profile.name"
              label="Имя"
              type="text"
              placeholder="Ваше имя"
              :rules="rules.notEmpty"
            ></UIDevInput>
            <div class="block">
              <p>Аватар</p>
              <div
                class="photo_wrapper w-[254px] h-[184px] rounded-md flex items-center justify-center cursor-pointer relative"
              >
                <img
                  v-if="userStore.user?.avatar"
                  :src="makeURL(userStore.user.avatar)"
                  class="rounded-md w-full h-full object-cover"
                  alt="avatar"
                />
                <p v-else>Нажмите, чтобы загрузить фото</p>
                <input
                  class="absolute w-full h-full opacity-0 cursor-pointer"
                  type="file"
                  accept="image/*"
                  @change="uploadPhoto($event.target.files[0])"
                />
              </div>
            </div>
            <UIDevInput
              v-model="profile.speciality"
              label="Ваша специальность"
              type="text"
              placeholder="Вы по специальности"
              maxlength="40"
            >
            </UIDevInput>
            <UIDevTextarea
              v-model="profile.description"
              label="Описание профиля"
              maxlength="1000"
              placeholder="Написание привлекательного описания может повысить шансы найти заказ"
            >
            </UIDevTextarea>
            <div class="block">
              <p>Навыки (до 10)</p>
              <ProfileSkills
                :skills="profile.skills"
                @save="saveUser"
                @delete="deleteSkill"
              ></ProfileSkills>
            </div>
            <UIDevSelect
              :list="countries"
              label="Страна"
              :selected="profile.country"
              @select="handleSelect"
            ></UIDevSelect>
          </template>
          <template v-if="active === 'socials'">
            <UIDevInput
              v-model="profile.telegram"
              label="Telegram"
              type="text"
              placeholder="Вставьте полную ссылку на ваш Telegram"
            ></UIDevInput>
            <UIDevInput
              v-model="profile.behance"
              label="Behance"
              type="text"
              placeholder="Вставьте полную ссылку на ваш Behance"
            ></UIDevInput>
            <UIDevInput
              v-model="profile.git"
              label="Github/Gitlab"
              type="text"
              placeholder="Вставьте полную ссылку на ваш Github/Gitlab"
            ></UIDevInput>
          </template>
        </div>
        <div class="flex items-center gap-8">
          <UIDevButton
            type="active"
            @click="saveUser"
            :disabled="!(validProfile && validPass)"
            style="width: 200px"
            >Сохранить</UIDevButton
          >
          <UIDevButton type="cancel" style="width: 200px"
            >Удалить акканут</UIDevButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCountries, setAvatar } from "~/shared/api/user-api";
import { makeURL } from "~/shared/utils/helpers";
import { rules } from "~/shared/utils/rules";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

definePageMeta({
  middleware: ["auth"],
});

const userStore = useUserStore();
const notiStore = useNotifications();

const active = ref("general");
const countries = ref<string[]>([]);
const photo = ref<File | null>(null);

const general = ref<any>({
  nickname: "",
  phone: "",
  email: "",
});

const profile = ref<any>({
  name: "",
  speciality: "",
  skills: [],
  description: "",
  country: "",
  telegram: "",
  behance: "",
  git: "",
});

const pass = ref({
  password: "",
  newPassword: "",
});

const validProfile = computed(() => {
  return profile.value.name && general.value.nickname && general.value.email;
});

const validPass = computed(() => {
  return pass.value.password === pass.value.newPassword;
});

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
    ...profile.value,
  };
  delete updateData.email;

  let skillsArray =
    typeof skills === "object" && skills.length > 0 ? skills : [];
  skillsArray = skillsArray.length
    ? skillsArray
    : updateData.skills.length
    ? updateData.skills
    : userStore.user.skills;

  if (pass.value.password === pass.value.newPassword && pass.value.password) {
    await userStore.newPassword(pass.value.password, pass.value.newPassword);
  } else if (
    pass.value.password !== pass.value.newPassword &&
    pass.value.password
  ) {
    await notiStore.setNotification("Пароли не совпадают");
  }

  await userStore.editMe({
    ...updateData,
    skills: skillsArray,
  });

  setProfile();

  await notiStore.setNotification("Изменения сохранены");
}

async function uploadPhoto(img: File) {
  if (!userStore.user) return;
  photo.value = img;

  if (photo.value) {
    const form = new FormData();
    form.append("avatar", img);
    try {
      const res = await setAvatar(form);

      userStore.user.avatar = res.avatarUrl;
    } catch (error) {
      // photoError.value = true;
    }
  }
}

function setProfile() {
  if (!userStore.user?.id) return;

  general.value = {
    nickname: userStore.user.nickname || "",
    phone: userStore.user.phone || "",
    email: userStore.user.email || "",
  };

  profile.value = {
    name: userStore.user.name || "",
    speciality: userStore.user.speciality || "",
    skills: [...userStore.user.skills],
    description: userStore.user.description || "",
    country: userStore.user.country || null,
    telegram: userStore.user.telegram || "",
    behance: userStore.user.behance || "",
    git: userStore.user.git || "",
  };
}

onMounted(async () => {
  await userStore.checkAuth();

  setProfile();

  countries.value = await getCountries();
});
</script>

<style lang="scss" scoped>
.wrapper {
  background: $input-auth;

  .settings {
    color: $text-main;

    .block {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .photo_wrapper {
        border: 2px solid $select-enabled;
        background: $tag-color;
        font-size: 14px;
        color: $text-placeholder;
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
}
</style>
