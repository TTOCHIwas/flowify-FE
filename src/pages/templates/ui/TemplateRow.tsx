import { MdMoreHoriz } from "react-icons/md";

import { Flex, HStack, IconButton, Text, VStack } from "@chakra-ui/react";

import type { TemplateSummary } from "@/shared";

import { getTemplateDescription } from "../model";

import { TemplateServiceIcon } from "./TemplateServiceIcon";

type Props = {
  template: TemplateSummary;
  onOpen: () => void;
};

export const TemplateRow = ({ template, onOpen }: Props) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={4}
      p={4}
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="10px"
    >
      <HStack gap={6} minW={0} flex={1}>
        <TemplateServiceIcon
          icon={template.icon}
          requiredServices={template.requiredServices}
        />

        <VStack align="stretch" gap={0.5} minW={0} flex={1}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="text.primary"
            lineClamp={1}
          >
            {template.name}
          </Text>
          <Text fontSize="xs" color="text.primary" lineClamp={1}>
            {getTemplateDescription(template.description)}
          </Text>
          <Flex h="18px" />
        </VStack>
      </HStack>

      <IconButton
        aria-label="템플릿 상세 보기"
        variant="ghost"
        size="sm"
        flexShrink={0}
        onClick={onOpen}
      >
        <MdMoreHoriz />
      </IconButton>
    </Flex>
  );
};
