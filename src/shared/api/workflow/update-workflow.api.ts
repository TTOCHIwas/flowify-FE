import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { UpdateWorkflowRequest, WorkflowResponse } from "./types";

export const updateWorkflowAPI = async (
  id: string,
  body: UpdateWorkflowRequest,
): Promise<WorkflowResponse> => {
  const { data } = await apiClient.put<ApiResponse<WorkflowResponse>>(
    `/workflows/${id}`,
    body,
  );

  return processApiResponse(data);
};
