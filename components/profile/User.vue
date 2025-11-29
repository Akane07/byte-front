<template>
  <div class="wrapper">
    <DevCard v-if="user">
      <div class="main_info">
        <div class="left_part">
          <div class="avatar">
            <UIProfileAvatar :src="makeURL(user?.avatar)"></UIProfileAvatar>
            <p>{{ user.nickname || "без ника" }}</p>
          </div>
          <div class="stats">
            <div class="stat">
              <IconsMap></IconsMap>
              <span>{{ user.country || "страна не указана" }}</span>
            </div>
            <div class="stat">
              <IconsClock></IconsClock>
              <span>На сайте с {{ useUserCreated(user.created_at) }}</span>
            </div>
            <div class="stat">
              <IconsSun></IconsSun>
              <span>В сети</span>
            </div>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="middle_part">
          <p class="name">{{ user.name }}</p>
          <p class="speciality">{{ user.speciality }}</p>
          <span>{{ user.description || "Нет описания" }}</span>
          <div class="skills">
            <UIDevChip v-for="skill in user.skills" :text="skill"></UIDevChip>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="right_part">
          <UIDevButton
            v-if="userStore.user?.id === user.id"
            type="active"
            @click="navigateTo('/profile/my/settings')"
          >
            <IconsSettings></IconsSettings>
            Настройки профиля
          </UIDevButton>
          <UIDevButton
            v-else
            type="active"
            @click="navigateTo(`/chat/${user.id}`)"
          >
            Отправить сообщение
          </UIDevButton>
          <div class="user_stats">
            <div v-if="userStore.user?.id !== user.id" class="average">
              <div class="star">
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
            <div class="stats">
              <div class="stat">
                <span>{{ user.orders_count }}</span>
                <p>Заказов выполнено</p>
              </div>
              <div class="stat">
                <span>70%</span>
                <p>Успешных заказов</p>
              </div>
              <div class="stat">
                <span>{{ user.reviews_count }}</span>
                <p>Получено отзывов</p>
              </div>
            </div>
            <div class="links">
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
        <div class="portfolio_blocks" v-if="portfolios.length">
          <ProfilePortfolio
            v-for="portfolio in portfolios"
            :key="portfolio.id"
            :portfolio="portfolio"
          ></ProfilePortfolio>
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
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  position: relative;
  margin-bottom: 100px;

  .main_info {
    display: flex;
    gap: 24px;
    border-bottom: 1px solid $border-color;

    .bordered {
      width: 1px;
      height: inherit;
      background: $border-color;
    }

    .left_part {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 230px;
      padding-bottom: 18px;

      .avatar {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .stats {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: $text-secondary;
        font-size: 14px;

        .stat {
          display: flex;
          gap: 8px;
          align-items: center;
        }
      }
    }

    .middle_part {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 18px;
      width: 100%;

      .name {
        font-weight: 600;
        color: $active;
        font-size: 24px;
      }

      .speciality {
        font-weight: 500;
        font-size: 22px;
      }

      span {
        margin-top: 12px;
        font-size: 14px;
        color: $text-secondary;
      }

      .skills {
        padding-top: 12px;
        margin-top: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .right_part {
      width: 100%;
      max-width: 230px;
      display: flex;
      flex-direction: column;
      gap: 32px;
      padding-bottom: 18px;
      padding-top: 12px;

      .user_stats {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .average {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;

          .star {
            font-weight: 600;
            display: flex;
            align-items: center;
            font-size: 14px;
            gap: 8px;
          }
        }

        .stats {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .stat {
            display: flex;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;

            span {
              color: $select-enabled;
              font-weight: 500;
            }
          }
        }

        .links {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .link {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            font-size: 14px;
            color: #bebec2;
            cursor: pointer;

            P {
              cursor: pointer;
            }
          }
        }
      }
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

  .portfolio {
    .portfolio_blocks {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }
  }
}
</style>
