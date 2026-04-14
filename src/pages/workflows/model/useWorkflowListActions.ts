import { useState } from "react";
import { useNavigate } from "react-router";

import {
  type WorkflowResponse,
  useToggleWorkflowActiveMutation,
} from "@/entities/workflow";
import { useCreateWorkflowShortcut } from "@/features/create-workflow";
import { buildPath } from "@/shared";

export const useWorkflowListActions = () => {
  const navigate = useNavigate();
  const [togglingWorkflowId, setTogglingWorkflowId] = useState<string | null>(
    null,
  );
  const { createWorkflow, isPending: isCreatePending } =
    useCreateWorkflowShortcut();
  const { mutateAsync: toggleWorkflowActive } =
    useToggleWorkflowActiveMutation();

  const handleCreateWorkflow = () => {
    void createWorkflow();
  };

  const handleOpenWorkflow = (workflowId: string) => {
    navigate(buildPath.workflowEditor(workflowId));
  };

  const handleToggleWorkflow = async (workflow: WorkflowResponse) => {
    setTogglingWorkflowId(workflow.id);

    try {
      await toggleWorkflowActive({
        workflowId: workflow.id,
        active: !workflow.active,
      });
    } finally {
      setTogglingWorkflowId(null);
    }
  };

  return {
    isCreatePending,
    togglingWorkflowId,
    handleCreateWorkflow,
    handleOpenWorkflow,
    handleToggleWorkflow,
  };
};
