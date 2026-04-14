import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { ExecutionDetail } from "./types";

export const getExecutionAPI = async (
  workflowId: string,
  executionId: string,
): Promise<ExecutionDetail> => {
  const { data } = await apiClient.get<ApiResponse<ExecutionDetail>>(
    `/workflows/${workflowId}/executions/${executionId}`,
  );

  return processApiResponse(data);
};
