export function useMessageCreated(created: string) {
    const hours = new Date(created).getHours();
    const minutes = new Date(created).getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
}