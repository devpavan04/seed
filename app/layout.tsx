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
    "Turn prompts into shippable p5.js sketches with deterministic outputs, parameter controls, and exports.",
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
