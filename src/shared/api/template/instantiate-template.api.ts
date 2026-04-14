import type { ApiResponse } from "../../types";
import { processApiResponse } from "../../utils";
import { apiClient } from "../client";

import type { InstantiateTemplateResponse } from "./types";

export const instantiateTemplateAPI = async (
  id: string,
): Promise<InstantiateTemplateResponse> => {
  const { data } = await apiClient.post<
    ApiResponse<InstantiateTemplateResponse>
  >(`/templates/${id}/instantiate`);

  return processApiResponse(data);
};
