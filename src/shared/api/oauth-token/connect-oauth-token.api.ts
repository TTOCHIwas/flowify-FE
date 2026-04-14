import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { OAuthConnectResponse } from "./types";

export const connectOAuthTokenAPI = async (
  service: string,
): Promise<OAuthConnectResponse> => {
  const { data } = await apiClient.post<ApiResponse<OAuthConnectResponse>>(
    `/oauth-tokens/${service}/connect`,
  );

  return processApiResponse(data);
};
