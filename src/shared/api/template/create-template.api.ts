import { request } from "../core";

import type { CreateTemplateRequest, TemplateDetail } from "./types";

export const createTemplateAPI = (
  body: CreateTemplateRequest,
): Promise<TemplateDetail> =>
  request<TemplateDetail>({
    url: "/templates",
    method: "POST",
    data: body,
  });
