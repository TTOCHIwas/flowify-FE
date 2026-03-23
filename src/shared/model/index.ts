// 전역 Zustand 스토어는 이 레이어에서 관리합니다.
// entities / features / widgets 어느 레이어에서든 import 가능합니다.
//
// 현재 등록된 스토어:
// - workflowStore

export {
  selectActiveNode,
  selectIsConfigured,
  useWorkflowStore,
  type ExecutionStatus,
} from "./workflowStore";
