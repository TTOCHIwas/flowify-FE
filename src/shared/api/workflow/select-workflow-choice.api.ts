import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { NodeChoiceSelectRequest, NodeSelectionResult } from "./types";

export const selectWorkflowChoiceAPI = async (
  workflowId: string,
  prevNodeId: string,
  body: NodeChoiceSelectRequest,
): Promise<NodeSelectionResult> => {
  const { data } = await apiClient.post<ApiResponse<NodeSelectionResult>>(
    `/workflows/${workflowId}/choices/${prevNodeId}/select`,
    body,
  );

  return processApiResponse(data);
};
