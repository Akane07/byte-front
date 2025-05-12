export function useOrderDeadlines(deadline: "contract" | "less-week" | "more-week" | "less-month" | "more-month" | "custom", deadline_date?: { from: string; to: string; }) {
    if (deadline === 'contract') return 'По договоренности';
    if (deadline === 'more-month') return 'Более 1 месяца';
    if (deadline === 'less-month') return 'Менее 1 месяца';
    if (deadline === 'more-week') return 'Более 1 недели';
    if (deadline === 'less-week') return 'Менее 1 недели';
    if (deadline === 'custom' && deadline_date) {
        return `${useUserCreated(deadline_date.from)} - ${useUserCreated(deadline_date.to)}`;
    }
    return deadline;
}