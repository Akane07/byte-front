export function useSliceDescription(description: string) {
    if (description.length < 250) return description;
    return description.slice(0, 250) + '...';
}