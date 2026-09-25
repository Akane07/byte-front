/** Обрезает текст до limit символов с многоточием. */
export function useSliceDescription(description: string | undefined, limit = 250): string {
  if (!description) return "";
  return description.length <= limit ? description : `${description.slice(0, limit).trimEnd()}...`;
}
