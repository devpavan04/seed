import "./globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { SeedProvider } from "@/components/seed-provider";

// =============================================================================
// Fonts
// =============================================================================

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: "Seed",
  description:
    "Generative art studio that turns natural language into p5.js sketches with parameter controls, version history, and multi-format exports",
};

// =============================================================================
// Layout
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <SeedProvider>{children}</SeedProvider>
      </body>
    </html>
  );
}
