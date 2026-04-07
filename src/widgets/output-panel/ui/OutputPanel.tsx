import { useState } from "react";
import { MdCancel } from "react-icons/md";

import { Box, Icon, Text } from "@chakra-ui/react";

import {
  CATEGORY_SERVICE_MAP,
  SERVICE_REQUIREMENTS,
} from "@/features/add-node";
import type { ServiceRequirement } from "@/features/add-node";
import { PanelRenderer } from "@/features/configure-node";
import { useWorkflowStore } from "@/shared";

type PanelStep = "requirement" | "auth" | null;

const RequirementSelector = ({
  requirements,
  onSelect,
}: {
  requirements: ServiceRequirement[];
  onSelect: (requirement: ServiceRequirement) => void;
}) => (
  <Box p={6}>
    <Box display="flex" flexDirection="column" gap={4}>
      {requirements.map((requirement) => (
        <Box
          key={requirement.id}
          display="flex"
          gap={3}
          alignItems="center"
          cursor="pointer"
          px={6}
          py={4}
          borderRadius="3xl"
          _hover={{ bg: "gray.50" }}
          transition="background 150ms ease"
          onClick={() => onSelect(requirement)}
        >
          <Box display="flex" alignItems="center" justifyContent="center" p={3}>
            <Icon as={requirement.iconComponent} boxSize={6} />
          </Box>
          <Text fontSize="md" fontWeight="bold">
            {requirement.label}
          </Text>
        </Box>
      ))}
    </Box>
  </Box>
);

const AuthPrompt = ({
  onAuth,
  onBack,
}: {
  onAuth: () => void;
  onBack: () => void;
}) => (
  <Box p={6}>
    <Box
      mb={4}
      cursor="pointer"
      display="inline-flex"
      alignItems="center"
      onClick={onBack}
    >
      <Text fontSize="sm" color="text.secondary">
        뒤로
      </Text>
    </Box>

    <Text fontSize="md" mb={6}>
      인증은 처음 한 번만 진행하면 됩니다.
    </Text>

    <Box
      border="1px solid"
      borderColor="gray.200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={16}
      py={3}
      cursor="pointer"
      _hover={{ bg: "gray.50" }}
      transition="background 150ms ease"
      onClick={onAuth}
    >
      <Text fontSize="md" fontWeight="semibold">
        계정 인증하기
      </Text>
    </Box>
  </Box>
);

export const OutputPanel = () => {
  const activePanelNodeId = useWorkflowStore(
    (state) => state.activePanelNodeId,
  );
  const activeNode = useWorkflowStore(
    (state) =>
      state.nodes.find((node) => node.id === state.activePanelNodeId) ?? null,
  );
  const closePanel = useWorkflowStore((state) => state.closePanel);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);

  const [pendingAuth, setPendingAuth] = useState<{
    nodeId: string;
    preset: Record<string, unknown>;
  } | null>(null);

  const isOpen = Boolean(activePanelNodeId);
  const requirementGroup = activeNode
    ? SERVICE_REQUIREMENTS[activeNode.data.type]
    : undefined;
  const panelStep: PanelStep =
    pendingAuth?.nodeId === activePanelNodeId
      ? "auth"
      : activeNode && !activeNode.data.config.isConfigured && requirementGroup
        ? "requirement"
        : null;

  const getHeaderTitle = () => {
    switch (panelStep) {
      case "requirement":
        return requirementGroup?.title ?? "설정";
      case "auth":
        return "인증";
      default:
        return "설정";
    }
  };

  const resetLocalWizard = () => {
    setPendingAuth(null);
  };

  const handleRequirementSelect = (requirement: ServiceRequirement) => {
    if (!activePanelNodeId || !activeNode) return;

    const serviceGroup = CATEGORY_SERVICE_MAP[activeNode.data.type];
    if (serviceGroup?.requiresAuth) {
      setPendingAuth({
        nodeId: activePanelNodeId,
        preset: requirement.configPreset,
      });
      return;
    }

    updateNodeConfig(activePanelNodeId, requirement.configPreset);
    resetLocalWizard();
  };

  const handleAuth = () => {
    if (!activePanelNodeId || pendingAuth?.nodeId !== activePanelNodeId) return;

    updateNodeConfig(activePanelNodeId, pendingAuth.preset);
    resetLocalWizard();
  };

  const handleClose = () => {
    resetLocalWizard();
    closePanel();
  };

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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
      >
        <Text fontSize="xl" fontWeight="medium" letterSpacing="-0.4px">
          {getHeaderTitle()}
        </Text>
        <Box cursor="pointer" onClick={handleClose}>
          <Icon as={MdCancel} boxSize={6} color="gray.600" />
        </Box>
      </Box>

      <Box flex={1} overflow="auto">
        {panelStep === "requirement" && requirementGroup ? (
          <RequirementSelector
            requirements={requirementGroup.requirements}
            onSelect={handleRequirementSelect}
          />
        ) : null}

        {panelStep === "auth" ? (
          <AuthPrompt onAuth={handleAuth} onBack={resetLocalWizard} />
        ) : null}

        {panelStep === null ? <PanelRenderer /> : null}
      </Box>
    </Box>
  );
};
