# AGENTS.md - Development Guide for Agentic Coding

This guide provides essential information for agentic coding agents operating on this Svelte 5 blog engine codebase.

## Project Overview

- **Framework**: Svelte 5 with SvelteKit 2
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + DaisyUI
- **Database**: PocketBase
- **Package Manager**: pnpm
- **Default Dev URL**: http://localhost:5173 (with hot reloading)
- **Multi-Language**: Paraglide-js (13 languages, auto-detection, 60+ country mappings)

## Build & Development Commands

### Core Commands

```bash
pnpm run dev          # Start development server with hot reloading
pnpm run build        # Build for production
pnpm run preview      # Preview production build locally
pnpm run check        # Run Svelte type checking and validation
pnpm run check:watch  # Run type checking in watch mode
pnpm run format       # Format code with Prettier
pnpm run lint         # Check code with ESLint + Prettier
pnpm run deploy-test  # Full deployment simulation (format → lint → build → preview)
```

### Code Quality

- **No unit tests** - testing is manual or integration-based
- **Type Checking**: `pnpm run check` (required before commits)
- **Linting**: `pnpm run lint` (ESLint + Prettier checks)
- **Formatting**: `pnpm run format` (auto-fixes formatting)

## Code Style Guidelines

### Formatting & Imports

- **Tabs**: Use tabs (2-space visual width)
- **Line Length**: Max 100 characters
- **Quotes**: Single quotes (`'....'`)
- **Trailing Commas**: None
- **Import Order**: External packages → relative imports using `$lib/`
- **Path Aliases**: Use `$lib/` instead of `../../../`

### TypeScript & Types

- **Strict Mode**: Enabled - always provide explicit types
- **No `any`**: Use proper types or `unknown` with type guards
- **File Extensions**: `.ts` for modules, `.svelte` for components
- **Path Aliases**: `$lib` = `/src/lib/`

### Naming Conventions

- **Components**: PascalCase (`MyComponent.svelte`)
- **Files**: lowercase with hyphens (`my-utility.ts`)
- **Variables/Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Private Methods**: Prefix with `_` (`_internal()`)

### Svelte 5 & Runes (CRITICAL)

- **ALWAYS use Svelte 5 runes**: `$state`, `$derived`, `$effect`, `$props()`
- **NO old reactive syntax** - never use old Svelte 4 patterns
- **Props**: Use `$props()` rune for type-safe prop definitions
- **State**: Use `let count = $state(0)` for reactive variables
- **Effects**: Use `$effect()` for side effects (replaces `onMount`)
- **Derived**: Use `$derived()` for computed values
- **Never use `onMount`, `onDestroy`** - use `$effect` instead

### User-Facing Text (CRITICAL - TRANSLATIONS)

- **NO hardcoded user-facing text** in components or code
- **ALL text must be**: Added to `/messages/en.json` first, then translated
- **Usage pattern**: `import { m } from '$lib/paraglide/messages.js'` then `m['section.key']()`
- **After updating translations**: Run `npx paraglide-js compile` then `pnpm run build`
- **Supported Languages**: English, Spanish, French, German, Portuguese, Mandarin (zh/zh_CN), Malay, Tamil, Norwegian (nb/nn), Dutch, Vietnamese
- **Example**: For error message, add to `en.json`: `"errors.notFound": "Not found"`, then use `m['errors.notFound']()`

### Error Handling

- **Try-Catch**: Wrap async operations and PocketBase calls
- **Error Messages**: Use translations (`m['errors.key']()`) for user feedback
- **Logging**: Use `console.error()` during development only
- **User Feedback**: Use `svelte-french-toast` for toast notifications
- **Validation**: Check PocketBase response status before using data

## Development Workflow

### When Making Changes

1. **Don't restart dev server** - hot reloading is enabled
2. **Ask user to refresh** only if hot reload doesn't work
3. **Run `pnpm run check`** after structural changes
4. **Run `pnpm run format`** before committing

### Before Committing

```bash
pnpm run format       # Auto-fix formatting
pnpm run lint         # Check for linting issues
pnpm run check        # Verify TypeScript types
pnpm run build        # Ensure production build works
```

## Key File Locations

| Purpose      | Location              | Details                         |
| ------------ | --------------------- | ------------------------------- |
| Components   | `src/lib/components/` | Svelte 5 components with runes  |
| Utilities    | `src/lib/utils/`      | Helper functions & API patterns |
| Routes       | `src/routes/`         | SvelteKit page structure        |
| Translations | `/messages/`          | JSON files for all 13 languages |
| Styles       | `src/app.postcss`     | Global Tailwind CSS             |
| Config       | `svelte.config.js`    | Framework configuration         |
| Database     | PocketBase (external) | Separate service process        |

## Critical Constraints

- **Svelte 5 Only**: Never use Svelte 4 patterns
- **Hot Reloading**: Don't restart dev server unnecessarily
- **Translations**: NO hardcoded user text - use Paraglide-js messages
- **Svelte Autofixer**: Use before suggesting code changes
- **PocketBase**: Check `src/lib/utils/api.ts` for API patterns
- **DaisyUI**: Use Tailwind classes for component styling
- **MCP Tools**: Use Svelte MCP for docs, validation, and testing
