import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { TemplateDetail } from "./types";

export const getTemplateAPI = async (id: string): Promise<TemplateDetail> => {
  const { data } = await apiClient.get<ApiResponse<TemplateDetail>>(
    `/templates/${id}`,
  );

  return processApiResponse(data);
};
