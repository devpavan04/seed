"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ThemeProvider, useTheme } from "next-themes";

// =============================================================================
// Instantiation
// =============================================================================

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

// =============================================================================
// Types
// =============================================================================

interface Props {
  children: React.ReactNode;
}

// =============================================================================
// Components
// =============================================================================

function ClerkProviderWithTheme({ children }: Props) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      afterSignOutUrl="/studio"
      signInFallbackRedirectUrl="/studio/new"
      signUpFallbackRedirectUrl="/studio/new"
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

// =============================================================================
// Component
// =============================================================================

export default function Component({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProviderWithTheme>{children}</ClerkProviderWithTheme>
    </ThemeProvider>
  );
}
