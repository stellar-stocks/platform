"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import type { ReactNode, ReactElement } from "react";

interface PrivyProvidersProps {
  children: ReactNode;
}

export default function PrivyProviders({
  children,
}: PrivyProvidersProps): ReactElement {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

  if (!appId) {
    // Graceful fallback during build (won't crash)
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "wallet", "google"],
        embeddedWallets: {
          createOnLogin: "off", // Users must opt-in
        },
        supportedChains: [
          {
            id: 1,
            name: "Ethereum",
            network: "ethereum",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: {
              default: { http: ["https://cloudflare-eth.com"] },
              public: { http: ["https://cloudflare-eth.com"] },
            },
          },
        ],
        appearance: {
          theme: "dark",
          accentColor: "#10b981", // Emerald green for trust
          logo: "/logo.svg",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
