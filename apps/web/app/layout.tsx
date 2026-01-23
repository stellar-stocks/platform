import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PrivyProviders from "@/providers/privy";
import AppStateProvider from "@/providers/recoil";

const Inter = localFont({
  src: "./fonts/inter/Inter-Regular.otf",
  variable: "--font-inter",
});

// Global SEO Configuration
export const metadata: Metadata = {
  title: {
    default: "Stellar stocks", // A default title
    template: "%s | Stellar stocks", // A template for page-specific titles
  },
  description:
    "We provide tokenized stock trading services for a seamless investment experience. we empower sub saharan africans to invest globally.", // Keep between 150-160 characters
  keywords: [
    "tokenized stocks",
    "stock trading",
    "investment",
    "sub saharan africa",
    "Latin America",
    "global investment",
    "financial services",
    "trading platform",
    "digital assets",
    "RWA",
    "NYSE",
    "NASDAQ",
    "S&P 500",
    "TSLA",
    "AAPL",
    "AMZN",
    "wealth management",
    "Crypto",
    "blockchain",
    "fintech",
    "emerging markets",
    "investment opportunities",
    "financial inclusion",
  ], // Add relevant keywords
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stellarstocks.com",
    siteName: "Stellar stocks",
    images: [
      {
        url: "https://stellarstocks.com", // Default Open Graph image for social sharing
        width: 800,
        height: 600,
        alt: "Stellar stocks Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // Twitter card type
    title: "Stellar stocks | Catchy Tagline",
    description:
      "We provide tokenized stock trading services for a seamless investment experience. we empower sub saharan africans to invest globally.",
    images: ["https://stellarstocks.com"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body className={`${Inter.className}`}>
        <AppStateProvider>
          <PrivyProviders>{children}</PrivyProviders>
        </AppStateProvider>
      </body>
    </html>
  );
}
