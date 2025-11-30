<template>
  <div
    class="work w-[250px] min-w-[250px] h-45 bg-transparent rounded-md overflow-hidden relative cursor-pointer select-none"
  >
    <div class="w-full h-full">
      <img
        class="w-full h-full relative z-1 object-cover"
        :src="makeURL(portfolio.images[0])"
        alt="photo"
      />
      <UIDevLoader class="loader absolute top-[50%] left-[50%] z-0" />
    </div>
    <div
      class="hover absolute top-0 left-0 w-full h-full z-2"
      @click.stop="navigateTo(`/profile/portfolio/${portfolio.id}`)"
    >
      <div class="absolute flex gap-2 top-2.5 right-3.5" v-if="!other">
        <div
          class="button w-10 h-6.5 flex items-center justify-center rounded-md"
          @click.stop="handleDelete"
        >
          <IconsTrash style="transform: scale(1.3)"></IconsTrash>
        </div>
        <div
          class="button w-10 h-6.5 flex items-center justify-center rounded-md"
          @click.stop="navigateTo(`/profile/portfolio/edit/${portfolio.id}`)"
        >
          <IconsEditPen style="transform: scale(1.3)"></IconsEditPen>
        </div>
      </div>
      <div class="absolute bottom-2.5 left-3.5">
        <p>{{ portfolio.title }}</p>
        <span>{{ portfolio.role }}</span>
      </div>
      <div class="gradient w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Portfolio } from "~/shared/api/portfolio-api";
import { makeURL } from "~/shared/utils/helpers";
import { usePortfolioStore } from "~/store/portfolioStore";

const props = defineProps<{
  portfolio: Portfolio;
  other?: boolean;
}>();

const portfolioStore = usePortfolioStore();

async function handleDelete() {
  await portfolioStore.deletePortfolio(props.portfolio.id);
}
</script>

<style scoped lang="scss">
.work {
  border: 1.5px solid $active;
  scroll-snap-align: start;

  .loader {
    transform: translate(-50%, -50%);
  }

  .hover {
    opacity: 0;
    transition: opacity 0.2s ease-in;

    .button {
      background: $white;
      border: 2px solid rgba(70, 144, 212, 0.376);
    }

    p {
      font-weight: 500;
      font-size: 14px;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }

    .gradient {
      background: linear-gradient(
        180deg,
        rgba(107, 99, 99, 0.08) 2.74%,
        $black 100%
      );
    }
  }

  &:hover .hover {
    opacity: 1;
  }
}
</style>
