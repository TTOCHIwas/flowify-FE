import { addWorkflowNodeAPI } from "./add-workflow-node.api";
import { createWorkflowAPI } from "./create-workflow.api";
import { deleteWorkflowNodeAPI } from "./delete-workflow-node.api";
import { deleteWorkflowAPI } from "./delete-workflow.api";
import { generateWorkflowAPI } from "./generate-workflow.api";
import { getWorkflowChoicesAPI } from "./get-workflow-choices.api";
import { getWorkflowListAPI } from "./get-workflow-list.api";
import { getWorkflowAPI } from "./get-workflow.api";
import { selectWorkflowChoiceAPI } from "./select-workflow-choice.api";
import { shareWorkflowAPI } from "./share-workflow.api";
import { updateWorkflowNodeAPI } from "./update-workflow-node.api";
import { updateWorkflowAPI } from "./update-workflow.api";

export * from "./types";

export const workflowApi = {
  getList: getWorkflowListAPI,
  getById: getWorkflowAPI,
  create: createWorkflowAPI,
  update: updateWorkflowAPI,
  delete: deleteWorkflowAPI,
  addNode: addWorkflowNodeAPI,
  updateNode: updateWorkflowNodeAPI,
  deleteNode: deleteWorkflowNodeAPI,
  getChoices: getWorkflowChoicesAPI,
  selectChoice: selectWorkflowChoiceAPI,
  share: shareWorkflowAPI,
  generate: generateWorkflowAPI,
};
