import { type ReactNode } from "react";

import { type NodeEditorContextValue } from "./NodeEditorContext";
import { NodeEditorContext } from "./NodeEditorContext";

type NodeEditorProviderProps = {
  children: ReactNode;
  value: NodeEditorContextValue;
};

export const NodeEditorProvider = ({
  children,
  value,
}: NodeEditorProviderProps) => (
  <NodeEditorContext.Provider value={value}>
    {children}
  </NodeEditorContext.Provider>
);
