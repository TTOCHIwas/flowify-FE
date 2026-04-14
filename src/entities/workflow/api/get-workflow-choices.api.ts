import { request } from "@/shared/api/core";

import { type ChoiceResponse } from "./types";

export const getWorkflowChoicesAPI = (
  workflowId: string,
  prevNodeId: string,
): Promise<ChoiceResponse> =>
  request<ChoiceResponse>({
    url: `/workflows/${workflowId}/choices/${prevNodeId}`,
    method: "GET",
  });
