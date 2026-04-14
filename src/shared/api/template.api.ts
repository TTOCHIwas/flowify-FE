import type { ApiResponse } from "../types";
import { processApiResponse } from "../utils";

import { apiClient } from "./client";
import type { WorkflowResponse } from "./workflow.api";

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  category: string | null;
  icon?: string | null;
  requiredServices: string[];
  isSystem: boolean;
  authorId?: string | null;
  useCount: number;
  createdAt: string;
}

export interface TemplateDetail extends TemplateSummary {
  nodes: import("./workflow.api").NodeDefinitionResponse[];
  edges: import("./workflow.api").EdgeDefinitionResponse[];
}

export interface CreateTemplateRequest {
  workflowId: string;
  name: string;
  description?: string | null;
  category: string;
  icon?: string | null;
}

export const templateApi = {
  getList: async (category?: string) => {
    const { data } = await apiClient.get<ApiResponse<TemplateSummary[]>>(
      "/templates",
      {
        params: category ? { category } : undefined,
      },
    );

    return processApiResponse(data);
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<TemplateDetail>>(
      `/templates/${id}`,
    );

    return processApiResponse(data);
  },

  instantiate: async (id: string) => {
    const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
      `/templates/${id}/instantiate`,
    );

    return processApiResponse(data);
  },

  create: async (body: CreateTemplateRequest) => {
    const { data } = await apiClient.post<ApiResponse<TemplateDetail>>(
      "/templates",
      body,
    );

    return processApiResponse(data);
  },
};
