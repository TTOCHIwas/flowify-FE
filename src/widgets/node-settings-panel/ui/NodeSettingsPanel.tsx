import { Box } from "@chakra-ui/react";

import { PanelRenderer } from "@/features/configure-node";
import { useWorkflowStore } from "@/shared";

export const NodeSettingsPanel = () => {
  const activePanelNodeId = useWorkflowStore((s) => s.activePanelNodeId);
  const isOpen = Boolean(activePanelNodeId);

  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      width="360px"
      height="100%"
      bg="bg.surface"
      borderLeft="1px solid"
      borderColor="border.default"
      overflowY="auto"
      p={4}
      zIndex={5}
      transform={isOpen ? "translateX(0)" : "translateX(100%)"}
      transition="transform 200ms ease"
    >
      <PanelRenderer />
    </Box>
  );
};
