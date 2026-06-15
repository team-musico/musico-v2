---
name: ui
description: UI component conventions for this project. Use when writing any React component — covers Client Components, Server Components, Server Pages, Design System Components, and Skeleton UI patterns with one-component-per-file rule.
compatibility: Designed for Claude Code with Next.js + TypeScript + Tailwind
allowed-tools: Read
---

# UI Component Conventions

- One file can have only one component except skeleton UI.

## Client Component

- Add `'use client'` at the top.
- Define a `Props` interface above the component. Do not inline prop types in the function signature.
- Compose state and logic from hooks. Do not write business logic or API calls inline.
- Use `export default` at the bottom.

```tsx
"use client";

interface Props {
  prop1: type,
  prop2: type
}

const ReactClientComponent = ({ prop1, prop2 }: Props) => {
  const { field1, field2 } = useSomeHook();

  return (
    // jsx
  )
}

export default ReactClientComponent;
```

## Server Component

- Declare as an `async` function. Do not add `'use client'`.
- Fetch data by calling entity API functions. Use `Promise.all` for parallel fetches.
- Do not use React state hooks (`useState`, `useEffect`). Server Components cannot use them.
- Use `export default` at the bottom.

```tsx
const ReactServerComponent = async () => {
  const [data1, data2] = await Promise.all([/* API Functions in Entity */]);

  return (
    // jsx
  )
}

export default ReactServerComponent
```

## Server Page

- Follow Next.js page props — `params` and `searchParams` are Promises and must be `await`ed.
- Define `PageUrlProps` in `shared/types`. Do not inline the type in the page file.
- Use `export default function` (named function declaration), not an arrow function.

```tsx
export default function ServerPage({ params, searchParams }: PageUrlProps) {
  const [data1, data2] = await Promise.all([/* API Functions in Entity */]);

  return (
    // jsx
  )
}
```

## Design System Component

- Extend `ComponentProps<"htmlelement">` for the root HTML element.
- Spread `...props` onto the root element so all native HTML attributes pass through.
- Keep atomic — no business logic, no data fetching, no entity knowledge.
- Use named export, not `export default`.

```tsx
interface Props extends ComponentProps<"htmlelement"> {
  prop1: type,
  prop2: type
}

export const AtomicComponent = ({ prop1, prop2, ...props }: Props) => {
  return (
    // jsx
  )
}
```

## Skeleton UI

```tsx
const ReactServerComponent = async () => {
  const [data1, data2] = await Promise.all([/* API Functions in Entity */]);

  return (
    // jsx
  )
}

ReactServerComponent.Skeleton = () => (
  // jsx
)

export default ReactServerComponent
```
