import { MdPlayArrow, MdSave } from "react-icons/md";

import { Box, IconButton, Text } from "@chakra-ui/react";

import type { ExecutionStatus } from "@/shared";
import { useWorkflowStore } from "@/shared";

const getRunButtonColor = (status: ExecutionStatus) => {
  switch (status) {
    case "running":
      return "yellow";
    case "failed":
      return "red";
    case "idle":
    case "success":
    default:
      return "green";
  }
};

export const EditorToolbar = () => {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const executionStatus = useWorkflowStore((s) => s.executionStatus);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height="48px"
      px={4}
      bg="bg.surface"
      borderBottom="1px solid"
      borderColor="border.default"
      flexShrink={0}
    >
      <Text fontWeight="semibold" fontSize="sm">
        {workflowName || "새 워크플로우"}
      </Text>
      <Box display="flex" gap={2}>
        <IconButton
          aria-label="워크플로우 실행"
          size="sm"
          colorPalette={getRunButtonColor(executionStatus)}
        >
          <MdPlayArrow />
        </IconButton>
        <IconButton aria-label="워크플로우 저장" size="sm" variant="outline">
          <MdSave />
        </IconButton>
      </Box>
    </Box>
  );
};
