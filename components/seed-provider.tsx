"use client";

import { ThemeProvider, useTheme } from "next-themes";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// =============================================================================
// Types
// =============================================================================

interface SeedProviderProps {
  children: React.ReactNode;
}

// =============================================================================
// Convex Client
// =============================================================================

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

// =============================================================================
// Providers
// =============================================================================

function ClerkWithConvex({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      afterSignOutUrl="/studio"
      signInFallbackRedirectUrl="/studio/all-sketches"
      signUpFallbackRedirectUrl="/studio/all-sketches"
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

export function SeedProvider({ children }: SeedProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkWithConvex>{children}</ClerkWithConvex>
    </ThemeProvider>
  );
}
