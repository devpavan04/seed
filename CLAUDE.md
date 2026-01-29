# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seed turns natural language into p5.js sketches you can shape with live controls and export 🌱

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components (Radix-based)
- **State Management**: Zustand (lightweight stores)
- **Backend**: Convex (serverless database and API)
- **Auth**: Clerk (JWT-based authentication)
- **Package Manager**: pnpm

## Development Commands

```bash
pnpm dev:frontend     # Start Next.js dev server (port 3000)
pnpm dev:backend      # Start Convex local backend
pnpm build            # Production build
pnpm lint:fix         # Fix linting issues
pnpm format:fix       # Fix formatting issues
```

Run both `dev:frontend` and `dev:backend` together for local development.

## Code Quality

Pre-commit hooks (Husky) run `lint:check` and `format:check`. Run `pnpm lint:fix && pnpm format:fix` before committing.

**Import order** (enforced by eslint-plugin-simple-import-sort):

1. React and Next.js
2. External packages
3. Internal aliases (`@/`)
4. Relative imports
5. Type imports

## Code Organization

This project follows a **colocation-first** approach: code lives closest to where it's used.

### Principles

1. **Single-file pages**: All components specific to a route should live in that route's file (page.tsx or layout.tsx), not abstracted into separate component files
2. **Shared-only in /components/**: The `/components/` folder is reserved for components used in 2+ places. Single-use components belong in the file where they're used
3. **Extract on actual reuse**: Only move code to `/components/` when you have a second consumer. Don't pre-emptively abstract
4. **Organize within files**: Use section comments to organize all files with multiple components/functions:
   ```tsx
   // =============================================================================
   // Section Name
   // =============================================================================
   ```

### File Naming

- All files use **kebab-case**: `magnet-lines.tsx`, `canvas-store.ts`
- Stores: `{feature}-store.ts`
- Hooks: `use-{name}.ts`

### Naming Conventions

**Default exports use generic names** — the file path provides semantic meaning:

- Components: `export default function Component()`
- Pages: `export default function Page()`
- Layouts: `export default function Layout()`
- Hooks: `export default function useHookName()` (keeps name for React rules of hooks)
- Props: `Props` (type or interface)

**Named exports use descriptive names** — they need to self-identify:

- Components: `AppSidebarHeader`, `CustomComponent`
- Props: `AppSidebarHeaderProps`, `CustomComponentProps`

**Other conventions:**

- Constants: `SCREAMING_SNAKE_CASE` (e.g., `MOBILE_BREAKPOINT`, `SIDEBAR_COOKIE_NAME`)
- Types: PascalCase (e.g., `SidebarState`)

### Exceptions

- **`/components/provider.tsx`**: Must stay separate due to Next.js constraints. Root layout needs `metadata` export (Server Component), but providers need `"use client"` (Client Component). Next.js doesn't allow both in the same file.
- **`/components/ui/`**: shadcn-installed primitives. Never modify directly.

## Architecture

```
/app                      # Next.js App Router (colocate page-specific components in page.tsx/layout.tsx)
  layout.tsx              # Root layout (metadata + providers)
  /studio                 # Protected routes (auth required)
    layout.tsx            # Studio shell (sidebar, nav - all inline)
    /{feature}/page.tsx   # Feature pages (components inline)
/components
  /ui                     # shadcn primitives - DO NOT MODIFY
  provider.tsx            # Root providers (exception - see Code Organization)
  {name}.tsx              # Only shared components (used 2+ places)
/convex                   # Backend (colocate by domain)
  schema.ts               # Database schema (source of truth)
  {domain}.ts             # Domain mutations/queries (e.g., users.ts, sketches.ts)
  http.ts                 # HTTP routes and webhooks
/stores                   # Zustand stores
  {feature}-store.ts      # One store per feature
/hooks                    # Custom React hooks
  use-{name}.ts           # One hook per file
/lib
  utils.ts                # Shared utilities
```

**Note:** Don't update this section for every new file. It documents _patterns_, not inventory.

## Convex Backend

- Schema defined in `convex/schema.ts`
- Clerk webhooks sync users via `convex/http.ts`
- Generated types in `convex/_generated/` (do not edit)
- Colocate related mutations/queries in single files (e.g., all user operations in `users.ts`)

## Styling Conventions

- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- shadcn components use CVA (class-variance-authority) for variants
- Theme variables defined in `app/globals.css` (OKLCh color space)
- Fonts: Inter (UI), JetBrains Mono (code)
- **NEVER modify files in `/components/ui/`** - these are shadcn-installed primitives. To customize, create wrapper components or override styles via Tailwind classes.

## Authentication

- Middleware in `proxy.ts` protects routes
- Public routes: `/`, `/studio` (login page)
- Protected routes: `/studio/*` (redirects to sign-in if unauthenticated)
- Use Clerk's `<SignedIn>` and `<SignedOut>` components for conditional rendering

## State Management

- Uses Zustand for client-side state management
- Stores live in `/stores` (currently empty - add stores as needed)
- Each store is a separate file named `{feature}-store.ts`
- Stores use default exports: `export default create<State>(...)`
- Server state (database) is managed by Convex, not Zustand
