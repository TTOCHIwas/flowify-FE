import { request } from "@/shared/api/core";

export const deleteWorkflowAPI = (id: string): Promise<void> =>
  request<void>({
    url: `/workflows/${id}`,
    method: "DELETE",
  });
