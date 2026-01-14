# Code Standards

## TypeScript

**Forbidden:**

- `any` → use `unknown` with type guards
- `@ts-ignore` → fix the error
- `as Type` → use type guards instead
- `!` non-null → handle null explicitly

**Required:**

- Explicit return types for exported functions
- Props interface for all components
- Discriminated unions for state machines

```typescript
// Props interface
export interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

// Discriminated union for async state
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

---

## React & Next.js

**Component Structure:**

```typescript
"use client" // only if needed (hooks, events, browser APIs)

// Imports auto-sorted by ESLint - just run `pnpm lint:fix`

interface Props { user: User }

export function UserCard({ user }: Props) {
  // 1. Hooks
  const [open, setOpen] = useState(false)

  // 2. Derived state
  const fullName = `${user.first} ${user.last}`

  // 3. Handlers
  const handleClick = () => setOpen(true)

  // 4. Early returns
  if (!user) return null

  // 5. Render
  return (...)
}
```

**Forbidden:**

- Default exports (except page/layout/error.tsx)
- Index as key: `items.map((x, i) => <X key={i} />)`
- `useEffect` for initial data fetching (use Server Components)

---

## Tailwind CSS v4

**Required:**

- `cn()` for conditional/merged classes
- Semantic tokens only (`text-foreground`, `bg-primary`)
- Mobile-first responsive (`base` → `md:` → `lg:`)

**Forbidden:**

- Inline styles: `style={{ }}`
- Raw colors: `text-gray-900`, `bg-blue-500`

---

## File Organization

**Naming:**

- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `use-*.ts`
- Constants: `SCREAMING_SNAKE`

**Colocation:**

- Route-specific components → in route folder
- Extract to `components/` when used in 3+ places

---

## shadcn/ui

**Rules:**

- Don't modify existing `components/ui/*` files
- Extend via wrapper components in `components/`
- Use `asChild` + `Slot` for composition
- Always use `cn()` when accepting className prop
- For typography classes, search `typography-demo` in shadcn registry

```bash
pnpm dlx shadcn@latest add button    # Add single component
pnpm dlx shadcn@latest add -a        # Add all components
```

**Custom UI Components:**

- `ui/empty.tsx` - Empty state component for placeholder pages

---

## Convex

**Function Types:**

```typescript
// Public query - client-callable, read-only
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

// Public mutation - client-callable, read-write
export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", { name: args.name });
  },
});

// Internal mutation - only callable from other Convex functions
export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    /* ... */
  },
});

// HTTP action - webhook handlers
http.route({
  path: "/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    /* ... */
  }),
});
```

**Required:**

- Always validate args with `v.*` validators
- Use indexes for queries (`withIndex`)
- Check auth with `ctx.auth.getUserIdentity()` in protected functions
- Use `internal.*` for functions only called by other Convex functions

**Forbidden:**

- Direct `ctx.db.query("table").collect()` without filters (fetch all rows)
- Storing sensitive data without encryption
- Using `v.any()` except for trusted sources (webhooks)

**Schema Pattern:**

```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
  }).index("by_clerk_id", ["clerkId"]),
});
```

---

## Clerk

**Middleware Pattern:**

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/studio(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

**Component Usage:**

```typescript
// Conditional rendering based on auth state
<SignedIn>
  <CustomUserNav />
</SignedIn>
<SignedOut>
  <SignInButton mode="modal">
    <Button>Sign In</Button>
  </SignInButton>
</SignedOut>

// Custom user navigation using Clerk hooks (see nav-user.tsx)
const { user } = useUser();
const { openUserProfile, signOut } = useClerk();
```

**Required:**

- Wrap app with `ClerkProvider` → `ConvexProviderWithClerk` (order matters)
- Use `createRouteMatcher` for route protection patterns
- Use Clerk hooks (`useUser`, `useClerk`) or components for auth UI
- Use `SignedIn`/`SignedOut` for conditional rendering

**Forbidden:**

- Storing auth tokens manually (Clerk handles this)
- Bypassing Clerk for authentication logic
