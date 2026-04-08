# 노드 설정 위자드 상세 설계

> **작성일:** 2026-04-05
> **최종 수정:** 2026-04-08 (v4 — 레이아웃 규격 반영, 중간 노드 위자드를 오른쪽 패널 내장으로 전환)
> **선행 문서:** [FRONTEND_DESIGN_DOCUMENT.md](./FRONTEND_DESIGN_DOCUMENT.md), [FOUNDATION_IMPLEMENTATION_PLAN.md](./FOUNDATION_IMPLEMENTATION_PLAN.md)
> **목적:** 시작/도착 노드 및 중간 노드의 설정 위자드 흐름을 설계한다.
>
> **v4 변경 요약:**
> - 시작/도착 노드 위자드: 피그마 레이아웃 규격 반영 (`[노드 아이콘] —48px— [위자드 카드]`, 화면 정중앙)
> - 중간 노드 위자드: 별도 오버레이(ChoicePanel) → **오른쪽 패널(OutputPanel) 내장**으로 전환
> - 듀얼 패널 레이아웃 규격: 각 690px, 전체 1676px 중앙, 사이 296px gap에 노드 체인
> - 설정 중 노드 위 불필요한 서비스 아이콘 완전 제거
> - "생성 방식을 결정하세요" → 모든 위자드 단계 완료 후에만 표시
> - 패널 사이에 설정 중인 노드 체인만 표시 (다른 노드 숨김)

---

## 목차

1. [설계 원칙](#1-설계-원칙)
2. [위자드 흐름 정의](#2-위자드-흐름-정의)
3. [Store 설계](#3-store-설계)
4. [ServiceSelectionPanel 설계](#4-serviceselectionpanel-설계)
5. [중간 노드 위자드 설계 (OutputPanel 내장)](#5-중간-노드-위자드-설계-outputpanel-내장)
6. [OutputPanel 설계](#6-outputpanel-설계)
7. [InputPanel 설계](#7-inputpanel-설계)
8. [패널 닫기 규칙](#8-패널-닫기-규칙)
9. [노드 인터랙션 및 레이아웃 규칙](#9-노드-인터랙션-및-레이아웃-규칙)
10. [Edge 렌더링](#10-edge-렌더링)
11. [상태 전이 다이어그램](#11-상태-전이-다이어그램)
12. [비정상 종료 및 상태 정리](#12-비정상-종료-및-상태-정리)
13. [파일별 변경 요약](#13-파일별-변경-요약)

---

## 1. 설계 원칙

### 1.1 패널 사용 분리

| 노드 유형 | 설정 수단 | 레이아웃 |
|-----------|-----------|----------|
| **시작/도착 노드** | ServiceSelectionPanel — 화면 정중앙 오버레이 | `[노드 아이콘] —48px— [위자드 카드]` |
| **중간 노드 (설정 진행 중)** | 듀얼 패널 — 왼쪽(InputPanel: 들어오는 데이터) + 오른쪽(OutputPanel: 위자드 단계) | 패널 사이에 노드 체인 표시 |
| **중간 노드 (설정 완료 후 클릭)** | 듀얼 패널 — 왼쪽(들어오는 데이터 + 처리 방식) + 오른쪽(나가는 데이터) | 동일한 듀얼 패널 레이아웃 |

> **v3 → v4 핵심 변경:**
> - v3에서 중간 노드의 위자드는 **ChoicePanel**(별도 중앙 오버레이)이었다.
> - v4에서는 **오른쪽 패널(OutputPanel) 안에 위자드 단계를 내장**한다. 패널 수를 늘리지 않고, 기존 듀얼 패널 구조를 그대로 활용한다.
> - ChoicePanel의 **매핑 규칙 데이터와 로직**은 유지하되, UI 위치만 오른쪽 패널로 이동한다.

### 1.2 시작/도착 노드 — 위자드 오버레이

시작/도착 노드는 캔버스에 노드가 아직 없거나 초기 설정 단계이므로, **화면 중앙 오버레이**로 전체 위자드를 진행한다.

**피그마 레이아웃 규격:**

```
화면 전체
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                   [ 가이드라인 제목 ]                          │
│                     (bold 24px, 중앙)                         │
│                                                              │
│   [노드 아이콘]  ────48px────  [위자드 카드]                    │
│    (100px 영역)               (흰 배경, shadow, rounded-20px)  │
│    아이콘 + 서비스명             padding 48px                   │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- **노드 영역:** 너비 100px, 아이콘(80x71) + 서비스명(bold 16px)
- **노드 ↔ 위자드 카드 간격:** 48px (시작·도착 동일)
- **위자드 카드:** 흰 배경, border `#f2f2f2`, `border-radius: 20px`, `box-shadow: 0 4px 4px rgba(0,0,0,0.25)`, padding 48px
- **가이드라인 제목:** 위자드 카드 상단 중앙, bold 24px, padding-bottom 24px
- **전체 위치:** 화면 정중앙 (absolute 50%/50%)
- **시작/도착 완전 동일:** 배치, 간격, 비율이 양쪽 100% 동일해야 함

### 1.3 중간 노드 — 듀얼 패널 내장 위자드

중간 노드는 이전 노드의 출력 데이터를 왼쪽에서 확인하면서, 오른쪽 패널에서 위자드를 진행한다.

**피그마 레이아웃 규격:**

```
                     전체 1676px, 화면 중앙
┌─────────────┐                                ┌─────────────┐
│ 왼쪽 패널    │  [노드A] → [현재 노드] → [노드B] │ 오른쪽 패널   │
│ 690px       │       296px gap                │ 690px       │
│ height:800px │     노드 체인 중앙 배치          │ height:800px │
│             │                                │             │
│ 들어오는     │                                │ 설정 (위자드) │
│ 데이터       │                                │ 또는         │
│             │                                │ 나가는 데이터  │
└─────────────┘                                └─────────────┘
```

- **패널 너비:** 각 690px (min-width, max-width 모두 690px)
- **패널 높이:** 800px
- **패널 스타일:** 흰 배경, border `#f2f2f2`, `border-radius: 20px`, `box-shadow: 0 4px 4px rgba(0,0,0,0.25)`, padding 24px (12px horizontal, 24px vertical)
- **전체 컨테이너:** 1676px, 화면 중앙 (top 140px 기준)
- **패널 사이 gap:** 296px — 이 공간에 **설정 중인 노드 체인만** 표시
- **다른 노드 숨김:** 패널이 열려 있을 때 관련 없는 노드는 보이지 않음

### 1.4 패널 독점 규칙

동시에 하나의 패널 모드만 활성화된다:

| 상태 | ServiceSelectionPanel | InputPanel | OutputPanel |
|------|----------------------|------------|-------------|
| SSP 열림 (시작/도착 위자드) | O | X | X |
| 듀얼 패널 열림 (중간 노드) | X | O | O |
| 모두 닫힘 | X | X | X |

> **v3 대비 변경:** v3에서는 ChoicePanel이 열리면 InputPanel/OutputPanel이 숨겨졌다. v4에서는 ChoicePanel이 사라지고, 중간 노드 설정 시 처음부터 **InputPanel + OutputPanel(위자드 내장)** 이 함께 열린다.

### 1.5 통일된 닫기 동작

모든 패널은 동일한 3가지 방법으로 닫을 수 있어야 한다:
1. **X 버튼** 클릭
2. **캔버스 빈 영역** 클릭
3. **ESC** 키

### 1.6 isConfigured 판정

`isConfigured`는 `node.data.config.isConfigured` (BaseNodeConfig의 필드)이다. `node.data` 직접 필드가 아님에 유의.

현재 store의 `updateNodeConfig()`는 config를 **merge**하며 `isConfigured: true`를 주입한다:

```typescript
// store 구현 — 기존 config를 보존하며 merge
node.data.config = {
  ...node.data.config,
  ...전달된config,
  isConfigured: true,
};
```

**원칙:** `updateNodeConfig()`는 **위자드의 최종 완료 시점에만** 호출한다.

### 1.7 설정 중 노드 아이콘 표시 규칙

**설정이 진행 중인 노드 위에 서비스 아이콘을 표시하지 않는다.**

- 시작/도착 노드: 위자드 진행 중 캔버스에 표시되는 노드는 **placeholder 상태 또는 아이콘 없는 빈 노드**
- 중간 노드: 설정 완료 전까지 별도 아이콘 없음
- 서비스 아이콘은 **위자드가 완전히 끝나고 isConfigured: true가 된 후에만** 노드 위에 표시

### 1.8 "생성 방식을 결정하세요" 표시 규칙

도착 노드 설정 후 나타나는 "생성 방식을 결정하세요" (CreationMethodNode) UI는 **도착 노드의 모든 위자드 단계가 완료된 후에만** 표시한다.

```
위자드 진행 중 → CreationMethodNode 숨김
위자드 완료 (isConfigured: true) → CreationMethodNode 표시
```

---

## 2. 위자드 흐름 정의

### 2.1 시작/도착 노드 설정 흐름

시작/도착 노드는 **ServiceSelectionPanel 내부**에서 모든 단계를 완료한다. 화면 중앙에 `[노드 아이콘] —48px— [위자드 카드]` 레이아웃으로 표시된다.

```
[Placeholder 클릭]
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 1: 카테고리 선택 (ServiceSelectionPanel)       │
│                                                     │
│  레이아웃:                                           │
│  [시작/도착 노드 아이콘] ─48px─ [카테고리 그리드 카드]  │
│                                                     │
│  제목: "어디에서 어디로 갈까요?"                       │
│  카드 내용: 검색바 + 서비스 아이콘 7열 2행 그리드       │
│                                                     │
│  분기:                                              │
│    A) 서비스 있는 카테고리 → Step 2                   │
│    B) 서비스 없음 + 요구사항 있음 → 바로 배치 → Step 3 │
│    C) 서비스 없음 + 요구사항 없음 → 배치 + 완료        │
└─────────────────────────────────────────────────────┘
    │
    ├── A) 서비스 있는 카테고리
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 2: 서비스 선택 (ServiceSelectionPanel 내부)     │
│                                                     │
│  레이아웃:                                           │
│  [시작/도착 노드 아이콘] ─48px─ [서비스 목록 카드]     │
│                                                     │
│  카드 내용: 해당 카테고리의 서비스 아이콘 그리드         │
│  "뒤로" → Step 1                                     │
│  서비스 선택 시:                                      │
│    1. placeNode(meta, service) — 노드를 캔버스에 배치  │
│    2. 요구사항 있으면 → Step 3                         │
│    3. 요구사항 없으면 → 완료                           │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 3: 요구사항 선택 (ServiceSelectionPanel 내부)   │
│                                                     │
│  레이아웃:                                           │
│  [선택된 서비스 아이콘+이름] ─48px─ [요구사항 목록 카드] │
│                                                     │
│  카드 제목: "구체적인 제목"                            │
│  카드 내용: 아이콘 + 텍스트 리스트 항목                 │
│  "뒤로" → 노드 제거 + Step 2 (또는 Step 1)            │
│  요구사항 선택 시:                                     │
│    인증 필요 → Step 4                                │
│    인증 불필요 → updateNodeConfig + 완료              │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 4: 인증 (ServiceSelectionPanel 내부)           │
│                                                     │
│  레이아웃:                                           │
│  [선택된 서비스 아이콘+이름] ─48px─ [인증 카드]        │
│                                                     │
│  제목: "인증은 가장 처음 한 번만 진행됩니다."           │
│  카드 내용: "인증이 필요합니다." + OAuth 버튼           │
│  "뒤로" → Step 3                                     │
│  인증 완료 → updateNodeConfig + 완료                  │
└─────────────────────────────────────────────────────┘
```

### 2.2 중간 노드 설정 흐름

중간 노드는 placeholder 클릭 시 **듀얼 패널이 즉시 열린다.** 왼쪽(InputPanel)에 이전 노드의 데이터를 표시하고, 오른쪽(OutputPanel)에서 위자드 단계를 진행한다.

```
[중간 placeholder 클릭]
    │
    ├── activePanelNodeId 설정 (듀얼 패널 열림)
    │   → InputPanel: 이전 노드 데이터 표시
    │   → OutputPanel: 위자드 모드 진입
    │
    ├── 이전(leaf) 노드의 outputTypes[0] 확인
    │   → DataType(kebab) → MappingKey(SCREAMING_SNAKE) 변환
    │   → 매핑 규칙 데이터에서 해당 data_type 조회
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 1: 처리 방식 (OutputPanel 내부)                │
│                                                     │
│  - requires_processing_method === true일 때만 표시   │
│  - 질문: "파일들을 어떻게 처리할까요?" 등              │
│  - 선택지:                                           │
│    A) node_type 있음 (예: LOOP)                      │
│       → 해당 노드 생성 + output_data_type 변경        │
│       → 새 output_data_type의 actions 조회            │
│       → actions 비어있으면 완료, 있으면 Step 2         │
│    B) node_type === null (예: "전체 사용")            │
│       → 노드 미생성, output_data_type 유지            │
│       → 현재 data_type의 actions 조회                 │
│       → actions 비어있으면 완료, 있으면 Step 2         │
│                                                     │
│  - requires_processing_method === false이면           │
│    바로 Step 2로 진행                                 │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 2: 액션 선택 (OutputPanel 내부)                │
│  - priority 순으로 정렬된 선택지 목록                  │
│  - applicable_when 조건으로 필터링                    │
│  - 선택 시:                                          │
│    1. 해당 action의 node_type으로 노드 생성            │
│    2. follow_up 있으면 → Step 3                      │
│    3. branch_config 있으면 → Step 3                  │
│    4. 둘 다 없으면 → updateNodeConfig → 완료          │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  Step 3: 후속 설정 (OutputPanel 내부)                │
│  - follow_up: 단일/다중 선택 또는 텍스트 입력          │
│  - branch_config: 분기 기준 선택 (multi_select 가능)  │
│  - 완료 → updateNodeConfig                           │
│  - "뒤로" → Step 2로 복귀 (노드 제거)                 │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  완료 → OutputPanel이 위자드 모드에서 상세 모드로 전환   │
│  - 노드: isConfigured: true                          │
│  - OutputPanel: 위자드 UI → 나가는 데이터 표시로 전환   │
│  - InputPanel: 들어오는 데이터 + 처리 방식 표시         │
└─────────────────────────────────────────────────────┘
```

### 2.3 중간 노드 — 설정 완료 후 클릭

이미 설정이 완료된 중간 노드를 클릭하면 **듀얼 패널의 상세 모드**가 열린다.

**왼쪽 패널 (InputPanel):**
- 이전 노드에서 들어오는 데이터 (파일 목록 등)
- 데이터 처리 방식 표시 (예: "내용 요약/정리")
- 선택된 처리 옵션 목록 (예: "키워드별 요약", "정해진 형식에 맞춰서")
- 직접 입력 필드 (`{@파일 1}을 기준으로 ...`)

**오른쪽 패널 (OutputPanel):**
- 나가는 데이터 표시 (예: "요약된 데이터")
- 하단에 "테스트 해보기" 버튼

### 2.4 시작 노드의 InputPanel

시작 노드 클릭 시 InputPanel에는 "이전 노드" 대신 **사용자 데이터**(향후 연동 시 사용자 계정 정보 등)를 표시한다. 현재 단계에서는 "시작점" 안내 메시지를 표시한다.

---

## 3. Store 설계

### 3.1 위자드 관련 store 필드 — 제거

v1에서 사용하던 다음 3개 필드를 **store에서 제거**한다:

| 필드 | v1 용도 | 불필요한 이유 |
|------|---------|-------------|
| `wizardStep` | OutputPanel의 위자드 단계 분기 | 시작/도착 위자드가 SSP 로컬 상태로 이동, 중간 노드 위자드가 OutputPanel 로컬 상태로 이동 |
| `wizardConfigPreset` | 인증 대기 중 configPreset 임시 저장 | SSP 로컬 상태로 이동 |
| `wizardSourcePlaceholder` | 뒤로가기 시 placeholder 복원 | SSP 로컬 상태로 이동 |

### 3.2 유지되는 store 상태

| 필드 | 용도 |
|------|------|
| `activePlaceholder` | ServiceSelectionPanel 표시 여부 + 위치 정보 |
| `activePanelNodeId` | InputPanel/OutputPanel 표시 대상 노드 |
| `startNodeId` / `endNodeId` | 시작/도착 노드 추적 |
| `creationMethod` | 수동/AI 생성 모드 |

### 3.3 v4 추가 상태 — 중간 노드 위자드 모드

중간 노드 placeholder 클릭 시, 노드를 배치하고 듀얼 패널을 열어야 한다. OutputPanel이 위자드 모드인지 상세 모드인지를 판별하기 위해 **노드의 `isConfigured` 상태를 직접 사용**한다:

```typescript
// OutputPanel 내부에서 판별
const activeNode = nodes.find((n) => n.id === activePanelNodeId);
const isWizardMode = activeNode && !activeNode.data.config.isConfigured;
const isDetailMode = activeNode && activeNode.data.config.isConfigured;
```

별도 store 필드 없이, 노드의 `isConfigured` 값으로 모드를 결정한다.

### 3.4 removeNode 수정

```typescript
removeNode: (id) =>
  set((state) => {
    // ... 기존 노드/엣지 삭제 로직 ...

    // 삭제된 노드가 패널 대상이면 패널 닫기
    if (state.activePanelNodeId && removeTargets.has(state.activePanelNodeId)) {
      state.activePanelNodeId = null;
    }

    // ... startNodeId/endNodeId 정리 ...
  }),
```

### 3.5 updateNodeConfig — merge 방식

```typescript
updateNodeConfig: (nodeId, config) =>
  set((state) => {
    const node = state.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data.config = {
        ...node.data.config,  // 기존 config 보존
        ...config,            // 전달된 값으로 덮어쓰기
        isConfigured: true,   // 항상 true 주입
      };
    }
  }),
```

### 3.6 resetEditor

`initialState` 스프레드로 전체 상태가 초기화된다. SSP 및 OutputPanel 위자드 로컬 상태는 컴포넌트 unmount 시 자동 소멸.

---

## 4. ServiceSelectionPanel 설계

### 4.1 책임 범위

ServiceSelectionPanel은 **시작/도착 노드 전용**이다. 중간 노드는 OutputPanel 내장 위자드가 담당한다 (5절 참조).

| 진입 조건 | 처리 단계 |
|-----------|-----------|
| 시작/도착 placeholder 클릭 (`placeholder-start` 또는 `placeholder-end`) | category → service → requirement → auth (전체) |

### 4.2 레이아웃 규격

**공통 구조 (모든 단계에서 동일):**

```typescript
// SSP 오버레이 컨테이너
<Box
  position="absolute"
  left="50%"
  top="50%"
  transform="translate(-50%, -50%)"
>
  {/* 가이드라인 제목 — 카드 위 중앙 */}
  <Text
    fontSize="24px"
    fontWeight="bold"
    textAlign="center"
    pb="24px"
  >
    {guidelineTitle}
  </Text>

  {/* 노드 + 카드 수평 배치 */}
  <Flex gap="48px" alignItems="center">
    {/* 왼쪽: 노드 아이콘 + 서비스명 */}
    <Box width="100px" textAlign="center">
      <Image src={nodeIcon} width="80px" height="71px" />
      <Text fontSize="16px" fontWeight="bold">{serviceName}</Text>
    </Box>

    {/* 오른쪽: 위자드 카드 */}
    <Box
      bg="white"
      border="1px solid #f2f2f2"
      borderRadius="20px"
      boxShadow="0 4px 4px rgba(0,0,0,0.25)"
      p="48px"
      overflow="hidden"
    >
      {/* 단계별 내용 */}
    </Box>
  </Flex>
</Box>
```

**시작/도착 노드 완전 동일 규칙:**
- 노드 아이콘 위치: 항상 왼쪽
- 위자드 카드 위치: 항상 오른쪽
- 간격, 크기, 스타일: 양쪽 100% 동일

**노드 아이콘 상태별 표시:**

| 위자드 단계 | 왼쪽 노드 영역 |
|------------|---------------|
| Step 1 (카테고리 선택) | placeholder 아이콘 (점선 박스 + "시작" 또는 "도착") |
| Step 2 (서비스 선택) | placeholder 아이콘 유지 |
| Step 3 (요구사항 선택) | 선택된 서비스 아이콘 + 서비스명 |
| Step 4 (인증) | 선택된 서비스 아이콘 + 서비스명 |

### 4.3 표시 조건

```typescript
const isStartOrEndPlaceholder =
  activePlaceholder?.id === "placeholder-start" ||
  activePlaceholder?.id === "placeholder-end";

// ServiceSelectionPanel은 isStartOrEndPlaceholder일 때만 렌더링
if (!isStartOrEndPlaceholder) return null;
```

### 4.4 로컬 상태

```typescript
type WizardStep = "category" | "service" | "requirement" | "auth";

const [step, setStep] = useState<WizardStep>("category");
const [searchQuery, setSearchQuery] = useState("");
const [selectedMeta, setSelectedMeta] = useState<NodeMeta | null>(null);
const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
const [placedNodeId, setPlacedNodeId] = useState<string | null>(null);
const [selectedRequirementPreset, setSelectedRequirementPreset] =
  useState<Record<string, unknown> | null>(null);
```

모든 위자드 상태가 **로컬**이다. store에는 `activePlaceholder` 하나만 사용하여 오버레이 표시 여부를 제어한다.

### 4.5 단계별 가이드라인 제목

| 위자드 단계 | 가이드라인 제목 |
|------------|---------------|
| Step 1 (카테고리 선택) | "어디에서 어디로 갈까요?" |
| Step 2 (서비스 선택) | "서비스를 선택해주세요." |
| Step 3 (요구사항 선택) | "어떻게 사용하시겠어요?" |
| Step 4 (인증) | "인증은 가장 처음 한 번만 진행됩니다." |

### 4.6 handleCategorySelect

```typescript
const handleCategorySelect = (meta: NodeMeta) => {
  const serviceGroup = CATEGORY_SERVICE_MAP[meta.type];

  if (serviceGroup && serviceGroup.services.length > 0) {
    // A) 서비스 있는 카테고리 → Step 2
    setSelectedMeta(meta);
    setStep("service");
    return;
  }

  // 서비스 없는 노드 → 바로 배치
  const nodeId = placeNode(meta);
  if (!nodeId) return;

  const reqGroup = SERVICE_REQUIREMENTS[meta.type];
  if (reqGroup) {
    // B) 서비스 없음 + 요구사항 있음 → Step 3
    setSelectedMeta(meta);
    setPlacedNodeId(nodeId);
    setStep("requirement");
    return;
  }

  // C) 서비스 없음 + 요구사항 없음 → 바로 완료
  updateNodeConfig(nodeId, {});
  resetWizard();
};
```

### 4.7 handleServiceSelect

```typescript
const handleServiceSelect = (service: ServiceOption) => {
  if (!selectedMeta) return;

  const nodeId = placeNode(selectedMeta, service);
  if (!nodeId) return;

  setSelectedService(service);
  setPlacedNodeId(nodeId);

  const reqGroup = SERVICE_REQUIREMENTS[selectedMeta.type];
  if (reqGroup) {
    setStep("requirement");
    return;
  }

  updateNodeConfig(nodeId, {});
  resetWizard();
};
```

### 4.8 handleRequirementSelect

```typescript
const handleRequirementSelect = (req: ServiceRequirement) => {
  if (!placedNodeId || !selectedMeta) return;

  const serviceGroup = CATEGORY_SERVICE_MAP[selectedMeta.type];

  if (serviceGroup?.requiresAuth) {
    setSelectedRequirementPreset(req.configPreset);
    setStep("auth");
    return;
  }

  updateNodeConfig(placedNodeId, req.configPreset);
  resetWizard();
};
```

### 4.9 handleAuth

```typescript
const handleAuth = () => {
  if (!placedNodeId || !selectedRequirementPreset) return;

  // TODO: 실제 OAuth 인증 흐름 연동
  updateNodeConfig(placedNodeId, selectedRequirementPreset);
  resetWizard();
};
```

### 4.10 뒤로가기 핸들러

```typescript
// Step 2 (서비스) → Step 1 (카테고리)
const handleBackToCategory = () => {
  setSelectedMeta(null);
  setSelectedService(null);
  setStep("category");
};

// Step 3 (요구사항) → 이전 단계
const handleBackFromRequirement = () => {
  if (placedNodeId) {
    removeNode(placedNodeId);
    setPlacedNodeId(null);
  }

  if (selectedService) {
    setSelectedService(null);
    setStep("service");
  } else {
    setSelectedMeta(null);
    setStep("category");
  }
};

// Step 4 (인증) → Step 3 (요구사항)
const handleBackToRequirement = () => {
  setSelectedRequirementPreset(null);
  setStep("requirement");
};
```

### 4.11 handleOverlayClose (X / 배경 클릭 / ESC)

```typescript
const handleOverlayClose = () => {
  // 배치된 노드가 있으면 캔버스에 유지 (config 미완료 상태)
  resetWizard();
};
```

### 4.12 resetWizard

```typescript
const resetWizard = () => {
  setStep("category");
  setSearchQuery("");
  setSelectedMeta(null);
  setSelectedService(null);
  setPlacedNodeId(null);
  setSelectedRequirementPreset(null);
  setActivePlaceholder(null);  // 오버레이 닫힘
};
```

### 4.13 ESC 키 처리

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && activePlaceholder) {
      handleOverlayClose();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activePlaceholder]);
```

### 4.14 store 구독

```typescript
// 읽기
const activePlaceholder = useWorkflowStore((s) => s.activePlaceholder);
const startNodeId = useWorkflowStore((s) => s.startNodeId);
const endNodeId = useWorkflowStore((s) => s.endNodeId);

// 쓰기
const setActivePlaceholder = useWorkflowStore((s) => s.setActivePlaceholder);
const setStartNodeId = useWorkflowStore((s) => s.setStartNodeId);
const setEndNodeId = useWorkflowStore((s) => s.setEndNodeId);
const openPanel = useWorkflowStore((s) => s.openPanel);
const removeNode = useWorkflowStore((s) => s.removeNode);
const updateNodeConfig = useWorkflowStore((s) => s.updateNodeConfig);
const onConnect = useWorkflowStore((s) => s.onConnect);
```

---

## 5. 중간 노드 위자드 설계 (OutputPanel 내장)

### 5.1 개요

중간 노드의 위자드는 **별도 오버레이가 아니라, 듀얼 패널의 오른쪽(OutputPanel) 안에서** 진행된다. 이전 노드의 `outputTypes`를 기반으로 매핑 규칙 데이터를 조회하여 사용자에게 가능한 처리 방식을 제공한다.

| 항목 | 내용 |
|------|------|
| **위치** | OutputPanel 내부 (위자드 모드) |
| **진입 조건** | 중간 placeholder 클릭 → 노드 배치 → `openPanel(nodeId)` → OutputPanel이 `isConfigured === false` 감지 |
| **데이터 소스** | 정적 매핑 규칙 (Phase 2에서 백엔드 API로 교체) |
| **UI 형태** | OutputPanel 안의 단계별 선택 UI |
| **상태** | OutputPanel 내부의 로컬 상태 |

> **v3 → v4 변경:** v3의 ChoicePanel(독립 오버레이)이 사라지고, 그 로직과 데이터가 OutputPanel 내부로 통합된다.

### 5.2 매핑 규칙 데이터 구조

#### 파일 위치

매핑 규칙 관련 모델 파일은 기존 위치를 유지한다:

```
src/features/choice-panel/
├── model/
│   ├── index.ts
│   ├── mappingRules.ts          ← 정적 매핑 규칙 데이터
│   ├── types.ts                 ← 매핑 규칙 타입 정의
│   └── dataTypeKeyMap.ts        ← DataType ↔ MappingKey 변환
└── index.ts
```

> **ui/ 디렉토리 변경:** v3의 `ui/ChoicePanel.tsx`, `ui/ProcessingMethodStep.tsx`, `ui/ActionStep.tsx`, `ui/FollowUpStep.tsx`는 **제거**한다. 이 UI 로직은 OutputPanel 내부의 위자드 모드 컴포넌트로 대체된다.

#### 타입 정의 (`types.ts`)

v3과 동일 — 변경 없음.

```typescript
/** 매핑 규칙에서 사용하는 데이터 타입 키 (백엔드 형식) */
export type MappingDataTypeKey =
  | "FILE_LIST"
  | "SINGLE_FILE"
  | "EMAIL_LIST"
  | "SINGLE_EMAIL"
  | "SPREADSHEET_DATA"
  | "API_RESPONSE"
  | "SCHEDULE_DATA"
  | "TEXT";

/** 매핑 규칙에서 사용하는 노드 타입 (백엔드 형식) */
export type MappingNodeType =
  | "LOOP"
  | "CONDITION_BRANCH"
  | "AI"
  | "DATA_FILTER"
  | "AI_FILTER"
  | "PASSTHROUGH";

/** follow_up 옵션 */
export interface FollowUpOption {
  id: string;
  label: string;
  type?: "text_input";
}

/** follow_up 설정 */
export interface FollowUp {
  question: string;
  options?: FollowUpOption[];
  options_source?: "fields_from_data" | "fields_from_service";
  multi_select?: boolean;
  description?: string;
}

/** branch_config 설정 */
export interface BranchConfig {
  question: string;
  options?: FollowUpOption[];
  options_source?: "fields_from_data";
  multi_select?: boolean;
  description?: string;
}

/** applicable_when 조건 */
export interface ApplicableWhen {
  file_subtype?: string[];
}

/** 처리 방식 옵션 (Step 1) */
export interface ProcessingMethodOption {
  id: string;
  label: string;
  node_type: MappingNodeType | null;
  output_data_type: MappingDataTypeKey;
  priority: number;
}

/** 처리 방식 질문 */
export interface ProcessingMethod {
  question: string;
  options: ProcessingMethodOption[];
}

/** 액션 선택지 (Step 2) */
export interface MappingAction {
  id: string;
  label: string;
  node_type: MappingNodeType;
  output_data_type: MappingDataTypeKey;
  priority: number;
  description?: string;
  applicable_when?: ApplicableWhen;
  follow_up?: FollowUp;
  branch_config?: BranchConfig;
}

/** 데이터 타입별 매핑 규칙 */
export interface DataTypeMapping {
  label: string;
  description: string;
  requires_processing_method: boolean;
  processing_method?: ProcessingMethod;
  actions: MappingAction[];
}

/** 전체 매핑 규칙 */
export interface MappingRules {
  data_types: Record<MappingDataTypeKey, DataTypeMapping>;
  node_types: Record<MappingNodeType, { label: string; description: string }>;
  service_fields: Record<string, string[]>;
}
```

#### DataType ↔ MappingKey 변환 (`dataTypeKeyMap.ts`)

v3과 동일 — 변경 없음.

#### 백엔드 노드 타입 → 프론트엔드 NodeType 변환

v3과 동일 — 변경 없음.

#### 매핑 규칙 데이터 (`mappingRules.ts`)

v3과 동일 — 변경 없음.

### 5.3 OutputPanel 내부 위자드 로컬 상태

OutputPanel이 `isConfigured === false`인 노드를 감지하면, 위자드 모드로 진입한다. 위자드 상태는 **OutputPanel의 로컬 상태**로 관리된다:

```typescript
type WizardStep = "processing-method" | "action" | "follow-up";

// OutputPanel 내부
const [wizardStep, setWizardStep] = useState<WizardStep | null>(null);
const [currentDataTypeKey, setCurrentDataTypeKey] = useState<MappingDataTypeKey | null>(null);
const [selectedProcessingOption, setSelectedProcessingOption] = useState<ProcessingMethodOption | null>(null);
const [selectedAction, setSelectedAction] = useState<MappingAction | null>(null);
const [followUpSelections, setFollowUpSelections] = useState<Record<string, string | string[]>>({});
```

### 5.4 초기화 — 이전 노드 outputTypes 확인

```typescript
// OutputPanel 내부
const activeNode = nodes.find((n) => n.id === activePanelNodeId);
const isWizardMode = activeNode && !activeNode.data.config.isConfigured;

// 이전 노드의 outputTypes 확인 (중간 노드일 때)
const isStartNode = activeNode?.id === startNodeId;
const isEndNode = activeNode?.id === endNodeId;
const isMiddleNode = !isStartNode && !isEndNode;

useEffect(() => {
  if (!isWizardMode || !isMiddleNode) return;

  // 이전 노드 찾기 (edges에서 target이 현재 노드인 edge의 source)
  const incomingEdge = edges.find((e) => e.target === activePanelNodeId);
  const parentNode = incomingEdge
    ? nodes.find((n) => n.id === incomingEdge.source)
    : null;
  const parentOutputType = parentNode?.data.outputTypes[0] ?? null;

  if (!parentOutputType) return;

  const mappingKey = toMappingKey(parentOutputType);
  const dataType = MAPPING_RULES.data_types[mappingKey];
  setCurrentDataTypeKey(mappingKey);

  if (dataType.requires_processing_method) {
    setWizardStep("processing-method");
  } else {
    setWizardStep("action");
  }
}, [isWizardMode, isMiddleNode, activePanelNodeId]);
```

### 5.5 Step 1 — 처리 방식 선택

```typescript
const handleProcessingMethodSelect = (option: ProcessingMethodOption) => {
  setSelectedProcessingOption(option);

  // LOOP 등 node_type이 있으면 노드 생성
  if (option.node_type) {
    const frontendNodeType = MAPPING_NODE_TYPE_MAP[option.node_type];
    const meta = NODE_REGISTRY[frontendNodeType];
    const nodeId = placeNode(meta);
    if (!nodeId) return;

    updateNodeConfig(nodeId, {}); // 처리 방식 노드는 바로 설정 완료
  }

  // 새 output_data_type으로 actions 조회
  const nextDataType = MAPPING_RULES.data_types[option.output_data_type];
  setCurrentDataTypeKey(option.output_data_type);

  if (nextDataType.actions.length === 0) {
    // 액션 없음 → 위자드 완료
    finishMiddleWizard();
    return;
  }

  // 액션 있음 → Step 2
  setWizardStep("action");
};
```

### 5.6 Step 2 — 액션 선택

```typescript
const handleActionSelect = (action: MappingAction) => {
  setSelectedAction(action);

  // 노드 생성
  const frontendNodeType = MAPPING_NODE_TYPE_MAP[action.node_type];
  const meta = NODE_REGISTRY[frontendNodeType];
  const nodeId = placeNode(meta);
  if (!nodeId) return;

  // follow_up 또는 branch_config가 있으면 Step 3
  if (action.follow_up || action.branch_config) {
    setWizardStep("follow-up");
    return;
  }

  // 후속 설정 없음 → 바로 완료
  const outputDataType = toDataType(action.output_data_type);
  updateNodeConfig(nodeId, {
    choiceActionId: action.id,
    outputDataType,
  });
  finishMiddleWizard();
};
```

### 5.7 Step 3 — 후속 설정

```typescript
const handleFollowUpComplete = (selections: Record<string, string | string[]>) => {
  if (!activePanelNodeId || !selectedAction) return;

  const outputDataType = toDataType(selectedAction.output_data_type);
  updateNodeConfig(activePanelNodeId, {
    choiceActionId: selectedAction.id,
    outputDataType,
    followUpSelections: selections,
  });
  finishMiddleWizard();
};
```

### 5.8 위자드 완료 처리

```typescript
const finishMiddleWizard = () => {
  // 위자드 로컬 상태 초기화
  setWizardStep(null);
  setCurrentDataTypeKey(null);
  setSelectedProcessingOption(null);
  setSelectedAction(null);
  setFollowUpSelections({});

  // OutputPanel은 자동으로 상세 모드로 전환됨
  // (isConfigured가 true로 바뀌면서 위자드 모드 조건 해제)
};
```

> **듀얼 패널은 닫히지 않는다.** 위자드 완료 후 OutputPanel은 **나가는 데이터** 표시 모드로 전환되고, InputPanel은 **들어오는 데이터 + 처리 방식** 표시로 업데이트된다.

### 5.9 뒤로가기

```typescript
// Step 2 → Step 1 (처리 방식이 있었던 경우만)
const handleBackToProcessingMethod = () => {
  if (selectedAction) {
    // 액션 단계에서 배치한 노드 제거
    // (실제 배치된 노드가 있으면 제거 로직)
    setSelectedAction(null);
  }
  setSelectedProcessingOption(null);
  setWizardStep("processing-method");
};

// Step 3 → Step 2
const handleBackToAction = () => {
  setSelectedAction(null);
  setFollowUpSelections({});
  setWizardStep("action");
};
```

### 5.10 렌더링 분기 (OutputPanel 내부)

```typescript
// OutputPanel 내부 — 위자드 모드와 상세 모드 분기
if (isWizardMode && isMiddleNode && wizardStep) {
  const dataType = currentDataTypeKey
    ? MAPPING_RULES.data_types[currentDataTypeKey]
    : null;

  return (
    <Box /* OutputPanel 컨테이너 */>
      {/* 헤더: "설정" + X 버튼 */}
      <Flex justifyContent="space-between" alignItems="center" px="12px">
        <Text fontSize="20px" fontWeight="medium">설정</Text>
        <Icon as={MdCancel} onClick={handleClose} cursor="pointer" />
      </Flex>

      {/* Step 1: 처리 방식 */}
      {wizardStep === "processing-method" && dataType?.processing_method && (
        <ProcessingMethodStep
          processingMethod={dataType.processing_method}
          onSelect={handleProcessingMethodSelect}
        />
      )}

      {/* Step 2: 액션 선택 */}
      {wizardStep === "action" && dataType && (
        <ActionStep
          actions={dataType.actions}
          onSelect={handleActionSelect}
          onBack={selectedProcessingOption ? handleBackToProcessingMethod : undefined}
        />
      )}

      {/* Step 3: 후속 설정 */}
      {wizardStep === "follow-up" && selectedAction && (
        <FollowUpStep
          followUp={selectedAction.follow_up ?? null}
          branchConfig={selectedAction.branch_config ?? null}
          onComplete={handleFollowUpComplete}
          onBack={handleBackToAction}
        />
      )}
    </Box>
  );
}

// 상세 모드 (isConfigured === true)
return (
  <Box /* OutputPanel 컨테이너 */>
    {/* 헤더: 아이콘 + "나가는 데이터" + X 버튼 */}
    <Flex justifyContent="space-between" alignItems="center">
      <Flex gap="10px" alignItems="center">
        <Image src={nodeIcon} boxSize="38px" />
        <Text fontSize="20px" fontWeight="medium">나가는 데이터</Text>
      </Flex>
      <Icon as={MdCancel} onClick={handleClose} cursor="pointer" />
    </Flex>

    {/* 나가는 데이터 내용 */}
    <Box flex="1">
      <Text fontSize="16px" fontWeight="bold">{outputDataLabel}</Text>
      {/* 처리된 데이터 미리보기 영역 */}
    </Box>

    {/* 하단: 테스트 버튼 */}
    <Button
      bg="black"
      color="white"
      borderRadius="10px"
      px="24px"
      py="12px"
      fontSize="14px"
      fontWeight="semibold"
    >
      테스트 해보기
    </Button>
  </Box>
);
```

### 5.11 하위 컴포넌트 (OutputPanel 내부 서브 컴포넌트)

v3의 하위 컴포넌트 인터페이스를 그대로 유지하되, 위치가 OutputPanel 내부로 이동:

#### ProcessingMethodStep

```typescript
interface ProcessingMethodStepProps {
  processingMethod: ProcessingMethod;
  onSelect: (option: ProcessingMethodOption) => void;
}
// UI: 질문 텍스트 + 선택지 목록 (priority 순 정렬)
```

#### ActionStep

```typescript
interface ActionStepProps {
  actions: MappingAction[];
  onSelect: (action: MappingAction) => void;
  onBack?: () => void;
}
// UI: 선택지 목록 (priority 순 정렬)
// "그대로 전달" (PASSTHROUGH)은 항상 맨 아래 (priority: 99)
```

#### FollowUpStep

```typescript
interface FollowUpStepProps {
  followUp: FollowUp | null;
  branchConfig: BranchConfig | null;
  onComplete: (selections: Record<string, string | string[]>) => void;
  onBack: () => void;
}
// UI: follow_up 또는 branch_config 기반 선택/입력
```

### 5.12 중간 placeholder 클릭 시 진입 흐름

v3에서는 중간 placeholder 클릭 시 ChoicePanel이 열렸다. v4에서는:

```typescript
// Canvas.tsx — handlePlaceholderClick (중간 placeholder)
const handleMiddlePlaceholderClick = (placeholderId: string) => {
  const leafId = placeholderId.replace("placeholder-", "");

  // 1. 노드 배치 (isConfigured: false)
  const meta = getDefaultMiddleNodeMeta(); // 또는 적절한 기본 meta
  const nodeId = placeNode(meta);
  if (!nodeId) return;

  // 2. 듀얼 패널 열기
  openPanel(nodeId);

  // 3. OutputPanel은 isConfigured === false를 감지하여 위자드 모드 진입
};
```

> **activePlaceholder는 사용하지 않는다.** 중간 노드는 `activePanelNodeId`를 통해 듀얼 패널을 열고, OutputPanel의 위자드 모드를 활성화한다.

### 5.13 applicable_when 필터링

v3과 동일 — 현재 단계에서는 무시 (모든 선택지 표시). Phase 2에서 구현.

### 5.14 options_source 처리

v3과 동일 — 현재 단계에서는 description만 표시. Phase 2에서 구현.

---

## 6. OutputPanel 설계

### 6.1 책임 범위 (v4 확장)

OutputPanel은 **두 가지 모드**를 가진다:

| 모드 | 조건 | 내용 |
|------|------|------|
| **위자드 모드** | `isConfigured === false` AND 중간 노드 | 매핑 규칙 기반 단계별 선택 UI (5절 참조) |
| **상세 모드** | `isConfigured === true` | 나가는 데이터 표시 + 테스트 버튼 |
| **시작/도착 미설정** | `isConfigured === false` AND 시작/도착 노드 | PanelRenderer (기본 상태) |

> **v3 대비 변경:**
> - v3에서 OutputPanel은 PanelRenderer만 표시했다.
> - v4에서는 **중간 노드 위자드 UI**도 포함한다 (ChoicePanel의 역할 흡수).
> - 설정 완료 후에는 "나가는 데이터" 표시 + "테스트 해보기" 버튼을 제공한다.

### 6.2 모드 분기 로직

```typescript
const activeNode = nodes.find((n) => n.id === activePanelNodeId);
const isMiddleNode = activeNode?.id !== startNodeId && activeNode?.id !== endNodeId;
const isWizardMode = isMiddleNode && !activeNode?.data.config.isConfigured;
const isDetailMode = activeNode?.data.config.isConfigured;

if (isWizardMode) {
  // 위자드 모드 (5절 참조)
  return <WizardModeContent ... />;
}

if (isDetailMode) {
  // 상세 모드 — 나가는 데이터 표시
  return <DetailModeContent ... />;
}

// 시작/도착 미설정 — PanelRenderer
return <PanelRenderer />;
```

### 6.3 상세 모드 콘텐츠 (설정 완료 후)

```typescript
// 상세 모드 — 나가는 데이터
<Box>
  {/* 헤더: 노드 아이콘 + "나가는 데이터" + X 버튼 */}
  <Flex justifyContent="space-between">
    <Flex gap="10px" alignItems="center">
      <Image src={processingIcon} boxSize="36px" />
      <Text fontSize="20px" fontWeight="medium" letterSpacing="-0.4px">
        나가는 데이터
      </Text>
    </Flex>
    <Icon as={MdCancel} onClick={handleClose} cursor="pointer" boxSize="24px" />
  </Flex>

  {/* 처리 결과 데이터 영역 */}
  <Box flex="1">
    <Text fontSize="16px" fontWeight="bold">{outputDataLabel}</Text>
    {/* 데이터 미리보기 (Phase 2에서 구현) */}
  </Box>

  {/* 하단: 테스트 버튼 */}
  <Button
    bg="black" color="white"
    borderRadius="10px" px="24px" py="12px"
    fontSize="14px" fontWeight="semibold"
  >
    테스트 해보기
  </Button>
</Box>
```

### 6.4 닫기

```typescript
const handleClose = () => {
  closePanel();
};
```

### 6.5 표시 조건

```typescript
const isOpen = Boolean(activePanelNodeId) && activePlaceholder === null;
```

ServiceSelectionPanel이 열려 있으면(`activePlaceholder !== null`) OutputPanel은 숨긴다.

---

## 7. InputPanel 설계

### 7.1 표시 조건

```typescript
const isOpen = Boolean(activePanelNodeId) && activePlaceholder === null;
```

### 7.2 콘텐츠 분기

InputPanel은 **중간 노드 설정 완료 여부에 따라** 다른 콘텐츠를 표시한다:

**미설정 중간 노드 (위자드 진행 중):**
- 이전 노드에서 들어오는 데이터만 표시

**설정 완료 중간 노드:**
- 이전 노드에서 들어오는 데이터
- 데이터 처리 방식 (예: "내용 요약/정리")
- 선택된 처리 옵션 목록 (예: "키워드별 요약", "정해진 형식에 맞춰서")
- 직접 입력 필드

**시작 노드:**
- "시작점" 안내 메시지

```typescript
// 설정 완료된 중간 노드 InputPanel
<Box>
  {/* 헤더: 서비스 아이콘 + "들어오는 데이터" */}
  <Flex gap="10px" alignItems="center" px="12px">
    <Image src={sourceServiceIcon} boxSize="38px" />
    <Text fontSize="20px" fontWeight="medium" letterSpacing="-0.4px">
      들어오는 데이터
    </Text>
  </Flex>

  {/* 데이터 목록 (파일 그리드 등) */}
  <Box>
    <Text fontSize="16px" fontWeight="medium">{`내 드라이브 > 폴더 1`}</Text>
    <Grid templateColumns="repeat(6, 1fr)" gap="24px" p="24px">
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </Grid>
  </Box>

  {/* 데이터 처리 방식 (isConfigured일 때만) */}
  {isConfigured && (
    <Box>
      <Text fontSize="16px" fontWeight="bold">데이터 처리 방식</Text>
      <Text fontSize="16px" fontWeight="semibold">{processingMethodLabel}</Text>
      {selectedOptions.map((opt) => (
        <Flex key={opt.id} gap="10px" alignItems="center" px="24px" py="12px">
          <Image src={opt.icon} boxSize="36px" />
          <Text fontSize="14px" fontWeight="bold">{opt.label}</Text>
        </Flex>
      ))}
    </Box>
  )}

  {/* 직접 입력 (isConfigured일 때만) */}
  {isConfigured && (
    <Box>
      <Text fontSize="16px" fontWeight="bold">직접 입력</Text>
      <Flex
        bg="#f6f6f6" borderRadius="24px"
        px="24px" py="12px" opacity="0.8"
        justifyContent="space-between"
      >
        <Text fontSize="16px" fontWeight="bold">{promptText}</Text>
        <Icon as={MdSend} boxSize="24px" />
      </Flex>
    </Box>
  )}
</Box>
```

### 7.3 닫기 동작

InputPanel은 OutputPanel과 수명을 공유한다. OutputPanel이 닫히면 `activePanelNodeId`가 `null`이 되어 InputPanel도 자동으로 닫힌다.

---

## 8. 패널 닫기 규칙

### 8.1 공통 규칙

| 패널 | X 버튼 | 캔버스 빈 영역 클릭 | ESC 키 |
|------|--------|---------------------|--------|
| ServiceSelectionPanel | `handleOverlayClose()` | `setActivePlaceholder(null)` | `handleOverlayClose()` |
| OutputPanel (위자드/상세) | `closePanel()` | `closePanel()` | `closePanel()` |
| InputPanel | `closePanel()` | `closePanel()` (OutputPanel과 함께) | `closePanel()` |

### 8.2 Canvas.tsx onPaneClick

```typescript
const handlePaneClick = () => {
  // ServiceSelectionPanel 닫기
  if (activePlaceholder) {
    setActivePlaceholder(null);
  }

  // 듀얼 패널 닫기
  if (activePanelNodeId) {
    closePanel();
  }
};
```

### 8.3 ESC 키 전역 리스너

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;

    // ServiceSelectionPanel이 열려 있으면 먼저 닫기
    if (activePlaceholder) {
      setActivePlaceholder(null);
      return;
    }

    // 듀얼 패널이 열려 있으면 닫기
    if (activePanelNodeId) {
      closePanel();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activePlaceholder, activePanelNodeId]);
```

---

## 9. 노드 인터랙션 및 레이아웃 규칙

### 9.1 듀얼 패널 레이아웃 규격

듀얼 패널(InputPanel + OutputPanel)이 열릴 때, 캔버스 전체 레이아웃:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        전체 1676px, 화면 중앙                        │
│                                                                     │
│  ┌──────────┐                                      ┌──────────┐     │
│  │ 왼쪽 패널  │  [이전노드] → [현재노드] → [다음노드]  │ 오른쪽 패널 │     │
│  │ 690px    │          296px gap                   │ 690px    │     │
│  │ 800px    │       노드 체인 중앙 배치              │ 800px    │     │
│  │          │                                      │          │     │
│  └──────────┘                                      └──────────┘     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**구현 방식:**

```typescript
// 듀얼 패널 컨테이너
<Box
  position="absolute"
  left="50%"
  top="140px"
  transform="translateX(-50%)"
  width="1676px"
  height="800px"
>
  {/* 왼쪽 패널 */}
  <Box
    position="absolute"
    left="0"
    top="50%"
    transform="translateY(-50%)"
    width="690px"
    minWidth="690px"
    maxWidth="690px"
    height="800px"
    bg="white"
    border="1px solid #f2f2f2"
    borderRadius="20px"
    boxShadow="0 4px 4px rgba(0,0,0,0.25)"
    px="12px" py="24px"
    overflow="hidden"
  >
    <InputPanel />
  </Box>

  {/* 가운데 노드 체인 (296px gap 영역) */}
  <Box
    position="absolute"
    left="50%"
    top="50%"
    transform="translate(-50%, -50%)"
    /* 약간 오른쪽 오프셋: left="calc(50% + 38px)" */
  >
    <NodeChain />
  </Box>

  {/* 오른쪽 패널 */}
  <Box
    position="absolute"
    left="986px"
    top="50%"
    transform="translateY(-50%)"
    width="690px"
    minWidth="690px"
    maxWidth="690px"
    height="800px"
    bg="white"
    border="1px solid #f2f2f2"
    borderRadius="20px"
    boxShadow="0 4px 4px rgba(0,0,0,0.25)"
    px="12px" py="24px"
    overflow="hidden"
  >
    <OutputPanel />
  </Box>
</Box>
```

### 9.2 패널 사이 노드 체인 표시 규칙

패널이 열려 있을 때 **설정 중인 노드와 직접 연결된 노드만** 표시한다:

```
[이전 노드 아이콘] → [현재 노드 아이콘/placeholder] → [다음 노드 아이콘]
```

- **이전 노드:** 현재 노드의 소스 (incoming edge의 source)
- **현재 노드:** 설정 중인 노드 (activePanelNodeId)
- **다음 노드:** 현재 노드의 타겟 (outgoing edge의 target) — 없으면 placeholder

**다른 모든 노드는 숨긴다.** 사용자가 지금 어떤 노드를 설정하는지 명확히 알 수 있어야 한다.

```typescript
// Canvas.tsx — 패널 열림 시 노드 필터링
const visibleNodes = useMemo(() => {
  if (!activePanelNodeId) return allNodes;

  // 관련 노드만 추출
  const relatedIds = new Set<string>();
  relatedIds.add(activePanelNodeId);

  // 이전 노드
  const incomingEdge = edges.find((e) => e.target === activePanelNodeId);
  if (incomingEdge) relatedIds.add(incomingEdge.source);

  // 다음 노드
  const outgoingEdge = edges.find((e) => e.source === activePanelNodeId);
  if (outgoingEdge) relatedIds.add(outgoingEdge.target);

  return allNodes.map((node) => ({
    ...node,
    hidden: !relatedIds.has(node.id),
  }));
}, [activePanelNodeId, allNodes, edges]);
```

### 9.3 삭제 버튼 — Hover 표시

```typescript
// BaseNode.tsx
const [isHovered, setIsHovered] = useState(false);

<Box
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {isHovered && (
    <Box position="absolute" top={-2} right={-2} onClick={handleDelete}>
      <Icon as={MdCancel} boxSize={5} />
    </Box>
  )}
</Box>
```

### 9.4 노드 선택 시 화면 중앙 고정

```typescript
const handleNodeClick = (_: React.MouseEvent, node: Node) => {
  openPanel(node.id);

  const { x, y } = node.position;
  reactFlowInstance.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, {
    duration: 300,
    zoom: reactFlowInstance.getZoom(),
  });
};
```

### 9.5 선택 노드 드래그 비활성화

```typescript
const nodesWithDragControl = nodes.map((node) => ({
  ...node,
  draggable: node.id !== activePanelNodeId,
}));
```

### 9.6 Handle(연결점) 숨김

```typescript
<Handle
  type="source"
  position={Position.Right}
  style={{ opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
/>
<Handle
  type="target"
  position={Position.Left}
  style={{ opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
/>
```

### 9.7 설정 중 서비스 아이콘 제거

BaseNode에서 설정이 완료되지 않은 노드(`isConfigured === false`)에는 **서비스 아이콘을 표시하지 않는다:**

```typescript
// BaseNode.tsx
const showServiceIcon = node.data.config.isConfigured;

{showServiceIcon && node.data.config.service && (
  <Image src={getServiceIcon(node.data.config.service)} />
)}
```

### 9.8 CreationMethodNode 표시 조건

"생성 방식을 결정하세요" (CreationMethodNode)는 **도착 노드의 설정이 완전히 완료된 후에만** 표시한다:

```typescript
// Canvas.tsx — nodesWithPlaceholders
const showCreationMethod = useMemo(() => {
  if (!endNodeId) return false;

  const endNode = nodes.find((n) => n.id === endNodeId);
  return endNode?.data.config.isConfigured === true;
}, [endNodeId, nodes]);

// CreationMethodNode는 showCreationMethod가 true일 때만 추가
if (showCreationMethod) {
  placeholderNodes.push(creationMethodNode);
}
```

---

## 10. Edge 렌더링

### 10.1 연결선 표시

노드 간 연결을 시각적으로 표시하는 Edge를 렌더링한다.

### 10.2 Edge 스타일

```typescript
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  animated: false,
  style: {
    stroke: "#94a3b8",  // gray.400
    strokeWidth: 2,
  },
};
```

### 10.3 자동 연결

노드 배치 시 `placeNode()` 내부에서 `onConnect()`를 호출하여 Edge를 자동 생성한다.

### 10.4 노드 체인 화살표 (패널 사이)

듀얼 패널 사이의 노드 체인에는 **화살표 아이콘**으로 방향을 표시한다:

```
[이전 노드] ─→─ [현재 노드] ─→─ [다음 노드]
```

화살표는 36px gap, smoothstep edge 또는 SVG 화살표 아이콘으로 구현.

---

## 11. 상태 전이 다이어그램

### 11.1 시작/도착 노드 위자드 (ServiceSelectionPanel 로컬 상태)

```
┌──────────────────────────────────────────────────────────────────┐
│ 초기 상태                                                        │
│ activePlaceholder: null                                          │
│ activePanelNodeId: null                                          │
│ SSP: 닫힘                                                        │
└──────────────────────────────────────────────────────────────────┘
        │
        │ Placeholder 클릭
        │ → setActivePlaceholder({ id, position })
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 카테고리 선택 (SSP — step: "category")                            │
│ 레이아웃: [placeholder 노드] ─48px─ [카테고리 그리드 카드]          │
│ activePlaceholder: { id, position }                              │
│ activePanelNodeId: null                                          │
└──────────────────────────────────────────────────────────────────┘
        │
        │ 카테고리 선택 (서비스 있음)
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 서비스 선택 (SSP — step: "service")                               │
│ 레이아웃: [placeholder 노드] ─48px─ [서비스 목록 카드]             │
└──────────────────────────────────────────────────────────────────┘
        │
        │ 서비스 선택 → placeNode(meta, service)
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 요구사항 선택 (SSP — step: "requirement")                         │
│ 레이아웃: [서비스 아이콘+이름] ─48px─ [요구사항 목록 카드]          │
│ 캔버스: 노드 배치됨 (isConfigured: false, 서비스 아이콘 미표시)     │
└──────────────────────────────────────────────────────────────────┘
        │
        ├── 인증 필요 → Step 4
        │   레이아웃: [서비스 아이콘+이름] ─48px─ [인증 카드]
        │       │
        │       │ 인증 완료 → updateNodeConfig → resetWizard
        │       ▼
        │   완료 (activePlaceholder: null, isConfigured: true)
        │
        └── 인증 불필요 → updateNodeConfig → resetWizard
            ▼
          완료 (activePlaceholder: null, isConfigured: true)
```

### 11.2 중간 노드 설정 (OutputPanel 내장 위자드)

```
┌──────────────────────────────────────────────────────────────────┐
│ 중간 placeholder 클릭                                             │
│ → 노드 배치 (isConfigured: false)                                 │
│ → openPanel(nodeId)                                              │
│ → 듀얼 패널 열림 (InputPanel + OutputPanel)                        │
│ → OutputPanel이 isConfigured === false 감지 → 위자드 모드           │
│ → 이전 노드의 outputTypes[0] → MappingKey 변환                    │
└──────────────────────────────────────────────────────────────────┘
        │
        ├── requires_processing_method === true
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 처리 방식 선택 (OutputPanel 위자드 — wizardStep: "processing-method")│
│ 왼쪽 패널: 이전 노드 데이터                                        │
│ 오른쪽 패널: 처리 방식 선택 UI                                      │
│ 중앙: 노드 체인                                                   │
└──────────────────────────────────────────────────────────────────┘
        │
        │ 처리 방식 선택 → 새 dataType의 actions 조회
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 액션 선택 (OutputPanel 위자드 — wizardStep: "action")              │
│ 오른쪽 패널: 액션 선택 UI                                          │
└──────────────────────────────────────────────────────────────────┘
        │
        │ 액션 선택 → follow_up 또는 branch_config 있으면 Step 3
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 후속 설정 (OutputPanel 위자드 — wizardStep: "follow-up")           │
│ 오른쪽 패널: 후속 설정 UI                                          │
└──────────────────────────────────────────────────────────────────┘
        │
        │ 후속 설정 완료 → updateNodeConfig → finishMiddleWizard
        ▼
┌──────────────────────────────────────────────────────────────────┐
│ 완료 → OutputPanel 자동 전환                                       │
│ activePanelNodeId: nodeId (유지 — 패널 닫히지 않음)                 │
│ isConfigured: true                                                │
│ 왼쪽 패널: 들어오는 데이터 + 처리 방식 + 직접 입력                   │
│ 오른쪽 패널: 나가는 데이터 + 테스트 버튼                             │
└──────────────────────────────────────────────────────────────────┘
```

### 11.3 Store 상태 스냅샷

**시작/도착 노드 (SSP):**

| 단계 | `activePlaceholder` | `activePanelNodeId` | SSP 열림 | 듀얼 패널 |
|------|-------|-------|--------|--------|
| 초기 | `null` | `null` | X | X |
| 카테고리~인증 | `{ id, pos }` | `null` | O | X |
| 완료 | `null` | `null` | X | X |

**중간 노드 (OutputPanel 위자드):**

| 단계 | `activePlaceholder` | `activePanelNodeId` | SSP 열림 | 듀얼 패널 |
|------|-------|-------|--------|--------|
| placeholder 클릭 | `null` | `nodeId` | X | O (위자드 모드) |
| 처리 방식~후속 설정 | `null` | `nodeId` | X | O (위자드 모드) |
| 완료 | `null` | `nodeId` | X | O (상세 모드) |

> **핵심 차이:** v3에서 중간 노드 설정 시 `activePlaceholder`를 사용했지만, v4에서는 `activePanelNodeId`만 사용한다. OutputPanel의 `isConfigured` 상태로 위자드/상세 모드를 결정한다.

---

## 12. 비정상 종료 및 상태 정리

### 12.1 ServiceSelectionPanel 위자드 중

| 트리거 | 처리 | 배치된 노드 |
|--------|------|-------------|
| X 버튼 | `resetWizard()` | 유지 (isConfigured: false) |
| 캔버스 빈 영역 클릭 | `setActivePlaceholder(null)` → SSP unmount | 유지 |
| ESC 키 | `resetWizard()` | 유지 |

### 12.2 OutputPanel 위자드 중 (중간 노드)

| 트리거 | 처리 | 배치된 노드 |
|--------|------|-------------|
| X 버튼 | `closePanel()` → 위자드 로컬 상태 소멸 | 유지 (isConfigured: false) |
| 캔버스 빈 영역 클릭 | `closePanel()` | 유지 |
| ESC 키 | `closePanel()` | 유지 |

> **재진입:** 미완료 노드를 다시 클릭하면 OutputPanel이 다시 위자드 모드로 열린다 (`isConfigured === false` 감지).

### 12.3 듀얼 패널 상세 모드 중

| 트리거 | 처리 |
|--------|------|
| X 버튼 | `closePanel()` → 양쪽 패널 닫힘 |
| 캔버스 빈 영역 클릭 | `closePanel()` |
| ESC 키 | `closePanel()` |
| 다른 노드 클릭 | `openPanel(새 nodeId)` → 패널 전환 |

### 12.4 노드 삭제 시

```typescript
removeNode: (id) =>
  set((state) => {
    // 삭제된 노드가 패널 대상이면 패널 닫기
    if (state.activePanelNodeId && removeTargets.has(state.activePanelNodeId)) {
      state.activePanelNodeId = null;
    }
  }),
```

### 12.5 에디터 이탈

`resetEditor`로 전체 store 상태가 초기화된다. SSP 및 OutputPanel 위자드 로컬 상태는 컴포넌트 unmount 시 자동 소멸.

---

## 13. 파일별 변경 요약

### 13.1 `src/features/add-node/ui/ServiceSelectionPanel.tsx`

| 변경 | 내용 |
|------|------|
| **추가** | 피그마 레이아웃 규격 적용 — `[노드 100px] ─48px─ [카드 shadow+rounded-20px]` |
| **추가** | 단계별 가이드라인 제목 + 왼쪽 노드 아이콘 상태별 표시 |
| **변경** | 시작/도착 노드에서 동일한 레이아웃 보장 |
| 유지 | 4단계 위자드 흐름 (category → service → requirement → auth) |
| 유지 | 로컬 상태, X 버튼, ESC 키, 뒤로가기 |

### 13.2 `src/features/choice-panel/` (변경)

| 파일 | 변경 |
|------|------|
| `model/types.ts` | **유지** — 타입 정의 변경 없음 |
| `model/mappingRules.ts` | **유지** — 매핑 규칙 데이터 변경 없음 |
| `model/dataTypeKeyMap.ts` | **유지** — 변환 유틸 변경 없음 |
| `ui/ChoicePanel.tsx` | **제거** — OutputPanel 내장으로 대체 |
| `ui/ProcessingMethodStep.tsx` | **이동** → OutputPanel 내부 서브 컴포넌트 |
| `ui/ActionStep.tsx` | **이동** → OutputPanel 내부 서브 컴포넌트 |
| `ui/FollowUpStep.tsx` | **이동** → OutputPanel 내부 서브 컴포넌트 |
| `index.ts` | **변경** — UI 컴포넌트 export 제거, model만 export |

### 13.3 `src/widgets/output-panel/ui/OutputPanel.tsx`

| 변경 | 내용 |
|------|------|
| **추가** | 위자드 모드 (isConfigured === false + 중간 노드) — 매핑 규칙 기반 단계별 선택 UI |
| **추가** | 상세 모드 (isConfigured === true) — "나가는 데이터" 표시 + "테스트 해보기" 버튼 |
| **추가** | 위자드 로컬 상태 (wizardStep, currentDataTypeKey, selectedAction 등) |
| **추가** | ProcessingMethodStep, ActionStep, FollowUpStep 서브 컴포넌트 (또는 import) |
| **변경** | 레이아웃 → 690px × 800px 고정, 피그마 규격 적용 |
| **변경** | 헤더 → 위자드 모드: "설정", 상세 모드: 아이콘 + "나가는 데이터" |

### 13.4 `src/widgets/input-panel/ui/InputPanel.tsx`

| 변경 | 내용 |
|------|------|
| **추가** | 설정 완료 시 "데이터 처리 방식" + 선택 옵션 목록 + 직접 입력 필드 |
| **변경** | 레이아웃 → 690px × 800px 고정, 피그마 규격 적용 |
| 유지 | 시작 노드 "시작점" 안내 |

### 13.5 `src/widgets/canvas/ui/Canvas.tsx`

| 변경 | 내용 |
|------|------|
| **추가** | 듀얼 패널 레이아웃 컨테이너 (1676px 중앙, 690px 패널 × 2) |
| **추가** | 패널 열림 시 관련 노드만 표시 (나머지 hidden) |
| **추가** | 노드 체인 표시 (이전→현재→다음, 화살표) |
| **변경** | 중간 placeholder 클릭 → `activePlaceholder` 대신 `openPanel()` 사용 |
| **변경** | CreationMethodNode 표시 조건 → 도착 노드 `isConfigured: true` 이후에만 |
| **변경** | 설정 중 서비스 아이콘 미표시 |
| 유지 | `onPaneClick`, ESC 키 리스너, 노드 중앙 고정, 드래그 비활성화 |

### 13.6 `src/entities/node/ui/BaseNode.tsx`

| 변경 | 내용 |
|------|------|
| **변경** | 서비스 아이콘 → `isConfigured === true`일 때만 표시 |
| 유지 | 삭제 버튼 hover 표시, Handle 숨김 |

### 13.7 `src/shared/model/workflowStore.ts`

| 변경 | 내용 |
|------|------|
| 유지 | wizard 상태 제거 (v2에서 완료) |
| 유지 | `updateNodeConfig` merge 방식 |
| 유지 | `removeNode` 패널 정리 |

### 13.8 `src/pages/workflow-editor/WorkflowEditorPage.tsx`

| 변경 | 내용 |
|------|------|
| **제거** | `ChoicePanel` 컴포넌트 렌더링 (OutputPanel 내장으로 대체) |
| 유지 | `ServiceSelectionPanel` 렌더링 |

### 13.9 변경하지 않는 파일

| 파일 | 이유 |
|------|------|
| `serviceMap.ts` | 데이터 변경 없음 |
| `serviceRequirements.ts` | 데이터 변경 없음 |
| `PanelRenderer.tsx` | 기존 동작 유지 (시작/도착 미설정 노드용) |
| `choice-panel/model/*` | 타입, 데이터, 유틸 변경 없음 |
