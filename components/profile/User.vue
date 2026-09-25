<template>
  <div class="profile w-full flex justify-center items-center z-100 relative mb-25">
    <DevCard v-if="user">
      <div class="main_info flex gap-6">
        <div class="side flex flex-col gap-4 min-w-[230px] pb-4.5">
          <div class="flex flex-col gap-3">
            <UIProfileAvatar :src="makeURL(user?.avatar)"></UIProfileAvatar>
            <p>{{ user.nickname || "Ник не задан" }}</p>
          </div>
          <div class="stats flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <IconsMap></IconsMap>
              <span>{{ user.country || "страна не указана" }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconsClock></IconsClock>
              <span>На сайте с {{ useUserCreated(user.created_at) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <IconsSun></IconsSun>
              <span>В сети</span>
            </div>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="middle_part flex flex-col gap-3 w-full min-w-0 pb-4.5">
          <p class="name">{{ user.name }}</p>
          <p class="font-medium text-[22px]">{{ user.speciality }}</p>
          <span class="description mt-3">{{
            user.description || "Нет описания"
          }}</span>
          <div class="flex flex-wrap gap-2 pt-3">
            <LazyUIChip v-for="skill in user.skills" :key="skill" :text="skill"></LazyUIChip>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="aside w-full flex flex-col gap-8 pb-4.5 pt-3 max-w-[230px]">
          <UIButton
            v-if="isOwnProfile"
            type="active"
            @click="navigateTo('/profile/my/settings')"
          >
            <!-- <IconsSettings></IconsSettings> -->
            Настройки профиля
          </UIButton>
          <UIButton
            v-else
            type="active"
            @click="navigateTo(`/chat/${user.id}`)"
          >
            Отправить сообщение
          </UIButton>
          <div class="flex flex-col gap-4">
            <div
              v-if="!isOwnProfile"
              class="flex flex-col gap-3 text-sm"
            >
              <div class="flex items-center gap-2 font-medium font-sm">
                <img
                  src="~/assets/images/star.png"
                  alt="star"
                  width="20px"
                  height="20px"
                />
                {{ user.rating }}
              </div>
              <p>Оценка исполнителя</p>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between gap-2">
                <span class="stat">{{ user.orders_count }}</span>
                <p>Опубликовано заказов</p>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="stat">{{ user.reviews_count }}</span>
                <p>Получено отзывов</p>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-if="user.telegram"
                class="link"
                @click="openExternal(user.telegram)"
              >
                <IconsTelegram></IconsTelegram>
                <p>Telegram</p>
              </div>
              <div v-if="user.git" class="link" @click="openExternal(user.git)">
                <IconsGitHub></IconsGitHub>
                <p>Git</p>
              </div>
              <div
                v-if="user.behance"
                class="link"
                @click="openExternal(user.behance)"
              >
                <IconsBehance></IconsBehance>
                <p>Behance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="portfolio">
        <div class="flex flex-wrap gap-4 justify-between items-center">
          <p>Портфолио</p>
          <UIButton
            v-if="isOwnProfile"
            class="add-button"
            @click="navigateTo('/profile/new-project')"
          >
            <IconsPlus
              color="#8355FA"
              style="transform: scale(1.2)"
            ></IconsPlus>
            Добавить проект в портфолио
          </UIButton>
        </div>
        <div class="works flex flex-wrap gap-6" v-if="portfolios.length">
          <ProfilePortfolioBlock
            v-for="portfolio in portfolios"
            :key="portfolio.id"
            :portfolio="portfolio"
          ></ProfilePortfolioBlock>
        </div>
      </div>
      <div class="feedbacks" v-if="feedbacks.length">
        <div class="flex justify-between items-center">
          <p>Отзывы</p>
        </div>
      </div>
    </DevCard>
  </div>
</template>

<script setup lang="ts">
import DevCard from "~/components/UI/Card.vue";
import type { Portfolio } from "~/shared/api/portfolio-api";
import type { User } from "~/shared/api/user-api";
import { makeURL, openExternal } from "~/shared/utils/helpers";
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

/** Профиль пользователя. Без route.params.id — свой профиль. */
const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const user = ref<User | null>(null);
const otherPortfolios = ref<Portfolio[]>([]);
const feedbacks = ref([]);

const profileId = computed(() => route.params.id as string | undefined);
const isOwnProfile = computed(
  () => !!user.value && user.value.id === userStore.user?.id,
);
// Для своего профиля список берётся из стора, чтобы удаление проекта
// сразу отражалось на странице.
const portfolios = computed(() =>
  isOwnProfile.value ? portfolioStore.portfolio : otherPortfolios.value,
);

onMounted(async () => {
  if (!profileId.value || profileId.value === userStore.user?.id) {
    user.value = userStore.user;
    await portfolioStore.getMyPortfolio();
    return;
  }

  const [profile, list] = await Promise.all([
    userStore.getUserId(profileId.value),
    portfolioStore.getPortfoliosById(profileId.value),
  ]);
  user.value = profile;
  otherPortfolios.value = list;
});
</script>

<style lang="scss" scoped>
.profile {
  @include page-gutters;

  :deep(.card) {
    @include mobile {
      padding: 20px 16px;
      gap: 32px;
      margin-top: 16px;
    }
  }
}

.main_info {
  border-bottom: 1px solid $border-color;

  .bordered {
    width: 1px;
    height: inherit;
    background: $border-color;
  }

  .stats, .description {
    color: $text-secondary;
    font-size: 14px;
  }

  .description {
    overflow-wrap: anywhere;
  }

  // Планшет: аватар и описание рядом, кнопки и статистика — строкой ниже.
  @include tablet {
    flex-wrap: wrap;

    & > .bordered:nth-child(4) {
      display: none;
    }

    .middle_part {
      flex: 1;
    }

    .aside {
      max-width: none;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 24px;
      border-top: 1px solid $border-color;
      padding-top: 24px;

      & > :deep(button) {
        align-self: flex-start;
      }
    }
  }

  // Телефон: всё в одну колонку.
  @include mobile {
    flex-direction: column;

    & > .bordered {
      display: none;
    }

    .side {
      min-width: 0;
      padding-bottom: 0;
    }

    .aside {
      flex-direction: column;

      & > :deep(button) {
        align-self: stretch;
      }
    }
  }

  .name {
    font-weight: 600;
    color: $primary;
    font-size: 24px;
  }

  .stat {
    color: $select-enabled;
    font-weight: 500;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    color: #bebec2;
  }
}

.portfolio,
.feedbacks {
  display: flex;
  flex-direction: column;
  gap: 40px;

  p {
    font-weight: 500;
    font-size: 22px;
  }

  .add-button {
    border-color: $select-enabled;
    color: $select-enabled;

    @include mobile {
      width: 100%;
      white-space: normal;
    }
  }
}

// Телефон: проекты портфолио — во всю ширину.
.works {
  @include mobile {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    :deep(.work) {
      width: 100%;
      min-width: 0;
    }
  }
}
</style>
