import { request } from "../core";

import type { InstantiateTemplateResponse } from "./types";

export const instantiateTemplateAPI = (
  id: string,
): Promise<InstantiateTemplateResponse> =>
  request<InstantiateTemplateResponse>({
    url: `/templates/${id}/instantiate`,
    method: "POST",
  });
