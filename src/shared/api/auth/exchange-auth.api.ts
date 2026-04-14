import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { LoginResponse } from "./types";

export const exchangeAuthAPI = async (
  exchangeCode: string,
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/exchange",
    {
      exchangeCode,
    },
  );

  return processApiResponse(data);
};
