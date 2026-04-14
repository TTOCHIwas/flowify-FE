import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

import { ROUTE_PATHS, buildPath, queryClient, workflowKeys } from "@/shared";
import { workflowApi } from "@/shared/api";

export const useCreateWorkflowShortcut = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const createWorkflow = useCallback(async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const workflow = await workflowApi.create({
        name: "새 워크플로우",
        description: "",
        nodes: [],
        edges: [],
        trigger: null,
      });

      await queryClient.invalidateQueries({ queryKey: workflowKeys.lists() });
      navigate(buildPath.workflowEditor(workflow.id));
    } catch {
      navigate(ROUTE_PATHS.WORKFLOWS);
    } finally {
      setIsPending(false);
    }
  }, [isPending, navigate]);

  return {
    createWorkflow,
    isPending,
  };
};
