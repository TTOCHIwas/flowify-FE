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
