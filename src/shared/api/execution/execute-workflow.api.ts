import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

export const executeWorkflowAPI = async (
  workflowId: string,
): Promise<string> => {
  const { data } = await apiClient.post<ApiResponse<string>>(
    `/workflows/${workflowId}/execute`,
  );

  return processApiResponse(data);
};
