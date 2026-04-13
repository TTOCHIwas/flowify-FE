import { request } from "../core";

export const executeWorkflowAPI = (workflowId: string): Promise<string> =>
  request<string>({
    url: `/workflows/${workflowId}/execute`,
    method: "POST",
  });
