---
name: shared
description: Shared layer conventions for this project. Use when creating or modifying files in shared/ — covers types/, api/, config/, lib/, and ui/ with rules for what belongs in shared versus other layers.
compatibility: Designed for Claude Code with Next.js + TypeScript
allowed-tools: Read Bash(pnpm typecheck) Bash(pnpm rules:check)
---

# Shared Layer Conventions

## `types/` — Shared Types

- Define shared TypeScript types used across multiple layers here.
- Do not define entity-specific types here — those belong in `entities/{entity}/types.ts`.
- Each type should have a single, clear purpose.

Common types:
- `Id` — app-wide identifier type
- `Nullable<T>` — `T | null`
- `PageUrlProps` — Next.js page props shape (`params` and `searchParams` as Promises). Import this in every `page.tsx`.
- `RouteHandlerProps` — Next.js Route Handler params shape (`params` as Promise). Import this in every `route.ts`.
- `ErrorResponse` — shape of error payloads returned by the API. Import this in `mutations.ts` files.
- `Pagination<T>` — wrapper for paginated list responses.

```ts
export type Id = string;

export type Nullable<T> = T | null;

export type PageUrlProps<
  TParams extends Record<string, string> = Record<string, string>,
  TSearch extends Record<string, string> = Record<string, string>
> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearch>;
};

export type RouteHandlerProps<
  TParams extends Record<string, string> = Record<string, string>
> = {
  params: Promise<TParams>;
};

export type ErrorResponse = {
  message: string;
  code?: string;
};

export type Pagination<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
```

## `api/` — Base HTTP Client

- Define the base HTTP client instance here. All `{Entity}Api` objects import from this file.
- Do not add endpoint-specific logic here. Base configuration only: base URL, default headers, auth header injection, error normalization.
- Export a single `apiClient` object with typed methods. Do not export the raw fetch or axios instance.
- Normalize error responses into `ErrorResponse` so callers always receive the same error shape.

```ts
import type { ErrorResponse } from '@/shared/types';

// private helpers (getBaseUrl, getServerCookieHeader, request, etc.) inside IIFE
export const apiClient = (() => {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!res.ok) {
      const error: ErrorResponse = await res.json();
      throw error;
    }
    return res.json() as Promise<T>;
  }

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
      request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  };
})();
```

## `config/` — Environment Variables

- Centralize all environment variable access here. Do not read `process.env` directly outside of this file.
- Use `!` non-null assertion only when the variable is guaranteed to exist in all environments.
- `NEXT_PUBLIC_` prefix is required for variables accessed on the client side.
- Export a single `config` object. Do not export individual variables.

```ts
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
} as const;
```

## `lib/` — Pure Utility Functions

- Pure utility functions and thin wrappers around external libraries go here.
- No business logic, no API calls, no store access, no side effects.
- If a utility function is only used inside one feature, put it in `features/{feature}/utils/` instead.
- Each file should group related utilities (e.g. `date.ts`, `string.ts`, `cn.ts`).
- Fully type all inputs and outputs. Do not use `any`.

```ts
export const formatDate = (date: Date, locale = 'ko-KR'): string =>
  new Intl.DateTimeFormat(locale).format(date);
```

## `ui/` — Design System Components

- Design System Components only. No business logic, no entity knowledge, no feature-specific behavior.
- Always extend `ComponentProps<"htmlelement">` and spread `...props` to the root element.
- Use named exports, not `export default`.

```tsx
interface Props extends ComponentProps<"button"> {
  variant?: "primary" | "secondary"
}

export const Button = ({ variant = "primary", ...props }: Props) => {
  return <button {...props} />
}
```
