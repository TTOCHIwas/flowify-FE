import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

export const deleteWorkflowAPI = async (id: string): Promise<void> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(
    `/workflows/${id}`,
  );

  return processApiResponse(data);
};
