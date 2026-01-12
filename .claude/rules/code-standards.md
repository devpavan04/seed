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

- Don't modify `components/ui/*` unless necessary
- Extend via wrapper components in `components/`
- Use `asChild` + `Slot` for composition
- Always use `cn()` when accepting className prop
- For typography classes, search `typography-demo` in shadcn registry

```bash
pnpm dlx shadcn@latest add button    # Add single component
pnpm dlx shadcn@latest add -a        # Add all components
```
