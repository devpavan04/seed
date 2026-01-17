import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import { SeedProvider } from "@/components/seed-provider";

import type { Metadata } from "next";

import "./globals.css";

const monaSans = localFont({
  src: "./fonts/MonaSans.woff2",
  variable: "--font-mona-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seed",
  description:
    "Generative art studio that turns natural language into p5.js sketches with parameter controls, version history, and multi-format exports 🌱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${monaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <SeedProvider>{children}</SeedProvider>
      </body>
    </html>
  );
}
