import { executionKeys } from "@/shared/constants";
import { queryClient } from "@/shared/libs";
import type {
  WorkflowSummary,
} from "./types";
import { getWorkflowStatus } from "./types";
import type {
  ChoiceResponse,
  NodeSelectionResult,
  WorkflowResponse,
} from "../api";

import { workflowKeys } from "./query-keys";

export const cacheWorkflowDetail = (workflow: WorkflowResponse) => {
  queryClient.setQueryData(workflowKeys.detail(workflow.id), workflow);
};

export const invalidateWorkflowLists = async () => {
  await queryClient.invalidateQueries({
    queryKey: workflowKeys.lists(),
  });
};

export const syncWorkflowCache = async (workflow: WorkflowResponse) => {
  cacheWorkflowDetail(workflow);
  await invalidateWorkflowLists();
};

export const removeWorkflowDomainCache = async (workflowId: string) => {
  queryClient.removeQueries({
    queryKey: workflowKeys.detail(workflowId),
  });
  queryClient.removeQueries({
    queryKey: workflowKeys.choicesRoot(workflowId),
  });
  queryClient.removeQueries({
    queryKey: executionKeys.workflow(workflowId),
  });
  await invalidateWorkflowLists();
};

export const toWorkflowSummary = (
  workflow: WorkflowResponse,
): WorkflowSummary => ({
  id: workflow.id,
  name: workflow.name,
  description: workflow.description,
  active: workflow.active,
  status: getWorkflowStatus(workflow.active),
  createdAt: workflow.createdAt,
  updatedAt: workflow.updatedAt,
});

export type WorkflowChoiceData = ChoiceResponse;
export type WorkflowChoiceResult = NodeSelectionResult;
