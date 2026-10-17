import { api, call } from ".";

/** remote — удалённо, onsite — на месте, any — бывает и так, и так. */
export type CategoryFormat = "remote" | "onsite" | "any";

export interface Category {
  id: number;
  title: string;
  format: CategoryFormat;
}

export function getCategories() {
  return call(api.get<Category[]>("/category"));
}

export function getSkills(categoryId: number) {
  return call(api.get<string[]>(`/category/${categoryId}/skills`));
}

/** Города для заказов на месте и профилей. */
export function getCities() {
  return call(api.get<string[]>("/user/cities"));
}
