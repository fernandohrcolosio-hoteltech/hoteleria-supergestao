import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cspNonce: false,
  },
};

export default nextConfig;
