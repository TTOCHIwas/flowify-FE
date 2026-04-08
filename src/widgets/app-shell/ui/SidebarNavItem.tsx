import type { IconType } from "react-icons";

import { Box, Button, Icon, Text } from "@chakra-ui/react";

type SidebarNavItemProps = {
  icon: IconType;
  label: string;
  isExpanded: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
};

export const SidebarNavItem = ({
  icon,
  label,
  isExpanded,
  isActive = false,
  isDisabled = false,
  onClick,
}: SidebarNavItemProps) => {
  return (
    <Button
      variant="ghost"
      justifyContent={isExpanded ? "flex-start" : "center"}
      alignItems="center"
      gap={isExpanded ? 3 : 0}
      w="full"
      h="28px"
      minW="28px"
      px={isExpanded ? 2 : 0}
      borderRadius="8px"
      color={isActive ? "gray.900" : "gray.700"}
      bg={isActive ? "gray.100" : "transparent"}
      _hover={{ bg: "gray.100" }}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      <Icon as={icon} boxSize="20px" flexShrink={0} />
      <Box
        maxW={isExpanded ? "120px" : "0px"}
        opacity={isExpanded ? 1 : 0}
        overflow="hidden"
        transition="max-width 220ms ease, opacity 180ms ease"
      >
        <Text fontSize="sm" fontWeight="medium" whiteSpace="nowrap">
          {label}
        </Text>
      </Box>
    </Button>
  );
};
