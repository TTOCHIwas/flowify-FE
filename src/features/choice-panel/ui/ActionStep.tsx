import { MdArrowBack } from "react-icons/md";

import { Box, Button, Icon, Text, VStack } from "@chakra-ui/react";

import type { MappingAction } from "../model";

interface ActionStepProps {
  actions: MappingAction[];
  onSelect: (action: MappingAction) => void;
  onBack?: () => void;
}

export const ActionStep = ({ actions, onSelect, onBack }: ActionStepProps) => {
  const sortedActions = [...actions].sort(
    (left, right) => left.priority - right.priority,
  );

  return (
    <VStack align="stretch" gap={6}>
      {onBack ? (
        <Box
          display="inline-flex"
          alignItems="center"
          gap={1}
          cursor="pointer"
          color="gray.500"
          onClick={onBack}
          w="fit-content"
        >
          <Icon as={MdArrowBack} boxSize={5} />
          <Text fontSize="sm">뒤로</Text>
        </Box>
      ) : null}

      <Text fontSize="lg" fontWeight="semibold">
        어떤 작업을 할까요?
      </Text>

      {sortedActions.length === 0 ? (
        <Text fontSize="sm" color="text.secondary">
          선택 가능한 작업이 없습니다.
        </Text>
      ) : (
        <VStack align="stretch" gap={3}>
          {sortedActions.map((action) => (
            <Button
              key={action.id}
              justifyContent="flex-start"
              px={6}
              py={5}
              h="auto"
              borderRadius="2xl"
              variant="outline"
              onClick={() => onSelect(action)}
            >
              <Box textAlign="left">
                <Text fontSize="md" fontWeight="semibold">
                  {action.label}
                </Text>
                {action.description ? (
                  <Text mt={1} fontSize="sm" color="text.secondary">
                    {action.description}
                  </Text>
                ) : null}
              </Box>
            </Button>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
