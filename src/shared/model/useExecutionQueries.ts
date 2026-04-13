import { useMutation, useQuery } from "@tanstack/react-query";

import { executionApi } from "../api";
import { executionKeys } from "../constants";
import { queryClient } from "../libs";

import type { ExecutionStatus } from "./workflowStore";

const POLL_INTERVAL_MS = Number(
  import.meta.env.VITE_EXECUTION_POLL_INTERVAL_MS ?? 3000,
);

export const normalizeExecutionStatus = (
  state: string | null | undefined,
): ExecutionStatus => {
  const normalized = state?.toLowerCase() ?? "";

  if (normalized.includes("success") || normalized.includes("complete")) {
    return "success" as const;
  }

  if (normalized.includes("fail") || normalized.includes("error")) {
    return "failed" as const;
  }

  if (normalized.includes("run")) {
    return "running" as const;
  }

  if (normalized.includes("pending") || normalized.includes("queue")) {
    return "running" as const;
  }

  return "idle" as const;
};

export const isExecutionInFlight = (state: string | null | undefined) => {
  const normalized = state?.toLowerCase() ?? "";

  return (
    normalized.includes("pending") ||
    normalized.includes("queue") ||
    normalized.includes("run")
  );
};

export const useWorkflowExecutionsQuery = (
  workflowId: string | undefined,
  enabled = true,
) =>
  useQuery({
    queryKey: workflowId
      ? executionKeys.lists(workflowId)
      : ["execution", "unknown"],
    queryFn: () => {
      if (!workflowId) {
        throw new Error("workflow id is required");
      }

      return executionApi.getList(workflowId);
    },
    enabled: Boolean(workflowId) && enabled,
    refetchInterval: (query) => {
      const executions = query.state.data;
      if (!executions?.length) {
        return false;
      }

      const isRunning = executions.some((execution) =>
        isExecutionInFlight(execution.state),
      );

      return isRunning ? POLL_INTERVAL_MS : false;
    },
    throwOnError: false,
  });

export const useWorkflowExecutionQuery = (
  workflowId: string | undefined,
  executionId: string | undefined,
  enabled = true,
) =>
  useQuery({
    queryKey:
      workflowId && executionId
        ? executionKeys.detail(workflowId, executionId)
        : ["execution", "detail", "unknown"],
    queryFn: () => {
      if (!workflowId || !executionId) {
        throw new Error("workflow id and execution id are required");
      }

      return executionApi.getById(workflowId, executionId);
    },
    enabled: Boolean(workflowId && executionId) && enabled,
    refetchInterval: (query) => {
      const execution = query.state.data;
      if (!execution) {
        return false;
      }

      return isExecutionInFlight(execution.state) ? POLL_INTERVAL_MS : false;
    },
    throwOnError: false,
  });

export const useExecuteWorkflowMutation = () =>
  useMutation({
    mutationFn: (workflowId: string) => executionApi.execute(workflowId),
    onSuccess: async (_, workflowId) => {
      await queryClient.invalidateQueries({
        queryKey: executionKeys.lists(workflowId),
      });
    },
  });

export const useRollbackExecutionMutation = () =>
  useMutation({
    mutationFn: ({
      workflowId,
      executionId,
      nodeId,
    }: {
      workflowId: string;
      executionId: string;
      nodeId?: string;
    }) => executionApi.rollback(workflowId, executionId, nodeId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: executionKeys.lists(variables.workflowId),
      });
    },
  });

export const getLatestExecution = <T extends { startedAt: string | null }>(
  executions: T[] | undefined,
) =>
  executions?.slice().sort((left, right) => {
    const leftTime = left.startedAt ? new Date(left.startedAt).getTime() : 0;
    const rightTime = right.startedAt ? new Date(right.startedAt).getTime() : 0;

    return rightTime - leftTime;
  })[0] ?? null;
