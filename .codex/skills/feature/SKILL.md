---
name: feature
description: Feature layer conventions for this project. Use when creating or modifying files in features/ — covers actions/, hooks/, stores/, constants/, ui/, utils/, and types/ with naming rules, patterns, and templates for each directory type.
compatibility: Designed for Claude Code with Next.js + Zustand + TanStack Query + TypeScript
allowed-tools: Read Bash(pnpm rules:check) Bash(pnpm typecheck)
---

# Feature Layer Conventions

## `actions/` — Server Actions

- Always add `'use server'` at the top of the file.
- Name as `{verb}{Entity}` in camelCase — verb matches the operation: `create`, `update`, `delete`, `patch`.
- Call `{Entity}Api` methods for data operations. Do not write fetch logic inline.
- After mutation, call `revalidateTag` or `updateTag` to invalidate related cache.
- Do not return UI state. Return only data or void.
- Errors thrown inside propagate to the nearest `error.tsx`. Throw explicitly when the operation fails.

```ts
'use server'

export async function createEntity(payload: { field1: type; field2: type }) {
  await EntityApi.create(payload);
  revalidateTag('entity', 'max');
}
```

## `hooks/` — Business Logic Hooks

- Name as `use{Entity}{Action}` in camelCase.
- Do NOT add `'use client'` — hooks are plain functions and do not need it.
- Connects UI events to mutations, server actions, or store operations. Must not contain fetch logic or direct API calls.
- Compose mutation hooks from `entities/{entity}/mutations.ts`. Do not call `{Entity}Api` directly.
- Complex store operations (derived state, multi-field updates, side effects) belong in hooks, not in the store.
- Expose only what the component needs — handlers and derived state (e.g. `isPending`, `isError`).
- Do not put JSX or component logic inside a hook.

```ts
const useEntityAction = (field1?: type) => {
  const mutation = useCreateEntityMutation();

  const handleAction = (payload: { field: type }) => {
    mutation.mutate(payload);
  };

  return { handleAction, isPending: mutation.isPending };
};
```

## `stores/` — Zustand Stores

- Name as `use{Entity}Store` in camelCase.
- Declare a single `interface State` that contains all state fields and functions — do not split into State + Actions.
- Use `create` from `zustand`. Do not use `zustand/middleware` unless persistence is explicitly required.
- Store only UI state shared across components (selected item, modal open state, filter values). Server data belongs in React Query.
- Store can only declare 3 kinds of members: **state** fields, **setter** functions, and **reset**.
  - Setter: a simple `set({ field: value })` call. No derived logic, no API calls, no `nanoid`.
  - Complex operations (e.g. addNode, deleteNode, updateNodeData) belong in hooks, not here.
- Always include a `reset` function that restores initial state.
- Do not call `{Entity}Api` or any async function inside a store action.

```ts
interface State {
  field: type;
  setField: (value: type) => void;
  reset: () => void;
}

const useEntityStore = create<State>((set) => ({
  field: initialValue,
  setField: (value) => set({ field: value }),
  reset: () => set({ field: initialValue }),
}));
```

## `types/` — Feature-Scoped Types

- Place TypeScript types that are specific to this feature and used across multiple files within it.
- Do not put entity types here — those belong in `entities/{entity}/types.ts`.
- Do not put shared types here — those belong in `shared/types/`.
- Export from `types/index.ts`.

```ts
export interface PendingDrop {
  type: NodeKind;
  position: { x: number; y: number };
}
```

## `constants/` — Constant Variables

- Name constant objects in SCREAMING_SNAKE_CASE.
- Always add `as const` to enable literal type inference.
- One constant per concept. Do not group unrelated constants in a single file.
- Do not put constants reused across features here — those belong in `shared/config`.

```ts
export const CONSTANT_VARIABLE = "contents" as const;
```

## `ui/` — Feature UI Components

- Add `'use client'` at the top. Feature UI handles user events and must be Client Components.
- Name as `{Entity}{Action}` — e.g. `PostCreateForm`, `UserDeleteButton`, `CommentEditModal`.
- Compose business logic from hooks in `hooks/`. Do not write mutation or state logic inline.
- Data-display only components belong in `entities/{entity}/ui/`, not here.
- Props should be minimal. Avoid passing raw query data as props — let the hook own the data.

```tsx
'use client'

interface Props {
  onSuccess?: () => void
}

const EntityActionForm = ({ onSuccess }: Props) => {
  const { handleAction, isPending } = useEntityAction();

  return (
    <form action={handleAction}>
      {/* form fields */}
    </form>
  );
};

export default EntityActionForm;
```

## `utils/` — Pure Functions

- Name as a verb phrase in camelCase — e.g. `formatDate`, `parseEntity`, `calcDiscount`.
- Must be a pure function: same input always produces same output, no side effects, no API calls, no store access.
- Fully type both input and output. Do not use `any`.
- If a utility is used across more than one feature, move it to `shared/lib`.

```ts
const formatEntityField = (value: InputType): OutputType => {
  return result;
};
```
