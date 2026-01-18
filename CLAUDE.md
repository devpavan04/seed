# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seed is a generative art studio that turns natural language into p5.js sketches with parameter controls, version history, and multi-format exports.

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **Styling**: Tailwind CSS 4 with shadcn/ui components (Radix-based)
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

## Architecture

```
/app                    # Next.js App Router
  /studio               # Protected routes (requires auth)
    /new-sketch         # Create new sketch
    /all-sketches       # Sketches gallery
/components
  /ui                   # shadcn components (Radix + Tailwind)
  seed-provider.tsx     # Root providers (Theme, Clerk, Convex)
/convex                 # Backend
  schema.ts             # Database schema
  users.ts              # User mutations/queries
  http.ts               # Webhook handlers
/lib
  utils.ts              # cn() utility for Tailwind class merging
```

## Convex Backend

- Schema defined in `convex/schema.ts`
- Clerk webhooks sync users via `convex/http.ts`
- Generated types in `convex/_generated/` (do not edit)

## Styling Conventions

- Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- shadcn components use CVA (class-variance-authority) for variants
- Theme variables defined in `app/globals.css` (OKLCh color space)
- Fonts: Mona Sans (UI), JetBrains Mono (code)

## Authentication

- Middleware in `middleware.ts` protects routes
- Public routes: `/`, `/studio` (login page)
- Protected routes: `/studio/*` (redirects to sign-in if unauthenticated)
- Use Clerk's `<SignedIn>` and `<SignedOut>` components for conditional rendering
