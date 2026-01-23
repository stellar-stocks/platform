const nextConfig = {
  // Force pnpm overrides to work during resolution
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["@scure/bip32", "@noble/hashes"],
  },
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Noble hashes fix (your first error)
        "@noble/hashes/_assert": false,
        // Lucide icons fix (this error)
        "lucide-react/dist/esm/icons/index.js": false,
        "lucide-react/dist/esm/icons": false,
      };
    }
    return config;
  },
};

export default nextConfig;
