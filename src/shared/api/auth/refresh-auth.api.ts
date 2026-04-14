import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { LoginResponse } from "./types";

export const refreshAuthAPI = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/refresh",
    {
      refreshToken,
    },
  );

  return processApiResponse(data);
};
