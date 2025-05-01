export function useUserCreated(created: string) {
    return new Date(created).toLocaleString("ru", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}