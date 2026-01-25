import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Standalone output for production/staging Docker builds
  output: 'standalone',
  // Cho phép debug overlay hoạt động qua reverse proxy
  allowedDevOrigins: ["aicmr.local", "localhost", "host.docker.internal"],
  // Fix cho streaming issues
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // React Strict Mode cho development
  reactStrictMode: true,
  // Enhanced logging cho development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Development mode optimizations
  devIndicators: {
    position: 'bottom-right',
  },
  // Enable more verbose errors
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Power by header
  poweredByHeader: false,
  // Webpack config for HMR in Docker (requires --turbopack=false)
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
};

export default nextConfig;
