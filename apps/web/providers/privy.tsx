"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

if (!privyAppId) {
  // It's better not to throw during build if possible, or handle gracefully
  console.warn("Privy app ID is not defined");
}

export default function PrivyProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={privyAppId || ""}
      config={{
        loginMethods: ["email", "wallet", "google"],
        embeddedWallets: { createOnLogin: "off" },
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
      }}
    >
      {children}
    </PrivyProvider>
  );
}
