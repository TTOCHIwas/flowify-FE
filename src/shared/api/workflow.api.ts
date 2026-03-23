import type { ApiResponse } from "../types";

import { apiClient } from "./client";

// ─── 타입 ───────────────────────────────────────────────
export type WorkflowStatus = "active" | "inactive";

export interface WorkflowSummary {
  id: string;
  name: string;
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
}

// nodes / edges의 상세 타입은 entities/node에서 정의된 후 교체 예정
export interface WorkflowDetail extends WorkflowSummary {
  nodes: unknown[];
  edges: unknown[];
}

export interface CreateWorkflowRequest {
  name: string;
}

export interface UpdateWorkflowRequest {
  name?: string;
  nodes?: unknown[];
  edges?: unknown[];
}

export interface ExecuteWorkflowResponse {
  executionId: string;
  status: "pending" | "running";
}

// ─── API ────────────────────────────────────────────────
export const workflowApi = {
  /** 워크플로우 목록 조회 */
  getList: () => apiClient.get<ApiResponse<WorkflowSummary[]>>("/workflows"),

  /** 워크플로우 상세 조회 */
  getById: (id: string) =>
    apiClient.get<ApiResponse<WorkflowDetail>>(`/workflows/${id}`),

  /** 워크플로우 생성 */
  create: (body: CreateWorkflowRequest) =>
    apiClient.post<ApiResponse<WorkflowDetail>>("/workflows", body),

  /** 워크플로우 수정 (노드/엣지 저장 포함) */
  update: (id: string, body: UpdateWorkflowRequest) =>
    apiClient.put<ApiResponse<WorkflowDetail>>(`/workflows/${id}`, body),

  /** 워크플로우 삭제 */
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/workflows/${id}`),

  /** 워크플로우 실행 */
  execute: (id: string) =>
    apiClient.post<ApiResponse<ExecuteWorkflowResponse>>(
      `/workflows/${id}/execute`,
    ),
};
