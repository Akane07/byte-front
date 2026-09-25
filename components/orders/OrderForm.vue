<template>
  <UINavMenu />

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
          <UIInput
            v-model="form.title"
            type="text"
            label="Напишите название для своего заказа"
            placeholder="Например, создание адаптивного сайта"
            maxlength="200"
            :rules="rules.notEmpty"
            required
          />
          <div class="description">
            <p>Примеры названий</p>
            <ul>
              <li>Создайте адаптивный сайт на WordPress с функцией бронирования/оплаты</li>
              <li>Опыт работы с AR необходим для виртуальных демонстраций продукта (ARCore)</li>
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
          <p>Навыки помогут понять кандидату, подходит ли он для этого заказа или нет.</p>
        </div>
        <div class="right_part">
          <div class="block">
            <p>Категория заказа<span class="required">*</span></p>
            <UISelect
              style="width: 100%"
              :list="categoryStore.titles"
              :selected="categoryTitle"
              @select="handleSelectCategory"
            />
          </div>
          <div class="block">
            <p>Добавьте навыки или напишите свои (до {{ MAX_SKILLS }})</p>
            <div class="skills_block" @click="inputRef?.focus()">
              <LazyUIChip
                v-for="(skill, index) in form.skills"
                :key="skill"
                :text="skill"
                removable
                :hover="false"
                @delete="form.skills.splice(index, 1)"
              />
              <input
                ref="inputRef"
                v-model="newSkill"
                type="text"
                maxlength="30"
                @keyup.enter="addSkill(newSkill)"
              />
            </div>
          </div>
          <div class="block">
            <p>Популярные навыки</p>
            <div class="tags">
              <LazyUIChip v-for="tag in suggestedSkills" :key="tag" @click="addSkill(tag)">
                {{ tag }}
                <IconsPlus color="rgba(255, 255, 255, 0.5)" style="transform: scale(1.2)" />
              </LazyUIChip>
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
                <IconsCalendar style="transform: scale(1.4)" />
                <div class="text">
                  <p>{{ deadlineLabel }}</p>
                  <span>Продолжительность проекта<span class="required">*</span></span>
                </div>
              </div>
              <div class="checkbox" @click="dateModal = true">
                <IconsBluePencil style="transform: scale(1.5)" />
              </div>
            </div>
            <div class="custom_checkbox">
              <div class="text_wrapper">
                <IconsExpert style="transform: scale(1.4)" />
                <div class="text">
                  <p>Эксперт</p>
                  <span>Я готов платить более высокую ставку самым опытным фрилансерам</span>
                </div>
              </div>
              <div class="checkbox" @click="form.for_experts = !form.for_experts">
                <IconsBluePencil v-if="form.for_experts" style="transform: scale(1.5)" />
              </div>
            </div>
            <div class="custom_checkbox">
              <div class="text_wrapper">
                <IconsExpert style="transform: scale(1.4)" />
                <div class="text">
                  <p>Долгосрочное сотрудничество</p>
                  <span>Я ищу работника на долгий срок, а не одноразовый проект</span>
                </div>
              </div>
              <div
                class="checkbox"
                @click="form.type = form.type === 'one-time' ? 'reusable' : 'one-time'"
              >
                <IconsBluePencil v-if="form.type === 'reusable'" style="transform: scale(1.5)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="step_block fourth">
        <div class="left_part">
          <span class="step">4/5 Оплата</span>
          <h2>Напишите, сколько вы готовы заплатить за свой заказ</h2>
          <p>Это поможет вам подобрать таланты в вашем ценовом диапазоне.</p>
        </div>
        <div class="right_part">
          <div class="price_block">
            <div
              class="price"
              :class="{ active: form.price_type === 'fixed' }"
              @click="form.price_type = 'fixed'"
            >
              <div class="checkbox">
                <IconsReceipt />
                <div class="checkbox_wrapper">
                  <div v-if="form.price_type === 'fixed'" class="circle"></div>
                </div>
              </div>
              <p>Фиксированная цена</p>
            </div>
            <div
              class="price"
              :class="{ active: form.price_type === 'hourly' }"
              @click="form.price_type = 'hourly'"
            >
              <div class="checkbox">
                <IconsBigClock />
                <div class="checkbox_wrapper">
                  <div v-if="form.price_type === 'hourly'" class="circle"></div>
                </div>
              </div>
              <p>Почасовая ставка</p>
            </div>
          </div>
          <span class="tip">
            Установите цену за заказ и заплатите в конце, или вы можете
            разделить заказ на этапы и платить по мере выполнения каждого этапа.
          </span>
          <div v-if="form.price_type === 'fixed'" class="input_block">
            <p>Цена для вашего заказа</p>
            <OrdersPriceInput v-model="fixedPrice" price-type="fixed" />
          </div>
          <div v-else-if="form.price_type === 'hourly'" class="input_block_wrapper">
            <div class="input_block">
              <p>Ставка от</p>
              <OrdersPriceInput v-model="hourlyPrice.from" price-type="hourly" />
            </div>
            <div class="input_block">
              <p>до</p>
              <OrdersPriceInput v-model="hourlyPrice.to" price-type="hourly" />
            </div>
          </div>
          <p class="contract" @click="form.price_type = 'contract'">
            {{
              form.price_type === "contract"
                ? "Выбрана договорная стоимость"
                : "Установить договорную стоимость"
            }}
          </p>
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
            <p>Подробно опишите, что нужно сделать<span class="required">*</span></p>
            <UITextarea
              v-model="form.description"
              placeholder="Описание вашего заказа"
              maxlength="2000"
            />
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
        <UIButton class="next" @click="prevStep">Назад</UIButton>
        <div class="right">
          <button class="draft" :disabled="saving" @click="saveAsDraft">
            Сохранить как черновик
          </button>
          <UIButton class="next" type="active" :disabled="saving" @click="nextStep">
            {{ step < LAST_STEP ? "Далее" : submitLabel }}
          </UIButton>
        </div>
      </div>
    </div>
  </div>

  <OrdersDateSelect
    v-if="dateModal"
    :deadline="form.deadlines"
    :from="form.deadline_date.from"
    :to="form.deadline_date.to"
    @close="dateModal = false"
    @save="handleDeadlines"
  />
</template>

<script setup lang="ts">
import type { OrderInput } from "~/shared/api/order-api";
import type { DateRange, Deadline, PriceType } from "~/shared/types";
import { rules } from "~/shared/utils/rules";
import { useCategory } from "~/store/categoryStore";
import { useNotifications } from "~/store/notiStore";
import { useOrderStore } from "~/store/orderStore";

/**
 * Форма заказа — общая для создания и редактирования.
 * Раньше это были две почти одинаковые страницы (create.vue и edit.vue)
 * на 1769 строк, и баги в них расходились.
 */
const props = defineProps<{
  /** id заказа — режим редактирования; без него — создание. */
  orderId?: string;
}>();

const LAST_STEP = 5;
const MAX_SKILLS = 10;

const router = useRouter();
const categoryStore = useCategory();
const orderStore = useOrderStore();
const notifications = useNotifications();

const wrapperRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const step = shallowRef(1);
const newSkill = shallowRef("");
const dateModal = shallowRef(false);
const saving = shallowRef(false);
/** Редактируемый заказ уже опубликован (а не черновик). */
const isPublished = shallowRef(false);

const form = ref({
  title: "",
  description: "",
  price_type: "fixed" as PriceType,
  type: "one-time" as "one-time" | "reusable",
  for_experts: false,
  deadlines: "contract" as Deadline,
  deadline_date: { from: "", to: "" } as DateRange,
  skills: [] as string[],
  category: undefined as number | undefined,
});

// Цены хранятся отдельно по типам, чтобы переключение типа не теряло введённое.
const fixedPrice = shallowRef(0);
const hourlyPrice = ref({ from: 0, to: 0 });

const categoryTitle = computed(() => categoryStore.getCategoryTitleById(form.value.category));
const deadlineLabel = computed(() =>
  form.value.deadlines === "custom"
    ? `${useUserCreated(form.value.deadline_date.from)} – ${useUserCreated(form.value.deadline_date.to)}`
    : useOrderDeadlines(form.value.deadlines),
);
const suggestedSkills = computed(() =>
  categoryStore.skills.filter((skill) => !form.value.skills.includes(skill)),
);
const submitLabel = computed(() =>
  props.orderId && isPublished.value ? "Сохранить" : "Опубликовать",
);

/** Проверка шага; возвращает текст ошибки или null. */
function validateStep(current: number): string | null {
  const f = form.value;
  switch (current) {
    case 1:
      return f.title.trim() ? null : "Укажите название заказа";
    case 2:
      return f.category ? null : "Выберите категорию заказа";
    case 3:
      return f.deadlines !== "custom" || (f.deadline_date.from && f.deadline_date.to)
        ? null
        : "Укажите даты начала и окончания";
    case 4:
      if (f.price_type === "fixed" && fixedPrice.value <= 0) return "Укажите цену заказа";
      if (f.price_type === "hourly") {
        const { from, to } = hourlyPrice.value;
        if (from <= 0 || to <= 0) return "Укажите почасовую ставку";
        if (from > to) return "Нижняя граница ставки больше верхней";
      }
      return null;
    case 5:
      return f.description.trim() ? null : "Добавьте описание заказа";
  }
  return null;
}

function toPayload(draft: boolean): OrderInput {
  const f = form.value;
  return {
    title: f.title.trim(),
    description: f.description.trim(),
    price_type: f.price_type,
    price:
      f.price_type === "fixed"
        ? fixedPrice.value
        : f.price_type === "hourly"
          ? { ...hourlyPrice.value }
          : 0,
    type: f.type,
    for_experts: f.for_experts,
    deadlines: f.deadlines,
    deadline_date: f.deadlines === "custom" ? { ...f.deadline_date } : undefined,
    skills: [...f.skills],
    category: f.category,
    draft,
  };
}

async function save(draft: boolean) {
  saving.value = true;
  const payload = toPayload(draft);
  const res = props.orderId
    ? await orderStore.editOrder(payload, props.orderId)
    : await orderStore.createOrder(payload);
  saving.value = false;
  return res !== null;
}

function goToStep(target: number) {
  step.value = target;
  const first = wrapperRef.value?.firstElementChild as HTMLElement | null;
  if (wrapperRef.value && first) {
    wrapperRef.value.scrollLeft = (first.clientWidth + 270) * (target - 1);
  }
}

function prevStep() {
  if (step.value > 1) {
    goToStep(step.value - 1);
  } else {
    router.back();
  }
}

async function nextStep() {
  const error = validateStep(step.value);
  if (error) {
    notifications.setNotification(error);
    return;
  }

  if (step.value < LAST_STEP) {
    goToStep(step.value + 1);
    return;
  }

  const updating = submitLabel.value === "Сохранить";
  if (await save(false)) {
    notifications.setNotification(
      updating ? "Заказ успешно обновлён!" : "Заказ успешно опубликован!",
    );
    navigateTo("/orders/my");
  }
}

async function saveAsDraft() {
  if (!form.value.title.trim()) {
    notifications.setNotification("Чтобы сохранить черновик, укажите название");
    return;
  }
  if (await save(true)) {
    notifications.setNotification("Черновик сохранён!");
    navigateTo("/orders/my");
  }
}

async function handleSelectCategory(title: string) {
  form.value.category = categoryStore.getCategoryIdByTitle(title);
  await categoryStore.loadSkills(form.value.category);
}

function addSkill(skill: string) {
  const value = skill.trim();
  if (!value || form.value.skills.length >= MAX_SKILLS) return;
  if (!form.value.skills.includes(value)) {
    form.value.skills.push(value);
  }
  newSkill.value = "";
}

function handleDeadlines(value: string | DateRange) {
  if (typeof value === "string") {
    form.value.deadlines = value as Deadline;
    form.value.deadline_date = { from: "", to: "" };
  } else {
    form.value.deadlines = "custom";
    form.value.deadline_date = { ...value };
  }
  dateModal.value = false;
}

onMounted(async () => {
  await categoryStore.getAllCategories();
  if (!props.orderId) {
    categoryStore.skills = [];
    return;
  }

  const order = await orderStore.getOrder(props.orderId);
  if (!order) {
    navigateTo("/orders/my");
    return;
  }

  isPublished.value = !order.draft;
  form.value = {
    title: order.title,
    description: order.description ?? "",
    price_type: order.price_type,
    type: order.type,
    for_experts: order.for_experts,
    deadlines: order.deadlines,
    deadline_date: order.deadline_date ?? { from: "", to: "" },
    skills: [...order.skills],
    category: order.category,
  };
  if (typeof order.price === "number") {
    fixedPrice.value = order.price;
    hourlyPrice.value = { from: order.price, to: order.price };
  } else {
    hourlyPrice.value = { ...order.price };
    fixedPrice.value = order.price.to;
  }

  await categoryStore.loadSkills(order.category);
});
</script>

<style lang="scss" scoped>
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
          color: $text-secondary;
        }

        h2 {
          font-size: 32px;
          color: $text-main;
        }

        p {
          font-size: 14px;
          color: $text-secondary;
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
          color: $white;
        }

        .description {
          display: flex;
          flex-direction: column;
          gap: 16px;

          p {
            color: $white;
          }

          ul {
            display: flex;
            flex-direction: column;
            gap: 8px;
            list-style-type: disc;
            padding-left: 20px;
            color: $text-secondary;
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
            border: 1px solid $border-secondary;
            background: $bg-input;
          }

          &:focus-within {
            border: 1px solid $border-secondary;
            background: $bg-input;
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
                color: $text-main;
                font-size: 14px;
                font-weight: 600;
              }

              span {
                color: $text-secondary;
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
            border: 2px solid $primary;
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
            border: 1px solid $white;
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
                border: 1px solid $white;
                cursor: pointer;

                .circle {
                  width: 20px;
                  height: 20px;
                  background: $primary;
                  border-radius: 100%;
                  cursor: pointer;
                }
              }
            }

            p {
              font-weight: 600;
              font-size: 16px;
              color: $text-main;
              cursor: pointer;
            }

            &.active {
              border: 1px solid $primary;
            }

            &:hover {
              border: 1px solid $primary;
            }
          }
        }

        .tip {
          font-size: 14px;
          font-weight: 500;
          color: $text-secondary;
        }

        .input_block {
          display: flex;
          flex-direction: column;
          justify-content: end;
          gap: 12px;
          color: $white;
          font-weight: 500;
        }

        .input_block_wrapper {
          display: flex;
          gap: 32px;
        }

        .contract {
          font-weight: 500;
          font-size: 14px;
          color: $primary;
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
            color: $white;
          }

          ul {
            display: flex;
            flex-direction: column;
            gap: 8px;
            list-style-type: disc;
            padding-left: 20px;
            color: $text-secondary;
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
      background: $border-color;

      .line {
        width: 20%;
        height: 1px;
        background: $white;
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
          color: $primary;
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


.required {
  color: $text-red;
}
</style>
