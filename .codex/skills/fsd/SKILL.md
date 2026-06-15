---
name: fsd
description: Feature-Sliced Design (FSD) architecture for this project. Use when creating or modifying any source file — specifies which layer (app/entities/features/shared/widgets) a file belongs to, naming rules, and what each directory contains. Includes global file modularization rules.
compatibility: Designed for Claude Code with Next.js + TypeScript
allowed-tools: Read Bash(find *) Bash(ls*)
---

# FSD Directory Structure

## File and Directory Naming
1. component — PascalCase
2. hook — camelCase with `use` prefix
3. store — kebab-case, object name only (e.g. `loading.ts` for a loading store)
4. others — kebab-case

## Layer Overview
1. `app` — routes (Next.js file conventions)
2. `entities` — business entities
3. `features` — user actions
4. `shared` — reusable code with no business logic
5. `widgets` — independent UI blocks that compose entities and features

## `app`
Follow Next.js docs for route files.

## `entities`
Each entity has: `types.ts`, `apis.ts`, `mutations.ts` (optional), `queries.ts` (optional), `ui/` (optional)
1. `types.ts` — entity interfaces and DTOs (required)
2. `apis.ts` — HTTP/DB query interfaces (required)
3. `mutations.ts` — TanStack Query mutation hooks (optional)
4. `queries.ts` — TanStack Query query hooks (optional)
5. `ui/` — data-display components; no user events (optional)

See [entity conventions](../entity/SKILL.md) for code conventions.

## `features`
Each feature can have: `actions/`, `hooks/`, `stores/`, `constants/`, `ui/`, `utils/`
All directories are optional.
1. `actions/` — Next.js Server Action functions
2. `hooks/` — business logic for React components
3. `stores/` — Zustand stores
4. `constants/` — constant variables
5. `ui/` — React components
6. `utils/` — pure functions

See [feature conventions](../feature/SKILL.md) for code conventions.

## `shared`
Reusable code with no business logic or FSD-layer dependencies.
1. `ui/` — generic UI components (Button, Input, Modal, etc.)
2. `api/` — base HTTP client
3. `config/` — app-wide constants and environment accessors
4. `lib/` — pure utility functions and library wrappers
5. `types/` — shared TypeScript types

See [shared conventions](../shared/SKILL.md) for code conventions.

## `widgets`
Independent UI blocks that compose entities and features.
- Each widget is a directory with a `ui/` subdirectory
- Compositional only — no data transformation or side-effect logic
- May import from `shared`, `entities`, `features`
- Must NOT import from `app` or another widget

See [widget conventions](../widget/SKILL.md) for code conventions.

## Global Rules
모든 파일은 약 150줄 수준으로 가독성 좋게 모듈화한다.
줄 수를 맞추기 위해 코드를 압축하지 말고, 책임 단위로 파일을 나눈다.
