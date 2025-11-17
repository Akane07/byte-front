<template>
  <UIDevNavMenu></UIDevNavMenu>

  <div class="wrapper">
    <div ref="wrapperRef" class="step_wrapper">
      <div class="step_block">
        <div class="left_part">
          <span class="step">1/5 Название</span>
          <h2>Для начала придумайте отличное название</h2>
          <p>
            Хорошее название поможет вам привлечь нужных кандидатов. Это первое,
            что они увидят, поэтому важно сформулировать его чётко и понятно для
            исполнителей.
          </p>
        </div>
        <div class="right_part">
          <div class="block">
            <p>Напишите название для своего заказа<span style="color: #FF6969">*</span></p>
            <UIDevInput v-model="newOrder.title" type="text"
              placeholder="Например, Front-end разработчик или Web-designer"></UIDevInput>
          </div>
          <div class="description">
            <p>Примеры названий</p>
            <ul>
              <li>
                Создайте адаптивный сайт на WordPress с функцией
                бронирования/оплаты
              </li>
              <li>
                Опыт работы с AR необходим для виртуальных демонстраций продукта
                (ARCore)
              </li>
              <li>
                Разработчику необходимо обновить пользовательский интерфейс
                приложения Android для новых спецификаций ОС/устройства
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="step_block second">
        <div class="left_part">
          <span class="step">2/5 Навыки</span>
          <h2>Добавьте навыки, которые требуются для вашего заказа</h2>
          <p>
            Навыки помогут понять кандидату, подходит ли он для этого заказа или
            нет.
          </p>
        </div>
        <div class="right_part">
          <div class="block">
            <p>Категория заказа<span style="color: #FF6969">*</span></p>
            <UIDevSelect style="width: 100%" :list="categoryStore.mapCategories" :selected="newOrder.category"
              @select="handleSelect"></UIDevSelect>
          </div>
          <div class="block">
            <p>Добавьте навыки или напишите свои (до 10)</p>
            <div class="skills_block" @click="handleFocus">
              <div v-for="(skill, index) in newOrder.skills" :key="skill" class="skill">
                <span>{{ skill }}</span>
                <IconsCross style="transform: scale(0.8)" class="cursor" @click="deleteSkill(index)">
                </IconsCross>
              </div>
              <input v-model="newSkill" ref="inputRef" type="text" @keyup.enter="handleAddSkill" maxlength="20" />
            </div>
          </div>
          <div class="block">
            <p>Популярные навыки</p>
            <div class="tags">
              <div v-for="tag in filteredSkills" :key="tag" class="tag" @click="addSkill(tag)">
                {{ tag }}
                <IconsPlus color="#9E9E9F" style="transform: scale(1.2)"></IconsPlus>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="step_block third">
        <div class="left_part">
          <span class="step">3/5 Сроки</span>
          <h2>Оцените объем вашего заказа</h2>
          <p>Подумайте о размере вашего заказа и времени, которое он займет.</p>
        </div>
        <div class="right_part">
          <div class="block">
            <div class="custom_checkbox">
              <div class="text_wrapper">
                <IconsCalendar style="transform: scale(1.4);"></IconsCalendar>
                <div class="text">
                  <p>{{ deadline }}</p>
                  <span>Продолжительность проекта<span style="color: #FF6969">*</span></span>
                </div>
              </div>
              <div class="checkbox" @click="modal = true">
                <IconsBluePencil style="transform: scale(1.5);"></IconsBluePencil>
              </div>
            </div>
            <div class="custom_checkbox">
              <div class="text_wrapper">
                <IconsExpert style="transform: scale(1.4);"></IconsExpert>
                <div class="text">
                  <p>Эксперт</p>
                  <span>Я готов платить более высокую ставку самым опытным фрилансерам</span>
                </div>
              </div>
              <div @click="newOrder.for_experts = !newOrder.for_experts" class="checkbox">
                <IconsBluePencil v-if="newOrder.for_experts" style="transform: scale(1.5);"></IconsBluePencil>
              </div>
            </div>
            <div class="custom_checkbox">
              <div class="text_wrapper">
                <IconsExpert style="transform: scale(1.4);"></IconsExpert>
                <div class="text">
                  <p>Долгосрочное сотрудничество</p>
                  <span>Я ищу работника на долгий срок, а не одноразовый проект</span>
                </div>
              </div>
              <div @click="newOrder.type === 'one-time' ? (newOrder.type = 'reusable') : (newOrder.type = 'one-time')"
                class="checkbox">
                <IconsBluePencil v-if="newOrder.type === 'reusable'" style="transform: scale(1.5);"></IconsBluePencil>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="step_block fourth">
        <div class="left_part">
          <span class="step">4/5 Оплата</span>
          <h2>Напишите, сколько вы готовы заплатить за свой заказ</h2>
          <p>
            Это поможет вам подобрать таланты в вашем ценовом диапазоне.
          </p>
        </div>
        <div class="right_part">
          <div class="price_block">
            <div class="price" :class="{ 'active': newOrder.price_type === 'fixed' }"
              @click="handleChangePriceType('fixed')">
              <div class="checkbox">
                <IconsReceipt></IconsReceipt>
                <div class="checkbox_wrapper">
                  <div class="circle" v-if="newOrder.price_type === 'fixed'"></div>
                </div>
              </div>
              <p>Фиксированная цена</p>
            </div>
            <div class="price" :class="{ 'active': newOrder.price_type === 'hourly' }"
              @click="handleChangePriceType('hourly')">
              <div class="checkbox">
                <IconsBigClock></IconsBigClock>
                <div class="checkbox_wrapper">
                  <div class="circle" v-if="newOrder.price_type === 'hourly'"></div>
                </div>
              </div>
              <p>Почасовая ставка</p>
            </div>
          </div>
          <span class="tip">Установите цену за заказ и заплатите в конце, или вы можете разделить заказ на этапы и
            платить по мере выполнения каждого этапа.</span>
          <div class="input_block">
            <p>Цена для вашего заказа</p>
            <OrdersPriceInput v-model="newOrder.price"></OrdersPriceInput>
          </div>
          <p class="contract" @click="handleChangePriceType('contract')">Установить договорную стоимость</p>
        </div>
      </div>
      <div class="step_block fifth">
        <div class="left_part">
          <span class="step">5/5 Описание</span>
          <h2>Добавьте описание</h2>
          <div class="tip">
            <p>Что кандидаты хотят увидеть:</p>
            <ul>
              <li>Четкие ожидания относительно вашей задачи и результатов</li>
              <li>Навыки, необходимые для вашей работы</li>
              <li>Хорошее общение</li>
              <li>Подробная информация о том, как вам или вашей команде нравится работать</li>
            </ul>
          </div>
        </div>
        <div class="right_part">
          <div class="block">
            <p>Подробно опишите, что нужно сделать<span style="color: #FF6969">*</span></p>
            <UIDevTextarea v-model="newOrder.description" placeholder="Описание вашего заказа" maxlength="2000">
            </UIDevTextarea>
          </div>
        </div>
      </div>
      <div class="step_block"></div>
    </div>
    <div class="footer">
      <div class="progress">
        <div class="line" :style="{ width: `${step * 20}%` }"></div>
      </div>
      <div class="actions">
        <UIDevButton class="next" :active="false" @click="prevStep">Назад</UIDevButton>
        <div class="right">
          <button class="draft" @click="saveAsDraft">Сохранить как черновик</button>
          <UIDevButton class="next" :active="true" @click="nextStep">{{ step === 5 ? 'Опубликовать' : 'Далее' }}
          </UIDevButton>
        </div>
      </div>
    </div>
  </div>

  <OrdersDateSelect v-if="modal" @close="modal = false" @save="handleDeadlines" :deadline="newOrder.deadlines"
    :from="newOrder.deadline_date.from" :to="newOrder.deadline_date.to"></OrdersDateSelect>
</template>

<script setup lang="ts">
import { IconsCalendar } from "#components";
import { useCategory } from "~/store/categoryStore";
import { useNotifications } from "~/store/notiStore";
import { useOrderStore } from "~/store/orderStore";

definePageMeta({
    middleware: ['auth'],
});

const router = useRouter();
const categoryStore = useCategory();
const orderStore = useOrderStore();
const notifications = useNotifications();

const modal = shallowRef(false);
const wrapperRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const step = shallowRef(1);
const newSkill = shallowRef("");

const newOrder = ref({
  title: "",
  description: "",
  price: 0,
  price_type: "fixed",
  type: "one-time",
  for_experts: false,
  deadlines: "contract" as 'less-week' | 'more-week' | 'less-month' | 'more-month' | 'contract' | 'custom',
  deadline_date: {
    from: '',
    to: ''
  },
  skills: [] as string[],
  category: "",
  draft: true,
});

const deadline = computed(() => {
  switch (newOrder.value.deadlines) {
    case 'less-week':
      return 'Менее 1 недели';
    case 'more-week':
      return 'Более 1 недели';
    case 'less-month':
      return 'Менее 1 месяца';
    case 'more-month':
      return 'Более 1 месяца';
    case 'contract':
      return 'По договоренности';
    case 'custom':
      return `${useUserCreated(newOrder.value.deadline_date.from)} - ${useUserCreated(newOrder.value.deadline_date.to)}`;
  }
})

const filteredSkills = computed(() => {
  return categoryStore.skills.filter(
    (item) => !newOrder.value.skills.includes(item)
  );
});

function prevStep() {
  if (step.value > 1) {
    step.value--;
    newOrder.value.draft = true;
    scrollTo();
  } else {
    router.back();
  }
}

async function nextStep() {
  switch (step.value) {
    case 1:
      if (newOrder.value.title) {
        newOrder.value.draft = true;
        step.value = 2;
        scrollTo();
        return;
      }
      return;
    case 2:
      if (newOrder.value.category) {
        newOrder.value.draft = true;
        step.value = 3;
        scrollTo();
        return;
      }
      return;
    case 3:
      if (newOrder.value.deadlines && newOrder.value.type) {
        newOrder.value.draft = true;
        step.value = 4;
        scrollTo();
        return;
      }
      return;
    case 4:
      if (newOrder.value.price_type === 'contract' || (newOrder.value.price_type && newOrder.value.price)) {
        newOrder.value.draft = true;
        step.value = 5;
        scrollTo();
        return;
      }
      return;
    case 5:
      newOrder.value.draft = false;
      await orderStore.createOrder(newOrder.value as any);
      notifications.setNotification('Заказ успешно опубликован!')
      navigateTo('/orders/my');
  }
}

async function saveAsDraft() {
  if ((step.value > 1) || newOrder.value.title) {
    newOrder.value.draft = true;
    await orderStore.createOrder(newOrder.value as any);
    await notifications.setNotification('Черновик сохранен!');
    router.back();
  } else {
    await notifications.setNotification('Нельзя сохранить пустой заказ');
  }
}

function scrollTo() {
  wrapperRef.value!.scrollLeft =
    (wrapperRef.value!.firstChild!.clientWidth + 270) * (step.value - 1);
}

async function handleSelect(selected: string) {
  newOrder.value.category = selected;
  await categoryStore.getSkillsById(selected);
}

function addSkill(skill: string) {
  if (newOrder.value.skills.length >= 10) return;
  newOrder.value.skills.push(skill);
}

function handleAddSkill() {
  if (newSkill.value.length === 0) return;
  if (newOrder.value.skills.length >= 10) return;
  newOrder.value.skills.push(newSkill.value);
  newSkill.value = "";
}

function deleteSkill(index: number) {
  newOrder.value.skills.splice(index, 1);
}

function handleFocus() {
  inputRef.value?.focus();
}

function handleChangePriceType(type: 'fixed' | 'hourly' | 'contract') {
  newOrder.value.price_type = type;
}

function handleDeadlines(date: "contract" | "less-week" | "more-week" | "less-month" | "more-month" | "custom" | { from: string, to: string }) {
  if (typeof date === 'string') {
    newOrder.value.deadlines = date;
    newOrder.value.deadline_date.from = '';
    newOrder.value.deadline_date.to = '';
  } else {
    newOrder.value.deadlines = 'custom';
    newOrder.value.deadline_date.from = date.from;
    newOrder.value.deadline_date.to = date.to;
  }

  modal.value = false;
}

await categoryStore.getAllCategories();

// onMounted(async () => {
//   await categoryStore.getAllCategories();
// });
</script>

<style lang="scss" scoped>
@import "../../assets/styles/vars.scss";

.wrapper {
  width: 100%;
  min-height: 100dvh;
  background: $input-auth;
  position: absolute;
  top: 0;
  left: 0;
  padding: 150px 150px 0px 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100px;
  overflow-x: hidden;

  .step_wrapper {
    width: 100%;
    max-width: 1620px;
    overflow-x: hidden;
    display: flex;
    gap: 180px;
    scroll-behavior: smooth;

    .step_block {
      width: 100%;
      max-width: 1440px;
      display: flex;
      align-items: start;
      gap: 64px;
      justify-content: space-between;
      font-weight: 500;
      flex: 0 0 auto;
      margin-left: 90px;

      .left_part {
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 600px;
        width: 100%;

        .step {
          font-size: 16px;
          color: $text-color-secondary;
        }

        h2 {
          font-size: 32px;
          color: $text-color-main;
        }

        p {
          font-size: 14px;
          color: $text-color-secondary;
        }
      }

      .right_part {
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-width: 600px;
        margin-top: 43px;
        width: 100%;

        .block {
          display: flex;
          flex-direction: column;
          gap: 12px;
          color: white;
        }

        .description {
          display: flex;
          flex-direction: column;
          gap: 16px;

          p {
            color: white;
          }

          ul {
            display: flex;
            flex-direction: column;
            gap: 8px;
            list-style-type: disc;
            padding-left: 20px;
            color: $text-color-secondary;
          }
        }
      }

      &:last-child {
        padding-right: 90px;
      }

      &.second {
        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          min-height: 120px;
          user-select: none;

          .tag {
            display: flex;
            align-items: center;
            justify-items: center;
            gap: 4px;
            border-radius: 6px;
            background: $tag-color;
            color: $text-color-secondary;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
          }
        }

        .skills_block {
          padding: 12px 16px;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          border-radius: 6px;
          border: 1px solid #3c3b3b;
          background: #2e2e2e;
          transition: 0.2s ease-in;

          .skill {
            border-radius: 6px;
            padding: 6px 14px;
            background: #3c3b3b;
            font-size: 14px;
            color: $text-placeholder;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          input {
            border: none;
            outline: none;
            background: transparent;
            cursor: pointer;
            color: $text-placeholder;
            font-size: 14px;
          }

          &:hover {
            border: 1px solid #444343;
            background: rgb(50, 50, 50);
          }

          &:focus-within {
            border: 1px solid #444343;
            background: rgb(50, 50, 50);
          }
        }
      }

      &.third {
        .custom_checkbox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;

          .text_wrapper {
            display: flex;
            gap: 16px;
            align-items: center;

            .text {
              display: flex;
              flex-direction: column;
              gap: 4px;

              p {
                color: $text-color-main;
                font-size: 14px;
                font-weight: 600;
              }

              span {
                color: $text-color-secondary;
                font-size: 12px;
                font-weight: 500;
              }
            }
          }

          .checkbox {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            border: 2px solid $active-button-color;
            cursor: pointer;
          }
        }
      }

      &.fourth {
        .price_block {
          display: flex;
          gap: 32px;

          .price {
            width: 100%;
            max-width: 220px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 18px 14px;
            border-radius: 6px;
            border: 1px solid white;
            transition: border 0.2s ease-in;
            cursor: pointer;

            .checkbox {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 24px;
              cursor: pointer;

              .checkbox_wrapper {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 100%;
                border: 1px solid white;
                cursor: pointer;

                .circle {
                  width: 20px;
                  height: 20px;
                  background: $active-button-color;
                  border-radius: 100%;
                  cursor: pointer;
                }
              }
            }

            p {
              font-weight: 600;
              font-size: 16px;
              color: $text-color-main;
              cursor: pointer;
            }

            &.active {
              border: 1px solid $active-button-color;
            }

            &:hover {
              border: 1px solid $active-button-color;
            }
          }
        }

        .tip {
          font-size: 14px;
          font-weight: 500;
          color: $text-color-secondary;
        }

        .input_block {
          display: flex;
          flex-direction: column;
          justify-content: end;
          gap: 12px;
          color: white;
          font-weight: 500;
        }

        .input_block_wrapper {
          display: flex;
          gap: 32px;
        }

        .contract {
          font-weight: 500;
          font-size: 14px;
          color: $active-button-color;
          cursor: pointer;
        }
      }

      &.fifth {
        .tip {
          display: flex;
          flex-direction: column;
          gap: 12px;

          p {
            font-size: 16px;
            font-weight: 500;
            color: white;
          }

          ul {
            display: flex;
            flex-direction: column;
            gap: 8px;
            list-style-type: disc;
            padding-left: 20px;
            color: $text-color-secondary;
          }

        }
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 30px 100px;
    width: 100%;
    z-index: 100;
    background: #18181c;

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: #313139;

      .line {
        width: 20%;
        height: 1px;
        background: #ffffff;
        transition: width 0.5s ease-in-out;
      }
    }

    .actions {
      display: flex;
      justify-content: space-between;
      gap: 64px;

      .right {
        display: flex;
        gap: 32px;
        align-items: center;

        .draft {
          border: none;
          outline: none;
          background: transparent;
          color: $active-button-color;
          padding: 12px 28px;
          cursor: pointer;
        }
      }

      .next {
        width: 220px;
      }
    }
  }
}
</style>
