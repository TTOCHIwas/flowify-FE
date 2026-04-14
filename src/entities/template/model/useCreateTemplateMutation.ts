import { useMutation } from "@tanstack/react-query";

import { type MutationPolicyOptions, toMutationMeta } from "@/shared/api";
import { queryClient } from "@/shared";

import { templateApi } from "../api";
import { templateKeys } from "./query-keys";

export const useCreateTemplateMutation = (
  options?: MutationPolicyOptions<
    Awaited<ReturnType<typeof templateApi.create>>,
    Parameters<typeof templateApi.create>[0]
  >,
) =>
  useMutation({
    mutationFn: (body: Parameters<typeof templateApi.create>[0]) =>
      templateApi.create(body),
    retry: options?.retry,
    meta: toMutationMeta(options),
    onSuccess: async (template, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({
        queryKey: templateKeys.lists(),
      });
      await options?.onSuccess?.(template, variables, onMutateResult, context);
    },
    onError: async (error, variables, onMutateResult, context) => {
      await options?.onError?.(error, variables, onMutateResult, context);
    },
  });

