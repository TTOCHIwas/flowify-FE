import type { TriggerConfig, Workflow } from "@/entities/workflow";

import type { ApiResponse, PageResponse, ValidationWarning } from "../types";
import { processApiResponse } from "../utils";

import { apiClient } from "./client";

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  nodes?: NodeDefinitionResponse[];
  edges?: EdgeDefinitionResponse[];
  trigger?: TriggerConfig | null;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  nodes?: NodeDefinitionResponse[];
  edges?: EdgeDefinitionResponse[];
  trigger?: TriggerConfig | null;
  active?: boolean;
}

export type NodeDefinitionRole = "start" | "end" | "middle";

export interface NodeDefinitionResponse {
  id: string;
  category?: string;
  type: string;
  label?: string;
  role: NodeDefinitionRole;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  dataType: string | null;
  outputDataType: string | null;
  authWarning: boolean;
}

export interface EdgeDefinitionResponse {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface WorkflowResponse extends Omit<Workflow, "nodes" | "edges"> {
  nodes: NodeDefinitionResponse[];
  edges: EdgeDefinitionResponse[];
  warnings?: ValidationWarning[];
}

export interface NodeAddRequest {
  category: string;
  type: string;
  position: { x: number; y: number };
  config?: Record<string, unknown>;
  dataType?: string | null;
  outputDataType?: string | null;
  role?: NodeDefinitionRole;
  authWarning?: boolean;
  prevNodeId?: string;
}

export interface NodeUpdateRequest {
  category?: string;
  type?: string;
  config?: Record<string, unknown>;
  position?: { x: number; y: number };
  dataType?: string | null;
  outputDataType?: string | null;
  role?: NodeDefinitionRole;
  authWarning?: boolean;
}

export interface NodeChoiceSelectRequest {
  selectedOptionId: string;
  dataType: string;
  context?: Record<string, unknown>;
}

export interface ShareRequest {
  userIds: string[];
}

export interface WorkflowGenerateRequest {
  prompt: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  type?: string | null;
  node_type?: string | null;
  output_data_type?: string | null;
  priority?: number | null;
}

export interface ChoiceFollowUp {
  question: string;
  options: ChoiceOption[];
  options_source?: string | null;
  multi_select?: boolean | null;
  description?: string | null;
}

export type ChoiceBranchConfig = ChoiceFollowUp;

export interface ChoiceResponse {
  question: string;
  options: ChoiceOption[];
  requiresProcessingMethod: boolean;
  multiSelect?: boolean | null;
}

export interface NodeSelectionResult {
  nodeType: string | null;
  outputDataType: string | null;
  followUp?: ChoiceFollowUp | null;
  branchConfig?: ChoiceBranchConfig | null;
}

export const workflowApi = {
  getList: async (page = 0, size = 20) => {
    const { data } = await apiClient.get<
      ApiResponse<PageResponse<WorkflowResponse>>
    >("/workflows", {
      params: { page, size },
    });

    return processApiResponse(data);
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<WorkflowResponse>>(
      `/workflows/${id}`,
    );

    return processApiResponse(data);
  },

  create: async (body: CreateWorkflowRequest) => {
    const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
      "/workflows",
      body,
    );

    return processApiResponse(data);
  },

  update: async (id: string, body: UpdateWorkflowRequest) => {
    const { data } = await apiClient.put<ApiResponse<WorkflowResponse>>(
      `/workflows/${id}`,
      body,
    );

    return processApiResponse(data);
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      `/workflows/${id}`,
    );

    return processApiResponse(data);
  },

  addNode: async (workflowId: string, body: NodeAddRequest) => {
    const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
      `/workflows/${workflowId}/nodes`,
      body,
    );

    return processApiResponse(data);
  },

  updateNode: async (
    workflowId: string,
    nodeId: string,
    body: NodeUpdateRequest,
  ) => {
    const { data } = await apiClient.put<ApiResponse<WorkflowResponse>>(
      `/workflows/${workflowId}/nodes/${nodeId}`,
      body,
    );

    return processApiResponse(data);
  },

  deleteNode: async (workflowId: string, nodeId: string) => {
    const { data } = await apiClient.delete<ApiResponse<WorkflowResponse>>(
      `/workflows/${workflowId}/nodes/${nodeId}`,
    );

    return processApiResponse(data);
  },

  getChoices: async (workflowId: string, prevNodeId: string) => {
    const { data } = await apiClient.get<ApiResponse<ChoiceResponse>>(
      `/workflows/${workflowId}/choices/${prevNodeId}`,
    );

    return processApiResponse(data);
  },

  selectChoice: async (
    workflowId: string,
    prevNodeId: string,
    body: NodeChoiceSelectRequest,
  ) => {
    const { data } = await apiClient.post<ApiResponse<NodeSelectionResult>>(
      `/workflows/${workflowId}/choices/${prevNodeId}/select`,
      body,
    );

    return processApiResponse(data);
  },

  share: async (workflowId: string, body: ShareRequest) => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      `/workflows/${workflowId}/share`,
      body,
    );

    return processApiResponse(data);
  },

  generate: async (body: WorkflowGenerateRequest) => {
    const { data } = await apiClient.post<ApiResponse<WorkflowResponse>>(
      "/workflows/generate",
      body,
    );

    return processApiResponse(data);
  },
};
