<template>
  <UIDevNavMenu></UIDevNavMenu>
  <UIBackground></UIBackground>

  <div class="wrapper">
    <DevCard v-if="userStore.user">
      <div class="main_info">
        <div class="left_part">
          <div class="avatar">
            <UIProfileAvatar
              :src="baseURL + userStore.user?.avatar"
            ></UIProfileAvatar>
            <p>{{ userStore.user.nickname || "без ника" }}</p>
          </div>
          <div class="stats">
            <div class="stat">
              <IconsMap></IconsMap>
              <span>{{ userStore.user.country || "страна не указана" }}</span>
            </div>
            <div class="stat">
              <IconsClock></IconsClock>
              <span
                >На сайте с
                {{ useUserCreated(userStore.user.created_at) }}</span
              >
            </div>
            <div class="stat">
              <IconsSun></IconsSun>
              <span>В сети</span>
            </div>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="middle_part">
          <p class="name">{{ userStore.user.name }}</p>
          <p class="speciality">{{ userStore.user.speciality }}</p>
          <span>{{ userStore.user.description || "Нет описания" }}</span>
          <div class="skills">
            <div
              class="skill"
              v-for="skill in userStore.user.skills"
              :key="skill"
            >
              {{ skill }}
            </div>
          </div>
        </div>
        <div class="bordered"></div>
        <div class="right_part">
          <UIDevButton type="active" @click="navigateTo('/profile/my/settings')">
            <IconsSettings></IconsSettings>
            Настройки профиля
          </UIDevButton>
          <div class="user_stats">
            <div class="average">
              <div class="star">
                <img
                  src="../../../assets/images/star.png"
                  alt="star"
                  width="20px"
                  height="20px"
                />
                {{ userStore.user.rating }}
              </div>
              <p>Оценка исполнителя</p>
            </div>
            <div class="stats">
              <div class="stat">
                <span>{{ userStore.user.orders_count }}</span>
                <p>Заказов выполнено</p>
              </div>
              <div class="stat">
                <span>70%</span>
                <p>Успешных заказов</p>
              </div>
              <div class="stat">
                <span>{{ userStore.user.reviews_count }}</span>
                <p>Получено отзывов</p>
              </div>
            </div>
            <div class="links">
              <div
                v-if="userStore.user.telegram"
                class="link"
                @click="openLink(userStore.user.telegram)"
              >
                <IconsTelegram></IconsTelegram>
                <p>Telegram</p>
              </div>
              <div
                v-if="userStore.user.git"
                class="link"
                @click="openLink(userStore.user.git)"
              >
                <IconsGitHub></IconsGitHub>
                <p>Git</p>
              </div>
              <div
                v-if="userStore.user.behance"
                class="link"
                @click="openLink(userStore.user.behance)"
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
        <div class="portfolio_blocks" v-if="portfolioStore.portfolio.length">
          <ProfilePortfolio
            v-for="portfolio in portfolioStore.portfolio"
            :key="portfolio.id"
            :portfolio="portfolio"
          ></ProfilePortfolio>
        </div>
      </div>
      <div class="feedbacks">
        <div class="flex justify-between items-center">
          <p>Отзывы</p>
        </div>
      </div>
    </DevCard>
  </div>
</template>

<script setup lang="ts">
import DevCard from "~/components/UI/DevCard.vue";
import { baseURL } from "~/shared/api";
import { usePortfolioStore } from "~/store/portfolioStore";
import { useUserStore } from "~/store/userStore";

definePageMeta({
  middleware: ["auth"],
});

const userStore = useUserStore();
const portfolioStore = usePortfolioStore();

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

        .skill {
          border-radius: 6px;
          padding: 6px 14px;
          background: $tag-color;
          font-size: 14px;
          color: $text-placeholder;
          display: flex;
          align-items: center;
          gap: 8px;
        }
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
