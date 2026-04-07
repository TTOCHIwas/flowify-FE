import { useCallback, useEffect, useState } from "react";
import { MdArrowBack, MdCancel, MdSearch } from "react-icons/md";

import { Box, Grid, Icon, Input, Text, VStack } from "@chakra-ui/react";

import { NODE_REGISTRY } from "@/entities/node";
import type { FlowNodeData, NodeMeta } from "@/entities/node";
import { useWorkflowStore } from "@/shared";

import { CATEGORY_SERVICE_MAP } from "../model/serviceMap";
import type { ServiceOption } from "../model/serviceMap";
import {
  SERVICE_REQUIREMENTS,
  type ServiceRequirement,
} from "../model/serviceRequirements";
import { useAddNode } from "../model/useAddNode";

type WizardStep = "category" | "service" | "requirement" | "auth";

const allNodeEntries = Object.values(NODE_REGISTRY);

const parseSourceNodeId = (placeholderId: string): string | undefined => {
  if (
    placeholderId === "placeholder-start" ||
    placeholderId === "placeholder-end"
  ) {
    return undefined;
  }

  return placeholderId.replace("placeholder-", "");
};

const CategoryGrid = ({
  searchQuery,
  setSearchQuery,
  onSelect,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (meta: NodeMeta) => void;
}) => {
  const filtered = searchQuery
    ? allNodeEntries.filter((meta) => meta.label.includes(searchQuery))
    : allNodeEntries;

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="lg"
      p={12}
      maxW="820px"
      w="full"
    >
      <Box position="relative" mb={6}>
        <Input
          placeholder="검색"
          bg="white"
          border="1px solid"
          borderColor="gray.500"
          borderRadius="full"
          pl={12}
          pr={12}
          py={2}
          fontSize="md"
          fontWeight="bold"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <Box
          position="absolute"
          top="50%"
          right={6}
          transform="translateY(-50%)"
          pointerEvents="none"
        >
          <Icon as={MdSearch} boxSize={8} color="gray.600" />
        </Box>
      </Box>

      <Grid templateColumns="repeat(7, 1fr)" gap={12} p={6}>
        {filtered.map((meta) => (
          <VStack
            key={meta.type}
            gap={1}
            cursor="pointer"
            minH="80px"
            _hover={{ opacity: 0.7 }}
            transition="opacity 150ms ease"
            onClick={() => onSelect(meta)}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              h="64px"
            >
              <Icon as={meta.iconComponent} boxSize={16} color={meta.color} />
            </Box>
            <Text fontSize="xs" fontWeight="medium" textAlign="center">
              {meta.label}
            </Text>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
};

const ServiceGrid = ({
  selectedMeta,
  services,
  onSelect,
  onBack,
}: {
  selectedMeta: NodeMeta;
  services: ServiceOption[];
  onSelect: (service: ServiceOption) => void;
  onBack: () => void;
}) => (
  <Box display="flex" gap={12} alignItems="flex-start">
    <VStack gap={2} flexShrink={0} w="100px">
      <Icon
        as={selectedMeta.iconComponent}
        boxSize={20}
        color={selectedMeta.color}
      />
      <Text fontSize="md" fontWeight="bold" textAlign="center">
        {selectedMeta.label}
      </Text>
    </VStack>

    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="2xl"
      boxShadow="lg"
      p={12}
      minW="420px"
    >
      <Text fontSize="xl" fontWeight="bold" mb={6}>
        서비스를 선택해주세요.
      </Text>

      <Grid
        templateColumns="repeat(auto-fill, minmax(80px, 1fr))"
        gap={8}
        p={4}
      >
        {services.map((service) => (
          <VStack
            key={service.value}
            gap={1}
            cursor="pointer"
            minH="80px"
            _hover={{ opacity: 0.7 }}
            transition="opacity 150ms ease"
            onClick={() => onSelect(service)}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="64px"
            >
              <Icon as={service.iconComponent} boxSize={16} />
            </Box>
            <Text fontSize="xs" fontWeight="medium" textAlign="center">
              {service.label}
            </Text>
          </VStack>
        ))}
      </Grid>

      <Box
        mt={4}
        cursor="pointer"
        onClick={onBack}
        display="inline-flex"
        alignItems="center"
        gap={1}
        color="gray.500"
        _hover={{ color: "black" }}
        transition="color 150ms ease"
      >
        <Icon as={MdArrowBack} boxSize={5} />
        <Text fontSize="sm">뒤로</Text>
      </Box>
    </Box>
  </Box>
);

const RequirementList = ({
  requirements,
  onSelect,
  onBack,
}: {
  requirements: ServiceRequirement[];
  onSelect: (requirement: ServiceRequirement) => void;
  onBack: () => void;
}) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="2xl"
    boxShadow="lg"
    p={12}
    minW="520px"
  >
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
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="2xl"
    boxShadow="lg"
    p={12}
    minW="520px"
  >
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

export const ServiceSelectionPanel = () => {
  const activePlaceholder = useWorkflowStore(
    (state) => state.activePlaceholder,
  );
  const setActivePlaceholder = useWorkflowStore(
    (state) => state.setActivePlaceholder,
  );
  const setStartNodeId = useWorkflowStore((state) => state.setStartNodeId);
  const setEndNodeId = useWorkflowStore((state) => state.setEndNodeId);
  const onConnect = useWorkflowStore((state) => state.onConnect);
  const openPanel = useWorkflowStore((state) => state.openPanel);
  const removeNode = useWorkflowStore((state) => state.removeNode);
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const { addNode } = useAddNode();

  const [step, setStep] = useState<WizardStep>("category");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeta, setSelectedMeta] = useState<NodeMeta | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null,
  );
  const [placedNodeId, setPlacedNodeId] = useState<string | null>(null);
  const [selectedRequirementPreset, setSelectedRequirementPreset] =
    useState<Record<string, unknown> | null>(null);

  const resetWizard = useCallback(() => {
    setStep("category");
    setSearchQuery("");
    setSelectedMeta(null);
    setSelectedService(null);
    setPlacedNodeId(null);
    setSelectedRequirementPreset(null);
    setActivePlaceholder(null);
  }, [setActivePlaceholder]);

  const handleOverlayClose = useCallback(() => {
    resetWizard();
  }, [resetWizard]);

  useEffect(() => {
    if (!activePlaceholder) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activePlaceholder) {
        handleOverlayClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePlaceholder, handleOverlayClose]);

  const placeNode = useCallback(
    (meta: NodeMeta, service?: ServiceOption) => {
      if (!activePlaceholder) return null;

      const nodeId = addNode(meta.type, {
        position: activePlaceholder.position,
        config: service
          ? ({ service: service.value } as Partial<FlowNodeData["config"]>)
          : undefined,
      });

      const sourceNodeId = parseSourceNodeId(activePlaceholder.id);

      if (activePlaceholder.id === "placeholder-start") {
        setStartNodeId(nodeId);
      } else if (activePlaceholder.id === "placeholder-end") {
        setEndNodeId(nodeId);
      }

      if (sourceNodeId) {
        onConnect({
          source: sourceNodeId,
          target: nodeId,
          sourceHandle: null,
          targetHandle: null,
        });
      }

      return nodeId;
    },
    [activePlaceholder, addNode, onConnect, setEndNodeId, setStartNodeId],
  );

  if (!activePlaceholder) return null;

  const isMiddleNodeMode =
    activePlaceholder.id !== "placeholder-start" &&
    activePlaceholder.id !== "placeholder-end";
  const requirementGroup = selectedMeta
    ? SERVICE_REQUIREMENTS[selectedMeta.type]
    : undefined;

  const handleCategorySelect = (meta: NodeMeta) => {
    if (isMiddleNodeMode) {
      const nodeId = placeNode(meta);
      if (!nodeId) return;

      resetWizard();
      openPanel(nodeId);
      return;
    }

    const serviceGroup = CATEGORY_SERVICE_MAP[meta.type];
    if (serviceGroup && serviceGroup.services.length > 0) {
      setSelectedMeta(meta);
      setStep("service");
      return;
    }

    const nodeId = placeNode(meta);
    if (!nodeId) return;

    const nextRequirementGroup = SERVICE_REQUIREMENTS[meta.type];
    if (nextRequirementGroup) {
      setSelectedMeta(meta);
      setPlacedNodeId(nodeId);
      setStep("requirement");
      return;
    }

    updateNodeConfig(nodeId, {});
    resetWizard();
  };

  const handleServiceSelect = (service: ServiceOption) => {
    if (!selectedMeta) return;

    const nodeId = placeNode(selectedMeta, service);
    if (!nodeId) return;

    setSelectedService(service);
    setPlacedNodeId(nodeId);

    if (SERVICE_REQUIREMENTS[selectedMeta.type]) {
      setStep("requirement");
      return;
    }

    updateNodeConfig(nodeId, {});
    resetWizard();
  };

  const handleRequirementSelect = (requirement: ServiceRequirement) => {
    if (!placedNodeId || !selectedMeta) return;

    const serviceGroup = CATEGORY_SERVICE_MAP[selectedMeta.type];
    if (serviceGroup?.requiresAuth) {
      setSelectedRequirementPreset(requirement.configPreset);
      setStep("auth");
      return;
    }

    updateNodeConfig(placedNodeId, requirement.configPreset);
    resetWizard();
  };

  const handleAuth = () => {
    if (!placedNodeId || !selectedRequirementPreset) return;

    updateNodeConfig(placedNodeId, selectedRequirementPreset);
    resetWizard();
  };

  const handleBackToCategory = () => {
    setSelectedMeta(null);
    setSelectedService(null);
    setStep("category");
  };

  const handleBackFromRequirement = () => {
    if (placedNodeId) {
      removeNode(placedNodeId);
      setPlacedNodeId(null);
    }

    if (selectedService) {
      setSelectedService(null);
      setStep("service");
      return;
    }

    setSelectedMeta(null);
    setStep("category");
  };

  const handleBackToRequirement = () => {
    setSelectedRequirementPreset(null);
    setStep("requirement");
  };

  const getTitle = (): string => {
    switch (step) {
      case "category":
        return "어디에서 어디로 갈까요?";
      case "service":
        return "서비스 선택";
      case "requirement":
        return requirementGroup?.title ?? "요구사항 선택";
      case "auth":
        return "인증";
    }
  };

  return (
    <Box
      position="absolute"
      inset={0}
      zIndex={20}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pointerEvents="auto"
      onClick={handleOverlayClose}
    >
      <Box
        position="absolute"
        top={8}
        right={8}
        cursor="pointer"
        onClick={(event) => {
          event.stopPropagation();
          handleOverlayClose();
        }}
      >
        <Icon as={MdCancel} boxSize={8} color="gray.600" />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={6}
        onClick={(event) => event.stopPropagation()}
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          {getTitle()}
        </Text>

        {step === "category" ? (
          <CategoryGrid
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelect={handleCategorySelect}
          />
        ) : null}

        {step === "service" && selectedMeta && !isMiddleNodeMode ? (
          <ServiceGrid
            selectedMeta={selectedMeta}
            services={CATEGORY_SERVICE_MAP[selectedMeta.type]!.services}
            onSelect={handleServiceSelect}
            onBack={handleBackToCategory}
          />
        ) : null}

        {step === "requirement" && requirementGroup && !isMiddleNodeMode ? (
          <RequirementList
            requirements={requirementGroup.requirements}
            onSelect={handleRequirementSelect}
            onBack={handleBackFromRequirement}
          />
        ) : null}

        {step === "auth" && !isMiddleNodeMode ? (
          <AuthPrompt onAuth={handleAuth} onBack={handleBackToRequirement} />
        ) : null}
      </Box>
    </Box>
  );
};
