import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { ChoiceResponse } from "./types";

export const getWorkflowChoicesAPI = async (
  workflowId: string,
  prevNodeId: string,
): Promise<ChoiceResponse> => {
  const { data } = await apiClient.get<ApiResponse<ChoiceResponse>>(
    `/workflows/${workflowId}/choices/${prevNodeId}`,
  );

  return processApiResponse(data);
};
