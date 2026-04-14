import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { OAuthTokenSummary } from "./types";

export const getOAuthTokensAPI = async (): Promise<OAuthTokenSummary[]> => {
  const { data } =
    await apiClient.get<ApiResponse<OAuthTokenSummary[]>>("/oauth-tokens");

  return processApiResponse(data);
};
