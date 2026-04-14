import { request } from "@/shared/api/core";

import { type WorkflowResponse } from "./types";

export const deleteWorkflowNodeAPI = (
  workflowId: string,
  nodeId: string,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: `/workflows/${workflowId}/nodes/${nodeId}`,
    method: "DELETE",
  });
