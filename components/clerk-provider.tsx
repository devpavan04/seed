"use client";

import { useTheme } from "next-themes";

import { ClerkProvider as BaseClerkProvider, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

interface ClerkProviderProps {
  children: React.ReactNode;
}

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <BaseClerkProvider
      afterSignOutUrl="/studio"
      signInFallbackRedirectUrl="/studio"
      signUpFallbackRedirectUrl="/studio"
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    >
      <ConvexProviderWrapper>{children}</ConvexProviderWrapper>
    </BaseClerkProvider>
  );
}
