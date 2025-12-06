<template>
  <div class="w-full flex justify-center items-center z-100 relative mb-25">
    <DevCard v-if="user">
      <div class="main_info flex gap-6">
        <div class="flex flex-col gap-4 min-w-[230px] pb-4.5">
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
        <div class="middle_part flex flex-col gap-3 w-full pb-4.5">
          <p class="name">{{ user.name }}</p>
          <p class="font-medium text-[22px]">{{ user.speciality }}</p>
          <span class="description mt-3">{{
            user.description || "Нет описания"
          }}</span>
          <div class="flex flex-wrap gap-2 pt-3">
            <UIDevChip v-for="skill in user.skills" :text="skill"></UIDevChip>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="w-full flex flex-col gap-8 pb-4.5 pt-3 max-w-[230px]">
          <UIDevButton
            v-if="userStore.user?.id === user.id"
            type="active"
            @click="navigateTo('/profile/my/settings')"
          >
            <!-- <IconsSettings></IconsSettings> -->
            Настройки профиля
          </UIDevButton>
          <UIDevButton
            v-else
            type="active"
            @click="navigateTo(`/chat/${user.id}`)"
          >
            Отправить сообщение
          </UIDevButton>
          <div class="flex flex-col gap-4">
            <div
              v-if="userStore.user?.id !== user.id"
              class="flex flex-col gap-3 text-sm"
            >
              <div class="flex items-center gap-2 font-medium font-sm">
                <img
                  src="../../../assets/images/star.png"
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
                <p>Заказов выполнено</p>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="stat">70%</span>
                <p>Успешных заказов</p>
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
                @click="openLink(user.telegram)"
              >
                <IconsTelegram></IconsTelegram>
                <p>Telegram</p>
              </div>
              <div v-if="user.git" class="link" @click="openLink(user.git)">
                <IconsGitHub></IconsGitHub>
                <p>Git</p>
              </div>
              <div
                v-if="user.behance"
                class="link"
                @click="openLink(user.behance)"
              >
                <IconsBehance></IconsBehance>
                <p>Behance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="portfolio">
        <div class="flex justify-between items-center">
          <p>Портфолио</p>
          <UIDevButton
            v-if="userStore.user.id === user?.id"
            class="add-button"
            @click="navigateTo('/profile/new-project')"
          >
            <IconsPlus
              color="#8355FA"
              style="transform: scale(1.2)"
            ></IconsPlus>
            Добавить проект в портфолио
          </UIDevButton>
        </div>
        <div class="flex flex-wrap gap-6" v-if="portfolios.length">
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
import DevCard from "~/components/UI/DevCard.vue";
import type { Portfolio } from "~/shared/api/portfolio-api";
import type { User } from "~/shared/api/user-api";
import { makeURL } from "~/shared/utils/helpers";
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

const portfolios = ref<Portfolio[]>([]);
const feedbacks = ref([]);
const user = ref<User | null>(null);

const id = route.params.id as string;
if (id) {
  user.value = await userStore.getUserId(id);
  portfolios.value = await portfolioStore.getPortfoliosById(id);
}

function openLink(link: string) {
  if (link.startsWith("http")) {
    window.open(link, "_blank");
  } else {
    window.open(`https://${link}`, "_blank");
  }
}

onMounted(async () => {
  await userStore.checkAuth();
  await portfolioStore.getMyPortfolio();

  if (!id) {
    user.value = userStore.user;
    portfolios.value = portfolioStore.portfolio;
  }
});
</script>

<style lang="scss" scoped>
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
  }
}
</style>
