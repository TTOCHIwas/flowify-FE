import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { CreateWorkflowRequest, WorkflowResponse } from "./types";

export const createWorkflowAPI = async (
  body: CreateWorkflowRequest,
): Promise<WorkflowResponse> => {
  const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
    "/workflows",
    body,
  );

  return processApiResponse(data);
};
