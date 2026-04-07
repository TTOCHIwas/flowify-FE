import { Box, Button, Text, VStack } from "@chakra-ui/react";

import type { ProcessingMethod } from "../model";
import type { ProcessingMethodOption } from "../model";

interface ProcessingMethodStepProps {
  processingMethod: ProcessingMethod;
  onSelect: (option: ProcessingMethodOption) => void;
}

export const ProcessingMethodStep = ({
  processingMethod,
  onSelect,
}: ProcessingMethodStepProps) => {
  const sortedOptions = [...processingMethod.options].sort(
    (left, right) => left.priority - right.priority,
  );

  return (
    <VStack align="stretch" gap={6}>
      <Text fontSize="lg" fontWeight="semibold">
        {processingMethod.question}
      </Text>

      <VStack align="stretch" gap={3}>
        {sortedOptions.map((option) => (
          <Button
            key={option.id}
            justifyContent="flex-start"
            px={6}
            py={6}
            h="auto"
            borderRadius="2xl"
            variant="outline"
            onClick={() => onSelect(option)}
          >
            <Box textAlign="left">
              <Text fontSize="md" fontWeight="semibold">
                {option.label}
              </Text>
            </Box>
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};
