import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { WorkflowGenerateRequest, WorkflowResponse } from "./types";

export const generateWorkflowAPI = async (
  body: WorkflowGenerateRequest,
): Promise<WorkflowResponse> => {
  const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
    "/workflows/generate",
    body,
  );

  return processApiResponse(data);
};
