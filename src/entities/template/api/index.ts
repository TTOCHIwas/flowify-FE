import { createTemplateAPI } from "./create-template.api";
import { getTemplateListAPI } from "./get-template-list.api";
import { getTemplateAPI } from "./get-template.api";
import { instantiateTemplateAPI } from "./instantiate-template.api";

export * from "./types";

export const templateApi = {
  getList: getTemplateListAPI,
  getById: getTemplateAPI,
  instantiate: instantiateTemplateAPI,
  create: createTemplateAPI,
};
