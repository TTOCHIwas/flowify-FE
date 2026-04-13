export const workflowKeys = {
  all: () => ["workflow"] as const,
  lists: () => [...workflowKeys.all(), "list"] as const,
  list: (params: { page: number; size: number }) =>
    [...workflowKeys.lists(), params.page, params.size] as const,
  infiniteList: (size: number) =>
    [...workflowKeys.lists(), "infinite", size] as const,
  details: () => [...workflowKeys.all(), "detail"] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  choices: (workflowId: string, prevNodeId: string) =>
    [...workflowKeys.detail(workflowId), "choices", prevNodeId] as const,
} as const;

export const executionKeys = {
  all: () => ["execution"] as const,
  lists: (workflowId: string) =>
    [...executionKeys.all(), "list", workflowId] as const,
  detail: (workflowId: string, executionId: string) =>
    [...executionKeys.all(), "detail", workflowId, executionId] as const,
} as const;

export const templateKeys = {
  all: () => ["template"] as const,
  lists: () => [...templateKeys.all(), "list"] as const,
  list: (category?: string) =>
    category
      ? ([...templateKeys.lists(), { category }] as const)
      : templateKeys.lists(),
  details: () => [...templateKeys.all(), "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
} as const;

export const oauthKeys = {
  all: () => ["oauth"] as const,
  tokens: () => [...oauthKeys.all(), "tokens"] as const,
} as const;
