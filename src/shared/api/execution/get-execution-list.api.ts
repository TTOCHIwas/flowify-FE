import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { ExecutionDetail } from "./types";

export const getExecutionListAPI = async (
  workflowId: string,
): Promise<ExecutionDetail[]> => {
  const { data } = await apiClient.get<ApiResponse<ExecutionDetail[]>>(
    `/workflows/${workflowId}/executions`,
  );

  return processApiResponse(data);
};
