import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { WorkflowResponse } from "./types";

export const deleteWorkflowNodeAPI = async (
  workflowId: string,
  nodeId: string,
): Promise<WorkflowResponse> => {
  const { data } = await apiClient.delete<ApiResponse<WorkflowResponse>>(
    `/workflows/${workflowId}/nodes/${nodeId}`,
  );

  return processApiResponse(data);
};
