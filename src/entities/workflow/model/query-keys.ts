export const workflowKeys = {
  all: () => ["workflow"] as const,
  lists: () => [...workflowKeys.all(), "list"] as const,
  list: (params: { page: number; size: number }) =>
    [...workflowKeys.lists(), params.page, params.size] as const,
  infiniteList: (size: number) =>
    [...workflowKeys.lists(), "infinite", size] as const,
  details: () => [...workflowKeys.all(), "detail"] as const,
  detail: (id: string) => [...workflowKeys.details(), id] as const,
  choicesRoot: (workflowId: string) =>
    [...workflowKeys.detail(workflowId), "choices"] as const,
  choice: (workflowId: string, prevNodeId: string) =>
    [...workflowKeys.choicesRoot(workflowId), prevNodeId] as const,
} as const;
