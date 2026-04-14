import { request } from "@/shared/api/core";

import type { WorkflowListResponse } from "./types";

export const getWorkflowListAPI = (
  page = 0,
  size = 20,
): Promise<WorkflowListResponse> =>
  request<WorkflowListResponse>({
    url: "/workflows",
    method: "GET",
    params: { page, size },
  });
