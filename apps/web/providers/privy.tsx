"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

if (!privyAppId) {
  throw new Error("Privy app ID is not defined");
}

if (!privyAppSecret) {
  throw new Error("Privy app secret is not defined");
}

export default function PrivyProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={privyAppId!}
      clientId={privyAppSecret!}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
