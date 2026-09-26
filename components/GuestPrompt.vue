<template>
  <Transition name="guest">
    <div v-if="guest.kind" class="backdrop" @click.self="guest.close()">
      <div
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-title"
        @keydown.esc="guest.close()"
      >
        <button type="button" class="close" aria-label="Закрыть" @click="guest.close()">
          <IconsCross />
        </button>

        <img class="logo" src="/logo.svg" alt="" />

        <template v-if="guest.kind === 'welcome'">
          <h2 id="guest-title">Присоединяйтесь к&nbsp;FreelanceByte</h2>
          <p>
            С аккаунтом можно размещать заказы, откликаться на проекты и общаться с заказчиками
            и исполнителями. А пока можно просто осмотреться.
          </p>
        </template>
        <template v-else>
          <h2 id="guest-title">Нужен аккаунт</h2>
          <p>Чтобы {{ guest.reason }}, войдите или зарегистрируйтесь — это займёт минуту.</p>
        </template>

        <div class="actions">
          <NuxtLink ref="primary" class="btn primary" :to="authLink('/auth/registration')" @click="guest.close()">
            Зарегистрироваться
          </NuxtLink>
          <NuxtLink class="btn secondary" :to="authLink('/auth/login')" @click="guest.close()">
            Войти
          </NuxtLink>
        </div>
        <button type="button" class="later" @click="guest.close()">
          {{ guest.kind === "welcome" ? "Позже, сначала осмотрюсь" : "Не сейчас" }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useGuestStore } from "~/store/guestStore";
import { useScroll } from "~/store/scrollStore";

const guest = useGuestStore();
const scroll = useScroll();
const route = useRoute();

/** После входа вернуть на ту же страницу. */
function authLink(path: string) {
  return { path, query: { redirect: route.fullPath } };
}

// Прокрутка под окном заблокирована, фокус — на главной кнопке,
// Esc закрывает (обработчик на .dialog, поэтому фокус должен быть внутри).
const primary = ref<{ $el: HTMLElement } | null>(null);
watch(
  () => guest.kind,
  (kind, previous) => {
    if (kind && !previous) {
      scroll.lock();
      nextTick(() => primary.value?.$el.focus());
    }
    if (!kind && previous) scroll.unlock();
  },
);

// Переход на другую страницу закрывает окно. Сравниваем со страницей, где
// оно открылось: приветствие открывается при монтировании ленты — раньше,
// чем сюда доходит смена маршрута, и простое «закрыть при переходе»
// тут же его закрывало.
watch(
  () => route.path,
  (path) => {
    if (guest.kind && path !== guest.openedOn) guest.close();
  },
);
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // Максимум для z-index. Боковая панель заказа стоит на 10000000000 (браузер
  // урезает до этого же максимума); окно идёт в app.vue после страниц,
  // поэтому при равном значении оказывается сверху.
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(8, 8, 12, 0.6);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.dialog {
  position: relative;
  width: 100%;
  max-width: 440px;
  max-height: 100%;
  overflow-y: auto;
  padding: 40px 32px 28px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(131, 85, 250, 0.22) 0%, rgba(131, 85, 250, 0) 70%),
    #1c1c21;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  text-align: center;

  @include small {
    padding: 36px 20px 24px;
  }
}

.close {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}

.logo {
  width: 48px;
  height: 48px;
  margin: 0 auto 20px;
}

h2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  color: $white;
}

p {
  margin-top: 12px;
  font-size: 15px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.65);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 47px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &.primary {
    background: $primary;
    color: $white;

    &:hover {
      background: $primary-hover;
    }
  }

  &.secondary {
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: $white;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.45);
    }
  }
}

.later {
  margin-top: 16px;
  padding: 4px;
  border: none;
  background: none;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;

  &:hover {
    color: $white;
  }
}

// Появление: фон проявляется, окно поднимается чуть снизу.
.guest-enter-active,
.guest-leave-active {
  transition: opacity 0.25s ease;

  .dialog {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
}

.guest-enter-from,
.guest-leave-to {
  opacity: 0;

  .dialog {
    transform: translateY(16px) scale(0.98);
  }
}
</style>
