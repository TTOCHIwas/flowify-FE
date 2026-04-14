import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

export const rollbackExecutionAPI = async (
  workflowId: string,
  executionId: string,
  nodeId?: string,
): Promise<void> => {
  const { data } = await apiClient.post<ApiResponse<void>>(
    `/workflows/${workflowId}/executions/${executionId}/rollback`,
    undefined,
    {
      params: nodeId ? { nodeId } : undefined,
    },
  );

  return processApiResponse(data);
};
