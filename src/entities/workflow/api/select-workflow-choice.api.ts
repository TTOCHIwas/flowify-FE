import { request } from "@/shared/api/core";

import { type NodeChoiceSelectRequest, type NodeSelectionResult } from "./types";

export const selectWorkflowChoiceAPI = (
  workflowId: string,
  prevNodeId: string,
  body: NodeChoiceSelectRequest,
): Promise<NodeSelectionResult> =>
  request<NodeSelectionResult>({
    url: `/workflows/${workflowId}/choices/${prevNodeId}/select`,
    method: "POST",
    data: body,
  });
