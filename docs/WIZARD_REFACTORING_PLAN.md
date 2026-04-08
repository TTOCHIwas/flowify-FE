# 위자드 구현 리팩토링 설계

> **작성일:** 2026-04-06
> **최종 수정:** 2026-04-08 (v4 설계 반영 — 레이아웃 규격, 중간 노드 위자드 OutputPanel 내장)
> **이슈:** #62
> **선행:** #60 (feat#60-wizard-ui-flow), [NODE_SETUP_WIZARD_DESIGN.md](./NODE_SETUP_WIZARD_DESIGN.md)
> **목적:** #60 구현(v1) 이후 발견된 문제를 수정하고, v4 설계 구조로 전환한다.

---

## 목차

1. [완료된 리팩토링 (v1 → v1.1)](#1-완료된-리팩토링-v1--v11)
2. [v2 구조 전환 (완료)](#2-v2-구조-전환-완료)
3. [v3 구조 전환 (완료)](#3-v3-구조-전환-완료)
4. [v4 구조 전환 (예정)](#4-v4-구조-전환-예정)

---

## 1. 완료된 리팩토링 (v1 → v1.1)

> 이 섹션의 변경은 이미 `refector#62wizard-sync-docs` 브랜치에서 구현·머지 완료되었다.

### 1.1 `requiresAuth` 중복 제거

`serviceRequirements.ts`의 `ServiceRequirementGroup.requiresAuth`를 제거하고, `serviceMap.ts`의 `CategoryServiceGroup.requiresAuth`를 단일 출처로 확정했다.

### 1.2 `import type` 컨벤션 수정

`OutputPanel.tsx`에서 value import와 type import를 분리했다.

---

## 2. v2 구조 전환 (완료)

| 영역 | v1 → v2 변경 | 상태 |
|------|-------------|------|
| 시작/도착 위자드 | SSP 내부에서 전체 완료 (4단계 로컬 위자드) | ✅ 완료 |
| 위자드 상태 소유권 | store에서 SSP 로컬 상태로 이동 | ✅ 완료 |
| updateNodeConfig | replace → merge 방식 | ✅ 완료 |
| 패널 닫기 | X + 캔버스 빈 영역 + ESC | ✅ 완료 |
| 삭제 버튼 | selected → hover 표시 | ✅ 완료 |
| Handle | 전체 숨김 (opacity: 0) | ✅ 완료 |
| Edge | smoothstep 렌더링 | ✅ 완료 |
| 노드 선택 시 | 화면 중앙 고정 + 드래그 비활성화 | ✅ 완료 |

---

## 3. v3 구조 전환 (완료)

| 영역 | v2 → v3 변경 | 상태 |
|------|-------------|------|
| 중간 노드 entry | SSP 카테고리 → ChoicePanel (별도 오버레이) | ✅ 완료 |
| SSP 역할 | `isMiddleNodeMode` 제거, 시작/도착 전용 | ✅ 완료 |
| OutputPanel | RequirementSelector 제거, PanelRenderer 전용 | ✅ 완료 |
| 매핑 규칙 데이터 | `mapping_rules.json` 정적 mock 내장 | ✅ 완료 |
| placeholder 분기 | 시작/도착 → SSP, 중간 → ChoicePanel | ✅ 완료 |

---

## 4. v4 구조 전환 (예정)

> 피그마 디자인 기반으로 레이아웃 규격을 적용하고, 중간 노드 위자드를 ChoicePanel(별도 오버레이)에서 **OutputPanel 내장**으로 전환한다. [NODE_SETUP_WIZARD_DESIGN.md](./NODE_SETUP_WIZARD_DESIGN.md) v4 참조.

### 4.1 변경 개요

| 영역 | v3 (현재 구현) | v4 (목표) |
|------|---------------|-----------|
| 시작/도착 위자드 레이아웃 | "캔버스 중앙 오버레이" (구체적 규격 없음) | `[노드 100px] ─48px─ [카드 shadow+rounded-20px]`, 화면 정중앙 |
| 중간 노드 위자드 | **ChoicePanel** (별도 중앙 오버레이) | **OutputPanel 내장** — 왼쪽(InputPanel) + 오른쪽(OutputPanel 위자드) |
| 듀얼 패널 레이아웃 | 화면 양 끝에 타이트하게 붙음 | 각 690px × 800px, 전체 1676px 중앙, 296px gap |
| 패널 사이 노드 표시 | 모든 노드 보임 | **설정 중인 노드 체인만** (이전→현재→다음), 나머지 hidden |
| 설정 중 서비스 아이콘 | 노드 위에 표시됨 | **isConfigured: true 이후에만** 표시 |
| CreationMethodNode | 도착 노드 아이콘 배치 즉시 표시 | **도착 노드 isConfigured: true 이후에만** 표시 |
| 설정 완료 후 상세 모드 | OutputPanel = PanelRenderer | OutputPanel = "나가는 데이터" + "테스트 해보기" 버튼 |
| InputPanel 상세 모드 | 들어오는 데이터만 | 들어오는 데이터 + **처리 방식** + **직접 입력** |

### 4.2 파일별 변경 상세

[NODE_SETUP_WIZARD_DESIGN.md 13장](./NODE_SETUP_WIZARD_DESIGN.md#13-파일별-변경-요약) 참조.

| 파일 | 주요 변경 |
|------|-----------|
| `ServiceSelectionPanel.tsx` | 피그마 레이아웃 규격 적용, 단계별 가이드라인 제목 + 왼쪽 노드 아이콘 |
| `OutputPanel.tsx` | 위자드 모드(isConfigured: false + 중간 노드) + 상세 모드("나가는 데이터") 이중 역할 |
| `InputPanel.tsx` | 설정 완료 시 "처리 방식" + 옵션 목록 + 직접 입력 필드 추가 |
| `Canvas.tsx` | 듀얼 패널 1676px 레이아웃, 노드 체인 필터링, CreationMethodNode 조건부 표시 |
| `BaseNode.tsx` | 서비스 아이콘 isConfigured 조건부 표시 |
| `choice-panel/ui/` | ChoicePanel.tsx **제거**, 서브 컴포넌트 OutputPanel로 이동 |
| `WorkflowEditorPage.tsx` | ChoicePanel 렌더링 제거 |

### 4.3 구현 순서 (권장)

```
1. SSP 레이아웃 — 피그마 규격 적용 (노드+카드 배치, 가이드라인 제목)
2. BaseNode — 서비스 아이콘 isConfigured 조건부 표시
3. Canvas — 듀얼 패널 레이아웃 컨테이너 (1676px, 690px 패널)
4. Canvas — 패널 열림 시 노드 체인 필터링 (관련 노드만 visible)
5. Canvas — CreationMethodNode 표시 조건 (endNode isConfigured 체크)
6. Canvas — 중간 placeholder 클릭 → activePanelNodeId 직접 설정 (activePlaceholder 미사용)
7. OutputPanel — 위자드 모드 (isConfigured === false + 중간 노드) 구현
8. OutputPanel — 상세 모드 ("나가는 데이터" + 테스트 버튼) 구현
9. InputPanel — 설정 완료 시 "처리 방식" + 직접 입력 필드
10. ChoicePanel UI 제거 — 컴포넌트 삭제, WorkflowEditorPage에서 렌더링 제거
11. 통합 검증 — 회귀 및 UX 점검
```

> 순서 근거: SSP 레이아웃과 BaseNode 아이콘 조건은 독립적이므로 먼저 처리. Canvas 레이아웃은 OutputPanel 위자드 모드가 동작하기 전에 컨테이너가 준비되어야 한다. OutputPanel 위자드 모드가 완성된 후 ChoicePanel을 제거해야 중간 전환 기간에 빌드가 깨지지 않는다.
