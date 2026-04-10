import type { ApiResponse } from "../types";

import { apiClient } from "./client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authApi = {
  exchange: (exchangeCode: string) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/exchange", {
      exchangeCode,
    }),

  refresh: (refreshToken: string) =>
    apiClient.post<ApiResponse<LoginResponse>>("/auth/refresh", {
      refreshToken,
    }),

  logout: () => apiClient.post<ApiResponse<void>>("/auth/logout"),
};
