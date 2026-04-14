import { useMutation, useQuery } from "@tanstack/react-query";

import type { WorkflowResponse } from "../api";
import { templateApi } from "../api";
import { QUERY_KEYS } from "../constants";
import { queryClient } from "../libs";

export const useTemplateListQuery = (category?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.templates(category),
    queryFn: () => templateApi.getList(category),
    throwOnError: false,
  });

export const useTemplateQuery = (id: string | undefined) =>
  useQuery({
    queryKey: id ? QUERY_KEYS.template(id) : ["templates", "unknown"],
    queryFn: () => {
      if (!id) {
        throw new Error("template id is required");
      }

      return templateApi.getById(id);
    },
    enabled: Boolean(id),
    throwOnError: false,
  });

export const useInstantiateTemplateMutation = () =>
  useMutation({
    mutationFn: (id: string) => templateApi.instantiate(id),
    onSuccess: async (workflow: WorkflowResponse) => {
      queryClient.setQueryData(QUERY_KEYS.workflow(workflow.id), workflow);
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workflows,
      });
    },
  });

export const useCreateTemplateMutation = () =>
  useMutation({
    mutationFn: (body: Parameters<typeof templateApi.create>[0]) =>
      templateApi.create(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.templates(),
      });
    },
  });
