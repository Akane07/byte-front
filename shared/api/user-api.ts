import { api, call } from ".";

/** Публичный профиль. Свой профиль (/user/me) дополнительно содержит email и phone. */
export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  nickname: string;
  description: string;
  avatar: string;
  is_verified: boolean;
  country: string;
  last_seen?: string;
  created_at: string;
  rating: number;
  orders_count: number;
  reviews_count: number;
  speciality: string;
  skills: string[];
  telegram: string;
  behance: string;
  git: string;
  city?: string;
  /** Принимает заказы — показывается в каталоге исполнителей. */
  is_performer?: boolean;
  work_format?: PerformerFormat;
  /** Категории услуг исполнителя. */
  categories?: number[];
  /** Цена услуг «от», руб. */
  price_from?: number;
}

/** Где исполнитель готов работать. */
export type PerformerFormat = "remote" | "onsite" | "both";

export type UserUpdate = Partial<
  Pick<
    User,
    | "name"
    | "nickname"
    | "description"
    | "phone"
    | "country"
    | "speciality"
    | "skills"
    | "telegram"
    | "behance"
    | "git"
    | "city"
    | "is_performer"
    | "work_format"
    | "categories"
  >
> & { price_from?: number | null };

export interface SpecialistFilters {
  q?: string;
  categories?: number[];
  format?: "remote" | "onsite";
  city?: string;
}

export interface SpecialistsPage {
  users: User[];
  totalPages: number;
  currentPage: number;
  total: number;
}

/** Каталог исполнителей. */
export function getSpecialists(page: number, filters: SpecialistFilters = {}) {
  return call(
    api.get<SpecialistsPage>("/user/specialists", {
      params: {
        page,
        q: filters.q?.trim() || undefined,
        categories: filters.categories?.length ? filters.categories : undefined,
        format: filters.format || undefined,
        city: filters.city || undefined,
      },
      paramsSerializer: { indexes: null },
    }),
  );
}

export function getMe() {
  // 401 при протухшем токене обрабатывает интерсептор — уведомление не нужно.
  return call(api.get<User>("/user/me", { silent: true }));
}

export function updateMe(data: UserUpdate) {
  return call(api.post<User>("/user/me", data));
}

export function getUserById(id: string) {
  return call(api.get<User>(`/user/${id}`));
}

export function changePassword(password: string, newPassword: string) {
  return call(
    api.post<{ access_token: string }>("/user/change-password", {
      password,
      newPassword,
    }),
  );
}

export function getCountries() {
  return call(api.get<string[]>("/user/countries"));
}

export function setAvatar(data: FormData) {
  return call(api.post<{ avatarUrl: string }>("/user/set_avatar", data));
}
