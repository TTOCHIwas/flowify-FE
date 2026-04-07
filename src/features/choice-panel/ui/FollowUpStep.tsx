import { useMemo, useState } from "react";
import { MdArrowBack } from "react-icons/md";

import { Box, Button, Icon, Input, Text, VStack } from "@chakra-ui/react";

import type { BranchConfig, FollowUp, FollowUpOption } from "../model";

type SelectionValue = string | string[];

interface FollowUpStepProps {
  followUp: FollowUp | null;
  branchConfig: BranchConfig | null;
  onComplete: (selections: Record<string, SelectionValue>) => void;
  onBack: () => void;
}

type QuestionBlock = {
  id: "follow_up" | "branch_config";
  question: string;
  multiSelect: boolean;
  options: FollowUpOption[];
  description?: string;
};

const buildQuestionBlocks = (
  followUp: FollowUp | null,
  branchConfig: BranchConfig | null,
): QuestionBlock[] => {
  const blocks: QuestionBlock[] = [];

  if (followUp) {
    blocks.push({
      id: "follow_up",
      question: followUp.question,
      multiSelect: followUp.multi_select ?? false,
      options: followUp.options ?? [],
      description: followUp.description,
    });
  }

  if (branchConfig) {
    blocks.push({
      id: "branch_config",
      question: branchConfig.question,
      multiSelect: branchConfig.multi_select ?? false,
      options: branchConfig.options ?? [],
      description: branchConfig.description,
    });
  }

  return blocks;
};

export const FollowUpStep = ({
  followUp,
  branchConfig,
  onComplete,
  onBack,
}: FollowUpStepProps) => {
  const questionBlocks = useMemo(
    () => buildQuestionBlocks(followUp, branchConfig),
    [branchConfig, followUp],
  );
  const [selections, setSelections] = useState<Record<string, SelectionValue>>(
    {},
  );
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const updateSelection = (
    blockId: string,
    optionId: string,
    multiSelect: boolean,
  ) => {
    setSelections((current) => {
      const previous = current[blockId];

      if (!multiSelect) {
        return { ...current, [blockId]: optionId };
      }

      const nextValues = Array.isArray(previous) ? [...previous] : [];
      const existingIndex = nextValues.indexOf(optionId);

      if (existingIndex >= 0) {
        nextValues.splice(existingIndex, 1);
      } else {
        nextValues.push(optionId);
      }

      return { ...current, [blockId]: nextValues };
    });
  };

  const isSelected = (
    blockId: string,
    optionId: string,
    multiSelect: boolean,
  ): boolean => {
    const value = selections[blockId];
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionId);
    }

    return value === optionId;
  };

  const handleComplete = () => {
    const mergedSelections = {
      ...selections,
      ...Object.fromEntries(
        Object.entries(customInputs).map(([key, value]) => [key, value.trim()]),
      ),
    };

    onComplete(mergedSelections);
  };

  return (
    <VStack align="stretch" gap={6}>
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

      {questionBlocks.map((block) => (
        <VStack key={block.id} align="stretch" gap={3}>
          <Text fontSize="lg" fontWeight="semibold">
            {block.question}
          </Text>

          {block.description ? (
            <Text fontSize="sm" color="text.secondary">
              {block.description}
            </Text>
          ) : null}

          {block.options.length === 0 ? (
            <Text fontSize="sm" color="text.secondary">
              현재 단계에서는 동적 옵션을 표시하지 않습니다.
            </Text>
          ) : (
            <VStack align="stretch" gap={3}>
              {block.options.map((option) => {
                const selected = isSelected(
                  block.id,
                  option.id,
                  block.multiSelect,
                );
                const inputKey = `${block.id}:${option.id}`;

                return (
                  <VStack key={option.id} align="stretch" gap={2}>
                    <Button
                      justifyContent="flex-start"
                      px={6}
                      py={5}
                      h="auto"
                      borderRadius="2xl"
                      variant={selected ? "solid" : "outline"}
                      onClick={() =>
                        updateSelection(block.id, option.id, block.multiSelect)
                      }
                    >
                      <Box textAlign="left">
                        <Text fontSize="md" fontWeight="semibold">
                          {option.label}
                        </Text>
                      </Box>
                    </Button>

                    {option.type === "text_input" && selected ? (
                      <Input
                        placeholder="직접 입력"
                        value={customInputs[inputKey] ?? ""}
                        onChange={(event) =>
                          setCustomInputs((current) => ({
                            ...current,
                            [inputKey]: event.target.value,
                          }))
                        }
                      />
                    ) : null}
                  </VStack>
                );
              })}
            </VStack>
          )}
        </VStack>
      ))}

      <Button alignSelf="flex-start" onClick={handleComplete}>
        완료
      </Button>
    </VStack>
  );
};
