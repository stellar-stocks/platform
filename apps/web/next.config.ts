import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  serverExternalPackages: [
    "@scure/bip32",
    "@noble/hashes",
    "@privy-io/server-auth",
    "@privy-io/react-auth",
  ],
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
        "@noble/hashes/_assert": false,
        "lucide-react": false,
        "lucide-react/dist": false,
      };
    }
    return config;
  },
};

export default nextConfig;
