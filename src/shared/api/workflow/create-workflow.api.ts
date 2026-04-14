import { request } from "../core";

import type { CreateWorkflowRequest, WorkflowResponse } from "./types";

export const createWorkflowAPI = (
  body: CreateWorkflowRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: "/workflows",
    method: "POST",
    data: body,
  });
