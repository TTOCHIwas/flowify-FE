import { createContext, useContext } from "react";

export type NodeEditorContextValue = {
  endNodeId: string | null;
  onOpenPanel: (nodeId: string) => void;
  onRemoveNode: (nodeId: string) => void;
  startNodeId: string | null;
};

export const DEFAULT_NODE_EDITOR_CONTEXT: NodeEditorContextValue = {
  startNodeId: null,
  endNodeId: null,
  onOpenPanel: () => {},
  onRemoveNode: () => {},
};

export const NodeEditorContext = createContext<NodeEditorContextValue>(
  DEFAULT_NODE_EDITOR_CONTEXT,
);

export const useNodeEditorContext = () => useContext(NodeEditorContext);
