import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

export const disconnectOAuthTokenAPI = async (
  service: string,
): Promise<void> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/oauth-tokens/${service}`,
  );

  return processApiResponse(data);
};
