import { request } from "../core";

import type { NodeAddRequest, WorkflowResponse } from "./types";

export const addWorkflowNodeAPI = (
  workflowId: string,
  body: NodeAddRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: `/workflows/${workflowId}/nodes`,
    method: "POST",
    data: body,
  });
