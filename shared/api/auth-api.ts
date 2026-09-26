import { api, call } from ".";

export interface RegisterData {
  /** На форме регистрации имени нет — бэкенд возьмёт часть почты до @. */
  name?: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
}

export function register(data: RegisterData) {
  return call(api.post<TokenResponse>("/auth/register", data));
}

export function login(data: LoginData) {
  return call(api.post<TokenResponse>("/auth/login", data));
}

export function verifyEmail(email: string, token: string) {
  return call(api.post<TokenResponse>("/auth/verify", { email, token }));
}

export function resendVerification() {
  return call(api.post<{ ok: true }>("/auth/verify/resend"));
}

/** Восстановление пароля, шаг 1: код на почту. */
export function requestRecovery(email: string) {
  return call(api.post<{ ok: true }>("/auth/recovery", { email }));
}

/** Шаг 2: проверить код, не меняя пароль. */
export function checkRecoveryCode(email: string, code: string) {
  return call(api.post<{ ok: true }>("/auth/recovery/verify", { email, code }));
}

/** Шаг 3: новый пароль. В ответе — токен, пользователь сразу входит. */
export function resetPassword(email: string, code: string, password: string) {
  return call(api.post<TokenResponse>("/auth/recovery/reset", { email, code, password }));
}
