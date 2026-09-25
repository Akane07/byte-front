import { api, call } from ".";

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string;
  role: string;
  images: string[];
  skills: string[];
  /** Путь к видео на сервере, например /uploads/files/....mp4 */
  video?: string;
  created_at: string;
  /** Количество просмотров. */
  viewed_by: number;
  liked_by: string[];
}

export function getMyPortfolio() {
  return call(api.get<Portfolio[]>("/portfolio"));
}

export function getPortfolios(userId: string) {
  return call(api.get<Portfolio[]>(`/portfolio/user/${userId}`));
}

export function getPortfolioById(id: string) {
  return call(api.get<Portfolio>(`/portfolio/${id}`));
}

export function postPortfolio(data: FormData) {
  return call(api.post<Portfolio>("/portfolio", data));
}

export function patchPortfolio(data: FormData, id: string) {
  return call(api.patch<Portfolio>(`/portfolio/${id}`, data));
}

export function deletePortfolio(id: string) {
  return call(api.delete<{ deleted: boolean }>(`/portfolio/${id}`));
}

export function viewPortfolio(id: string) {
  return call(api.post(`/portfolio/${id}/viewed`, undefined, { silent: true }));
}

export function likePortfolio(id: string, liked: boolean) {
  return call(api.post<Portfolio>(`/portfolio/${id}/like`, { liked }));
}
