import { request } from "@/shared/api/core";

import { type ShareRequest } from "./types";

export const shareWorkflowAPI = (
  workflowId: string,
  body: ShareRequest,
): Promise<void> =>
  request<void>({
    url: `/workflows/${workflowId}/share`,
    method: "POST",
    data: body,
  });
