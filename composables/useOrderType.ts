export function useOrderType(type: 'one-time' | 'reusable'): string {
    return (type === 'one-time') ? 'одноразовый' : 'полная занятость';
}