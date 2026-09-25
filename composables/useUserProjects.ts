import { plural } from "~/shared/utils/helpers";

/** «1 активный проект», «3 активных проекта», «11 активных проектов». */
export function useUserProjects(count: number): string {
  return `${count} ${plural(count, "активный проект", "активных проекта", "активных проектов")}`;
}
