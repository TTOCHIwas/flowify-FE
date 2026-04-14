import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

export const logoutAuthAPI = async (): Promise<void> => {
  const { data } = await apiClient.post<ApiResponse<void>>("/auth/logout");

  return processApiResponse(data);
};
