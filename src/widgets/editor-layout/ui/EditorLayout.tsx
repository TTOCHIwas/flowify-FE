import { Outlet } from "react-router";

import { Box } from "@chakra-ui/react";

export const EditorLayout = () => {
  return (
    <Box w="100vw" h="100dvh" overflow="hidden" bg="gray.50">
      <Outlet />
    </Box>
  );
};
