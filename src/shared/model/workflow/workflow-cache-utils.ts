import type { WorkflowSummary } from "@/entities/workflow";
import { getWorkflowStatus } from "@/entities/workflow";
import type {
  ChoiceResponse,
  NodeSelectionResult,
  WorkflowResponse,
} from "@/entities/workflow";
import { executionKeys, workflowKeys } from "../../constants";
import { queryClient } from "../../libs";

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
