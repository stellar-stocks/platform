import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PrivyProviders from "@/context/privy";
import AppStateProvider from "@/context/app-state";

// for reown wallet connection
import { headers } from "next/headers"; // added
import ReownContextProvider from "@/context/reown";
import Navbar from "@/components/navbar";
import MarketDataProvider from "@/context/market-data-provider";

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
    "We provide tokenized stock trading services for a seamless investment experience. we empower sub saharan africans to invest globally.",
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
    "Universal exchange access",
    "Bitget",
    "Binance",
    "Coinbase",
    "FTX",
    "ETFs",
    "stocks",
    "bonds",
    "mutual funds",
    "portfolio management",
    "financial technology",
    "digital trading",
    "asset management",
    "investment platform",
    "global markets",
  ],
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
    title: "Stellar stocks | Tokenized Stock Trading for Sub Saharan Africans", // Twitter title
    description:
      "We provide tokenized stock trading services for a seamless investment experience. we empower sub saharan africans to invest globally.",
    images: ["https://stellarstocks.com"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body
        className={`${Inter.className} dark h-screen w-screen overflow-hidden flex flex-col`}
      >
        <AppStateProvider>
          <MarketDataProvider>
            <ReownContextProvider cookies={cookies}>
              <Navbar />
              {children}
            </ReownContextProvider>
          </MarketDataProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
