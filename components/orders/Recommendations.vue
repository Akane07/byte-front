<template>
  <section class="recommendations">
    <div class="head">
      <h2>Подходящие исполнители</h2>
      <span>Подобраны под этот заказ: категория, навыки, цена, рейтинг, опыт и загрузка</span>
    </div>

    <p v-if="state === 'loading'" class="status">Подбираем исполнителей…</p>

    <div v-else-if="state === 'error'" class="status">
      <p>Не удалось загрузить подборку</p>
      <button type="button" class="retry" @click="load">Повторить</button>
    </div>

    <div v-else-if="!items.length" class="status">
      <p>Пока никто не подходит</p>
      <span>Исполнители откликнутся на заказ сами — или попробуйте добавить навыки в заказ.</span>
    </div>

    <div v-else class="grid">
      <div v-for="rec in items" :key="rec.id" class="item">
        <SpecialistsSpecialistCard :user="rec" :order-id="order.id" :online="!!chatStore.online[rec.id]">
          <template #badges>
            <span v-if="rec.isNewcomer" class="badge newcomer">Новичок</span>
            <span v-if="rec.alreadyResponded" class="badge responded">Уже откликнулся</span>
          </template>
        </SpecialistsSpecialistCard>
        <details class="why">
          <summary>Почему в подборке?</summary>
          <ul>
            <li v-for="reason in recommendationReasons(rec, order)" :key="reason">{{ reason }}</li>
          </ul>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getRecommendations, type Order, type Recommendation } from "~/shared/api/order-api";
import { recommendationReasons } from "~/shared/utils/recommendation";
import { useChatStore } from "~/store/chatStore";

const props = defineProps<{ order: Order }>();

const chatStore = useChatStore();
const items = ref<Recommendation[]>([]);
const state = shallowRef<"loading" | "error" | "ready">("loading");

async function load() {
  state.value = "loading";
  const res = await getRecommendations(props.order.id);
  if (!res) {
    state.value = "error";
    return;
  }
  items.value = res;
  state.value = "ready";
  chatStore.queryPresence(res.map((r) => r.id));
}

onMounted(load);
</script>

<style scoped lang="scss">
.recommendations {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1300px;
  margin-bottom: 40px;
  padding: 32px 40px;
  border-radius: 20px;
  background: $input-auth;
  color: $text-main;
  z-index: 100;

  @include small {
    padding: 24px 16px;
  }
}

.head {
  display: flex;
  flex-direction: column;
  gap: 4px;

  h2 {
    font-size: 20px;
    font-weight: 600;
  }

  span {
    font-size: 14px;
    color: $text-secondary;
  }
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 0;
  text-align: center;
  color: $text-secondary;

  p {
    font-size: 18px;
    font-weight: 600;
    color: $text-main;
  }
}

.retry {
  height: 36px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  background: transparent;
  color: $text-main;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;

  @include small {
    grid-template-columns: 100%;
  }
}

.item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > :first-child {
    flex: 1;
  }
}

.badge {
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;

  &.newcomer {
    background: rgba(246, 173, 85, 0.14);
    color: #f6c177;
  }

  &.responded {
    background: rgba(255, 255, 255, 0.08);
    color: $text-main;
  }
}

.why {
  padding: 0 4px;
  font-size: 13px;
  color: $text-secondary;

  summary {
    cursor: pointer;
    width: fit-content;
    border-radius: 4px;

    // рамка фокуса — только для клавиатуры, не после клика мышью
    &:focus:not(:focus-visible) {
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid $primary;
      outline-offset: 2px;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
    padding-left: 18px;
    list-style: disc;
  }
}
</style>
