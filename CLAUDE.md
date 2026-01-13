# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Seed** - Turn prompts into shippable p5.js sketches with deterministic outputs, parameter controls, and exports.

## Commands

```bash
pnpm dev          # Start Next.js dev server
pnpm convex dev   # Start Convex dev server (run in separate terminal)
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm lint:fix     # ESLint with auto-fix (also sorts imports)
pnpm format       # Format with Prettier
```

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS v4, shadcn/ui (New York style), Radix UI
- **Convex** - Backend database, serverless functions, real-time sync
- **Clerk** - Authentication (OAuth, session management)
- Path alias: `@/*` → project root

## Architecture

```
app/           → Routes and layouts (App Router)
components/    → React components (ui/ for shadcn primitives)
convex/        → Convex backend (schema, functions, http routes)
lib/           → Utilities (cn, constants, validations)
hooks/         → Custom React hooks
types/         → Shared TypeScript types
services/      → API calls and data fetching
actions/       → Server Actions
```

## Auth Architecture (Clerk + Convex)

```
Browser → ClerkProvider → ConvexProviderWithClerk → App
                              ↓ (JWT token)
           Convex Backend (validates via auth.config.ts)
                              ↑ (webhooks)
           Clerk Backend (user.created/updated/deleted)
```

**Key files:**

- `convex/auth.config.ts` - JWT validation config
- `convex/schema.ts` - Users table (indexed by clerkId)
- `convex/users.ts` - User queries/mutations
- `convex/http.ts` - Clerk webhook handler
- `middleware.ts` - Route protection
- `components/seed-provider.tsx` - Provider hierarchy

**Environment variables required:**

- `NEXT_PUBLIC_CONVEX_URL` - Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_JWT_ISSUER_DOMAIN` - Clerk JWT issuer for Convex
- `CLERK_WEBHOOK_SECRET` - Webhook signature verification

See `.claude/rules/code-standards.md` for coding standards.
