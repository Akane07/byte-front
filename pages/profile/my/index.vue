<template>
  <UIDevNavMenu></UIDevNavMenu>
  <UIBackground></UIBackground>

  <ProfileUser></ProfileUser>
</template>

<script setup lang="ts">
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
