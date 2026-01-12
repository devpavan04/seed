# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Seed** - Turn prompts into shippable p5.js sketches with deterministic outputs, parameter controls, and exports.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm lint:fix     # ESLint with auto-fix (also sorts imports)
pnpm format       # Format with Prettier
```

## Tech Stack

- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind CSS v4, shadcn/ui (New York style), Radix UI
- Path alias: `@/*` → project root

## Architecture

```
app/           → Routes and layouts (App Router)
components/    → React components (ui/ for shadcn primitives)
lib/           → Utilities (cn, constants, validations)
hooks/         → Custom React hooks
types/         → Shared TypeScript types
services/      → API calls and data fetching
actions/       → Server Actions
```

See `.claude/rules/code-standards.md` for coding standards.
