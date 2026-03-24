import { useEffect } from "react";
import { useParams } from "react-router";

import { Box } from "@chakra-ui/react";
import { ReactFlowProvider } from "@xyflow/react";

import { AddNodeButton } from "@/features/add-node";
import { useWorkflowStore } from "@/shared";
import { Canvas, EditorToolbar, NodeSettingsPanel } from "@/widgets";

const WorkflowEditorInner = () => {
  const { id } = useParams<{ id: string }>();
  const setWorkflowMeta = useWorkflowStore((s) => s.setWorkflowMeta);
  const resetEditor = useWorkflowStore((s) => s.resetEditor);

  useEffect(() => {
    if (id) {
      setWorkflowMeta(id, "");
    }
    return () => {
      resetEditor();
    };
  }, [id, setWorkflowMeta, resetEditor]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <EditorToolbar />
      <Box display="flex" flex={1} overflow="hidden">
        <Box flex={1} position="relative">
          <Canvas />
          <Box position="absolute" bottom={4} left={4} zIndex={10}>
            <AddNodeButton />
          </Box>
        </Box>
        <NodeSettingsPanel />
      </Box>
    </Box>
  );
};

export const WorkflowEditorPage = () => {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner />
    </ReactFlowProvider>
  );
};
