import { MdCancel } from "react-icons/md";

import { Box, Icon, Text } from "@chakra-ui/react";

import { PanelRenderer } from "@/features/configure-node";
import { useWorkflowStore } from "@/shared";

/**
 * 중간 노드 클릭 시 오른쪽에 표시되는 "설정" 패널.
 * PanelRenderer를 통해 노드 타입별 설정 UI를 렌더링한다.
 */
export const OutputPanel = () => {
  const activePanelNodeId = useWorkflowStore((s) => s.activePanelNodeId);
  const closePanel = useWorkflowStore((s) => s.closePanel);
  const isOpen = Boolean(activePanelNodeId);

  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      width="690px"
      maxW="690px"
      minW="690px"
      height="100%"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="lg"
      overflowY="auto"
      px={3}
      py={6}
      zIndex={5}
      transform={isOpen ? "translateX(0)" : "translateX(100%)"}
      transition="transform 200ms ease"
      display="flex"
      flexDirection="column"
      gap={3}
    >
      {/* 헤더 */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
      >
        <Text fontSize="xl" fontWeight="medium" letterSpacing="-0.4px">
          설정
        </Text>
        <Box cursor="pointer" onClick={closePanel}>
          <Icon as={MdCancel} boxSize={6} color="gray.600" />
        </Box>
      </Box>

      {/* 설정 패널 컨텐츠 */}
      <Box flex={1} overflow="auto">
        <PanelRenderer />
      </Box>
    </Box>
  );
};
