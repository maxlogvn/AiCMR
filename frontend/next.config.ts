import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["aicmr.local", "localhost"],
  // Fix cho streaming issues
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
