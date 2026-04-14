import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { NodeUpdateRequest, WorkflowResponse } from "./types";

export const updateWorkflowNodeAPI = async (
  workflowId: string,
  nodeId: string,
  body: NodeUpdateRequest,
): Promise<WorkflowResponse> => {
  const { data } = await apiClient.put<ApiResponse<WorkflowResponse>>(
    `/workflows/${workflowId}/nodes/${nodeId}`,
    body,
  );

  return processApiResponse(data);
};
