import { Flex, Text, VStack } from "@chakra-ui/react";

import { ServiceBadge } from "@/shared";

import { type DashboardServiceCard } from "../model";

type Props = {
  service: DashboardServiceCard;
};

export const ServiceConnectionCard = ({ service }: Props) => {
  return (
    <Flex
      w={{ base: "full", md: "252px" }}
      align="center"
      gap={3}
      p={4}
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      borderRadius="10px"
    >
      <ServiceBadge type={service.badgeKey} />

      <VStack align="stretch" gap={0.5} minW={0}>
        <Text
          fontSize="sm"
          fontWeight="medium"
          color="text.primary"
          lineClamp={1}
        >
          {service.label}
        </Text>
        <Text fontSize="xs" color="text.secondary" lineClamp={1}>
          {service.statusLabel}
        </Text>
      </VStack>
    </Flex>
  );
};
