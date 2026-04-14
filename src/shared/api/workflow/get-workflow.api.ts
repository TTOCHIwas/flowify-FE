import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { WorkflowResponse } from "./types";

export const getWorkflowAPI = async (id: string): Promise<WorkflowResponse> => {
  const { data } = await apiClient.get<ApiResponse<WorkflowResponse>>(
    `/workflows/${id}`,
  );

  return processApiResponse(data);
};
