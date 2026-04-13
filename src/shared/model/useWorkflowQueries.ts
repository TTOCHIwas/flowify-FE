import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import type { WorkflowSummary } from "@/entities/workflow";
import { getWorkflowStatus } from "@/entities/workflow";

import type {
  ChoiceResponse,
  NodeAddRequest,
  NodeSelectionResult,
  WorkflowResponse,
} from "../api";
import { workflowApi } from "../api";
import { workflowKeys } from "../constants";
import { queryClient } from "../libs";
import { toWorkflowUpdateRequest } from "../libs/workflow-adapter";
import type { WorkflowAdapterStoreState } from "../libs/workflow-adapter";
import type { PageResponse } from "../types";

export const useWorkflowListQuery = (page = 0, size = 20, enabled = true) =>
  useQuery({
    queryKey: workflowKeys.list({ page, size }),
    queryFn: () => workflowApi.getList(page, size),
    enabled,
    throwOnError: false,
  });

export const useInfiniteWorkflowListQuery = (size = 20, enabled = true) =>
  useInfiniteQuery({
    queryKey: workflowKeys.infiniteList(size),
    queryFn: ({ pageParam }) => workflowApi.getList(pageParam, size),
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage: PageResponse<WorkflowResponse>) => {
      const nextPage = lastPage.page + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    throwOnError: false,
  });

export const useWorkflowQuery = (id: string | undefined) =>
  useQuery({
    queryKey: id ? workflowKeys.detail(id) : ["workflow", "unknown"],
    queryFn: () => {
      if (!id) {
        throw new Error("workflow id is required");
      }

      return workflowApi.getById(id);
    },
    enabled: Boolean(id),
    throwOnError: false,
  });

export const useSaveWorkflowMutation = () =>
  useMutation({
    mutationFn: ({
      workflowId,
      store,
    }: {
      workflowId: string;
      store: WorkflowAdapterStoreState;
    }) => workflowApi.update(workflowId, toWorkflowUpdateRequest(store)),
    onSuccess: syncWorkflowCache,
  });

export const useToggleWorkflowActiveMutation = () =>
  useMutation({
    mutationFn: ({
      workflowId,
      active,
    }: {
      workflowId: string;
      active: boolean;
    }) =>
      workflowApi.update(workflowId, {
        active,
      }),
    onSuccess: syncWorkflowCache,
  });

const syncWorkflowCache = async (workflow: WorkflowResponse) => {
  queryClient.setQueryData(workflowKeys.detail(workflow.id), workflow);
  await queryClient.invalidateQueries({
    queryKey: workflowKeys.lists(),
  });
};

export const useAddWorkflowNodeMutation = () =>
  useMutation({
    mutationFn: ({
      workflowId,
      body,
    }: {
      workflowId: string;
      body: NodeAddRequest;
    }) => workflowApi.addNode(workflowId, body),
    onSuccess: syncWorkflowCache,
  });

export const useDeleteWorkflowNodeMutation = () =>
  useMutation({
    mutationFn: ({
      workflowId,
      nodeId,
    }: {
      workflowId: string;
      nodeId: string;
    }) => workflowApi.deleteNode(workflowId, nodeId),
    onSuccess: syncWorkflowCache,
  });

export const useWorkflowChoicesQuery = (
  workflowId: string | undefined,
  prevNodeId: string | null,
  enabled = true,
) =>
  useQuery({
    queryKey:
      workflowId && prevNodeId
        ? workflowKeys.choices(workflowId, prevNodeId)
        : ["workflow", "choices", "idle"],
    queryFn: () => {
      if (!workflowId || !prevNodeId) {
        throw new Error("workflow id and prev node id are required");
      }

      return workflowApi.getChoices(workflowId, prevNodeId);
    },
    enabled: Boolean(workflowId && prevNodeId) && enabled,
    throwOnError: false,
  });

export const useSelectWorkflowChoiceMutation = () =>
  useMutation({
    mutationFn: ({
      workflowId,
      prevNodeId,
      selectedOptionId,
      dataType,
      context,
    }: {
      workflowId: string;
      prevNodeId: string;
      selectedOptionId: string;
      dataType: string;
      context?: Record<string, unknown>;
    }) =>
      workflowApi.selectChoice(workflowId, prevNodeId, {
        selectedOptionId,
        dataType,
        context,
      }),
  });

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
