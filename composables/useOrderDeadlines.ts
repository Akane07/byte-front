export function useOrderDeadlines(deadline: 'contract' | 'more-than-month' | 'less-than-month' | string) {
    if (deadline === 'contract') return 'По договоренности';
    if (deadline === 'more-than-month') return 'Более 1 месяца';
    if (deadline === 'less-than-month') return 'Менее 1 месяца';
    return deadline;
}