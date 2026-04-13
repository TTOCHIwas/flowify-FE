import { request } from "../core";

import type { WorkflowResponse } from "./types";

export const getWorkflowAPI = (id: string): Promise<WorkflowResponse> =>
  request<WorkflowResponse>({
    url: `/workflows/${id}`,
    method: "GET",
  });
