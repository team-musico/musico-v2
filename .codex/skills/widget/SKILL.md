---
name: widget
description: Widget layer conventions for this project. Use when creating or modifying files in widgets/ — covers compositional UI blocks that combine entities and features, import rules, and Server/Client Component choice.
compatibility: Designed for Claude Code with Next.js + TypeScript
allowed-tools: Read Bash(pnpm rules:check)
---

# Widget Layer Conventions

## Rules

- A widget composes components from `entities/` and `features/`. Do not write data-fetching or business logic directly inside the widget.
- Do not import from other widgets.
- Use `export default`.
- Use the Server Component template when the widget has no interactivity; use the Client Component template when it does.
- If a widget needs state or server communication, use hooks and stores from `features/`. Do not create new business logic inside a widget.

## Import Constraints
- Allowed: `shared/`, `entities/`, `features/`
- Forbidden: `app/`, other widgets

## Server Widget Template

```tsx
const SomeWidget = async () => {
  return (
    // Compose entity display components and feature action components
  )
}

export default SomeWidget
```

## Client Widget Template

```tsx
'use client'

interface Props {
  prop1: type
}

const SomeWidget = ({ prop1 }: Props) => {
  return (
    // Compose entity display components and feature action components
  )
}

export default SomeWidget
```
