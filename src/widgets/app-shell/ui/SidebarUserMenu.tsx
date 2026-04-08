import type { IconType } from "react-icons";

import { Box } from "@chakra-ui/react";

import { LogoutMenu, useLogout } from "@/features/auth/logout";

import { SidebarNavItem } from "./SidebarNavItem";

type SidebarUserMenuProps = {
  icon: IconType;
  label: string;
  isExpanded: boolean;
  isOpen: boolean;
  onToggle: () => void;
};

export const SidebarUserMenu = ({
  icon,
  label,
  isExpanded,
  isOpen,
  onToggle,
}: SidebarUserMenuProps) => {
  const { isPending, logout } = useLogout();

  return (
    <Box position="relative">
      <SidebarNavItem
        icon={icon}
        label={label}
        isExpanded={isExpanded}
        isActive={isOpen}
        onClick={onToggle}
      />

      {isOpen ? (
        <Box position="absolute" left="calc(100% + 8px)" bottom="0" zIndex={20}>
          <LogoutMenu isPending={isPending} onLogout={logout} />
        </Box>
      ) : null}
    </Box>
  );
};
