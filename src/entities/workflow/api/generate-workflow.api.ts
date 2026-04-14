import { request } from "@/shared/api/core";

import { type WorkflowGenerateRequest, type WorkflowResponse } from "./types";

export const generateWorkflowAPI = (
  body: WorkflowGenerateRequest,
): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: "/workflows/generate",
    method: "POST",
    data: body,
  });
