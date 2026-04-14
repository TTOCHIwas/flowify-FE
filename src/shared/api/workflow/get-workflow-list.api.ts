import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { WorkflowListResponse } from "./types";

export const getWorkflowListAPI = async (
  page = 0,
  size = 20,
): Promise<WorkflowListResponse> => {
  const { data } = await apiClient.get<ApiResponse<WorkflowListResponse>>(
    "/workflows",
    {
      params: { page, size },
    },
  );

  return processApiResponse(data);
};
