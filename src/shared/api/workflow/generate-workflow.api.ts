import { request } from "../core";

import type { WorkflowGenerateRequest, WorkflowResponse } from "./types";

export const generateWorkflowAPI = (
  body: WorkflowGenerateRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: "/workflows/generate",
    method: "POST",
    data: body,
  });
