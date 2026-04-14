import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { NodeAddRequest, WorkflowResponse } from "./types";

export const addWorkflowNodeAPI = async (
  workflowId: string,
  body: NodeAddRequest,
): Promise<WorkflowResponse> => {
  const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
    `/workflows/${workflowId}/nodes`,
    body,
  );

  return processApiResponse(data);
};
