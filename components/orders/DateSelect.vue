<template>
    <div class="modal_wrapper" @click.stop="$emit('close')">
        <div class="date_wrapper" @click.stop>
            <div class="calendar_block">
                <div class="actions">
                    <div class="action" :class="{ 'active': deadlines === 'less-week' }"
                        @click="deadlines = 'less-week'">
                        <p>Менее недели</p>
                    </div>
                    <div class="action" :class="{ 'active': deadlines === 'more-week' }"
                        @click="deadlines = 'more-week'">
                        <p>Более недели</p>
                    </div>
                    <div class="action" :class="{ 'active': deadlines === 'less-month' }"
                        @click="deadlines = 'less-month'">
                        <p>Менее месяца</p>
                    </div>
                    <div class="action" :class="{ 'active': deadlines === 'more-month' }"
                        @click="deadlines = 'more-month'">
                        <p>Более месяца</p>
                    </div>
                    <div class="action" :class="{ 'active': deadlines === 'contract' }" @click="deadlines = 'contract'">
                        <p>По договоренности</p>
                    </div>
                    <div class="action" :class="{ 'active': deadlines === 'custom' }" @click="deadlines = 'custom'">
                        <p>Обозначить сроки</p>
                    </div>
                </div>
                <div class="calendar" :class="{ 'disabled': deadlines !== 'custom' }">
                    <div class="calendar-header">
                        <IconsArrowLeft style="transform: scale(1.5); cursor: pointer;" @click="prevMonth">
                        </IconsArrowLeft>
                        <span>{{ monthYear }}</span>
                        <IconsArrowLeft style="transform: scale(1.5) rotate(180deg); cursor: pointer;"
                            @click="nextMonth"></IconsArrowLeft>
                    </div>

                    <div class="calendar-grid">
                        <div class="day-name" v-for="(day, index) in weekDays" :key="index">{{ day }}</div>
                        <div class="day" v-for="date in calendarDays" :key="date.toISOString()" :class="dayClass(date)"
                            @click="selectDate(date)">
                            {{ date.getDate() }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p class="date">{{ from ? useUserCreated(from) : 'дата начала' }} - {{ to ? useUserCreated(to) : 'дата окончания' }}</p>
                <div class="buttons">
                    <button class="cancel" @click="$emit('close')">Отмена</button>
                    <UIDevButton :active="true" @click="saveRange"
                        :disabled="(!from || !to) && (deadlines === 'custom')">Сохранить</UIDevButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
    deadline: 'less-week' | 'more-week' | 'less-month' | 'more-month' | 'contract' | 'custom';
    from?: string;
    to?: string;
}>();

const emit = defineEmits<{
    (e: 'save', value: string | { from: string; to: string; }): void;
    (e: 'close'): void;
}>();

const deadlines = ref<'less-week' | 'more-week' | 'less-month' | 'more-month' | 'contract' | 'custom'>('less-week');
const currentDate = ref(new Date())
const from = ref<Date | null>(null)
const to = ref<Date | null>(null)
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthYear = computed(() =>
    currentDate.value.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
)


const prevMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}
const nextMonth = () => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

function getCalendarDays(date: Date): Date[] {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const days: Date[] = []

    // Понедельник = 1, воскресенье = 0 → делаем понедельник первым
    const startDay = (firstDayOfMonth.getDay() + 6) % 7
    const endDay = (lastDayOfMonth.getDay() + 6) % 7

    // Предыдущие дни
    for (let i = startDay - 1; i >= 0; i--) {
        days.push(new Date(year, month, 1 - i - 1))
    }

    // Текущий месяц
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        days.push(new Date(year, month, i))
    }

    // Следующие дни
    for (let i = 1; days.length % 7 !== 0; i++) {
        days.push(new Date(year, month + 1, i))
    }

    return days
}

const calendarDays = computed(() => getCalendarDays(currentDate.value))

function selectDate(date: Date) {
    if (!from.value || (from.value && to.value)) {
        from.value = date
        to.value = null
    } else if (date < from.value) {
        to.value = from.value
        from.value = date
    } else {
        to.value = date
    }
}

function dayClass(date: Date) {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isOtherMonth = date.getMonth() !== currentDate.value.getMonth()

    const classes = ['calendar-day']
    if (isWeekend) classes.push('weekend')
    if (isOtherMonth) classes.push('other-month')

    if (from.value && date.toDateString() === from.value.toDateString()) {
        classes.push('selected-from')
    }

    if (to.value && date.toDateString() === to.value.toDateString()) {
        classes.push('selected-to')
    }

    if (
        from.value &&
        to.value &&
        date > from.value &&
        date < to.value
    ) {
        classes.push('in-range')
    }

    return classes
}

watch(deadlines, () => {
    if (deadlines.value !== 'custom') {
        from.value = null;
        to.value = null;
    }
})

function saveRange() {
    if (from.value && to.value) {
        const result = {
            from: from.value.toDateString(),
            to: to.value.toDateString()
        }
        emit('save', result)
    } else {
        emit('save', deadlines.value);
    }
}

onMounted(() => {
    deadlines.value = props.deadline;

    if (props.from) {
        from.value = new Date(props.from);
    }

    if (props.to) {
        to.value = new Date(props.to);
    }
})
</script>

<style scoped lang="scss">
.modal_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000000000;
}

.date_wrapper {
    box-shadow: 0px 6px 15px 0px #FFFFFF1A;
    background: $tag-color
    border-radius: 6px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: 800px;
    user-select: none;

    .calendar_block {
        width: 100%;
        display: flex;
        gap: 24px;
        justify-content: space-between;

        .actions {
            width: 200px;
            display: flex;
            flex-direction: column;
            gap: 4px;

            .action {
                border-radius: 4px 0 0 4px;
                padding: 12px 16px;
                background: transparent;
                border-right: 2px solid transparent;
                transition: all 0.2s ease-in;
                cursor: pointer;

                p {
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                }

                &.active {
                    background: #242032;
                    border-right: 2px solid white;
                }

                &:hover {
                    background: #242032;
                    border-right: 2px solid white;
                }

            }
        }

        .calendar {
            display: flex;
            flex-direction: column;
            gap: 16px;
            height: 310px;

            .calendar-header {
                display: flex;
                align-items: center;
                justify-content: space-between;

                span {
                    font-weight: 500;
                    font-size: 16px;
                    color: white;
                }
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                font-size: 14px;

                .day {
                    padding: 10px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: $text-placeholder;
                }

                .day-name {
                    color: $text-placeholder;
                    padding: 10px 18px;
                    margin-bottom: 16px;
                }

                .other-month {
                    color: $text-placeholder;
                }

                .weekend {
                    color: $text-red;
                }

                .selected-from,
                .selected-to {
                    background-color: $select-enabled
                    color: white;
                }

                .selected-from {
                    border-radius: 6px 0 0 6px;
                }

                .selected-to {
                    border-radius: 0 6px 6px 0;
                }

                .in-range {
                    background-color: rgba(139, 96, 250, 0.1);
                    color: white;
                }
            }

            &.disabled {
                opacity: 0.7;
                cursor: default;
                pointer-events: none;
            }
        }
    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 64px;

        .date {
            color: $text-placeholder;
            font-size: 14px;
            white-space: nowrap;
        }

        .buttons {
            display: flex;
            align-items: center;
            gap: 16px;

            .cancel {
                color: $text-red;
                background: transparent;
                border: none;
                outline: none;
                padding: 12px 28px;
                cursor: pointer;
            }
        }
    }
}
</style>