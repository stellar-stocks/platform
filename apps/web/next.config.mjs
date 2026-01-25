const nextConfig = {
  // Move serverComponentsExternalPackages from experimental to top level
  serverExternalPackages: ["@scure/bip32", "@noble/hashes"],
  // Remove deprecated experimental options
  webpack: (config, { isServer, nextRuntime }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Noble hashes fix
        "@noble/hashes/_assert": false,
        // Lucide icons fix
        "lucide-react/dist/esm/icons/index.js": false,
        "lucide-react/dist/esm/icons": false,
      };
    }
    return config;
  },
  // Add empty turbopack config to silence the error
  turbopack: {},
};

export default nextConfig;
