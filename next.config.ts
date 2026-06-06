import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.shopify.com" },
      { hostname: "obs-ect.line-scdn.net" },
    ],
  },
};

export default nextConfig;
