import { request } from "@/shared/api/core";

import { type TemplateSummary } from "./types";

export const getTemplateListAPI = (
  category?: string,
): Promise<TemplateSummary[]> =>
  request<TemplateSummary[]>({
    url: "/templates",
    method: "GET",
    params: category ? { category } : undefined,
  });
