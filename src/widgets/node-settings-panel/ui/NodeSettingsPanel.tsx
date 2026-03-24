import { Box } from "@chakra-ui/react";

import { PanelRenderer } from "@/features/configure-node";
import { useWorkflowStore } from "@/shared";

export const NodeSettingsPanel = () => {
  const activePanelNodeId = useWorkflowStore((s) => s.activePanelNodeId);

  return (
    <Box
      width="360px"
      height="100%"
      bg="bg.surface"
      borderLeft="1px solid"
      borderColor="border.default"
      flexShrink={0}
      display={activePanelNodeId ? "block" : "none"}
      overflowY="auto"
      p={4}
    >
      <PanelRenderer />
    </Box>
  );
};
