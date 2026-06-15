---
name: entity
description: Entity layer conventions for this project. Use when creating or modifying files in entities/ — covers types.ts, apis.ts, queries.ts, mutations.ts, and ui/ with specific naming rules, patterns, and templates for each file type.
compatibility: Designed for Claude Code with Next.js + TanStack Query + TypeScript
allowed-tools: Read Bash(pnpm typecheck) Bash(pnpm rules:check)
---

# Entity Layer Conventions

## `types.ts` — Entity Types

- Source of truth; define only one entity interface.
- Response entities must be derived from the entity interface using `Omit`, `Pick`, etc.

```ts
interface Entity {
  field1: type;
  field2: type;
  field3: type;
}
```

## `apis.ts` — API Interface

- Declare as a `const` object named `{Entity}Api` (PascalCase). Do not use a class.
- Every method must be `async`.
- Use `apiClient` imported from `@/shared/api` for all HTTP calls. Do not use `fetch` directly.
- Pass the response type as a generic on the HTTP method: `apiClient.get<ResponseType>(...)`.
- Type the payload inline as an object literal. Do not define a separate request type unless it is reused elsewhere.
- Method names: `getList`, `getBy{Field}`, `create`, `update`, `delete`. Use `patch` only for partial updates.
- No business logic here. Validation, transformation, and error handling belong in `features`.

```ts
const EntityApi = {
  async getList() {
    return await apiClient.get<ResponseType>("/some-endpoint");
  },

  async create(payload: { field1: type, field2: type }) {
    return await apiClient.post("/some-endpoint", payload);
  }
}
```

## `queries.ts` — Query Hooks

- Always use `useSuspenseQuery`. Do not use `useQuery`.
- Name as `useGet{Entity}{Scope}Query` — `Scope` is `List`, `Detail`, or a specific field name (e.g. `BySlug`).
- `queryFn` must point to a method on `{Entity}Api`. Do not write fetch logic inline.
- `queryKey` must be derived from endpoint segments in the same order as the URL path.
- `skillKeys` 같은 공유 query key 객체도 이 파일에 함께 선언한다.
- `queries.ts`와 `mutations.ts`는 entity 전용 파일로, 여러 hook을 하나의 파일에 선언하는 것이 허용된다.

```ts
export const entityKeys = {
  all: ["entity"] as const,
  list: () => [...entityKeys.all, "list"] as const,
  detail: (id: string) => [...entityKeys.all, "detail", id] as const,
};

export const useGetEntityListQuery = () => useSuspenseQuery({
  queryKey: entityKeys.list(),
  queryFn: EntityApi.getList,
});

export const useGetEntityDetailQuery = (field: type) => useSuspenseQuery({
  queryKey: entityKeys.detail(field),
  queryFn: () => EntityApi.getDetail(field),
});
```

## `mutations.ts` — Mutation Hooks

- Use `useMutation` from `@tanstack/react-query`.
- Name as `use{Action}{Entity}Mutation` — `Action` matches the `{Entity}Api` method: `Create`, `Update`, `Delete`, `Patch`.
- `mutationFn` must point to a method on `{Entity}Api`. Do not write fetch logic inline.
- Always handle both `onSuccess` and `onError`.
- In `onSuccess`: invalidate or update related queries via `queryClient`, then show a success toast.
- In `onError`: show an error toast using the message from `err`. Type the error as `ErrorResponse` (from `shared/types`).
- Call `useQueryClient` outside `useMutation` and close over it inside callbacks.
- `queries.ts`와 `mutations.ts`는 entity 전용 파일로, 여러 hook을 하나의 파일에 선언하는 것이 허용된다.

```ts
export const useCreateEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EntityApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entityKeys.list() });
      toast.success("Created successfully");
    },
    onError: (err: ErrorResponse) => {
      toast.error(err.message);
    }
  });
}

export const useDeleteEntityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => EntityApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: entityKeys.list() }),
    onError: (err: ErrorResponse) => toast.error(err.message),
  });
}
```

## `ui/` — Data-Display Components

- Must be Server Components (no `'use client'`).
- DO NOT include business logic or user event handlers.
- Data-display only — if the component handles user events, it belongs in `features/{feature}/ui/`.
- Follow base UI conventions (one component per file, `export default`, `async` function for data fetching).
