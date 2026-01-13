import { Geist, Geist_Mono } from "next/font/google";

import { SeedProvider } from "@/components/seed-provider";

import type { Metadata } from "next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SeedProvider>{children}</SeedProvider>
      </body>
    </html>
  );
}
