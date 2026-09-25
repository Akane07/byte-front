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
      <UILoader class="loader absolute top-[50%] left-[50%] z-0" />
    </div>
    <div
      class="hover absolute top-0 left-0 w-full h-full z-2"
      @click.stop="navigateTo(`/profile/portfolio/${portfolio.id}`)"
    >
      <div class="absolute flex gap-2 top-2.5 right-3.5" v-if="!other">
        <LazyUIActionButton @click.stop="handleDelete">
          <template #icon="{ color }">
            <IconsTrash style="transform: scale(1.3)" :color="color"></IconsTrash>
          </template>
        </LazyUIActionButton>
                <LazyUIActionButton @click.stop="navigateTo(`/profile/portfolio/edit/${portfolio.id}`)">
          <template #icon="{ color }">
            <IconsEditPen style="transform: scale(1.3)" :color="color"></IconsEditPen>
          </template>
        </LazyUIActionButton>
      </div>
      <div class="absolute bottom-4 left-3">
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
  border: 2px solid $border-color;
  scroll-snap-align: start;
  transform: border 0.3s ease-in-out;

  .loader {
    transform: translate(-50%, -50%);
  }

  .hover {
    opacity: 0;
    transition: opacity 0.2s ease-in;

    p {
      font-weight: 600;
      font-size: 16px;
    }

    span {
      font-weight: 400;
      font-size: 14px;
    }

    .gradient {
      background: linear-gradient(
        180deg,
        rgba(107, 99, 99, 0.1) 2.74%,
        rgba(0, 0, 0, 0.8) 100%
      );
    }
  }

  &:hover {
    border: 2px solid $primary;
    .hover {
      opacity: 1;
    }
  }

  // Без мыши наведения нет — название и кнопки видны всегда.
  @include touch {
    .hover {
      opacity: 1;
    }
  }
}
</style>
