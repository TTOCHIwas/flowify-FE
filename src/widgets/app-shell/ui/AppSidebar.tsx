import { useMemo } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useLocation } from "react-router";

import { Flex } from "@chakra-ui/react";

import { sidebarLayoutSpec } from "@/shared/styles";

import {
  sidebarControlItem,
  sidebarPrimaryItems,
  sidebarSecondaryItems,
} from "../model/sidebarItems";

import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarUserMenu } from "./SidebarUserMenu";

type AppSidebarProps = {
  isExpanded: boolean;
  isLogoutMenuOpen: boolean;
  onToggleExpanded: () => void;
  onToggleLogoutMenu: () => void;
  onCloseLogoutMenu: () => void;
};

export const AppSidebar = ({
  isExpanded,
  isLogoutMenuOpen,
  onToggleExpanded,
  onToggleLogoutMenu,
  onCloseLogoutMenu,
}: AppSidebarProps) => {
  const location = useLocation();
  const toggleIcon = isExpanded
    ? MdKeyboardDoubleArrowLeft
    : MdKeyboardDoubleArrowRight;
  const activeRouteIds = useMemo(() => {
    return new Set(
      [...sidebarPrimaryItems, ...sidebarSecondaryItems]
        .filter((item) => {
          if (!item.path) return false;
          if (item.path === "/") return location.pathname === item.path;
          return location.pathname.startsWith(item.path);
        })
        .map((item) => item.id),
    );
  }, [location.pathname]);

  return (
    <Flex
      as="aside"
      direction="column"
      justify="space-between"
      h="100%"
      w={`${isExpanded ? sidebarLayoutSpec.expandedWidth : sidebarLayoutSpec.collapsedWidth}px`}
      px={`${sidebarLayoutSpec.paddingX}px`}
      py={`${sidebarLayoutSpec.paddingY}px`}
      borderRight="1px solid"
      borderColor={sidebarLayoutSpec.borderColor}
      bg="white"
      transition="width 220ms ease"
      overflow="visible"
      flexShrink={0}
      onMouseLeave={onCloseLogoutMenu}
    >
      <Flex direction="column" gap={`${sidebarLayoutSpec.sectionGap}px`}>
        <SidebarNavItem
          icon={toggleIcon}
          label={isExpanded ? "접기" : sidebarControlItem.label}
          isExpanded={isExpanded}
          onClick={onToggleExpanded}
        />
        <Flex direction="column" gap={`${sidebarLayoutSpec.itemGap}px`}>
          {sidebarPrimaryItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              isActive={activeRouteIds.has(item.id)}
            />
          ))}
        </Flex>
      </Flex>

      <Flex direction="column" gap={`${sidebarLayoutSpec.itemGap}px`}>
        {sidebarSecondaryItems.map((item) =>
          item.kind === "user" ? (
            <SidebarUserMenu
              key={item.id}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              isOpen={isLogoutMenuOpen}
              onToggle={onToggleLogoutMenu}
            />
          ) : (
            <SidebarNavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              isActive={activeRouteIds.has(item.id)}
            />
          ),
        )}
      </Flex>
    </Flex>
  );
};
