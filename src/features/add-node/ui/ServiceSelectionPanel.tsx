import { useCallback, useState } from "react";
import { MdArrowBack, MdSearch } from "react-icons/md";

import { Box, Grid, Icon, Input, Text, VStack } from "@chakra-ui/react";

import { NODE_REGISTRY } from "@/entities/node";
import type { FlowNodeData, NodeMeta } from "@/entities/node";
import { useWorkflowStore } from "@/shared";

import { CATEGORY_SERVICE_MAP } from "../model/serviceMap";
import type { ServiceOption } from "../model/serviceMap";
import { SERVICE_REQUIREMENTS } from "../model/serviceRequirements";
import { useAddNode } from "../model/useAddNode";

type WizardStep = "category" | "service";

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
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const { addNode } = useAddNode();

  const [step, setStep] = useState<WizardStep>("category");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeta, setSelectedMeta] = useState<NodeMeta | null>(null);

  const resetWizard = useCallback(() => {
    setStep("category");
    setSearchQuery("");
    setSelectedMeta(null);
    setActivePlaceholder(null);
  }, [setActivePlaceholder]);

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

  const finishNodePlacement = (nodeId: string, meta: NodeMeta) => {
    if (isMiddleNodeMode) {
      resetWizard();
      openPanel(nodeId);
      return;
    }

    if (SERVICE_REQUIREMENTS[meta.type]) {
      resetWizard();
      openPanel(nodeId);
      return;
    }

    updateNodeConfig(nodeId, {});
    resetWizard();
  };

  const handleCategorySelect = (meta: NodeMeta) => {
    if (isMiddleNodeMode) {
      const nodeId = placeNode(meta);
      if (!nodeId) return;

      finishNodePlacement(nodeId, meta);
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

    finishNodePlacement(nodeId, meta);
  };

  const handleServiceSelect = (service: ServiceOption) => {
    if (!selectedMeta) return;

    const nodeId = placeNode(selectedMeta, service);
    if (!nodeId) return;

    finishNodePlacement(nodeId, selectedMeta);
  };

  const getTitle = (): string => {
    switch (step) {
      case "category":
        return "어디에서 어디로 갈까요?";
      case "service":
        return "서비스 선택";
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
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        {getTitle()}
      </Text>

      {step === "category" ? (
        <CategoryGrid
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelect={handleCategorySelect}
        />
      ) : null}

      {step === "service" && selectedMeta ? (
        <ServiceGrid
          selectedMeta={selectedMeta}
          services={CATEGORY_SERVICE_MAP[selectedMeta.type]!.services}
          onSelect={handleServiceSelect}
          onBack={() => {
            setStep("category");
            setSelectedMeta(null);
          }}
        />
      ) : null}
    </Box>
  );
};
