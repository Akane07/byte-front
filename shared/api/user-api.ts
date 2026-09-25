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
}

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
  >
>;

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
