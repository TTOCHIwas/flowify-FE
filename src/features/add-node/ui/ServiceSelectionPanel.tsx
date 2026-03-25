import { useState } from "react";
import { MdSearch } from "react-icons/md";

import { Box, Grid, Icon, Input, Text, VStack } from "@chakra-ui/react";

import { NODE_REGISTRY } from "@/entities/node";
import type { NodeType } from "@/entities/node";
import { useWorkflowStore } from "@/shared";

import { useAddNode } from "../model/useAddNode";

const allNodeEntries = Object.values(NODE_REGISTRY);

export const ServiceSelectionPanel = () => {
  const activePlaceholder = useWorkflowStore((s) => s.activePlaceholder);
  const setActivePlaceholder = useWorkflowStore((s) => s.setActivePlaceholder);
  const setStartNodeId = useWorkflowStore((s) => s.setStartNodeId);
  const setEndNodeId = useWorkflowStore((s) => s.setEndNodeId);
  const { addNode } = useAddNode();

  const [searchQuery, setSearchQuery] = useState("");

  if (!activePlaceholder) return null;

  const filtered = searchQuery
    ? allNodeEntries.filter((meta) => meta.label.includes(searchQuery))
    : allNodeEntries;

  const handleSelect = (type: NodeType) => {
    const nodeId = addNode(type, { position: activePlaceholder.position });

    if (activePlaceholder.id === "placeholder-start") {
      setStartNodeId(nodeId);
    } else if (activePlaceholder.id === "placeholder-end") {
      setEndNodeId(nodeId);
    }

    setActivePlaceholder(null);
    setSearchQuery("");
  };

  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translateY(-50%)"
      zIndex={20}
      bg="gray.100"
      borderRadius="2xl"
      p={6}
      w="480px"
      boxShadow="lg"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        서비스를 선택해주세요.
      </Text>

      <Box position="relative" mb={4}>
        <Input
          placeholder="검색"
          bg="white"
          borderRadius="lg"
          pr={10}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Box
          position="absolute"
          top="50%"
          right={3}
          transform="translateY(-50%)"
          pointerEvents="none"
        >
          <Icon as={MdSearch} boxSize={5} color="gray.400" />
        </Box>
      </Box>

      <Grid templateColumns="repeat(5, 1fr)" gap={4}>
        {filtered.map((meta) => (
          <VStack
            key={meta.type}
            gap={1}
            cursor="pointer"
            p={2}
            borderRadius="lg"
            _hover={{ bg: "gray.200" }}
            transition="background 150ms ease"
            onClick={() => handleSelect(meta.type)}
          >
            <Icon as={meta.iconComponent} boxSize={8} color={meta.color} />
            <Text fontSize="xs" textAlign="center">
              {meta.label}
            </Text>
          </VStack>
        ))}
      </Grid>
    </Box>
  );
};
