import React, { useCallback, useMemo } from "react";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Node,
  type NodeChange,
  type NodeTypes,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  CalendarNode,
  CommunicationNode,
  ConditionNode,
  DataProcessNode,
  EarlyExitNode,
  FilterNode,
  LLMNode,
  LoopNode,
  MultiOutputNode,
  NotificationNode,
  OutputFormatNode,
  PlaceholderNode,
  SpreadsheetNode,
  StorageNode,
  TriggerNode,
  WebScrapingNode,
} from "@/entities/node";
import { useWorkflowStore } from "@/shared";

const PLACEHOLDER_OFFSET_X = 280;

const nodeTypes: NodeTypes = {
  communication: CommunicationNode,
  storage: StorageNode,
  spreadsheet: SpreadsheetNode,
  "web-scraping": WebScrapingNode,
  calendar: CalendarNode,
  trigger: TriggerNode,
  filter: FilterNode,
  loop: LoopNode,
  condition: ConditionNode,
  "multi-output": MultiOutputNode,
  "data-process": DataProcessNode,
  "output-format": OutputFormatNode,
  "early-exit": EarlyExitNode,
  notification: NotificationNode,
  llm: LLMNode,
  placeholder: PlaceholderNode,
};

export const Canvas = () => {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const startNodeId = useWorkflowStore((s) => s.startNodeId);
  const endNodeId = useWorkflowStore((s) => s.endNodeId);
  const activePlaceholder = useWorkflowStore((s) => s.activePlaceholder);
  const setActivePlaceholder = useWorkflowStore((s) => s.setActivePlaceholder);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filtered = changes.filter(
        (change) => !("id" in change && change.id.startsWith("placeholder-")),
      );
      if (filtered.length > 0) {
        onNodesChange(filtered);
      }
    },
    [onNodesChange],
  );

  const { setCenter, getViewport } = useReactFlow();

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.id.startsWith("placeholder-")) {
        setActivePlaceholder({ id: node.id, position: node.position });

        const { zoom } = getViewport();
        const viewportWidth = window.innerWidth;
        const offsetX = (viewportWidth * 0.2) / zoom;
        const nodeHeight = node.measured?.height ?? 134;
        const centerY = node.position.y + nodeHeight / 2;

        setCenter(node.position.x + offsetX, centerY, {
          zoom,
          duration: 300,
        });
      } else {
        setActivePlaceholder(null);
      }
    },
    [setActivePlaceholder, setCenter, getViewport],
  );

  const handlePaneClick = useCallback(() => {
    setActivePlaceholder(null);
  }, [setActivePlaceholder]);

  const nodesWithPlaceholders = useMemo(() => {
    const result: Node[] = [...nodes];

    if (!startNodeId) {
      result.push({
        id: "placeholder-start",
        type: "placeholder",
        position: { x: 0, y: 0 },
        data: { label: "시작" },
        initialWidth: 100,
        initialHeight: 134,
        selectable: false,
        draggable: false,
      });
    }

    if (!endNodeId) {
      const anchorX = startNodeId
        ? (nodes.find((n) => n.id === startNodeId)?.position.x ?? 0) +
          PLACEHOLDER_OFFSET_X
        : PLACEHOLDER_OFFSET_X;

      result.push({
        id: "placeholder-end",
        type: "placeholder",
        position: { x: anchorX, y: 0 },
        data: { label: "도착" },
        initialWidth: 100,
        initialHeight: 134,
        selectable: false,
        draggable: false,
      });
    }

    return result;
  }, [nodes, startNodeId, endNodeId]);

  const isPanelOpen = activePlaceholder !== null;

  return (
    <ReactFlow
      nodes={nodesWithPlaceholders}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      panOnDrag={!isPanelOpen}
      zoomOnScroll={!isPanelOpen}
      zoomOnPinch={!isPanelOpen}
      zoomOnDoubleClick={!isPanelOpen}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
