import type { Edge, Node } from "@xyflow/react";

import type { FlowNodeData } from "@/entities/node";

// ─── 워크플로우 상태 ─────────────────────────────────────────
export type WorkflowStatus = "active" | "inactive";

export type ExecutionStatus = "idle" | "running" | "success" | "failed";

// ─── 워크플로우 엔티티 ───────────────────────────────────────
export interface Workflow {
  id: string;
  name: string;
  status: WorkflowStatus;
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

/** 목록 화면용 요약 타입 */
export type WorkflowSummary = Pick<
  Workflow,
  "id" | "name" | "status" | "createdAt" | "updatedAt"
>;
