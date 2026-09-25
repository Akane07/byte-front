import { api, call } from ".";

export interface RegisterData {
  name: string;
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
