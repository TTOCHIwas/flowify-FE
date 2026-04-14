import type { ApiResponse } from "../types";
import { processApiResponse } from "../utils";

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
  exchange: async (exchangeCode: string) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/exchange",
      {
        exchangeCode,
      },
    );

    return processApiResponse(data);
  },

  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/refresh",
      {
        refreshToken,
      },
    );

    return processApiResponse(data);
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<void>>("/auth/logout");

    return processApiResponse(data);
  },
};
