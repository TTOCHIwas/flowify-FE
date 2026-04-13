import { request } from "../core";

import type { UpdateWorkflowRequest, WorkflowResponse } from "./types";

export const updateWorkflowAPI = (
  id: string,
  body: UpdateWorkflowRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: `/workflows/${id}`,
    method: "PUT",
    data: body,
  });
