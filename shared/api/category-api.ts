import { api, call } from ".";

export interface Category {
  id: number;
  title: string;
}

export function getCategories() {
  return call(api.get<Category[]>("/category"));
}

export function getSkills(categoryId: number) {
  return call(api.get<string[]>(`/category/${categoryId}/skills`));
}
