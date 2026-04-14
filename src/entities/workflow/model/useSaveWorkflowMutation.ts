import { useMutation } from "@tanstack/react-query";

import { type MutationPolicyOptions, toMutationMeta } from "@/shared/api";
import type { WorkflowAdapterStoreState } from "@/shared/libs/workflow-adapter";
import { toWorkflowUpdateRequest } from "@/shared/libs/workflow-adapter";

import { workflowApi } from "../api";

import { syncWorkflowCache } from "./workflow-cache-utils";

type SaveWorkflowVariables = {
  workflowId: string;
  store: WorkflowAdapterStoreState;
};

export const useSaveWorkflowMutation = (
  options?: MutationPolicyOptions<
    Awaited<ReturnType<typeof workflowApi.update>>,
    SaveWorkflowVariables
  >,
) =>
  useMutation({
    mutationFn: ({ workflowId, store }: SaveWorkflowVariables) =>
      workflowApi.update(workflowId, toWorkflowUpdateRequest(store)),
    retry: options?.retry,
    meta: toMutationMeta(options),
    onSuccess: async (workflow, variables, onMutateResult, context) => {
      await syncWorkflowCache(workflow);
      await options?.onSuccess?.(workflow, variables, onMutateResult, context);
    },
    onError: async (error, variables, onMutateResult, context) => {
      await options?.onError?.(error, variables, onMutateResult, context);
    },
  });

