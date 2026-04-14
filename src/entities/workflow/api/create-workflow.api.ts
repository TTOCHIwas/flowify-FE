import { request } from "@/shared/api/core";

import { type CreateWorkflowRequest, type WorkflowResponse } from "./types";

export const createWorkflowAPI = (
  body: CreateWorkflowRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: "/workflows",
    method: "POST",
    data: body,
  });
