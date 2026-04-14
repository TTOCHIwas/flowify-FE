import { Text } from "@chakra-ui/react";
import { type Node, type NodeProps } from "@xyflow/react";

import { getTypedConfig } from "../../model";
import { type FlowNodeData } from "../../model/types";
import { BaseNode } from "../BaseNode";

export const EarlyExitNode = ({
  id,
  data,
  selected,
}: NodeProps<Node<FlowNodeData>>) => {
  const config = getTypedConfig("early-exit", data.config);
  return (
    <BaseNode id={id} data={data} selected={selected}>
      <Text>{config.condition ?? "조건 미설정"}</Text>
    </BaseNode>
  );
};
