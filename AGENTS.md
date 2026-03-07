# AGENTS.md - Development Guide for Agentic Coding

This guide provides essential information for agentic coding agents operating on this Svelte 5 blog engine codebase.

## Project Overview

- **Framework**: Svelte 5 with SvelteKit 2
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + DaisyUI
- **Database**: PocketBase
- **Package Manager**: pnpm
- **Default Dev URL**: http://localhost:5173 (with hot reloading enabled)

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

### Testing & Code Quality

- **No unit test framework configured** - testing must be manual or via integration tests
- **Type Checking**: `pnpm run check` (required before commits)
- **Linting**: `pnpm run lint` (runs ESLint + Prettier checks)
- **Formatting**: `pnpm run format` (auto-fixes formatting issues)

## Code Style Guidelines

### Formatting & Imports

- **Tabs**: Use tabs (2-space visual width)
- **Line Length**: Max 100 characters
- **Quotes**: Single quotes (`'....'`)
- **Trailing Commas**: None (removed on format)
- **Auto-format**: Run `pnpm run format` before committing
- **Import Order**: Group by: external packages → relative imports (use `$lib/`)
- **Svelte Aliases**: Use `$lib/` for `/src/lib/` imports

### TypeScript & Types

- **Strict Mode**: TypeScript strict checking enabled
- **Types**: Always provide explicit types for function parameters and returns
- **Avoid `any`**: Use proper types or `unknown` with type guards
- **File Extensions**: Use `.ts` for modules, `.svelte` for components
- **Path Aliases**: `$lib` = `/src/lib/`

### Naming Conventions

- **Components**: PascalCase (e.g., `MyComponent.svelte`)
- **Files**: lowercase with hyphens (e.g., `my-utility.ts`)
- **Variables/Functions**: camelCase (e.g., `getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Private Methods**: Prefix with `_` (e.g., `_internal()`)

### Svelte 5 Specific

- **Use Runes**: Always use Svelte 5 runes (`$state`, `$derived`, `$effect`, etc.)
- **Reactive Variables**: Use `let count = $state(0)` instead of old reactive declarations
- **Props**: Use `$props()` rune for type-safe prop definitions
- **Effects**: Use `$effect()` for side effects (replaces `onMount`, lifecycle)
- **Derived State**: Use `$derived()` for computed values
- **Event Handlers**: Use `onclick`, `onchange` etc. (no need for forwarding with runes)

### Error Handling

- **Try-Catch**: Wrap async operations and PocketBase calls
- **Error Messages**: Provide context and user-friendly descriptions
- **Logging**: Use `console.error()` for errors during development; avoid in production
- **API Errors**: Check PocketBase response status; validate data before use
- **User Feedback**: Use toast notifications via `svelte-french-toast` for errors/success

### ESLint & Prettier Configuration

- **ESLint Config**: `extends: 'custom/svelte'` (custom preset)
- **Prettier Overrides**: `.svelte` files use `svelte` parser
- **Plugins**: ESLint Svelte plugin + TypeScript parser, Prettier Svelte plugin

## Development Workflow

### When Making Changes

1. **Don't restart dev server**: Hot reloading is enabled; changes appear instantly
2. **Ask user to refresh** if hot reloading doesn't reflect changes
3. **Run type checks**: `pnpm run check` after structural changes
4. **Format before committing**: `pnpm run format`

### Before Committing

```bash
pnpm run format       # Auto-fix formatting
pnpm run lint         # Check for linting issues
pnpm run check        # Verify TypeScript types
pnpm run build        # Ensure production build works
```

## Key Technologies & File Locations

| Purpose    | Location                             | Details                                |
| ---------- | ------------------------------------ | -------------------------------------- |
| Components | `src/lib/components/`                | Svelte 5 components with runes         |
| Utilities  | `src/lib/utils/`                     | Helper functions (API, stores, config) |
| Routes     | `src/routes/`                        | SvelteKit page structure               |
| Styles     | `src/app.postcss`                    | Global Tailwind CSS setup              |
| Config     | `svelte.config.js`, `vite.config.ts` | Framework & build config               |
| Database   | PocketBase (external)                | Running on separate port               |

## Important Constraints & Tips

- **Svelte 5 Only**: Use Svelte 5 syntax exclusively; no Svelte 4 patterns
- **Hot Module Reloading**: Enabled by default; don't restart dev server unnecessarily
- **Use MCP Tools**: Svelte MCP tools available for docs, validation, and testing
- **Svelte Autofixer**: Use before suggesting code changes to validate syntax
- **PocketBase Integration**: Check `src/lib/utils/api.ts` for existing API patterns
- **DaisyUI Components**: Available via Tailwind classes; check DaisyUI docs for options
- **Relative Imports**: Prefer `$lib/` over `../../../` for readability

## Copilot/Cursor Instructions

This codebase follows Svelte 5 best practices:

- Always use the latest Svelte 5 runes and syntax
- Verify code with svelte-autofixer before suggesting changes
- Consult `.github/copilot-instructions.md` for additional guidelines
- Leverage Svelte MCP tools for documentation accuracy
