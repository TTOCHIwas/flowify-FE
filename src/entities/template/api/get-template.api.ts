import { request } from "@/shared/api/core";

import { type TemplateDetail } from "./types";

export const getTemplateAPI = (id: string): Promise<TemplateDetail> =>
  request<TemplateDetail>({
    url: `/templates/${id}`,
    method: "GET",
  });
