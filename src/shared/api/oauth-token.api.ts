import type { ApiResponse } from "../types";
import { processApiResponse } from "../utils";

import { apiClient } from "./client";

export interface OAuthTokenSummary {
  service: string;
  connected: boolean;
  accountEmail: string | null;
  expiresAt: string | null;
}

export interface OAuthConnectResponse {
  authUrl: string;
}

export const oauthApi = {
  getTokens: async () => {
    const { data } =
      await apiClient.get<ApiResponse<OAuthTokenSummary[]>>("/oauth-tokens");

    return processApiResponse(data);
  },

  connect: async (service: string) => {
    const { data } = await apiClient.post<ApiResponse<OAuthConnectResponse>>(
      `/oauth-tokens/${service}/connect`,
    );

    return processApiResponse(data);
  },

  disconnect: async (service: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `/oauth-tokens/${service}`,
    );

    return processApiResponse(data);
  },
};
