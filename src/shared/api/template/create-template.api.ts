import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { CreateTemplateRequest, TemplateDetail } from "./types";

export const createTemplateAPI = async (
  body: CreateTemplateRequest,
): Promise<TemplateDetail> => {
  const { data } = await apiClient.post<ApiResponse<TemplateDetail>>(
    "/templates",
    body,
  );

  return processApiResponse(data);
};
