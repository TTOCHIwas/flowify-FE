import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { TemplateSummary } from "./types";

export const getTemplateListAPI = async (
  category?: string,
): Promise<TemplateSummary[]> => {
  const { data } = await apiClient.get<ApiResponse<TemplateSummary[]>>(
    "/templates",
    {
      params: category ? { category } : undefined,
    },
  );

  return processApiResponse(data);
};
