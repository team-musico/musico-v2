# Working Flow

모든 작업은 아래 4단계를 순서대로 따른다. 단계를 건너뛰지 않는다.

## 1. Explore (탐색)
- 관련 파일과 코드를 먼저 읽는다. 추측하지 않는다.
- 영향 범위(어떤 레이어, 어떤 파일)를 파악한다.
- 기존 패턴 및 컨벤션을 확인한다.

## 2. Plan (계획)
- 구현 접근법을 한 문장으로 정리한다.
- FSD 레이어별 생성/수정할 파일 목록을 나열한다.
- 불확실한 부분이 있으면 구현 전에 사용자에게 확인한다.

## 3. Execute (실행)
- Plan에서 정의한 순서대로 구현한다.
- 한 번에 한 파일씩. 완료된 파일은 즉시 표시한다.
- 컨벤션(FSD, naming, Tailwind v4, React Compiler)을 엄수한다.

## 4. Review (검토)
- `pnpm rules:check`를 실행해 FSD 규칙, React Compiler, Tailwind v4 위반을 확인한다.
- `pnpm typecheck`를 실행해 타입 오류, import 경로 오류를 확인한다.
- 누락된 `'use client'` 등을 점검한다.
- 문제가 있으면 즉시 수정한다. 사용자에게 넘기지 않는다.

# Architecture

@.codex/skills/fsd/SKILL.md

# UI & Styling

@.codex/skills/ui/SKILL.md
@.codex/skills/tailwind-v4/SKILL.md
@.codex/skills/react-compiler/SKILL.md

# Layer Conventions

## shared
@.codex/skills/shared/SKILL.md

## entities
@.codex/skills/entity/SKILL.md

## features
@.codex/skills/feature/SKILL.md

## widgets
@.codex/skills/widget/SKILL.md
