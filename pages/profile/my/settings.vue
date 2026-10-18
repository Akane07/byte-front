<template>
  <UINavMenu></UINavMenu>
  <UIBackground></UIBackground>
  <div
    class="wrapper w-full min-h-dvh absolute top-0 left-0 flex justify-center pt-[110px] md:pt-[150px] pb-[120px] md:pb-[300px] px-4 md:px-12 xl:px-[150px]"
  >
    <div class="w-full max-w-[1400px]">
      <div class="settings w-full max-w-[500px] flex flex-col gap-12">
        <div class="flex flex-col gap-6">
          <h2 class="font-medium text-[26px] sm:text-[32px]">Настройки</h2>
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
                class="photo_wrapper w-[254px] max-w-full h-[184px] rounded-md flex items-center justify-center cursor-pointer relative"
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
            <UISelect
              :list="cityOptions"
              label="Город"
              :selected="profile.city || NO_CITY"
              @select="profile.city = $event === NO_CITY ? '' : $event"
            />
          </template>
          <!-- Исполнитель: попадает в каталог «Найти исполнителя». -->
          <template v-if="active === 'services'">
            <div class="performer_toggle">
              <UICheckbox v-model="profile.is_performer">Принимаю заказы</UICheckbox>
              <span>
                Профиль появится в каталоге исполнителей: заказчики смогут найти вас по категории
                и городу и предложить заказ.
              </span>
            </div>
            <div class="block">
              <p>Где готовы работать</p>
              <UISegmented v-model="profile.work_format" :options="PERFORMER_FORMATS" />
            </div>
            <div v-if="profile.work_format !== 'remote' && !profile.city" class="warning">
              Укажите город во вкладке «Профиль» — по нему заказчики ищут исполнителей рядом.
            </div>
            <div class="block">
              <p>Категории услуг (до {{ MAX_CATEGORIES }})</p>
              <div class="category_chips">
                <button
                  v-for="category in categoryStore.categoriesFor(chipsFormat)"
                  :key="category.id"
                  type="button"
                  class="category_chip"
                  :class="{ active: profile.categories.includes(category.id) }"
                  @click="toggleCategory(category.id)"
                >
                  {{ category.title }}
                </button>
              </div>
            </div>
            <UIInput
              v-model="priceFrom"
              label="Стоимость услуг от, руб."
              type="text"
              placeholder="Например, 1500 — можно оставить пустым"
              maxlength="9"
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
        <div class="form_buttons flex flex-wrap items-center gap-4 sm:gap-8">
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
import { getCountries, type PerformerFormat } from "~/shared/api/user-api";
import { makeURL } from "~/shared/utils/helpers";
import { rules } from "~/shared/utils/rules";
import { useCategory } from "~/store/categoryStore";
import { useNotifications } from "~/store/notiStore";
import { useUserStore } from "~/store/userStore";

const TABS = [
  { name: "Общие", value: "general" },
  { name: "Профиль", value: "profile" },
  { name: "Услуги", value: "services" },
  { name: "Ссылки", value: "socials" },
];

const NO_CITY = "Не указан";
const MAX_CATEGORIES = 5;
const PERFORMER_FORMATS: { value: PerformerFormat; label: string }[] = [
  { value: "remote", label: "Удалённо" },
  { value: "onsite", label: "На месте" },
  { value: "both", label: "И так, и так" },
];

const userStore = useUserStore();
const categoryStore = useCategory();
const notifications = useNotifications();

const active = ref("general");
const countries = ref<string[]>([]);
const saving = shallowRef(false);

const profile = ref({
  nickname: "",
  name: "",
  speciality: "",
  skills: [] as string[],
  description: "",
  country: "",
  city: "",
  telegram: "",
  behance: "",
  git: "",
  is_performer: false,
  work_format: "remote" as PerformerFormat,
  categories: [] as number[],
});
/** Цена «от» — строкой в поле ввода, числом при сохранении. */
const priceFrom = shallowRef("");

const cityOptions = computed(() => [NO_CITY, ...categoryStore.cities]);
/** Работает «и так, и так» — показываем все категории. */
const chipsFormat = computed(() =>
  profile.value.work_format === "both" ? null : profile.value.work_format,
);

function toggleCategory(id: number) {
  const list = profile.value.categories;
  if (list.includes(id)) {
    profile.value.categories = list.filter((c) => c !== id);
  } else if (list.length < MAX_CATEGORIES) {
    profile.value.categories = [...list, id];
  } else {
    notifications.setNotification(`Можно выбрать до ${MAX_CATEGORIES} категорий`);
  }
}

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

function payload() {
  const digits = priceFrom.value.replace(/\D/g, "");
  // Категории, которые не подходят выбранному формату, не сохраняем.
  const allowed = new Set(categoryStore.categoriesFor(chipsFormat.value).map((c) => c.id));
  return {
    ...profile.value,
    categories: profile.value.categories.filter((id) => allowed.has(id)),
    price_from: digits ? Number(digits) : null,
  };
}

async function saveProfile(update: Parameters<typeof userStore.editMe>[0] = payload()) {
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
    city: user.city ?? "",
    telegram: user.telegram ?? "",
    behance: user.behance ?? "",
    git: user.git ?? "",
    is_performer: !!user.is_performer,
    work_format: user.work_format ?? "remote",
    categories: [...(user.categories ?? [])],
  };
  priceFrom.value = user.price_from ? String(user.price_from) : "";
}

onMounted(async () => {
  fillForm();
  const [list] = await Promise.all([
    getCountries(),
    categoryStore.getAllCategories(),
    categoryStore.loadCities(),
  ]);
  countries.value = list ?? [];
});
</script>

<style lang="scss" scoped>
.wrapper {
  // Тон формы тот же, но полупрозрачный — сквозь него видно фон (UIBackground).
  background: rgba(24, 24, 28, 0.82);

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

        @include small {
          grid-template-columns: 100%;

          p {
            grid-column: auto;
          }
        }
      }
    }
  }
}

// Вкладка «Услуги».
.performer_toggle {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid rgba(131, 85, 250, 0.35);
  border-radius: 12px;
  background: rgba(131, 85, 250, 0.08);

  span {
    font-size: 13px;
    line-height: 1.5;
    color: $text-placeholder;
  }
}

.warning {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(245, 180, 70, 0.12);
  color: #f3c46b;
  font-size: 13px;
}

.category_chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category_chip {
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: transparent;
  color: $text-secondary;
  font-size: 14px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &.active {
    border-color: $primary;
    background: rgba(131, 85, 250, 0.2);
    color: $white;
  }

  @media (hover: hover) {
    &:hover:not(.active) {
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

// Телефон: кнопки «Сохранить» и «Удалить аккаунт» — на всю ширину.
.form_buttons {
  @include small {
    :deep(button) {
      width: 100% !important;
    }
  }
}
</style>
