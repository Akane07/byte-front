import axios, { type AxiosResponse } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Не показывать пользователю уведомление об ошибке этого запроса. */
    silent?: boolean;
  }
}

const TOKEN_KEY = "byte-accessToken";

/** Адрес бэкенда. Задаётся плагином plugins/api.ts из runtimeConfig. */
let apiOrigin = "";

export const api = axios.create({ timeout: 10000 });

export function setApiOrigin(origin: string) {
  apiOrigin = origin.replace(/\/$/, "");
  api.defaults.baseURL = `${apiOrigin}/api/v1`;
}

export function getApiOrigin() {
  return apiOrigin;
}

export function getToken(): string | null {
  return import.meta.client ? localStorage.getItem(TOKEN_KEY) : null;
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Текст ошибки из ответа NestJS: message бывает строкой или массивом строк. */
export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Сервер недоступен. Проверьте подключение к интернету";
    }
    const message = (error.response.data as { message?: unknown })?.message;
    if (Array.isArray(message)) return message.join(". ");
    if (typeof message === "string") return message;
  }
  return "Что-то пошло не так. Попробуйте ещё раз";
}

/**
 * Возвращает данные ответа или null при ошибке. Уведомление об ошибке
 * уже показал интерсептор из plugins/api.ts, поэтому вызывающему коду
 * достаточно проверить результат на null.
 */
export async function call<T>(request: Promise<AxiosResponse<T>>): Promise<T | null> {
  try {
    const { data } = await request;
    return data;
  } catch {
    return null;
  }
}
