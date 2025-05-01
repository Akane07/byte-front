export function useUserProjects(count: number) {
    if (count == 0) return '0 активных проектов';
    if (count == 1) return '1 активный проект';
    if (count > 1 && count < 5) return `${count} активных проекта`;
    return `${count} активных проектов`;
}