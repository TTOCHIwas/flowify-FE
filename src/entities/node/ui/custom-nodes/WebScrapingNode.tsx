import { Text } from "@chakra-ui/react";
import { type Node, type NodeProps } from "@xyflow/react";

import { getTypedConfig } from "../../model";
import { type FlowNodeData } from "../../model/types";
import { BaseNode } from "../BaseNode";

export const WebScrapingNode = ({
  id,
  data,
  selected,
}: NodeProps<Node<FlowNodeData>>) => {
  const config = getTypedConfig("web-scraping", data.config);
  return (
    <BaseNode id={id} data={data} selected={selected}>
      <Text>{config.targetUrl ?? "URL 미설정"}</Text>
    </BaseNode>
  );
};
