---
name: tailwind-v4
description: Tailwind CSS v4 conventions for this project. Use when writing styles, configuring tokens, or setting up dark mode — covers CSS-first config, @theme tokens, dark mode with CSS variables, and custom utilities. No tailwind.config.js.
compatibility: Designed for Claude Code with Tailwind CSS v4
allowed-tools: Read Bash(pnpm rules:check)
---

# Tailwind v4 Conventions

## Setup
Tailwind v4 uses a CSS-first configuration. There is no `tailwind.config.js`.

Import Tailwind in the global CSS file:
```css
@import "tailwindcss";
```

## Defining Custom Tokens
Use the `@theme` block in the global CSS file to define custom design tokens. These become Tailwind utility classes automatically.

```css
@theme {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;

  --font-sans: 'Geist', sans-serif;

  --radius-card: 0.75rem;

  --spacing-section: 4rem;
}
```

After defining `--color-primary`, you can use `bg-primary`, `text-primary`, `border-primary`, etc. as Tailwind utilities.

## Dark Mode and CSS Variables
Define CSS variable overrides directly in `:root` and media queries. Do not use Tailwind's `dark:` variant for base token values.

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

## Custom Utilities
Use `@layer utilities` for custom utility classes that cannot be expressed with `@theme` tokens.

```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

## Rules
- Do not create a `tailwind.config.js` or `tailwind.config.ts`. All configuration goes in the global CSS file.
- Do not use `@tailwind base`, `@tailwind components`, or `@tailwind utilities` directives — these are v3 syntax.
- Define all design tokens in `@theme`. Do not use arbitrary values like `bg-[#6366f1]` for values that will be reused.
- `@theme inline` is used when a token should resolve to an existing CSS variable at runtime rather than being inlined as a static value.
