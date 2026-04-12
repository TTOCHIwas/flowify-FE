# 워크플로우 목록 페이지 구조 리팩토링 문서

> **작성일**: 2026-04-12
> **이슈**: #74
> **브랜치**: `refector#74-workflow-list-page-structure`
> **대상 화면**: `/workflows`
> **선행 문서**: [WORKFLOW_LIST_PAGE_DESIGN.md](./WORKFLOW_LIST_PAGE_DESIGN.md)
> **목적**: 워크플로우 목록 페이지에 혼재된 화면 조합, 상태 관리, 파생 로직, 세부 UI를 프로젝트 폴더 구조와 컨벤션에 맞게 분리한다.

---

## 목차

1. [개요](#1-개요)
2. [리팩토링 목표](#2-리팩토링-목표)
3. [구조 설계](#3-구조-설계)
4. [파일별 역할](#4-파일별-역할)
5. [제외 범위](#5-제외-범위)
6. [검증 기준](#6-검증-기준)
7. [후속 작업](#7-후속-작업)

---

## 1. 개요

기존 `WorkflowsPage.tsx`는 단일 파일 안에 아래 책임이 함께 들어 있었다.

- 목록 조회 및 무한 스크롤 상태 관리
- 필터 상태 및 액션 핸들러
- 날짜/경고/서비스 아이콘 매칭 등 파생 로직
- 서비스 배지, 필터 탭, 목록 row UI
- 페이지 레벨 레이아웃 조합

이 구조는 기능 추가는 빠르지만 파일 크기가 커지고, 변경 영향 범위를 파악하기 어렵고, 테스트 및 재사용 단위가 애매해지는 문제가 있다.

이번 리팩토링에서는 동작은 유지하면서 `page / model / ui` 기준으로 책임을 분리한다.

---

## 2. 리팩토링 목표

- 페이지 파일은 화면 조합과 라우팅 연결만 담당한다.
- 목록 상태, 필터, 무한 스크롤, 액션 핸들러는 `model` 훅으로 분리한다.
- 날짜/노드/경고 관련 순수 계산 로직은 `model` 유틸로 분리한다.
- 서비스 배지, 필터 탭, 목록 row는 `ui` 컴포넌트로 분리한다.
- 기존 동작(`active`, `warnings`, 무한 스크롤, 생성 버튼, 상세 진입)은 유지한다.
- `docs/CONVENTION.md` 기준의 import, props 타입, Chakra UI 사용 규칙을 유지한다.

---

## 3. 구조 설계

### 3.1 목표 디렉토리 구조

```text
src/pages/workflows/
├─ WorkflowsPage.tsx
├─ index.ts
├─ model/
│  ├─ constants.ts
│  ├─ index.ts
│  ├─ types.ts
│  ├─ useWorkflowsPage.ts
│  └─ workflow-list.ts
└─ ui/
   ├─ index.ts
   ├─ ServiceBadge.tsx
   ├─ WorkflowFilterTabs.tsx
   └─ WorkflowRow.tsx
```

### 3.2 레이어 책임

- `WorkflowsPage.tsx`
  - 페이지 헤더와 목록 섹션 조합
  - page model 훅 결과를 UI 컴포넌트에 전달
- `model/useWorkflowsPage.ts`
  - 목록 조회
  - 무한 스크롤
  - 필터 상태
  - 생성/상세 이동/활성 토글 핸들러
- `model/workflow-list.ts`
  - 정렬
  - 상대 시간 라벨
  - 구축 진행 상태 계산
  - 경고 메시지 추출
  - 시작/종료 노드 추출
  - 서비스 아이콘 키 매핑
- `ui/*`
  - 서비스 배지 렌더링
  - 필터 탭 렌더링
  - 목록 row 렌더링

---

## 4. 파일별 역할

| 파일 | 역할 |
|------|------|
| `src/pages/workflows/WorkflowsPage.tsx` | 페이지 조합 전용 진입점 |
| `src/pages/workflows/model/constants.ts` | 필터 목록, 페이지 크기 등 상수 |
| `src/pages/workflows/model/types.ts` | 페이지 내부 타입 정의 |
| `src/pages/workflows/model/useWorkflowsPage.ts` | page model 훅 |
| `src/pages/workflows/model/workflow-list.ts` | 목록 관련 순수 로직 |
| `src/pages/workflows/ui/ServiceBadge.tsx` | 서비스 아이콘/배지 UI |
| `src/pages/workflows/ui/WorkflowFilterTabs.tsx` | 상태 필터 탭 UI |
| `src/pages/workflows/ui/WorkflowRow.tsx` | 워크플로우 행 UI |

---

## 5. 제외 범위

이번 리팩토링에서는 아래 항목은 포함하지 않는다.

- 목록 우측 실행 버튼의 실제 실행 API 연동
- 서비스 SVG 아이콘의 별도 폴더 분리
- 백엔드 목록 조회 방식을 페이지네이션에서 커서 기반 무한 스크롤로 변경
- 목록 row UI 디자인 변경
- `warnings` 모델 자체 변경

즉 이번 작업은 **구조 리팩토링**에 집중하고, 동작 변경은 최소화한다.

---

## 6. 반영 내용

### 6.1 구조 분리 완료

실제 코드 기준으로 아래 구조 분리가 반영되었다.

- `WorkflowsPage.tsx`
  - 페이지 헤더, 상태 분기, 목록 섹션 조합만 담당
- `model/useWorkflowsPage.ts`
  - 목록 조회, 무한 스크롤, 필터 상태, 생성/상세 이동/활성 토글 핸들러 담당
- `model/workflow-list.ts`
  - 정렬, 상대 시간 라벨, 경고 메시지 추출, 시작/종료 노드 판별, 서비스 배지 키 매핑 담당
- `ui/ServiceBadge.tsx`
  - 서비스 아이콘 및 배지 렌더링 담당
- `ui/WorkflowFilterTabs.tsx`
  - 필터 탭 렌더링 담당
- `ui/WorkflowRow.tsx`
  - 워크플로우 row 렌더링 담당

이를 통해 기존 1개 파일에 몰려 있던 화면 조합, 상태, 파생 로직, 세부 UI 책임을 분리했다.

### 6.2 필터 탭 UI 보정

리팩토링 후 목록 상단 카테고리 탭(`전체 / 실행 / 중지됨`)에서 선택된 항목이 사각 버튼처럼 보이는 문제가 있어 아래와 같이 정리했다.

- 필터 탭은 Chakra `Button`을 유지
- 버튼 기본 외형의 네모 테두리와 그림자 제거
- 선택 상태는 배경이나 박스가 아니라 텍스트 + 하단 밑줄만 남도록 조정
- hover, focusVisible, active 상태에서도 네모 외형이 보이지 않도록 정리

즉 현재 필터 탭은 “버튼 기능을 가진 탭 UI” 형태로 동작한다.

---

## 7. 검증 기준

- `pnpm run lint` 통과
- `pnpm run build` 통과
- `/workflows` 화면에서 아래 동작 유지 확인
  - 목록 조회
  - 최근 업데이트순 정렬
  - `전체 / 실행 / 중지됨` 필터
  - 무한 스크롤
  - 워크플로우 생성
  - 목록 row hover 경고 메시지
  - 상세 화면 이동

---

## 8. 후속 작업

- 목록 row 액션 버튼의 의미(`active` 토글 vs 실제 실행 API)를 백엔드 스펙과 다시 정리
- 서비스 SVG 아이콘을 공용 아이콘 폴더로 정리
- 필요 시 `ui` 컴포넌트 단위 테스트 또는 스냅샷 테스트 도입
- 백엔드 목록 조회가 무한 스크롤 친화적으로 바뀌면 프론트 page model도 함께 정리

---

## 결론

이번 리팩토링의 목적은 워크플로우 목록 페이지를 더 작은 책임 단위로 분리해 유지보수성과 가독성을 높이는 것이다.

핵심 기준은 아래 세 가지다.

- 페이지는 조합만 담당한다.
- 상태와 로직은 `model`로 분리한다.
- 반복 가능하고 표현 중심인 요소는 `ui`로 분리한다.

이 문서는 `#74 워크플로우 목록 페이지 구조 리팩토링`의 기준 문서로 사용한다.
