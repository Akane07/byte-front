<template>
  <UINavMenu></UINavMenu>
  <div
    class="wrapper w-full min-h-dvh absolute top-0 left-0 flex justify-center pt-[150px] pb-[300px] px-[150px]"
  >
    <div class="w-full max-w-[1400px]">
      <div class="settings w-full max-w-[500px] flex flex-col gap-12">
        <div class="flex flex-col gap-6">
          <h2 class="font-medium text-[32px]">Настройки</h2>
          <UITabs v-model:active="active" :tabs="TABS" />
        </div>
        <div class="flex flex-col gap-6">
          <template v-if="active === 'general'">
            <UIInput
              v-model="profile.nickname"
              label="Ник"
              type="text"
              placeholder="Отображаемый ник"
              maxlength="40"
              :rules="rules.notEmpty"
            />
            <UIInput
              :model-value="userStore.user?.email ?? ''"
              label="Почта"
              type="email"
              placeholder="Почта, привязанная к аккаунту"
              disabled
            />
            <div class="block pass">
              <p>Смена пароля</p>
              <UIInput v-model="pass.current" type="password" placeholder="Текущий пароль" />
              <UIInput v-model="pass.next" type="password" placeholder="Новый пароль" />
              <UIInput v-model="pass.repeat" type="password" placeholder="Новый пароль ещё раз" />
            </div>
          </template>
          <template v-if="active === 'profile'">
            <UIInput
              v-model="profile.name"
              label="Имя"
              type="text"
              placeholder="Ваше имя"
              maxlength="100"
              :rules="rules.notEmpty"
            />
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
                  accept="image/jpeg,image/png,image/webp"
                  @change="uploadPhoto"
                />
              </div>
            </div>
            <UIInput
              v-model="profile.speciality"
              label="Ваша специальность"
              type="text"
              placeholder="Например, Vue-разработчик"
              maxlength="40"
            />
            <UITextarea
              v-model="profile.description"
              label="Описание профиля"
              maxlength="1000"
              placeholder="Написание привлекательного описания может повысить шансы найти заказ"
            />
            <div class="block">
              <p>Навыки (до 10)</p>
              <ProfileSkills :skills="profile.skills" @save="saveSkills" @delete="deleteSkill" />
            </div>
            <UISelect
              :list="countries"
              label="Страна"
              :selected="profile.country"
              @select="profile.country = $event"
            />
          </template>
          <template v-if="active === 'socials'">
            <UIInput
              v-model="profile.telegram"
              label="Telegram"
              type="text"
              maxlength="200"
              placeholder="Вставьте полную ссылку на ваш Telegram"
            />
            <UIInput
              v-model="profile.behance"
              label="Behance"
              type="text"
              maxlength="200"
              placeholder="Вставьте полную ссылку на ваш Behance"
            />
            <UIInput
              v-model="profile.git"
              label="Github/Gitlab"
              type="text"
              maxlength="200"
              placeholder="Вставьте полную ссылку на ваш Github/Gitlab"
            />
          </template>
        </div>
        <div class="flex items-center gap-8">
          <UIButton
            type="active"
            :disabled="!canSave || saving"
            style="width: 200px"
            @click="saveAll"
            >Сохранить</UIButton
          >
          <UIButton type="cancel" variant="outline" style="width: 200px" @click="deleteAccount"
            >Удалить аккаунт</UIButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCountries, type UserUpdate } from "~/shared/api/user-api";
import { makeURL } from "~/shared/utils/helpers";
import { rules } from "~/shared/utils/rules";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

const TABS = [
  { name: "Общие", value: "general" },
  { name: "Профиль", value: "profile" },
  { name: "Ссылки", value: "socials" },
];

const userStore = useUserStore();
const notifications = useNotifications();

const active = ref("general");
const countries = ref<string[]>([]);
const saving = shallowRef(false);

const profile = ref<Required<Omit<UserUpdate, "phone">>>({
  nickname: "",
  name: "",
  speciality: "",
  skills: [],
  description: "",
  country: "",
  telegram: "",
  behance: "",
  git: "",
});

/**
 * Раньше было два поля «Новый пароль», а бэкенд трактовал первое как
 * текущий пароль. Смена пароля не работала, а её ошибка срывала
 * сохранение всего профиля.
 */
const pass = ref({ current: "", next: "", repeat: "" });
const wantsPasswordChange = computed(() => !!(pass.value.current || pass.value.next || pass.value.repeat));

const canSave = computed(() => !!profile.value.name.trim() && !!profile.value.nickname.trim());

async function changePassword(): Promise<boolean> {
  const { current, next, repeat } = pass.value;
  if (!current || !next) {
    notifications.setNotification("Для смены пароля введите текущий и новый пароль");
    return false;
  }
  if (next !== repeat) {
    notifications.setNotification("Новые пароли не совпадают");
    return false;
  }
  const ok = await userStore.changePassword(current, next);
  if (ok) pass.value = { current: "", next: "", repeat: "" };
  return ok;
}

async function saveProfile(update: UserUpdate = profile.value) {
  const ok = await userStore.editMe(update);
  if (ok) fillForm();
  return ok;
}

async function saveAll() {
  // Флаг запоминаем до сохранения: после смены пароля поля очищаются.
  const changingPassword = wantsPasswordChange.value;

  saving.value = true;
  const passwordOk = changingPassword ? await changePassword() : true;
  const profileOk = await saveProfile();
  saving.value = false;

  if (profileOk && passwordOk) {
    notifications.setNotification(
      changingPassword ? "Пароль и профиль сохранены" : "Изменения сохранены",
    );
  }
}

/** Навыки сохраняются сразу — модалка навыков не зависит от кнопки «Сохранить». */
async function saveSkills(skills: string[]) {
  profile.value.skills = skills;
  if (await saveProfile({ skills })) {
    notifications.setNotification("Навыки сохранены");
  }
}

async function deleteSkill(index: number) {
  const skills = profile.value.skills.filter((_, i) => i !== index);
  profile.value.skills = skills;
  await saveProfile({ skills });
}

async function uploadPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file && (await userStore.setAvatar(file))) {
    notifications.setNotification("Аватар обновлён");
  }
}

function deleteAccount() {
  notifications.setNotification("Удаление аккаунта пока недоступно. Обратитесь в поддержку");
}

function fillForm() {
  const user = userStore.user;
  if (!user) return;
  profile.value = {
    nickname: user.nickname ?? "",
    name: user.name ?? "",
    speciality: user.speciality ?? "",
    skills: [...(user.skills ?? [])],
    description: user.description ?? "",
    country: user.country ?? "",
    telegram: user.telegram ?? "",
    behance: user.behance ?? "",
    git: user.git ?? "",
  };
}

onMounted(async () => {
  fillForm();
  countries.value = (await getCountries()) ?? [];
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
