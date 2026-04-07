import { useCallback, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";

import { Box, Icon, Text } from "@chakra-ui/react";

import { useWorkflowStore } from "@/shared";

import { MAPPING_RULES, toMappingKey } from "../model";
import type {
  MappingAction,
  MappingDataTypeKey,
  ProcessingMethodOption,
} from "../model";

import { ActionStep } from "./ActionStep";
import { FollowUpStep } from "./FollowUpStep";
import { ProcessingMethodStep } from "./ProcessingMethodStep";

type ChoiceStep = "processing-method" | "action" | "follow-up";

interface ChoicePanelContentProps {
  placeholderId: string;
  initialDataTypeKey: MappingDataTypeKey;
  onClose: () => void;
}

const ChoicePanelContent = ({
  placeholderId,
  initialDataTypeKey,
  onClose,
}: ChoicePanelContentProps) => {
  const [step, setStep] = useState<ChoiceStep>(() =>
    MAPPING_RULES.data_types[initialDataTypeKey].requires_processing_method
      ? "processing-method"
      : "action",
  );
  const [currentDataTypeKey, setCurrentDataTypeKey] =
    useState<MappingDataTypeKey>(initialDataTypeKey);
  const [selectedProcessingOption, setSelectedProcessingOption] =
    useState<ProcessingMethodOption | null>(null);
  const [selectedAction, setSelectedAction] = useState<MappingAction | null>(
    null,
  );

  const resetChoice = useCallback(() => {
    setStep(
      MAPPING_RULES.data_types[initialDataTypeKey].requires_processing_method
        ? "processing-method"
        : "action",
    );
    setCurrentDataTypeKey(initialDataTypeKey);
    setSelectedProcessingOption(null);
    setSelectedAction(null);
    onClose();
  }, [initialDataTypeKey, onClose]);

  const handleOverlayClose = useCallback(() => {
    resetChoice();
  }, [resetChoice]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleOverlayClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOverlayClose, placeholderId]);

  const dataType = MAPPING_RULES.data_types[currentDataTypeKey];

  const title = dataType?.label ?? "선택";

  const handleProcessingMethodSelect = (option: ProcessingMethodOption) => {
    setSelectedProcessingOption(option);
    setCurrentDataTypeKey(option.output_data_type);

    const nextDataType = MAPPING_RULES.data_types[option.output_data_type];
    if (nextDataType.actions.length === 0) {
      handleOverlayClose();
      return;
    }

    setStep("action");
  };

  const handleActionSelect = (action: MappingAction) => {
    setSelectedAction(action);

    if (action.follow_up || action.branch_config) {
      setStep("follow-up");
      return;
    }

    handleOverlayClose();
  };

  const handleBackToProcessingMethod = () => {
    setSelectedAction(null);
    setStep("processing-method");
  };

  const handleBackToAction = () => {
    setStep("action");
  };

  const handleFollowUpComplete = () => {
    handleOverlayClose();
  };

  return (
    <Box
      position="absolute"
      inset={0}
      zIndex={20}
      display="flex"
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"
    >
      <Box
        pointerEvents="auto"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="2xl"
        boxShadow="lg"
        p={10}
        w="full"
        maxW="820px"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={8}
        >
          <Text fontSize="xl" fontWeight="medium" letterSpacing="-0.4px">
            {title}
          </Text>
          <Box cursor="pointer" onClick={handleOverlayClose}>
            <Icon as={MdCancel} boxSize={6} color="gray.600" />
          </Box>
        </Box>

        {step === "processing-method" && dataType.processing_method ? (
          <ProcessingMethodStep
            processingMethod={dataType.processing_method}
            onSelect={handleProcessingMethodSelect}
          />
        ) : null}

        {step === "action" ? (
          <ActionStep
            actions={dataType.actions}
            onSelect={handleActionSelect}
            onBack={
              selectedProcessingOption
                ? handleBackToProcessingMethod
                : undefined
            }
          />
        ) : null}

        {step === "follow-up" && selectedAction ? (
          <FollowUpStep
            followUp={selectedAction.follow_up ?? null}
            branchConfig={selectedAction.branch_config ?? null}
            onComplete={handleFollowUpComplete}
            onBack={handleBackToAction}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export const ChoicePanel = () => {
  const activePlaceholder = useWorkflowStore(
    (state) => state.activePlaceholder,
  );
  const nodes = useWorkflowStore((state) => state.nodes);
  const setActivePlaceholder = useWorkflowStore(
    (state) => state.setActivePlaceholder,
  );

  const isMiddlePlaceholder =
    activePlaceholder !== null &&
    activePlaceholder.id !== "placeholder-start" &&
    activePlaceholder.id !== "placeholder-end";

  const parentNodeId = isMiddlePlaceholder
    ? activePlaceholder.id.replace("placeholder-", "")
    : null;
  const parentNode = parentNodeId
    ? (nodes.find((node) => node.id === parentNodeId) ?? null)
    : null;
  const parentOutputType = parentNode?.data.outputTypes[0] ?? null;

  if (!isMiddlePlaceholder || !activePlaceholder || !parentOutputType) {
    return null;
  }

  return (
    <ChoicePanelContent
      key={activePlaceholder.id}
      placeholderId={activePlaceholder.id}
      initialDataTypeKey={toMappingKey(parentOutputType)}
      onClose={() => setActivePlaceholder(null)}
    />
  );
};
