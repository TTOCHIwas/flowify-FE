import type {
  EdgeDefinitionResponse,
  NodeDefinitionResponse,
  WorkflowResponse,
} from "@/shared/api";

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
  nodes: NodeDefinitionResponse[];
  edges: EdgeDefinitionResponse[];
}

export interface CreateTemplateRequest {
  workflowId: string;
  name: string;
  description?: string | null;
  category: string;
  icon?: string | null;
}

export type InstantiateTemplateResponse = WorkflowResponse;
