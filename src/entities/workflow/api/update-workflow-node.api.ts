import { request } from "@/shared/api/core";

import { type NodeUpdateRequest, type WorkflowResponse } from "./types";

export const updateWorkflowNodeAPI = (
  workflowId: string,
  nodeId: string,
  body: NodeUpdateRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: `/workflows/${workflowId}/nodes/${nodeId}`,
    method: "PUT",
    data: body,
  });
