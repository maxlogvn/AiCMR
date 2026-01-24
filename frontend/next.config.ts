import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
};

export default nextConfig;
