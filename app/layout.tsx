import "./globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import Provider from "@/components/provider";

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
    "Seed turns natural language into p5.js sketches you can shape with live controls and export 🌱",
};

// =============================================================================
// Layout
// =============================================================================

export default function Layout({
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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
