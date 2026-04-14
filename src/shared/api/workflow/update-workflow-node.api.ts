import { request } from "../core";

import type { NodeUpdateRequest, WorkflowResponse } from "./types";

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
