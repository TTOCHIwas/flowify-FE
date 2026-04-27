import { type IconType } from "react-icons";

import { Flex, Icon, Text, VStack } from "@chakra-ui/react";

type Props = {
  label: string;
  value: string;
  icon: IconType;
};

export const DashboardMetricCard = ({ label, value, icon }: Props) => {
  return (
    <Flex
      align="center"
      gap={6}
      h="72px"
      p={4}
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="8px"
    >
      <Flex boxSize="38px" align="center" justify="center" flexShrink={0}>
        <Icon as={icon} boxSize={7} color="text.primary" />
      </Flex>

      <VStack align="stretch" gap={0}>
        <Text fontSize="xs" color="text.secondary">
          {label}
        </Text>
        <Text fontSize="2xl" fontWeight="semibold" color="text.primary">
          {value}
        </Text>
      </VStack>
    </Flex>
  );
};
