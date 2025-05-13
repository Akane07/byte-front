export function useSliceDescription(description: string, to?: number) {
    if (description.length < (to || 250)) return description;
    return description.slice(0, (to || 250)) + '...';
}