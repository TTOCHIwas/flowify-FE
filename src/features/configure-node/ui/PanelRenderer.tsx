import { Text } from "@chakra-ui/react";

import { useWorkflowStore } from "@/shared";

// PANEL_MAP — 패널 컴포넌트는 다음 이슈에서 구현 예정
// const PANEL_MAP = {} as Record<string, React.ComponentType>;

export const PanelRenderer = () => {
  const activeNode = useWorkflowStore(
    (s) => s.nodes.find((n) => n.id === s.activePanelNodeId) ?? null,
  );

  if (!activeNode) return null;

  return <Text>설정 패널 준비 중</Text>;
};
