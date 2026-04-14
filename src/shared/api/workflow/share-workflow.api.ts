import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { ShareRequest } from "./types";

export const shareWorkflowAPI = async (
  workflowId: string,
  body: ShareRequest,
): Promise<void> => {
  const { data } = await apiClient.post<ApiResponse<void>>(
    `/workflows/${workflowId}/share`,
    body,
  );

  return processApiResponse(data);
};
