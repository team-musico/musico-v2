---
name: react-compiler
description: React Compiler conventions for this project. Use when writing React components or hooks — prohibits useMemo, useCallback, React.memo, and requires strict Rules of React compliance since reactCompiler is enabled in next.config.ts.
compatibility: Designed for Claude Code with React Compiler enabled in Next.js
allowed-tools: Read Bash(pnpm rules:check) Bash(pnpm typecheck)
---

# React Compiler Conventions

The project has `reactCompiler: true` in `next.config.ts`. The React Compiler automatically memoizes components and values — manual optimization is not needed and may conflict.

## Rules

**Do not use manual memoization.**
The compiler handles this. Using these APIs alongside the compiler produces redundant or conflicting memoization.
- Do not use `useMemo`
- Do not use `useCallback`
- Do not wrap components in `React.memo`

**Follow the Rules of React strictly.**
The compiler assumes your code is compliant. Violations cause the compiler to bail out and skip optimization for that component.
- Do not mutate props, state, or values returned from hooks
- Do not read or write refs during render
- Do not call hooks conditionally or inside loops

**Do not use `useEffect` for derived state.**
Compute derived values directly during render. The compiler will memoize the result.

```ts
// wrong
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// correct
const fullName = `${firstName} ${lastName}`;
```

**Do not mutate objects or arrays in place.**
Always return new references.

```ts
// wrong
items.push(newItem);
setState(items);

// correct
setState([...items, newItem]);
```
