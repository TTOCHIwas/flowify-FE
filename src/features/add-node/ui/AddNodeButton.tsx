import { MdAdd } from "react-icons/md";

import { IconButton, useDisclosure } from "@chakra-ui/react";

import { NodeCategoryDrawer } from "./NodeCategoryDrawer";

export const AddNodeButton = () => {
  const { open, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="노드 추가"
        onClick={onOpen}
        colorPalette="blue"
        size="lg"
        borderRadius="full"
      >
        <MdAdd />
      </IconButton>
      <NodeCategoryDrawer open={open} onClose={onClose} />
    </>
  );
};
