/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  turbopack: {}, // This silences the error
};

export default nextConfig;
