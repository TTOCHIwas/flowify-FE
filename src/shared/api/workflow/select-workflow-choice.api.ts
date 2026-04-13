import { request } from "../core";

import type { NodeChoiceSelectRequest, NodeSelectionResult } from "./types";

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
