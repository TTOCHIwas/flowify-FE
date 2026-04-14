import { type AuthSessionUser } from "@/shared";

export type AuthUser = AuthSessionUser;

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
